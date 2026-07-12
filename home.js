document.addEventListener('DOMContentLoaded', () => {
    const taskInput = document.getElementById('taskInput');
    const addBtn = document.getElementById('addBtn');
    const taskList = document.getElementById('taskList');

    addBtn.addEventListener('click', () => {
        const taskText = taskInput.value;
        if (taskText === '') return;

        // Create elements
        const li = document.createElement('li');
        li.innerHTML = `
            <span>${taskText}</span>
            <button class="complete-btn">Done</button>
            <button class="delete-btn">Delete</button>
        `;

        // Add functionality
        li.querySelector('.complete-btn').addEventListener('click', (e) => {
            e.target.parentElement.classList.toggle('completed');
        });

        li.querySelector('.delete-btn').addEventListener('click', (e) => {
            e.target.parentElement.remove();
        });

        taskList.appendChild(li);
        taskInput.value = '';
    });
});