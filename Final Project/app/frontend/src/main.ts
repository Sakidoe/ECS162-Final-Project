import { mount } from 'svelte'
import './app.css'
import App from './App.svelte'

const app = mount(App, {
  target: document.getElementById('app')!,
})

export default app


"use strict";
(async function() {
    // sample of how to add a note to a specific user's notes collection
        // const response = await fetch("http://localhost:8000/insert_note", {
        //   method: "POST",
        //   body: JSON.stringify({
        //     user_id: 'david',
        //     note: 'testing testing testing testing',
        //     note_title: 'hello world'
        //   }),
        //   headers: {'Content-Type': 'application/json'}
        // });
    
})();