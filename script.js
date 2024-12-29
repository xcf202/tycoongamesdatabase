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

                const detailsHTML = `
                    <p>Platforms: ${game.platforms.join(', ')}</p>
                    <p>Genres: ${game.genres.join(', ')}</p>
                    <p>Release Date: ${game.release_date}</p>
                    <p>Price: $${game.price}</p>
                    <p>Rating: ${game.rating}/5</p>
                    <p>Features: ${game.features.join(', ')}</p>
                    <p>Tags: ${game.tags.join(', ')}</p>
                `;
                gameDetails.innerHTML = detailsHTML;

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

                gameCard.appendChild(gameCover);
                gameCard.appendChild(gameTitle);
                gameCard.appendChild(gameDescriptionContainer);
                gameCard.appendChild(readMoreBtn);
                gameCard.appendChild(gameDetails);
                gameCard.appendChild(wishlistButton);

                gamesGrid.appendChild(gameCard);
            });
        })
        .catch(error => console.error('Error loading games:', error));
});
