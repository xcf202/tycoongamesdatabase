# Tycoon Games Database

A comprehensive database of tycoon and management simulation games. This website allows users to discover, explore, and submit tycoon games.

Live site: [https://xcf202.github.io/tycoongamesdatabase](https://xcf202.github.io/tycoongamesdatabase)

## Features

- Browse tycoon games with detailed information
- Filter games by type (free/paid) and status (released/unreleased)
- View comprehensive game details including descriptions and store links
- Submit new games to the database
- Responsive design for all devices
- Dynamic content loading
- Error handling and loading states

## Pages

- **Home**: Featured games and category navigation
- **Games**: Complete game listing with filters
- **Game Details**: Individual game information
- **Submit**: Form to submit new games
- **About**: Project information and future plans

## Technologies Used

- HTML5, CSS3, JavaScript (ES6+)
- JSON for data storage
- GitHub Pages for hosting

## Project Structure

```
tycoongamesdatabase/
├── index.html              # Home page
├── games.html             # Games listing page
├── game-details.html      # Individual game details page
├── submit.html            # Game submission page
├── about.html            # About page
├── styles.css            # Global styles
├── home-script.js        # Home page functionality
├── games-script.js       # Games listing functionality
├── game-details-script.js # Game details functionality
├── submit-script.js      # Form submission handling
├── default-game-image.svg # Fallback game image
└── tycoon-games-database.json # Game data
```

## Setup

1. Clone the repository:
```bash
git clone https://github.com/xcf202/tycoongamesdatabase.git
cd tycoongamesdatabase
```

2. Enable GitHub Pages in your repository settings:
   - Go to Settings > Pages
   - Select 'main' branch as source
   - Save the changes

3. Your site will be available at: `https://xcf202.github.io/tycoongamesdatabase`

## Development

The project uses:
- Pure HTML, CSS, and JavaScript
- JSON for data storage
- GitHub Pages for hosting

### Available Pages

- Home: `index.html`
- Games List: `games.html`
- Submit Game: `submit.html`
- About: `about.html`

### Features

- Static file hosting
- Client-side JavaScript
- Responsive design
- JSON data management

### Local Development

To test locally, you can use any static file server. For example:

Using Python:
```bash
python -m http.server 8000
```

Or using VS Code's Live Server extension.

## Contributing

1. Fork the repository
2. Create a new branch for your feature
3. Make your changes
4. Test locally using a static file server
5. Submit a pull request

## Future Plans

- Advanced search and filtering
- User reviews and ratings
- Game recommendations
- Developer spotlights
- User accounts and favorites
- More game categories and filters

## License

MIT License - feel free to use this project for learning or as a base for your own tycoon games database.
