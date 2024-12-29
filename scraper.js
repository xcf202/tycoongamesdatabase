const STEAM_API_URL = 'https://store.steampowered.com/api';
const TYCOON_TAGS = ['Tycoon', 'Management', 'Economy', 'Business Simulation'];
const SCRAPE_INTERVAL = 12 * 60 * 60 * 1000; // 12 hours in milliseconds

async function fetchSteamGames(tag) {
    try {
        const response = await fetch(`${STEAM_API_URL}/storesearch/?term=${tag}&l=english`);
        const data = await response.json();
        return data.items || [];
    } catch (error) {
        console.error(`Error fetching games for tag ${tag}:`, error);
        return [];
    }
}

async function getGameDetails(appId) {
    try {
        const response = await fetch(`${STEAM_API_URL}/appdetails?appids=${appId}&l=english`);
        const data = await response.json();
        return data[appId].data;
    } catch (error) {
        console.error(`Error fetching details for game ${appId}:`, error);
        return null;
    }
}

function formatGameData(steamData) {
    return {
        id: steamData.steam_appid.toString(),
        title: steamData.name,
        description: steamData.short_description,
        platforms: Object.entries(steamData.platforms)
            .filter(([_, supported]) => supported)
            .map(([platform]) => platform),
        genres: steamData.genres.map(g => g.description),
        release_date: steamData.release_date.date,
        price: steamData.is_free ? 0 : steamData.price_overview?.final / 100 || 0,
        rating: steamData.metacritic?.score / 20 || 4.0,
        features: steamData.categories?.map(c => c.description) || [],
        tags: steamData.genres.map(g => g.description),
        cover_image: `https://cdn.cloudflare.steamstatic.com/steam/apps/${steamData.steam_appid}/header.jpg`
    };
}

async function scrapeGames() {
    console.log('Starting Steam games scraper...');
    const currentGames = await getCurrentGames();
    const currentIds = new Set(currentGames.map(g => g.id));
    const newGames = [];

    for (const tag of TYCOON_TAGS) {
        console.log(`Searching for games with tag: ${tag}`);
        const games = await fetchSteamGames(tag);
        
        for (const game of games) {
            if (!currentIds.has(game.id.toString())) {
                const details = await getGameDetails(game.id);
                if (details && details.type === 'game') {
                    const formattedGame = formatGameData(details);
                    newGames.push(formattedGame);
                    currentIds.add(formattedGame.id);
                }
                // Rate limiting
                await new Promise(resolve => setTimeout(resolve, 1000));
            }
        }
    }

    if (newGames.length > 0) {
        const updatedGames = [...currentGames, ...newGames];
        await updateGames(updatedGames);
        console.log(`Added ${newGames.length} new games`);
        return updatedGames;
    }
    
    console.log('No new games found');
    return currentGames;
}

async function getCurrentGames() {
    try {
        const response = await fetch('tycoon-games-database.json');
        return await response.json();
    } catch (error) {
        console.error('Error loading games:', error);
        return [];
    }
}

async function updateGames(games) {
    localStorage.setItem('lastScrapeTime', Date.now().toString());
    displayGames(games);
}

function shouldScrape() {
    const lastScrape = parseInt(localStorage.getItem('lastScrapeTime') || '0');
    return Date.now() - lastScrape >= SCRAPE_INTERVAL;
}

// Initialize scraper
document.addEventListener('DOMContentLoaded', async () => {
    let games = await getCurrentGames();
    
    if (shouldScrape()) {
        console.log('Starting initial scrape...');
        games = await scrapeGames();
    } else {
        console.log('Using cached games data');
    }
    
    displayGames(games);
});

// Function to display games (to be implemented in your main script)
function displayGames(games) {
    // This function should be implemented in your main script.js
    // It will receive the games array and update the UI
    if (window.updateGamesList) {
        window.updateGamesList(games);
    }
}
