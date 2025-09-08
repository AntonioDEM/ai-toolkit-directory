## 🔧 **STEP 5: Script di Automazione Versioning - Spiegazione Dettagliata**

Lo script di automazione è **opzionale** ma molto utile per automatizzare l'incremento delle versioni. Ti spiego tutto nel dettaglio:

### 🎯 **Cosa Fa Lo Script**

Lo script **automatizza** questo processo manuale:

1. ❌ **Manuale**: Aprire `sw.js` → Cambiare `v1.4.4` in `v1.4.5` in 3 righe diverse
2. ❌ **Manuale**: Aprire `manifest.json` → Cambiare `"version": "1.4.4"` in `"1.4.5"`
3. ❌ **Manuale**: Ricordare di fare commit con messaggio corretto
4. ✅ **Automatico**: Un comando fa tutto

### 📋 **Come Installare e Usare**

#### **Installazione**

```bash
# 1. Crea il file nella root del progetto
touch update-version.js

# 2. Copia il contenuto dell'Artifact #5 nel file

# 3. Rendi eseguibile (Linux/Mac)
chmod +x update-version.js

# 4. Test che funzioni
node update-version.js --help
```

#### **Uso Base**

```bash
# Incrementa versione patch (1.4.4 → 1.4.5)
node update-version.js

# O specificando il tipo
node update-version.js patch
```

#### **Tipi di Incremento**

```bash
# PATCH: 1.4.4 → 1.4.5 (bug fix, piccoli aggiornamenti)
node update-version.js patch

# MINOR: 1.4.4 → 1.5.0 (nuove funzionalità compatibili)  
node update-version.js minor

# MAJOR: 1.4.4 → 2.0.0 (breaking changes)
node update-version.js major
```

### 🔍 **Funzionamento Interno**- Esempio di Funzionamento Script

```bash
# ESEMPIO PRATICO DI ESECUZIONE

$ node update-version.js patch

🚀 Avvio aggiornamento versione (patch)...

📊 Versione corrente: 1.4.4
🎯 Nuova versione: 1.4.5

Procedere con l'aggiornamento da 1.4.4 a 1.4.5? (y/N): y

🔄 Aggiornamento in corso...

✅ Service Worker aggiornato
✅ Manifest aggiornato  
⚠️ package.json non trovato (opzionale)
✅ Changelog aggiornato

🎉 Aggiornamento completato!
📋 Versione: 1.4.4 → 1.4.5

💡 Prossimi passi:
   1. git add .
   2. git commit -m "chore: bump version to 1.4.5"
   3. git push

⚡ Netlify rileverà automaticamente i cambiamenti e deploierà

# COSA È STATO MODIFICATO:

# 1. sw.js - Da:
const CACHE_NAME = 'ai-tools-v1.4.4';
const STATIC_CACHE = 'static-v1.4.4';  
const DYNAMIC_CACHE = 'dynamic-v1.4.4';

# 1. sw.js - A:
const CACHE_NAME = 'ai-tools-v1.4.5';
const STATIC_CACHE = 'static-v1.4.5';
const DYNAMIC_CACHE = 'dynamic-v1.4.5';

# 2. manifest.json - Da:
"version": "1.4.4"

# 2. manifest.json - A:  
"version": "1.4.5"

# 3. CHANGELOG.md - Aggiunto:
## [1.4.5] - 2025-09-05
### ✨ Novità
- Aggiornamento versione automatico
### 🔧 Miglioramenti  
- Cache management ottimizzato
...
```

### ⚙️ **Analisi del Codice Script**

#### **Cosa Cerca e Modifica**

```javascript
// 1. CERCA QUESTE RIGHE nel sw.js:
const CACHE_NAME = 'ai-tools-v1.4.4';          // Pattern regex
const STATIC_CACHE = 'static-v1.4.4';          // Pattern regex  
const DYNAMIC_CACHE = 'dynamic-v1.4.4';        // Pattern regex

// 2. CERCA QUESTA RIGA nel manifest.json:
"version": "1.4.4"                              // Pattern regex

// 3. LE SOSTITUISCE CON LA NUOVA VERSIONE
```

#### **Semantic Versioning**

```bash
# Formato: MAJOR.MINOR.PATCH
1.4.4
│ │ │
│ │ └── PATCH: Bug fix, piccoli aggiornamenti
│ └──── MINOR: Nuove funzionalità (compatibili)
└────── MAJOR: Breaking changes (incompatibili)
```

### 🛠️ **Alternative Più Semplici**

Se non vuoi usare lo script Node.js, puoi usare metodi più semplici:

#### **Metodo 1: Script Bash (Linux/Mac)**

```bash
#!/bin/bash

# Script semplice per aggiornare versioni PWA
# Uso: ./update-version.sh 1.4.5

if [ $# -eq 0 ]; then
    echo "❌ Specifica la nuova versione: ./update-version.sh 1.4.5"
    exit 1
fi

NEW_VERSION=$1
echo "🚀 Aggiornamento alla versione $NEW_VERSION..."

# Backup files
cp sw.js sw.js.backup
cp manifest.json manifest.json.backup

# Aggiorna Service Worker
echo "🔄 Aggiornamento sw.js..."
sed -i "s/ai-tools-v[0-9.]*/ai-tools-v$NEW_VERSION/g" sw.js
sed -i "s/static-v[0-9.]*/static-v$NEW_VERSION/g" sw.js  
sed -i "s/dynamic-v[0-9.]*/dynamic-v$NEW_VERSION/g" sw.js

# Aggiorna Manifest
echo "🔄 Aggiornamento manifest.json..."
sed -i "s/\"version\": \"[0-9.]*\"/\"version\": \"$NEW_VERSION\"/g" manifest.json

echo "✅ Aggiornamento completato!"
echo "📋 File modificati: sw.js, manifest.json"
echo "💡 Prossimi passi:"
echo "   1. Verifica le modifiche: git diff"
echo "   2. git add . && git commit -m 'chore: bump version to $NEW_VERSION' && git push"

# Mostra le modifiche
echo -e "\n📊 Modifiche effettuate:"
echo "SW Cache Names:"
grep "CACHE_NAME\|STATIC_CACHE\|DYNAMIC_CACHE" sw.js

echo -e "\nManifest Version:"
grep "version" manifest.json
```



#### **Metodo 2: Script PowerShell (Windows)**

```powershell
# Script PowerShell per aggiornare versioni PWA
# Uso: .\update-version.ps1 1.4.5

param(
    [Parameter(Mandatory=$true)]
    [string]$NewVersion
)

Write-Host "🚀 Aggiornamento alla versione $NewVersion..." -ForegroundColor Green

try {
    # Backup files
    Copy-Item "sw.js" "sw.js.backup"
    Copy-Item "manifest.json" "manifest.json.backup"
    
    # Leggi e aggiorna Service Worker
    Write-Host "🔄 Aggiornamento sw.js..." -ForegroundColor Yellow
    $swContent = Get-Content "sw.js" -Raw
    $swContent = $swContent -replace "ai-tools-v[\d.]+", "ai-tools-v$NewVersion"
    $swContent = $swContent -replace "static-v[\d.]+", "static-v$NewVersion"  
    $swContent = $swContent -replace "dynamic-v[\d.]+", "dynamic-v$NewVersion"
    Set-Content "sw.js" $swContent
    
    # Leggi e aggiorna Manifest
    Write-Host "🔄 Aggiornamento manifest.json..." -ForegroundColor Yellow
    $manifestContent = Get-Content "manifest.json" -Raw
    $manifestContent = $manifestContent -replace '"version":\s*"[\d.]+"', "`"version`": `"$NewVersion`""
    Set-Content "manifest.json" $manifestContent
    
    Write-Host "✅ Aggiornamento completato!" -ForegroundColor Green
    Write-Host "📋 File modificati: sw.js, manifest.json" -ForegroundColor Cyan
    Write-Host "💡 Prossimi passi:" -ForegroundColor White
    Write-Host "   1. Verifica: git diff" -ForegroundColor Gray
    Write-Host "   2. git add . && git commit -m 'chore: bump version to $NewVersion' && git push" -ForegroundColor Gray
    
    # Mostra le modifiche
    Write-Host "`n📊 Modifiche effettuate:" -ForegroundColor White
    Write-Host "SW Cache Names:" -ForegroundColor Yellow
    Select-String "CACHE_NAME|STATIC_CACHE|DYNAMIC_CACHE" sw.js
    
    Write-Host "`nManifest Version:" -ForegroundColor Yellow  
    Select-String "version" manifest.json
    
} catch {
    Write-Host "❌ Errore durante l'aggiornamento: $_" -ForegroundColor Red
    # Ripristina backup
    if (Test-Path "sw.js.backup") { 
        Copy-Item "sw.js.backup" "sw.js" 
        Remove-Item "sw.js.backup"
    }
    if (Test-Path "manifest.json.backup") { 
        Copy-Item "manifest.json.backup" "manifest.json"
        Remove-Item "manifest.json.backup" 
    }
}
```



# 🔧 Guida Aggiornamento Versione Manuale

## 📋 Checklist Rapida

### STEP 1: Decidi Nuova Versione

```
Versione Corrente: 1.4.4
Nuova Versione: 1.4.5    ← (incrementa l'ultimo numero)
```

### STEP 2: Aggiorna sw.js

Apri `sw.js` e sostituisci **3 righe**:

**CERCA:**

```javascript
const CACHE_NAME = 'ai-tools-v1.4.4';
const STATIC_CACHE = 'static-v1.4.4'; 
const DYNAMIC_CACHE = 'dynamic-v1.4.4';
```

**SOSTITUISCI CON:**

```javascript
const CACHE_NAME = 'ai-tools-v1.4.5';
const STATIC_CACHE = 'static-v1.4.5';
const DYNAMIC_CACHE = 'dynamic-v1.4.5';
```

### STEP 3: Aggiorna manifest.json

Apri `manifest.json` e sostituisci **1 riga**:

**CERCA:**

```json
"version": "1.4.4",
```

**SOSTITUISCI CON:**

```json
"version": "1.4.5",
```

### STEP 4: Deploy

```bash
git add .
git commit -m "chore: bump version to 1.4.5"
git push
```

## 🎯 Pro Tips

### Usa Find-Replace del tuo editor:

- **VS Code**: `Ctrl+H` (Windows) / `Cmd+H` (Mac)
- **Sublime**: `Ctrl+H` / `Cmd+Option+F`
- **Atom**: `Ctrl+H` / `Cmd+H`

### Pattern di Ricerca (Regex):

```
Cerca: ai-tools-v[\d\.]+
Sostituisci: ai-tools-v1.4.5
```

### Verifica Prima del Commit:

```bash
# Controlla cosa hai modificato
git diff

# Dovrebbe mostrare solo le righe di versione cambiate
```

## ⚠️ Attenzione

**NON dimenticare di cambiare TUTTE E 4 le righe:**

- ✅ CACHE_NAME nel sw.js
- ✅ STATIC_CACHE nel sw.js
- ✅ DYNAMIC_CACHE nel sw.js
- ✅ version nel manifest.json

**Se dimentichi anche solo una**, il service worker potrebbe non aggiornarsi correttamente.

## 🚀 Workflow Futuro

1. **Fai modifiche al sito**
2. **Incrementa versione** (1.4.5 → 1.4.6)
3. **Deploy**
4. **Il browser mostrerà automaticamente la notifica di aggiornamento**

## 🔄 Tipi di Incremento

```
Bug fix:         1.4.4 → 1.4.5  (incrementa ultimo numero)
Nuova feature:   1.4.4 → 1.5.0  (incrementa numero medio, reset ultimo)  
Breaking change: 1.4.4 → 2.0.0  (incrementa primo numero, reset altri)
```

### 🚀 **Bonus: Automazione GitHub Actions**

Se vuoi automazione completa, puoi usare GitHub Actions:

```yaml
.github/workflows/auto-version.yml
```

```yaml
# GitHub Actions per auto-incremento versione
# Trigger: quando fai push con [version-bump] nel commit message

name: Auto Version Bump

on:
  push:
    branches: [ main, master ]
    paths: 
      - 'sw.js'
      - 'manifest.json'
      - '**.html'
      - '**.css'
      - '**.js'

jobs:
  version-bump:
    runs-on: ubuntu-latest
    if: contains(github.event.head_commit.message, '[version-bump]')
    
    steps:
    - name: 📥 Checkout
      uses: actions/checkout@v4
      with:
        token: ${{ secrets.GITHUB_TOKEN }}
        
    - name: 📊 Leggi versione corrente
      id: current-version
      run: |
        CURRENT=$(grep -o "ai-tools-v[0-9]\+\.[0-9]\+\.[0-9]\+" sw.js | head -1 | cut -d'v' -f2)
        echo "version=$CURRENT" >> $GITHUB_OUTPUT
        echo "📊 Versione corrente: $CURRENT"
        
    - name: 🔢 Calcola nuova versione  
      id: new-version
      run: |
        CURRENT="${{ steps.current-version.outputs.version }}"
        IFS='.' read -r major minor patch <<< "$CURRENT"
        NEW_PATCH=$((patch + 1))
        NEW_VERSION="$major.$minor.$NEW_PATCH"
        echo "version=$NEW_VERSION" >> $GITHUB_OUTPUT
        echo "🎯 Nuova versione: $NEW_VERSION"
        
    - name: 🔄 Aggiorna sw.js
      run: |
        NEW_V="${{ steps.new-version.outputs.version }}"
        sed -i "s/ai-tools-v[0-9.]*/ai-tools-v$NEW_V/g" sw.js
        sed -i "s/static-v[0-9.]*/static-v$NEW_V/g" sw.js
        sed -i "s/dynamic-v[0-9.]*/dynamic-v$NEW_V/g" sw.js
        echo "✅ sw.js aggiornato"
        
    - name: 🔄 Aggiorna manifest.json
      run: |
        NEW_V="${{ steps.new-version.outputs.version }}"
        sed -i "s/\"version\": \"[0-9.]*\"/\"version\": \"$NEW_V\"/g" manifest.json
        echo "✅ manifest.json aggiornato"
        
    - name: 📝 Commit modifiche
      run: |
        git config --local user.email "action@github.com"
        git config --local user.name "GitHub Action"
        git add sw.js manifest.json
        git commit -m "chore: auto-bump version to ${{ steps.new-version.outputs.version }} [skip ci]"
        git push
        
    - name: 🎉 Summary
      run: |
        echo "🚀 Versione aggiornata automaticamente!"
        echo "📋 ${{ steps.current-version.outputs.version }} → ${{ steps.new-version.outputs.version }}"
        echo "⚡ Netlify deploierà automaticamente la nuova versione"
```



## 🎯 **Raccomandazioni per Te**

### **💡 Quale Metodo Scegliere?**

#### **Per Iniziare (Raccomandato):**

**Metodo 3: Find-Replace Manuale**

- ✅ Più semplice e diretto
- ✅ Non richiede script aggiuntivi
- ✅ Controllo totale su cosa cambi
- ✅ Funziona su qualsiasi sistema operativo

**Processo:**

```bash
# 1. Apri VS Code/editor
# 2. Find-Replace 4 righe (come nella guida)
# 3. git add . && git commit && git push
# 4. Fine!
```

#### **Quando Ti Senti Pronto:**

**Metodo 1: Script Node.js**

- ✅ Automazione completa
- ✅ Meno errori
- ✅ Changelog automatico
- ❌ Richiede Node.js installato

#### **Per Automazione Estrema:**

**Metodo 4: GitHub Actions**

- ✅ Completamente automatico
- ✅ Zero intervento manuale
- ❌ Più complesso da impostare

### **🚀 La Mia Raccomandazione**

**INIZIA** con il metodo manuale per i prossimi 2-3 deploy per capire il processo, **POI** implementa lo script Node.js quando ti senti comodo.

### **📋 Prossimi Passi Pratici**

1. **OGGI**: Implementa il sistema auto-update (Steps 1-4)
2. **PRIMO DEPLOY**: Usa metodo manuale per incremento versione
3. **DOPO 2-3 DEPLOY**: Considera script automazione se ti sta a cuore

### **⚡ Quick Start per Oggi**

```bash
# 1. Implementa Steps 1-4 (Service Worker + Auto-Update)
# 2. Per incrementare versione, apri VS Code:
#    - sw.js: Cambia v1.4.4 → v1.4.5 (3 righe)
#    - manifest.json: Cambia "1.4.4" → "1.4.5" (1 riga)
# 3. Deploy
git add .
git commit -m "fix: PWA auto-update + bump to v1.4.5"
git push
```

Il **Step 5** è un bonus che ti semplifica la vita nei deploy futuri, ma **non è necessario** per risolvere il problema della cache. Il core della soluzione è negli Steps 1-4! 🚀