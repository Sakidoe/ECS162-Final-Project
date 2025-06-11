<script lang="ts">
  import Sidebar from "./Sidebar.svelte";
  import Task from "./task.svelte";

  let sidebarOpen = false;
  let tasks = [];
  let newTaskTitle = "";
  let newTaskTag = "";
  let newTaskPriority = "medium";
  let showCreateForm = false;
  const userId = "jon";

  async function fetchTasks() {
    const res = await fetch(`http://localhost:8000/get_tasks/${userId}`, {
      credentials: "include"
    });
    const data = await res.json();
    if (data.tasks && typeof data.tasks === "object") {
      tasks = Object.entries(data.tasks).map(([title, t]: any, i) => ({
        id: i + 1,
        title,
        date: t.task_date,
        tag: t.task_tags,
        priority: t.task_priority,
        status: t.status ?? "task"
      }));
    }
  }

  async function deleteTask(title) {
    try {
      const res = await fetch('http://localhost:8000/delete_task', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: userId, task_title: title })
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      if (data.success) tasks = tasks.filter(t => t.title !== title);
    } catch (err) {
      console.error('Failed to delete task:', err);
    }
  }

  async function updateStatus(taskId: number, newStatus: string) {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;
    task.status = newStatus;

    await fetch("http://localhost:8000/update_task_status", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user_id: userId, task_name: task.title, new_status: newStatus })
    });
  }

  $: taskGroup = tasks.filter(t => t.status === "task");
  $: inProgressGroup = tasks.filter(t => t.status === "in-progress");
  $: completedGroup = tasks.filter(t => t.status === "completed");

  fetchTasks();
</script>

<main class="layout">
  <Sidebar {sidebarOpen} closeSidebar={() => sidebarOpen = false} />

  <div class:shifted={sidebarOpen} class="main-content">
    <header class="header">
      <div class="logo" on:click={() => sidebarOpen = true}></div>
      <p class="title-header">ToDo</p>
    </header>

    <section class="board">
      <div class="column">
        <h2>task</h2>
        {#each taskGroup as task, index}
          <div class="task-card">
            <div class="close">
              <button on:click={() => deleteTask(task.title).then(fetchTasks)} class="closeTask">X</button>
            </div>
            <div class="task-header">
              <span>{task.title}</span>
              <span class="task-date">{task.date}</span>
            </div>
            <div class="task-details">
              <div class="tag">{task.tag}</div>
              <div>priority: {task.priority}</div>
              <select on:change={(e) => updateStatus(task.id, e.target.value)}>
                <option value="task" selected={task.status === "task"}>task</option>
                <option value="in-progress" selected={task.status === "in-progress"}>in-progress</option>
                <option value="completed" selected={task.status === "completed"}>completed</option>
              </select>
            </div>
          </div>
        {/each}

        <div class="create-task">
          <button on:click={() => { showCreateForm = true }}>+</button>
          <p>Create a new task</p>
        </div>

        {#if showCreateForm}
          <Task
            on:close={() => showCreateForm = false}
            on:taskCreated={() => {
              showCreateForm = false;
              fetchTasks();
            }}
          />
        {/if}
      </div>

      <div class="column">
        <h2>in-progress</h2>
        {#each inProgressGroup as task}
          <div class="task-card in-progress">
            <div class="task-header">
              <span>{task.title}</span>
              <span class="task-date">{task.date}</span>
            </div>
            <div class="task-details">
              <div class="tag">{task.tag}</div>
              <div>priority: {task.priority}</div>
              <select on:change={(e) => updateStatus(task.id, e.target.value)}>
                <option value="task" selected={task.status === "task"}>task</option>
                <option value="in-progress" selected={task.status === "in-progress"}>in-progress</option>
                <option value="completed" selected={task.status === "completed"}>completed</option>
              </select>
            </div>
          </div>
        {/each}
      </div>

      <div class="column">
        <h2>completed</h2>
        {#each completedGroup as task}
          <div class="task-card completed">
            <div class="task-header">
              <span>{task.title}</span>
              <span class="task-date">{task.date}</span>
            </div>
            <div class="task-details">
              <div class="tag">{task.tag}</div>
              <div>priority: {task.priority}</div>
              <select on:change={(e) => updateStatus(task.id, e.target.value)}>
                <option value="task" selected={task.status === "task"}>task</option>
                <option value="in-progress" selected={task.status === "in-progress"}>in-progress</option>
                <option value="completed" selected={task.status === "completed"}>completed</option>
              </select>
            </div>
          </div>
        {/each}
      </div>
    </section>
  </div>
</main>

<style>
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display&display=swap');

  * {
    font-family: 'Playfair Display', serif;
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  body, html, main {
    height: 100%;
    width: 100%;
    background-color: #1a1a1a;
    color: #fff;
  }

  .layout {
    display: flex;
    min-height: 100vh;
  }

  .main-content {
    flex: 1;
    padding: 1rem;
    transition: margin-left 0.3s ease;
  }

  .main-content.shifted {
    margin-left: 320px;
  }

  .header {
    display: flex;
    align-items: center;
    gap: 1rem;
    margin-bottom: 2rem;
    border-bottom: 2px solid #333;
    padding-bottom: 0.5rem;
  }

  .logo {
    width: 40px;
    height: 40px;
    background-color: #444;
    cursor: pointer;
  }

  .title-header {
    font-size: 2rem;
    font-weight: bold;
    flex-grow: 1;
    text-align: center;
  }

  .board {
    display: flex;
    gap: 2rem;
  }

  .column {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .column h2 {
    text-align: center;
    background-color: #333;
    padding: 0.5rem;
    border-radius: 6px;
  }

  .task-card {
    background-color: #333;
    padding: 1rem;
    border-radius: 6px;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    position: relative;
  }

  .task-card.in-progress {
    background-color: #295ba7;
  }

  .task-card.completed {
    background-color: #2a7a2a;
  }

  .task-header {
    display: flex;
    justify-content: space-between;
    font-weight: bold;
  }

  .task-details {
    font-size: 0.9rem;
  }

  .tag {
    background-color: #666;
    display: inline-block;
    padding: 0.2rem 0.5rem;
    border-radius: 4px;
  }

  .create-task {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    background-color: #444;
    padding: 0.5rem;
    border-radius: 6px;
  }

  .create-task button {
    background-color: #888;
    border: none;
    width: 24px;
    height: 24px;
    border-radius: 4px;
    font-size: 18px;
    font-weight: bold;
    cursor: pointer;
    color: white;
  }

  .close {
    position: absolute;
    top: 0.5rem;
    right: 0.5rem;
  }

  .closeTask {
    background: none;
    border: none;
    font-size: 1rem;
    font-weight: bold;
    color: #aaa;
    cursor: pointer;
  }
</style>
