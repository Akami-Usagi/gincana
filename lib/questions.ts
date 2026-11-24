export interface QuizQuestion {
  question: string;
  answers: readonly string[];
  correctIndex: number;
}

export const questions: readonly QuizQuestion[] = [
  {
    question: "¿Qué parte del computador usamos para escribir?",
    answers: ["El teclado", "El ratón", "La pantalla"],
    correctIndex: 0,
  },
  {
    question: "¿En qué parte vemos las imágenes del computador?",
    answers: ["En el parlante", "En la pantalla", "En el teclado"],
    correctIndex: 1,
  },
  {
    question: "¿Para qué sirve el ratón del computador?",
    answers: ["Para mover el cursor", "Para imprimir", "Para escuchar música"],
    correctIndex: 0,
  },
  {
    question: "¿Qué aparato podemos usar para tomar una foto?",
    answers: ["Una impresora", "Una cámara", "Un teclado"],
    correctIndex: 1,
  },
  {
    question: "¿Qué tecla usamos para dejar un espacio entre palabras?",
    answers: ["La barra espaciadora", "La tecla de borrar", "La tecla de flecha"],
    correctIndex: 0,
  },
  {
    question: "¿Qué aparato usamos para escuchar sonidos del computador?",
    answers: ["El escáner", "Los parlantes", "El ratón"],
    correctIndex: 1,
  },
  {
    question: "¿Cuál de estos aparatos sirve para llamar a otra persona?",
    answers: ["Un celular", "Un monitor", "Una impresora"],
    correctIndex: 0,
  },
  {
    question: "¿Qué nos ayuda a conectar un dispositivo a internet sin cables?",
    answers: ["El Wi-Fi", "La cámara", "El teclado"],
    correctIndex: 0,
  },
  {
    question: "¿Qué aparato puede imprimir un dibujo en papel?",
    answers: ["Un parlante", "Una impresora", "Un celular"],
    correctIndex: 1,
  },
  {
    question: "¿Qué usamos para guardar una foto y verla después?",
    answers: ["Una memoria", "Un micrófono", "Un mouse"],
    correctIndex: 0,
  },
];
