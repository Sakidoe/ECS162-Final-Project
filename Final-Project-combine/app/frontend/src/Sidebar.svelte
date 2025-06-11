<script lang="ts">
  export let sidebarOpen: boolean;
  export let closeSidebar: () => void;
</script>

<div class:sidebar-open={sidebarOpen} class="sidebar">
  <div class="close-btn" on:click={closeSidebar}>X</div>
  <h2>NAME</h2>
  <button class="nav-btn">dashboard</button>
  <button class="nav-btn">teams</button>
  <button class="nav-btn">calendar</button>
  <div class="logout-container">
    <div class="logout-icon"></div>
    <span>logout</span>
  </div>
</div>

<style>
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
</style>
