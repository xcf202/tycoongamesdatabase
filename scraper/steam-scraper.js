import axios from 'axios';
import fs from 'fs/promises';
import path from 'path';

const STEAM_API_URL = 'https://store.steampowered.com/api';
const TYCOON_TAGS = ['Tycoon', 'Management', 'Economy', 'Business Simulation'];
const DATABASE_PATH = '../tycoon-games-database.json';

async function fetchSteamGames(tag, page = 1) {
    try {
        const response = await axios.get(`${STEAM_API_URL}/storesearch/`, {
            params: {
                term: tag,
                l: 'english',
                page: page
            }
        });
        return response.data.items || [];
    } catch (error) {
        console.error(`Error fetching games for tag ${tag}:`, error.message);
        return [];
    }
}

async function getGameDetails(appId) {
    try {
        const response = await axios.get(`${STEAM_API_URL}/appdetails`, {
            params: {
                appids: appId,
                l: 'english'
            }
        });
        return response.data[appId].data;
    } catch (error) {
        console.error(`Error fetching details for game ${appId}:`, error.message);
        return null;
    }
}

async function getCurrentDatabase() {
    try {
        const data = await fs.readFile(path.resolve(DATABASE_PATH), 'utf-8');
        return JSON.parse(data);
    } catch (error) {
        console.error('Error reading database:', error.message);
        return [];
    }
}

async function updateDatabase(games) {
    try {
        await fs.writeFile(
            path.resolve(DATABASE_PATH),
            JSON.stringify(games, null, 2),
            'utf-8'
        );
        console.log('Database updated successfully');
    } catch (error) {
        console.error('Error updating database:', error.message);
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
    const currentGames = await getCurrentDatabase();
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
        await updateDatabase(updatedGames);
        console.log(`Added ${newGames.length} new games to the database`);
    } else {
        console.log('No new games found');
    }
}

// For manual triggering
if (process.argv[2] === '--manual') {
    scrapeGames().catch(console.error);
}

export default scrapeGames;
