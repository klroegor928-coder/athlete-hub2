document.addEventListener('DOMContentLoaded', () => {
    // Переключение разделов
    const btnTodo = document.getElementById('btnTodo');
    const btnWorkout = document.getElementById('btnWorkout');
    const btnNutrition = document.getElementById('btnNutrition');
    const todoSection = document.getElementById('todoSection');
    const workoutSection = document.getElementById('workoutSection');
    const nutritionSection = document.getElementById('nutritionSection');

    function activateSection(section) {
        todoSection.classList.remove('active');
        workoutSection.classList.remove('active');
        nutritionSection.classList.remove('active');
        section.classList.add('active');
    }

    btnTodo.addEventListener('click', () => activateSection(todoSection));
    btnWorkout.addEventListener('click', () => activateSection(workoutSection));
    btnNutrition.addEventListener('click', () => activateSection(nutritionSection));

    // Загружаем контент
    loadTodoContent();
    loadWorkoutContent();
    loadNutritionContent();
});

// ============ РАЗДЕЛ 1. ЗАДАЧИ ============
function loadTodoContent() {
    const section = document.getElementById('todoSection');
    section.innerHTML = `
        <h2 style="display: flex; align-items: center; gap: 10px; margin-bottom: 24px;">
            📋 Мои задачи
            <span style="font-size: 14px; background: #edf2f7; padding: 6px 14px; border-radius: 30px; color: #4a5568;">сегодня</span>
        </h2>
        
        <div class="card">
            <div style="display: flex; gap: 12px;">
                <input 
                    type="text" 
                    id="taskInput" 
                    placeholder="Напиши задачу... например: выпить 2 литра воды" 
                    style="flex: 1; padding: 16px; border-radius: 16px; border: 2px solid #e2e8f0; background: white; font-size: 16px;"
                >
                <button id="addTaskBtn" style="background: #f56565; color: white; border: none; padding: 0 28px; border-radius: 16px; font-weight: 600; font-size: 16px; cursor: pointer;">
                    + Добавить
                </button>
            </div>
        </div>

        <div style="display: flex; justify-content: space-between; align-items: center; margin: 20px 0 12px;">
            <h3 style="font-size: 18px;">📌 Активные задачи</h3>
            <span id="taskCounter" style="background: #e2e8f0; padding: 4px 12px; border-radius: 30px; font-size: 14px;">0/0</span>
        </div>

        <ul id="taskList" style="list-style: none; padding: 0; margin: 0;">
            <!-- Задачи будут здесь -->
        </ul>

        <div class="progress-bar">
            <div id="progressFill" class="progress-fill" style="width: 0%;"></div>
        </div>
    `;

    // Загружаем сохраненные задачи или создаем тестовые
    const savedTasks = localStorage.getItem('athleteTasks');
    if (savedTasks) {
        renderTasks(JSON.parse(savedTasks));
    } else {
        const defaultTasks = [
            { id: Date.now(), text: 'Сделать зарядку 15 мин', completed: false },
            { id: Date.now() + 1, text: 'Выпить протеин после тренировки', completed: false },
            { id: Date.now() + 2, text: 'Растяжка 10 мин', completed: true }
        ];
        renderTasks(defaultTasks);
    }

    // Исправлено: добавляем обработчики с проверкой существования элементов
    setTimeout(() => {
        const addBtn = document.getElementById('addTaskBtn');
        const taskInput = document.getElementById('taskInput');

        if (addBtn) {
            addBtn.addEventListener('click', function() {
                const text = taskInput.value.trim();
                if (text) {
                    addNewTask(text);
                    taskInput.value = '';
                    taskInput.focus();
                }
            });
        }

        if (taskInput) {
            taskInput.addEventListener('keypress', function(e) {
                if (e.key === 'Enter') {
                    const text = taskInput.value.trim();
                    if (text) {
                        addNewTask(text);
                        taskInput.value = '';
                    }
                }
            });
        }
    }, 100);
}

// Добавление новой задачи
function addNewTask(text) {
    const tasks = JSON.parse(localStorage.getItem('athleteTasks') || '[]');
    const newTask = {
        id: Date.now(),
        text: text,
        completed: false
    };
    tasks.push(newTask);
    renderTasks(tasks);
}

// Отрисовка задач
function renderTasks(tasks) {
    const taskList = document.getElementById('taskList');
    if (!taskList) return;

    // Сохраняем в localStorage
    localStorage.setItem('athleteTasks', JSON.stringify(tasks));

    // Сортируем: невыполненные сверху
    const sorted = [...tasks].sort((a, b) => a.completed - b.completed);

    taskList.innerHTML = sorted.map(task => `
        <li class="task-item ${task.completed ? 'task-completed' : ''}" data-id="${task.id}">
            <input type="checkbox" ${task.completed ? 'checked' : ''} onchange="toggleTask(${task.id})">
            <span style="flex: 1; font-size: 16px;">${task.text}</span>
            <button onclick="deleteTask(${task.id})" style="background: none; border: none; color: #a0aec0; cursor: pointer; font-size: 18px;">✕</button>
        </li>
    `).join('');

    updateTaskCounter(tasks);
}

// Переключение статуса задачи
window.toggleTask = function(taskId) {
    const tasks = JSON.parse(localStorage.getItem('athleteTasks') || '[]');
    const task = tasks.find(t => t.id === taskId);
    if (task) {
        task.completed = !task.completed;
        renderTasks(tasks);
    }
}

// Удаление задачи
window.deleteTask = function(taskId) {
    const tasks = JSON.parse(localStorage.getItem('athleteTasks') || '[]');
    const filtered = tasks.filter(t => t.id !== taskId);
    renderTasks(filtered);
}

// Обновление счетчика и прогресс-бара
function updateTaskCounter(tasks) {
    const counter = document.getElementById('taskCounter');
    const progressFill = document.getElementById('progressFill');
    
    if (counter) {
        const completed = tasks.filter(t => t.completed).length;
        const total = tasks.length;
        counter.textContent = `${completed}/${total} выполнено`;
    }
    
    if (progressFill && tasks.length > 0) {
        const completed = tasks.filter(t => t.completed).length;
        const percent = (completed / tasks.length) * 100;
        progressFill.style.width = `${percent}%`;
    }
}

// ============ РАЗДЕЛ 2. ТРЕНИРОВКИ ============
function loadWorkoutContent() {
    const section = document.getElementById('workoutSection');
    section.innerHTML = `
        <h2 style="display: flex; align-items: center; gap: 10px; margin-bottom: 24px;">
            🏋️ План тренировок
            <span style="font-size: 14px; background: #edf2f7; padding: 6px 14px; border-radius: 30px; color: #4a5568;">${new Date().toLocaleDateString('ru-RU', { weekday: 'long', day: 'numeric', month: 'long' })}</span>
        </h2>

        <div style="display: flex; gap: 15px; margin-bottom: 30px;">
            <label style="flex: 1; background: #4299e1; padding: 16px; border-radius: 20px; color: white; display: flex; align-items: center; justify-content: center; gap: 10px; cursor: pointer; font-weight: 600;">
                <input type="radio" name="sportType" value="bodybuilding" checked style="width: 18px; height: 18px; accent-color: white;"> 💪 Бодибилдер
            </label>
            <label style="flex: 1; background: #4299e1; padding: 16px; border-radius: 20px; color: white; display: flex; align-items: center; justify-content: center; gap: 10px; cursor: pointer; font-weight: 600;">
                <input type="radio" name="sportType" value="weightlifting" style="width: 18px; height: 18px; accent-color: white;"> 🏋️ Тяжелоатлет
            </label>
        </div>

        <div id="workoutPlanContainer"></div>
    `;

    // Показываем план по умолчанию
    setTimeout(() => {
        showBodybuildingPlan();
        
        // Обработчики переключения
        const radios = document.querySelectorAll('input[name="sportType"]');
        radios.forEach(radio => {
            radio.addEventListener('change', function() {
                if (this.value === 'bodybuilding') {
                    showBodybuildingPlan();
                } else {
                    showWeightliftingPlan();
                }
            });
        });
    }, 50);
}

function showBodybuildingPlan() {
    const container = document.getElementById('workoutPlanContainer');
    if (!container) return;
    
    container.innerHTML = `
        <h3 style="margin-bottom: 20px; color: #2c5282;">📅 Программа бодибилдера — 4 дня в неделю</h3>
        
        <div class="workout-day" style="border-left-color: #f56565;">
            <div class="day-header">
                <span>🔥 ДЕНЬ 1: Грудь + Трицепс</span>
                <span style="font-size: 14px; color: #718096;">выполнено: 0/5</span>
            </div>
            <div class="exercise-item">
                <input type="checkbox"> Жим штанги лежа — 4 подхода × 10 повторений
            </div>
            <div class="exercise-item">
                <input type="checkbox"> Жим гантелей на наклонной скамье — 4 × 12
            </div>
            <div class="exercise-item">
                <input type="checkbox"> Разводка гантелей — 3 × 15
            </div>
            <div class="exercise-item">
                <input type="checkbox"> Французский жим лежа — 3 × 12
            </div>
            <div class="exercise-item">
                <input type="checkbox"> Разгибание рук на блоке — 3 × 15
            </div>
        </div>

        <div class="workout-day" style="border-left-color: #4299e1;">
            <div class="day-header">
                <span>💪 ДЕНЬ 2: Спина + Бицепс</span>
                <span style="font-size: 14px; color: #718096;">выполнено: 0/5</span>
            </div>
            <div class="exercise-item">
                <input type="checkbox"> Тяга штанги в наклоне — 4 × 10
            </div>
            <div class="exercise-item">
                <input type="checkbox"> Подтягивания (с весом) — 4 × 8
            </div>
            <div class="exercise-item">
                <input type="checkbox"> Тяга гантели в наклоне — 3 × 12
            </div>
            <div class="exercise-item">
                <input type="checkbox"> Подъем штанги на бицепс — 3 × 12
            </div>
            <div class="exercise-item">
                <input type="checkbox"> Молотки с гантелями — 3 × 15
            </div>
        </div>

        <div class="workout-day" style="border-left-color: #48bb78;">
            <div class="day-header">
                <span>🦵 ДЕНЬ 3: Ноги + Пресс</span>
                <span style="font-size: 14px; color: #718096;">выполнено: 0/5</span>
            </div>
            <div class="exercise-item">
                <input type="checkbox"> Приседания со штангой — 4 × 10
            </div>
            <div class="exercise-item">
                <input type="checkbox"> Жим ногами — 4 × 12
            </div>
            <div class="exercise-item">
                <input type="checkbox"> Разгибание ног в тренажере — 3 × 15
            </div>
            <div class="exercise-item">
                <input type="checkbox"> Подъем на носки стоя — 4 × 20
            </div>
            <div class="exercise-item">
                <input type="checkbox"> Скручивания на римском стуле — 3 × 20
            </div>
        </div>

        <div class="workout-day" style="border-left-color: #ecc94b;">
            <div class="day-header">
                <span>🎯 ДЕНЬ 4: Плечи + Трапеции</span>
                <span style="font-size: 14px; color: #718096;">выполнено: 0/5</span>
            </div>
            <div class="exercise-item">
                <input type="checkbox"> Жим гантелей сидя — 4 × 10
            </div>
            <div class="exercise-item">
                <input type="checkbox"> Тяга штанги к подбородку — 4 × 12
            </div>
            <div class="exercise-item">
                <input type="checkbox"> Махи гантелями в стороны — 3 × 15
            </div>
            <div class="exercise-item">
                <input type="checkbox"> Разведение гантелей в наклоне — 3 × 15
            </div>
            <div class="exercise-item">
                <input type="checkbox"> Шраги с гантелями — 4 × 15
            </div>
        </div>
    `;
}

function showWeightliftingPlan() {
    const container = document.getElementById('workoutPlanContainer');
    if (!container) return;
    
    container.innerHTML = `
        <h3 style="margin-bottom: 20px; color: #2c5282;">📅 Программа тяжелоатлета — 3 дня в неделю</h3>
        
        <div class="workout-day" style="border-left-color: #f56565;">
            <div class="day-header">
                <span>🥇 ДЕНЬ 1: Рывок + Тяга</span>
                <span style="font-size: 14px; color: #718096;">выполнено: 0/5</span>
            </div>
            <div class="exercise-item">
                <input type="checkbox"> Рывок штанги с пола — 5 × 3
            </div>
            <div class="exercise-item">
                <input type="checkbox"> Тяга рывковая — 5 × 3
            </div>
            <div class="exercise-item">
                <input type="checkbox"> Приседания со штангой — 4 × 5
            </div>
            <div class="exercise-item">
                <input type="checkbox"> Жим стоя — 4 × 6
            </div>
            <div class="exercise-item">
                <input type="checkbox"> Гиперэкстензия — 3 × 12
            </div>
        </div>

        <div class="workout-day" style="border-left-color: #4299e1;">
            <div class="day-header">
                <span>🏋️ ДЕНЬ 2: Толчок + Присед</span>
                <span style="font-size: 14px; color: #718096;">выполнено: 0/5</span>
            </div>
            <div class="exercise-item">
                <input type="checkbox"> Толчок штанги с пола — 5 × 3
            </div>
            <div class="exercise-item">
                <input type="checkbox"> Тяга толчковая — 5 × 3
            </div>
            <div class="exercise-item">
                <input type="checkbox"> Фронтальные приседания — 4 × 5
            </div>
            <div class="exercise-item">
                <input type="checkbox"> Жим лежа — 4 × 6
            </div>
            <div class="exercise-item">
                <input type="checkbox"> Тяга штанги в наклоне — 3 × 8
            </div>
        </div>

        <div class="workout-day" style="border-left-color: #48bb78;">
            <div class="day-header">
                <span>⚡ ДЕНЬ 3: Спец. работа + Вспомогательные</span>
                <span style="font-size: 14px; color: #718096;">выполнено: 0/5</span>
            </div>
            <div class="exercise-item">
                <input type="checkbox"> Рывок с виса — 4 × 3
            </div>
            <div class="exercise-item">
                <input type="checkbox"> Толчок с виса — 4 × 3
            </div>
            <div class="exercise-item">
                <input type="checkbox"> Приседания со штангой (70-80%) — 4 × 5
            </div>
            <div class="exercise-item">
                <input type="checkbox"> Тяга с плинтов — 4 × 3
            </div>
            <div class="exercise-item">
                <input type="checkbox"> Пресс/Разгибатели спины — 3 × 15
            </div>
        </div>
    `;
}

// ============ РАЗДЕЛ 3. ПИТАНИЕ ============
function loadNutritionContent() {
    const section = document.getElementById('nutritionSection');
    section.innerHTML = `
        <h2 style="display: flex; align-items: center; gap: 10px; margin-bottom: 20px;">
            🍎 План питания
            <span style="font-size: 14px; background: #edf2f7; padding: 6px 14px; border-radius: 30px; color: #4a5568;">восстановление</span>
        </h2>

        <div style="background: #ebf8ff; border-radius: 20px; padding: 24px; margin-bottom: 24px; border: 1px solid #bee3f8;">
            <h3 style="display: flex; align-items: center; gap: 8px; color: #2b6cb0; margin-bottom: 12px;">
                🤔 Какой режим питания выбрать?
            </h3>
            <p style="color: #4a5568; margin-bottom: 20px;">
                В зависимости от твоих целей и типа тренировок
            </p>
            <div class="diet-buttons">
                <button id="dietHighProtein" class="diet-btn">🥩 Более белковый</button>
                <button id="dietHighCarb" class="diet-btn">🍚 Более углеводный</button>
                <button id="dietBalanced" class="diet-btn active">⚖️ Сбалансированный</button>
            </div>
        </div>

        <div id="mealPlanContainer">
            <!-- Сюда подставится меню -->
        </div>
    `;

    // Загружаем сбалансированное меню по умолчанию
    setTimeout(() => {
        showBalancedDiet();
        
        // Обработчики кнопок
        const btnProtein = document.getElementById('dietHighProtein');
        const btnCarb = document.getElementById('dietHighCarb');
        const btnBalanced = document.getElementById('dietBalanced');

        if (btnProtein) {
            btnProtein.addEventListener('click', function() {
                btnProtein.classList.add('active');
                btnCarb.classList.remove('active');
                btnBalanced.classList.remove('active');
                showHighProteinDiet();
            });
        }

        if (btnCarb) {
            btnCarb.addEventListener('click', function() {
                btnCarb.classList.add('active');
                btnProtein.classList.remove('active');
                btnBalanced.classList.remove('active');
                showHighCarbDiet();
            });
        }

        if (btnBalanced) {
            btnBalanced.addEventListener('click', function() {
                btnBalanced.classList.add('active');
                btnProtein.classList.remove('active');
                btnCarb.classList.remove('active');
                showBalancedDiet();
            });
        }
    }, 100);
}

function showBalancedDiet() {
    const container = document.getElementById('mealPlanContainer');
    if (!container) return;

    container.innerHTML = `
        <h3 style="margin-bottom: 20px;">⚖️ Сбалансированный рацион (Б:Ж:У — 30%:25%:45%)</h3>
        
        <div class="card">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
                <span style="font-weight: 700; font-size: 18px;">🥣 07:30 — Завтрак</span>
                <span style="background: #e2e8f0; padding: 4px 12px; border-radius: 30px; font-size: 14px;">~550 ккал</span>
            </div>
            <div class="exercise-item">
                <input type="checkbox"> Овсянка на молоке — 60 г
            </div>
            <div class="exercise-item">
                <input type="checkbox"> Яйца вареные — 3 шт
            </div>
            <div class="exercise-item">
                <input type="checkbox"> Банан — 1 шт
            </div>
            <div class="exercise-item">
                <input type="checkbox"> Орехи грецкие — 20 г
            </div>
            <div style="margin-top: 12px; color: #48bb78; font-size: 14px;">
                🏷️ 35г белка / 60г углеводов / 22г жиров
            </div>
        </div>

        <div class="card">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
                <span style="font-weight: 700; font-size: 18px;">🥗 12:30 — Обед</span>
                <span style="background: #e2e8f0; padding: 4px 12px; border-radius: 30px; font-size: 14px;">~650 ккал</span>
            </div>
            <div class="exercise-item">
                <input type="checkbox"> Гречка отварная — 120 г
            </div>
            <div class="exercise-item">
                <input type="checkbox"> Куриное филе — 180 г
            </div>
            <div class="exercise-item">
                <input type="checkbox"> Овощной салат с маслом — 200 г
            </div>
            <div class="exercise-item">
                <input type="checkbox"> Хлеб цельнозерновой — 1 кусок
            </div>
            <div style="margin-top: 12px; color: #48bb78; font-size: 14px;">
                🏷️ 48г белка / 70г углеводов / 18г жиров
            </div>
        </div>

        <div class="card">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
                <span style="font-weight: 700; font-size: 18px;">🥛 16:30 — Полдник</span>
                <span style="background: #e2e8f0; padding: 4px 12px; border-radius: 30px; font-size: 14px;">~350 ккал</span>
            </div>
            <div class="exercise-item">
                <input type="checkbox"> Творог 5% — 200 г
            </div>
            <div class="exercise-item">
                <input type="checkbox"> Мед — 20 г
            </div>
            <div class="exercise-item">
                <input type="checkbox"> Яблоко — 1 шт
            </div>
            <div style="margin-top: 12px; color: #48bb78; font-size: 14px;">
                🏷️ 30г белка / 25г углеводов / 12г жиров
            </div>
        </div>

        <div class="card">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
                <span style="font-weight: 700; font-size: 18px;">🐟 20:00 — Ужин</span>
                <span style="background: #e2e8f0; padding: 4px 12px; border-radius: 30px; font-size: 14px;">~500 ккал</span>
            </div>
            <div class="exercise-item">
                <input type="checkbox"> Горбуша/Минтай — 200 г
            </div>
            <div class="exercise-item">
                <input type="checkbox"> Рис бурый — 80 г
            </div>
            <div class="exercise-item">
                <input type="checkbox"> Спаржевая фасоль — 150 г
            </div>
            <div style="margin-top: 12px; color: #48bb78; font-size: 14px;">
                🏷️ 42г белка / 50г углеводов / 15г жиров
            </div>
        </div>

        <div style="background: #2c5282; color: white; padding: 20px; border-radius: 20px; margin-top: 20px;">
            <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 15px;">
                <span style="font-weight: 700;">📊 ИТОГО ЗА ДЕНЬ:</span>
                <span>155г белка</span>
                <span>205г углеводов</span>
                <span>67г жиров</span>
                <span style="background: #fbbf24; color: #1e293b; padding: 6px 14px; border-radius: 30px;">~2050 ккал</span>
            </div>
        </div>
    `;
}

function showHighProteinDiet() {
    const container = document.getElementById('mealPlanContainer');
    if (!container) return;

    container.innerHTML = `
        <h3 style="margin-bottom: 20px;">🥩 Высокобелковый рацион (Б:Ж:У — 40%:25%:35%)</h3>
        
        <div class="card">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
                <span style="font-weight: 700; font-size: 18px;">🥚 07:30 — Завтрак</span>
                <span style="background: #e2e8f0; padding: 4px 12px; border-radius: 30px; font-size: 14px;">~580 ккал</span>
            </div>
            <div class="exercise-item">
                <input type="checkbox"> Омлет из 4 яиц — 200 г
            </div>
            <div class="exercise-item">
                <input type="checkbox"> Овсянка на воде — 40 г
            </div>
            <div class="exercise-item">
                <input type="checkbox"> Сыр — 50 г
            </div>
            <div style="margin-top: 12px; color: #48bb78; font-size: 14px;">
                🏷️ 48г белка / 35г углеводов / 28г жиров
            </div>
        </div>

        <div class="card">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
                <span style="font-weight: 700; font-size: 18px;">🐔 12:30 — Обед</span>
                <span style="background: #e2e8f0; padding: 4px 12px; border-radius: 30px; font-size: 14px;">~620 ккал</span>
            </div>
            <div class="exercise-item">
                <input type="checkbox"> Куриная грудка — 250 г
            </div>
            <div class="exercise-item">
                <input type="checkbox"> Гречка — 80 г
            </div>
            <div class="exercise-item">
                <input type="checkbox"> Овощи — 150 г
            </div>
            <div style="margin-top: 12px; color: #48bb78; font-size: 14px;">
                🏷️ 62г белка / 45г углеводов / 12г жиров
            </div>
        </div>

        <div class="card">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
                <span style="font-weight: 700; font-size: 18px;">🥛 16:30 — Полдник</span>
                <span style="background: #e2e8f0; padding: 4px 12px; border-radius: 30px; font-size: 14px;">~380 ккал</span>
            </div>
            <div class="exercise-item">
                <input type="checkbox"> Творог 0% — 250 г
            </div>
            <div class="exercise-item">
                <input type="checkbox"> Протеин — 1 мерная ложка
            </div>
            <div style="margin-top: 12px; color: #48bb78; font-size: 14px;">
                🏷️ 55г белка / 15г углеводов / 5г жиров
            </div>
        </div>

        <div class="card">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
                <span style="font-weight: 700; font-size: 18px;">🐟 20:00 — Ужин</span>
                <span style="background: #e2e8f0; padding: 4px 12px; border-radius: 30px; font-size: 14px;">~470 ккал</span>
            </div>
            <div class="exercise-item">
                <input type="checkbox"> Тунец/Горбуша — 200 г
            </div>
            <div class="exercise-item">
                <input type="checkbox"> Спаржа/Брокколи — 200 г
            </div>
            <div class="exercise-item">
                <input type="checkbox"> Оливковое масло — 15 г
            </div>
            <div style="margin-top: 12px; color: #48bb78; font-size: 14px;">
                🏷️ 48г белка / 20г углеводов / 22г жиров
            </div>
        </div>

        <div style="background: #2c5282; color: white; padding: 20px; border-radius: 20px; margin-top: 20px;">
            <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 15px;">
                <span style="font-weight: 700;">📊 ИТОГО ЗА ДЕНЬ:</span>
                <span>213г белка</span>
                <span>115г углеводов</span>
                <span>67г жиров</span>
                <span style="background: #fbbf24; color: #1e293b; padding: 6px 14px; border-radius: 30px;">~2050 ккал</span>
            </div>
        </div>
    `;
}

function showHighCarbDiet() {
    const container = document.getElementById('mealPlanContainer');
    if (!container) return;

    container.innerHTML = `
        <h3 style="margin-bottom: 20px;">🍚 Высокоуглеводный рацион (Б:Ж:У — 25%:20%:55%)</h3>
        
        <div class="card">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
                <span style="font-weight: 700; font-size: 18px;">🥣 07:30 — Завтрак</span>
                <span style="background: #e2e8f0; padding: 4px 12px; border-radius: 30px; font-size: 14px;">~600 ккал</span>
            </div>
            <div class="exercise-item">
                <input type="checkbox"> Овсянка на молоке — 80 г
            </div>
            <div class="exercise-item">
                <input type="checkbox"> Банан — 2 шт
            </div>
            <div class="exercise-item">
                <input type="checkbox"> Мед — 30 г
            </div>
            <div class="exercise-item">
                <input type="checkbox"> Яйца — 2 шт
            </div>
            <div style="margin-top: 12px; color: #48bb78; font-size: 14px;">
                🏷️ 28г белка / 95г углеводов / 15г жиров
            </div>
        </div>

        <div class="card">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
                <span style="font-weight: 700; font-size: 18px;">🍝 12:30 — Обед</span>
                <span style="background: #e2e8f0; padding: 4px 12px; border-radius: 30px; font-size: 14px;">~700 ккал</span>
            </div>
            <div class="exercise-item">
                <input type="checkbox"> Макароны твердых сортов — 150 г
            </div>
            <div class="exercise-item">
                <input type="checkbox"> Говядина — 150 г
            </div>
            <div class="exercise-item">
                <input type="checkbox"> Томатный соус — 60 г
            </div>
            <div style="margin-top: 12px; color: #48bb78; font-size: 14px;">
                🏷️ 38г белка / 95г углеводов / 22г жиров
            </div>
        </div>

        <div class="card">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
                <span style="font-weight: 700; font-size: 18px;">🍌 16:30 — Полд