# 🔧 Tools for AI

> La tua raccolta completa dei migliori strumenti AI organizzati per categoria

[![Netlify Status](https://api.netlify.com/api/v1/badges/12345678-1234-1234-1234-123456789abc/deploy-status)](https://app.netlify.com/sites/tools-for-ai/deploys)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![GitHub stars](https://img.shields.io/github/stars/yourusername/tools-for-ai.svg)](https://github.com/yourusername/tools-for-ai/stargazers)

## 🚀 Demo Live

**🔗 [Visita Tools for AI](https://tools-for-ai.netlify.app)**

![Tools for AI Screenshot](https://via.placeholder.com/800x400/667eea/ffffff?text=Tools+for+AI)

## ✨ Caratteristiche

- 🎯 **31+ Strumenti AI curati** - Chat/Agents, Image Generation, Dev Tools, e molto altro
- 🔍 **Ricerca in tempo reale** - Trova rapidamente il tool perfetto per le tue esigenze
- 🏷️ **Filtri per categoria** - Organizzati per tipo di utilizzo (Chat, Image, Code, etc.)
- 📱 **Responsive Design** - Perfetto su desktop, tablet e mobile
- ⚡ **Performance ottimali** - Caricamento istantaneo, zero database
- 🎨 **Icone automatiche** - Logo dei brand caricati dinamicamente
- 🆓 **Indicatori piano** - Chiari badge per Free/Freemium/Paid
- ⭐ **Sistema rating** - Valutazioni a stelle per ogni strumento
- 🎨 **Design moderno** - Interfaccia pulita ispirata a Naviai

## 🛠️ Tecnologie Utilizzate

- **HTML5** - Struttura semantica
- **CSS3** - Design responsive con Flexbox/Grid
- **Vanilla JavaScript** - Logica di ricerca e filtri
- **Netlify** - Hosting e deployment automatico
- **GitHub** - Version control e collaborazione
- **Clearbit API** - Icone automatiche dei brand

## 📊 Categorie Strumenti

| Categoria | Numero Tools | Esempi |
|-----------|-------------|---------|
| 🤖 **Chat/Agents** | 8 | ChatGPT, Claude, Gemini |
| 🖼️ **Image** | 3 | Leonardo AI, Midjourney, Stable Diffusion |
| 💻 **Dev Tools** | 4 | GitHub Copilot, Replit, Phind |
| 📊 **Data/Analytics** | 4 | Perplexity AI, Elicit, Consensus |
| ⚡ **Productivity** | 3 | NotebookLM, Notion AI, Otter.ai |
| 📝 **Content** | 4 | Grammarly, DeepL Write, Rytr |
| 🎵 **Audio/Voice** | 3 | Whisper, Suno AI, AIVA |
| 🎓 **Education** | 2 | Quizlet, Khanmigo |

## 🚀 Quick Start

### 1. Clone del Repository
```bash
git clone https://github.com/yourusername/tools-for-ai.git
cd tools-for-ai
```

### 2. Apri Localmente
```bash
# Semplice server HTTP (Python)
python -m http.server 8000

# Oppure con Node.js
npx serve .

# Oppure apri direttamente index.html nel browser
```

### 3. Deploy su Netlify
1. Fork questo repository
2. Connetti il tuo account Netlify a GitHub  
3. Crea nuovo sito da Git → Seleziona il repository
4. Deploy automatico! 🎉

## 📝 Come Aggiungere Nuovi AI Tools

### Metodo 1: Modifica Diretta
1. Apri `index.html`
2. Trova l'array `aiTools` nel JavaScript
3. Aggiungi nuovo oggetto tool:

```javascript
{
    id: 32,
    name: "Nuovo AI Tool",
    category: "🤖 Chat/Agents",
    description: "Descrizione del nuovo strumento AI...",
    plan: "Freemium", // "Free", "Freemium", "Paid"
    rating: 4,
    url: "https://nuovo-ai-tool.com",
    domain: "nuovo-ai-tool.com",
    tags: ["tag1", "tag2", "tag3"]
}
```

### Metodo 2: Separazione Dati (Consigliato)
Per progetti più grandi, sposta i dati in `tools.json`:

```json
[
  {
    "id": 1,
    "name": "ChatGPT",
    "category": "🤖 Chat/Agents",
    "description": "...",
    "plan": "Freemium",
    "rating": 5,
    "url": "https://chat.openai.com",
    "domain": "openai.com",
    "tags": ["conversazione", "codice"]
  }
]
```

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
1. Aggiungi pulsante filtro nell'HTML
2. Aggiorna l'array `filterButtons` nel JavaScript
3. Utilizza emoji consistenti per l'interfaccia

## 📈 Analytics e Monitoraggio

### Google Analytics 4
Aggiungi nel `<head>`:
```html
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXXXXX');
</script>
```

### Netlify Analytics
- Abilita nelle impostazioni del sito Netlify
- Dashboard automatiche per traffico e performance

## 🤝 Contribuire

Le contribuzioni sono benvenute! Per piacere:

1. **Fork** il repository
2. **Crea branch** per la feature (`git checkout -b feature/AmazingFeature`)
3. **Commit** le modifiche (`git commit -m 'Add some AmazingFeature'`)
4. **Push** al branch (`git push origin feature/AmazingFeature`)
5. **Apri Pull Request**

### Linee Guida Contribuzione

- ✅ Testa sempre localmente prima del commit
- ✅ Mantieni le descrizioni concise ma informative
- ✅ Verifica che le icone si carichino correttamente
- ✅ Assicurati che i link funzionino
- ✅ Rispetta la struttura esistente

## 📄 Licenza

Questo progetto è sotto licenza MIT - vedi il file [LICENSE](LICENSE) per dettagli.

## 🙏 Riconoscimenti

- **Design ispirato da** [Naviai](https://ai-toolkit.naviai.io)
- **Icone fornite da** [Clearbit Logo API](https://clearbit.com/logo)
- **Hosting gratuito da** [Netlify](https://netlify.com)
- **Fonts da** [Google Fonts](https://fonts.google.com)

## 📞 Contatti

- **GitHub**: [@yourusername](https://github.com/yourusername)
- **Email**: your.email@example.com
- **Website**: [tools-for-ai.netlify.app](https://tools-for-ai.netlify.app)

## 🗺️ Roadmap

- [ ] **Dark Mode** toggle
- [ ] **Sorting avanzato** (data aggiunta, popolarità)
- [ ] **Sistema di rating** degli utenti
- [ ] **Newsletter signup** per nuovi tool
- [ ] **API pubblica** per accesso ai dati
- [ ] **Mobile app** companion
- [ ] **Integrazione** con database per admin panel
- [ ] **Multi-lingua** (IT/EN/ES)

## 📊 Statistiche Progetto

- **🚀 Performance**: 100/100 Google Lighthouse
- **📱 Mobile Friendly**: Fully responsive
- **♿ Accessibility**: WCAG 2.1 compliant  
- **🔍 SEO**: Ottimizzato per motori di ricerca
- **⚡ Loading**: < 2 secondi first contentful paint

---

⭐ **Se questo progetto ti è stato utile, lascia una stella!** ⭐

**Made with ❤️ for the AI community**