#!/bin/bash

# Script cross-platform per gestione workflow Netlify
# Compatibile macOS e Windows (Git Bash/WSL)
# AGGIORNATO con funzionalità avanzate da banana-workflow.sh

# Percorsi del progetto
PROJECT_NAME="ai-toolkit-directory"

# Rileva il sistema operativo
if [[ "$OSTYPE" == "msys" ]] || [[ "$OSTYPE" == "win32" ]] || [[ -n "$WINDIR" ]]; then
    # Windows (Git Bash)
    USER_HOME="/c/Users/$USERNAME"
    REPOTEST_DIR="$USER_HOME/Documents/REPOTEST/$PROJECT_NAME"
    GITHUB_DIR="$USER_HOME/Documents/REPOGITH/$PROJECT_NAME"
    BACKUP_DIR="$USER_HOME/Documents/BACKUP/$PROJECT_NAME"
else
    # macOS/Linux
    USER_HOME="$HOME"
    REPOTEST_DIR="$USER_HOME/Documents/REPOTEST/$PROJECT_NAME"
    GITHUB_DIR="$USER_HOME/Documents/REPOGITH/$PROJECT_NAME"
    BACKUP_DIR="$USER_HOME/Documents/BACKUP/$PROJECT_NAME"
fi

# Colori per output (compatibili con terminali Windows)
if command -v tput >/dev/null 2>&1; then
    GREEN=$(tput setaf 2)
    BLUE=$(tput setaf 4)
    YELLOW=$(tput setaf 3)
    RED=$(tput setaf 1)
    NC=$(tput sgr0)
else
    GREEN=''
    BLUE=''
    YELLOW=''
    RED=''
    NC=''
fi

# =============================================================================
# FUNZIONE MIGLIORATA: Cleanup porta (supporto multi-piattaforma e multi-porta)
# =============================================================================
cleanup_port() {
    local port=$1
    echo -e "${YELLOW}🧹 Pulizia processi sulla porta $port...${NC}"

    local cleaned=false

    # macOS/Linux con lsof
    if command -v lsof >/dev/null 2>&1; then
        if lsof -ti:$port >/dev/null 2>&1; then
            echo -e "${YELLOW}🛑 Terminando processo esistente sulla porta $port...${NC}"
            kill -9 $(lsof -ti:$port) 2>/dev/null
            cleaned=true
            sleep 2
        fi
    fi

    # Windows con netstat (Git Bash)
    if command -v netstat >/dev/null 2>&1 && [[ "$OSTYPE" == "msys"* ]]; then
        PID=$(netstat -ano | grep ":$port" | awk '{print $5}' | head -1)
        if [ ! -z "$PID" ]; then
            echo -e "${YELLOW}🛑 Terminando processo Windows PID: $PID...${NC}"
            taskkill /F /PID $PID 2>/dev/null
            cleaned=true
            sleep 2
        fi
    fi

    # Windows alternative con PowerShell
    if [[ "$OSTYPE" == "msys"* ]] && command -v powershell >/dev/null 2>&1; then
        powershell -Command "
            \$process = Get-NetTCPConnection -LocalPort $port -ErrorAction SilentlyContinue | 
                       Select-Object -ExpandProperty OwningProcess -First 1;
            if (\$process) { 
                Stop-Process -Id \$process -Force -ErrorAction SilentlyContinue;
                Write-Host 'Processo Windows terminato';
            }
        " 2>/dev/null && cleaned=true
    fi

    if [ "$cleaned" = true ]; then
        echo -e "${GREEN}✅ Pulizia porta $port completata${NC}"
    else
        echo -e "${GREEN}✅ Nessun processo attivo sulla porta $port${NC}"
    fi
}

# =============================================================================
# NUOVA FUNZIONE: Cleanup multiple porte comuni per sviluppo web
# =============================================================================
cleanup_dev_ports() {
    echo -e "${BLUE}🧹 Pulizia porte di sviluppo comuni...${NC}"

    # Porte comuni per sviluppo (incluse quelle Netlify)
    local ports=(3000 3001 3002 3003 3999 4000 4001 5000 5001 8000 8080 8081 9000)

    for port in "${ports[@]}"; do
        cleanup_port $port
    done

    echo -e "${GREEN}✅ Pulizia porte di sviluppo completata${NC}"
}

# =============================================================================
# FUNZIONE MIGLIORATA: Creazione backup con più esclusioni
# =============================================================================
create_backup() {
    echo -e "${BLUE}📦 Creando backup del progetto $PROJECT_NAME...${NC}"

    # Crea timestamp cross-platform
    if command -v date >/dev/null 2>&1; then
        TIMESTAMP=$(date +%Y%m%d-%H%M%S)
    else
        TIMESTAMP=$(date +%Y%m%d-%H%M%S)
    fi

    # Crea directory backup se non esiste
    mkdir -p "$BACKUP_DIR"

    BACKUP_PATH="$BACKUP_DIR/backup-$TIMESTAMP"

    # Copia usando comando cross-platform con più esclusioni
    if command -v rsync >/dev/null 2>&1; then
        rsync -av \
            --exclude=node_modules \
            --exclude=.netlify \
            --exclude=.git \
            --exclude=__pycache__ \
            --exclude=venv \
            --exclude=.env \
            --exclude=dist \
            --exclude=build \
            "$REPOTEST_DIR/" "$BACKUP_PATH/"
    else
        # Fallback per Windows senza rsync
        mkdir -p "$BACKUP_PATH"
        if [[ "$OSTYPE" == "msys" ]] || [[ "$OSTYPE" == "win32" ]]; then
            # Windows con robocopy
            robocopy "$REPOTEST_DIR" "$BACKUP_PATH" /E \
                /XD node_modules .netlify .git __pycache__ venv dist build \
                /XF .env \
                /NFL /NDL /NJH /NJS /nc /ns /np
        else
            # macOS/Linux fallback
            cp -r "$REPOTEST_DIR/." "$BACKUP_PATH/"
            # Rimuovi cartelle escluse
            rm -rf "$BACKUP_PATH/node_modules" 2>/dev/null
            rm -rf "$BACKUP_PATH/.netlify" 2>/dev/null
            rm -rf "$BACKUP_PATH/__pycache__" 2>/dev/null
            rm -rf "$BACKUP_PATH/venv" 2>/dev/null
            rm -rf "$BACKUP_PATH/dist" 2>/dev/null
            rm -rf "$BACKUP_PATH/build" 2>/dev/null
            rm -f "$BACKUP_PATH/.env" 2>/dev/null
        fi
    fi

    echo -e "${GREEN}✅ Backup creato in: $BACKUP_PATH${NC}"
}

# =============================================================================
# FUNZIONE MIGLIORATA: Avvio testing con rilevamento automatico progetto
# =============================================================================
start_testing() {
    echo -e "${BLUE}🚀 Avviando ambiente di testing per $PROJECT_NAME...${NC}"

    cd "$REPOTEST_DIR" || exit 1

    # Cleanup porte prima di avviare
    cleanup_dev_ports

    # Controlla se è un progetto Node.js
    if [ -f "package.json" ]; then
        echo -e "${GREEN}📦 Progetto Node.js rilevato${NC}"

        # Installa dipendenze se non esistono
        if [ ! -d "node_modules" ]; then
            echo -e "${BLUE}📦 Installando dipendenze...${NC}"
            npm install
        fi

        # Avvia Netlify Dev o altri script disponibili
        if grep -q '"dev"' package.json 2>/dev/null; then
            echo -e "${GREEN}🌐 Avviando script dev...${NC}"
            npm run dev
        elif command -v netlify >/dev/null 2>&1; then
            echo -e "${GREEN}🌐 Avviando Netlify Dev...${NC}"
            netlify dev
        elif grep -q '"start"' package.json 2>/dev/null; then
            echo -e "${GREEN}🌐 Avviando server...${NC}"
            npm start
        else
            echo -e "${YELLOW}⚠️ Nessuno script di avvio trovato in package.json${NC}"
            echo -e "${YELLOW}💡 Provo con Netlify Dev...${NC}"
            netlify dev
        fi
    else
        echo -e "${YELLOW}ℹ️  Non è un progetto Node.js, avvio Netlify Dev...${NC}"
        netlify dev
    fi
}

# =============================================================================
# NUOVA FUNZIONE: Mostra status dettagliato
# =============================================================================
show_status() {
    echo -e "${BLUE}=== 📊 STATUS DEL PROGETTO $PROJECT_NAME ===${NC}"
    echo -e "REPOTEST: $REPOTEST_DIR"
    echo -e "GITHUB:   $GITHUB_DIR"
    echo -e "BACKUP:   $BACKUP_DIR"
    echo ""

    # Controlla se la directory REPOTEST esiste
    if [ -d "$REPOTEST_DIR" ]; then
        echo -e "${GREEN}✅ Directory REPOTEST trovata${NC}"

        # Dimensione del progetto
        if command -v du >/dev/null 2>&1; then
            PROJECT_SIZE=$(du -sh "$REPOTEST_DIR" 2>/dev/null | cut -f1)
            echo -e "Dimensione: $PROJECT_SIZE"
        fi
    else
        echo -e "${RED}❌ Directory REPOTEST non trovata${NC}"
    fi

    # Controlla directory backup
    if [ -d "$BACKUP_DIR" ]; then
        BACKUP_COUNT=$(find "$BACKUP_DIR" -maxdepth 1 -type d -name "backup-*" 2>/dev/null | wc -l)
        echo -e "${GREEN}✅ Directory backup trovata ($BACKUP_COUNT backup)${NC}"
    else
        echo -e "${YELLOW}⚠️ Directory backup non trovata${NC}"
    fi

    # Controlla Netlify CLI
    if command -v netlify >/dev/null 2>&1; then
        echo -e "${GREEN}✅ Netlify CLI installato${NC}"
        netlify --version
    else
        echo -e "${RED}❌ Netlify CLI non trovato${NC}"
        echo -e "${YELLOW}📦 Installa con: npm install -g netlify-cli${NC}"
    fi

    # Controlla Node.js
    if command -v node >/dev/null 2>&1; then
        echo -e "${GREEN}✅ Node.js: $(node --version)${NC}"
    else
        echo -e "${RED}❌ Node.js non trovato${NC}"
    fi

    # Controlla npm
    if command -v npm >/dev/null 2>&1; then
        echo -e "${GREEN}✅ npm: $(npm --version)${NC}"
    else
        echo -e "${RED}❌ npm non trovato${NC}"
    fi

    # Controlla processi sulle porte comuni
    echo -e "${BLUE}---${NC}"
    echo -e "${YELLOW}🔍 Controllo processi sulle porte di sviluppo...${NC}"

    local ports=(3000 3999 5000 8000 8080)
    for port in "${ports[@]}"; do
        if command -v lsof >/dev/null 2>&1; then
            if lsof -ti:$port >/dev/null 2>&1; then
                echo -e "${RED}❌ Porta $port: occupata da processo $(lsof -ti:$port | head -1)${NC}"
            else
                echo -e "${GREEN}✅ Porta $port: libera${NC}"
            fi
        elif [[ "$OSTYPE" == "msys"* ]] && command -v netstat >/dev/null 2>&1; then
            # Windows fallback
            if netstat -ano | grep ":$port" >/dev/null 2>&1; then
                PID=$(netstat -ano | grep ":$port" | awk '{print $5}' | head -1)
                echo -e "${RED}❌ Porta $port: occupata da processo Windows PID: $PID${NC}"
            else
                echo -e "${GREEN}✅ Porta $port: libera${NC}"
            fi
        else
            echo -e "${YELLOW}⚠️ Impossibile verificare porta $port (lsof/netstat non disponibile)${NC}"
        fi
    done
}

# =============================================================================
# FUNZIONE: Avvio con cleanup esplicito (comando separato)
# =============================================================================
start_clean_dev() {
    echo -e "${BLUE}🧹🚀 Avvio Netlify Dev con pulizia approfondita...${NC}"

    cd "$REPOTEST_DIR" || exit 1

    # Cleanup più aggressivo
    echo -e "${YELLOW}🔄 Pulizia approfondita in corso...${NC}"
    cleanup_dev_ports

    # Pulizia aggiuntiva cache Netlify
    if [ -d ".netlify" ]; then
        echo -e "${YELLOW}🧹 Pulizia cache Netlify...${NC}"
        rm -rf .netlify/cache 2>/dev/null
    fi

    # Riavvio pulito
    start_testing
}

# =============================================================================
# FUNZIONE: Deploy di preview
# =============================================================================
preview_deploy() {
    echo -e "${BLUE}🌍 Creando deploy di preview per $PROJECT_NAME...${NC}"

    cd "$REPOTEST_DIR" || exit 1

    # Build del progetto se esiste script build
    if grep -q '"build"' package.json 2>/dev/null; then
        echo -e "${BLUE}🔨 Eseguendo build...${NC}"
        npm run build
    fi

    # Deploy di preview
    netlify deploy
}

# =============================================================================
# FUNZIONE: Sincronizza con GitHub repo
# =============================================================================
sync_to_github() {
    echo -e "${BLUE}🔄 Sincronizzando $PROJECT_NAME con GitHub repo...${NC}"
    echo -e "${RED}⛔ ATTENZIONE: Questa operazione sovrascriverà il contenuto in:${NC}"
    echo -e "${YELLOW}$GITHUB_DIR${NC}"
    echo ""
    echo -e "${YELLOW}❓ Vuoi continuare? (y/N)${NC}"
    read -r response

    if [[ ! "$response" =~ ^[Yy]$ ]]; then
        echo -e "${GREEN}✅ Operazione annullata.${NC}"
        return
    fi

    # Crea backup prima della sincronizzazione
    create_backup

    # Backup anche della directory GitHub prima di sovrascrivere
    echo -e "${BLUE}📦 Creando backup della directory GitHub corrente...${NC}"
    TIMESTAMP=$(date +%Y%m%d-%H%M%S)
    GITHUB_BACKUP="$BACKUP_DIR/github-backup-$TIMESTAMP"

    if command -v rsync >/dev/null 2>&1; then
        rsync -av "$GITHUB_DIR/" "$GITHUB_BACKUP/"
    else
        mkdir -p "$GITHUB_BACKUP"
        if [[ "$OSTYPE" == "msys" ]] || [[ "$OSTYPE" == "win32" ]]; then
            robocopy "$GITHUB_DIR" "$GITHUB_BACKUP" /E /NFL /NDL /NJH /NJS /nc /ns /np
        else
            cp -r "$GITHUB_DIR/." "$GITHUB_BACKUP/"
        fi
    fi
    echo -e "${GREEN}✅ Backup GitHub salvato in: $GITHUB_BACKUP${NC}"

    # Ora sincronizza escludendo cartelle specifiche
    if command -v rsync >/dev/null 2>&1; then
        rsync -av \
            --exclude=node_modules \
            --exclude=.netlify \
            --exclude=.git \
            --exclude=dist \
            --exclude=build \
            --exclude=__pycache__ \
            --exclude=venv \
            --exclude=.env \
            "$REPOTEST_DIR/" "$GITHUB_DIR/"
    else
        # Fallback per Windows
        if [[ "$OSTYPE" == "msys" ]] || [[ "$OSTYPE" == "win32" ]]; then
            robocopy "$REPOTEST_DIR" "$GITHUB_DIR" /E \
                /XD node_modules .netlify .git dist build __pycache__ venv \
                /XF .env \
                /NFL /NDL /NJH /NJS /nc /ns /np
        else
            echo -e "${YELLOW}⚠️ Usando cp come fallback...${NC}"
            # Rimuovi e ricrea directory di destinazione
            rm -rf "$GITHUB_DIR"
            mkdir -p "$GITHUB_DIR"
            cp -r "$REPOTEST_DIR/." "$GITHUB_DIR/"
            # Rimuovi cartelle escluse
            rm -rf "$GITHUB_DIR/node_modules" "$GITHUB_DIR/.netlify" \
                   "$GITHUB_DIR/dist" "$GITHUB_DIR/build" \
                   "$GITHUB_DIR/__pycache__" "$GITHUB_DIR/venv"
            rm -f "$GITHUB_DIR/.env" 2>/dev/null
        fi
    fi

    echo -e "${GREEN}✅ Sincronizzazione completata!${NC}"
    echo -e "${YELLOW}📝 Ora puoi fare commit e push dalla cartella:${NC}"
    echo -e "${BLUE}$GITHUB_DIR${NC}"
}

# =============================================================================
# FUNZIONE: Setup iniziale
# =============================================================================
setup() {
    echo -e "${BLUE}=== ⚙️ SETUP INIZIALE ===${NC}"

    # Crea directory se non esistono
    mkdir -p "$BACKUP_DIR"

    # Vai alla directory REPOTEST
    cd "$REPOTEST_DIR" || exit 1

    # Controlla se package.json esiste già
    if [ -f "package.json" ]; then
        echo -e "${GREEN}✅ package.json già esistente, non modificato${NC}"
    else
        echo -e "${YELLOW}⚠️ package.json non trovato. Vuoi crearlo? (y/N)${NC}"
        read -r response
        if [[ "$response" =~ ^[Yy]$ ]]; then
            echo -e "${BLUE}📝 Inizializzando package.json...${NC}"
            npm init -y

            # Aggiungi script utili
            npm pkg set scripts.dev="netlify dev"
            npm pkg set scripts.build="echo 'Configura il tuo comando di build'"
            npm pkg set scripts.preview="netlify serve"
        fi
    fi

    # Installa Netlify CLI se non presente
    if ! command -v netlify >/dev/null 2>&1; then
        echo -e "${YELLOW}⚠️ Netlify CLI non trovato. Vuoi installarlo? (y/N)${NC}"
        read -r response
        if [[ "$response" =~ ^[Yy]$ ]]; then
            echo -e "${BLUE}📦 Installando Netlify CLI...${NC}"
            npm install -g netlify-cli
        fi
    else
        echo -e "${GREEN}✅ Netlify CLI già installato${NC}"
    fi

    echo -e "${GREEN}🎉 Setup completato!${NC}"
}

# Verifica directory prima di procedere
check_directories() {
    if [ ! -d "$REPOTEST_DIR" ]; then
        echo -e "${RED}Errore: Directory REPOTEST non trovata: $REPOTEST_DIR${NC}"
        exit 1
    fi

    if [ ! -d "$GITHUB_DIR" ]; then
        echo -e "${RED}Errore: Directory GITHUB non trovata: $GITHUB_DIR${NC}"
        exit 1
    fi
}

check_directories

# Menu principale
case "$1" in
    "setup")
        setup
        ;;
    "backup")
        create_backup
        ;;
    "test")
        start_testing
        ;;
    "clean-dev")
        start_clean_dev
        ;;
    "preview")
        preview_deploy
        ;;
    "sync")
        sync_to_github
        ;;
    "status")
        show_status
        ;;
    "cleanup")
        if [ -n "$2" ]; then
            cleanup_port $2
        else
            cleanup_dev_ports
        fi
        ;;
    *)
        echo -e "${BLUE}=== 🚀 GESTIONE WORKFLOW NETLIFY - $PROJECT_NAME ===${NC}"
        echo ""
        echo "Uso: $0 {setup|backup|test|clean-dev|preview|sync|status|cleanup [porta]}"
        echo ""
        echo -e "${GREEN}📋 Comandi disponibili:${NC}"
        echo "  setup           - Setup iniziale del progetto"
        echo "  backup          - Crea backup della versione corrente"
        echo "  test            - Avvia server di test locale (rilevamento automatico)"
        echo "  clean-dev       - Avvio con pulizia approfondita (cache+porte)"
        echo "  preview         - Crea deploy di preview su Netlify"
        echo "  sync            - Sincronizza REPOTEST → REPOGITH"
        echo "  status          - Mostra stato dettagliato dell'ambiente"
        echo "  cleanup [porta] - Pulizia processi su tutte le porte o porta specifica"
        echo ""
        echo -e "${BLUE}📁 Percorsi:${NC}"
        echo "  REPOTEST: $REPOTEST_DIR"
        echo "  GITHUB:   $GITHUB_DIR"
        echo "  BACKUP:   $BACKUP_DIR"
        echo ""
        echo -e "${YELLOW}✨ Novità: Rilevamento automatico progetto, pulizia multi-porta, status dettagliato${NC}"
        ;;
esac