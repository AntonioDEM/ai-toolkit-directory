# Guida Completa Workflow Netlify

## Gestione Progetto ai-toolkit-directory

Questa guida ti aiuta a gestire il workflow di sviluppo e deploy del progetto `ai-toolkit-directory` con Netlify, utilizzando un ambiente di testing separato e isolato con Miniconda prima del deploy su GitHub.

[Vai alle nuove funzionalità](#-nuove-funzionalità-implementate)

## 🛠️ Creazione dello Script netlify-workflow.sh 

### Creazione del File Script per Sistema Operativo 

#### macOS e Linux 

~~~bash
```bash 
cd ~ # Naviga nella directory home 
touch netlify-workflow.sh # Crea il file script vuoto
nano netlify-workflow.sh # Apri il file con l'editor nano 
code netlify-workflow.sh # OPPURE con Visual Studio Code (se installato)
vim netlify-workflow.sh  # OPPURE con vim


~~~

Dopo aver aperto l'editor, incolla il contenuto completo dello script netlify-workflow.sh, salva e chiudi:

- **Nano**: `Ctrl+X`, poi `Y`, poi `Enter`
- **Vim**: `Esc`, poi `:wq`, poi `Enter`
- **VS Code**: `Cmd+S` (Mac) o `Ctrl+S` (Linux), poi chiudi

#### Windows (PowerShell)

```powershell
# Naviga nella directory home
cd $env:USERPROFILE

# Crea il file script vuoto
New-Item -ItemType File -Name "netlify-workflow.sh"

# Apri con Notepad
notepad netlify-workflow.sh

# OPPURE con Visual Studio Code (se installato)
code netlify-workflow.sh
```

#### Windows (Git Bash/WSL)

```bash
# Naviga nella directory home
cd ~

# Crea il file script vuoto
touch netlify-workflow.sh

# Apri con editor predefinito
nano netlify-workflow.sh

# OPPURE con Visual Studio Code
code netlify-workflow.sh
```

### Verifica della Creazione

Dopo aver creato e salvato il file, verifica che sia presente:

```bash
# Controlla che il file esista e visualizza i dettagli
ls -la ~/netlify-workflow.sh

# Rendi il file eseguibile (macOS/Linux/WSL)
chmod +x ~/netlify-workflow.sh

# Verifica i permessi (dovrebbe mostrare -rwxr-xr-x)
ls -la ~/netlify-workflow.sh

# Test rapido (dovrebbe mostrare il menu di aiuto)
~/netlify-workflow.sh --help
```

> **Nota per Windows:** Su Windows puro (senza WSL), potresti dover eseguire lo script tramite Git Bash o WSL. In PowerShell nativo, usa `bash ~/netlify-workflow.sh` invece di `~/netlify-workflow.sh`.

### Posizionamento Alternativo (Se necessario)

Se preferisci posizionare lo script in una cartella specifica del progetto:

```bash
# Crea lo script nella cartella del progetto
cd ~/Documents/REPOTEST/ai-toolkit-directory
touch netlify-workflow.sh
chmod +x netlify-workflow.sh

# In questo caso, richiama lo script con:
./netlify-workflow.sh status
```



## 📁 Struttura del Progetto

```
~/Documents/
├── REPOTEST/ai-toolkit-directory/    # Ambiente di sviluppo e testing
├── REPOGITH/ai-toolkit-directory/    # Repository GitHub (produzione)
└── BACKUP-MANUALE/                   # Backup manuali di sicurezza

~/
└── netlify-workflow.sh               # Script di gestione workflow
```

------

## 🚀 Setup Completo dell'Ambiente

### 1. Posizionamento dello Script

Lo script `netlify-workflow.sh` deve essere posizionato nella directory principale:

```bash
# Il file deve essere qui:
/Users/tony/netlify-workflow.sh

# Se hai creato il file altrove, spostalo:
mv /percorso/attuale/netlify-workflow.sh ~/netlify-workflow.sh

# Rendilo eseguibile
chmod +x ~/netlify-workflow.sh

# Testa che funzioni
~/netlify-workflow.sh status
```

> **NOTA:** Quando si dà il comando `~/netlify-workflow.sh status` potrebbe chiedere di installare la CLI. Non installare, passare al punto 2 e successivamente al punto 3 (se si usa conda o miniconda), creare l'env dedicato e andare avanti.

### 2. Backup di Sicurezza (OBBLIGATORIO)

Prima di iniziare qualsiasi operazione, crea sempre un backup manuale:

```bash
# Crea la directory di backup
mkdir -p ~/Documents/BACKUP-MANUALE

# Backup dei progetti esistenti
cp -r ~/Documents/REPOGITH/ai-toolkit-directory ~/Documents/BACKUP-MANUALE/GITHUB-ai-toolkit-directory-$(date +%Y%m%d)
cp -r ~/Documents/REPOTEST/ai-toolkit-directory ~/Documents/BACKUP-MANUALE/REPOTEST-ai-toolkit-directory-$(date +%Y%m%d)

# Verifica che i backup siano stati creati
ls -la ~/Documents/BACKUP-MANUALE/
```

### 3. Setup Ambiente Miniconda

#### Disinstalla Netlify CLI globale (se presente)

Per evitare conflitti e risparmiare spazio:

```bash
# Disinstalla la versione globale npm
npm uninstall -g netlify-cli

# Verifica che sia stato rimosso
which netlify
# Dovrebbe restituire "command not found"
```

#### Crea ambiente conda dedicato

```bash
# Crea ambiente isolato
conda create -n netlify-test

# Attiva l'ambiente
conda activate netlify-test

# Installa le dipendenze necessarie
npm install -g netlify-cli

# Quando chiede conferma, rispondi 'y'
```

#### Verifica l'ambiente

```bash
# Verifica le versioni installate
node --version
npm --version
netlify --version

# Verifica che lo script riconosca l'ambiente
~/netlify-workflow.sh status
```

### 4. Setup del Progetto

Esegui il setup iniziale (interattivo, ti chiede conferma):

```bash
# Assicurati che l'ambiente conda sia attivo
conda activate netlify-test

# Esegui il setup
~/netlify-workflow.sh setup
```

Questo comando:

- Crea la directory di backup automatico
- Ti chiede se vuoi creare/modificare package.json (se non esiste)
- Ti chiede se vuoi installare Netlify CLI (dovrebbe dire già installato)
- Non sovrascrive mai file esistenti

------

## 📊 Confronto delle Opzioni

| Opzione                             | Vantaggi                                  | Svantaggi             |
| ----------------------------------- | ----------------------------------------- | --------------------- |
| Script separato                     | ✅ Isolato, semplice                       | ❌ Duplicazione codice |
| Package.json scripts                | ✅ Facile da avviare                       | ❌ Poco flessibile     |
| Integrazione in netlify-workflow.sh | ✅ Centralizzato, cross-platform, completo | ❌ Richiede modifica   |

## 🏆 Perché questa è la Soluzione Migliore

- ✅ **Tutto in uno** - Un unico script per tutto il workflow
- ✅ **Cleanup automatico** - Previene conflitti di porta 3999 automaticamente
- ✅ **Cross-platform** - Funziona su macOS, Linux e Windows
- ✅ **Backup integrato** - Sicurezza prima delle operazioni critiche
- ✅ **User experience** - Menu chiaro con emoji e colori
- ✅ **Manutenibilità** - Tutto il codice in un posto solo

## 🎯 Modo d'Uso

```bash
# Setup iniziale
./netlify-workflow.sh setup

# Avvio normale (CON CLEANUP AUTOMATICO)
./netlify-workflow.sh test

# Avvio con pulizia approfondita
./netlify-workflow.sh clean-dev

# Backup
./netlify-workflow.sh backup

# Sincronizza con GitHub
./netlify-workflow.sh sync

# Controlla stato (include verifica porta)
./netlify-workflow.sh status
```

## 🚀 Vantaggi rispetto alle Altre Opzioni

- Nessun file aggiuntivo da gestire
- Cleanup automatico trasparente per l'utente
- Doppia strategia: cleanup normale + approfondito
- Controllo stato include verifica porta
- Completamente integrato nel workflow esistente

------

## 🔄 Workflow di Sviluppo

### Preparazione Sessione di Lavoro

Ogni volta che inizi a lavorare sul progetto:

```bash
# 1. Attiva l'ambiente conda
conda activate netlify-test

# 2. Verifica lo stato
~/netlify-workflow.sh status
```

### 1. Creare Backup Prima delle Modifiche

Prima di iniziare modifiche importanti:

```bash
~/netlify-workflow.sh backup
```

Questo crea un backup timestampato della versione corrente in `~/Documents/BACKUP/ai-toolkit-directory/backup-YYYYMMDD-HHMMSS/`

### 2. Sviluppo e Testing Locale

Lavora nella cartella REPOTEST e testa le modifiche:

```bash
# Avvia il server de testing locale (CON CLEANUP AUTOMATICO)
~/netlify-workflow.sh test
```

> **NOVITÀ:** Ora include automaticamente il cleanup della porta 3999 per prevenire conflitti!

Questo comando:

- Pulisce automaticamente processi sulla porta 3999
- Avvia Netlify Dev su http://localhost:8888
- Simula esattamente l'ambiente di produzione Netlify
- Supporta serverless functions, redirect, headers, ecc.
- Utilizza hot-reload per le modifiche in tempo reale

> **Importante:** Mantieni sempre l'ambiente conda attivo durante il testing!

### 3. Testing con Deploy di Preview

Quando vuoi testare un deploy reale ma temporaneo:

```bash
# Assicurati che l'ambiente sia attivo
conda activate netlify-test

# Crea deploy di preview
~/netlify-workflow.sh preview
```

Questo crea un deploy di preview su Netlify senza toccare la produzione.

### 4. Sincronizzazione con GitHub

> ⚠️ **ATTENZIONE:** Questa è l'unica operazione che sovrascrive file!

Quando sei soddisfatto delle modifiche e vuoi sincronizzare:

```bash
# Con ambiente conda attivo
~/netlify-workflow.sh sync
```

Questo comando:

- Ti chiede conferma prima di procedere
- Crea automaticamente un backup di REPOTEST
- Crea automaticamente un backup di REPOGITH
- Sincronizza REPOTEST → REPOGITH
- Esclude automaticamente node_modules, .netlify, dist, build

Dopo la sincronizzazione, vai nella cartella GitHub per commit e push:

```bash
cd ~/Documents/REPOGITH/ai-toolkit-directory
git status
git add .
git commit -m "Aggiornamento dopo testing"
git push
```

### 5. Chiusura Sessione di Lavoro

Quando finisci di lavorare:

```bash
# Disattiva l'ambiente conda (opzionale)
conda deactivate
```

------

## 🔧 Spiegazione del Codice Aggiornato

Lo script netlify-workflow.sh è stato potenziato con:

### Funzione cleanup_port()

```bash
# Pulisce processi sulla porta 3999 cross-platform
cleanup_port() {
    # Supporta macOS/Linux con lsof
    # Supporta Windows con netstat e PowerShell
    # Gestisce errori silenziosamente
}
```

### Integrazione in start_testing()

```bash
start_testing() {
    # Cleanup automatico prima di avviare
    cleanup_port
    # Resto della logica esistente...
}
```

### Nuovo comando clean-dev

```bash
start_clean_dev() {
    # Pulizia approfondita + cache Netlify
    # Poi avvia normalmente
}
```

### Miglioramento show_status()

```bash
show_status() {
    # Ora include controllo processi porta 3999
    cleanup_port
}
```

------

## 🔧 Gestione Ambiente Conda

### Comandi Essenziali

```bash
# Attivare l'ambiente
conda activate netlify-test

# Disattivare l'ambiente
conda deactivate

# Verificare ambienti disponibili
conda env list

# Verificare pacchetti installati nell'ambiente
conda list

# Aggiornare pacchetti nell'ambiente
conda update --all
```

### Ricreare l'Ambiente (se necessario)

Se l'ambiente si corrompe o vuoi ricrearlo:

```bash
# Elimina l'ambiente esistente
conda remove -n netlify-test --all

# Ricrea l'ambiente
conda create -n netlify-test
conda activate netlify-test
npm install -g netlify-cli

# Riattiva
conda activate netlify-test
```

### Aggiornare Netlify CLI

```bash
# Con ambiente attivo
conda activate netlify-test

# Aggiorna Netlify CLI
npm update -g netlify-cli
```

------

## 🔧 Configurazione Avanzata

### File netlify.toml

Nella cartella REPOTEST/ai-toolkit-directory, puoi creare un netlify.toml per configurazioni specifiche:

```toml
[build]
  command = "npm run build"
  publish = "dist"

[dev]
  command = "npm run dev"
  port = 3000
  targetPort = 8888

[functions]
  directory = "netlify/functions"

[[redirects]]
  from = "/api/*"
  to = "/.netlify/functions/:splat"
  status = 200
```

### Script package.json ottimizzati

Nel file package.json del progetto, usa questi script:

```json
{
  "scripts": {
    "dev": "netlify dev",
    "build": "your-build-command",
    "preview": "netlify serve",
    "deploy": "netlify deploy --prod"
  }
}
```

------

## 🚀 Setup Ambiente VS Code

### Creare un nuovo profilo netlify aggiungendo alla configurazione di VS Code:

#### Procedura per Windows

```json
{
  "terminal.integrated.profiles.windows": {
    "Netlify Conda": {
      "path": "C:\\Windows\\System32\\cmd.exe",
      "args": ["/K", "C:\\Users\\%USERNAME%\\miniconda3\\Scripts\\activate.bat C:\\Users\\%USERNAME%\\miniconda3\\envs\\netlify-test"],
      "icon": "terminal-cmd"
    }
  },
  "terminal.integrated.defaultProfile.windows": "Netlify Conda"
}
```

#### Procedura per macOS/Linux

```json
{
  "terminal.integrated.profiles.linux": {
    "Netlify Conda": {
      "path": "/bin/bash",
      "args": ["-c", "source ~/miniconda3/bin/activate netlify-test; exec bash"],
      "icon": "terminal-bash"
    }
  },
  "terminal.integrated.defaultProfile.linux": "Netlify Conda"
}
```

------

## 📋 Riferimento Comandi

### Preparazione Ambiente

```bash
conda activate netlify-test        # SEMPRE per primo!
~/netlify-workflow.sh status       # Verifica stato
```

### Comandi Sicuri (non modificano file)

```bash
~/netlify-workflow.sh status       # Mostra stato dell'ambiente
~/netlify-workflow.sh backup       # Crea backup di sicurezza  
~/netlify-workflow.sh test         # Avvia server di testing locale (con cleanup)
~/netlify-workflow.sh clean-dev    # Pulizia approfondita + test
~/netlify-workflow.sh preview      # Deploy di preview temporaneo
```

### Comandi Interattivi (chiedono conferma)

```bash
~/netlify-workflow.sh setup        # Setup iniziale dell'ambiente
~/netlify-workflow.sh sync         # Sincronizza REPOTEST → REPOGITH
```

------

## 🚨 Risoluzione Problemi

### Lo script non si avvia

```bash
# Controlla posizione e permessi
ls -la ~/netlify-workflow.sh
chmod +x ~/netlify-workflow.sh
```

### Errore "Netlify command not found"

```bash
# Verifica che l'ambiente conda sia attivo
conda activate netlify-test

# Se non funziona, ricrea l'ambiente
conda remove -n netlify-test --all
conda create -n netlify-test
conda activate netlify-test
npm install -g netlify-cli
```

### Conflitti tra versioni npm/conda

```bash
# Verifica quale versione stai usando
which netlify

# Con conda attivo dovrebbe mostrare percorso conda
```

------

## 🎯 Best Practices

### 1. Gestione Ambiente

- **SEMPRE** attiva `conda activate netlify-test` prima di lavorare
- **SEMPRE** verifica lo stato con `~/netlify-workflow.sh status`
- Non mescolare installazioni globali npm con ambiente conda

### 2. Backup Regolari

- Sempre crea un backup prima di modifiche importanti
- Tieni backup di diverse versioni per poter tornare indietro

### 3. Testing Locale

- Mai fare deploy diretto senza testing locale
- Usa sempre netlify dev per testare in ambiente simile alla produzione

### 4. Utilizza il Cleanup Automatico

- Il cleanup della porta 3999 è ora automatico con `test`
- Usa `clean-dev` per pulizie più approfondite
- Non dovrai più gestire manualmente i conflitti di porta

------

## 🔄 Checklist Sessione di Lavoro

### Inizio Sessione

- [ ] `conda activate netlify-test`
- [ ] `~/netlify-workflow.sh status` (verifica tutto OK)
- [ ] `~/netlify-workflow.sh backup` (se modifiche importanti)

### Durante il Lavoro

- [ ] Lavora sempre nella cartella REPOTEST
- [ ] Usa `~/netlify-workflow.sh test` per testing locale (cleanup automatico)
- [ ] Mantieni l'ambiente conda attivo

### Fine Sessione

- [ ] `~/netlify-workflow.sh sync` (quando pronto)
- [ ] Commit e push da REPOGITH
- [ ] `conda deactivate` (opzionale)

------

## 🆕 Nuove Funzionalità Implementate:



## 📊 Schema Comparativo Aggiornato

| Funzionalità                  | [netlify-workflow.sh](https://netlify-workflow.sh/) (VECCHIO) | [netlify-workflow.sh](https://netlify-workflow.sh/) (NUOVO) | [banana-workflow.sh](https://banana-workflow.sh/) |
| :---------------------------- | :----------------------------------------------------------- | :---------------------------------------------------------- | :------------------------------------------------ |
| **Pulizia multi-porta**       | ❌ Solo porta 3999                                            | ✅ 13 porte predefinite                                      | ✅ 13 porte predefinite                            |
| **Pulizia porta specifica**   | ❌                                                            | ✅ Supporto cross-platform                                   | ✅                                                 |
| **Rilevamento tipo progetto** | ❌                                                            | ✅ Node.js detection                                         | ✅ Node.js detection                               |
| **Info dimensione progetto**  | ❌                                                            | ✅                                                           | ✅                                                 |
| **Conteggio backup**          | ❌                                                            | ✅                                                           | ✅                                                 |
| **Controllo stato porte**     | ❌                                                            | ✅ Dettagliato cross-platform                                | ✅                                                 |
| **Supporto progetti Python**  | ❌                                                            | ✅ (esclude **pycache**, venv)                               | ✅ (esclude **pycache**, venv)                     |
| **Deploy Netlify**            | ✅                                                            | ✅                                                           | ❌                                                 |
| **Sincronizzazione GitHub**   | ✅                                                            | ✅                                                           | ❌                                                 |
| **Setup automatico**          | ✅                                                            | ✅                                                           | ❌                                                 |
| **Supporto Windows/macOS**    | ✅                                                            | ✅                                                           | ✅ (macOS/Linux)                                   |

## 🚀 Sintesi dei Comandi Aggiornata

### Comandi Principali:

```bash
# Setup e configurazione
./netlify-workflow.sh setup          # Setup iniziale del progetto

# Backup e sincronizzazione
./netlify-workflow.sh backup         # Crea backup della versione corrente
./netlify-workflow.sh sync           # Sincronizza REPOTEST → REPOGITH

# Sviluppo e testing
./netlify-workflow.sh test           # Avvia server di test (rilevamento automatico)
./netlify-workflow.sh clean-dev      # Avvio con pulizia approfondita (cache+porte)

# Deploy
./netlify-workflow.sh preview        # Crea deploy di preview su Netlify

# Monitoraggio e utilità
./netlify-workflow.sh status         # Mostra stato dettagliato dell'ambiente
./netlify-workflow.sh cleanup        # Pulisci tutte le porte di sviluppo
./netlify-workflow.sh cleanup 3000   # Pulisci una porta specifica
```



### 📋 Dettaglio Comandi:

#### **🛠️ Setup e Configurazione**

- `setup` - Configurazione iniziale con creazione package.json e installazione Netlify CLI

#### **💾 Backup e Sincronizzazione**

- `backup` - Crea backup completo con esclusioni intelligenti (node_modules, .netlify, .git, **pycache**, venv, .env)
- `sync` - Sincronizza sicura con backup preventivo e esclusioni multiple

#### **🚀 Sviluppo Locale**

- `test` - Avvio intelligente: rileva progetto Node.js → cerca script "dev" → fallback su Netlify Dev
- `clean-dev` - Pulizia approfondita (porte + cache) prima dell'avvio

#### **🌐 Deploy**

- `preview` - Build e deploy di preview su Netlify con controllo script build

#### **📊 Monitoraggio**

- `status` - Status completo: dimensioni progetto, conteggio backup, stato porte, versioni tools
- `cleanup` - Pulizia porte di sviluppo (13 porte predefinite o porta specifica)

### 🔧 Funzionalità Avanzate:

- **Rilevamento automatico** del tipo di progetto
- **Pulizia cross-platform** (macOS, Linux, Windows)
- **Backup intelligente** con multiple esclusioni
- **Controllo stato** dettagliato con informazioni complete
- **Sincronizzazione sicura** con backup preventivo

### 📁 Struttura Directory:

```text
REPOTEST: ~/Documents/REPOTEST/ai-toolkit-directory    # Sviluppo attivo
GITHUB:   ~/Documents/REPOGITH/ai-toolkit-directory    # Repository GitHub  
BACKUP:   ~/Documents/BACKUP/ai-toolkit-directory      # Backup automatici
```

### 1. **Pulizia Multi-Porta Avanzata**

- Supporto per 13 porte di sviluppo diverse
- Funzione `cleanup_dev_ports()` per pulizia completa

### 2. **Pulizia Porta Specifica**

- Comando: `./netlify-workflow.sh cleanup 3000`
- Supporto cross-platform (macOS/Linux/Windows)

### 3. **Rilevamento Automatico Progetto**

- Riconosce progetti Node.js dal package.json
- Logica intelligente per avviare script appropriati

### 4. **Status Dettagliato**

- Dimensione del progetto
- Conteggio backup
- Controllo stato porte dettagliato
- Informazioni su Netlify CLI, Node.js, npm

### 5. **Backup Migliorato**

- Più esclusioni: `__pycache__`, `venv`, `.env`
- Supporto cross-platform migliorato

### 6. **Sincronizzazione Migliorata**

- Esclusioni aggiuntive per Python e file ambiente

### 7. **Menu Esteso**

- Nuovo comando `cleanup` con supporto porta specifica
- Help aggiornato con tutte le nuove funzionalità

*Ultimo aggiornamento: 14 Settembre 2025*