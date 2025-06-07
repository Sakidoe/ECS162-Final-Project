import { mount } from 'svelte'
import './app.css'
import App from './App.svelte'

const app = mount(App, {
  target: document.getElementById('app')!,
})

export default app


"use strict";
(async function() {
    // // sample of how to add a note to a specific user's notes collection and retrieve all of a user's notes
        // const response1 = await fetch("http://localhost:8000/create_note", {
        //   method: "POST",
        //   body: JSON.stringify({
        //     user_id: 'David Roth',
        //     note: 'testing testing testing testing',
        //     note_title: 'hello world'
        //   }),
        //   headers: {'Content-Type': 'application/json'}
        // });

    //     const notes = await fetch("http://localhost:8000/get_notes/" + 'david', {
    //       method: "GET",
    //       headers: {'Content-Type': 'application/json', 'user_id': 'david'}
    //     })
    //       .then(response => response.json())
    //       .then(data => {
    //         console.log(data);
    //       });

    // // sample of how to add a task to a specific user's tasks collection and retrieve all of a user's tasks
      // const response2 = await fetch("http://localhost:8000/create_task", {
      //   method: "POST",
      //   body: JSON.stringify({
      //     user_id: 'David Roth',
      //     task_name: 'my fifth task',
      //     task_description: "this is my fifth task",
      //     task_location: "home",
      //     task_color: "aqua",
      //     task_label: "work",
      //     task_start_time: "4:30",
      //     task_end_time: "5:30",
      //     task_date: "6/7/2025",
      //     task_tags: ["work"],
      //     task_priority: "high"
      //   }),
      //   headers: {'Content-Type': 'application/json'}
      // });

    //   const tasks = await fetch("http://localhost:8000/get_tasks/" + 'david', {
    //     method: "GET",
    //     headers: {'Content-Type': 'application/json', 'user_id': 'david'}
    //   })
    //     .then(response => response.json())
    //     .then(data => {
    //       console.log(data);
    //     });

    // // sample of how to add a team task to a specific user's team tasks collection and retrieve all of a user's team tasks
    //   const response3 = await fetch("http://localhost:8000/create_team_task", {
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