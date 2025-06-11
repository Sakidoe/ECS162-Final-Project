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

