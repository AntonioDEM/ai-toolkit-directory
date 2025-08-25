# AI Toolkit Directory

> Directory curata dei migliori strumenti AI organizzati per categoria, con filtri avanzati e funzionalità PWA

[![Netlify Status](https://api.netlify.com/api/v1/badges/f5fa92f3-4ea9-48b3-9977-f4109d0159ed/deploy-status)](https://app.netlify.com/projects/tools-for-ai/deploys)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![GitHub stars](https://img.shields.io/github/stars/AntonioDEM/ai-toolkit-directory.svg)](https://github.com/AntonioDEM/ai-toolkit-directory/stargazers)
[![PWA Ready](https://img.shields.io/badge/PWA-Ready-blue.svg)](https://web.dev/progressive-web-apps/)

## 🚀 Demo Live

**[🔗 Visita AI Toolkit Directory](https://your-site.netlify.app)**


## ✨ Caratteristiche Principali

- 🎯 **31+ Strumenti AI curati** - Collezione completa organizzata per categoria
- 🔍 **Ricerca intelligente** - Trova rapidamente il tool perfetto
- 🔧 **Filtri avanzati** - Per prezzo, rating, categoria con combinazioni multiple
- 📝 **Form suggerisci tool** - Contribuisci alla directory con nuovi strumenti
- 📱 **PWA installabile** - Funziona offline, installabile su tutti i dispositivi
- 📊 **Google Analytics 4** - Monitoraggio GDPR compliant con consenso
- 🔖 **Bookmark system** - Salva i tuoi tool preferiti
- ⌨️ **Keyboard shortcuts** - Navigazione rapida per power users
- 📱 **Design responsive** - Perfetto su desktop, tablet e mobile
- ⚡ **Performance ottimali** - Lighthouse score 95+ con caching intelligente

## 🛠️ Tecnologie e Architettura

### Frontend
- **HTML5** - Struttura semantica con accessibility
- **CSS3** - Design system con variabili custom, Grid/Flexbox
- **Vanilla JavaScript ES6+** - Architettura modulare, nessuna dipendenza
- **PWA** - Service Worker, Web App Manifest, offline support

### Backend e Deployment
- **Netlify** - Hosting, CDN globale, build automation
- **JSON Database** - Dati strutturati senza server database
- **Netlify Functions** - Serverless per form handling (opzionale)

### Integrations
- **Clearbit Logo API** - Icone brand automatiche
- **Google Analytics 4** - Analytics privacy-first
- **Web Share API** - Condivisione nativa dispositivi

## 📂 Struttura del Progetto

```
ai-toolkit-directory/
├── index.html              # Pagina principale
├── suggest-tool.html       # Form suggerimenti
├── manifest.json          # PWA Manifest
├── sw.js                  # Service Worker
├── netlify.toml           # Configurazione deployment
├── css/
│   ├── styles.css         # Stili principali
│   └── enhanced-styles.css # Stili funzionalità avanzate
├── js/
│   ├── enhanced-app.js    # Logica principale
│   └── analytics.js       # Google Analytics 4
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

## 📊 Architettura dei Dati

### Struttura Tool

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

### Categorie Disponibili

| Categoria | Tools | Esempi Principali |
|-----------|-------|-------------------|
| 🤖 **Chat/Agents** | 7 | ChatGPT, Claude, Gemini |
| 🖼️ **Image** | 3 | Leonardo AI, Midjourney, Stable Diffusion |
| 💻 **Dev Tools** | 4 | GitHub Copilot, Phind, Replit |
| 📊 **Data/Analytics** | 4 | Perplexity AI, Elicit, Consensus |
| ⚡ **Productivity** | 3 | NotebookLM, Notion AI, Otter.ai |
| 📝 **Content** | 4 | Grammarly, DeepL Write, Rytr |
| 🎵 **Audio/Voice** | 3 | Whisper, Suno AI, AIVA |
| 🎓 **Education** | 2 | Quizlet, Khanmigo |
| 📢 **Marketing** | 1 | Buffer |

## 🔧 Come Aggiungere Nuovi AI Tools

### Metodo 1: Modifica data/ai-tools.json

```json
{
  "id": 32,
  "name": "Nuovo AI Tool",
  "category": "🤖 Chat/Agents",
  "description": "Descrizione completa del tool...",
  "plan": "Freemium",
  "rating": 4,
  "url": "https://nuovo-tool.com",
  "domain": "nuovo-tool.com",
  "tags": ["tag1", "tag2", "tag3"],
  "featured": false,
  "dateAdded": "2024-08-25"
}
```

### Metodo 2: Form Suggerimenti

Usa il form integrato su `/suggest-tool.html` per proporre nuovi strumenti.

### Piani Supportati
- `"Free"` - Completamente gratuito
- `"Freemium"` - Piano base gratuito + features premium
- `"Paid"` - Solo a pagamento

## 🎨 Personalizzazione

### Colori del Tema

```css
:root {
  --primary-gradient: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  --card-shadow: 0 8px 32px rgba(0,0,0,0.1);
  --text-primary: #1a202c;
  --text-secondary: #4a5568;
}
```

### Aggiungere Nuove Categorie

1. Modifica `data/ai-tools.json` sezione `categories`
2. Aggiungi emoji e descrizione consistenti
3. I filtri si aggiornano automaticamente

## 📈 Performance e Analytics

### Metriche Performance
- **Lighthouse Score**: 95+ su tutte le metriche
- **First Contentful Paint**: < 1.5s
- **Largest Contentful Paint**: < 2.5s
- **Cumulative Layout Shift**: < 0.1

### Analytics Implementate
- **Google Analytics 4** - Con consenso GDPR
- **Click tracking** - Su tutti i tool links
- **Search analytics** - Query più popolari
- **Performance monitoring** - Core Web Vitals

## ⌨️ Keyboard Shortcuts

- `Ctrl + K` - Apri ricerca
- `Ctrl + F` - Mostra/nascondi filtri avanzati
- `Esc` - Pulisci ricerca
- `Ctrl + H` - Mostra guida shortcuts

## 🔒 Privacy e Sicurezza

- **GDPR Compliant** - Banner consenso cookie
- **Headers sicurezza** - CSP, X-Frame-Options, etc.
- **IP Anonimizzazione** - Google Analytics configurato per privacy
- **Nessun tracking** - Senza consenso utente
- **Dati locali** - Bookmarks salvati solo localmente

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

### Linee Guida

- Testa sempre localmente prima del commit
- Mantieni descrizioni concise ma informative
- Verifica che icone e link funzionino
- Rispetta la struttura dati esistente
- Includi screenshot per modifiche UI

## 📊 Statistiche Progetto

- **🚀 Performance**: Lighthouse 95+ su tutte le metriche
- **📱 Mobile**: Fully responsive design
- **♿ Accessibility**: WCAG 2.1 AA compliant  
- **🔍 SEO**: Structured data, meta tags ottimizzati
- **⚡ Speed**: < 2s first contentful paint
- **💾 Size**: Bundle totale < 500KB

## 📄 Licenza

Questo progetto è sotto licenza MIT - vedi il file [LICENSE](LICENSE) per dettagli.

## 🙏 Credits

- **Design ispirazione** - Directory AI moderne
- **Icone tool** - [Clearbit Logo API](https://clearbit.com/logo)
- **Hosting gratuito** - [Netlify](https://netlify.com)
- **Icona app** - Design custom con gradiente blu-viola
- **Performance** - Ottimizzazioni Lighthouse

## 📞 Contatti

- **Developer**: [Antonio DEM](https://github.com/AntonioDEM)
- **GitHub Issues**: [Segnala problemi](https://github.com/AntonioDEM/ai-toolkit-directory/issues)
- **Pull Requests**: [Contribuisci](https://github.com/AntonioDEM/ai-toolkit-directory/pulls)

---

<div align="center">

**⭐ Se questo progetto ti è utile, lascia una stella! ⭐**

[![GitHub stars](https://img.shields.io/github/stars/AntonioDEM/ai-toolkit-directory.svg?style=social&label=Star)](https://github.com/AntonioDEM/ai-toolkit-directory/stargazers)

**Made with ❤️ for the AI community**
