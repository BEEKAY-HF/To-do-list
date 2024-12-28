document.addEventListener('DOMContentLoaded', function () {
  const taskInput = document.getElementById('taskInput');
  const addTaskButton = document.getElementById('addTaskButton');
  const taskList = document.getElementById('taskList');
  const darkModeToggle = document.getElementById('toggleDarkMode');
  const darkModeText = document.getElementById('darkModeText');
  const progressBar = document.getElementById('progressBar');
  const progressFill = document.getElementById('progressFill');
  const progressPercentage = document.getElementById('progressPercentage');
  const quoteBox = document.getElementById('quoteBox'); 

  // Array of motivational quotes
  const quotes = [
    "Believe in yourself and all that you are.",
    "The only way to do great work is to love what you do.",
    "Success is not the key to happiness. Happiness is the key to success.",
    "Push yourself, because no one else is going to do it for you.",
    "Great things never come from comfort zones.",
    "Dream it. Wish it. Do it.",
    "Success doesn't just find you. You have to go out and get it.",
    "The harder you work for something, the greater you'll feel when you achieve it.",
    "Dream bigger. Do bigger."
  ];

  // Function to load tasks from local storage
  const loadTasks = () => {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    taskList.innerHTML = tasks.map(createTaskHTML).join('');
    updateProgress(tasks);
    applyDarkModeStyles();
  };

  // Function to save tasks to local storage
  const saveTasks = (tasks) => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  };

  // Function to create task HTML
  const createTaskHTML = (task) => {
    const completedClass = task.completed ? 'completed' : 'uncompleted';
    return `
      <li>
        <input type="checkbox" class="checkbox ${completedClass}" data-index="${task.index}" ${task.completed ? 'checked' : ''}>
        <span>${task.text}</span>
        <button class="completeButton" data-index="${task.index}">Completed</button>
        <button class="uncompleteButton" data-index="${task.index}">Uncompleted</button>
        <button class="deleteButton" data-index="${task.index}">Delete</button>
      </li>
    `;
  };

  // Add a new task
  addTaskButton.addEventListener('click', () => {
    const text = taskInput.value.trim();
    if (text) {
      const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
      const newTask = {
        text,
        completed: false,
        index: tasks.length,
      };
      tasks.push(newTask);
      saveTasks(tasks);
      taskInput.value = '';
      loadTasks();
    }
  });

  // Handle task actions (complete, uncomplete, delete)
  taskList.addEventListener('click', (event) => {
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    const index = parseInt(event.target.dataset.index, 10);

    if (event.target.classList.contains('checkbox')) {
      tasks[index].completed = !tasks[index].completed;
    } else if (event.target.classList.contains('deleteButton')) {
      tasks.splice(index, 1);
      tasks = tasks.map((task, newIndex) => ({ ...task, index: newIndex })); // Recalculate indices
    } else if (event.target.classList.contains('completeButton')) {
      tasks[index].completed = true;
    } else if (event.target.classList.contains('uncompleteButton')) {
      tasks[index].completed = false;
    }

    saveTasks(tasks);
    loadTasks();
  });

  // Update progress bar and its color
  const updateProgress = (tasks) => {
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(task => task.completed).length;
    const progress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

    progressPercentage.textContent = `${progress}%`;
    progressFill.style.width = `${progress}%`;

    // Change progress bar color
    progressFill.style.backgroundColor = progress < 50 ? '#d9534f' : '#5cb85c';
  };

  // Dark mode toggle
  const applyDarkModeStyles = () => {
    darkModeText.textContent = document.body.classList.contains('dark-mode') ? 'Light Mode' : 'Dark Mode';
  };

  darkModeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    applyDarkModeStyles();
    loadTasks(); 
  });

  // Function to update motivational quotes
  const updateQuote = () => {
    const randomIndex = Math.floor(Math.random() * quotes.length);
    quoteBox.textContent = `"${quotes[randomIndex]}"`;
  };

  // Display the first quote
  updateQuote();

  // Change quote every 3 seconds
  setInterval(updateQuote, 3000);

  // Initial page load
  loadTasks();
});
