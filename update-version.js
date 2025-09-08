#!/usr/bin/env node

/**
 * Script per incrementare automaticamente la versione del progetto PWA
 * Aggiorna: sw.js, manifest.json e package.json (se esiste)
 * 
 * Uso: node update-version.js [patch|minor|major]
 * Default: patch (1.4.4 -> 1.4.5)
 */

const fs = require('fs');
const path = require('path');

// Configurazione file da aggiornare
const FILES_TO_UPDATE = {
    serviceWorker: './sw.js',
    manifest: './manifest.json',
    package: './package.json' // opzionale
};

// Patterns per trovare versioni nei file
const PATTERNS = {
    serviceWorker: [
        /const CACHE_NAME = ['"`]ai-tools-v([\d.]+)['"`];/,
        /const STATIC_CACHE = ['"`]static-v([\d.]+)['"`];/,
        /const DYNAMIC_CACHE = ['"`]dynamic-v([\d.]+)['"`];/
    ],
    manifest: [
        /"version":\s*['"`]([\d.]+)['"`]/
    ]
};

class VersionUpdater {
    constructor() {
        this.currentVersion = null;
        this.newVersion = null;
        this.updateType = process.argv[2] || 'patch';
    }

    // Incrementa versione secondo semantic versioning
    incrementVersion(version, type = 'patch') {
        const parts = version.split('.').map(Number);
        
        switch (type.toLowerCase()) {
            case 'major':
                parts[0]++;
                parts[1] = 0;
                parts[2] = 0;
                break;
            case 'minor':
                parts[1]++;
                parts[2] = 0;
                break;
            case 'patch':
            default:
                parts[2]++;
                break;
        }
        
        return parts.join('.');
    }

    // Legge versione corrente dal service worker
    getCurrentVersion() {
        try {
            const swContent = fs.readFileSync(FILES_TO_UPDATE.serviceWorker, 'utf8');
            const match = swContent.match(PATTERNS.serviceWorker[0]);
            
            if (match && match[1]) {
                this.currentVersion = match[1];
                console.log(`📊 Versione corrente: ${this.currentVersion}`);
                return this.currentVersion;
            } else {
                throw new Error('Versione non trovata nel service worker');
            }
        } catch (error) {
            console.error('❌ Errore lettura versione:', error.message);
            process.exit(1);
        }
    }

    // Aggiorna Service Worker
    updateServiceWorker() {
        try {
            let content = fs.readFileSync(FILES_TO_UPDATE.serviceWorker, 'utf8');
            
            // Aggiorna tutte le versioni nel SW
            PATTERNS.serviceWorker.forEach((pattern, index) => {
                const cacheName = index === 0 ? 'ai-tools' : 
                                index === 1 ? 'static' : 'dynamic';
                const newPattern = index === 0 
                    ? `const CACHE_NAME = 'ai-tools-v${this.newVersion}';`
                    : index === 1 
                    ? `const STATIC_CACHE = 'static-v${this.newVersion}';`
                    : `const DYNAMIC_CACHE = 'dynamic-v${this.newVersion}';`;
                
                content = content.replace(pattern, newPattern);
            });
            
            // Aggiorna timestamp nei commenti
            const timestamp = new Date().toISOString();
            content = content.replace(
                /\/\/ sw\.js - Service Worker migliorato per AI Toolkit Directory PWA/,
                `// sw.js - Service Worker migliorato per AI Toolkit Directory PWA\n// Versione: ${this.newVersion} - Aggiornato: ${timestamp}`
            );
            
            fs.writeFileSync(FILES_TO_UPDATE.serviceWorker, content, 'utf8');
            console.log('✅ Service Worker aggiornato');
            
        } catch (error) {
            console.error('❌ Errore aggiornamento SW:', error.message);
            process.exit(1);
        }
    }

    // Aggiorna Manifest
    updateManifest() {
        try {
            const content = fs.readFileSync(FILES_TO_UPDATE.manifest, 'utf8');
            const manifest = JSON.parse(content);
            
            manifest.version = this.newVersion;
            
            const updatedContent = JSON.stringify(manifest, null, 2);
            fs.writeFileSync(FILES_TO_UPDATE.manifest, updatedContent, 'utf8');
            console.log('✅ Manifest aggiornato');
            
        } catch (error) {
            console.error('❌ Errore aggiornamento manifest:', error.message);
            process.exit(1);
        }
    }

    // Aggiorna package.json se esiste
    updatePackageJson() {
        try {
            if (fs.existsSync(FILES_TO_UPDATE.package)) {
                const content = fs.readFileSync(FILES_TO_UPDATE.package, 'utf8');
                const packageJson = JSON.parse(content);
                
                packageJson.version = this.newVersion;
                
                const updatedContent = JSON.stringify(packageJson, null, 2);
                fs.writeFileSync(FILES_TO_UPDATE.package, updatedContent, 'utf8');
                console.log('✅ package.json aggiornato');
            } else {
                console.log('⚠️ package.json non trovato (opzionale)');
            }
        } catch (error) {
            console.error('⚠️ Errore aggiornamento package.json:', error.message);
        }
    }

    // Crea changelog entry
    updateChangelog() {
        const changelogPath = './CHANGELOG.md';
        const date = new Date().toISOString().split('T')[0];
        
        const newEntry = `
## [${this.newVersion}] - ${date}

### ✨ Novità
- Aggiornamento versione automatico

### 🔧 Miglioramenti
- Cache management ottimizzato
- Performance improvements

### 🐛 Bug Fix
- Risolti problemi di cache PWA

---

`;

        try {
            let changelogContent = '';
            
            if (fs.existsSync(changelogPath)) {
                changelogContent = fs.readFileSync(changelogPath, 'utf8');
            } else {
                changelogContent = '# Changelog\n\nTutte le modifiche significative al progetto saranno documentate qui.\n\n';
            }
            
            // Inserisci nuovo entry dopo l'header
            const lines = changelogContent.split('\n');
            const headerIndex = lines.findIndex(line => line.includes('# Changelog'));
            
            if (headerIndex !== -1) {
                lines.splice(headerIndex + 3, 0, newEntry);
                fs.writeFileSync(changelogPath, lines.join('\n'), 'utf8');
                console.log('✅ Changelog aggiornato');
            }
            
        } catch (error) {
            console.error('⚠️ Errore aggiornamento changelog:', error.message);
        }
    }

    // Esegue l'aggiornamento completo
    run() {
        console.log(`🚀 Avvio aggiornamento versione (${this.updateType})...\n`);
        
        // Leggi versione corrente
        this.getCurrentVersion();
        
        // Calcola nuova versione
        this.newVersion = this.incrementVersion(this.currentVersion, this.updateType);
        console.log(`🎯 Nuova versione: ${this.newVersion}\n`);
        
        // Conferma aggiornamento
        if (process.argv.includes('--no-confirm')) {
            this.performUpdate();
        } else {
            this.askConfirmation();
        }
    }

    // Chiede conferma prima di procedere
    askConfirmation() {
        const readline = require('readline');
        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });

        rl.question(`Procedere con l'aggiornamento da ${this.currentVersion} a ${this.newVersion}? (y/N): `, (answer) => {
            if (answer.toLowerCase() === 'y' || answer.toLowerCase() === 'yes') {
                this.performUpdate();
            } else {
                console.log('❌ Aggiornamento annullato');
                process.exit(0);
            }
            rl.close();
        });
    }

    // Esegue l'aggiornamento
    performUpdate() {
        console.log('🔄 Aggiornamento in corso...\n');
        
        try {
            this.updateServiceWorker();
            this.updateManifest();
            this.updatePackageJson();
            this.updateChangelog();
            
            console.log('\n🎉 Aggiornamento completato!');
            console.log(`📋 Versione: ${this.currentVersion} → ${this.newVersion}`);
            console.log('\n💡 Prossimi passi:');
            console.log('   1. git add .');
            console.log(`   2. git commit -m "chore: bump version to ${this.newVersion}"`);
            console.log('   3. git push');
            console.log('\n⚡ Netlify rileverà automaticamente i cambiamenti e deploierà');
            
        } catch (error) {
            console.error('\n❌ Aggiornamento fallito:', error.message);
            process.exit(1);
        }
    }
}

// Mostra help se richiesto
if (process.argv.includes('--help') || process.argv.includes('-h')) {
    console.log(`
🚀 Script di Aggiornamento Versione PWA

Uso: node update-version.js [tipo] [opzioni]

Tipi di aggiornamento:
  patch   Incrementa versione patch (1.4.4 → 1.4.5) [default]
  minor   Incrementa versione minor (1.4.4 → 1.5.0)  
  major   Incrementa versione major (1.4.4 → 2.0.0)

Opzioni:
  --no-confirm    Non chiede conferma prima dell'aggiornamento
  --help, -h      Mostra questo messaggio

File aggiornati:
  - sw.js (versioni cache)
  - manifest.json (version field)
  - package.json (se presente)
  - CHANGELOG.md (nuovo entry)

Esempi:
  node update-version.js                    # Patch update
  node update-version.js minor              # Minor update  
  node update-version.js major --no-confirm # Major update senza conferma
`);
    process.exit(0);
}

// Avvia lo script
const updater = new VersionUpdater();
updater.run();