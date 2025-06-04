<script lang="ts">
  import { onMount } from 'svelte';

  let apiKey: string = '';

//   onMount(async () => {
//     try {
//       const res = await fetch('/api/key');
//       const data = await res.json();
//       apiKey = data.apiKey;
//     } catch (error) {
//       console.error('Failed to fetch API key:', error);
//     }
//   }); 





  let user = null;

  onMount(async () => {
    try {
      const res = await fetch("http://localhost:8000/api/me", {
        credentials: "include" // ← VERY IMPORTANT: sends the session cookie!
      });
      if (res.ok) {
        user = await res.json();
      }
    } catch (e) {
      console.error("Failed to fetch user", e);
    }
  });
  
  const login = () => window.location.href = "http://localhost:8000/login";
  const logout = () => window.location.href = "http://localhost:8000/logout";
</script>

{#if user}
  <button on:click={logout}>Logout</button>
{:else}
  <button on:click={login}>Login with Google</button>
{/if}


<main>
    
</main>
