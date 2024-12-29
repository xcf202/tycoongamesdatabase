import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import axios from 'axios';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const STEAM_API_URL = 'https://store.steampowered.com/api';
const TYCOON_TAGS = ['Tycoon', 'Management', 'Economy', 'Business Simulation'];

async function fetchSteamGames(tag) {
    try {
        const response = await axios.get(`${STEAM_API_URL}/storesearch/`, {
            params: {
                term: tag,
                l: 'english'
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
    const games = new Map();

    for (const tag of TYCOON_TAGS) {
        console.log(`Searching for games with tag: ${tag}`);
        const steamGames = await fetchSteamGames(tag);
        
        for (const game of steamGames) {
            if (!games.has(game.id)) {
                const details = await getGameDetails(game.id);
                if (details && details.type === 'game') {
                    const formattedGame = formatGameData(details);
                    games.set(formattedGame.id, formattedGame);
                }
                // Rate limiting
                await new Promise(resolve => setTimeout(resolve, 1000));
            }
        }
    }

    return Array.from(games.values());
}

async function copyFile(src, dest) {
    try {
        await fs.copyFile(src, dest);
        console.log(`Copied ${src} to ${dest}`);
    } catch (error) {
        console.error(`Error copying ${src}:`, error);
    }
}

async function build() {
    // Create dist directory
    const distDir = path.join(__dirname, 'dist');
    try {
        await fs.mkdir(distDir, { recursive: true });
    } catch (error) {
        console.error('Error creating dist directory:', error);
        return;
    }

    // Scrape games and update database
    console.log('Scraping games...');
    const games = await scrapeGames();
    await fs.writeFile(
        path.join(distDir, 'tycoon-games-database.json'),
        JSON.stringify(games, null, 2)
    );

    // Copy static files
    const filesToCopy = [
        'index.html',
        'games.html',
        'about.html',
        'styles.css',
        'script.js',
        'scraper.js',
        'default-game-image.svg'
    ];

    for (const file of filesToCopy) {
        await copyFile(
            path.join(__dirname, file),
            path.join(distDir, file)
        );
    }

    console.log('Build completed successfully!');
}

build().catch(console.error);
