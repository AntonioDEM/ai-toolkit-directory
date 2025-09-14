#!/bin/bash

# Script cross-platform per gestione workflow Netlify
# Compatibile macOS e Windows (Git Bash/WSL)
# MODIFICHE: Aggiunta funzionalità di cleanup automatico porta 3999

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
# FUNZIONE NUOVA: Cleanup porta 3999 (prevenzione conflitti Netlify Dev)
# =============================================================================
cleanup_port() {
    echo -e "${YELLOW}🧹 Pulizia processi sulla porta 3999...${NC}"
    
    local port=3999
    local cleaned=false
    
    # macOS/Linux con lsof
    if command -v lsof >/dev/null 2>&1; then
        if lsof -ti:$port >/dev/null 2>&1; then
            echo -e "${YELLOW}🛑 Terminando processo esistente (macOS/Linux)...${NC}"
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

# Funzione per verificare esistenza directory
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

# Funzione per creare backup
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
    
    # Copia usando comando cross-platform
    if command -v rsync >/dev/null 2>&1; then
        rsync -av --exclude=node_modules --exclude=.netlify --exclude=.git "$REPOTEST_DIR/" "$BACKUP_PATH/"
    else
        # Fallback per Windows senza rsync
        mkdir -p "$BACKUP_PATH"
        if [[ "$OSTYPE" == "msys" ]] || [[ "$OSTYPE" == "win32" ]]; then
            # Windows
            robocopy "$REPOTEST_DIR" "$BACKUP_PATH" /E /XD node_modules .netlify .git /NFL /NDL /NJH /NJS /nc /ns /np
        else
            # macOS/Linux fallback
            cp -r "$REPOTEST_DIR/." "$BACKUP_PATH/"
        fi
    fi
    
    echo -e "${GREEN}✅ Backup creato in: $BACKUP_PATH${NC}"
}

# =============================================================================
# MODIFICA: Funzione start_testing ora include cleanup automatico
# =============================================================================
start_testing() {
    echo -e "${BLUE}🚀 Avviando ambiente di testing per $PROJECT_NAME...${NC}"
    
    cd "$REPOTEST_DIR" || exit 1
    
    # NUOVO: Cleanup automatico prima di avviare Netlify Dev
    cleanup_port
    
    # Controlla se esiste package.json
    if [ ! -f "package.json" ]; then
        echo -e "${YELLOW}⚠️ package.json non trovato. Inizializzando...${NC}"
        npm init -y
    fi
    
    # Installa dipendenze se non esistono
    if [ ! -d "node_modules" ]; then
        echo -e "${BLUE}📦 Installando dipendenze...${NC}"
        npm install
    fi
    
    # Attiva ambiente conda se esiste
    if command -v conda >/dev/null 2>&1; then
        # Su Windows potrebbe servire un approccio diverso
        if [[ "$OSTYPE" == "msys" ]] || [[ "$OSTYPE" == "win32" ]]; then
            echo -e "${YELLOW}⚠️ Su Windows, assicurati di avere attivato manualmente l'ambiente conda${NC}"
        else
            eval "$(conda shell.bash hook)"
            conda activate netlify-test 2>/dev/null || echo -e "${YELLOW}⚠️ Ambiente conda netlify-test non trovato${NC}"
        fi
    fi
    
    echo -e "${GREEN}🌐 Avviando Netlify Dev...${NC}"
    netlify dev
}

# =============================================================================
# NUOVA FUNZIONE: Avvio con cleanup esplicito (comando separato)
# =============================================================================
start_clean_dev() {
    echo -e "${BLUE}🧹🚀 Avvio Netlify Dev con pulizia approfondita...${NC}"
    
    cd "$REPOTEST_DIR" || exit 1
    
    # Cleanup più aggressivo
    echo -e "${YELLOW}🔄 Pulizia approfondita in corso...${NC}"
    cleanup_port
    
    # Pulizia aggiuntiva cache Netlify
    if [ -d ".netlify" ]; then
        echo -e "${YELLOW}🧹 Pulizia cache Netlify...${NC}"
        rm -rf .netlify/cache 2>/dev/null
    fi
    
    # Riavvio pulito
    start_testing
}

# Funzione per deploy di preview
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

# Funzione per sincronizzare con GitHub repo
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
            "$REPOTEST_DIR/" "$GITHUB_DIR/"
    else
        # Fallback per Windows
        if [[ "$OSTYPE" == "msys" ]] || [[ "$OSTYPE" == "win32" ]]; then
            robocopy "$REPOTEST_DIR" "$GITHUB_DIR" /E /XD node_modules .netlify .git dist build /NFL /NDL /NJH /NJS /nc /ns /np
        else
            echo -e "${YELLOW}⚠️ Usando cp come fallback...${NC}"
            # Rimuovi e ricrea directory di destinazione
            rm -rf "$GITHUB_DIR"
            mkdir -p "$GITHUB_DIR"
            cp -r "$REPOTEST_DIR/." "$GITHUB_DIR/"
            # Rimuovi cartelle escluse
            rm -rf "$GITHUB_DIR/node_modules" "$GITHUB_DIR/.netlify" "$GITHUB_DIR/dist" "$GITHUB_DIR/build"
        fi
    fi
    
    echo -e "${GREEN}✅ Sincronizzazione completata!${NC}"
    echo -e "${YELLOW}📝 Ora puoi fare commit e push dalla cartella:${NC}"
    echo -e "${BLUE}$GITHUB_DIR${NC}"
}

# Funzione per mostrare status
show_status() {
    echo -e "${BLUE}=== 📊 STATUS DEL PROGETTO $PROJECT_NAME ===${NC}"
    echo -e "REPOTEST: $REPOTEST_DIR"
    echo -e "GITHUB:   $GITHUB_DIR"
    echo -e "BACKUP:   $BACKUP_DIR"
    echo ""
    
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
    
    # NUOVO: Controlla processi sulla porta 3999
    echo -e "${BLUE}---${NC}"
    echo -e "${YELLOW}🔍 Controllo processi porta 3999...${NC}"
    cleanup_port
}

# Funzione per setup iniziale
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
        start_testing  # Ora include cleanup automatico
        ;;
    "clean-dev")  # NUOVO COMANDO: Cleanup approfondito
        start_clean_dev
        ;;
    "preview")
        preview_deploy
        ;;
    "sync")
        sync_to_github
        ;;
    "status")
        show_status    # Ora include controllo porta
        ;;
    *)
        echo -e "${BLUE}=== 🚀 GESTIONE WORKFLOW NETLIFY - $PROJECT_NAME ===${NC}"
        echo ""
        echo "Uso: $0 {setup|backup|test|clean-dev|preview|sync|status}"
        echo ""
        echo -e "${GREEN}📋 Comandi disponibili:${NC}"
        echo "  setup     - Setup iniziale del progetto"
        echo "  backup    - Crea backup della versione corrente"
        echo "  test      - Avvia server di test locale (netlify dev) → INCLUDE CLEANUP AUTOMATICO"
        echo "  clean-dev - Avvio con pulizia approfondita (cache+porta)"
        echo "  preview   - Crea deploy di preview su Netlify"
        echo "  sync      - Sincronizza REPOTEST → REPOGITH"
        echo "  status    - Mostra stato dell'ambiente + controllo porta"
        echo ""
        echo -e "${BLUE}📁 Percorsi:${NC}"
        echo "  REPOTEST: $REPOTEST_DIR"
        echo "  GITHUB:   $GITHUB_DIR"
        echo "  BACKUP:   $BACKUP_DIR"
        echo ""
        echo -e "${YELLOW}💡 Novità: Cleanup automatico porta 3999 per prevenire conflitti Netlify Dev${NC}"
        ;;
esac