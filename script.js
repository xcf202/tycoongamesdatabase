document.addEventListener('DOMContentLoaded', () => {
    console.log('DOMContentLoaded event fired');

    const gamesGrid = document.getElementById('games-grid');
    const totalGamesElement = document.getElementById('total-games');

    fetch('tycoon-games-database.json')
        .then(response => {
            console.log('Response received:', response);
            return response.json();
        })
        .then(data => {
            console.log('Data loaded:', data);
            totalGamesElement.textContent = data.length;
            data.forEach(game => {
                console.log('Processing game:', game);

                const gameCard = document.createElement('div');
                gameCard.className = 'game-card';

                const gameCover = document.createElement('img');
                gameCover.className = 'game-cover';
                gameCover.src = game.cover_image;
                gameCover.alt = `${game.title} Cover`;

                const gameTitle = document.createElement('h3');
                gameTitle.textContent = game.title;

                const gameDescription = document.createElement('p');
                gameDescription.textContent = game.description;

                const gameDetails = document.createElement('div');
                gameDetails.className = 'game-details';

                const gamePlatforms = document.createElement('p');
                gamePlatforms.textContent = `Platforms: ${game.platforms.join(', ')}`;

                const gameGenres = document.createElement('p');
                gameGenres.textContent = `Genres: ${game.genres.join(', ')}`;

                const gameReleaseDate = document.createElement('p');
                gameReleaseDate.textContent = `Release Date: ${game.release_date}`;

                const gamePrice = document.createElement('p');
                gamePrice.textContent = `Price: $${game.price}`;

                const gameRating = document.createElement('p');
                gameRating.textContent = `Rating: ${game.rating}/5`;

                const gameFeatures = document.createElement('p');
                gameFeatures.textContent = `Features: ${game.features.join(', ')}`;

                const gameTags = document.createElement('p');
                gameTags.textContent = `Tags: ${game.tags.join(', ')}`;

                gameDetails.appendChild(gamePlatforms);
                gameDetails.appendChild(gameGenres);
                gameDetails.appendChild(gameReleaseDate);
                gameDetails.appendChild(gamePrice);
                gameDetails.appendChild(gameRating);
                gameDetails.appendChild(gameFeatures);
                gameDetails.appendChild(gameTags);

                gameCard.appendChild(gameCover);
                gameCard.appendChild(gameTitle);
                gameCard.appendChild(gameDescription);
                gameCard.appendChild(gameDetails);

                gamesGrid.appendChild(gameCard);
            });
        })
        .catch(error => {
            console.error('Error loading games:', error);
        });
});
