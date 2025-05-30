import { mount } from 'svelte'
import './app.css'
import App from './App.svelte'

const app = mount(App, {
  target: document.getElementById('app')!,
})

export default app


"use strict";
(async function() {
    let content = new FormData();
    content.append('user_id', 'david')
    content.append('note', 'testing testing testing')
    content.append('note_title', 'hello world')
    const response = await fetch("http://localhost:8000/get_user_type", {
      method: "POST",
      body: content,
      headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}
    });
    
})();