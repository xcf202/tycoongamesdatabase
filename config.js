// Configuration for the Tycoon Games Database
const config = {
    // Base URL for GitHub Pages
    baseUrl: window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
        ? '' // Use relative path for local development
        : '/tycoongamesdatabase', // Use absolute path for GitHub Pages
    
    // API endpoints
    endpoints: {
        games: function() {
            return `${this.baseUrl}/tycoon-games-database.json`;
        }
    },

    // Image paths
    images: {
        defaultGame: function() {
            return `${this.baseUrl}/default-game-image.svg`;
        }
    },

    // Repository information
    repository: {
        owner: 'xcf202',
        name: 'tycoongamesdatabase',
        url: 'https://github.com/xcf202/tycoongamesdatabase'
    }
};

// Prevent modifications to the config object
Object.freeze(config);
Object.freeze(config.endpoints);
Object.freeze(config.images);
Object.freeze(config.repository);
