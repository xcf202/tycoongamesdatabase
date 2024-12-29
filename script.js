// Firebase configuration (we'll add this later for actual data persistence)
const firebaseConfig = {
    // Placeholder for Firebase configuration
};

// Game class to represent tycoon games
class TycoonGame {
    constructor(name, developer, type, status, link, description) {
        this.name = name;
        this.developer = developer;
        this.type = type; // 'free' or 'paid'
        this.status = status; // 'released' or 'unreleased'
        this.link = link;
        this.description = description;
        this.id = this.generateId();
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
            <h3>${this.name}</h3>
            <p><strong>Developer:</strong> ${this.developer}</p>
            <p><strong>Type:</strong> ${this.type.charAt(0).toUpperCase() + this.type.slice(1)}</p>
            <p><strong>Status:</strong> ${this.status.charAt(0).toUpperCase() + this.status.slice(1)}</p>
            ${this.link ? `<p><a href="${this.link}" target="_blank">Game Link</a></p>` : ''}
            ${this.description ? `<p>${this.description}</p>` : ''}
        `;

        return card;
    }
}

// Game Database Management
class TycoonGameDatabase {
    constructor() {
        this.games = [];
        this.initializeEventListeners();
        this.loadInitialGames();
    }

    // Initialize event listeners
    initializeEventListeners() {
        const form = document.getElementById('game-submission-form');
        form.addEventListener('submit', this.handleGameSubmission.bind(this));

        // Filter buttons
        document.getElementById('all-games-btn').addEventListener('click', () => this.filterGames('all'));
        document.getElementById('free-games-btn').addEventListener('click', () => this.filterGames('free'));
        document.getElementById('paid-games-btn').addEventListener('click', () => this.filterGames('paid'));
        document.getElementById('released-games-btn').addEventListener('click', () => this.filterGames('released'));
        document.getElementById('unreleased-games-btn').addEventListener('click', () => this.filterGames('unreleased'));
    }

    // Handle game submission form
    handleGameSubmission(event) {
        event.preventDefault();

        // Collect form data
        const name = document.getElementById('game-name').value;
        const developer = document.getElementById('game-developer').value;
        const type = document.getElementById('game-type').value;
        const status = document.getElementById('game-status').value;
        const link = document.getElementById('game-link').value;
        const description = document.getElementById('game-description').value;

        // Create new game
        const newGame = new TycoonGame(name, developer, type, status, link, description);
        this.addGame(newGame);

        // Reset form
        event.target.reset();
    }

    // Add a game to the database
    addGame(game) {
        this.games.push(game);
        this.renderGames();
        this.saveGamesToLocalStorage();
    }

    // Render games to the page
    renderGames(filteredGames = null) {
        const gamesList = document.getElementById('games-list');
        gamesList.innerHTML = ''; // Clear existing games

        const gamesToRender = filteredGames || this.games;
        gamesToRender.forEach(game => {
            gamesList.appendChild(game.createGameCard());
        });
    }

    // Filter games based on type or status
    filterGames(filter) {
        let filteredGames;
        switch(filter) {
            case 'free':
                filteredGames = this.games.filter(game => game.type === 'free');
                break;
            case 'paid':
                filteredGames = this.games.filter(game => game.type === 'paid');
                break;
            case 'released':
                filteredGames = this.games.filter(game => game.status === 'released');
                break;
            case 'unreleased':
                filteredGames = this.games.filter(game => game.status === 'unreleased');
                break;
            default:
                filteredGames = this.games;
        }
        this.renderGames(filteredGames);
    }

    // Save games to local storage
    saveGamesToLocalStorage() {
        localStorage.setItem('tycoonGames', JSON.stringify(this.games));
    }

    // Load initial games from local storage
    loadInitialGames() {
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
                    gameData.description
                )
            );
            this.renderGames();
        }
    }
}

// Initialize the game database when the page loads
document.addEventListener('DOMContentLoaded', () => {
    window.gameDatabase = new TycoonGameDatabase();
});
