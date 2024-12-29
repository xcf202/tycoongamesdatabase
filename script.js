document.addEventListener('DOMContentLoaded', () => {
    const gamesGrid = document.getElementById('games-grid');
    const totalGamesElement = document.getElementById('total-games');

    fetch('tycoon-games-database.json')
        .then(response => response.json())
        .then(data => {
            totalGamesElement.textContent = data.length;
            data.forEach(game => {
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
        })
        .catch(error => console.error('Error loading games:', error));
});
