// scraper.js
const STEAM_API_URL = 'https://store.steampowered.com/api';
const TYCOON_TAGS = ['Tycoon', 'Management', 'Economy', 'Business Simulation'];
const STEAM_API_KEY = '853886416C617C0B3B10DEFED11EDC50'; // Your Steam API key

async function fetchSteamGames(tag) {
  try {
    const response = await fetch(`${STEAM_API_URL}/storesearch/?term=${tag}&l=english&key=${STEAM_API_KEY}`);
    const data = await response.json();
    return data.items ||;
  } catch (error) {
    console.error(`Error fetching games for tag ${tag}:`, error);
    return;
  }
}

async function getGameDetails(appId) {
  try {
    const response = await fetch(`${STEAM_API_URL}/appdetails?appids=${appId}&l=english&key=${STEAM_API_KEY}`);
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
    genres: steamData.genres.map((g) => g.description),
    release_date: steamData.release_date.date,
    price: steamData.is_free
      ? 0
      : (steamData.price_overview?.final / 100) || 0,
    rating: (steamData.metacritic?.score / 20) || 4.0,
    features: steamData.categories?.map((c) => c.description) ||,
    tags: steamData.genres.map((g) => g.description),
    cover_image: `https://cdn.cloudflare.steamstatic.com/steam/apps/${steamData.steam_appid}/header.jpg`,
  };
}

export async function getTycoonGames() {
  console.log('Fetching tycoon games from Steam API...');
  const allGames =;
  for (const tag of TYCOON_TAGS) {
    console.log(`Searching for games with tag: ${tag}`);
    const games = await fetchSteamGames(tag);
    for (const game of games) {
      const details = await getGameDetails(game.id);
      if (details && details.type === 'game') {
        const formattedGame = formatGameData(details);
        allGames.push(formattedGame);
      }
      // Rate limiting
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }
  return allGames;
}