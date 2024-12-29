// Function to update games list (called by scraper)
window.updateGamesList = function(games) {
    const gamesGrid = document.getElementById('games-grid');
    const totalGamesElement = document.getElementById('total-games');
    const loadingIndicator = document.getElementById('loading-indicator');

    if (loadingIndicator) {
        loadingIndicator.style.display = 'none';
    }

    if (totalGamesElement) {
        totalGamesElement.textContent = games.length;
    }

    if (gamesGrid) {
        gamesGrid.innerHTML = ''; // Clear existing games
        games.forEach(game => {
                const gameCard = document.createElement('div');
                gameCard.className = 'game-card';

                const gameCover = document.createElement('img');
                gameCover.className = 'game-cover';
                gameCover.src = game.cover_image;
                gameCover.alt = `${game.title} Cover`;

                const gameTitle = document.createElement('h3');
                gameTitle.textContent = game.title;

                const gameDescriptionContainer = document.createElement('div');
                gameDescriptionContainer.className = 'game-description';
                const gameDescription = document.createElement('p');
                gameDescription.textContent = game.description;
                gameDescriptionContainer.appendChild(gameDescription);

                const gameDetails = document.createElement('div');
                gameDetails.className = 'game-details collapsed';

                const details = [
                    { label: 'Platforms', value: game.platforms.join(', ') },
                    { label: 'Genres', value: game.genres.join(', ') },
                    { label: 'Release Date', value: game.release_date },
                    { label: 'Price', value: `$${game.price}` },
                    { label: 'Rating', value: `${game.rating}/5` },
                    { label: 'Features', value: game.features.join(', ') },
                    { label: 'Tags', value: game.tags.join(', ') }
                ];

                details.forEach(detail => {
                    const p = document.createElement('p');
                    p.textContent = detail.label;
                    p.setAttribute('data-value', detail.value);
                    gameDetails.appendChild(p);
                });

                const readMoreBtn = document.createElement('button');
                readMoreBtn.className = 'read-more-btn';
                readMoreBtn.textContent = 'Read More';
                readMoreBtn.addEventListener('click', () => {
                    gameDetails.classList.toggle('collapsed');
                    readMoreBtn.textContent = gameDetails.classList.contains('collapsed') ? 'Read More' : 'Show Less';
                });

                const wishlistButton = document.createElement('a');
                wishlistButton.className = 'wishlist-button';
                wishlistButton.textContent = 'Add to Wishlist';
                wishlistButton.href = `https://store.steampowered.com/app/${game.id}`;
                wishlistButton.target = '_blank';
                wishlistButton.rel = 'noopener noreferrer';

                const gameContent = document.createElement('div');
                gameContent.className = 'game-content';

                const gameInfo = document.createElement('div');
                gameInfo.className = 'game-info';
                gameInfo.appendChild(gameTitle);
                gameInfo.appendChild(gameDescriptionContainer);
                gameInfo.appendChild(gameDetails);

                const gameButtons = document.createElement('div');
                gameButtons.className = 'game-buttons';
                gameButtons.appendChild(readMoreBtn);
                gameButtons.appendChild(wishlistButton);

                gameContent.appendChild(gameInfo);
                gameContent.appendChild(gameButtons);

                gameCard.appendChild(gameCover);
                gameCard.appendChild(gameContent);

                gamesGrid.appendChild(gameCard);
            });
    }
};

// Add loading indicator
document.addEventListener('DOMContentLoaded', () => {
    const main = document.querySelector('main');
    if (main) {
        const loadingIndicator = document.createElement('div');
        loadingIndicator.id = 'loading-indicator';
        loadingIndicator.style.cssText = `
            display: none;
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: rgba(0, 0, 0, 0.8);
            color: white;
            padding: 20px;
            border-radius: 8px;
            z-index: 1000;
        `;
        loadingIndicator.textContent = 'Updating games database...';
        main.appendChild(loadingIndicator);
    }
});

// Show loading indicator during scraping
const originalScrapeGames = window.scrapeGames;
window.scrapeGames = async function() {
    const loadingIndicator = document.getElementById('loading-indicator');
    if (loadingIndicator) {
        loadingIndicator.style.display = 'block';
    }
    try {
        return await originalScrapeGames();
    } finally {
        if (loadingIndicator) {
            loadingIndicator.style.display = 'none';
        }
    }
};
