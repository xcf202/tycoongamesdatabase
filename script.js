// script.js
import { getTycoonGames } from './scraper.js';

window.updateGamesList = function(games) {
  const gamesGrid = document.getElementById('games-grid');
  gamesGrid.innerHTML = ''; // Clear existing games

  games.forEach(game => {
    const gameElement = `
      <div class="game-card">
        <img src="${game.cover_image}" alt="${game.title} Cover Image" class="cover-image">
        <h3>${game.title}</h3>
        <p class="price">${game.price === 0 ? 'Free' : '$' + game.price}</p>
        <div class="rating">
          ${'★'.repeat(Math.floor(game.rating))}
          ${'☆'.repeat(5 - Math.floor(game.rating))}
        </div>
        <button class="read-more-btn" data-game-id="${game.id}">Read More</button>
        <a href="https://store.steampowered.com/app/${game.id}" target="_blank" class="wishlist-btn">Add to Wishlist</a>
      </div>
    `;
    gamesGrid.innerHTML += gameElement;
  });

  // Add event listeners to "Read More" buttons after they are created
  const readMoreButtons = document.querySelectorAll('.read-more-btn');
  readMoreButtons.forEach(button => {
    button.addEventListener('click', () => {
      const gameId = button.dataset.gameId;
      // Here you would typically open a modal or navigate to a details page
      console.log(`Read more about game with ID: ${gameId}`);
    });
  });
};

// Add loading indicator
const loadingIndicator = document.createElement('div');
loadingIndicator.id = 'loading-indicator';
loadingIndicator.textContent = 'Loading...';
document.body.appendChild(loadingIndicator);

// Show loading indicator during scraping
window.updateLoadingStatus = function(message) {
  const loadingIndicator = document.getElementById('loading-indicator');
  if (loadingIndicator) {
    loadingIndicator.textContent = message;
  }
};

document.addEventListener('DOMContentLoaded', async () => {
  const loadingIndicator = document.getElementById('loading-indicator');

  try {
    if (loadingIndicator) loadingIndicator.style.display = 'block';
    window.updateLoadingStatus('Loading games from Steam API...');

    const games = await getTycoonGames();
    displayGames(games);
  } catch (error) {
    console.error('Error fetching games:', error);
    window.updateLoadingStatus('Error loading games. Please refresh the page.');
  } finally {
    if (loadingIndicator) {
      setTimeout(() => {
        loadingIndicator.style.display = 'none';
      }, 1000);
    }
  }
});