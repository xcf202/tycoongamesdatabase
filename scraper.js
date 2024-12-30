// scraper.js

const STEAM_API_URL = "https://store.steampowered.com/api";
const TYCOON_TAGS = [
  "Tycoon",
  "Management",
  "Economy",
  "Business Simulation",
];
const SCRAPE_INTERVAL = 12 * 60 * 60 * 1000; // 12 hours in milliseconds
const STEAM_API_KEY = "853886416C617C0B3B10DEFED11EDC50"; // Your Steam API key

async function fetchSteamGames(tag) {
  try {
    const response = await fetch(
      `${STEAM_API_URL}/storesearch/?term=${tag}&l=english&key=${STEAM_API_KEY}`,
    );
    const data = await response.json();
    return data.items || [];
  } catch (error) {
    console.error(`Error fetching games for tag ${tag}:`, error);
    return [];
  }
}

async function getGameDetails(appId) {
  try {
    const response = await fetch(
      `${STEAM_API_URL}/appdetails?appids=${appId}&l=english&key=${STEAM_API_KEY}`,
    );
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
    features: steamData.categories?.map((c) => c.description) || [],
    tags: steamData.genres.map((g) => g.description),
    cover_image: `https://cdn.cloudflare.steamstatic.com/steam/apps/${steamData.steam_appid}/header.jpg`,
  };
}

async function scrapeGames() {
  console.log("Starting Steam games scraper...");
  const currentGames = await getCurrentGames();
  const currentIds = new Set(currentGames.map((g) => g.id));
  let gamesUpdated = false;
  for (const tag of TYCOON_TAGS) {
    console.log(`Searching for games with tag: ${tag}`);
    const games = await fetchSteamGames(tag);

    for (const game of games) {
      if (!currentIds.has(game.id?.toString())) {
        const details = await getGameDetails(game.id);
        if (details && details.type === "game") {
          const formattedGame = formatGameData(details);
          currentGames.push(formattedGame);
          currentIds.add(formattedGame.id);
          gamesUpdated = true;

          // Mark as new and update UI immediately
          formattedGame.isNew = true;
          console.log(`Added new game: ${formattedGame.title}`);
          window.updateLoadingStatus(`Found new game: ${formattedGame.title}`);
          await updateGames(currentGames);
        }
        // Rate limiting
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }
    }
  }

  if (!gamesUpdated) {
    console.log("No new games found");
    window.updateLoadingStatus("No new games found");
  }

  return currentGames;
}

async function getCurrentGames() {
  try {
    const response = await fetch("tycoon-games-database.json");
    return await response.json();
  } catch (error) {
    console.error("Error loading games:", error);
    return [];
  }
}

async function updateGames(games) {
  // Sort games by release date (newest first)
  games.sort(
    (a, b) => new Date(b.release_date) - new Date(a.release_date),
  );
  localStorage.setItem("lastScrapeTime", Date.now().toString());
  localStorage.setItem("gamesCache", JSON.stringify(games));
  displayGames(games);
}

function shouldScrape() {
  const lastScrape = parseInt(localStorage.getItem("lastScrapeTime") || "0");
  return Date.now() - lastScrape >= SCRAPE_INTERVAL;
}

// Initialize scraper
document.addEventListener("DOMContentLoaded", async () => {
  const loadingIndicator = document.getElementById("loading-indicator");
  let games;

  try {
    if (loadingIndicator) loadingIndicator.style.display = "block";
    window.updateLoadingStatus("Loading games database...");

    // Try to load cached games first
    const cachedGames = localStorage.getItem("gamesCache");
    if (cachedGames) {
      games = JSON.parse(cachedGames);
      displayGames(games);
    }

    // Check if we need to scrape
    if (shouldScrape()) {
      window.updateLoadingStatus("Checking for new games...");
      console.log("Starting scrape...");
      games = await scrapeGames();
    } else if (!games) {
      console.log("Using cached games data");
      games = await getCurrentGames();
    }

    displayGames(games);
  } catch (error) {
    console.error("Error initializing scraper:", error);
    window.updateLoadingStatus("Error loading games. Please refresh the page.");
  } finally {
    if (loadingIndicator) {
      setTimeout(() => {
        loadingIndicator.style.display = "none";
      }, 1000);
    }
  }
});

function displayGames(games) {
  if (window.updateGamesList) {
    window.updateGamesList(games);
  }
}