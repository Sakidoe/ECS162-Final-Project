import { mount } from 'svelte'
import './app.css'
import App from './App.svelte'

const app = mount(App, {
  target: document.getElementById('app')!,
})

export default app


"use strict";
(async function() {
    // sample of how to add a note to a specific user's notes collection and retrieve all of a user's notes
    //     const response1 = await fetch("http://localhost:8000/create_note", {
    //       method: "POST",
    //       body: JSON.stringify({
    //         user_id: 'david',
    //         note: 'testing testing testing testing',
    //         note_title: 'hello world'
    //       }),
    //       headers: {'Content-Type': 'application/json'}
    //     });

    //     const notes = await fetch("http://localhost:8000/get_notes/" + 'david', {
    //       method: "GET",
    //       headers: {'Content-Type': 'application/json', 'user_id': 'david'}
    //     })
    //       .then(response => response.json())
    //       .then(data => {
    //         console.log(data);
    //       });

    // // sample of how to add a task to a specific user's tasks collection and retrieve all of a user's tasks
    //   const response2 = await fetch("http://localhost:8000/create_task", {
    //     method: "POST",
    //     body: JSON.stringify({
    //       user_id: 'david',
    //       task_name: 'my first task',
    //       task_description: "this is my first task",
    //       tags: "testing",
    //       priority: "high",
    //       due_date: "Friday"
    //     }),
    //     headers: {'Content-Type': 'application/json'}
    //   });

    //   const tasks = await fetch("http://localhost:8000/get_tasks/" + 'david', {
    //     method: "GET",
    //     headers: {'Content-Type': 'application/json', 'user_id': 'david'}
    //   })
    //     .then(response => response.json())
    //     .then(data => {
    //       console.log(data);
    //     });

    // // sample of how to add a calendar event to a specific user's calendar event collection and retrieve all of a user's calendar events
    //   const response3 = await fetch("http://localhost:8000/create_event", {
    //     method: "POST",
    //     body: JSON.stringify({
    //       user_id: 'david',
    //       event_name: 'my first event',
    //       event_notes: "this is my first event",
    //       event_location: "home",
    //       event_color: "blue",
    //       event_reminder: "yes",
    //       event_label: "work",
    //       event_start_time: "12:30",
    //       event_end_time: "13:30",
    //       event_date: "6/5/2025",
    //       event_guests: "none",
    //     }),
    //     headers: {'Content-Type': 'application/json'}
    //   });

    //   const events = await fetch("http://localhost:8000/get_events/" + 'david', {
    //     method: "GET",
    //     headers: {'Content-Type': 'application/json', 'user_id': 'david'}
    //   })
    //     .then(response => response.json())
    //     .then(data => {
    //       console.log(data);
    //     });

    // // sample of how to add a team task to a specific user's team tasks collection and retrieve all of a user's team tasks
    //   const response4 = await fetch("http://localhost:8000/create_team_task", {
    //     method: "POST",
    //     body: JSON.stringify({
    //       user_id: 'david',
    //       task_name: 'my first team task',
    //       task_description: "this is my first team task",
    //       task_team: "team #1",
    //       task_assignees: ["david roth", "john smith"],
    //       task_priority: "high",
    //       task_due_date: "6/5/2025"
    //     }),
    //     headers: {'Content-Type': 'application/json'}
    //   });

    //   const teams = await fetch("http://localhost:8000/get_teams/" + 'david', {
    //     method: "GET",
    //     headers: {'Content-Type': 'application/json', 'user_id': 'david'}
    //   })
    //     .then(response => response.json())
    //     .then(data => {
    //       console.log(data);
    //     });
})();