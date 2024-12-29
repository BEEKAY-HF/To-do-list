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

  const loadTasks = () => {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    taskList.innerHTML = tasks.map(createTaskHTML).join('');
    updateProgress(tasks);
    applyDarkModeStyles();
  };

  const saveTasks = (tasks) => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  };

  const createTaskHTML = (task) => {
    const completedClass = task.completed ? 'completed' : 'uncompleted';
    return `
      <li>
        <input type="checkbox" class="checkbox ${completedClass}" data-index="${task.index}" ${task.completed ? 'checked' : ''}>
        <span>${task.text}</span>
        <button class="actionButton" data-index="${task.index}" title="Actions">
          <div>
            <span class="symbol complete" title="Mark as Completed">✔️</span>
            <span class="symbol uncomplete" title="Mark as Uncompleted">❌</span>
            <span class="symbol delete" title="Delete Task">🗑️</span>
          </div>
        </button>
      </li>
    `;
  };

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

  taskList.addEventListener('click', (event) => {
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    const target = event.target;
    const parentButton = target.closest('.actionButton');

    if (parentButton) {
      const index = parseInt(parentButton.dataset.index, 10);
      if (target.classList.contains('complete')) {
        tasks[index].completed = true;
      } else if (target.classList.contains('uncomplete')) {
        tasks[index].completed = false;
      } else if (target.classList.contains('delete')) {
        tasks.splice(index, 1);
        tasks = tasks.map((task, newIndex) => ({ ...task, index: newIndex }));
      }
      saveTasks(tasks);
      loadTasks();
    } else if (target.classList.contains('checkbox')) {
      const index = parseInt(target.dataset.index, 10);
      tasks[index].completed = !tasks[index].completed;
      saveTasks(tasks);
      loadTasks();
    }
  });

  const updateProgress = (tasks) => {
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(task => task.completed).length;
    const progress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

    progressPercentage.textContent = `${progress}%`;
    progressFill.style.width = `${progress}%`;

    progressFill.style.backgroundColor = progress < 50 ? '#d9534f' : '#5cb85c';
  };

  const applyDarkModeStyles = () => {
    darkModeText.textContent = document.body.classList.contains('dark-mode') ? 'Light Mode' : 'Dark Mode';
  };

  darkModeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    applyDarkModeStyles();
    loadTasks();
  });

  const updateQuote = () => {
    const randomIndex = Math.floor(Math.random() * quotes.length);
    quoteBox.textContent = `"${quotes[randomIndex]}"`;
  };

  updateQuote();
  setInterval(updateQuote, 3000);

  loadTasks();
});
