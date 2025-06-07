<script lang="ts">
    export let user;
    export let profile_picture;
    let today = new Date();
    let curDay = today.getDate();
    let month = today.getMonth();
    let year = today.getFullYear();
    let weekday = today.getDay();
    let Months = ["Janurary", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    let monthString = Months[month];

    let firstDay = new Date(year, month, 1);
    let firstWeekday = firstDay.getDay();
    let weekdays = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
    let firstWeekdayString = weekdays[firstWeekday];
    let previousMonth = month - 1;
    let previousMonthString = Months[previousMonth];
    let numDaysInPreviousMonth = null;
    if (previousMonth == 0 || previousMonth == 2 || previousMonth == 4 || previousMonth == 6 || previousMonth == 7 || previousMonth == 9 || previousMonth == 11) {
        numDaysInPreviousMonth = 31;
    } else if (previousMonth == 1) {
        numDaysInPreviousMonth = 28;
    } else {
        numDaysInPreviousMonth = 30;
    }

    let numDaysInCurMonth = null;
    if (month == 0 || month == 2 || month == 4 || month == 6 || month == 7 || month == 9 || month == 11) {
        numDaysInCurMonth = 31;
    } else if (month == 1) {
        numDaysInCurMonth = 28;
    } else {
        numDaysInCurMonth = 30;
    }
    let numPaddingDays = 0;
    if (firstWeekday != 0) {
        numPaddingDays = firstWeekday - 1;
    }
    let paddingArray = Array.from({length: numPaddingDays}, (_, i) => numDaysInPreviousMonth - (numPaddingDays - i - 1));
    let daysArray = Array.from({length: numDaysInCurMonth}, (_, i) => i + 1);
    let allDaysArray = [...paddingArray, ...daysArray];
    const chunckedDays = [];
    for (let i = 0; i < allDaysArray.length; i += 7) {
        chunckedDays.push(allDaysArray.slice(i, i + 7));
    }
    if (chunckedDays.at(-1).length < 7) {
        console.log(chunckedDays.at(-1).length);
        let numPadding = 7 - chunckedDays.at(-1).length;
        for (let i = 1; i < numPadding + 1; i++) {
            chunckedDays.at(-1).push(i);
        }
    }


    type Task = {
        task_description: string;
        task_location: string;
        task_color: string;
        task_label: string;
        task_start_time: string;
        task_end_time: string;
        task_date: string;
        task_tags: [];
        task_priority: string;
    };

    type Note = {
        note_description: string;
    }


    async function getTasks(user: string): Promise<Record<string, Task>> {
        return await fetch("http://localhost:8000/get_tasks/" + user, {
            method: "GET",
            headers: {'Content-Type': 'application/json'}
        })
        .then(response => response.json())
        .then(data => {
            return data.tasks;
        })
        .catch(error => {
            console.error("error getting tasks", error);
        });
    }

    async function getNotes(user: string): Promise<Record<string, Note>> {
        return await fetch("http://localhost:8000/get_notes/" + user, {
            method: "GET",
            headers: {'Content-Type': 'application/json'}
        })
        .then(response => response.json())
        .then(data => {
            return data.notes;
        })
        .catch(error => {
            console.error("error getting notes", error);
        });
    }

    function delete_note(note_title: string) {
        const response = fetch("http://localhost:8000/delete_note", { 
            method: "POST", 
            body: JSON.stringify({
                user_id: user, 
                note_title: note_title
            }), 
            headers: {'Content-Type': 'application/json'}
        });
        delete notes[note_title];
        notes = {...notes};
    }

    let tasks: Record<string, Task>;
    let notes: Record<string, Note>;
    let upcoming = [];
    let loading = true;
    let task_tags: Record<string, number> = {};
    let total_tags = 0;
    async function setup(user: string) {
        tasks = await getTasks(user);
        notes = await getNotes(user);
        for (const [taskname, details] of Object.entries(tasks)) {
            let date = details.task_date.split('/');
            if (Number(date[1]) <= curDay + 3 && Number(date[1]) >= curDay) {
                upcoming.push(taskname);
            }
            let tags = details.task_tags;
            for (let i = 0; i < tags.length; i++) {
                if (tags[i] in task_tags) {
                    task_tags[tags[i]] += 1;
                } else {
                    task_tags[tags[i]] = 1;
                }
                total_tags += 1;
            }
        }
        loading = false;
    }
    
    setup(user);
    
</script>

<style>
    .calendar {
        display: grid;
        grid-template-columns: 25vw 75vw;
        height: 100vh;
    }

    .side-bar {
        display: grid;
        grid-template-rows: repeat(5, auto [row-start]);
        background-color: white;
        border: 2px solid black;
    }

    .name {
        grid-row: 1;
        border: 2px solid black;
    }

    .upcoming-events {
        grid-row: 2;
        border: 2px solid black;
    }

    .mini-calendar {
        grid-row: 3;
        border: 2px solid black;
    }

    .breakdown {
        grid-row: 4;
        border: 2px solid black;
    }

    .notes {
        grid-row: 5;
        border: 2px solid black;
    }

    .weekday-label {
        margin-left: 10%;
    }

    .weekday-number {
        margin-left: 9%;
    }

    .curday {
        background-color: blue;
        color: white;
        border-radius: 50%;
        margin-left: 9%;
    }

    .curday-single-digit {
        background-color: blue;
        color: white;
        border-radius: 50%;
        margin-left: 10.7%;
    }

    .single-digit-day {
        margin-left: 10.7%;
    }

    .month-year {
        margin-left: 5%;
    }

    .single-digit-day-next-month {
        color: gray;
        margin-left: 10.7%;
    }

    .profile-picture {
        width: 10%;
        height: auto;
        border-radius: 50%;
    }

    .user-name {
        display: inline;
    }

    .task-name {
        margin-left: 2%;
        font-weight: bold;
        margin-bottom: 0%;
    }

    .due-date {
        margin-left: 5%;
        margin-top: 0%;
    }

</style>


{#if loading}
    <p>Loading...</p>
{:else}
    <main>
        <div class="calendar">
            <div class="side-bar">
                <div class="name">
                    <img class="profile-picture" src={profile_picture}/>
                    <p class="user-name">{user}</p>
                </div>
                <div class="upcoming-events">
                    <h3>Upcoming Events</h3>
                    {#each upcoming as event}
                        <p class="task-name">{event}</p>
                        {#if Number(tasks[event].task_date.split('/')[1]) - curDay == 0}
                            <p class="due-date">Due Today</p>
                        {:else}
                            {#if Number(tasks[event].task_date.split('/')[1]) - curDay == 1}
                                <p class="due-date">Due in {Number(tasks[event].task_date.split('/')[1]) - curDay} day</p>
                            {:else}
                                <p class="due-date">Due in {Number(tasks[event].task_date.split('/')[1]) - curDay} days</p>
                            {/if}
                        {/if}
                    {/each}
                </div>
                <div class="mini-calendar">
                    <h3 class="month-year">{monthString}, {year}</h3>
                    {#each weekdays as day}
                        <label class="weekday-label">{day}</label>
                    {/each}
                    {#each chunckedDays as week, weekIndex}
                        {#each week as day}
                            {#if Math.floor(day / 10) == 0}
                                {#if weekIndex >= chunckedDays.length - 1}
                                    <label class="single-digit-day-next-month">{day}</label>
                                {:else}
                                    {#if day == curDay}
                                        <label class="curday-single-digit">{day}</label>
                                    {:else}
                                        <label class="single-digit-day">{day}</label>
                                    {/if}
                                {/if}
                            {:else}
                                {#if day == curDay}
                                    <label class="curday">{day}</label>
                                {:else}
                                    <label class="weekday-number">{day}</label>
                                {/if}
                            {/if}
                        {/each}
                        <br>
                    {/each}
                </div>
                <div class="breakdown">
                    <h3>Time Breakdown</h3>
                    {#each Object.entries(task_tags) as [tag, num]}
                        <p>{tag}: {num}</p>
                    {/each}
                </div>
                <div class="notes">
                    <h3>Notes</h3>
                    {#each Object.entries(notes) as [title, note]}
                        <h4>{title}:</h4>
                        <p>{note}</p>
                        <button on:click={() => delete_note(title)}>Resolve</button>
                    {/each}
                </div>
            </div>
        </div>
    </main>
{/if}