<script lang="ts">
  // Track which screen to show
  let currentScreen: 'welcome' | 'login' | 'signup' | 'teams' = 'welcome';
  
  // Login form variables
  let email: string = "";
  let password: string = "";
  let rememberMe: boolean = false;
  let loginError: string | null = null;

  // Teams data
  let teams: Record<string, any> = {};
  let currentUser: { id?: string, email?: string } = {};
  let isLoading: boolean = false;
  let teamError: string | null = null;

  // New team creation
  let newTeamName: string = "";
  let createTeamError: string | null = null;
 
  // Team variables
  let selectedTeam: string | null = null;
  let tasks: any[] = [];
  let newTaskName: string = "";
  let newTaskDescription: string = "";
  let taskError: string | null = null;


  async function handleLogin() {
    if (!email || !password) {
      loginError = "Please enter both email and password";
      return;
    }
    
    try {
      isLoading = true;
      // Simulate login - replace with actual auth
      currentUser = { id: "user_" + Date.now(), email };
      await fetchTeams();
      currentScreen = 'teams';
      loginError = null;
    } catch (err) {
      loginError = "Login failed";
    } finally {
      isLoading = false;
    }
  }

  async function fetchTeams() {
    if (!currentUser.id) return;
    
    try {
      isLoading = true;
      // Replace with your actual endpoint
      const response = await fetch(`http://localhost:8000/get_teams/${currentUser.id}`);
      const data = await response.json();
      teams = data.teams || {};
    } catch (err) {
      teamError = "Failed to load teams";
    } finally {
      isLoading = false;
    }
  }

  async function createTeam() {
    if (!newTeamName.trim()) {
      createTeamError = "Please enter a team name";
      return;
    }
    if (!currentUser.id) {
      createTeamError = "You must be logged in to create a team";
      return;
    }

    createTeamError = null;
    isLoading = true;

    try {
      const response = await fetch("http://localhost:8000/create_team_task", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: currentUser.id,
          task_name: `Initial task for ${newTeamName}`,
          task_description: "Starter task created with the team",
          task_team: newTeamName,
          task_assignees: [currentUser.id],
          task_priority: "Medium",
          task_due_date: null
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        createTeamError = data.error || "Failed to create team";
        return;
      }

      newTeamName = "";
      await fetchTeams();  // Refresh the teams list after creation
    } catch (err) {
      createTeamError = "Network error creating team";
      console.error(err);
    } finally {
      isLoading = false;
    }
  }

  async function viewTeamTasks(teamName: string) {
  selectedTeam = teamName;
  isLoading = true;
  taskError = null;

  try {
    const response = await fetch(`http://localhost:8000/get_tasks/${currentUser.id}`);
    const data = await response.json();
    tasks = data.tasks || [];
  } catch (err) {
    taskError = "Failed to load tasks.";
    tasks = [];
  } finally {
    isLoading = false;
  }
}
async function addTask() {
  if (!newTaskName.trim()) {
    taskError = "Task name is required.";
    return;
  }

  if (!selectedTeam) {
    taskError = "No team selected.";
    return;
  }

  try {
    isLoading = true;

    const response = await fetch("http://localhost:8000/create_team_task", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        user_id: currentUser.id,
        task_name: newTaskName,
        task_description: newTaskDescription || "",
        task_team: selectedTeam,
        task_assignees: [],        // Or pass actual assignees if you have
        task_priority: "Medium",   // You can replace with actual priority from your UI
        task_due_date: "",         // You can add a due date input to your UI and send here
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      taskError = data.error || "Failed to add team task.";
      return;
    }

    // Clear inputs
    newTaskName = "";
    newTaskDescription = "";

    // Reload tasks for the selected team
    await viewTeamTasks(selectedTeam);

  } catch (err) {
    taskError = "Error adding team task.";
    console.error(err);
  } finally {
    isLoading = false;
  }
}


  function logout() {
    currentUser = {};
    teams = {};
    currentScreen = 'welcome';
    const response = fetch(`http://localhost/logout`);
  }
</script>

<main>
  {#if currentScreen === 'welcome'}
    <!-- Welcome Screen -->
    <div class="welcome-container">
      <div class="welcome-content">
        <h1>Welcome</h1>
        <div class="auth-options">
          <button on:click={() => currentScreen = 'login'}>Log in</button>
          <span>or</span>
          <button on:click={() => currentScreen = 'signup'}>Create an Account</button>
        </div>
      </div>
    </div>

  {:else if currentScreen === 'login'}
    <!-- Login Screen -->
    <div class="login-split-container">
      <div class="login-form-container">
        <button class="back-button" on:click={() => currentScreen = 'welcome'}>← Back</button>
        
        <div class="auth-form">
          <div class="logo">LOGO</div>
          <h2>Welcome Back</h2>
          <p>Please enter your details</p>
          
          <form on:submit|preventDefault={handleLogin}>
            <div class="form-group">
              <label for="email">Email</label>
              <input 
                type="email" 
                id="email" 
                bind:value={email}
                placeholder="your@email.com"
                required
              >
            </div>
            
            <div class="form-group">
              <label for="password">Password</label>
              <input 
                type="password" 
                id="password" 
                bind:value={password}
                placeholder="••••••••"
                required
              >
            </div>
            
            <div class="form-options">
              <label class="checkbox-container">
                <input type="checkbox" bind:checked={rememberMe}>
                <span class="checkmark"></span>
                Remember me
              </label>
              <a href="#" class="forgot-password">Forgot password?</a>
            </div>
            
            {#if loginError}
              <div class="error-message">{loginError}</div>
            {/if}
            
            <button type="submit" class="submit-button" disabled={isLoading}>
              {#if isLoading}Loading...{:else}Log in{/if}
            </button>
          </form>
          
          <div class="auth-footer">
            Don't have an account? <a href="#" on:click|preventDefault={() => currentScreen = 'signup'}>Sign up</a>
          </div>
        </div>
      </div>
      
      <div class="login-design-side">
        <div class="design-content">
          <div class="shape-1"></div>
          <div class="shape-2"></div>
          <div class="shape-3"></div>
        </div>
      </div>
    </div>

  {:else if currentScreen === 'signup'}
    <!-- Signup screen -->
    <p>Signup form coming soon!</p>

  {:else if currentScreen === 'teams'}
    <!-- Teams Dashboard -->
    <div class="teams-dashboard">
      <header class="teams-header">
        <h1>Team Dashboard</h1>
        <button on:click={logout} class="logout-button">Logout</button>
      </header>

      <div class="teams-content">
        <div class="teams-list">
          <h2>Your Teams</h2>
          
          {#if isLoading && Object.keys(teams).length === 0}
            <div class="loading">Loading teams...</div>
          {:else if Object.keys(teams).length === 0}
            <div class="no-teams">You don't have any teams yet</div>
          {:else}
            {#each Object.entries(teams) as [teamName, teamData]}
              <div class="team-card">
                <h3>{teamName}</h3>
                <div class="team-meta">
                  <span>Tasks: {Object.keys(teamData).length}</span>
                  <span>Members: {teamData[Object.keys(teamData)[0]]?.task_assignees?.length || 0}</span>
                </div>
                <div class="team-actions">
                  <button on:click={() => viewTeamTasks(teamName)}>View</button>
                  <button>Manage</button>
                </div>
              </div>
            {/each}
          {/if}
        </div>

        <div class="create-team">
          <h2>Create New Team</h2>
          <form on:submit|preventDefault={createTeam}>
            <input 
              type="text" 
              bind:value={newTeamName}
              placeholder="Enter team name"
              class="team-input"
            >
            {#if createTeamError}
              <div class="error-message">{createTeamError}</div>
            {/if}
            <button type="submit" class="create-button" disabled={isLoading}>
              {#if isLoading}Creating...{:else}Create Team{/if}
            </button>
          </form>
        </div>
      </div>
      {#if selectedTeam}
      <div class="team-tasks-panel">
        <h2>Tasks for {selectedTeam}</h2>
        
        {#if isLoading}
          <p>Loading tasks...</p>
        {:else if tasks.length === 0}
          <p>No tasks yet.</p>
        {:else}
          <ul>
            {#each tasks as task}
              <li>
                <strong>{task.task_name}</strong> - {task.task_description}
              </li>
            {/each}
          </ul>
        {/if}

        <h3>Add Task</h3>
        <input type="text" placeholder="Task name" bind:value={newTaskName} />
        <textarea placeholder="Task description" bind:value={newTaskDescription}></textarea>
        {#if taskError}<div class="error-message">{taskError}</div>{/if}
        <button on:click={addTask} disabled={isLoading}>
          {#if isLoading}Saving...{:else}Add Task{/if}
        </button>
      </div>
    {/if}

    </div>
  {/if}
</main>

  import Task from "./task.svelte";

  let sidebarOpen = false;

  let tasks = [];

  let newTaskTitle = "";
  let newTaskTag = "";
  let newTaskPriority = "medium";
  let showCreateForm = false;
  const userId = "jon"; //hardcoded

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
        status: t.status ?? "task" // fallback to default
      }));
    }
  }

  async function deleteTask(title) {
    try {
      const res = await fetch('http://localhost:8000/delete_task', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id:    userId,
          task_title: title
        })
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      const data = await res.json();
      if (data.success) {
        // Remove it locally
        tasks = tasks.filter(t => t.task_name !== title);
      } else {
        console.warn('Unexpected delete response:', data);
      }
    } catch (err) {
      console.error('Failed to delete task:', err);
    }
  }
  // async function createTask() {
  //   if (!newTaskTitle || !newTaskTag) return alert("Fill out all fields.");
  //   await fetch("http://localhost:8000/create_task", {
  //     method: "POST",
  //     headers: { "Content-Type": "application/json" },
  //     body: JSON.stringify({
  //       user_id: userId,
  //       task_name: newTaskTitle,
  //       task_description: "n/a",
  //       task_location: "n/a",
  //       task_color: "gray",
  //       task_label: "n/a",
  //       task_start_time: "00:00",
  //       task_end_time: "01:00",
  //       task_date: "unknown",
  //       task_tags: newTaskTag,
  //       task_priority: newTaskPriority,
  //       status: "task"
  //     }),
  //   });
  //   newTaskTitle = "";
  //   newTaskTag = "";
  //   newTaskPriority = "medium";
  //   showCreateForm = false;
  //   fetchTasks();
  // }

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

  // Derived groups
  $: taskGroup = tasks.filter(t => t.status === "task");
  $: inProgressGroup = tasks.filter(t => t.status === "in-progress");
  $: completedGroup = tasks.filter(t => t.status === "completed");

  fetchTasks();
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
      <p class="title-header">Dashboard</p>
    </header>

    <section class="board">
      <div class="column">
        <h2>task</h2>
        {#each tasks as task, index}
          <div class="task-card">
            <div class="close">
              <button 
                on:click={() => { 
                  deleteTask(task.title).then(() => fetchTasks()); 
                }} 
                class="closeTask"
              >
                X
              </button>
            </div>
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

        <!-- <div class="task-card empty"></div> -->
        <div class="create-task">
          <button on:click={() => { showCreateForm = true }}>+</button>
          <p>Create a new task</p>
        </div>
        
        {#if showCreateForm}
          <Task
            on:close={() => showCreateForm = false}
            on:taskCreated={() => {
              showCreateForm = false; // Close the form
              fetchTasks(); // Refresh the tasks
            }}
          />
        {/if}

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

  html, body {
    margin: 0;
    padding: 0;
    border: none;
    background-color: #dbe1d7;
    height: 100%;
    width: 100%;
    overflow-x: hidden;
  }

  * {
    font-family: 'Playfair Display', serif;
    box-sizing: border-box;
  }

  .layout {
    display: flex;
    border: none;
  }

  .sidebar {
    position: fixed;
    top: 0;
    left: -320px;
    width: 320px;
    height: 100vh;
    background-color: #4a572a;
    padding: 1rem;
    display: flex;
    flex-direction: column;
    gap: 1rem;
    transition: left 0.3s ease;
    z-index: 10;
    color: white;
  }

  .sidebar-open {
    left: 0;
  }

  .close-btn {
    align-self: flex-end;
    cursor: pointer;
    font-size: 1.2rem;
    color: white;
  }

  .nav-btn {
    background-color: #6f7d4c;
    border: none;
    padding: 0.75rem;
    border-radius: 6px;
    cursor: pointer;
    text-align: left;
    font-size: 1rem;
    color: white;
  }

  .logout-container {
    margin-top: auto;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    cursor: pointer;
    color: white;
  }

  .logout-icon {
    width: 24px;
    height: 24px;
    background-color: #8a9a5b;
    border-radius: 4px;
  }

  .main-content {
    margin-left: 0;
    padding: 1rem;
    flex: 1;
    transition: margin-left 0.3s ease;
    width: 100%;
    background-color: #dbe1d7;
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
    background-color: #3d4c1c;
    cursor: pointer;
  }

  .title-header {
    text-align: center;
    width: 100%;
    font-size: 30px;
    background-color: white;
    padding: 0.5rem 2rem;
    border: 1px solid #556b2f;
    border-radius: 5px;
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
    padding: 0.5rem;
    border-radius: 6px;
    color: white;
  }

  .column:nth-child(1) h2 {
    background-color: #5b6d2f;
  }

  .column:nth-child(2) h2 {
    background-color: #88a595;
  }

  .column:nth-child(3) h2 {
    background-color: #99b6db;
  }

  .task-card {
    position: relative;
    background-color: #5b6d2f;
    color: white;
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
    background-color: #8c9c61;
    display: inline-block;
    padding: 0.2rem 0.5rem;
    border-radius: 4px;
    color: white;
  }

  /* Default empty style fallback */
  .task-card.empty {
    height: 100px;
    border-radius: 10px;
  }

  /* Specific column background styles */
  .column:nth-child(2) .task-card.empty {
    background-color: #84a89d; /* same as in-progress header */
  }

  .column:nth-child(3) .task-card.empty {
    background-color: #9bbfe8; /* same as completed header */
  }


  .create-task {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    background-color: #5b6d2f;
    padding: 0.5rem;
    border-radius: 6px;
    color: white;
  }

  .create-task button {
    background-color: white;
    border: none;
    width: 24px;
    height: 24px;
    border-radius: 4px;
    font-size: 18px;
    font-weight: bold;
    cursor: pointer;
    color: #5b6d2f;
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
    border: 2px solid white;
    border-radius: 0.25rem;
    transition: all 0.2s ease;
    cursor: pointer;
    position: relative;
    background-color: transparent;
  }

  .styled-checkbox:checked {
    background-color: white;
    border-color: white;
  }

  .styled-checkbox:checked::after {
    content: '';
    position: absolute;
    left: 0.35rem;
    top: 0.05rem;
    width: 0.25rem;
    height: 0.6rem;
    border: solid #5b6d2f;
    border-width: 0 2px 2px 0;
    transform: rotate(45deg);
  }

  .close {
    position: absolute;
    top: 0.5rem;
    right: 0.5rem;
    cursor: pointer;
  }

  .closeTask {
    background: none;
    border: none;
    font-size: 1rem;
    font-weight: bold;
    color: #f9f9f9;
    cursor: pointer;
  }
  html, body {
  margin: 0;
  padding: 0;
  background-color: #dbe1d7; /* muted green-gray */
  height: 100%;
  width: 100%;
  overflow-x: hidden;
}

:global(body) {
  background-color: #dbe1d7;
}

</style>
