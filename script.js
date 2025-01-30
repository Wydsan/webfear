const questions = [
  {
      question: "Что вы видите, когда закрываете глаза?",
      options: [
          { text: "Бесконечную тьму", fear: 40, desire: 10, spirit: -20 },
          { text: "Кровавые узоры", fear: 30, desire: 30, spirit: -10 },
          { text: "Собственное отражение", fear: 10, desire: 40, spirit: 20 },
          { text: "Ничего", fear: -10, desire: -20, spirit: 40 }
      ]
  },
  {
      question: "Что вы чувствуете при звуке скрипящих дверей?",
      options: [
          { text: "Панику", fear: 50, desire: -10, spirit: -30 },
          { text: "Любопытство", fear: 10, desire: 30, spirit: 10 },
          { text: "Гнев", fear: -20, desire: 40, spirit: 20 },
          { text: "Радость", fear: -30, desire: 50, spirit: -10 }
      ]
  },
  {
      question: "Какую силу вы бы выбрали?",
      options: [
          { text: "Стать невидимым", fear: 20, desire: 40, spirit: -10 },
          { text: "Читать мысли", fear: 30, desire: 50, spirit: -20 },
          { text: "Управлять временем", fear: -10, desire: 30, spirit: 40 },
          { text: "Никакую", fear: -40, desire: -30, spirit: 50 }
      ]
  }
];

let currentQuestion = 0;
let scores = { fear: 0, desire: 0, spirit: 0 };
const flame = document.getElementById('flame');
const audio = document.getElementById('background-sound');

document.getElementById('start-btn').addEventListener('click', startTest);
document.getElementById('restart-btn').addEventListener('click', restartTest);

function startTest() {
  initEffects();
  document.getElementById('start-section').classList.add('hidden');
  document.getElementById('header').classList.remove('hidden');
  document.getElementById('test-section').classList.remove('hidden');
  audio.play();
  showQuestion();
  updateCandle();
}

function isMobile() {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

function showQuestion() {
  const question = questions[currentQuestion];
  const optionsContainer = document.getElementById('options');
  optionsContainer.innerHTML = '';

  question.options.forEach(option => {
      const button = document.createElement('button');
      button.textContent = option.text;
      button.addEventListener('click', () => selectAnswer(option));
      optionsContainer.appendChild(button);
  });

  document.getElementById('question').textContent = question.question;
}

function selectAnswer(option) {
  if(isMobile()) {
    window.scrollTo(0, 0); // Фиксируем позицию скролла
}
  scores.fear += option.fear;
  scores.desire += option.desire;
  scores.spirit += option.spirit;

  currentQuestion++;
  
  if(currentQuestion < questions.length) {
      showQuestion();
      updateCandle();
  } else {
      showResult();
  }
}

function updateCandle() {
  const progress = currentQuestion / questions.length;
  flame.style.height = `${60 - (progress * 60)}px`;
}

function showResult() {
  document.getElementById('test-section').classList.add('hidden');
  document.getElementById('result-section').classList.remove('hidden');
  audio.pause();

  // Нормализация результатов
  const total = Math.max(...Object.values(scores));
  const fearPercent = (scores.fear / total) * 100;
  const desirePercent = (scores.desire / total) * 100;
  const spiritPercent = (scores.spirit / total) * 100;

  document.getElementById('fear-stat').style.width = `${fearPercent}%`;
  document.getElementById('desire-stat').style.width = `${desirePercent}%`;
  document.getElementById('spirit-stat').style.width = `${spiritPercent}%`;

  // Определение диагноза
  let diagnosis = "";
  if(scores.fear > scores.desire && scores.fear > scores.spirit) {
      diagnosis = "Ваша душа поглощена страхом. Тьма уже забрала часть вас...";
  } else if(scores.desire > scores.fear && scores.desire > scores.spirit) {
      diagnosis = "Тайные желания управляют вами. Остерегайтесь собственных мыслей...";
  } else {
      diagnosis = "Ваш дух силён, но тьма всегда ждёт своего часа...";
  }
  
  document.getElementById('result-text').textContent = diagnosis;
}

function restartTest() {
  currentQuestion = 0;
  scores = { fear: 0, desire: 0, spirit: 0 };
  document.getElementById('result-section').classList.add('hidden');
  document.getElementById('start-section').classList.remove('hidden');
  flame.style.height = "60px";
}

// Добавляем кровавые капли
function createBloodDrops() {
  const container = document.body;
  for(let i = 0; i < 20; i++) {
      const drop = document.createElement('div');
      drop.className = 'blood-drop';
      drop.style.left = `${Math.random() * 100}%`;
      drop.style.animationDelay = `${Math.random() * 3}s`;
      container.appendChild(drop);
  }
}

// Добавляем мерцающие глаза
function createEyes() {
  const container = document.body;
  for(let i = 0; i < 8; i++) {
      const eye = document.createElement('div');
      eye.className = 'eye';
      eye.style.top = `${Math.random() * 90}%`;
      eye.style.left = `${Math.random() * 90}%`;
      eye.style.animation = `eye-blink ${5 + Math.random() * 10}s infinite`;
      container.appendChild(eye);
  }
}

// Добавляем случайные звуковые эффекты
const screamSounds = [
  'https://assets.mixkit.co/active_storage/sfx/259/259-preview.mp3',
  'https://assets.mixkit.co/active_storage/sfx/258/258-preview.mp3'
];

function playRandomScream() {
  if(Math.random() > 0.7) {
      const sound = new Audio(screamSounds[Math.floor(Math.random() * screamSounds.length)]);
      sound.volume = 0.3;
      sound.play();
  }
}

// Инициализация новых эффектов при запуске
function initEffects() {
  createBloodDrops();
  createEyes();
  setInterval(playRandomScream, 10000);
}


function createFlash() {
  const flash = document.createElement('div');
  flash.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(255, 0, 0, 0.3);
      animation: flash 0.3s;
      pointer-events: none;
  `;
  
  document.body.appendChild(flash);
  setTimeout(() => flash.remove(), 300);
}

function adjustLayout() {
  if(window.innerWidth < 768) {
      const headerHeight = document.getElementById('header').offsetHeight;
      document.getElementById('question-container').style.marginTop = 
          headerHeight + 20 + 'px';
  }
}

// Вызов при загрузке и ресайзе
window.addEventListener('load', adjustLayout);
window.addEventListener('resize', adjustLayout);
// Добавьте в selectAnswer перед currentQuestion++
createFlash();
