// Maze Game Class
class MazeGame {
    constructor() {
        this.canvas = null;
        this.ctx = null;
        this.currentLevel = this.loadSavedLevel(); // Load saved level
        this.totalLevels = 10;
        this.fixedCanvasSize = 500; // Fixed canvas size
        this.maze = [];
        this.playerPos = { x: 0, y: 0 };
        this.goalPos = { x: 0, y: 0 };
        this.moveCount = 0;
        this.startTime = null;
        this.gameActive = false;
        this.mazeWidth = 0;
        this.mazeHeight = 0;
        this.timerInterval = null; // Add timer interval tracking
        
        // Level configurations (width x height) - progressively harder
        this.levelConfigs = [
            { width: 11, height: 11, name: "Beginner's Luck", difficulty: "Easy" },      // Level 1
            { width: 15, height: 15, name: "Getting Started", difficulty: "Easy" },      // Level 2
            { width: 19, height: 19, name: "Warming Up", difficulty: "Easy" },           // Level 3
            { width: 23, height: 23, name: "Finding Your Way", difficulty: "Medium" },   // Level 4
            { width: 27, height: 27, name: "Mind Bender", difficulty: "Medium" },        // Level 5
            { width: 31, height: 31, name: "Challenge Accepted", difficulty: "Medium" }, // Level 6
            { width: 35, height: 35, name: "Expert Territory", difficulty: "Hard" },     // Level 7
            { width: 39, height: 39, name: "Master's Domain", difficulty: "Hard" },      // Level 8
            { width: 43, height: 43, name: "Nightmare Mode", difficulty: "Extreme" },    // Level 9
            { width: 47, height: 47, name: "Impossible Dream", difficulty: "Extreme" }   // Level 10
        ];
        
        this.initializeEventListeners();
    }
    
    initializeEventListeners() {
        // Check if elements exist before adding event listeners
        const startMazeBtn = document.getElementById('start-maze');
        const resetMazeBtn = document.getElementById('reset-maze');
        const backToWelcomeBtn = document.getElementById('back-to-welcome');
        const restartGameBtn = document.getElementById('restart-game');
        const nextLevelBtn = document.getElementById('next-level-btn');
        const retryLevelBtn = document.getElementById('retry-level-btn');
        const homeBtn = document.getElementById('home-btn');
        
        if (startMazeBtn) startMazeBtn.addEventListener('click', () => this.startMazeGame());
        if (resetMazeBtn) resetMazeBtn.addEventListener('click', () => this.resetCurrentLevel());
        if (backToWelcomeBtn) backToWelcomeBtn.addEventListener('click', () => this.backToWelcome());
        if (restartGameBtn) restartGameBtn.addEventListener('click', () => this.restartWholeGame());
        if (nextLevelBtn) nextLevelBtn.addEventListener('click', () => this.nextLevel());
        if (retryLevelBtn) retryLevelBtn.addEventListener('click', () => this.resetCurrentLevel());
        if (homeBtn) homeBtn.addEventListener('click', () => this.backToWelcome());
        
        // Keyboard controls
        document.addEventListener('keydown', (e) => this.handleKeyPress(e));
    }
    
    startMazeGame() {
        this.showMazeScreen();
        if (this.initializeCanvas()) {
            this.generateMaze();
            this.startTimer();
        }
    }
    
    showMazeScreen() {
        document.querySelectorAll('.screen').forEach(screen => {
            screen.classList.remove('active');
        });
        document.getElementById('maze-screen').classList.add('active');
    }
    
    initializeCanvas() {
        this.canvas = document.getElementById('maze-canvas');
        if (!this.canvas) {
            console.error('Maze canvas not found');
            return false;
        }
        
        this.ctx = this.canvas.getContext('2d');
        if (!this.ctx) {
            console.error('Could not get canvas context');
            return false;
        }
        
        const config = this.levelConfigs[this.currentLevel - 1];
        this.mazeWidth = config.width;
        this.mazeHeight = config.height;
        
        // Fixed canvas size, calculate cell size based on maze dimensions
        this.canvas.width = this.fixedCanvasSize;
        this.canvas.height = this.fixedCanvasSize;
        
        // Calculate cell size to fit the maze in the fixed canvas
        this.cellSize = Math.floor(this.fixedCanvasSize / Math.max(this.mazeWidth, this.mazeHeight));
        
        this.updateUI();
        return true;
    }
    
    generateMaze() {
        // Initialize maze with walls
        this.maze = Array(this.mazeHeight).fill().map(() => Array(this.mazeWidth).fill(1));
        
        // Use recursive backtracking algorithm to generate maze
        this.carveMaze(1, 1);
        
        // Set player starting position
        this.playerPos = { x: 1, y: 1 };
        
        // Set goal position (bottom right area)
        this.goalPos = { 
            x: this.mazeWidth - 2, 
            y: this.mazeHeight - 2 
        };
        
        // Ensure goal is accessible
        this.maze[this.goalPos.y][this.goalPos.x] = 0;
        
        this.moveCount = 0;
        this.gameActive = true;
        this.drawMaze();
    }
    
    carveMaze(x, y) {
        this.maze[y][x] = 0; // Mark as path
        
        // Define directions: up, right, down, left
        const directions = [
            [0, -2], [2, 0], [0, 2], [-2, 0]
        ];
        
        // Shuffle directions for randomness
        this.shuffleArray(directions);
        
        for (let [dx, dy] of directions) {
            const newX = x + dx;
            const newY = y + dy;
            
            // Check if the new position is within bounds and is a wall
            if (newX > 0 && newX < this.mazeWidth - 1 && 
                newY > 0 && newY < this.mazeHeight - 1 && 
                this.maze[newY][newX] === 1) {
                
                // Carve the wall between current and new position
                this.maze[y + dy/2][x + dx/2] = 0;
                this.carveMaze(newX, newY);
            }
        }
    }
    
    shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }
    
    drawMaze() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Calculate offset to center the maze in the fixed canvas
        const mazePixelWidth = this.mazeWidth * this.cellSize;
        const mazePixelHeight = this.mazeHeight * this.cellSize;
        const offsetX = (this.fixedCanvasSize - mazePixelWidth) / 2;
        const offsetY = (this.fixedCanvasSize - mazePixelHeight) / 2;
        
        // Draw maze cells
        for (let y = 0; y < this.mazeHeight; y++) {
            for (let x = 0; x < this.mazeWidth; x++) {
                const cellX = offsetX + (x * this.cellSize);
                const cellY = offsetY + (y * this.cellSize);
                
                if (this.maze[y][x] === 1) {
                    // Wall
                    this.ctx.fillStyle = this.getDifficultyColor();
                    this.ctx.fillRect(cellX, cellY, this.cellSize, this.cellSize);
                } else {
                    // Path
                    this.ctx.fillStyle = '#f8f9fa';
                    this.ctx.fillRect(cellX, cellY, this.cellSize, this.cellSize);
                }
                
                // Draw grid lines for better visibility on smaller cells
                if (this.cellSize > 8) {
                    this.ctx.strokeStyle = '#dee2e6';
                    this.ctx.lineWidth = 1;
                    this.ctx.strokeRect(cellX, cellY, this.cellSize, this.cellSize);
                }
            }
        }
        
        // Draw goal
        this.drawEmoji(this.goalPos.x, this.goalPos.y, '🏆', offsetX, offsetY);
        
        // Draw player
        this.drawEmoji(this.playerPos.x, this.playerPos.y, '🟡', offsetX, offsetY);
    }
    
    drawEmoji(x, y, emoji, offsetX = 0, offsetY = 0) {
        const cellX = offsetX + (x * this.cellSize);
        const cellY = offsetY + (y * this.cellSize);
        
        this.ctx.font = `${Math.max(this.cellSize * 0.7, 8)}px Arial`;
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        this.ctx.fillStyle = '#000';
        this.ctx.fillText(
            emoji, 
            cellX + this.cellSize / 2, 
            cellY + this.cellSize / 2
        );
    }
    
    getDifficultyColor() {
        if (this.currentLevel <= 3) return '#374151'; // Easy - Gray
        if (this.currentLevel <= 6) return '#92400e'; // Medium - Brown
        if (this.currentLevel <= 8) return '#dc2626'; // Hard - Red
        return '#7c2d12'; // Extreme - Dark red
    }
    
    handleKeyPress(e) {
        if (!this.gameActive) return;
        
        let newX = this.playerPos.x;
        let newY = this.playerPos.y;
        
        switch(e.key.toLowerCase()) {
            case 'arrowup':
            case 'w':
                newY--;
                break;
            case 'arrowdown':
            case 's':
                newY++;
                break;
            case 'arrowleft':
            case 'a':
                newX--;
                break;
            case 'arrowright':
            case 'd':
                newX++;
                break;
            default:
                return;
        }
        
        e.preventDefault();
        
        // Check if move is valid
        if (this.isValidMove(newX, newY)) {
            this.playerPos.x = newX;
            this.playerPos.y = newY;
            this.moveCount++;
            this.updateMoveCounter();
            this.drawMaze();
            
            // Check if player reached goal
            if (newX === this.goalPos.x && newY === this.goalPos.y) {
                this.levelCompleted();
            }
        }
    }
    
    isValidMove(x, y) {
        return x >= 0 && x < this.mazeWidth && 
               y >= 0 && y < this.mazeHeight && 
               this.maze[y][x] === 0;
    }
    
    levelCompleted() {
        this.gameActive = false;
        this.clearTimer(); // Stop the timer
        const timeTaken = this.getElapsedTime();
        const config = this.levelConfigs[this.currentLevel - 1];
        
        // Show winning animation
        this.showWinningAnimation();
        
        // Show popup after animation
        setTimeout(() => {
            this.showLevelPopup(timeTaken, config.difficulty);
        }, 2000);
    }
    
    showLevelPopup(timeTaken, difficulty) {
        const popup = document.getElementById('level-popup-overlay');
        const levelPopup = document.getElementById('level-popup');
        
        if (!popup || !levelPopup) return; // Safety check
        
        // Update popup content safely
        const timeElement = document.getElementById('popup-time');
        const movesElement = document.getElementById('popup-moves');
        const levelElement = document.getElementById('popup-level');
        const difficultyElement = document.getElementById('popup-difficulty');
        const titleElement = document.getElementById('popup-title');
        const nextLevelBtn = document.getElementById('next-level-btn');
        
        if (timeElement) timeElement.textContent = timeTaken;
        if (movesElement) movesElement.textContent = this.moveCount;
        if (levelElement) levelElement.textContent = this.currentLevel;
        if (difficultyElement) difficultyElement.textContent = difficulty;
        
        // Handle last level
        if (this.currentLevel >= this.totalLevels) {
            if (titleElement) titleElement.textContent = '🏆 Game Complete!';
            levelPopup.classList.add('game-complete');
            if (nextLevelBtn) nextLevelBtn.style.display = 'none';
            
            // Show final game completion animation
            this.showGameCompletionAnimation();
        } else {
            if (titleElement) titleElement.textContent = '🎉 Level Complete!';
            levelPopup.classList.remove('game-complete');
            if (nextLevelBtn) nextLevelBtn.style.display = 'inline-block';
        }
        
        // Show popup with animation
        popup.classList.add('show');
    }
    
    hidePopup() {
        const popup = document.getElementById('level-popup-overlay');
        popup.classList.remove('show');
    }
    
    nextLevel() {
        this.hidePopup();
        if (this.currentLevel < this.totalLevels) {
            this.currentLevel++;
            this.saveCurrentLevel(); // Save progress
            this.initializeCanvas(); // Reinitialize canvas with new dimensions
            this.generateMaze();
            this.startTimer();
        }
    }
    
    resetCurrentLevel() {
        this.hidePopup();
        this.initializeCanvas(); // Reinitialize canvas
        this.generateMaze();
        this.startTimer();
    }
    
    backToWelcome() {
        this.hidePopup();
        this.gameActive = false;
        this.clearTimer(); // Clear timer when going back to welcome
        // Don't reset currentLevel - keep progress
        document.querySelectorAll('.screen').forEach(screen => {
            screen.classList.remove('active');
        });
        document.getElementById('welcome-screen').classList.add('active');
        document.getElementById('current-level').textContent = this.currentLevel;
    }
    
    startTimer() {
        this.startTime = Date.now();
        this.clearTimer(); // Clear any existing timer
        this.startTimerInterval();
    }
    
    startTimerInterval() {
        this.timerInterval = setInterval(() => {
            if (this.gameActive) {
                const timeElement = document.getElementById('time-count');
                if (timeElement) {
                    timeElement.textContent = this.getElapsedTime();
                }
            } else {
                this.clearTimer();
            }
        }, 1000);
    }
    
    clearTimer() {
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
            this.timerInterval = null;
        }
    }
    
    getElapsedTime() {
        if (!this.startTime) return '00:00';
        const elapsed = Math.floor((Date.now() - this.startTime) / 1000);
        const minutes = Math.floor(elapsed / 60);
        const seconds = elapsed % 60;
        return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
    
    updateUI() {
        const mazeLevelElement = document.getElementById('maze-level');
        const currentLevelElement = document.getElementById('current-level');
        
        if (mazeLevelElement) mazeLevelElement.textContent = this.currentLevel;
        if (currentLevelElement) currentLevelElement.textContent = this.currentLevel;
    }
    
    updateMoveCounter() {
        const moveCountElement = document.getElementById('move-count');
        if (moveCountElement) moveCountElement.textContent = this.moveCount;
    }
    
    // Level persistence methods
    loadSavedLevel() {
        const savedLevel = localStorage.getItem('mazeCurrentLevel');
        return savedLevel ? parseInt(savedLevel) : 1;
    }
    
    saveCurrentLevel() {
        localStorage.setItem('mazeCurrentLevel', this.currentLevel.toString());
    }
    
    clearSavedLevel() {
        localStorage.removeItem('mazeCurrentLevel');
    }
    
    restartWholeGame() {
        this.hidePopup();
        this.gameActive = false;
        this.clearTimer();
        this.currentLevel = 1;
        this.clearSavedLevel();
        this.initializeCanvas();
        this.generateMaze();
        this.startTimer();
    }
    
    showWinningAnimation() {
        // Clear the maze and draw celebration
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw dark background
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw big trophy in the center
        const centerX = this.canvas.width / 2;
        const centerY = this.canvas.height / 2;
        
        // Animate trophy growing
        let scale = 0;
        const animateInterval = setInterval(() => {
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            
            // Dark background
            this.ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
            this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
            
            // Trophy with growing scale
            this.ctx.font = `${80 * scale}px Arial`;
            this.ctx.textAlign = 'center';
            this.ctx.textBaseline = 'middle';
            this.ctx.fillStyle = '#FFD700'; // Gold color
            this.ctx.fillText('🏆', centerX, centerY);
            
            // Level complete text
            if (scale > 0.8) {
                this.ctx.font = `${24 * scale}px Arial`;
                this.ctx.fillStyle = '#FFFFFF';
                this.ctx.fillText(`Level ${this.currentLevel} Complete!`, centerX, centerY + 80);
                
                // Add sparkles around trophy
                this.drawSparkles(centerX, centerY, scale);
            }
            
            scale += 0.05;
            if (scale >= 1.2) {
                clearInterval(animateInterval);
                // Final trophy with sparkles
                this.drawFinalCelebration(centerX, centerY);
            }
        }, 50);
    }
    
    drawSparkles(centerX, centerY, scale) {
        const sparkles = ['✨', '⭐', '💫', '🌟'];
        const radius = 100 * scale;
        
        for (let i = 0; i < 8; i++) {
            const angle = (i * Math.PI * 2) / 8;
            const x = centerX + Math.cos(angle) * radius;
            const y = centerY + Math.sin(angle) * radius;
            
            this.ctx.font = `${20 * scale}px Arial`;
            this.ctx.fillStyle = '#FFFFFF';
            this.ctx.fillText(sparkles[i % sparkles.length], x, y);
        }
    }
    
    drawFinalCelebration(centerX, centerY) {
        // Final static display
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Dark background
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Big trophy
        this.ctx.font = '96px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        this.ctx.fillStyle = '#FFD700';
        this.ctx.fillText('🏆', centerX, centerY);
        
        // Level complete text
        this.ctx.font = '28px Arial';
        this.ctx.fillStyle = '#FFFFFF';
        this.ctx.fillText(`Level ${this.currentLevel} Complete!`, centerX, centerY + 80);
        
        // Draw sparkles
        this.drawSparkles(centerX, centerY, 1);
        
        // Add celebration text
        this.ctx.font = '20px Arial';
        this.ctx.fillStyle = '#00FF00';
        this.ctx.fillText('🎉 Amazing Work! 🎉', centerX, centerY + 120);
    }
    
    showGameCompletionAnimation() {
        // Special animation for completing all levels
        setTimeout(() => {
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            
            // Rainbow background
            const gradient = this.ctx.createLinearGradient(0, 0, this.canvas.width, this.canvas.height);
            gradient.addColorStop(0, 'rgba(255, 0, 150, 0.3)');
            gradient.addColorStop(0.25, 'rgba(255, 200, 0, 0.3)');
            gradient.addColorStop(0.5, 'rgba(0, 255, 0, 0.3)');
            gradient.addColorStop(0.75, 'rgba(0, 200, 255, 0.3)');
            gradient.addColorStop(1, 'rgba(150, 0, 255, 0.3)');
            
            this.ctx.fillStyle = gradient;
            this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
            
            const centerX = this.canvas.width / 2;
            const centerY = this.canvas.height / 2;
            
            // Multiple trophies and celebration
            this.ctx.font = '72px Arial';
            this.ctx.textAlign = 'center';
            this.ctx.textBaseline = 'middle';
            this.ctx.fillStyle = '#FFD700';
            this.ctx.fillText('🏆', centerX, centerY - 60);
            this.ctx.fillText('🏆', centerX - 80, centerY);
            this.ctx.fillText('🏆', centerX + 80, centerY);
            
            // Game complete text
            this.ctx.font = 'bold 32px Arial';
            this.ctx.fillStyle = '#FFFFFF';
            this.ctx.strokeStyle = '#000000';
            this.ctx.lineWidth = 2;
            this.ctx.strokeText('🎊 MAZE MASTER! 🎊', centerX, centerY + 80);
            this.ctx.fillText('🎊 MAZE MASTER! 🎊', centerX, centerY + 80);
            
            // Fireworks effect
            this.drawFireworks();
        }, 1000);
    }
    
    drawFireworks() {
        const fireworks = ['🎆', '🎇', '✨', '💥', '⭐'];
        for (let i = 0; i < 15; i++) {
            const x = Math.random() * this.canvas.width;
            const y = Math.random() * this.canvas.height;
            const emoji = fireworks[Math.floor(Math.random() * fireworks.length)];
            
            this.ctx.font = `${20 + Math.random() * 20}px Arial`;
            this.ctx.fillStyle = '#FFFFFF';
            this.ctx.fillText(emoji, x, y);
        }
    }
}

class PersonalityQuiz {
    constructor() {
        this.currentQuestion = 0;
        this.answers = [];
        this.isDarkMode = false;
        this.questions = [
            {
                question: "How do you prefer to spend your weekend?",
                options: [
                    { text: "Hosting a party with friends", trait: "extroversion", value: 2 },
                    { text: "Reading a book at home", trait: "introversion", value: 2 },
                    { text: "Exploring a new place outdoors", trait: "adventure", value: 2 },
                    { text: "Working on a creative project", trait: "creativity", value: 2 }
                ]
            },
            {
                question: "When making important decisions, you usually:",
                options: [
                    { text: "Trust your gut feeling", trait: "intuition", value: 2 },
                    { text: "Analyze all the facts thoroughly", trait: "logic", value: 2 },
                    { text: "Ask friends and family for advice", trait: "collaboration", value: 2 },
                    { text: "Consider the impact on others", trait: "empathy", value: 2 }
                ]
            },
            {
                question: "Your ideal work environment is:",
                options: [
                    { text: "A bustling office with team collaboration", trait: "extroversion", value: 1 },
                    { text: "A quiet space where you can focus", trait: "introversion", value: 1 },
                    { text: "Somewhere with constant new challenges", trait: "adventure", value: 1 },
                    { text: "A place that values innovation", trait: "creativity", value: 1 }
                ]
            },
            {
                question: "When learning something new, you prefer to:",
                options: [
                    { text: "Jump in and learn by doing", trait: "adventure", value: 1 },
                    { text: "Study the theory first", trait: "logic", value: 1 },
                    { text: "Learn from others' experiences", trait: "collaboration", value: 1 },
                    { text: "Find creative ways to understand", trait: "creativity", value: 1 }
                ]
            },
            {
                question: "In social situations, you typically:",
                options: [
                    { text: "Are the life of the party", trait: "extroversion", value: 2 },
                    { text: "Prefer deep conversations with few people", trait: "introversion", value: 2 },
                    { text: "Help others feel comfortable", trait: "empathy", value: 2 },
                    { text: "Share interesting ideas and stories", trait: "creativity", value: 1 }
                ]
            },
            {
                question: "Your approach to problem-solving is:",
                options: [
                    { text: "Think outside the box", trait: "creativity", value: 2 },
                    { text: "Use proven methods and logic", trait: "logic", value: 2 },
                    { text: "Brainstorm with others", trait: "collaboration", value: 2 },
                    { text: "Trust your instincts", trait: "intuition", value: 1 }
                ]
            },
            {
                question: "What motivates you most?",
                options: [
                    { text: "Helping others achieve their goals", trait: "empathy", value: 2 },
                    { text: "Solving complex puzzles", trait: "logic", value: 1 },
                    { text: "Discovering new experiences", trait: "adventure", value: 2 },
                    { text: "Creating something unique", trait: "creativity", value: 1 }
                ]
            },
            {
                question: "When facing a stressful situation, you:",
                options: [
                    { text: "Talk it through with someone", trait: "collaboration", value: 1 },
                    { text: "Take time alone to process", trait: "introversion", value: 1 },
                    { text: "Look for the silver lining", trait: "intuition", value: 1 },
                    { text: "Focus on what you can control", trait: "logic", value: 1 }
                ]
            }
        ];

        this.personalityTypes = {
            creative_intuitive: {
                title: "The Creative Visionary",
                icon: "🎨",
                description: "You're a imaginative soul who sees the world through a unique lens. You trust your intuition and love bringing new ideas to life.",
                traits: ["Highly creative and artistic", "Strong intuitive abilities", "Values originality and innovation", "Enjoys exploring new possibilities"],
                advice: "Channel your creativity into meaningful projects and don't be afraid to share your unique perspective with the world.",
                celebrities: [
                    { name: "Vincent van Gogh", initial: "VG", description: "Post-Impressionist Artist", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4c/Vincent_van_Gogh_-_Self-Portrait_-_Google_Art_Project_%28454045%29.jpg/200px-Vincent_van_Gogh_-_Self-Portrait_-_Google_Art_Project_%28454045%29.jpg", wiki: "https://en.wikipedia.org/wiki/Vincent_van_Gogh" },
                    { name: "Maya Angelou", initial: "MA", description: "Poet & Civil Rights Activist", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b4/Maya_Angelou_visits_YCP_in_2011.jpg/200px-Maya_Angelou_visits_YCP_in_2011.jpg", wiki: "https://en.wikipedia.org/wiki/Maya_Angelou" },
                    { name: "David Bowie", initial: "DB", description: "Musical Innovator", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e8/David-Bowie_Chicago_2002-08-08_photoby_Adam-Bielawski-cropped.jpg/200px-David-Bowie_Chicago_2002-08-08_photoby_Adam-Bielawski-cropped.jpg", wiki: "https://en.wikipedia.org/wiki/David_Bowie" },
                    { name: "Björk", initial: "BJ", description: "Avant-garde Musician", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9a/Bj%C3%B6rk_at_the_2018_Cannes_Film_Festival.jpg/200px-Bj%C3%B6rk_at_the_2018_Cannes_Film_Festival.jpg", wiki: "https://en.wikipedia.org/wiki/Bj%C3%B6rk" }
                ]
            },
            logical_adventurer: {
                title: "The Strategic Explorer",
                icon: "🧭",
                description: "You combine logical thinking with a love for adventure. You're practical yet always ready for new challenges.",
                traits: ["Excellent problem-solving skills", "Loves new experiences", "Approaches challenges systematically", "Values both logic and excitement"],
                advice: "Use your analytical skills to plan your next adventure. Your balanced approach to risk-taking is your superpower.",
                celebrities: [
                    { name: "Ernest Shackleton", initial: "ES", description: "Antarctic Explorer", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3b/Ernest_Shackleton_before_1909.jpg/200px-Ernest_Shackleton_before_1909.jpg", wiki: "https://en.wikipedia.org/wiki/Ernest_Shackleton" },
                    { name: "Katherine Johnson", initial: "KJ", description: "NASA Mathematician", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6d/Katherine_Johnson_at_NASA_in_1966.jpg/200px-Katherine_Johnson_at_NASA_in_1966.jpg", wiki: "https://en.wikipedia.org/wiki/Katherine_Johnson" },
                    { name: "Elon Musk", initial: "EM", description: "Space & Tech Pioneer", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/34/Elon_Musk_Royal_Society_%28crop2%29.jpg/200px-Elon_Musk_Royal_Society_%28crop2%29.jpg", wiki: "https://en.wikipedia.org/wiki/Elon_Musk" },
                    { name: "Jane Goodall", initial: "JG", description: "Primatologist & Explorer", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/fc/Jane_Goodall_2015.jpg/200px-Jane_Goodall_2015.jpg", wiki: "https://en.wikipedia.org/wiki/Jane_Goodall" }
                ]
            },
            empathetic_collaborator: {
                title: "The Compassionate Leader",
                icon: "💝",
                description: "You're naturally caring and work best with others. You have a gift for understanding people and bringing out their best.",
                traits: ["Excellent at reading emotions", "Natural team player", "Strong communication skills", "Values harmony and cooperation"],
                advice: "Your ability to connect with others is rare. Consider roles where you can mentor, lead, or support others in achieving their goals.",
                celebrities: [
                    { name: "Dolly Parton", initial: "DP", description: "Country Legend & Philanthropist", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d4/Dolly_Parton_in_Nashville_cropped.jpg/200px-Dolly_Parton_in_Nashville_cropped.jpg", wiki: "https://en.wikipedia.org/wiki/Dolly_Parton" },
                    { name: "Fred Rogers", initial: "FR", description: "Children's TV Host", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/40/Fred_Rogers%2C_late_1960s.jpg/200px-Fred_Rogers%2C_late_1960s.jpg", wiki: "https://en.wikipedia.org/wiki/Fred_Rogers" },
                    { name: "Malala Yousafzai", initial: "MY", description: "Education Activist", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7c/Malala_Yousafzai_2015.jpg/200px-Malala_Yousafzai_2015.jpg", wiki: "https://en.wikipedia.org/wiki/Malala_Yousafzai" },
                    { name: "Keanu Reeves", initial: "KR", description: "Actor & Humanitarian", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/33/Reuni%C3%A3o_com_o_ator_norte-americano_Keanu_Reeves_%2846806576554%29_%28cropped%29.jpg/200px-Reuni%C3%A3o_com_o_ator_norte-americano_Keanu_Reeves_%2846806576554%29_%28cropped%29.jpg", wiki: "https://en.wikipedia.org/wiki/Keanu_Reeves" }
                ]
            },
            introverted_thinker: {
                title: "The Thoughtful Analyst",
                icon: "🤔",
                description: "You're a deep thinker who values quiet reflection and logical analysis. You see patterns others miss.",
                traits: ["Excellent analytical abilities", "Values deep, meaningful relationships", "Thinks before acting", "Enjoys intellectual challenges"],
                advice: "Your thoughtful approach is valuable. Don't underestimate the power of your quiet insights and take time to share your ideas.",
                celebrities: [
                    { name: "Marie Curie", initial: "MC", description: "Nobel Prize Scientist", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7e/Marie_Curie_c1920.jpg/200px-Marie_Curie_c1920.jpg", wiki: "https://en.wikipedia.org/wiki/Marie_Curie" },
                    { name: "J.K. Rowling", initial: "JR", description: "Fantasy Author", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5d/J._K._Rowling_2010.jpg/200px-J._K._Rowling_2010.jpg", wiki: "https://en.wikipedia.org/wiki/J._K._Rowling" },
                    { name: "Tim Berners-Lee", initial: "TB", description: "Web Inventor", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4e/Sir_Tim_Berners-Lee_%28cropped%29.jpg/200px-Sir_Tim_Berners-Lee_%28cropped%29.jpg", wiki: "https://en.wikipedia.org/wiki/Tim_Berners-Lee" },
                    { name: "Stephen Hawking", initial: "SH", description: "Theoretical Physicist", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/eb/Stephen_Hawking.StarChild.jpg/200px-Stephen_Hawking.StarChild.jpg", wiki: "https://en.wikipedia.org/wiki/Stephen_Hawking" }
                ]
            },
            extroverted_enthusiast: {
                title: "The Social Energizer",
                icon: "⚡",
                description: "You're energized by people and new experiences. Your enthusiasm is contagious and you inspire others to take action.",
                traits: ["Natural networker", "High energy and enthusiasm", "Motivates and inspires others", "Thrives in social environments"],
                advice: "Your energy is your gift to the world. Use it to bring people together and champion causes you believe in.",
                celebrities: [
                    { name: "Dwayne Johnson", initial: "DJ", description: "Actor & Motivator", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f1/Dwayne_Johnson_2014_%28cropped%29.jpg/200px-Dwayne_Johnson_2014_%28cropped%29.jpg", wiki: "https://en.wikipedia.org/wiki/Dwayne_Johnson" },
                    { name: "Serena Williams", initial: "SW", description: "Tennis Champion", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4b/Serena_Williams_at_2013_US_Open.jpg/200px-Serena_Williams_at_2013_US_Open.jpg", wiki: "https://en.wikipedia.org/wiki/Serena_Williams" },
                    { name: "Jimmy Fallon", initial: "JF", description: "TV Host & Comedian", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8d/Jimmy_Fallon_2012_Shankbone.JPG/200px-Jimmy_Fallon_2012_Shankbone.JPG", wiki: "https://en.wikipedia.org/wiki/Jimmy_Fallon" },
                    { name: "Lady Gaga", initial: "LG", description: "Pop Icon & Activist", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/39/Lady_Gaga_at_Joe_Biden%27s_inauguration_%28cropped_2%29.jpg/200px-Lady_Gaga_at_Joe_Biden%27s_inauguration_%28cropped_2%29.jpg", wiki: "https://en.wikipedia.org/wiki/Lady_Gaga" }
                ]
            },
            balanced_harmonizer: {
                title: "The Versatile Harmonizer",
                icon: "⚖️",
                description: "You're well-balanced with strengths across multiple areas. You adapt well to different situations and bring stability to chaos.",
                traits: ["Adaptable to various situations", "Good balance of logic and emotion", "Brings people together", "Stable and reliable"],
                advice: "Your versatility is your strength. You can succeed in many different areas - don't be afraid to explore various paths.",
                celebrities: [
                    { name: "Leonardo da Vinci", initial: "LV", description: "Renaissance Polymath", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/ba/Leonardo_self.jpg/200px-Leonardo_self.jpg", wiki: "https://en.wikipedia.org/wiki/Leonardo_da_Vinci" },
                    { name: "Oprah Winfrey", initial: "OW", description: "Media Mogul & Philanthropist", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b8/Oprah_in_2014.jpg/200px-Oprah_in_2014.jpg", wiki: "https://en.wikipedia.org/wiki/Oprah_Winfrey" },
                    { name: "Benjamin Franklin", initial: "BF", description: "Founding Father & Inventor", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/25/Benjamin_Franklin_by_Joseph_Duplessis_1778.jpg/200px-Benjamin_Franklin_by_Joseph_Duplessis_1778.jpg", wiki: "https://en.wikipedia.org/wiki/Benjamin_Franklin" },
                    { name: "Michelle Obama", initial: "MO", description: "Former First Lady & Author", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4b/Michelle_Obama_2013_official_portrait.jpg/200px-Michelle_Obama_2013_official_portrait.jpg", wiki: "https://en.wikipedia.org/wiki/Michelle_Obama" }
                ]
            }
        };

        this.initializeEventListeners();
    }

    initializeEventListeners() {
        document.getElementById('start-quiz').addEventListener('click', () => this.startQuiz());
        document.getElementById('prev-btn').addEventListener('click', () => this.previousQuestion());
        document.getElementById('restart-quiz').addEventListener('click', () => this.restartQuiz());
        document.getElementById('theme-toggle').addEventListener('click', () => this.toggleTheme());
        
        // Load saved theme preference
        this.loadThemePreference();
    }

    startQuiz() {
        this.showScreen('quiz-screen');
        this.displayQuestion();
    }

    showScreen(screenId) {
        document.querySelectorAll('.screen').forEach(screen => {
            screen.classList.remove('active');
        });
        document.getElementById(screenId).classList.add('active');
    }

    displayQuestion() {
        const question = this.questions[this.currentQuestion];
        document.getElementById('question-text').textContent = question.question;
        document.getElementById('current-question').textContent = this.currentQuestion + 1;
        
        // Update progress bar
        const progress = ((this.currentQuestion + 1) / this.questions.length) * 100;
        document.getElementById('progress').style.width = `${progress}%`;
        
        // Create options
        const optionsContainer = document.getElementById('options-container');
        optionsContainer.innerHTML = '';
        
        question.options.forEach((option, index) => {
            const optionElement = document.createElement('div');
            optionElement.className = 'option';
            optionElement.textContent = option.text;
            optionElement.style.pointerEvents = 'auto'; // Re-enable clicking
            optionElement.addEventListener('click', () => this.selectOption(index));
            
            // Restore previous selection if any
            if (this.answers[this.currentQuestion] === index) {
                optionElement.classList.add('selected');
            }
            
            optionsContainer.appendChild(optionElement);
        });
        
        this.updateNavigationButtons();
    }

    selectOption(optionIndex) {
        // Disable all options to prevent multiple clicks
        document.querySelectorAll('.option').forEach(option => {
            option.style.pointerEvents = 'none';
            option.classList.remove('selected');
        });
        
        // Add selection to clicked option
        const selectedOption = document.querySelectorAll('.option')[optionIndex];
        selectedOption.classList.add('selected');
        
        // Store answer
        this.answers[this.currentQuestion] = optionIndex;
        
        // Auto-advance to next question after a short delay
        setTimeout(() => {
            if (this.currentQuestion < this.questions.length - 1) {
                this.currentQuestion++;
                this.displayQuestion();
            } else {
                // Last question - show results
                this.calculateResults();
            }
        }, 800); // 800ms delay to show the selection
        
        this.updateNavigationButtons();
    }

    updateNavigationButtons() {
        const prevBtn = document.getElementById('prev-btn');
        
        prevBtn.disabled = this.currentQuestion === 0;
        
        // Hide next button since we auto-advance now
        document.getElementById('next-btn').style.display = 'none';
    }

    nextQuestion() {
        if (this.currentQuestion < this.questions.length - 1) {
            this.currentQuestion++;
            this.displayQuestion();
        } else {
            this.calculateResults();
        }
    }

    previousQuestion() {
        if (this.currentQuestion > 0) {
            this.currentQuestion--;
            this.displayQuestion();
        }
    }

    calculateResults() {
        const traitScores = {
            extroversion: 0,
            introversion: 0,
            creativity: 0,
            logic: 0,
            adventure: 0,
            empathy: 0,
            collaboration: 0,
            intuition: 0
        };

        // Calculate trait scores based on answers
        this.answers.forEach((answerIndex, questionIndex) => {
            const question = this.questions[questionIndex];
            const selectedOption = question.options[answerIndex];
            traitScores[selectedOption.trait] += selectedOption.value;
        });

        // Determine personality type based on dominant traits
        const personalityType = this.determinePersonalityType(traitScores);
        this.displayResults(personalityType);
    }

    determinePersonalityType(scores) {
        // Logic to determine personality type based on trait combinations
        const isCreative = scores.creativity >= 3;
        const isLogical = scores.logic >= 3;
        const isExtroverted = scores.extroversion > scores.introversion;
        const isEmpathetic = scores.empathy >= 3;
        const isAdventurous = scores.adventure >= 3;
        const isCollaborative = scores.collaboration >= 3;
        const isIntuitive = scores.intuition >= 2;

        if (isCreative && isIntuitive) {
            return 'creative_intuitive';
        } else if (isLogical && isAdventurous) {
            return 'logical_adventurer';
        } else if (isEmpathetic && isCollaborative) {
            return 'empathetic_collaborator';
        } else if (!isExtroverted && isLogical) {
            return 'introverted_thinker';
        } else if (isExtroverted && (scores.extroversion >= 3)) {
            return 'extroverted_enthusiast';
        } else {
            return 'balanced_harmonizer';
        }
    }

    displayResults(personalityTypeKey) {
        const personalityType = this.personalityTypes[personalityTypeKey];
        
        document.getElementById('personality-icon').textContent = personalityType.icon;
        document.getElementById('personality-title').textContent = personalityType.title;
        document.getElementById('personality-description').textContent = personalityType.description;
        
        // Display traits
        const traitsList = document.getElementById('traits-list');
        traitsList.innerHTML = '';
        personalityType.traits.forEach(trait => {
            const li = document.createElement('li');
            li.textContent = trait;
            traitsList.appendChild(li);
        });
        
        document.getElementById('advice-text').textContent = personalityType.advice;
        
        // Display famous personalities
        const celebritiesGrid = document.getElementById('celebrities-grid');
        celebritiesGrid.innerHTML = '';
        personalityType.celebrities.forEach((celebrity, index) => {
            const celebrityCard = document.createElement('div');
            celebrityCard.className = 'celebrity-card';
            celebrityCard.style.animationDelay = `${index * 0.1}s`;
            celebrityCard.style.cursor = 'pointer';
            
            celebrityCard.innerHTML = `
                <div class="celebrity-image">
                    <img src="${celebrity.image}" alt="${celebrity.name}" 
                         onerror="this.style.display='none'; this.parentNode.innerHTML='<div style=\\'display: flex; align-items: center; justify-content: center; width: 80px; height: 80px; border-radius: 50%; background: linear-gradient(135deg, #059669, #1e40af); color: white; font-size: 2rem; font-weight: bold;\\'>${celebrity.initial}</div>';"
                         onload="this.style.opacity='1';" 
                         style="opacity: 0; transition: opacity 0.3s ease;">
                </div>
                <div class="celebrity-name">${celebrity.name}</div>
                <div class="celebrity-description">${celebrity.description}</div>
                <div class="click-hint">Click to learn more</div>
            `;
            
            // Add click event to open Wikipedia page
            celebrityCard.addEventListener('click', () => {
                window.open(celebrity.wiki, '_blank');
            });
            
            celebritiesGrid.appendChild(celebrityCard);
        });
        
        this.showScreen('result-screen');
        
        // Add animation to celebrity cards
        setTimeout(() => {
            document.querySelectorAll('.celebrity-card').forEach((card, index) => {
                setTimeout(() => {
                    card.style.opacity = '0';
                    card.style.transform = 'translateY(20px)';
                    card.style.transition = 'all 0.5s ease';
                    
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'translateY(0)';
                    }, 50);
                }, index * 100);
            });
        }, 100);
    }

    restartQuiz() {
        this.currentQuestion = 0;
        this.answers = [];
        this.showScreen('welcome-screen');
    }

    toggleTheme() {
        this.isDarkMode = !this.isDarkMode;
        const body = document.body;
        const themeToggle = document.getElementById('theme-toggle');
        
        if (this.isDarkMode) {
            body.classList.add('dark-mode');
            themeToggle.textContent = '☀️';
            themeToggle.title = 'Switch to Light Mode';
        } else {
            body.classList.remove('dark-mode');
            themeToggle.textContent = '🌙';
            themeToggle.title = 'Switch to Dark Mode';
        }
        
        // Save theme preference
        localStorage.setItem('darkMode', this.isDarkMode);
    }

    loadThemePreference() {
        const savedTheme = localStorage.getItem('darkMode');
        if (savedTheme === 'true') {
            this.isDarkMode = false; // Set to false so toggleTheme will make it true
            this.toggleTheme();
        }
    }
}

// Initialize the quiz and maze game when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new PersonalityQuiz();
    new MazeGame();
});
