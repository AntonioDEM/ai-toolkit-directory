/**
 * Sistema di Rating con Stelle per Netlify Forms
 * Compatibile con AI Toolkit Directory
 * @author Antonio DEM
 */

class StarRatingSystem {
    constructor(containerSelector = '.rating-stars') {
        this.container = document.querySelector(containerSelector);
        this.ratingInputs = document.querySelectorAll('input[name="rating"]');
        this.ratingDisplay = document.getElementById('rating-display');
        this.labels = ['Pessimo', 'Scarso', 'Accettabile', 'Buono', 'Eccellente'];
        
        this.init();
    }
    
    init() {
        if (!this.container || !this.ratingInputs.length) {
            console.warn('Rating system elements not found');
            return;
        }
        
        this.bindEvents();
        this.setupAccessibility();
    }
    
    bindEvents() {
        // Handle rating selection
        this.ratingInputs.forEach(input => {
            input.addEventListener('change', (e) => this.handleRatingChange(e));
            input.addEventListener('focus', (e) => this.handleFocus(e));
        });
        
        // Handle star hover effects
        const starLabels = this.container.querySelectorAll('label');
        starLabels.forEach((label, index) => {
            label.addEventListener('mouseenter', () => this.handleMouseEnter(index));
        });
        
        // Reset on mouse leave
        this.container.addEventListener('mouseleave', () => this.handleMouseLeave());
        
        // Keyboard navigation
        this.container.addEventListener('keydown', (e) => this.handleKeyboard(e));
    }
    
    handleRatingChange(event) {
        const value = parseInt(event.target.value);
        this.updateDisplay(value, true);
        this.trackAnalytics(value);
    }
    
    handleFocus(event) {
        const value = parseInt(event.target.value);
        this.updateDisplay(value, false);
    }
    
    handleMouseEnter(index) {
        const value = 5 - index; // Stars are in reverse order
        this.updateDisplay(value, false, '#fbbf24');
    }
    
    handleMouseLeave() {
        const checkedInput = document.querySelector('input[name="rating"]:checked');
        if (checkedInput) {
            const value = parseInt(checkedInput.value);
            this.updateDisplay(value, true);
        } else {
            this.resetDisplay();
        }
    }
    
    handleKeyboard(event) {
        const focusedInput = document.activeElement;
        if (!focusedInput.matches('input[name="rating"]')) return;
        
        const currentIndex = Array.from(this.ratingInputs).indexOf(focusedInput);
        let targetIndex;
        
        switch(event.key) {
            case 'ArrowRight':
            case 'ArrowUp':
                targetIndex = Math.min(currentIndex + 1, this.ratingInputs.length - 1);
                event.preventDefault();
                break;
            case 'ArrowLeft':
            case 'ArrowDown':
                targetIndex = Math.max(currentIndex - 1, 0);
                event.preventDefault();
                break;
            case 'Enter':
            case ' ':
                focusedInput.checked = true;
                this.handleRatingChange({ target: focusedInput });
                event.preventDefault();
                break;
            default:
                return;
        }
        
        if (targetIndex !== undefined) {
            this.ratingInputs[targetIndex].focus();
        }
    }
    
    updateDisplay(value, isSelected, color = null) {
        if (!this.ratingDisplay) return;
        
        const label = this.labels[value - 1] || 'Sconosciuto';
        this.ratingDisplay.textContent = `${value} stelle - ${label}`;
        
        if (color) {
            this.ratingDisplay.style.color = color;
        } else if (isSelected) {
            this.ratingDisplay.style.color = '#667eea';
        } else {
            this.ratingDisplay.style.color = '#fbbf24';
        }
    }
    
    resetDisplay() {
        if (!this.ratingDisplay) return;
        
        this.ratingDisplay.textContent = 'Seleziona rating';
        this.ratingDisplay.style.color = '#4a5568';
    }
    
    setupAccessibility() {
        // Add ARIA labels
        this.ratingInputs.forEach((input, index) => {
            const value = parseInt(input.value);
            const label = this.labels[value - 1];
            input.setAttribute('aria-label', `${value} stelle - ${label}`);
        });
        
        // Add role and aria-label to container
        this.container.setAttribute('role', 'radiogroup');
        this.container.setAttribute('aria-label', 'Valutazione del tool da 1 a 5 stelle');
    }
    
    trackAnalytics(value) {
        // Google Analytics tracking
        if (typeof gtag === 'function') {
            gtag('event', 'rating_selected', {
                'event_category': 'form_interaction',
                'event_label': 'suggest_tool_rating',
                'custom_parameter': value
            });
        }
    }
    
    // Public methods
    getRating() {
        const checkedInput = document.querySelector('input[name="rating"]:checked');
        return checkedInput ? parseInt(checkedInput.value) : null;
    }
    
    setRating(value) {
        if (value < 1 || value > 5) return false;
        
        const targetInput = document.querySelector(`input[name="rating"][value="${value}"]`);
        if (targetInput) {
            targetInput.checked = true;
            this.updateDisplay(value, true);
            return true;
        }
        return false;
    }
    
    reset() {
        this.ratingInputs.forEach(input => input.checked = false);
        this.resetDisplay();
    }
}

// Form Enhancement Class
class SuggestToolForm {
    constructor(formSelector = 'form[name="suggest-tool"]') {
        this.form = document.querySelector(formSelector);
        this.init();
    }
    
    init() {
        if (!this.form) {
            console.warn('Suggest tool form not found');
            return;
        }
        
        this.bindEvents();
        this.setupValidation();
    }
    
    bindEvents() {
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));
        
        // Real-time validation
        const requiredFields = this.form.querySelectorAll('[required]');
        requiredFields.forEach(field => {
            field.addEventListener('blur', () => this.validateField(field));
            field.addEventListener('input', () => this.clearFieldError(field));
        });
    }
    
    handleSubmit(event) {
        if (!this.validateForm()) {
            event.preventDefault();
            return false;
        }
        
        // Track analytics
        if (typeof gtag === 'function') {
            gtag('event', 'form_submit', {
                'event_category': 'suggestions',
                'event_label': 'suggest_tool_form'
            });
        }
        
        // Show loading state
        this.showLoading();
        
        return true;
    }
    
    validateForm() {
        let isValid = true;
        const requiredFields = this.form.querySelectorAll('[required]');
        
        requiredFields.forEach(field => {
            if (!this.validateField(field)) {
                isValid = false;
            }
        });
        
        return isValid;
    }
    
    validateField(field) {
        const value = field.value.trim();
        const fieldType = field.type;
        const fieldName = field.name;
        let isValid = true;
        let errorMessage = '';
        
        // Check required fields
        if (field.hasAttribute('required') && !value) {
            isValid = false;
            errorMessage = 'Questo campo è obbligatorio';
        }
        
        // Specific validations
        if (value && fieldType === 'url') {
            const urlRegex = /^https?:\/\/.+\..+/;
            if (!urlRegex.test(value)) {
                isValid = false;
                errorMessage = 'Inserisci un URL valido (es. https://esempio.com)';
            }
        }
        
        if (value && fieldType === 'email') {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                isValid = false;
                errorMessage = 'Inserisci un indirizzo email valido';
            }
        }
        
        // Rating validation
        if (fieldName === 'rating') {
            const checkedRating = this.form.querySelector('input[name="rating"]:checked');
            if (!checkedRating) {
                isValid = false;
                errorMessage = 'Seleziona una valutazione';
                this.showRatingError();
            }
        }
        
        // Description length check
        if (fieldName === 'description' && value) {
            if (value.length < 20) {
                isValid = false;
                errorMessage = 'La descrizione deve essere di almeno 20 caratteri';
            } else if (value.length > 500) {
                isValid = false;
                errorMessage = 'La descrizione non può superare i 500 caratteri';
            }
        }
        
        // Tags validation
        if (fieldName === 'tags' && value) {
            const tags = value.split(',').map(tag => tag.trim()).filter(tag => tag);
            if (tags.length > 5) {
                isValid = false;
                errorMessage = 'Massimo 5 tags consentiti';
            }
        }
        
        // Show/hide error
        if (isValid) {
            this.clearFieldError(field);
        } else {
            this.showFieldError(field, errorMessage);
        }
        
        return isValid;
    }
    
    showFieldError(field, message) {
        this.clearFieldError(field);
        
        field.style.borderColor = '#e53e3e';
        field.style.backgroundColor = '#fef5e7';
        
        const errorDiv = document.createElement('div');
        errorDiv.className = 'field-error';
        errorDiv.textContent = message;
        errorDiv.style.color = '#e53e3e';
        errorDiv.style.fontSize = '0.875rem';
        errorDiv.style.marginTop = '0.25rem';
        
        field.parentNode.appendChild(errorDiv);
    }
    
    clearFieldError(field) {
        field.style.borderColor = '';
        field.style.backgroundColor = '';
        
        const existingError = field.parentNode.querySelector('.field-error');
        if (existingError) {
            existingError.remove();
        }
    }
    
    showRatingError() {
        const ratingContainer = document.querySelector('.rating-container');
        if (ratingContainer) {
            ratingContainer.style.borderLeft = '3px solid #e53e3e';
            ratingContainer.style.backgroundColor = '#fef5e7';
            ratingContainer.style.padding = '1rem';
            ratingContainer.style.borderRadius = '8px';
            
            setTimeout(() => {
                ratingContainer.style.borderLeft = '';
                ratingContainer.style.backgroundColor = '';
                ratingContainer.style.padding = '';
            }, 3000);
        }
    }
    
    showLoading() {
        const submitBtn = this.form.querySelector('.submit-btn');
        if (submitBtn) {
            submitBtn.disabled = true;
            submitBtn.innerHTML = '⏳ Invio in corso...';
            submitBtn.style.opacity = '0.7';
        }
    }
    
    resetForm() {
        this.form.reset();
        
        // Reset rating system
        if (window.ratingSystem) {
            window.ratingSystem.reset();
        }
        
        // Clear all errors
        const errorElements = this.form.querySelectorAll('.field-error');
        errorElements.forEach(error => error.remove());
        
        // Reset submit button
        const submitBtn = this.form.querySelector('.submit-btn');
        if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.innerHTML = '📤 Invia Suggerimento';
            submitBtn.style.opacity = '';
        }
    }
}

// Character counter utility
class CharacterCounter {
    constructor(textareaSelector, maxLength = 500) {
        this.textarea = document.querySelector(textareaSelector);
        this.maxLength = maxLength;
        this.init();
    }
    
    init() {
        if (!this.textarea) return;
        
        this.createCounter();
        this.bindEvents();
    }
    
    createCounter() {
        const counter = document.createElement('div');
        counter.className = 'char-counter';
        counter.style.cssText = `
            font-size: 0.75rem;
            color: #4a5568;
            text-align: right;
            margin-top: 0.25rem;
        `;
        
        this.textarea.parentNode.appendChild(counter);
        this.counterElement = counter;
        this.updateCounter();
    }
    
    bindEvents() {
        this.textarea.addEventListener('input', () => this.updateCounter());
    }
    
    updateCounter() {
        const currentLength = this.textarea.value.length;
        const remaining = this.maxLength - currentLength;
        
        this.counterElement.textContent = `${currentLength}/${this.maxLength} caratteri`;
        
        if (remaining < 50) {
            this.counterElement.style.color = '#e53e3e';
        } else if (remaining < 100) {
            this.counterElement.style.color = '#f6ad55';
        } else {
            this.counterElement.style.color = '#4a5568';
        }
    }
}

// Auto-initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize rating system
    window.ratingSystem = new StarRatingSystem();
    
    // Initialize form enhancements
    window.suggestForm = new SuggestToolForm();
    
    // Initialize character counter for description
    new CharacterCounter('#description', 500);
    
    // Initialize character counter for additional notes
    new CharacterCounter('#additional-notes', 1000);
    
    // Auto-focus first field
    const firstInput = document.querySelector('#tool-name');
    if (firstInput) {
        setTimeout(() => firstInput.focus(), 100);
    }
    
    // URL auto-correction
    const urlField = document.querySelector('#tool-url');
    if (urlField) {
        urlField.addEventListener('blur', function() {
            let value = this.value.trim();
            if (value && !value.startsWith('http://') && !value.startsWith('https://')) {
                this.value = 'https://' + value;
            }
        });
    }
    
    // Tags auto-formatting
    const tagsField = document.querySelector('#tags');
    if (tagsField) {
        tagsField.addEventListener('blur', function() {
            const tags = this.value.split(',')
                .map(tag => tag.trim().toLowerCase())
                .filter(tag => tag)
                .slice(0, 5) // Limit to 5 tags
                .join(', ');
            this.value = tags;
        });
    }
    
    console.log('✅ AI Toolkit Directory - Suggest Tool Form initialized');
});