<script lang="ts">
  // Track which screen to show
  let currentScreen: 'welcome' | 'login' | 'signup' = 'welcome';
  
  // Login form variables
  let email: string = "";
  let password: string = "";
  let rememberMe: boolean = false;
  let loginError: string | null = null;

  function handleLogin() {
    // Basic validation
    if (!email || !password) {
      loginError = "Please enter both email and password";
      return;
    }
    
    // TODO: will add auth later
    console.log("Logging in with:", { email, password, rememberMe });
    loginError = null;
  }

  function goBack() {
    currentScreen = 'welcome';
  }
</script>

<main>
  {#if currentScreen === 'welcome'}
    <!-- Welcome Screen) -->
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
  <!-- Login Screen with Split Layout -->
  <div class="login-split-container">
    <!-- Left Side - Login Form -->
    <div class="login-form-container">
      <button class="back-button" on:click={goBack}>← Back</button>
      
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
          
          <button type="submit" class="submit-button">Log in</button>
        </form>
        
        <div class="auth-footer">
          Don't have an account? <a href="#" on:click|preventDefault={() => currentScreen = 'signup'}>Sign up</a>
        </div>
      </div>
    </div>
    
    <!-- Right Side - Decorative Design -->
    <div class="login-design-side">
      <div class="design-content">
        <div class="shape-1"></div>
        <div class="shape-2"></div>
        <div class="shape-3"></div>
      </div>
    </div>
  </div>
    

  {:else if currentScreen === 'signup'}
    <!-- Signup screen-->
    <p>Signup form coming soon!</p>
  {/if}
</main>