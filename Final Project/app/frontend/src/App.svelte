<script lang="ts">
  import { onMount } from 'svelte';
  import Task from './task.svelte';
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
</script>

<main>
    <Task />
</main>
