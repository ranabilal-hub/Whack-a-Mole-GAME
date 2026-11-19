🔨 Whack-a-Mole
A browser game built with plain HTML, CSS and JavaScript. Moles pop out of the garden, and you have to whack them before time runs out. It has three difficulty levels, power-ups, a boss mole, combo multipliers, badges and a saved leaderboard.
This was made as an ICT final project. It needs no libraries, no build step and no server.
Features
Start screen with a warm-up mole you can tap, name entry, difficulty picker, a guide to every item and a top-5 leaderboard
3-2-1 countdown before each round
Three levels that change the time limit, how many moles appear at once, and how often bombs and power-ups show up
Power-ups and hazards: golden mole, clock, boss mole and bombs
Combo multiplier for hitting several targets in a row
Frenzy mode that doubles points in the last 8 seconds
Badges awarded on the game-over screen
Leaderboard and name saved in the browser with localStorage
Pause button, sound on/off, and a day/night theme
Hammer cursor, hit particles and a score popup on every whack
Works on desktop and mobile, and respects the reduced-motion setting
How to play
Enter your name and choose Easy, Medium or Hard.
Press Play.
Click or tap the moles as they pop out of the holes.
Avoid the bombs. Tapping an empty hole breaks your combo.
Score as many points as you can before the timer hits zero.
Scoring
Item
Result
🐹 Mole
+1 point
🐹 Golden mole
+5 points
🦫 Boss mole
+10 points, takes 3 hits
⏰ Clock
+3 seconds
💣 Bomb
-3 points and combo lost
Combo: 5 hits in a row gives x2 points, and 10 in a row gives x3.
Frenzy: in the last 8 seconds every point is doubled, on top of the combo.
Levels
Level
Time
Moles at once
Bomb
Golden
Clock
Boss
Easy
35s
1
10%
6%
5%
3%
Medium
30s
2
15%
7%
4%
5%
Hard
25s
3
22%
8%
3%
7%
The percentages are the chance that a new pop-up is that item. Everything else is a normal mole.
Badges
Badge
How to earn it
🎯 Sharpshooter
90% accuracy or better with at least 10 hits
🔥 Combo king
A streak of 10 or more
🛡️ Bomb dodger
Hit no bombs, with at least 10 hits
🌟 Golden touch
Whack 2 or more golden moles
🦫 Boss slayer
Beat a boss mole
Run it locally
Download or clone the repository.
git clone https://github.com/<your-username>/<your-repo>.git
Open index.html in any modern browser.
That is all. The Fredoka font loads from Google Fonts when you are online, and the game falls back to a similar rounded system font when you are offline.
Project structure
.
├── index.html   # Start screen, game screen and overlays
├── style.css    # Garden theme, layout, animations and night mode
├── script.js    # Game logic, levels, scoring, leaderboard and screens
└── README.md
How it works
LEVELS object in script.js holds the settings for each difficulty, so you can balance the game by changing numbers in one place.
spawn() and show() pick a free hole at random and decide whether it holds a mole, bomb, golden mole, clock or boss.
whack() handles every click: misses, bombs, the boss's 3 hits, combo, frenzy and points.
multiplier() and frenzy() work out the combo and last-seconds bonuses.
load() and save() wrap localStorage in try/catch, so the game still runs if the browser blocks storage.
Names on the leaderboard are written with textContent, so nothing a player types can inject HTML.
Customize it
Change the time, speed or spawn chances in the LEVELS object at the top of script.js.
Change colors in the :root block at the top of style.css. The night theme overrides them under body.night.
Swap the emoji in the ICON object to change how the moles look.
Concepts used
DOM manipulation, event handling, timers (setTimeout and setInterval), CSS Grid and Flexbox, CSS animations and custom properties, the Web Audio API, and the localStorage API.
Zohair Abbas 
Rana Bilal
Shahriyar Rehman
FAST NUCES KARACHI
