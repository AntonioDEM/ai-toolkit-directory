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
        
        // DEBUG: Attiva solo in sviluppo
        this.DEBUG = window.location.hostname === 'localhost' || 
                    window.location.hostname === '127.0.0.1';

        // DOM Elements
        this.toolsGrid = document.getElementById('toolsGrid');
        this.searchInput = document.getElementById('searchInput');
        this.toolsCount = document.getElementById('toolsCount');
        this.noResults = document.getElementById('noResults');
        this.filtersContainer = document.getElementById('filters');
        
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
        if (filtersContainer) {
            filtersContainer.insertAdjacentHTML('afterend', advancedFiltersHTML);
        }
    }

    renderFilters() {
        if (this.filtersContainer) {
            this.filtersContainer.innerHTML = this.categories.map(category => `
                <button class="filter-btn ${category.id === 'all' ? 'active' : ''}" data-category="${category.id}">
                    ${category.name}
                </button>
            `).join('');
        }
    }

    renderTools(tools) {
        if (!this.toolsGrid) return;
        
        if (tools.length === 0) {
            this.toolsGrid.style.display = 'none';
            if (this.noResults) this.noResults.style.display = 'block';
            return;
        }

        this.toolsGrid.style.display = 'grid';
        if (this.noResults) this.noResults.style.display = 'none';

        const sortedTools = this.sortTools(tools);
        this.toolsGrid.innerHTML = sortedTools.map(tool => this.createToolCard(tool)).join('');
        
        // Animazione di entrata
        this.animateCards();
    }

    createToolCard(tool) {
        const tagsHTML = tool.tags ? tool.tags.slice(0, 3).map(tag => 
            `<span class="tag-small">${tag}</span>`
        ).join('') : '';

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
                </div>
                
                <div class="tool-description">${tool.description}</div>
                
                ${tool.tags ? `<div class="tool-tags">${tagsHTML}</div>` : ''}
                
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
                       class="btn-primary">
                        Apri ${tool.name}
                        <span>→</span>
                    </a>
                </div>
            </div>
        `;
    }

    sortTools(tools) {
        const sortSelect = document.getElementById('sortSelect');
        const sortBy = sortSelect ? sortSelect.value : 'name';
        
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
        if (this.searchInput) {
            this.searchInput.addEventListener('input', (e) => this.handleSearch(e));
        }
        
        // Category filters
        if (this.filtersContainer) {
            this.filtersContainer.addEventListener('click', (e) => {
                if (e.target.classList.contains('filter-btn')) {
                    this.handleCategoryFilter(e);
                }
            });
        }

        // Advanced filters toggle
        const toggleBtn = document.getElementById('toggleAdvanced');
        const advancedPanel = document.getElementById('advancedPanel');

        if (toggleBtn && advancedPanel) {
            const toggleIcon = toggleBtn.querySelector('.toggle-icon');
            toggleBtn.addEventListener('click', () => {
                const isVisible = advancedPanel.style.display !== 'none';
                advancedPanel.style.display = isVisible ? 'none' : 'block';
                if (toggleIcon) {
                    toggleIcon.textContent = isVisible ? '▼' : '▲';
                }
                toggleBtn.classList.toggle('active');
            });
        }

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
            sortSelect.addEventListener('change', () => this.handleAdvancedFilter());
        }
        if (clearFilters) {
            clearFilters.addEventListener('click', () => this.clearAllFilters());
        }
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

        categoryMap = {
        '🤖 Chat/Agents': 'chat-agents',
        '🖼️ Image': 'image',
        '💻 Dev Tools': 'dev-tools',
        '📊 Data/Analytics': 'data-analytics',
        '⚡ Productivity': 'productivity',
        '📝 Content': 'content',
        '🎵 Audio/Voice': 'audio-voice',
        '🎓 Education': 'education',
        '📢 Marketing': 'marketing',
        '💎 PromptAI': 'promptai',
        '⚙️ Automation':'automation'
    };

    applyFilters() {
    let filteredTools = [...this.tools];

    // Apply category filter
    if (this.currentFilters.category !== 'all') {
        filteredTools = filteredTools.filter(tool => {
            // Rimuovi emoji e spazi extra per il matching sicuro
            const normalizeCategory = (cat) => {
                return cat.replace(/[^\w\s/-]/g, '')  // Rimuove emoji e caratteri speciali
                         .trim()
                         .toLowerCase();
            };
            
            const toolCategory = normalizeCategory(tool.category);
            const filterCategory = normalizeCategory(this.currentFilters.category);
            return toolCategory === filterCategory;
        });
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
                (tool.tags && tool.tags.some(tag => tag.toLowerCase().includes(this.currentFilters.search)))
            );
        }

        // DEBUG: Log finale
        if (this.DEBUG) {
        console.log('✅ [DEBUG] Tools filtrati:', filteredTools.length);
        console.log('📊 [DEBUG] Tools originali:', this.tools.length);
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
        if (this.searchInput) this.searchInput.value = '';
        
        const pricingFilter = document.getElementById('pricingFilter');
        const ratingFilter = document.getElementById('ratingFilter');
        const sortSelect = document.getElementById('sortSelect');
        
        if (pricingFilter) pricingFilter.value = 'all';
        if (ratingFilter) ratingFilter.value = 'all';
        if (sortSelect) sortSelect.value = 'name';

        // Reset category buttons
        if (this.filtersContainer) {
            this.filtersContainer.querySelectorAll('.filter-btn').forEach(btn => {
                btn.classList.remove('active');
            });
            const allBtn = this.filtersContainer.querySelector('[data-category="all"]');
            if (allBtn) allBtn.classList.add('active');
        }

        this.applyFilters();
        this.updateFilterInfo();
    }

    updateFilterInfo() {
        const filterInfo = document.getElementById('filterInfo');
        if (!filterInfo) return;

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
        if (this.toolsCount) {
            this.toolsCount.textContent = `${count} Tool${count !== 1 ? 's' : ''}`;
        }
    }

    animateCards() {
        if (!this.toolsGrid) return;
        
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
        if (!this.toolsGrid) return;
        
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
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new AIToolsDirectory();
});