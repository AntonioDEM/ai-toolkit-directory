// enhanced-app.js - App con filtri avanzati e funzionalità migliorate

class AIToolsDirectory {
    constructor() {
        this.tools = [];
        this.categories = [];
        this.currentFilters = {
            category: 'all',
            pricing: 'all',
            rating: 'all',
            search: ''
        };
        
        // DOM Elements
        this.toolsGrid = document.getElementById('toolsGrid');
        this.searchInput = document.getElementById('searchInput');
        this.toolsCount = document.getElementById('toolsCount');
        this.noResults = document.getElementById('noResults');
        this.filtersContainer = document.getElementById('filters');
        this.advancedFilters = document.getElementById('advancedFilters');
        this.sortSelect = document.getElementById('sortSelect');
        
        this.init();
    }

    async init() {
        try {
            await this.loadData();
            this.createAdvancedFilters();
            this.renderFilters();
            this.renderTools(this.tools);
            this.updateToolsCount(this.tools.length);
            this.bindEvents();
            this.hideLoader();
        } catch (error) {
            console.error('Errore durante l\'inizializzazione:', error);
            this.showError('Errore nel caricamento dei dati');
            this.hideLoader();
        }
    }

    async loadData() {
        try {
            const response = await fetch('./data/ai-tools.json');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            this.tools = data.tools;
            this.categories = data.categories;
        } catch (error) {
            console.error('Errore nel caricamento del JSON:', error);
            throw error;
        }
    }

    createAdvancedFilters() {
        const advancedFiltersHTML = `
            <div class="advanced-filters-toggle">
                <button id="toggleAdvanced" class="toggle-btn">
                    <span>🔍 Filtri Avanzati</span>
                    <span class="toggle-icon">▼</span>
                </button>
            </div>
            <div class="advanced-filters-panel" id="advancedPanel" style="display: none;">
                <div class="filter-section">
                    <div class="filter-group">
                        <label for="pricingFilter">💰 Prezzo</label>
                        <select id="pricingFilter" class="filter-select">
                            <option value="all">Tutti i piani</option>
                            <option value="Free">🆓 Solo Gratuiti</option>
                            <option value="Freemium">🟡 Freemium</option>
                            <option value="Paid">💰 A Pagamento</option>
                        </select>
                    </div>
                    
                    <div class="filter-group">
                        <label for="ratingFilter">⭐ Valutazione</label>
                        <select id="ratingFilter" class="filter-select">
                            <option value="all">Tutte le valutazioni</option>
                            <option value="5">⭐⭐⭐⭐⭐ 5 stelle</option>
                            <option value="4">⭐⭐⭐⭐ 4+ stelle</option>
                            <option value="3">⭐⭐⭐ 3+ stelle</option>
                        </select>
                    </div>
                    
                    <div class="filter-group">
                        <label for="sortSelect">📊 Ordina per</label>
                        <select id="sortSelect" class="filter-select">
                            <option value="name">Nome A-Z</option>
                            <option value="rating">Valutazione ↓</option>
                            <option value="category">Categoria</option>
                            <option value="plan">Piano prezzo</option>
                        </select>
                    </div>
                </div>
                
                <div class="filter-actions">
                    <button id="clearFilters" class="btn-clear">
                        🗑️ Resetta filtri
                    </button>
                    <div class="results-info">
                        <span id="filterInfo">Tutti i tools</span>
                    </div>
                </div>
            </div>
        `;

        // Inserisci i filtri avanzati dopo i filtri categoria
        const filtersContainer = document.querySelector('.filters');
        filtersContainer.insertAdjacentHTML('afterend', advancedFiltersHTML);
    }

    renderFilters() {
        this.filtersContainer.innerHTML = this.categories.map(category => `
            <button class="filter-btn ${category.id === 'all' ? 'active' : ''}" data-category="${category.id}">
                ${category.name}
            </button>
        `).join('');
    }

    renderTools(tools) {
        if (tools.length === 0) {
            this.toolsGrid.style.display = 'none';
            this.noResults.style.display = 'block';
            return;
        }

        this.toolsGrid.style.display = 'grid';
        this.noResults.style.display = 'none';

        const sortedTools = this.sortTools(tools);
        this.toolsGrid.innerHTML = sortedTools.map(tool => this.createToolCard(tool)).join('');
        
        // Animazione di entrata
        this.animateCards();
    }

    createToolCard(tool) {
        // Aggiungiamo più informazioni nella card
        const tagsHTML = tool.tags.slice(0, 3).map(tag => 
            `<span class="tag-small">${tag}</span>`
        ).join('');

        return `
            <div class="tool-card" data-category="${tool.category}" data-rating="${tool.rating}" data-plan="${tool.plan}">
                <div class="tool-header">
                    <div class="tool-icon">
                        <img src="https://logo.clearbit.com/${tool.domain}" 
                             alt="${tool.name}" 
                             onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
                        <div style="display:none; width:32px; height:32px; background:linear-gradient(45deg,#667eea,#764ba2); border-radius:6px; align-items:center; justify-content:center; color:white; font-weight:bold; font-size:14px;">
                            ${tool.name.charAt(0)}
                        </div>
                    </div>
                    <div class="tool-header-text">
                        <div class="tool-title">${tool.name}</div>
                        <div class="tool-rating">
                            <span class="stars">${'⭐'.repeat(tool.rating)}</span>
                            <span class="rating-text">${tool.rating}/5</span>
                        </div>
                    </div>
                    <div class="tool-bookmark" onclick="this.toggleBookmark(${tool.id})">
                        <span class="bookmark-icon">🔖</span>
                    </div>
                </div>
                
                <div class="tool-description">${tool.description}</div>
                
                <div class="tool-tags">
                    ${tagsHTML}
                </div>
                
                <div class="tool-meta">
                    <span class="tag tag-${tool.plan.toLowerCase()}">
                        ${this.getPlanLabel(tool.plan)}
                    </span>
                    <span class="tag tag-category">${tool.category}</span>
                </div>
                
                <div class="tool-actions">
                    <a href="${tool.url}" 
                       target="_blank" 
                       rel="noopener noreferrer" 
                       class="btn-primary"
                       onclick="this.trackClick('${tool.name}')">
                        Apri ${tool.name}
                        <span>→</span>
                    </a>
                    <button class="btn-secondary" onclick="this.shareTools('${tool.name}', '${tool.url}')">
                        📤
                    </button>
                </div>
            </div>
        `;
    }

    sortTools(tools) {
        const sortBy = this.sortSelect?.value || 'name';
        
        return [...tools].sort((a, b) => {
            switch (sortBy) {
                case 'rating':
                    return b.rating - a.rating;
                case 'category':
                    return a.category.localeCompare(b.category);
                case 'plan':
                    const planOrder = { 'Free': 0, 'Freemium': 1, 'Paid': 2 };
                    return planOrder[a.plan] - planOrder[b.plan];
                default:
                    return a.name.localeCompare(b.name);
            }
        });
    }

    getPlanLabel(plan) {
        const labels = {
            'Free': '🆓 Gratuito',
            'Freemium': '🟡 Freemium',
            'Paid': '💰 A pagamento'
        };
        return labels[plan] || plan;
    }

    bindEvents() {
        // Search
        this.searchInput.addEventListener('input', (e) => this.handleSearch(e));
        
        // Category filters
        this.filtersContainer.addEventListener('click', (e) => {
            if (e.target.classList.contains('filter-btn')) {
                this.handleCategoryFilter(e);
            }
        });

        // Advanced filters toggle
        const toggleBtn = document.getElementById('toggleAdvanced');
        const advancedPanel = document.getElementById('advancedPanel');
        const toggleIcon = toggleBtn.querySelector('.toggle-icon');

        toggleBtn.addEventListener('click', () => {
            const isVisible = advancedPanel.style.display !== 'none';
            advancedPanel.style.display = isVisible ? 'none' : 'block';
            toggleIcon.textContent = isVisible ? '▼' : '▲';
            toggleBtn.classList.toggle('active');
        });

        // Advanced filters
        const pricingFilter = document.getElementById('pricingFilter');
        const ratingFilter = document.getElementById('ratingFilter');
        const sortSelect = document.getElementById('sortSelect');
        const clearFilters = document.getElementById('clearFilters');

        if (pricingFilter) {
            pricingFilter.addEventListener('change', () => this.handleAdvancedFilter());
        }
        if (ratingFilter) {
            ratingFilter.addEventListener('change', () => this.handleAdvancedFilter());
        }
        if (sortSelect) {
            this.sortSelect = sortSelect;
            sortSelect.addEventListener('change', () => this.handleAdvancedFilter());
        }
        if (clearFilters) {
            clearFilters.addEventListener('click', () => this.clearAllFilters());
        }

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey || e.metaKey) {
                switch (e.key) {
                    case 'k':
                        e.preventDefault();
                        this.searchInput.focus();
                        break;
                    case 'f':
                        e.preventDefault();
                        toggleBtn.click();
                        break;
                }
            }
        });

        // Smooth scrolling for anchor links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({ behavior: 'smooth' });
                }
            });
        });
    }

    handleSearch(e) {
        this.currentFilters.search = e.target.value.toLowerCase();
        this.applyFilters();
    }

    handleCategoryFilter(e) {
        // Update active filter button
        this.filtersContainer.querySelectorAll('.filter-btn').forEach(btn => 
            btn.classList.remove('active')
        );
        e.target.classList.add('active');
        
        this.currentFilters.category = e.target.dataset.category;
        this.applyFilters();
    }

    handleAdvancedFilter() {
        const pricingFilter = document.getElementById('pricingFilter');
        const ratingFilter = document.getElementById('ratingFilter');

        if (pricingFilter) {
            this.currentFilters.pricing = pricingFilter.value;
        }
        if (ratingFilter) {
            this.currentFilters.rating = ratingFilter.value;
        }

        this.applyFilters();
        this.updateFilterInfo();
    }

    applyFilters() {
        let filteredTools = [...this.tools];

        // Apply category filter
        if (this.currentFilters.category !== 'all') {
            filteredTools = filteredTools.filter(tool => 
                tool.category === this.currentFilters.category
            );
        }

        // Apply pricing filter
        if (this.currentFilters.pricing !== 'all') {
            filteredTools = filteredTools.filter(tool => 
                tool.plan === this.currentFilters.pricing
            );
        }

        // Apply rating filter
        if (this.currentFilters.rating !== 'all') {
            const minRating = parseInt(this.currentFilters.rating);
            filteredTools = filteredTools.filter(tool => 
                tool.rating >= minRating
            );
        }

        // Apply search filter
        if (this.currentFilters.search) {
            filteredTools = filteredTools.filter(tool => 
                tool.name.toLowerCase().includes(this.currentFilters.search) ||
                tool.description.toLowerCase().includes(this.currentFilters.search) ||
                tool.category.toLowerCase().includes(this.currentFilters.search) ||
                tool.tags.some(tag => tag.toLowerCase().includes(this.currentFilters.search))
            );
        }

        this.renderTools(filteredTools);
        this.updateToolsCount(filteredTools.length);
    }

    clearAllFilters() {
        this.currentFilters = {
            category: 'all',
            pricing: 'all',
            rating: 'all',
            search: ''
        };

        // Reset UI elements
        this.searchInput.value = '';
        document.getElementById('pricingFilter').value = 'all';
        document.getElementById('ratingFilter').value = 'all';
        document.getElementById('sortSelect').value = 'name';

        // Reset category buttons
        this.filtersContainer.querySelectorAll('.filter-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        this.filtersContainer.querySelector('[data-category="all"]').classList.add('active');

        this.applyFilters();
        this.updateFilterInfo();
    }

    updateFilterInfo() {
        const filterInfo = document.getElementById('filterInfo');
        const activeFilters = [];

        if (this.currentFilters.category !== 'all') {
            activeFilters.push(`Categoria: ${this.currentFilters.category}`);
        }
        if (this.currentFilters.pricing !== 'all') {
            activeFilters.push(`Prezzo: ${this.currentFilters.pricing}`);
        }
        if (this.currentFilters.rating !== 'all') {
            activeFilters.push(`Rating: ${this.currentFilters.rating}+ stelle`);
        }
        if (this.currentFilters.search) {
            activeFilters.push(`Ricerca: "${this.currentFilters.search}"`);
        }

        if (activeFilters.length === 0) {
            filterInfo.textContent = 'Tutti i tools';
        } else {
            filterInfo.textContent = `Filtri: ${activeFilters.join(', ')}`;
        }
    }

    updateToolsCount(count) {
        this.toolsCount.textContent = `${count} Tool${count !== 1 ? 's' : ''}`;
    }

    animateCards() {
        const cards = this.toolsGrid.querySelectorAll('.tool-card');
        cards.forEach((card, index) => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
            
            setTimeout(() => {
                card.style.transition = 'all 0.3s ease';
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, index * 50);
        });
    }

    hideLoader() {
        const loader = document.getElementById('loadingIndicator');
        if (loader) {
            loader.style.opacity = '0';
            setTimeout(() => {
                loader.style.display = 'none';
            }, 300);
        }
    }

    showError(message) {
        this.toolsGrid.innerHTML = `
            <div style="grid-column: 1 / -1; text-align: center; padding: 60px 20px; color: rgba(255,255,255,0.8);">
                <h3 style="font-size: 1.5rem; margin-bottom: 10px;">⚠️ ${message}</h3>
                <p>Riprova più tardi o contatta il supporto</p>
                <button onclick="location.reload()" style="margin-top: 20px; padding: 10px 20px; background: #667eea; color: white; border: none; border-radius: 5px; cursor: pointer;">
                    🔄 Ricarica Pagina
                </button>
            </div>
        `;
    }

    // Utility methods for enhanced functionality
    toggleBookmark(toolId) {
        const bookmarks = this.getBookmarks();
        const index = bookmarks.indexOf(toolId);
        
        if (index === -1) {
            bookmarks.push(toolId);
            this.showToast('🔖 Tool aggiunto ai preferiti');
        } else {
            bookmarks.splice(index, 1);
            this.showToast('🗑️ Tool rimosso dai preferiti');
        }
        
        localStorage.setItem('ai-tools-bookmarks', JSON.stringify(bookmarks));
        this.updateBookmarkIcons();
    }

    getBookmarks() {
        try {
            return JSON.parse(localStorage.getItem('ai-tools-bookmarks') || '[]');
        } catch {
            return [];
        }
    }

    updateBookmarkIcons() {
        const bookmarks = this.getBookmarks();
        const bookmarkElements = document.querySelectorAll('.tool-bookmark');
        
        bookmarkElements.forEach(element => {
            const card = element.closest('.tool-card');
            const toolId = parseInt(card.dataset.toolId);
            const icon = element.querySelector('.bookmark-icon');
            
            if (bookmarks.includes(toolId)) {
                icon.style.color = '#f59e0b';
                element.setAttribute('title', 'Rimuovi dai preferiti');
            } else {
                icon.style.color = '#d1d5db';
                element.setAttribute('title', 'Aggiungi ai preferiti');
            }
        });
    }

    shareTools(toolName, toolUrl) {
        if (navigator.share) {
            navigator.share({
                title: `${toolName} - AI Tool`,
                text: `Scopri ${toolName} su AI Toolkit Directory`,
                url: toolUrl
            });
        } else {
            // Fallback: copia URL negli appunti
            navigator.clipboard.writeText(toolUrl).then(() => {
                this.showToast('📋 Link copiato negli appunti');
            }).catch(() => {
                this.showToast('❌ Errore nella condivisione');
            });
        }
    }

    showToast(message) {
        // Crea toast notification
        const toast = document.createElement('div');
        toast.className = 'toast-notification';
        toast.textContent = message;
        toast.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: rgba(0,0,0,0.8);
            color: white;
            padding: 12px 20px;
            border-radius: 8px;
            z-index: 10000;
            font-size: 14px;
            font-weight: 500;
            transform: translateX(100%);
            transition: transform 0.3s ease;
        `;
        
        document.body.appendChild(toast);
        
        // Anima l'entrata
        setTimeout(() => {
            toast.style.transform = 'translateX(0)';
        }, 100);
        
        // Rimuovi dopo 3 secondi
        setTimeout(() => {
            toast.style.transform = 'translateX(100%)';
            setTimeout(() => {
                document.body.removeChild(toast);
            }, 300);
        }, 3000);
    }

    trackClick(toolName) {
        // Analytics tracking
        if (typeof gtag !== 'undefined') {
            gtag('event', 'tool_click', {
                'tool_name': toolName,
                'event_category': 'engagement'
            });
        }

        // Statistiche locali
        const stats = JSON.parse(localStorage.getItem('ai-tools-stats') || '{}');
        stats[toolName] = (stats[toolName] || 0) + 1;
        localStorage.setItem('ai-tools-stats', JSON.stringify(stats));
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new AIToolsDirectory();
});