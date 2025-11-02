// =======================================================
// 1. SELECTORES Y CONFIGURACIÓN INICIAL
// =======================================================
const messagesDiv = document.getElementById('messages');
const input = document.getElementById('userInput');
const sendBtn = document.getElementById('sendBtn');
const confettiDiv = document.getElementById('confetti');
const heartsDiv = document.getElementById('hearts');

// Sonidos
const sendSound = new Audio("https://assets.mixkit.co/active_storage/sfx/2574/2574-preview.mp3");
const receiveSound = new Audio("https://assets.mixkit.co/active_storage/sfx/2576/2576-preview.mp3");

// Juego
let isPlayingGame = false;
let correctNumber = 0;

// Respuestas aleatorias para relleno
const randomResponses = [
  "Hiiiii soy yooo, tu noviecito el más feito jiji 😝",
  "Shi soy feooo y nimoditoo amoor 😍",
  "Espero que te guste igual mi intentooo 🥹💖",
  "Te amoooooo muchisisisimo mi vidaaa 💕💕💕",
  "Eres lo mejor que me ha pasado en la vidaaa 😍",
  "¡Qué lind@ eres, mi amor! ✨",
  "¿Qué tal va tu día, cariño? 😊"
];

// =======================================================
// 2. FUNCIONES DE ANIMACIÓN Y UI
// =======================================================

function createFloatingHeart() {
  if (!heartsDiv) return;
  const heart = document.createElement('div');
  heart.classList.add('heart');
  heart.textContent = '💖';
  heart.style.left = Math.random() * (window.innerWidth - 30) + 'px';
  heartsDiv.appendChild(heart);
  heart.style.animation = 'floatUp 5s ease-out forwards';
  setTimeout(() => heart.remove(), 5000);
}

function showConfettiBurst() {
  if (!confettiDiv) return;
  for (let i = 0; i < 20; i++) {
    const piece = document.createElement("div");
    piece.textContent = "💖";
    piece.style.position = "absolute";
    piece.style.left = Math.random() * window.innerWidth + "px";
    piece.style.top = Math.random() * window.innerHeight + "px";
    piece.style.fontSize = Math.random() * 20 + 15 + "px";
    piece.style.opacity = 1;
    piece.style.zIndex = 9999;
    const angle = Math.random() * 360;
    const distance = Math.random() * 150 + 50;
    piece.style.transform = `translateY(0) translateX(0) rotate(${Math.random() * 360}deg)`;
    piece.style.transition = 'transform 1s ease-out, opacity 1s ease-out';
    confettiDiv.appendChild(piece);
    setTimeout(() => {
      piece.style.transform = `translateY(${-distance * Math.sin(angle)}px) translateX(${distance * Math.cos(angle)}px) rotate(${Math.random() * 360}deg)`;
      piece.style.opacity = 0;
    }, 50);
    setTimeout(() => piece.remove(), 1100);
  }
}

function addMessage(text, sender, isMiniJuego = false) {
  if (!messagesDiv) return;
  const msg = document.createElement('div');
  msg.classList.add('message', sender);
  if (isMiniJuego) msg.classList.add('mini-juego');
  msg.innerHTML = text;

  if (sender === 'bot') msg.addEventListener('click', showConfettiBurst);

  messagesDiv.appendChild(msg);
  messagesDiv.scrollTop = messagesDiv.scrollHeight;

  try {
    if (sender === 'user') sendSound.play();
    else receiveSound.play();
  } catch (e) { console.warn("No se pudo reproducir sonido:", e); }

  if (Math.random() < 0.2) createFloatingHeart();
}

// =======================================================
// 3. MINI IA LOCAL Y LÓGICA DEL BOT
// =======================================================

const intents = [
  { pattern: ["hola", "hey", "buenas"], responses: [
      "¡Holaaa mi vidaaa! 💕",
      "Hey amorcito 😍 ¿cómo estás hoy?",
      "Holaaaaa 💖, qué gusto verte por aquí"
  ]},
  { pattern: ["como estas", "cómo estás"], responses: [
      "Ahora que me hablas, mejor imposible 😍",
      "Súper bien, gracias por preguntar amor 🥰",
      "Feliz de leerte 💞 ¿y tú, cómo estás?"
  ]},
  { pattern: ["te amo", "te quiero"], responses: [
      "💖 Yo más, infinitamente 💖",
      "Te amo con todo mi corazón mi vida 💞",
      "Ay no, me derrites con eso 😭💕"
  ]},
  { pattern: ["extraño", "falta"], responses: [
      "Awww 😢 yo también te extraño mucho 💞",
      "No sabes cuánto te pienso 🥹",
      "Me haces falta cada segundo 💔"
  ]},
  { pattern: ["triste", "mal"], responses: [
      "No quiero verte triste 😢 ven, te abrazo fuerte 💞",
      "Aww amor, aquí estoy para ti siempre 🫶",
      "Te mando un abrazo enorme 💖"
  ]},
  { pattern: ["feliz", "contento", "alegre"], responses: [
      "Esooo 😄 me encanta verte feliz 💕",
      "Yayyy 💖, tu felicidad también es la mía 😍",
      "Amo cuando estás contentx 🥰"
  ]},
  { pattern: ["broma", "chiste"], responses: [
      "¿Sabes qué le dijo un 0 a un 8? — ¡Bonito cinturón! 😂",
      "¿Por qué los pájaros no usan Facebook? 🐦 Porque ya tienen Twitter 😂",
      "Jiji soy tan gracioso como enamorado 💞"
  ]},
  { pattern: ["jugar", "juego"], responses: [
      "🎲 ¿Quieres jugar conmigo? Adivina un número del 1 al 5 😋",
      "Vamos a jugar algooo 🎯 dime un número del 1 al 5",
      "Te reto a adivinar mi número secreto 💘"
  ]},
  { pattern: ["adiós", "bye", "chau"], responses: [
      "Ya me vas a dejar?",
      "Adiós mi vida 💕 vuelve pronto"
  ]},
  { pattern: ["gracias", "thank"], responses: [
      "De nada mi amorcito 💖",
      "Siempre para ti 🥰",
      "No tienes que agradecerme, lo hago con amor 💕"
  ]}
];

function getLocalResponse(text) {
  const lower = text.toLowerCase();
  for (const intent of intents) {
    for (const word of intent.pattern) {
      if (lower.includes(word)) {
        const res = intent.responses[Math.floor(Math.random() * intent.responses.length)];
        return res;
      }
    }
  }
  const fallback = [
    "No habia presupuesto 😅💖",
    "Mmm... interesante, cuéntame más 😍",
    "Estoy mal programado 😝"
  ];
  return fallback[Math.floor(Math.random() * fallback.length)];
}

// --- Manejo del mini-juego ---
const botLogic = {
  handleGameGuess(text) {
    const guess = parseInt(text.trim());
    if (isNaN(guess) || guess < 1 || guess > 5) {
      addMessage('Por favor, ingresa un número válido del 1 al 5. 🥺', 'bot');
      return;
    }
    if (guess === correctNumber) {
      addMessage('🎉 ¡Correcto! Ganaste un corazón virtual 💖', 'bot');
      showConfettiBurst();
      isPlayingGame = false;
    } else {
      addMessage('❌ Incorrecto, intenta otra vez. Pista: ' +
        (guess < correctNumber ? 'es un número mayor.' : 'es un número menor.'), 'bot');
    }
  }
};

// --- Lógica principal del bot ---
function getBotResponse(text) {
  const lowerText = text.toLowerCase();

  if (isPlayingGame) {
    botLogic.handleGameGuess(text);
    return;
  }

  const response = getLocalResponse(lowerText);
  addMessage(response, 'bot');

  if (lowerText.includes("jugar") || lowerText.includes("juego")) {
    isPlayingGame = true;
    correctNumber = Math.floor(Math.random() * 5) + 1;
  }

  if (Math.random() < 0.25) {
    addMessage('😍 Mira este sticker: <img src="https://i.imgur.com/8Km9tLL.gif" width="80" alt="Sticker de corazón"/>', 'bot');
  }

  if (Math.random() < 0.3) showConfettiBurst();
}

// =======================================================
// 4. ENVÍO DE MENSAJES
// =======================================================
function sendMessage() {
  const text = input.value.trim();
  if (!text) return;

  addMessage(text, 'user');
  input.value = '';
  input.disabled = true;
  sendBtn.disabled = true;

  setTimeout(() => {
    getBotResponse(text);
    input.disabled = false;
    sendBtn.disabled = false;
    input.focus();
  }, 1000);
}

if (sendBtn && input) {
  sendBtn.addEventListener('click', sendMessage);
  input.addEventListener('keypress', e => {
    if (e.key === 'Enter') sendMessage();
  });
}

// =======================================================
// 5. INICIALIZACIÓN
// =======================================================
if (messagesDiv) {
  setTimeout(() => {
    addMessage('¡Hola, mi amor! Soy tu bot romántico 💕 ¿cómo estás hoy? 😊', 'bot');
  }, 500);
}
