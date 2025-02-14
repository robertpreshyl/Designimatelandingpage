class CommandBar {
    constructor(container) {
        this.container = container;
        this.isTyping = false;
        this.currentTimeout = null;
        this.init();
    }

    init() {
        // Create command bar elements
        this.createElements();
        // Initialize animations
        this.initializeAnimations();
        // Add event listeners
        this.addEventListeners();
    }

    createElements() {
        this.container.innerHTML = `
            <div class="command-wrapper">
                <div class="command-bar">
                    <div class="command-icon">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <circle cx="11" cy="11" r="8"></circle>
                            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                        </svg>
                    </div>
                    <div class="command-input">
                        <span class="input-text"></span>
                        <span class="cursor">|</span>
                    </div>
                    <div class="command-shortcut">⌘K</div>
                </div>
                <div class="suggestions">
                    <div class="suggestion-group">
                        <div class="suggestion-header">Quick Actions</div>
                        <div class="suggestion-items">
                            <div class="suggestion-item" data-text="Create a new design...">
                                <div class="suggestion-icon">✨</div>
                                <div class="suggestion-text">Create a new design...</div>
                            </div>
                            <div class="suggestion-item" data-text="Generate color palette...">
                                <div class="suggestion-icon">🎨</div>
                                <div class="suggestion-text">Generate color palette...</div>
                            </div>
                            <div class="suggestion-item" data-text="Design mobile app...">
                                <div class="suggestion-icon">📱</div>
                                <div class="suggestion-text">Design mobile app...</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        // Store references to elements
        this.commandWrapper = this.container.querySelector('.command-wrapper');
        this.inputText = this.container.querySelector('.input-text');
        this.cursor = this.container.querySelector('.cursor');
        this.suggestions = this.container.querySelector('.suggestions');
        this.suggestionItems = this.container.querySelectorAll('.suggestion-item');
        this.placeholder = "Ask anything...";
        
        // Set initial placeholder
        this.inputText.textContent = this.placeholder;
    }

    initializeAnimations() {
        // Cursor blink animation
        this.cursorAnimation = anime({
            targets: this.cursor,
            opacity: [1, 0],
            duration: 600,
            easing: 'steps(2)',
            loop: true
        });

        // Initial appearance animation
        anime({
            targets: this.commandWrapper,
            opacity: [0, 1],
            translateY: [20, 0],
            duration: 600,
            easing: 'easeOutExpo'
        });
    }

    addEventListeners() {
        // Add hover effect
        this.commandWrapper.addEventListener('mouseenter', () => {
            anime({
                targets: this.commandWrapper,
                scale: 1.005,
                duration: 150,
                easing: 'easeOutQuad'
            });
        });

        this.commandWrapper.addEventListener('mouseleave', () => {
            anime({
                targets: this.commandWrapper,
                scale: 1,
                duration: 150,
                easing: 'easeOutQuad'
            });
        });

        // Add click handler for command bar
        this.commandWrapper.addEventListener('click', (e) => {
            // Only trigger typing animation if not clicking a suggestion
            if (!e.target.closest('.suggestion-item') && !this.isTyping) {
                this.startTypingAnimation();
            }
        });

        // Add click handlers for suggestions
        this.suggestionItems.forEach(item => {
            item.addEventListener('click', () => {
                const text = item.dataset.text;
                this.showClickedSuggestion(text);
            });
        });

        // Prevent text selection on click
        this.commandWrapper.addEventListener('mousedown', (e) => {
            e.preventDefault();
        });

        // Add keyboard shortcut
        document.addEventListener('keydown', (e) => {
            if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
                e.preventDefault();
                if (!this.isTyping) {
                    this.startTypingAnimation();
                }
            }
        });
    }

    startTypingAnimation() {
        if (this.currentTimeout) {
            clearTimeout(this.currentTimeout);
        }
        
        this.isTyping = true;
        const phrases = [
            "Ask anything...",
            "Create a modern landing page...",
            "Generate an icon set...",
            "Design a mobile app...",
            "Create a gradient palette...",
            "Design a logo...",
            "Generate UI components...",
            "Create an illustration..."
        ];

        // Reset text and cursor position
        anime({
            targets: this.inputText,
            opacity: [1, 0],
            duration: 150,
            easing: 'easeOutQuad',
            complete: () => {
                this.inputText.textContent = '';
                const phrase = phrases[Math.floor(Math.random() * phrases.length)];
                this.typePhrase(phrase);
            }
        });
    }

    typePhrase(phrase) {
        let currentText = "";
        const duration = 25;
        const chars = [...phrase];
        
        // Reset cursor animation
        this.cursorAnimation.restart();
        this.inputText.style.opacity = "0.7";
        
        const type = (index) => {
            if (index < chars.length) {
                currentText += chars[index];
                this.inputText.textContent = currentText;
                
                // Show suggestions earlier
                if (index === Math.floor(chars.length / 4)) {
                    this.showSuggestions();
                }

                this.currentTimeout = setTimeout(() => type(index + 1), duration);
            } else {
                // Typing complete
                setTimeout(() => {
                    this.isTyping = false;
                    // Add subtle pulse animation when complete
                    anime({
                        targets: this.commandWrapper,
                        scale: [1, 1.005, 1],
                        duration: 200,
                        easing: 'easeOutElastic(1, .5)'
                    });
                }, 200);
            }
        };

        type(0);
    }

    showSuggestions() {
        // Hide previous suggestions
        anime({
            targets: this.suggestions,
            opacity: 0,
            duration: 100,
            easing: 'easeOutQuad',
            complete: () => {
                // Show new suggestions with stagger effect
                anime({
                    targets: this.suggestions,
                    opacity: [0, 1],
                    translateY: [5, 0],
                    duration: 300,
                    easing: 'easeOutQuad'
                });

                anime({
                    targets: '.suggestion-item',
                    opacity: [0, 1],
                    translateX: [-5, 0],
                    delay: anime.stagger(40),
                    duration: 200,
                    easing: 'easeOutQuad'
                });
            }
        });
    }

    showClickedSuggestion(text) {
        // Clear any ongoing typing animation
        if (this.currentTimeout) {
            clearTimeout(this.currentTimeout);
        }
        
        this.isTyping = true;

        // Fade out current text
        anime({
            targets: this.inputText,
            opacity: [1, 0],
            duration: 150,
            easing: 'easeOutQuad',
            complete: () => {
                this.inputText.textContent = '';
                this.typePhrase(text);
                
                // Hide suggestions with animation
                anime({
                    targets: this.suggestions,
                    opacity: 0,
                    translateY: 5,
                    duration: 200,
                    easing: 'easeOutQuad'
                });
            }
        });
    }
}

// Export for use in other files
window.CommandBar = CommandBar; 