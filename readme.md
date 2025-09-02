# AI Toolkit Directory

> Directory curata dei migliori strumenti AI organizzati per categoria, con filtri avanzati e funzionalità PWA

[![Netlify Status](https://api.netlify.com/api/v1/badges/651852bb-e4bc-4784-aa8d-026c4ee5f531/deploy-status)](https://app.netlify.com/projects/tools-for-ai/deploys) [![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT) [![GitHub stars](https://img.shields.io/github/stars/AntonioDEM/ai-toolkit-directory.svg)](https://github.com/AntonioDEM/ai-toolkit-directory/stargazers) [![PWA Ready](https://img.shields.io/badge/PWA-Ready-blue.svg)](https://web.dev/progressive-web-apps/)

## 🚀 Demo Live

**[🔗 Visita AI Toolkit Directory](https://tools-for-ai.netlify.app/)**

## ✨ Caratteristiche Principali

- 🎯 **Strumenti AI curati** - Collezione completa organizzata per categoria
- 🔍 **Ricerca intelligente** - Trova rapidamente il tool perfetto
- 🔧 **Filtri avanzati** - Per prezzo, rating, categoria con combinazioni multiple
- 🚀 **Form suggerisci tool** - Sistema integrato con EmailJS per contribuzioni
- 🐛 **Segnalazione bug** - Sistema di feedback per miglioramenti continui
- 📱 **PWA installabile** - Funziona offline, installabile su tutti i dispositivi
- 📊 **Google Analytics 4** - Monitoraggio GDPR compliant con consenso
- 📖 **Bookmark system** - Salva i tuoi tool preferiti
- ⌨️ **Keyboard shortcuts** - Navigazione rapida per power users
- 📱 **Design responsive** - Perfetto su desktop, tablet e mobile
- ⚡ **Performance ottimali** - Lighthouse score 95+ con caching intelligente
- 🔒 **Privacy compliant** - Politiche privacy e gestione consensi

## 🛠️ Tecnologie e Architettura

### Frontend

- **HTML5** - Struttura semantica con accessibility
- **CSS3** - Design system con variabili custom, Grid/Flexbox
- **Vanilla JavaScript ES6+** - Architettura modulare, nessuna dipendenza
- **PWA** - Service Worker, Web App Manifest, offline support

### Backend e Deployment

- **Netlify** - Hosting, CDN globale, build automation
- **JSON Database** - Dati strutturati senza server database
- **EmailJS** - Gestione invio email per form suggerimenti e segnalazioni

### Integrations

- **Clearbit Logo API** - Icone brand automatiche
- **Google Analytics 4** - Analytics privacy-first
- **Web Share API** - Condivisione nativa dispositivi
- **EmailJS Service** - Invio email serverless per form feedback

## 📂 Struttura del Progetto

```
ai-toolkit-directory/
├── index.html              # Pagina principale
├── suggest-tool.html       # Form suggerimenti con EmailJS
├── privacy.html            # Pagina privacy policy
├── manifest.json          # PWA Manifest
├── sw.js                  # Service Worker
├── netlify.toml           # Configurazione deployment
├── css/
│   ├── styles.css         # Stili principali
│   └── enhanced-styles.css # Stili funzionalità avanzate
├── js/
│   ├── enhanced-app.js    # Logica principale
│   ├── analytics.js       # Google Analytics 4
│   └── emailjs-config.js  # Configurazione EmailJS
├── data/
│   └── ai-tools.json      # Database strumenti
├── icons/                 # Icone PWA
│   ├── icon-192x192.png
│   ├── icon-512x512.png
│   └── ...
└── README.md
```

## 🚀 Quick Start

### Installazione Locale

```bash
# Clone repository
git clone https://github.com/AntonioDEM/ai-toolkit-directory.git
cd ai-toolkit-directory

# Avvia server locale
python -m http.server 8000
# oppure
npx serve .
# oppure
php -S localhost:8000
```

Visita `http://localhost:8000`

### Deploy su Netlify

1. **Fork** questo repository su GitHub
2. **Connetti** Netlify al tuo account GitHub
3. **Crea nuovo sito** da Git repository
4. **Deploy automatico** configurato con `netlify.toml`

### Configurazione Analytics (Opzionale)

```javascript
// In js/analytics.js, sostituisci:
this.GA_ID = 'G-XXXXXXXXXX'; // con il tuo Google Analytics ID
```

### Configurazione EmailJS

```javascript
// In js/emailjs-config.js, configura:
const EMAIL_CONFIG = {
    serviceId: 'YOUR_SERVICE_ID',
    templateId: 'YOUR_TEMPLATE_ID',
    publicKey: 'YOUR_PUBLIC_KEY'
};
```

## 📊 Categorie Disponibili

Il progetto ora supporta **22 categorie** complete per coprire tutti i settori AI:

| Categoria               | Emoji | Descrizione                             |
| ----------------------- | ----- | --------------------------------------- |
| **Chat/Agents**         | 🤖     | Assistenti conversazionali e agenti AI  |
| **Image**               | 🖼️     | Generazione e editing immagini AI       |
| **Productivity**        | ⚡     | Strumenti per aumentare la produttività |
| **Content**             | 📝     | Creazione e editing contenuti           |
| **Audio/Voice**         | 🎵     | Sintesi vocale e audio AI               |
| **Marketing**           | 📢     | Digital marketing e advertising         |
| **PromptAI**            | 💎     | Gestione e ottimizzazione prompt        |
| **Automation**          | ⚙️     | Automazione processi e workflow         |
| **Coding**              | 💻     | Sviluppo software e programmazione      |
| **Business Operations** | 🏢     | Gestione operazioni aziendali           |
| **Sales**               | 💰     | Vendite e CRM                           |
| **Finance**             | 📈     | Finanza e analytics finanziarie         |
| **Design**              | 🎨     | Design grafico e UX/UI                  |
| **Healthcare**          | 🏥     | Sanità e medicina                       |
| **Consulting**          | 📊     | Consulenza e advisory                   |
| **Government**          | 🏛️     | Settore pubblico e governativo          |
| **Data Analysis**       | 📊     | Analisi dati e business intelligence    |
| **Project Management**  | 📋     | Gestione progetti e team                |
| **Legal**               | ⚖️     | Servizi legali e compliance             |
| **Recruiting / HR**     | 👥     | Risorse umane e recruitment             |
| **Students**            | 🎓     | Strumenti per studenti e educazione     |
| **Other**               | ♻️     | Altri strumenti specializzati           |

## 📧 Sistema Feedback e Segnalazioni

### Form Suggerisci Tool

Il nuovo sistema utilizza **EmailJS** per l'invio automatico di email:

- Form completo con rating a stelle funzionante
- Validazione client-side e server-side
- Invio email automatico senza server backend
- Notifiche di successo/errore user-friendly

### Segnalazione Bug

Sistema dedicato per il feedback degli utenti:

- Pulsante "Segnalazione Bug" integrato nel footer
- Form dedicato per bug report dettagliati
- Invio tramite EmailJS con template personalizzato
- Tracciamento segnalazioni per miglioramenti continui

## 🗂️ Struttura Tool Aggiornata

```json
{
  "id": 1,
  "name": "ChatGPT",
  "category": "🤖 Chat/Agents",
  "description": "Conversational AI con GPT-4o, ricerca web, analisi immagini",
  "plan": "Freemium",
  "rating": 5,
  "url": "https://chat.openai.com",
  "domain": "openai.com",
  "tags": ["conversazione", "codice", "ricerca"],
  "featured": true,
  "dateAdded": "2024-01-15"
}
```

### Piani Supportati

- `"Free"` - Completamente gratuito
- `"Freemium"` - Piano base gratuito + features premium
- `"Paid"` - Solo a pagamento

## 🔧 Come Aggiungere Nuovi AI Tools

### Metodo 1: Form Suggerimenti (Raccomandato)

Usa il form integrato su `/suggest-tool.html`:

- Rating interattivo con stelle funzionanti
- Validazione completa dei campi
- Invio automatico tramite EmailJS
- Notifica di conferma all'utente

### Metodo 2: Modifica Diretta JSON

```json
{
  "id": 999,
  "name": "Nuovo AI Tool",
  "category": "🤖 Chat/Agents",
  "description": "Descrizione completa del tool...",
  "plan": "Freemium",
  "rating": 4,
  "url": "https://nuovo-tool.com",
  "domain": "nuovo-tool.com",
  "tags": ["tag1", "tag2", "tag3"],
  "featured": false,
  "dateAdded": "2024-12-01"
}
```

## 🔒 Privacy e Sicurezza

- **GDPR Compliant** - Banner consenso cookie e privacy policy dedicata
- **Headers sicurezza** - CSP, X-Frame-Options, etc.
- **IP Anonimizzazione** - Google Analytics configurato per privacy
- **Nessun tracking** - Senza consenso utente
- **Dati locali** - Bookmarks salvati solo localmente
- **EmailJS Security** - Invio email senza esposizione credenziali
- **Form Protection** - Validazione e sanitizzazione input

## 🧹 Gestione Cache Browser

Per una migliore esperienza d'uso, si consiglia di **svuotare la cache del browser** dopo gli aggiornamenti:

### Chrome (Windows/Mac/Linux)

- `Ctrl + Shift + Delete` (Windows/Linux)
- `Cmd + Shift + Delete` (Mac)
- Seleziona "Immagini e file nella cache"

### Firefox (Windows/Mac/Linux)

- `Ctrl + Shift + Delete` (Windows/Linux)
- `Cmd + Shift + Delete` (Mac)
- Seleziona "Cache"

### Safari (Mac)

- `Cmd + Option + E` per svuotare cache
- Oppure: Develop > Empty Caches

### Edge (Windows/Mac)

- `Ctrl + Shift + Delete`
- Seleziona "Immagini e file memorizzati nella cache"

### Mobile (iOS/Android)

- **iOS Safari**: Impostazioni > Safari > Cancella dati siti web
- **Android Chrome**: Impostazioni > Privacy > Cancella dati di navigazione

💡 **Tip**: Usa `Ctrl + F5` (Windows) o `Cmd + Shift + R` (Mac) per ricaricare forzatamente la pagina bypassando la cache.

## ⌨️ Keyboard Shortcuts

- `Ctrl + K` - Apri ricerca
- `Ctrl + F` - Mostra/nascondi filtri avanzati
- `Esc` - Pulisci ricerca
- `Ctrl + H` - Mostra guida shortcuts
- `F5` - Ricarica pagina
- `Ctrl + F5` - Ricarica ignorando cache

## 📈 Performance e Analytics

### Metriche Performance

- **Lighthouse Score**: 95+ su tutte le metriche
- **First Contentful Paint**: < 1.5s
- **Largest Contentful Paint**: < 2.5s
- **Cumulative Layout Shift**: < 0.1
- **Progressive Enhancement**: Funziona anche senza JavaScript

### Analytics Implementate

- **Google Analytics 4** - Con consenso GDPR
- **Click tracking** - Su tutti i tool links
- **Search analytics** - Query più popolari
- **Form submissions** - Tracciamento suggerimenti e segnalazioni
- **Performance monitoring** - Core Web Vitals

## 🤝 Contribuire

Le contribuzioni sono benvenute! Segui queste linee guida:

### Come Contribuire

1. **Fork** il repository
2. **Crea branch** per la feature (`git checkout -b feature/NuovaFeature`)
3. **Commit** le modifiche (`git commit -m 'Aggiunta NuovaFeature'`)
4. **Push** al branch (`git push origin feature/NuovaFeature`)
5. **Apri Pull Request**

### Tipi di Contribuzioni

- ✅ **Nuovi AI Tools** - Aggiungi strumenti mancanti
- ✅ **Bug fixes** - Correggi problemi esistenti
- ✅ **Miglioramenti UX** - Design e usabilità
- ✅ **Performance** - Ottimizzazioni velocità
- ✅ **Documentazione** - README, commenti codice
- ✅ **Traduzioni** - Supporto multilingua
- ✅ **Nuove categorie** - Espansione tassonomia
- ✅ **Integrazioni** - Nuovi servizi esterni

### Linee Guida

- Testa sempre localmente prima del commit
- Mantieni descrizioni concise ma informative
- Verifica che icone e link funzionino
- Rispetta la struttura dati esistente
- Includi screenshot per modifiche UI
- Testa il form suggerimenti e segnalazioni
- Verifica funzionamento su mobile

## 📊 Statistiche Progetto

- **🚀 Performance**: Lighthouse 95+ su tutte le metriche
- **📱 Mobile**: Fully responsive design
- **♿ Accessibility**: WCAG 2.1 AA compliant
- **🔍 SEO**: Structured data, meta tags ottimizzati
- **⚡ Speed**: < 2s first contentful paint
- **💾 Size**: Bundle totale < 500KB
- **🗂️ Categorie**: 22 categorie complete
- **📧 Forms**: Sistema EmailJS integrato
- **🔒 Privacy**: GDPR compliant con policy dedicata

## 📄 Licenza

Questo progetto è sotto licenza MIT - vedi il file [LICENSE](LICENSE) per dettagli.

## 🙏 Credits

- **Design ispirazione** - Directory AI moderne
- **Icone tool** - [Clearbit Logo API](https://clearbit.com/logo)
- **Hosting gratuito** - [Netlify](https://netlify.com/)
- **Email service** - [EmailJS](https://emailjs.com/)
- **Icona app** - Design custom con gradiente blu-viola
- **Performance** - Ottimizzazioni Lighthouse

## 📞 Contatti

- **Developer**: [Antonio DEM](https://github.com/AntonioDEM)
- **GitHub Issues**: [Segnala problemi](https://github.com/AntonioDEM/ai-toolkit-directory/issues)
- **Pull Requests**: [Contribuisci](https://github.com/AntonioDEM/ai-toolkit-directory/pulls)
- **Segnala Bug**: Usa il pulsante integrato nel sito
- **Suggerisci Tool**: Usa il form dedicato `/suggest-tool.html`

------

<div align="center">

**⭐ Se questo progetto ti è utile, lascia una stella! ⭐**

[![GitHub stars](https://img.shields.io/github/stars/AntonioDEM/ai-toolkit-directory.svg?style=social&label=Star)](https://github.com/AntonioDEM/ai-toolkit-directory/stargazers)

**Made with ❤️ for the AI community**





