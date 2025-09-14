# Guida Workflow Netlify v3

## 📋 Indice Rapido
- [🚀 Comandi Principali](#-comandi-principali)
- [⚡ Setup Veloce](#-setup-veloce)
- [🛠️ Configurazione](#-configurazione)
- [📊 Workflow Semplificato](#-workflow-semplificato)
- [🔧 Risoluzione Problemi](#-risoluzione-problemi)
- [🎯 Best Practices](#-best-practices)

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



## 🚀 Comandi Principali

### Setup e Configurazione

```bash
./netlify-workflow.sh setup          # Setup iniziale
./netlify-workflow.sh status         # Verifica stato ambiente
```

### Sviluppo e Testing

```bash
./netlify-workflow.sh test           # Avvio con cleanup automatico
./netlify-workflow.sh clean-dev      # Pulizia approfondita + test
./netlify-workflow.sh preview        # Deploy di preview
```



### Backup e Sincronizzazione

```bash
./netlify-workflow.sh backup         # Backup completo
./netlify-workflow.sh sync           # Sincronizza con GitHub
```

### Utilità

```bash
./netlify-workflow.sh cleanup        # Pulisci tutte le porte
./netlify-workflow.sh cleanup 3000   # Pulisci porta specifica
```



## ⚡ Setup Veloce

### 1. Posiziona lo Script

```bash
# Sposta nella home e rendi eseguibile
mv netlify-workflow.sh ~/
chmod +x ~/netlify-workflow.sh
```

### 2. Backup Manuale (Obbligatorio)

```bash
mkdir -p ~/Documents/BACKUP-MANUALE
cp -r ~/Documents/REPOTEST/ai-toolkit-directory ~/Documents/BACKUP-MANUALE/
cp -r ~/Documents/REPOGITH/ai-toolkit-directory ~/Documents/BACKUP-MANUALE/
```

### 3. Ambiente Conda

```bash
# Crea ambiente dedicato
conda create -n netlify-test
conda activate netlify-test
npm install -g netlify-cli
```



### 4. Setup Finale

```bash
./netlify-workflow.sh setup
```

## 🛠️ Configurazione

### Struttura Directory

```bash
~/Documents/
├── REPOTEST/ai-toolkit-directory/    # 🎯 Sviluppo attivo
├── REPOGITH/ai-toolkit-directory/    # 📦 Repository GitHub  
└── BACKUP/ai-toolkit-directory/      # 💾 Backup automatici
```



### File netlify.toml (Opzionale)

```bash
[build]
  publish = "dist"

[dev]
  port = 3000
  targetPort = 8888
```



## 📊 Workflow Semplificato

### 🔄 Flusso di Lavoro

1. **Attiva ambiente**: `conda activate netlify-test`
2. **Verifica**: `./netlify-workflow.sh status`
3. **Sviluppa**: Lavora in `REPOTEST/`
4. **Testa**: `./netlify-workflow.sh test` (cleanup automatico)
5. **Sincronizza**: `./netlify-workflow.sh sync` → commit/push da `REPOGITH/`

### ⚡ Comandi Rapidi per Sessioni

```bash
# Inizio sessione
conda activate netlify-test
./netlify-workflow.sh status

# Durante sviluppo  
./netlify-workflow.sh test          # Test locale
./netlify-workflow.sh preview       # Test deploy

# Fine sessione
./netlify-workflow.sh sync          # Sincronizza
git -C ~/Documents/REPOGITH/ai-toolkit-directory add .
git -C ~/Documents/REPOGITH/ai-toolkit-directory commit -m "Update"
git -C ~/Documents/REPOGITH/ai-toolkit-directory push
```



## 🔧 Risoluzione Problemi

### ❌ Script non si avvia

```bash
chmod +x ~/netlify-workflow.sh      # Rendilo eseguibile
```



### ❌ Netlify non trovato

```bash
conda activate netlify-test         # Attiva ambiente
npm install -g netlify-cli          # Reinstalla se necessario
```



### ❌ Porta occupata

```bash
./netlify-workflow.sh cleanup       # Pulizia completa
./netlify-workflow.sh clean-dev     # Pulizia approfondita
```



## 🎯 Best Practices

### ✅ Always Do

- **Sempre** attiva ambiente conda prima di lavorare
- **Sempre** backup prima di modifiche importanti
- **Sempre** test locale prima di sincronizzare

### ✅ Cleanup Automatico

- Il comando `test` include già cleanup porta 3999
- Usa `clean-dev` per pulizie più aggressive
- Non serve gestire manualmente i conflitti

### ✅ Struttura Isolata

- Sviluppo in `REPOTEST/` → Testing → Sincronizza in `REPOGITH/`
- Ambiente conda dedicato evita conflitti globali
- Backup automatici per sicurezza

------

## 🆕 Novità v3

### ✨ Funzionalità Aggiunte

- **Pulizia multi-porta** (13 porte supportate)
- **Rilevamento automatico** tipo progetto
- **Status dettagliato** con info complete
- **Backup migliorato** con più esclusioni
- **Supporto cross-platform** completo

### 🎨 Miglioramenti

- Menu più intuitivo con emoji
- Output colorato per migliore leggibilità
- Gestione errori migliorata
- Performance ottimizzate

*Ultimo aggiornamento: 14 Settembre 2025*

------

**📞 Supporto**: Per problemi, esegui `./netlify-workflow.sh status` e verifica che tutti i componenti siano OK.