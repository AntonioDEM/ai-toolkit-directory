// analytics.js - Google Analytics 4 Integration per AI Toolkit Directory

class AnalyticsManager {
    constructor() {
        this.GA_ID = 'G-VYXQK7WBXS'; // Sostituire con il tuo GA4 ID
        this.DEBUG = false; // Imposta su true per debug
        this.initialized = false;
        
        this.init();
    }

    async init() {
        try {
            // Controlla consenso GDPR (opzionale)
            const consent = this.checkConsentStatus();
            if (!consent) {
                this.showConsentBanner();
                return;
            }

            await this.loadGoogleAnalytics();
            this.setupEventTracking();
            this.trackPageView();
            this.initialized = true;
            
            if (this.DEBUG) {
                console.log('[Analytics] Initialized successfully');
            }
        } catch (error) {
            console.error('[Analytics] Initialization failed:', error);
        }
    }

    async loadGoogleAnalytics() {
        return new Promise((resolve, reject) => {
            // Carica Google Analytics script
            const script = document.createElement('script');
            script.async = true;
            script.src = `https://www.googletagmanager.com/gtag/js?id=${this.GA_ID}`;
            script.onload = () => {
                // Inizializza gtag
                window.dataLayer = window.dataLayer || [];
                function gtag() { dataLayer.push(arguments); }
                window.gtag = gtag;

                gtag('js', new Date());
                gtag('config', this.GA_ID, {
                    // Configurazioni privacy-friendly
                    anonymize_ip: true,
                    allow_google_signals: false,
                    allow_ad_personalization_signals: false,
                    // Configurazioni custom
                    custom_map: {
                        'custom_parameter_1': 'tool_category',
                        'custom_parameter_2': 'tool_plan'
                    }
                });

                resolve();
            };
            script.onerror = reject;
            document.head.appendChild(script);
        });
    }

    setupEventTracking() {
        // Track outbound link
        window.gtag('event', 'click', {
            event_category: 'outbound',
            event_label: linkElement.href,
            transport_type: 'beacon'
        });

        if (this.DEBUG) {
            console.log('[Analytics] Tool click tracked:', eventData);
        }
    }

    trackSearch(query) {
        if (!this.initialized || !window.gtag) return;

        const eventData = {
            event_category: 'Search',
            event_label: query.toLowerCase(),
            search_term: query
        };

        window.gtag('event', 'search', eventData);

        if (this.DEBUG) {
            console.log('[Analytics] Search tracked:', eventData);
        }
    }

    trackFilterUsage(category) {
        if (!this.initialized || !window.gtag) return;

        const eventData = {
            event_category: 'Filter Usage',
            event_label: category,
            filter_type: 'category'
        };

        window.gtag('event', 'filter_used', eventData);

        if (this.DEBUG) {
            console.log('[Analytics] Filter usage tracked:', eventData);
        }
    }

    trackSuggestTool(toolData) {
        if (!this.initialized || !window.gtag) return;

        const eventData = {
            event_category: 'User Engagement',
            event_label: 'Tool Suggestion',
            suggested_category: toolData.category || 'Unknown',
            suggested_plan: toolData.pricing || 'Unknown'
        };

        window.gtag('event', 'suggest_tool', eventData);

        if (this.DEBUG) {
            console.log('[Analytics] Tool suggestion tracked:', eventData);
        }
    }

    trackBookmark(toolName, action) {
        if (!this.initialized || !window.gtag) return;

        const eventData = {
            event_category: 'User Engagement',
            event_label: `${action} Bookmark`,
            tool_name: toolName,
            bookmark_action: action
        };

        window.gtag('event', 'bookmark', eventData);

        if (this.DEBUG) {
            console.log('[Analytics] Bookmark tracked:', eventData);
        }
    }

    trackShare(toolName, method) {
        if (!this.initialized || !window.gtag) return;

        const eventData = {
            event_category: 'Social Sharing',
            event_label: toolName,
            method: method,
            content_type: 'tool'
        };

        window.gtag('event', 'share', eventData);

        if (this.DEBUG) {
            console.log('[Analytics] Share tracked:', eventData);
        }
    }

    setupScrollTracking() {
        let scrollThresholds = [25, 50, 75, 90];
        let trackedThresholds = new Set();

        const trackScrollDepth = () => {
            const scrollPercent = Math.round(
                (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100
            );

            scrollThresholds.forEach(threshold => {
                if (scrollPercent >= threshold && !trackedThresholds.has(threshold)) {
                    trackedThresholds.add(threshold);
                    
                    if (this.initialized && window.gtag) {
                        window.gtag('event', 'scroll', {
                            event_category: 'User Engagement',
                            event_label: `${threshold}% Scrolled`,
                            scroll_depth: threshold
                        });
                    }
                }
            });
        };

        let scrollTimeout;
        window.addEventListener('scroll', () => {
            clearTimeout(scrollTimeout);
            scrollTimeout = setTimeout(trackScrollDepth, 250);
        });
    }

    setupTimeTracking() {
        const startTime = Date.now();
        let timeSpent = 0;
        let isActive = true;

        // Track time intervals
        const timeIntervals = [30, 60, 120, 300]; // secondi
        const trackedIntervals = new Set();

        const trackTimeSpent = () => {
            if (!isActive) return;
            
            timeSpent = Math.floor((Date.now() - startTime) / 1000);
            
            timeIntervals.forEach(interval => {
                if (timeSpent >= interval && !trackedIntervals.has(interval)) {
                    trackedIntervals.add(interval);
                    
                    if (this.initialized && window.gtag) {
                        window.gtag('event', 'timing_complete', {
                            name: 'time_on_site',
                            value: interval,
                            event_category: 'User Engagement'
                        });
                    }
                }
            });
        };

        // Track user activity
        const activityEvents = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'];
        activityEvents.forEach(event => {
            document.addEventListener(event, () => {
                isActive = true;
            });
        });

        // Check for inactivity
        setInterval(() => {
            trackTimeSpent();
            isActive = false;
        }, 10000);

        // Track time when leaving page
        window.addEventListener('beforeunload', () => {
            const finalTimeSpent = Math.floor((Date.now() - startTime) / 1000);
            if (this.initialized && window.gtag) {
                window.gtag('event', 'timing_complete', {
                    name: 'session_duration',
                    value: finalTimeSpent,
                    event_category: 'User Engagement',
                    transport_type: 'beacon'
                });
            }
        });
    }

    // Performance tracking
    trackPerformance() {
        if (!this.initialized || !window.gtag || !window.performance) return;

        window.addEventListener('load', () => {
            setTimeout(() => {
                const perfData = window.performance.timing;
                const loadTime = perfData.loadEventEnd - perfData.navigationStart;
                const domReady = perfData.domContentLoadedEventEnd - perfData.navigationStart;

                // Track page load time
                window.gtag('event', 'timing_complete', {
                    name: 'page_load_time',
                    value: loadTime,
                    event_category: 'Performance'
                });

                // Track DOM ready time
                window.gtag('event', 'timing_complete', {
                    name: 'dom_ready_time',
                    value: domReady,
                    event_category: 'Performance'
                });

                if (this.DEBUG) {
                    console.log('[Analytics] Performance tracked:', {
                        loadTime,
                        domReady
                    });
                }
            }, 1000);
        });
    }

    // Error tracking
    trackError(error, errorInfo = {}) {
        if (!this.initialized || !window.gtag) return;

        const eventData = {
            event_category: 'JavaScript Error',
            event_label: error.message || 'Unknown Error',
            error_type: error.name || 'Error',
            error_stack: error.stack || 'No stack trace',
            ...errorInfo
        };

        window.gtag('event', 'exception', {
            description: eventData.event_label,
            fatal: false
        });

        if (this.DEBUG) {
            console.log('[Analytics] Error tracked:', eventData);
        }
    }

    // GDPR Compliance
    checkConsentStatus() {
        // Controlla se c'è consenso salvato
        const consent = localStorage.getItem('analytics-consent');
        return consent === 'granted';
    }

    showConsentBanner() {
        const banner = document.createElement('div');
        banner.className = 'cookie-consent-banner';
        banner.innerHTML = `
            <div class="consent-content">
                <div class="consent-text">
                    <h4>🍪 Cookie e Analytics</h4>
                    <p>Utilizziamo Google Analytics per migliorare l'esperienza utente. I dati sono anonimizzati.</p>
                </div>
                <div class="consent-actions">
                    <button id="acceptConsent" class="btn-consent-accept">Accetta</button>
                    <button id="rejectConsent" class="btn-consent-reject">Rifiuta</button>
                </div>
            </div>
        `;

        banner.style.cssText = `
            position: fixed;
            bottom: 0;
            left: 0;
            right: 0;
            background: rgba(0,0,0,0.9);
            color: white;
            padding: 20px;
            z-index: 10000;
            backdrop-filter: blur(10px);
        `;

        const style = document.createElement('style');
        style.textContent = `
            .consent-content {
                max-width: 1200px;
                margin: 0 auto;
                display: flex;
                justify-content: space-between;
                align-items: center;
                gap: 20px;
            }
            .consent-text h4 {
                margin: 0 0 8px 0;
                font-size: 1.1rem;
            }
            .consent-text p {
                margin: 0;
                opacity: 0.9;
            }
            .consent-actions {
                display: flex;
                gap: 12px;
                white-space: nowrap;
            }
            .btn-consent-accept,
            .btn-consent-reject {
                padding: 8px 16px;
                border: none;
                border-radius: 6px;
                font-weight: 500;
                cursor: pointer;
                transition: all 0.3s ease;
            }
            .btn-consent-accept {
                background: #10b981;
                color: white;
            }
            .btn-consent-reject {
                background: transparent;
                color: white;
                border: 1px solid rgba(255,255,255,0.3);
            }
            .btn-consent-accept:hover {
                background: #059669;
            }
            .btn-consent-reject:hover {
                background: rgba(255,255,255,0.1);
            }
            @media (max-width: 768px) {
                .consent-content {
                    flex-direction: column;
                    text-align: center;
                }
            }
        `;

        document.head.appendChild(style);
        document.body.appendChild(banner);

        // Event listeners
        document.getElementById('acceptConsent').addEventListener('click', () => {
            this.grantConsent();
            banner.remove();
        });

        document.getElementById('rejectConsent').addEventListener('click', () => {
            this.rejectConsent();
            banner.remove();
        });
    }

    grantConsent() {
        localStorage.setItem('analytics-consent', 'granted');
        this.init(); // Riprova inizializzazione
    }

    rejectConsent() {
        localStorage.setItem('analytics-consent', 'denied');
        console.log('[Analytics] User rejected analytics consent');
    }

    // Utility methods
    trackCustomEvent(eventName, eventData = {}) {
        if (!this.initialized || !window.gtag) return;

        window.gtag('event', eventName, {
            event_category: 'Custom',
            ...eventData
        });

        if (this.DEBUG) {
            console.log('[Analytics] Custom event tracked:', eventName, eventData);
        }
    }

    updateUserId(userId) {
        if (!this.initialized || !window.gtag) return;

        window.gtag('config', this.GA_ID, {
            user_id: userId
        });
    }

    setUserProperties(properties) {
        if (!this.initialized || !window.gtag) return;

        window.gtag('set', 'user_properties', properties);
    }
}

// Global error handler
window.addEventListener('error', (event) => {
    if (window.analyticsManager) {
        window.analyticsManager.trackError(event.error, {
            filename: event.filename,
            lineno: event.lineno,
            colno: event.colno
        });
    }
});

// Promise rejection handler
window.addEventListener('unhandledrejection', (event) => {
    if (window.analyticsManager) {
        window.analyticsManager.trackError(new Error(event.reason), {
            type: 'Promise Rejection'
        });
    }
});

// Initialize analytics when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.analyticsManager = new AnalyticsManager();
});

// Export per uso in altri script
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AnalyticsManager;
} tool clicks
        document.addEventListener('click', (event) => {
            const link = event.target.closest('a[href*="http"]');
            if (link && !link.hostname.includes(window.location.hostname)) {
                this.trackToolClick(link);
            }
        });

        // Track search usage
        const searchInput = document.getElementById('searchInput');
        if (searchInput) {
            let searchTimeout;
            searchInput.addEventListener('input', (event) => {
                clearTimeout(searchTimeout);
                searchTimeout = setTimeout(() => {
                    if (event.target.value.length > 2) {
                        this.trackSearch(event.target.value);
                    }
                }, 1000);
            });
        }

        // Track filter usage
        document.addEventListener('click', (event) => {
            if (event.target.classList.contains('filter-btn')) {
                this.trackFilterUsage(event.target.dataset.category);
            }
        });

        // Track scroll depth
        this.setupScrollTracking();

        // Track time on site
        this.setupTimeTracking();
    }

    // Event tracking methods
    trackPageView(page = null) {
        if (!this.initialized || !window.gtag) return;

        const pageData = {
            page_title: document.title,
            page_location: page || window.location.href,
            page_referrer: document.referrer
        };

        window.gtag('event', 'page_view', pageData);
        
        if (this.DEBUG) {
            console.log('[Analytics] Page view tracked:', pageData);
        }
    }

    trackToolClick(linkElement) {
        if (!this.initialized || !window.gtag) return;

        const card = linkElement.closest('.tool-card');
        const toolName = card?.querySelector('.tool-title')?.textContent || 'Unknown';
        const toolCategory = card?.dataset.category || 'Unknown';
        const toolPlan = card?.dataset.plan || 'Unknown';

        const eventData = {
            event_category: 'Tool Interaction',
            event_label: toolName,
            custom_parameter_1: toolCategory,
            custom_parameter_2: toolPlan,
            value: 1
        };

        window.gtag('event', 'tool_click', eventData);

        // Track
