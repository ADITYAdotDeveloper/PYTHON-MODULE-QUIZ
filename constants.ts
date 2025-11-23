import { Question, Quote } from './types';

// Replace this with your deployed Google Apps Script Web App URL
export const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbw8C0pyho8NkCEkpJpVbZ0CNKZ9cIbTXUx8CzTkUCLErtTELnAk7ZqIFbfvMoArfYaE/exec';

export const MOTIVATIONAL_QUOTES: Quote[] = [
  { quote: "Dream bigger. Do bigger.", author: "Unknown" },
  { quote: "Dream it. Wish it. Do it.", author: "Unknown" },
  { quote: "Little things make big days.", author: "Unknown" },
  { quote: "If you can dream it, you can do it.", author: "Walt Disney" },
  { quote: "Don’t wait for opportunity. Create it.", author: "Unknown" },
  { quote: "Believe you can and you're halfway there.", author: "Theodore Roosevelt" },
  { quote: "Your limitation—it’s only your imagination.", author: "Unknown" },
  { quote: "Great things never come from comfort zones.", author: "Unknown" },
  { quote: "Opportunities don’t happen. You create them.", author: "Chris Grosser" },
  { quote: "The secret of getting ahead is getting started.", author: "Mark Twain" }
];

export const QUIZ_QUESTIONS: Question[] = [
  {
    id: 1,
    question: "What is a module in Python?",
    options: {
      A: "A file that contains Python code such as functions or variables.",
      B: "A type of loop used to repeat code.",
      C: "A built-in function that runs automatically.",
      D: "A tool used only for creating user interfaces."
    },
    answer: "A",
    explanation: "A module is a Python file (.py) that contains reusable code."
  },
  {
    id: 2,
    question: "Why are modules useful in Python?",
    options: {
      A: "They make Python run faster.",
      B: "They allow code reuse and keep programs organized.",
      C: "They automatically fix errors.",
      D: "They replace variables in code."
    },
    answer: "B",
    explanation: "Modules help reuse code and keep programs neat and organized."
  },
  {
    id: 3,
    question: "How do you import a module in Python?",
    options: {
      A: "use module_name",
      B: "include module_name",
      C: "import module_name",
      D: "load module_name"
    },
    answer: "C",
    explanation: "The correct keyword is “import”, such as: import module_name."
  },
  {
    id: 4,
    question: "What is a package in Python?",
    options: {
      A: "A group of modules stored in a folder with __init__.py.",
      B: "A single Python variable.",
      C: "A temporary file created during execution.",
      D: "A file that only stores numbers."
    },
    answer: "A",
    explanation: "A package is a folder containing multiple modules, usually with an __init__.py file."
  },
  {
    id: 5,
    question: "What is the main difference between a module and a package?",
    options: {
      A: "A module is always faster.",
      B: "A module is a single file; a package is a folder of modules.",
      C: "A package only works on Windows.",
      D: "Modules cannot be imported."
    },
    answer: "B",
    explanation: "A module is one .py file, while a package is a folder containing multiple modules."
  },
  {
    id: 6,
    question: "Which of the following is a built-in Python module?",
    options: {
      A: "myscript",
      B: "math",
      C: "notes",
      D: "calculator"
    },
    answer: "B",
    explanation: "“math” is a built-in module that comes with Python."
  },
  {
    id: 7,
    question: "What do we call a module that you create yourself?",
    options: {
      A: "User-defined module",
      B: "Machine module",
      C: "Built-in module",
      D: "System module"
    },
    answer: "A",
    explanation: "A user-defined module is one you create yourself in a .py file."
  },
  {
    id: 8,
    question: "If you have tools.py with a function greet(), how do you import only greet?",
    options: {
      A: "from tools import greet",
      B: "import tools.greet()",
      C: "get tools.greet",
      D: "load greet from tools"
    },
    answer: "A",
    explanation: "You import a single function using “from module import function”, e.g. from tools import greet."
  },
  {
    id: 9,
    question: "What is the difference between a user-defined and a built-in module?",
    options: {
      A: "User-defined modules only work on Windows.",
      B: "User-defined modules are created by the programmer; built-in modules come with Python.",
      C: "Built-in modules cannot be imported.",
      D: "Built-in modules are always slower."
    },
    answer: "B",
    explanation: "User-defined modules are written by the programmer; built-in modules are included with Python."
  },
  {
    id: 10,
    question: "Which of the following is a correct statement about Python modules?",
    options: {
      A: "A module is a single Python file containing code.",
      B: "A module can only contain numbers.",
      C: "A module must be downloaded from the internet.",
      D: "A module cannot be imported."
    },
    answer: "A",
    explanation: "A module is simply a .py file with code inside."
  }
];