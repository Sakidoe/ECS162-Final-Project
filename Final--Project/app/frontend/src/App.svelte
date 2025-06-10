<script lang="ts">
  let sidebarOpen = false;

  let tasks = [
    { id: 1, title: "task #1", date: "may 27", tag: "school", priority: "high" },
    { id: 2, title: "task #2", date: "may 28", tag: "personal", priority: "medium" },
  ];
</script>

<main class="layout">
  <div class:sidebar-open={sidebarOpen} class="sidebar">
    <div class="close-btn" on:click={() => sidebarOpen = false}>X</div>
    <h2>NAME</h2>
    <button class="nav-btn">dashboard</button>
    <button class="nav-btn">teams</button>
    <button class="nav-btn">calendar</button>
    <div class="logout-container">
      <div class="logout-icon"></div>
      <span>logout</span>
    </div>
  </div>

  <div class:shifted={sidebarOpen} class="main-content">
    <header class="header">
      <div class="logo" on:click={() => sidebarOpen = true}></div>
      <p class="title-header">ToDo – Week 9</p>
    </header>

    <div class="search-bar"></div>

    <section class="board">
      <div class="column">
        <h2>task</h2>
        {#each tasks as task, index}
          <div class="task-card">
            <div class="task-header">
              <span>{task.title}</span>
              <span class="task-date">{task.date}</span>
            </div>
            <div class="task-details">
              <div class="tag">{task.tag}</div>
              <div>priority: {task.priority}</div>

              <div class="checkbox-wrapper">
                <input 
                  type="checkbox" 
                  id="task-{index}" 
                  name="task-{index}" 
                  class="styled-checkbox"
                />
                <label for="task-{index}">{task.tag}</label>
              </div>
            </div>
          </div>
        {/each}

        <div class="task-card empty"></div>
        <div class="create-task">
          <button>＋</button> create a new task
        </div>
      </div>

      <div class="column">
        <h2>in-progress</h2>
        <div class="task-card empty"></div>
        <div class="task-card empty"></div>
      </div>

      <div class="column">
        <h2>completed</h2>
        <div class="task-card empty"></div>
        <div class="task-card empty"></div>
      </div>
    </section>
  </div>
</main>

<style>
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display&display=swap');

  * {
    font-family: 'Playfair Display', serif;
    box-sizing: border-box;
  }

  .layout {
    display: flex;
  }

  .sidebar {
    position: fixed;
    top: 0;
    left: -320px;
    width: 320px;
    height: 100vh;
    background-color: #ddd;
    padding: 1rem;
    display: flex;
    flex-direction: column;
    gap: 1rem;
    transition: left 0.3s ease;
    z-index: 10;
  }

  .sidebar-open {
    left: 0;
  }

  .close-btn {
    align-self: flex-end;
    cursor: pointer;
    font-size: 1.2rem;
  }

  .nav-btn {
    background-color: #bbb;
    border: none;
    padding: 0.75rem;
    border-radius: 6px;
    cursor: pointer;
    text-align: left;
    font-size: 1rem;
  }

  .logout-container {
    margin-top: auto;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    cursor: pointer;
  }

  .logout-icon {
    width: 24px;
    height: 24px;
    background-color: #aaa;
    border-radius: 4px;
  }

  .main-content {
    margin-left: 0;
    padding: 1rem;
    flex: 1;
    transition: margin-left 0.3s ease;
    width: 100%;
  }

  .main-content.shifted {
    margin-left: 320px;
  }

  .header {
    display: flex;
    align-items: center;
    gap: 1rem;
    margin-bottom: 2rem;
  }

  .logo {
    width: 40px;
    height: 40px;
    background-color: #ccc;
    cursor: pointer;
  }

  .title-header {
    font-size: 30px;
  }

  .search-bar {
    height: 40px;
    background-color: #ddd;
    border-radius: 6px;
    margin-bottom: 1rem;
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
    background-color: #ddd;
    padding: 0.5rem;
    border-radius: 6px;
  }

  .task-card {
    background-color: #eee;
    padding: 1rem;
    border-radius: 6px;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
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
    background-color: #ccc;
    display: inline-block;
    padding: 0.2rem 0.5rem;
    border-radius: 4px;
  }

  .task-card.empty {
    height: 100px;
    background-color: #ddd;
  }

  .create-task {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    background-color: #ddd;
    padding: 0.5rem;
    border-radius: 6px;
  }

  .create-task button {
    background-color: #bbb;
    border: none;
    width: 24px;
    height: 24px;
    border-radius: 4px;
    font-size: 18px;
    font-weight: bold;
    cursor: pointer;
  }
  .checkbox-wrapper {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-top: 0.5rem;
}

.styled-checkbox {
  appearance: none;
  width: 1.2rem;
  height: 1.2rem;
  border: 2px solid #888;
  border-radius: 0.25rem;
  transition: all 0.2s ease;
  cursor: pointer;
  position: relative;
}

.styled-checkbox:checked {
  background-color: #4CAF50;
  border-color: #4CAF50;
}

.styled-checkbox:checked::after {
  content: '';
  position: absolute;
  left: 0.35rem;
  top: 0.05rem;
  width: 0.25rem;
  height: 0.6rem;
  border: solid white;
  border-width: 0 2px 2px 0;
  transform: rotate(45deg);
}
</style>
