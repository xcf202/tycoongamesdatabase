// Load initial games from JSON database
async function loadInitialGamesFromDatabase() {
    try {
        const response = await fetch('tycoon-games-database.json');
        const data = await response.json();
        return data.games.map(gameData => 
            new TycoonGame(
                gameData.name, 
                gameData.developer, 
                gameData.type, 
                gameData.status, 
                gameData.steamLink, 
                gameData.description,
                gameData.image
            )
        );
    } catch (error) {
        console.error('Error loading games database:', error);
        return [];
    }
}

// Game class to represent tycoon games
class TycoonGame {
    constructor(name, developer, type, status, link, description, image) {
        this.validateInput(name, developer, type, status, link, description);
        
        this.name = name.trim();
        this.developer = developer.trim();
        this.type = type; // 'free' or 'paid'
        this.status = status; // 'released' or 'unreleased'
        this.link = link ? link.trim() : '';
        this.description = description ? description.trim() : '';
        this.image = image || 'default-game-image.png';
        this.id = this.generateId();
        this.createdAt = new Date().toISOString();
    }

    // Validate input before creating game object
    validateInput(name, developer, type, status, link, description) {
        if (!name || name.trim().length < 2) {
            throw new Error('Game name must be at least 2 characters long');
        }

        if (!developer || developer.trim().length < 2) {
            throw new Error('Developer name must be at least 2 characters long');
        }

        if (!['free', 'paid'].includes(type)) {
            throw new Error('Game type must be either "free" or "paid"');
        }

        if (!['released', 'unreleased'].includes(status)) {
            throw new Error('Game status must be either "released" or "unreleased"');
        }

        // Optional link validation
        if (link && link.trim() !== '') {
            try {
                new URL(link);
            } catch {
                throw new Error('Invalid game link URL');
            }
        }

        // Optional description length limit
        if (description && description.trim().length > 500) {
            throw new Error('Description cannot exceed 500 characters');
        }
    }

    // Generate a unique ID for each game
    generateId() {
        return `game_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }

    // Create a card element for the game
    createGameCard() {
        const card = document.createElement('div');
        card.classList.add('game-card');
        card.dataset.id = this.id;
        card.dataset.type = this.type;
        card.dataset.status = this.status;

        card.innerHTML = `
            <img src="${this.image}" alt="${this.name} game cover" class="game-cover">
            <h3>${this.name}</h3>
            <p><strong>Developer:</strong> ${this.developer}</p>
            <p><strong>Type:</strong> ${this.type.charAt(0).toUpperCase() + this.type.slice(1)}</p>
            <p><strong>Status:</strong> ${this.status.charAt(0).toUpperCase() + this.status.slice(1)}</p>
            <p><strong>Added:</strong> ${new Date(this.createdAt).toLocaleDateString()}</p>
            ${this.link ? `<p><a href="${this.link}" target="_blank" rel="noopener noreferrer">Steam Page</a></p>` : ''}
            ${this.description ? `<p class="game-description">${this.description}</p>` : ''}
        `;

        return card;
    }
}

// Game Database Management
class TycoonGameDatabase {
    constructor() {
        this.games = [];
        this.filteredGames = [];
        this.currentFilter = 'all';
        this.initializeEventListeners();
        this.loadInitialGames();
    }

    // Initialize event listeners
    initializeEventListeners() {
        const form = document.getElementById('game-submission-form');
        form.addEventListener('submit', this.handleGameSubmission.bind(this));

        // Filter buttons with active state management
        const filterButtons = [
            { id: 'all-games-btn', filter: 'all' },
            { id: 'free-games-btn', filter: 'free' },
            { id: 'paid-games-btn', filter: 'paid' },
            { id: 'released-games-btn', filter: 'released' },
            { id: 'unreleased-games-btn', filter: 'unreleased' }
        ];

        filterButtons.forEach(btn => {
            const button = document.getElementById(btn.id);
            button.addEventListener('click', () => {
                // Remove active class from all buttons
                filterButtons.forEach(b => 
                    document.getElementById(b.id).classList.remove('active')
                );
                
                // Add active class to clicked button
                button.classList.add('active');
                
                // Filter games
                this.filterGames(btn.filter);
            });
        });
    }

    // Handle game submission form
    handleGameSubmission(event) {
        event.preventDefault();

        // Get form elements
        const nameInput = document.getElementById('game-name');
        const developerInput = document.getElementById('game-developer');
        const typeInput = document.getElementById('game-type');
        const statusInput = document.getElementById('game-status');
        const linkInput = document.getElementById('game-link');
        const descriptionInput = document.getElementById('game-description');
        const errorContainer = document.getElementById('form-error');

        // Reset error display
        errorContainer.style.display = 'none';
        errorContainer.textContent = '';

        try {
            // Collect form data
            const name = nameInput.value;
            const developer = developerInput.value;
            const type = typeInput.value;
            const status = statusInput.value;
            const link = linkInput.value;
            const description = descriptionInput.value;

            // Create new game
            const newGame = new TycoonGame(name, developer, type, status, link, description);
            this.addGame(newGame);

            // Reset form
            event.target.reset();
        } catch (error) {
            // Display error message
            errorContainer.textContent = error.message;
            errorContainer.style.display = 'block';
        }
    }

    // Add a game to the database
    addGame(game) {
        this.games.push(game);
        this.filterGames(this.currentFilter);
        this.saveGamesToLocalStorage();
    }

    // Filter games based on type or status
    filterGames(filter) {
        this.currentFilter = filter;
        
        switch(filter) {
            case 'free':
                this.filteredGames = this.games.filter(game => game.type === 'free');
                break;
            case 'paid':
                this.filteredGames = this.games.filter(game => game.type === 'paid');
                break;
            case 'released':
                this.filteredGames = this.games.filter(game => game.status === 'released');
                break;
            case 'unreleased':
                this.filteredGames = this.games.filter(game => game.status === 'unreleased');
                break;
            default:
                this.filteredGames = this.games;
        }
        
        this.renderGames();
        this.updateGameCount();
    }

    // Render games to the page
    renderGames() {
        const gamesList = document.getElementById('games-list');
        gamesList.innerHTML = ''; // Clear existing games

        const gamesToRender = this.filteredGames.length ? this.filteredGames : this.games;
        gamesToRender.forEach(game => {
            gamesList.appendChild(game.createGameCard());
        });
    }

    // Update game count display
    updateGameCount() {
        const countDisplay = document.getElementById('game-count');
        if (countDisplay) {
            const totalGames = this.games.length;
            const filteredCount = this.filteredGames.length;
            
            countDisplay.textContent = this.currentFilter === 'all' 
                ? `${totalGames} Total Games` 
                : `${filteredCount} ${this.currentFilter.charAt(0).toUpperCase() + this.currentFilter.slice(1)} Games`;
        }
    }

    // Save games to local storage
    saveGamesToLocalStorage() {
        localStorage.setItem('tycoonGames', JSON.stringify(this.games));
    }

    // Load initial games from local storage or database
    async loadInitialGames() {
        // First, try to load from local storage
        const savedGames = localStorage.getItem('tycoonGames');
        if (savedGames) {
            const parsedGames = JSON.parse(savedGames);
            this.games = parsedGames.map(gameData => 
                new TycoonGame(
                    gameData.name, 
                    gameData.developer, 
                    gameData.type, 
                    gameData.status, 
                    gameData.link, 
                    gameData.description,
                    gameData.image
                )
            );
        } else {
            // If no local storage, load from JSON database
            this.games = await loadInitialGamesFromDatabase();
        }
        
        // Initial render and count
        this.filterGames('all');
    }
}

// Initialize the game database when the page loads
document.addEventListener('DOMContentLoaded', async () => {
    window.gameDatabase = new TycoonGameDatabase();
});
