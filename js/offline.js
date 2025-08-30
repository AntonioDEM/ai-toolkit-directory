// offline.js - Gestione della pagina offline

class OfflineManager {
    constructor() {
        this.init();
    }

    init() {
        this.checkConnection();
        this.setupEventListeners();
        this.startConnectionMonitoring();
    }

    checkConnection() {
        if (navigator.onLine) {
            this.updateUIForOnline();
        } else {
            this.updateUIForOffline();
        }
    }

    setupEventListeners() {
        // Ascolta i cambiamenti di connessione
        window.addEventListener('online', () => {
            this.handleConnectionRestored();
        });

        window.addEventListener('offline', () => {
            this.handleConnectionLost();
        });

        // Gestione del click sul pulsante di riprova
        const retryBtn = document.querySelector('.btn-retry');
        if (retryBtn) {
            retryBtn.addEventListener('click', () => {
                this.handleRetry();
            });
        }
    }

    startConnectionMonitoring() {
        // Controlla periodicamente lo stato della connessione
        setInterval(() => {
            this.checkConnection();
        }, 30000); // Controlla ogni 30 secondi
    }

    handleConnectionRestored() {
        console.log('Connessione ripristinata');
        this.updateUIForOnline();
        
        // Mostra un messaggio temporaneo
        this.showTemporaryMessage('Connessione ripristinata!', 'success');
        
        // Aggiorna automaticamente dopo 2 secondi
        setTimeout(() => {
            if (window.location.pathname === '/offline.html') {
                window.location.href = '/';
            }
        }, 2000);
    }

    handleConnectionLost() {
        console.log('Connessione persa');
        this.updateUIForOffline();
    }

    handleRetry() {
        const retryBtn = document.querySelector('.btn-retry');
        if (retryBtn) {
            retryBtn.textContent = 'Verifica connessione...';
            retryBtn.disabled = true;
            
            setTimeout(() => {
                this.checkConnection();
                retryBtn.textContent = 'Riprova';
                retryBtn.disabled = false;
            }, 2000);
        }
    }

    updateUIForOnline() {
        const retryBtn = document.querySelector('.btn-retry');
        if (retryBtn) {
            retryBtn.textContent = 'Connessione ripristinata';
            retryBtn.classList.add('connection-restored');
        }
    }

    updateUIForOffline() {
        const retryBtn = document.querySelector('.btn-retry');
        if (retryBtn) {
            retryBtn.textContent = 'Riprova';
            retryBtn.classList.remove('connection-restored');
        }
    }

    showTemporaryMessage(message, type = 'info') {
        // Crea e mostra un messaggio temporaneo
        const messageDiv = document.createElement('div');
        messageDiv.className = `offline-message offline-message-${type}`;
        messageDiv.textContent = message;
        messageDiv.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 12px 20px;
            border-radius: 6px;
            color: white;
            font-weight: 500;
            z-index: 1000;
            animation: slideIn 0.3s ease;
        `;

        if (type === 'success') {
            messageDiv.style.backgroundColor = '#10b981';
        } else {
            messageDiv.style.backgroundColor = '#3b82f6';
        }

        document.body.appendChild(messageDiv);

        // Rimuovi il messaggio dopo 3 secondi
        setTimeout(() => {
            if (messageDiv.parentNode) {
                messageDiv.parentNode.removeChild(messageDiv);
            }
        }, 3000);
    }

    // Metodo per verificare se una risorsa è disponibile in cache
    async isResourceCached(url) {
        try {
            const cache = await caches.open('static-v1.4.0');
            const response = await cache.match(url);
            return !!response;
        } catch (error) {
            console.error('Errore nel verificare la cache:', error);
            return false;
        }
    }

    // Metodo per ottenere risorse dalla cache
    async getCachedResource(url) {
        try {
            const cache = await caches.open('static-v1.4.0');
            const response = await cache.match(url);
            return response;
        } catch (error) {
            console.error('Errore nel recuperare dalla cache:', error);
            return null;
        }
    }
}

// Inizializza quando il DOM è pronto
document.addEventListener('DOMContentLoaded', () => {
    new OfflineManager();
});

// Aggiungi stili CSS per le animazioni
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    .offline-message {
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    }
`;
document.head.appendChild(style);

// Utility function per il service worker
if ('serviceWorker' in navigator) {
    // Registra il service worker se non è già registrato
    navigator.serviceWorker.getRegistration().then(registration => {
        if (!registration) {
            navigator.serviceWorker.register('/sw.js')
                .then(reg => {
                    console.log('Service Worker registrato con successo:', reg);
                })
                .catch(error => {
                    console.log('Registrazione Service Worker fallita:', error);
                });
        }
    });
}