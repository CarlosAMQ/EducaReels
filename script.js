// Variables base
const reels = document.querySelectorAll(".reel");
const reelsContainer = document.querySelector(".reels-container");
const playerSection = document.getElementById("player-section");
const mainVideo = document.getElementById("main-video");
const videoSource = document.getElementById("video-source");

let questionText = document.getElementById("question-text");
let answerButtons = document.getElementById("answer-buttons");

let selectedReelIndex = 0;
let questionShownFlags = [];
let userAnswers = [];

const correctImages = ["imagenes/correcto1.png", "imagenes/correcto2.png"];
const wrongImages = ["imagenes/incorrecto1.png", "imagenes/incorrecto2.png"];

const correctAudio = new Audio("audio/correcto.mp3");
const wrongAudio = new Audio("audio/incorrecto.mp3");

// Base de preguntas con retroalimentación
const questionsPerVideo = [
  {
    video: "/Videos/SCRUM.mp4",
    questions: [
      {
        text: "¿Qué representa un Sprint en Scrum?",
        options: ["Una reunión", "Una fase final", "Un ciclo corto de trabajo", "Una prueba de calidad"],
        correct: 2,
        feedback: "Un Sprint es un ciclo corto de trabajo, típico de 1 a 4 semanas, que permite entregar valor de forma continua.",
        time: 41,
        duration: 8
      },
      {
        text: "¿Quién se encarga de eliminar obstáculos en Scrum?",
        options: ["El cliente", "El Product Owner", "El Scrum Master", "El diseñador"],
        correct: 2,
        feedback: "El Scrum Master es responsable de eliminar obstáculos que impidan al equipo avanzar.",
        time: 107,
        duration: 8
      }
    ]
  },
  {
  video: "/Videos/Kanban.mp4",
  questions: [
    {
      text: "¿Cuál es la columna donde se colocan las tareas ya terminadas?",
      options: ["Por hacer", "Hecho", "En espera", "Producción"],
      correct: 1,
      feedback: "La columna 'Hecho' representa las tareas que han sido completadas y ya no requieren intervención.",
      time: 45,
      duration: 1.6
    },
    {
      text: "¿Qué representa cada tarjeta en un tablero Kanban?",
      options: ["Un usuario", "Una idea", "Una tarea", "Un archivo"],
      correct: 2,
      feedback: "Cada tarjeta en Kanban representa una tarea que debe ser gestionada dentro del flujo de trabajo.",
      time: 102,
      duration: 6.7
    }
  ]
},
{
  video: "/Videos/Lean.mp4",
  questions: [
    {
      text: "¿Qué tipo de cosas busca eliminar Lean?",
      options: ["Requisitos", "Gastos justificados", "Tiempos muertos", "Pruebas"],
      correct: 1,
      feedback: "Lean se enfoca en eliminar tiempos muertos, es decir, actividades que no agregan valor al cliente.",
      time: 42,
      duration: 21
    },
    {
      text: "¿Qué busca Lean al eliminar tareas innecesarias?",
      options: ["Aumentar el estrés", "Agilizar el desarrollo" , "Reducir ideas", "Generar errores"],
      correct: 1,
      feedback: "Al eliminar tareas innecesarias, Lean busca agilizar el desarrollo y mejorar la eficiencia del proceso.",
      time: 95,
      duration: 16
    }
  ]
},
{
  video: "/Videos/Design Thinking.mp4",
  questions: [
    {
      text: "¿Cuál es el primer paso en Design Thinking?",
      options: ["Diseñar", "Probar", "Empatizar", "Desarrollar"],
      correct: 2,
      feedback: "El primer paso en Design Thinking es 'Empatizar', para comprender las necesidades reales del usuario.",
      time: 35,
      duration: 0.5
    },
    {
      text: "¿Qué paso permite probar ideas de forma simple en Design Thinking?",
      options: ["Implementación", "Evaluación" , "Prototipado", "Codificación"],
      correct: 2,
      feedback: "El 'Prototipado' permite crear representaciones simples de las ideas para probarlas rápidamente.",
      time: 108,
      duration: 0.5
    }
  ]
},
{
  video: "/Videos/XP.mp4",
  questions: [
    {
      text: "¿Qué técnica usa XP para escribir código en pareja?",
      options: ["Scrum Master", "Revisión cruzada", "Programación en pareja", "Coding peer"],
      correct: 2,
      feedback: "La 'Programación en pareja' es una técnica de XP donde dos desarrolladores trabajan en una misma tarea al mismo tiempo.",
      time: 45,
      duration: 0.5
    },
    {
      text: "¿Qué se busca con las pruebas automáticas en XP?",
      options: ["Hacer más tareas", "Detectar errores rápido" , "Optimizar reuniones", "Reducir la memoria"],
      correct: 1,
      feedback: "Las pruebas automáticas permiten detectar errores de forma temprana y continua durante el desarrollo.",
      time: 109,
      duration: 0.5
    }
  ]
},
{
  video: "/Videos/Waterfall.mp4",
  questions: [
    {
      text: "Qué pasa si fallas una fase en Waterfall",
      options: ["Se cancela todo", "Puedes repetir solo esa parte", "Vuelves al inicio", "Se automatiza"],
      correct: 2,
      feedback: "En el modelo Waterfall, si una fase falla, normalmente se requiere volver al inicio debido a su naturaleza secuencial.",
      time: 37.5,
      duration: 0.5
    }
  ]
}

];

// Mostrar sección de video y preguntas
function showVideoWithQuestions(index) {
  selectedReelIndex = index;
  const reelData = questionsPerVideo[index];
  videoSource.src = reelData.video;
  mainVideo.load();
  mainVideo.currentTime = 0;
  mainVideo.play();

  reelsContainer.style.display = "none";
  playerSection.style.display = "block";

  questionShownFlags = new Array(reelData.questions.length).fill(false);
  userAnswers = new Array(reelData.questions.length).fill(null);

  const panel = document.getElementById("question-panel");
  panel.innerHTML = `
    <div id="question-text" style="margin-bottom: 20px; font-size: 18px;"></div>
    <div id="answer-buttons"></div>
  `;

  questionText = document.getElementById("question-text");
  answerButtons = document.getElementById("answer-buttons");
}

// Detectar tiempo del video y mostrar preguntas
mainVideo.addEventListener("timeupdate", () => {
  const reel = questionsPerVideo[selectedReelIndex];
  const currentTime = mainVideo.currentTime;

  reel.questions.forEach((question, index) => {
    if (currentTime >= question.time && !questionShownFlags[index]) {
      questionShownFlags[index] = true;
      displayQuestion(question, index);
    }
  });

  if (currentTime >= mainVideo.duration - 1) {
    showFeedback();
  }
});

function displayQuestion(question, index) {
  questionText.textContent = question.text;
  answerButtons.innerHTML = "";

  question.options.forEach((option, i) => {
    const btn = document.createElement("button");
    btn.textContent = option;
    btn.style.margin = "5px";
    btn.onclick = () => {
      validateAnswer(i, question.correct, index);
    };
    answerButtons.appendChild(btn);
  });

  setTimeout(() => {
    if (userAnswers[index] === null) {
      userAnswers[index] = -1;
      showCorrectAnswer(question.correct);
      setTimeout(() => {
        questionText.textContent = "";
        answerButtons.innerHTML = "";
      }, 2000);
    }
  }, 10000);
}

function validateAnswer(selected, correct, index) {
  userAnswers[index] = selected;

  const buttons = answerButtons.querySelectorAll("button");
  const isCorrect = selected === correct;

  buttons.forEach((btn, i) => {
    btn.disabled = true;
    btn.style.backgroundColor = i === correct ? "green" : (i === selected ? "red" : "");
  });

  if (isCorrect) {
    correctAudio.play();
    triggerImageRain(correctImages);
  } else {
    wrongAudio.play();
    triggerImageRain(wrongImages);
  }

  setTimeout(() => {
    questionText.textContent = "";
    answerButtons.innerHTML = "";
  }, 1500);
}

function showCorrectAnswer(correct) {
  const buttons = answerButtons.querySelectorAll("button");
  buttons.forEach((btn, i) => {
    btn.disabled = true;
    if (i === correct) btn.style.backgroundColor = "green";
  });
}

function showFeedback() {
  const panel = document.getElementById("question-panel");
  const videoData = questionsPerVideo[selectedReelIndex];
  panel.innerHTML = "<h2>📝 Retroalimentación</h2>";

  videoData.questions.forEach((q, i) => {
    const userResponse = userAnswers[i];
    const result = userResponse === q.correct
      ? `<span style="color: green;">✅ Correcto</span>`
      : (userResponse === -1 ? `<span style="color: orange;">⏱ Sin responder</span>` : `<span style="color: red;">❌ Incorrecto</span>`);

    const responseText = userResponse >= 0 ? q.options[userResponse] : "No respondió";
    panel.innerHTML += `
      <div style="margin-bottom: 15px;">
        <strong>${q.text}</strong><br>
        Tu respuesta: <em>${responseText}</em> ${result}<br>
        <span style="color: #ccc;">💡 ${q.feedback}</span>
      </div>
    `;
  });
}

function backToMenu() {
  playerSection.style.display = "none";
  reelsContainer.style.display = "grid";
  mainVideo.pause();
}

// Asociar clics a los reels
reels.forEach((reel, index) => {
  reel.addEventListener("click", () => {
    showVideoWithQuestions(index);
  });
});

// Efecto visual
function triggerImageRain(imageArray) {
  const container = document.getElementById("video-left") || document.body;

  for (let i = 0; i < 15; i++) {
    const img = document.createElement("img");
    const src = imageArray[Math.floor(Math.random() * imageArray.length)];
    const size = Math.floor(Math.random() * 30) + 30;

    img.src = src;
    img.classList.add("floating-image");
    img.style.width = `${size}px`;
    img.style.height = `${size}px`;

    const left = Math.random() * container.clientWidth;
    const top = Math.random() * 50;

    img.style.left = `${left}px`;
    img.style.top = `${top}px`;
    img.style.position = "absolute";

    container.appendChild(img);

    setTimeout(() => {
      img.remove();
    }, 2500);
  }
}
