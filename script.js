const chatContainer = document.getElementById('chat-container');
const inputField = document.getElementById('user-input');
const toggleBtn = document.getElementById('toggle-mode');

let isDarkMode = false;
let quizActive = false;
let currentQuestion = null;

// Load chat history
window.onload = () => {
  const history = sessionStorage.getItem('chat');
  if (history) chatContainer.innerHTML = history;
};

// Toggle dark mode
toggleBtn.onclick = () => {
  isDarkMode = !isDarkMode;
  document.body.classList.toggle('dark');
  toggleBtn.textContent = isDarkMode ? '☀️' : '🌙';
};

// Send message
function sendMessage() {
  const userText = inputField.value.trim();
  if (!userText) return;

  appendMessage('user', userText);
  inputField.value = '';

  showTyping();
  setTimeout(() => {
    const botReply = generateBotReply(userText);
    removeTyping();
    appendMessage('bot', botReply);

    // ✅ Speak only if input starts with "speak this:"
    if (userText.toLowerCase().startsWith("speak this:")) {
      speak(botReply);
    }

    sessionStorage.setItem('chat', chatContainer.innerHTML);
  }, 800);
}

// Enter key support
inputField.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') sendMessage();
});

// Append message to chat
function appendMessage(sender, text) {
  const message = document.createElement('div');
  message.className = `message ${sender}`;

  const avatar = document.createElement('div');
  avatar.className = 'avatar';
  avatar.style.backgroundImage =
    sender === 'bot'
      ? "url('https://api.iconify.design/mdi:robot.svg?color=gray')"
      : "url('https://api.iconify.design/mdi:account.svg?color=blue')";

  const bubble = document.createElement('div');
  bubble.className = 'bubble';
  bubble.textContent = text;

  message.appendChild(avatar);
  message.appendChild(bubble);
  chatContainer.appendChild(message);
  chatContainer.scrollTop = chatContainer.scrollHeight;
}

// Typing indicator
function showTyping() {
  const typing = document.createElement('div');
  typing.className = 'message bot';
  typing.id = 'typing';
  typing.innerHTML = `
    <div class="avatar" style="background-image: url('https://api.iconify.design/mdi:robot.svg?color=gray')"></div>
    <div class="bubble typing">Typing...</div>`;
  chatContainer.appendChild(typing);
  chatContainer.scrollTop = chatContainer.scrollHeight;
}

function removeTyping() {
  const typing = document.getElementById('typing');
  if (typing) typing.remove();
}

// Speak only when requested
function speak(text) {
  if ('speechSynthesis' in window) {
    const utter = new SpeechSynthesisUtterance(text);
    utter.rate = 1;
    speechSynthesis.speak(utter);
  }
}

// Bot replies
function generateBotReply(input) {
  input = input.toLowerCase();

  if (quizActive) {
    const userAnswer = parseInt(input.trim());
    quizActive = false;

    if (userAnswer === currentQuestion.answerIndex + 1) {
      return "✅ Correct! Want to try another? Type 'quiz'.";
    } else {
      const correct = currentQuestion.options[currentQuestion.answerIndex];
      return `❌ Wrong. The correct answer was: ${correct}. Type 'quiz' to try again.`;
    }
  }

  if (input.includes("quiz")) {
    currentQuestion = quizQuestions[Math.floor(Math.random() * quizQuestions.length)];
    quizActive = true;

    const options = currentQuestion.options
      .map((opt, idx) => `${idx + 1}. ${opt}`)
      .join('\n');

    return `🧠 Quiz Time!\n\n${currentQuestion.question}\n\n${options}\n\n👉 Reply with 1, 2, 3, or 4`;
  }

  if (input.includes("hello") || input.includes("hi")) return "Hey there! 😊 How can I assist you today?";
  if (input.includes("how are you")) return "I'm doing great, thanks for asking! How about you?";
  if (input.includes("name")) return "I'm MiniGPT — your mini AI chatbot!";
  if (input.includes("joke")) return jokes[Math.floor(Math.random() * jokes.length)];
  if (input.includes("fact")) return facts[Math.floor(Math.random() * facts.length)];
  if (input.includes("quote") || input.includes("motivate") || input.includes("inspire"))
  return quotes[Math.floor(Math.random() * quotes.length)];
  if (input.includes("bye")) return "Goodbye! Come back soon to chat more! 👋";
  if (input.includes("thanks")) return "You're most welcome! 😊";
  if (input.includes("love")) return "Aw, love is a beautiful thing 💖. Tell me more!";
  if (input.includes("sad")) return "I’m here for you. Sometimes talking helps. 💙";
  if (input.includes("happy")) return "Yay! I’m happy you're happy! 😄";
  if (input.includes("bore")) return "yeah, I see.. if you want, we can chat, we can play or play quiz if you are interested.We'll kick your boredom away. hehe!";
  if (input.includes("help")) return "Ask me for a joke, quiz, fact, or just talk!";

  return "Hmm... I’m not sure how to respond to that. Try asking for a joke, fact, or type 'quiz'.";
}

// Quiz questions
const quizQuestions = [
  {
    question: "What is the capital of Italy?",
    options: ["Rome", "Paris", "Berlin", "Madrid"],
    answerIndex: 0
  },
  {
    question: "What is the tallest mountain in the world?",
    options: ["K2", "Everest", "Kilimanjaro", "Denali"],
    answerIndex: 1
  },
  {
    question: "Which planet is known as the Blue Planet?",
    options: ["Mars", "Venus", "Earth", "Jupiter"],
    answerIndex: 2
  },
  {
    question: "What gas do plants absorb from the atmosphere?",
    options: ["Oxygen", "Nitrogen", "Carbon Dioxide", "Helium"],
    answerIndex: 2
  },
  {
    question: "What is the chemical symbol for gold?",
    options: ["Au", "Ag", "Fe", "Pb"],
    answerIndex: 0
  },
  {
    question: "What is 12 * 8?",
    options: ["96", "86", "106", "112"],
    answerIndex: 0
  },
  {
    question: "What is the square root of 144?",
    options: ["10", "12", "14", "16"],
    answerIndex: 1
  },
  {
    question: "What is the value of pi (approx)?",
    options: ["2.14", "3.14", "4.14", "3.41"],
    answerIndex: 1
  },
  {
    question: "What does CPU stand for?",
    options: ["Central Processing Unit", "Control Panel Unit", "Computer Power Unit", "Central Power Utility"],
    answerIndex: 0
  },
  {
    question: "HTML is used for?",
    options: ["Designing", "Structuring Web Pages", "Compiling", "Scripting"],
    answerIndex: 1
  },
  {
    question: "Which continent is Australia part of?",
    options: ["Asia", "Europe", "Oceania", "Africa"],
    answerIndex: 2
  },
  {
    question: "Which is the longest river in the world?",
    options: ["Amazon", "Nile", "Yangtze", "Mississippi"],
    answerIndex: 1
  },
  {
    question: "What is the capital of France?",
    options: ["Berlin", "Madrid", "Paris", "Rome"],
    answerIndex: 2
  },
  {
    question: "What year was JavaScript created?",
    options: ["1993", "1995", "1997", "1999"],
    answerIndex: 1
  },
  {
    question: "What is the largest desert on Earth?",
    options: ["Sahara", "Gobi", "Arctic", "Antarctic"],
    answerIndex: 3
  },
  {
    question: "How many continents are there?",
    options: ["5", "6", "7", "8"],
    answerIndex: 2
  },
  {
    question: "Which metal is liquid at room temperature?",
    options: ["Gold", "Mercury", "Iron", "Lead"],
    answerIndex: 1
  },
  {
    question: "Which gas is most abundant in Earth's atmosphere?",
    options: ["Oxygen", "Carbon Dioxide", "Nitrogen", "Hydrogen"],
    answerIndex: 2
  },
  {
    question: "Which organ is responsible for pumping blood?",
    options: ["Lungs", "Liver", "Heart", "Kidneys"],
    answerIndex: 2
  },
  {
    question: "Who developed the theory of relativity?",
    options: ["Newton", "Einstein", "Galileo", "Tesla"],
    answerIndex: 1
  },
  {
    question: "Which language is used for web apps?",
    options: ["Python", "Java", "JavaScript", "C++"],
    answerIndex: 2
  },
  {
    question: "Who painted the Mona Lisa?",
    options: ["Van Gogh", "Picasso", "Da Vinci", "Michelangelo"],
    answerIndex: 2
  },
  {
    question: "Which country gifted the Statue of Liberty to the USA?",
    options: ["England", "Germany", "France", "Italy"],
    answerIndex: 2
  },
  {
    question: "What is the hardest natural substance?",
    options: ["Gold", "Iron", "Diamond", "Silver"],
    answerIndex: 2
  },
  {
    question: "How many bones are there in the adult human body?",
    options: ["206", "210", "201", "199"],
    answerIndex: 0
  },
  {
    question: "Which is the smallest prime number?",
    options: ["0", "1", "2", "3"],
    answerIndex: 2
  },
  {
    question: "How many planets are in the solar system?",
    options: ["7", "8", "9", "10"],
    answerIndex: 1
  },
  {
    question: "Which is the fastest land animal?",
    options: ["Cheetah", "Lion", "Horse", "Tiger"],
    answerIndex: 0
  },
  {
    question: "Which vitamin is produced in the skin in sunlight?",
    options: ["Vitamin A", "Vitamin C", "Vitamin D", "Vitamin B12"],
    answerIndex: 2
  },
  {
    question: "Which country has the largest population?",
    options: ["USA", "India", "China", "Russia"],
    answerIndex: 2
  },

  {
  question: "Which language is used to style web pages?",
  options: ["HTML", "JQuery", "CSS", "XML"],
  answerIndex: 2
},
{
  question: "Which part of the computer is considered the brain?",
  options: ["RAM", "Hard Drive", "CPU", "Monitor"],
  answerIndex: 2
},
{
  question: "Which gas is essential for us to breathe?",
  options: ["Carbon Dioxide", "Oxygen", "Nitrogen", "Helium"],
  answerIndex: 1
},
{
  question: "How many legs does a spider have?",
  options: ["6", "8", "10", "12"],
  answerIndex: 1
},
{
  question: "What does WWW stand for?",
  options: ["World Wide Window", "World Wide Web", "Wide Web World", "Web World Wide"],
  answerIndex: 1
},
{
  question: "What is the freezing point of water?",
  options: ["0°C", "32°C", "100°C", "50°C"],
  answerIndex: 0
},
{
  question: "Which continent is the largest by area?",
  options: ["Africa", "Asia", "North America", "Europe"],
  answerIndex: 1
},
{
  question: "What is the smallest prime number?",
  options: ["1", "2", "3", "0"],
  answerIndex: 1
},
{
  question: "Which planet has rings?",
  options: ["Earth", "Mars", "Saturn", "Venus"],
  answerIndex: 2
},
{
  question: "What is the boiling point of water at sea level?",
  options: ["90°C", "100°C", "110°C", "120°C"],
  answerIndex: 1
},
{
  question: "Who wrote 'Hamlet'?",
  options: ["Charles Dickens", "Jane Austen", "William Shakespeare", "Leo Tolstoy"],
  answerIndex: 2
},
{
  question: "Which country is known as the Land of the Rising Sun?",
  options: ["China", "India", "Japan", "Thailand"],
  answerIndex: 2
},
{
  question: "Which is the hardest naturally occurring substance?",
  options: ["Gold", "Iron", "Diamond", "Quartz"],
  answerIndex: 2
},
{
  question: "How many colors are there in a rainbow?",
  options: ["5", "6", "7", "8"],
  answerIndex: 2
},
{
  question: "Who was the first President of the United States?",
  options: ["Abraham Lincoln", "George Washington", "John Adams", "Thomas Jefferson"],
  answerIndex: 1
},
{
  question: "Which is the fastest bird in the world?",
  options: ["Eagle", "Hawk", "Peregrine Falcon", "Owl"],
  answerIndex: 2
},
{
  question: "Which animal is known as the King of the Jungle?",
  options: ["Tiger", "Elephant", "Lion", "Panther"],
  answerIndex: 2
},
{
  question: "Which is the largest ocean on Earth?",
  options: ["Atlantic", "Indian", "Pacific", "Arctic"],
  answerIndex: 2
},
{
  question: "How many players are there in a soccer team?",
  options: ["9", "10", "11", "12"],
  answerIndex: 2
},
{
  question: "Which planet is closest to the sun?",
  options: ["Venus", "Earth", "Mercury", "Mars"],
  answerIndex: 2
}

];

// Jokes and facts
const jokes = [
  "Why don’t scientists trust atoms? Because they make up everything! 😂",
  "Why did the computer go to therapy? Too many bytes of trauma.",
  "Why do programmers prefer dark mode? Because light attracts bugs!",
  "Why did the developer go broke? Because he used up all his cache!",
  "How do you comfort a JavaScript bug? You console it.",
  "Why do Java developers wear glasses? Because they don’t C#.",
  "Why was the computer cold? It left its Windows open.",
  "Why did the function break up with the loop? It had too many issues.",
  "What do you call 8 hobbits? A hobbyte.",
  "What do you call a fake noodle? An Impasta!",
  "I told my computer I needed a break… it said 'No problem, I’ll go to sleep.' 😴",
  "Why don't robots have brothers? Because they all share the same motherboard.",
  "Why was the JavaScript developer sad? Because he didn’t 'null' his feelings.",
  "Why did the programmer go broke? Because he couldn’t stop caching things!",
  "Why was the cell phone wearing glasses? Because it lost its contacts.",
  "Why don’t skeletons fight each other? They don’t have the guts.",
  "Parallel lines have so much in common… it’s a shame they’ll never meet.",
  "Why did the web developer stay calm? Because he had good cache control.",
  "How does a computer get drunk? It takes screenshots. 🍻",
  "What’s a computer’s favorite snack? Microchips.",
  "Why was the website feeling down? It had too many cookies.",
  "Why did the Python developer get rejected? Because his code had no class.",
  "I asked the server for a joke… it timed out.",
  "What do you call a programmer from Finland? Nerdic.",
  "Why did the developer get kicked out of school? He kept breaking the class.",
  "Why don’t bachelors like Git? Because they are afraid to commit.",
  "What do programmers do when they're hungry? Grab a byte.",
  "Why couldn’t the string become an object? It couldn’t handle the type casting.",
  "Why was the database so clingy? It couldn’t stop joining.",
  "Why did the CSS file break up with HTML? Because it had style issues.",
  "Why was the array sad? Because it was constantly being pushed around.",
  "Why was the function so overworked? It had too many callbacks.",
  "What’s a developer’s favorite hangout place? The Foo Bar!",
  "Why did the front-end developer go broke? Because he couldn’t find a framework that paid.",
  "Why was the UX designer depressed? Users kept bouncing back.",
  "Why did the HTML break up with the CSS? Too many style conflicts.",
  "Why was the loop stuck in a relationship? It had no break.",
  "What’s a robot’s favorite genre of music? Heavy metal.",
  "Why did the cloud break up with the server? It needed more space.",
  "Why don’t JavaScript programmers tell jokes? They don’t like callbacks.",
  "How many programmers does it take to change a light bulb? None — that’s a hardware problem.",
  "Why don’t APIs like making friends? They’re too RESTful.",
  "Why was the debugger great at parties? Because it could break the ice.",
  "What’s a coder’s favorite drink? Java.",
  "What’s a computer’s favorite beatle? Ringo (Ring 0)!",
  "Why did the laptop get glasses? It lost its focus.",
  "Why was the code sad? It didn’t pass the review.",
  "Why did the developer love camping? Because it had lots of bugs.",
  "Why did the keyboard break up with the mouse? It found someone more clickable.",
  "Why don’t machines ever panic? They keep their processes in check.",
  "What’s a CPU’s favorite game? Minecraft — because of all the blocks!",
 
  "Why do programmers prefer dark mode? Because light attracts bugs!",
  "How do you comfort a JavaScript bug? You console it.",
  "Why did the developer go broke? Because he used up all his cache!",
  "Why do Java developers wear glasses? Because they don’t C#!",
  "Why was the computer cold? It left its Windows open.",
  "Why was the JavaScript developer sad? Because he didn’t ‘null’ his feelings.",
  "Why don’t bachelors like Git? They’re afraid to commit.",
  "What do you call a programmer from Finland? Nerdic.",
  "Why did the function break up with the loop? It had too many issues.",
  "Why did the CSS break up with HTML? It had too many style conflicts.",
  "How does a computer get drunk? It takes screenshots.",
  "Why did the front-end developer go broke? Because he couldn't find a framework that paid.",
  "What do programmers do when they're hungry? Grab a byte.",
  "What’s a developer’s favorite hangout place? The Foo Bar!",
  "Why don’t APIs like making friends? They’re too RESTful.",

  // Classic & General Jokes
  "Why don't scientists trust atoms? Because they make up everything!",
  "Why did the scarecrow win an award? Because he was outstanding in his field!",
  "Why don’t skeletons fight each other? They don’t have the guts.",
  "Parallel lines have so much in common. It’s a shame they’ll never meet.",
  "Why did the math book look sad? It had too many problems.",
  "What did one wall say to the other? I'll meet you at the corner.",
  "Why was six scared of seven? Because 7 8 9!",
  "Why did the golfer bring two pairs of pants? In case he got a hole in one.",
  "How do cows stay up to date? They read the moos-paper.",
  "Why don’t eggs tell jokes? Because they might crack up!",
  "What do you call a belt made out of watches? A waist of time.",
  "Why did the bicycle fall over? Because it was two-tired.",
  "How do you make holy water? You boil the hell out of it.",
  "Why did the stadium get hot after the game? All the fans left.",
  "Why did the cookie go to the hospital? Because it felt crummy.",

  // Animal Jokes
  "Why don’t elephants use computers? They're afraid of the mouse.",
  "What do you get when you cross a snake and a pie? A python!",
  "What do you call a fish without eyes? Fsh.",
  "What do you get when you cross a dog with a magician? A labracadabrador.",
  "Why did the cat sit on the computer? To keep an eye on the mouse.",
  "Why don't dogs make good dancers? Because they have two left feet.",
  "What do you call an alligator in a vest? An investigator.",
  "Why did the chicken join a band? Because it had the drumsticks.",
  "What do you call a bear with no teeth? A gummy bear.",
  "Why can't you give Elsa a balloon? Because she’ll let it go!",

  // Silly Kid-Friendly Jokes
  "Knock knock. Who’s there? Boo. Boo who? Don’t cry, it’s just a joke!",
  "What did one plate say to the other? Dinner’s on me!",
  "Why was the broom late? It overswept.",
  "What’s orange and sounds like a parrot? A carrot!",
  "What do you call cheese that isn't yours? Nacho cheese!",
  "Why do bees have sticky hair? Because they use honeycombs.",
  "Why did the student eat his homework? Because the teacher said it was a piece of cake.",
  "What building has the most stories? The library!",
  "Why can't your nose be 12 inches long? Because then it would be a foot.",
  "Why was the calendar so popular? It had a lot of dates.",
  "What did the traffic light say to the car? Don’t look! I’m changing.",
  "Why was the computer tired when it got home? Because it had a hard drive."
];


const facts = [
  "Honey never spoils. Archaeologists found pots of honey in Egyptian tombs over 3000 years old!",
  "The first computer virus was created in 1986. It was called 'Brain' and came from Pakistan.",
  "Your brain uses more energy than any other organ — up to 20% of your body’s total.",
  "Nokia's 3310 battery could last up to a week on a single charge!",
  "The first website is still online: http://info.cern.ch",
  "Over half the world's population now uses a smartphone.",
  "The first 1GB hard drive was released in 1980 and cost $40,000!",
  "The first video game was created in 1958 — it was called 'Tennis for Two'.",
  "Email existed before the World Wide Web!",
  "The Konami Code (↑↑↓↓←→←→BA) appears in over 100 games!",
  "There are more stars in the universe than grains of sand on Earth.",
  "The human eye can distinguish about 10 million different colors.",
  "A NASA computer today has less processing power than a modern smartphone.",
  "The first SMS text message ever sent was 'Merry Christmas' in 1992.",
  "The word 'robot' comes from the Czech word 'robota', meaning 'forced labor'.",
  "Tim Berners-Lee invented the World Wide Web in 1989 — while working at CERN.",
  "The original Twitter character limit (140) was based on SMS limitations.",
  "The most expensive domain name ever sold was Cars.com — for $872 million.",
  "You share about 60% of your DNA with bananas.",
  "Water can boil and freeze at the same time — it’s called the triple point!",
  "Earth's rotation is gradually slowing — about 17 milliseconds every 100 years.",
  "Wi-Fi was accidentally invented during a search for detecting black holes.",
  "The Eiffel Tower can be 15 cm taller in the summer due to thermal expansion.",
  "The air inside a balloon is 99.9% the same as the air outside — just pressurized.",
  "Lightning is five times hotter than the surface of the sun.",
  "Octopuses have three hearts and blue blood.",
  "Sharks existed before trees.",
  "A single teaspoon of honey represents the life work of 12 bees.",
  "Bananas are berries, but strawberries aren't.",
  "Sloths can hold their breath longer than dolphins.",
  "There's a species of jellyfish that is biologically immortal.",
  "The Great Wall of China is not visible from space with the naked eye.",
  "Oxford University is older than the Aztec Empire.",
  "A bolt of lightning contains enough energy to toast 100,000 slices of bread.",
  "Cows have best friends and can become stressed when separated.",
  "A snail can sleep for three years.",
  "The Eiffel Tower can shrink by about 6 inches in cold weather.",
  "A day on Venus is longer than a year on Venus.",
  "The inventor of the microwave only received $2 for his discovery."
];
const quotes = [
  "Believe you can and you're halfway there. — Theodore Roosevelt",
  "Don't watch the clock; do what it does. Keep going. — Sam Levenson",
  "Success is not final, failure is not fatal: It is the courage to continue that counts. — Winston Churchill",
  "Hardships often prepare ordinary people for an extraordinary destiny. — C.S. Lewis",
  "Your limitation—it's only your imagination.",
  "Push yourself, because no one else is going to do it for you.",
  "Sometimes later becomes never. Do it now.",
  "Great things never come from comfort zones.",
  "Dream it. Wish it. Do it.",
  "Success doesn’t just find you. You have to go out and get it.",
  "The harder you work for something, the greater you’ll feel when you achieve it.",
  "Don’t stop when you’re tired. Stop when you’re done.",
  "Wake up with determination. Go to bed with satisfaction.",
  "Do something today that your future self will thank you for.",
  "Little things make big days.",
  "It’s going to be hard, but hard does not mean impossible.",
  "Don’t wait for opportunity. Create it.",
  "Sometimes we’re tested not to show our weaknesses, but to discover our strengths.",
  "The key to success is to focus on goals, not obstacles.",
  "Dream bigger. Do bigger.",
  "Doubt kills more dreams than failure ever will.",
  "You don’t have to be great to start, but you have to start to be great. — Zig Ziglar",
  "Act as if what you do makes a difference. It does. — William James",
  "Quality means doing it right when no one is looking. — Henry Ford",
  "Be so good they can’t ignore you. — Steve Martin",
  "Start where you are. Use what you have. Do what you can. — Arthur Ashe",
  "If you’re going through hell, keep going. — Winston Churchill",
  "Your time is limited, so don’t waste it living someone else’s life. — Steve Jobs",
  "Everything you’ve ever wanted is on the other side of fear. — George Addair",
  "Success usually comes to those who are too busy to be looking for it. — Henry David Thoreau"
];
