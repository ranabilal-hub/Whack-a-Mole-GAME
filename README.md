🔨 Whack-a-Mole

A browser-based Whack-a-Mole game built using HTML, CSS, and JavaScript. Moles pop out of the garden, and players must hit them before time runs out.

This project was developed as an ICT Final Project at FAST-NUCES Karachi.

The game includes three difficulty levels, power-ups, a boss mole, combo multipliers, achievement badges, and a saved leaderboard. It requires no external libraries, build tools, or server.

✨ Features

- Start screen with a warm-up mole that players can tap.
- Player name entry and difficulty selection.
- Game guide explaining all items and a Top 5 leaderboard.
- 3-2-1 countdown before each round.
- Three difficulty levels: Easy, Medium, and Hard.
- Different mole spawn rates and game settings for each level.
- Special items, power-ups, and hazards:
  - Golden Mole
  - Clock
  - Boss Mole
  - Bombs
- Combo multiplier for consecutive successful hits.
- Frenzy Mode that doubles points during the final 8 seconds.
- Achievement badges awarded on the game-over screen.
- Leaderboard and player names saved using "localStorage".
- Pause and resume functionality.
- Sound on/off control.
- Day and night themes.
- Custom hammer cursor, hit particles, and score popups.
- Responsive design for desktop and mobile devices.
- Supports the reduced-motion accessibility setting.

🎮 How to Play

1. Enter your name.
2. Choose a difficulty level: Easy, Medium, or Hard.
3. Press Play to start the game.
4. Wait for moles to pop out of the holes.
5. Click or tap the moles to earn points.
6. Avoid bombs because they reduce your score.
7. Maintain consecutive hits to increase your combo multiplier.
8. Score as many points as possible before the timer reaches zero.

🏆 Scoring System

Item| Result
🐹 Normal Mole| +1 point
🐹 Golden Mole| +5 points
🦫 Boss Mole| +10 points (requires 3 hits)
⏰ Clock| +3 seconds
💣 Bomb| -3 points and combo lost

Combo System

- 5 consecutive hits: 2x points multiplier.
- 10 consecutive hits: 3x points multiplier.

Frenzy Mode

During the final 8 seconds of the game, every point is doubled. This bonus stacks with the combo multiplier.

⚡ Difficulty Levels

Each difficulty level changes the time limit, maximum number of active moles, and probability of special items appearing.

Setting| Easy| Medium| Hard
Time Limit| 35s| 30s| 25s
Moles at Once| 1| 2| 3
Bomb Chance| 10%| 15%| 22%
Golden Mole Chance| 6%| 7%| 8%
Clock Chance| 5%| 4%| 3%
Boss Mole Chance| 3%| 5%| 7%

Note: The percentages represent the probability that a new pop-up will contain the corresponding special item. All remaining pop-ups contain normal moles.

🥇 Achievement Badges

Players can unlock different badges depending on their performance.

Badge| Requirement
🎯 Sharpshooter| Achieve 90% accuracy or higher with at least 10 hits.
🔥 Combo King| Reach a combo streak of 10 or more.
🛡️ Bomb Dodger| Hit no bombs with at least 10 hits.
🌟 Golden Touch| Hit 2 or more golden moles.
🦫 Boss Slayer| Defeat a boss mole.

🚀 Run the Game Locally

No installation, external libraries, build process, or server is required.

1. Clone the Repository

git clone https://github.com/USERNAME/REPOSITORY.git

Replace "USERNAME" and "REPOSITORY" with the actual GitHub username and repository name.

2. Open the Project Folder

Navigate to the downloaded project folder.

3. Run the Game

Open "index.html" in any modern web browser.

That's it! The game is ready to play.

Note: The Fredoka font loads from Google Fonts when an internet connection is available. When offline, the game uses a similar rounded system font.

📁 Project Structure

Whack-a-Mole/
│
├── index.html      # Start screen, game screen and overlays
├── style.css       # Garden theme, layout, animations and night mode
├── script.js       # Game logic, levels, scoring and leaderboard
└── README.md       # Project documentation

⚙️ How It Works

The project uses JavaScript to manage the game logic, scoring system, animations, and player interactions.

Main Functions

- LEVELS: An object in "script.js" containing the settings for each difficulty level. Game time, spawn chances, and other settings can be modified in one place.

- spawn() and show(): Select an available hole randomly and determine which item will appear, such as a normal mole, bomb, golden mole, clock, or boss mole.

- whack(): Handles player interactions, including missed hits, bombs, boss mole health, combo streaks, frenzy mode, and scoring.

- multiplier() and frenzy(): Calculate bonus points based on consecutive hits and the remaining game time.

- load() and save(): Handle leaderboard data using "localStorage", with "try/catch" to ensure the game continues working even if browser storage is unavailable.

Security Consideration

Player names on the leaderboard are displayed using "textContent" instead of "innerHTML". This prevents user-entered names from being interpreted as HTML.

🎨 Customize the Game

The game can be customized by modifying a few sections of the source code:

- Difficulty and Timing: Change the time limits, spawn speed, and item probabilities in the "LEVELS" object at the top of "script.js".
- Colors and Appearance: Modify the CSS variables inside the ":root" section at the top of "style.css".
- Night Theme: Customize the night-mode appearance using "body.night".
- Mole Appearance: Replace the emojis inside the "ICON" object to change the appearance of the game items.

🧠 Concepts and Technologies Used

This project demonstrates the practical use of fundamental web development concepts:

- HTML5
- CSS3
- JavaScript
- DOM Manipulation
- Event Handling
- Timers ("setTimeout" and "setInterval")
- CSS Grid and Flexbox
- CSS Animations and Custom Properties
- Web Audio API
- Browser "localStorage" API
- Responsive Web Design

👨‍💻 Project Team

FAST-NUCES Karachi

- Zohair Abbas
- Rana Bilal
- Shahriyar Rehman

---

Developed as an ICT Final Project.
