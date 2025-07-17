class PersonalityQuiz {
    constructor() {
        this.currentQuestion = 0;
        this.answers = [];
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
                    { name: "Steve Jobs", initial: "SJ", description: "Apple Co-founder & Visionary", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/dc/Steve_Jobs_Headshot_2010-CROP_%28cropped_2%29.jpg/256px-Steve_Jobs_Headshot_2010-CROP_%28cropped_2%29.jpg" },
                    { name: "Leonardo da Vinci", initial: "LV", description: "Renaissance Genius", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/ba/Leonardo_self.jpg/256px-Leonardo_self.jpg" },
                    { name: "Walt Disney", initial: "WD", description: "Animation Pioneer", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/da/Walt_Disney_1946.JPG/256px-Walt_Disney_1946.JPG" },
                    { name: "Frida Kahlo", initial: "FK", description: "Iconic Artist", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/06/Frida_Kahlo%2C_by_Guillermo_Kahlo.jpg/256px-Frida_Kahlo%2C_by_Guillermo_Kahlo.jpg" }
                ]
            },
            logical_adventurer: {
                title: "The Strategic Explorer",
                icon: "🧭",
                description: "You combine logical thinking with a love for adventure. You're practical yet always ready for new challenges.",
                traits: ["Excellent problem-solving skills", "Loves new experiences", "Approaches challenges systematically", "Values both logic and excitement"],
                advice: "Use your analytical skills to plan your next adventure. Your balanced approach to risk-taking is your superpower.",
                celebrities: [
                    { name: "Elon Musk", initial: "EM", description: "Tech Entrepreneur", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/34/Elon_Musk_Royal_Society_%28crop2%29.jpg/256px-Elon_Musk_Royal_Society_%28crop2%29.jpg" },
                    { name: "Bear Grylls", initial: "BG", description: "Adventurer & Survivalist", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4e/Bear_Grylls_2016.jpg/256px-Bear_Grylls_2016.jpg" },
                    { name: "Richard Branson", initial: "RB", description: "Business Maverick", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/42/Richard_Branson_March_2015_%28cropped%29.jpg/256px-Richard_Branson_March_2015_%28cropped%29.jpg" },
                    { name: "Amelia Earhart", initial: "AE", description: "Aviation Pioneer", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/ee/Amelia_Earhart_1937.jpg/256px-Amelia_Earhart_1937.jpg" }
                ]
            },
            empathetic_collaborator: {
                title: "The Compassionate Leader",
                icon: "💝",
                description: "You're naturally caring and work best with others. You have a gift for understanding people and bringing out their best.",
                traits: ["Excellent at reading emotions", "Natural team player", "Strong communication skills", "Values harmony and cooperation"],
                advice: "Your ability to connect with others is rare. Consider roles where you can mentor, lead, or support others in achieving their goals.",
                celebrities: [
                    { name: "Oprah Winfrey", initial: "OW", description: "Media Mogul & Philanthropist", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b8/Oprah_in_2014.jpg/256px-Oprah_in_2014.jpg" },
                    { name: "Nelson Mandela", initial: "NM", description: "Peace Leader", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/02/Nelson_Mandela_1994.jpg/256px-Nelson_Mandela_1994.jpg" },
                    { name: "Mother Teresa", initial: "MT", description: "Humanitarian", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/46/MotherTeresa_094.jpg/256px-MotherTeresa_094.jpg" },
                    { name: "Barack Obama", initial: "BO", description: "Former President", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8d/President_Barack_Obama.jpg/256px-President_Barack_Obama.jpg" }
                ]
            },
            introverted_thinker: {
                title: "The Thoughtful Analyst",
                icon: "🤔",
                description: "You're a deep thinker who values quiet reflection and logical analysis. You see patterns others miss.",
                traits: ["Excellent analytical abilities", "Values deep, meaningful relationships", "Thinks before acting", "Enjoys intellectual challenges"],
                advice: "Your thoughtful approach is valuable. Don't underestimate the power of your quiet insights and take time to share your ideas.",
                celebrities: [
                    { name: "Albert Einstein", initial: "AE", description: "Theoretical Physicist", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d3/Albert_Einstein_Head.jpg/256px-Albert_Einstein_Head.jpg" },
                    { name: "Bill Gates", initial: "BG", description: "Microsoft Co-founder", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a0/Bill_Gates_2018.jpg/256px-Bill_Gates_2018.jpg" },
                    { name: "Mark Zuckerberg", initial: "MZ", description: "Meta CEO", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/18/Mark_Zuckerberg_F8_2019_Keynote_%2832830578717%29_%28cropped%29.jpg/256px-Mark_Zuckerberg_F8_2019_Keynote_%2832830578717%29_%28cropped%29.jpg" },
                    { name: "Stephen Hawking", initial: "SH", description: "Renowned Physicist", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/eb/Stephen_Hawking.StarChild.jpg/256px-Stephen_Hawking.StarChild.jpg" }
                ]
            },
            extroverted_enthusiast: {
                title: "The Social Energizer",
                icon: "⚡",
                description: "You're energized by people and new experiences. Your enthusiasm is contagious and you inspire others to take action.",
                traits: ["Natural networker", "High energy and enthusiasm", "Motivates and inspires others", "Thrives in social environments"],
                advice: "Your energy is your gift to the world. Use it to bring people together and champion causes you believe in.",
                celebrities: [
                    { name: "Ellen DeGeneres", initial: "ED", description: "TV Host & Comedian", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b8/Ellen_DeGeneres_2011.jpg/256px-Ellen_DeGeneres_2011.jpg" },
                    { name: "Will Smith", initial: "WS", description: "Actor & Entertainer", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3f/TechCrunch_Disrupt_2019_%2848834434641%29_%28cropped%29.jpg/256px-TechCrunch_Disrupt_2019_%2848834434641%29_%28cropped%29.jpg" },
                    { name: "Tony Robbins", initial: "TR", description: "Motivational Speaker", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/33/Tony_Robbins_%2848232230646%29.jpg/256px-Tony_Robbins_%2848232230646%29.jpg" },
                    { name: "Robin Williams", initial: "RW", description: "Beloved Comedian", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/16/Robin_Williams_Happy_Feet_premiere.jpg/256px-Robin_Williams_Happy_Feet_premiere.jpg" }
                ]
            },
            balanced_harmonizer: {
                title: "The Versatile Harmonizer",
                icon: "⚖️",
                description: "You're well-balanced with strengths across multiple areas. You adapt well to different situations and bring stability to chaos.",
                traits: ["Adaptable to various situations", "Good balance of logic and emotion", "Brings people together", "Stable and reliable"],
                advice: "Your versatility is your strength. You can succeed in many different areas - don't be afraid to explore various paths.",
                celebrities: [
                    { name: "Michelle Obama", initial: "MO", description: "Former First Lady", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4b/Michelle_Obama_2013_official_portrait.jpg/256px-Michelle_Obama_2013_official_portrait.jpg" },
                    { name: "Warren Buffett", initial: "WB", description: "Investor & Philanthropist", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/51/Warren_Buffett_KU_Visit.jpg/256px-Warren_Buffett_KU_Visit.jpg" },
                    { name: "Tom Hanks", initial: "TH", description: "Beloved Actor", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a9/Tom_Hanks_TIFF_2019.jpg/256px-Tom_Hanks_TIFF_2019.jpg" },
                    { name: "Serena Williams", initial: "SW", description: "Tennis Champion", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4b/Serena_Williams_at_2013_US_Open.jpg/256px-Serena_Williams_at_2013_US_Open.jpg" }
                ]
            }
        };

        this.initializeEventListeners();
    }

    initializeEventListeners() {
        document.getElementById('start-quiz').addEventListener('click', () => this.startQuiz());
        document.getElementById('next-btn').addEventListener('click', () => this.nextQuestion());
        document.getElementById('prev-btn').addEventListener('click', () => this.previousQuestion());
        document.getElementById('restart-quiz').addEventListener('click', () => this.restartQuiz());
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
        // Remove previous selection
        document.querySelectorAll('.option').forEach(option => {
            option.classList.remove('selected');
        });
        
        // Add selection to clicked option
        document.querySelectorAll('.option')[optionIndex].classList.add('selected');
        
        // Store answer
        this.answers[this.currentQuestion] = optionIndex;
        
        this.updateNavigationButtons();
    }

    updateNavigationButtons() {
        const prevBtn = document.getElementById('prev-btn');
        const nextBtn = document.getElementById('next-btn');
        
        prevBtn.disabled = this.currentQuestion === 0;
        
        const hasAnswer = this.answers[this.currentQuestion] !== undefined;
        nextBtn.disabled = !hasAnswer;
        
        if (this.currentQuestion === this.questions.length - 1 && hasAnswer) {
            nextBtn.textContent = 'See Results';
        } else {
            nextBtn.textContent = 'Next';
        }
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
            
            celebrityCard.innerHTML = `
                <div class="celebrity-image">
                    <img src="${celebrity.image}" alt="${celebrity.name}" onerror="this.style.display='none'; this.parentNode.innerHTML='${celebrity.initial}';">
                </div>
                <div class="celebrity-name">${celebrity.name}</div>
                <div class="celebrity-description">${celebrity.description}</div>
            `;
            
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
}

// Initialize the quiz when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new PersonalityQuiz();
});
