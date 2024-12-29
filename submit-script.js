class SubmissionManager {
    constructor() {
        this.form = document.getElementById('game-submission-form');
        this.errorContainer = document.getElementById('form-error');
        this.descriptionInput = document.getElementById('game-description');
        this.characterCount = document.querySelector('.character-count');
        this.initializeEventListeners();
    }

    initializeEventListeners() {
        // Form submission
        this.form.addEventListener('submit', this.handleSubmit.bind(this));

        // Character count for description
        this.descriptionInput.addEventListener('input', this.updateCharacterCount.bind(this));

        // Reset form
        this.form.addEventListener('reset', () => {
            setTimeout(() => {
                this.updateCharacterCount();
                this.hideError();
            }, 0);
        });

        // Initialize character count
        this.updateCharacterCount();
    }

    updateCharacterCount() {
        const currentLength = this.descriptionInput.value.length;
        const maxLength = this.descriptionInput.maxLength;
        this.characterCount.textContent = `${currentLength}/${maxLength} characters`;

        // Visual feedback
        if (currentLength >= maxLength) {
            this.characterCount.style.color = '#e74c3c';
        } else if (currentLength >= maxLength * 0.8) {
            this.characterCount.style.color = '#f39c12';
        } else {
            this.characterCount.style.color = '#666';
        }
    }

    async handleSubmit(event) {
        event.preventDefault();
        this.hideError();

        try {
            // Collect form data
            const formData = {
                name: this.form.elements['game-name'].value.trim(),
                developer: this.form.elements['game-developer'].value.trim(),
                type: this.form.elements['game-type'].value,
                status: this.form.elements['game-status'].value,
                link: this.form.elements['game-link'].value.trim(),
                image: this.form.elements['game-image'].value.trim(),
                description: this.form.elements['game-description'].value.trim()
            };

            // Validate form data
            this.validateFormData(formData);

            // In a real application, this would send data to a server
            // For now, we'll simulate success and store in local storage
            await this.submitGame(formData);

            // Show success message
            this.showSuccess('Game submitted successfully!');

            // Reset form
            this.form.reset();
        } catch (error) {
            this.showError(error.message);
        }
    }

    validateFormData(data) {
        if (data.name.length < 2) {
            throw new Error('Game name must be at least 2 characters long');
        }
        if (data.developer.length < 2) {
            throw new Error('Developer name must be at least 2 characters long');
        }
        if (!['free', 'paid'].includes(data.type)) {
            throw new Error('Please select a valid game type');
        }
        if (!['released', 'unreleased'].includes(data.status)) {
            throw new Error('Please select a valid game status');
        }
        if (data.link && !this.isValidUrl(data.link)) {
            throw new Error('Please enter a valid store link URL');
        }
        if (data.image && !this.isValidUrl(data.image)) {
            throw new Error('Please enter a valid image URL');
        }
        if (data.description.length < 10) {
            throw new Error('Description must be at least 10 characters long');
        }
    }

    isValidUrl(string) {
        try {
            new URL(string);
            return true;
        } catch (_) {
            return false;
        }
    }

    async submitGame(gameData) {
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Get existing games from local storage
        let games = JSON.parse(localStorage.getItem('submittedGames') || '[]');

        // Add new game with timestamp and ID
        const newGame = {
            ...gameData,
            id: `game_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            submittedAt: new Date().toISOString()
        };

        games.push(newGame);

        // Save back to local storage
        localStorage.setItem('submittedGames', JSON.stringify(games));
    }

    showError(message) {
        this.errorContainer.textContent = message;
        this.errorContainer.style.display = 'block';
        this.errorContainer.classList.remove('success-message');
        this.errorContainer.classList.add('error-message');
        this.errorContainer.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    showSuccess(message) {
        this.errorContainer.textContent = message;
        this.errorContainer.style.display = 'block';
        this.errorContainer.classList.remove('error-message');
        this.errorContainer.classList.add('success-message');
        this.errorContainer.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    hideError() {
        this.errorContainer.style.display = 'none';
        this.errorContainer.textContent = '';
    }
}

// Initialize the submission manager when the page loads
document.addEventListener('DOMContentLoaded', () => {
    window.submissionManager = new SubmissionManager();
});
