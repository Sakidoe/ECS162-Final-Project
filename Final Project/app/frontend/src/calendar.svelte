<script lang="ts">
    import './calendar.css';
  
    let properties = $props();
    let user = properties.user;
    let profile_picture = properties.profile_picture;

    let today = new Date();
    let curDay = today.getDate();
    let month = today.getMonth();
    let year = today.getFullYear();
    let weekday = today.getDay();
    let Months = ["Janurary", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    let monthString = Months[month];

    let current_viewing_day = $state(curDay);
    let current_viewing_month = $state(month);
    let current_viewing_year = $state(year);

    let firstDay = new Date(current_viewing_year, current_viewing_month, 1);
    let firstWeekday = firstDay.getDay();
    let weekdays = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
    let weekdays_spelled_out = ['SUN', 'MON', 'TUES', 'WEDS', 'THURS', 'FRI', 'SAT'];
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
        let numPadding = 7 - chunckedDays.at(-1).length;
        for (let i = 1; i < numPadding + 1; i++) {
            chunckedDays.at(-1).push(i);
        }
    }
    let mainCalendarDays = chunckedDays.slice();
    if (mainCalendarDays.length != 6) {
        let lastDay = mainCalendarDays.at(-1).at(-1);
        if (lastDay == 30 || lastDay == 31 || lastDay == 28) {
            mainCalendarDays.push([1, 2, 3, 4, 5, 6, 7]);
        } else {
            mainCalendarDays.push([lastDay + 1, lastDay + 2, lastDay + 3, lastDay + 4, lastDay + 5, lastDay + 6, lastDay + 7]);
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
        fetch("http://localhost:8000/delete_note", { 
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

    let calendar_view = $state(1);

    let tasks: Record<string, Task>;
    let notes: Record<string, Note>;
    let upcoming = [];
    let loading = $state(true);
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
    
    
    today = new Date();
    let day = today.getDay();
    let weekDates = [];
    for (let i = 0; i < 7; i++) {
        let date = new Date(today);
        date.setDate(today.getDate() - day + i);
        let formatted = `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
        weekDates.push(formatted);
    }

    let times = ['12:00', '1:00', '2:00', '3:00', '4:00', '5:00', '6:00', '7:00', '8:00', '9:00', '10:00', '11:00', '12:00', '1:00', '2:00', '3:00', '4:00', '5:00', '6:00', '7:00', '8:00', '9:00', '10:00', '11:00', '12:00']

    

    function backArrow() {
        if (calendar_view == 1) {
            if (current_viewing_month == 0) {
                current_viewing_month = 11;
                current_viewing_year--;
            } else {
                current_viewing_month--;
            }
        } else if (calendar_view == 2) {
            if (current_viewing_day <= 8) {
                let overflow = current_viewing_day - 7;
                if (current_viewing_month == 4 || current_viewing_month == 6 || current_viewing_month == 7 || current_viewing_month == 9 || current_viewing_month == 11) {
                    current_viewing_month--;
                    current_viewing_day = 30 + overflow;
                } else if (current_viewing_month == 2) {
                    current_viewing_month--;
                    current_viewing_day = 28 + overflow;
                } else if (current_viewing_month == 0) {
                    current_viewing_month = 11;
                    current_viewing_year--;
                    current_viewing_day = 31 + overflow;
                } else {
                    current_viewing_month--;
                    current_viewing_day = 31 + overflow;
                }
            } else {
                current_viewing_day -= 7;
            }
        } else {
            if (current_viewing_day == 1) {
                if (current_viewing_month == 4 || current_viewing_month == 6 || current_viewing_month == 7 || current_viewing_month == 9 || current_viewing_month == 11) {
                    current_viewing_month--;
                    current_viewing_day = 30;
                } else if (current_viewing_month == 2) {
                    current_viewing_month--;
                    current_viewing_day = 28;
                } else if (current_viewing_month == 0) {
                    current_viewing_month = 11;
                    current_viewing_year--;
                    current_viewing_day = 31;
                } else {
                    current_viewing_month--;
                    current_viewing_day = 31;
                }
            } else {
                current_viewing_day--;
            }
        }
    }

    function forwardArrow() {
        if (calendar_view == 1) {
            if (current_viewing_month == 11) {
                current_viewing_month = 0;
                current_viewing_year++;
            } else {
                current_viewing_month++;
            }
        } else if (calendar_view == 2) {
            
        } else {
            if (current_viewing_month == 1 && current_viewing_day == 28) {
                current_viewing_day = 1;
                current_viewing_month++;
            } else if (current_viewing_month == 0 || current_viewing_month == 4 || current_viewing_month == 6 || current_viewing_month == 7 || current_viewing_month == 9) {
                if (current_viewing_day == 31) {
                    current_viewing_day = 1;
                    current_viewing_month++;
                } else {
                    current_viewing_day++;
                }
            } else if (current_viewing_month == 11) {
                if (current_viewing_day == 31) {
                    current_viewing_day = 1;
                    current_viewing_month = 0;
                    current_viewing_year++;
                } else {
                    current_viewing_day++;
                }
            } else {
                if (current_viewing_day == 30) {
                    current_viewing_day = 1;
                    current_viewing_month++;
                } else {
                    current_viewing_day++;
                }
            }
        }
    }

    setup(user);
</script>

<style>

</style>


{#if loading}
    <p>Loading...</p>
{:else}
    <main>
        <div class="calendar">
            <div class="side-bar">
                <div class="name">
                    <img class="profile-picture" src={profile_picture} alt="profile picture from google account"/>
                    <h3 class="user-name">{user}</h3>
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
                    <div class="weeks">
                        {#each week as day}
                            {#if Math.floor(day / 10) == 0}
                                {#if weekIndex >= chunckedDays.length - 1}
                                    <label class="single-digit-day-next-month">{day}</label>
                                {:else}
                                    {#if day == curDay}
                                        <label class="curday-single-digit"><span class="circular-background">{day}</span></label>
                                    {:else}
                                        <label class="single-digit-day">{day}</label>
                                    {/if}
                                {/if}
                            {:else}
                                {#if weekIndex <= 1}
                                    {#if day > 20}
                                        <label class="previous-month-days">{day}</label>
                                    {:else if day == curDay}
                                        <label class="curday"><span class="circular-background">{day}</span></label>
                                    {:else}
                                        <label class="weekday-number">{day}</label>
                                    {/if}
                                {:else}
                                    {#if day == curDay}
                                        <label class="curday">{day}</label>
                                    {:else}
                                        <label class="weekday-number">{day}</label>
                                    {/if}
                                {/if}
                            {/if}
                        {/each}
                        <!-- <br> -->
                        </div>
                    {/each}
                    </div>
                <div class="breakdown">
                    <h3 class="time-breakdown-inside">Time Breakdown</h3>
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
            <div class="main-calendar">
                <div class="calendar-header">
                    <h2>{monthString}, {year}</h2>
                    <button on:click={() => calendar_view = 1}>Month</button>
                    <button on:click={() => calendar_view = 2}>Week</button>
                    <button on:click={() => calendar_view = 3}>Day</button>
                    <button on:click={backArrow}>&lt;</button>
                    <label>Today</label>
                    <button on:click={forwardArrow}>&gt;</button>
                </div>
                {#if calendar_view == 1 || calendar_view == 2}
                    {#each Array(7) as _, index (index)}
                        {#if weekday == index}
                            <div class="week-headings" style="--row_index: {2}; --col_index: {index + 1}; --color: green">
                                <h3>{weekdays_spelled_out[index]}</h3>
                            </div>
                        {:else}
                            <div class="week-headings" style="--row_index: {2}; --col_index: {index + 1}">
                                <h3>{weekdays_spelled_out[index]}</h3>
                            </div>
                        {/if}
                    {/each}
                {/if}
                {#if calendar_view == 1}
                    {#each Array(6) as _, row (row)}
                        {#each Array(7) as _, col (col)}
                            {#if row == 0}
                                {#if mainCalendarDays[row][col] > 8}
                                    <div class="calendar-box" style="--row_index: {row + 3}; --col_index: {col + 1}">
                                        <p class="main-calendar-previous-or-next-month-days">{mainCalendarDays[row][col]}</p>
                                        {#each Object.entries(tasks) as [title, details]}
                                            {#if Number(details.task_date.split('/')[0]) == month && Number(details.task_date.split('/')[1]) == mainCalendarDays[row][col] && Number(details.task_date.split('/')[2]) == year}
                                                <p class="calendar-task-month-page" style="--background_color: {details.task_color}; --text_color: white">{title}</p>
                                            {/if}
                                        {/each}
                                    </div>
                                {:else}
                                    <div class="calendar-box" style="--row_index: {row + 3}; --col_index: {col + 1}">
                                        <p class="main-calendar-days">{mainCalendarDays[row][col]}</p>
                                        {#each Object.entries(tasks) as [title, details]}
                                            {#if Number(details.task_date.split('/')[0]) == month + 1 && Number(details.task_date.split('/')[1]) == mainCalendarDays[row][col] && Number(details.task_date.split('/')[2]) == year}
                                                <p class="calendar-task-month-page" style="--background_color: {details.task_color}; --text_color: white">{title}</p>
                                            {/if}
                                        {/each}
                                    </div>
                                {/if}
                            {:else if row >= 4}
                                    {#if mainCalendarDays[row][col] < 15}
                                        <div class="calendar-box" style="--row_index: {row + 3}; --col_index: {col + 1}">
                                            <p class="main-calendar-previous-or-next-month-days">{mainCalendarDays[row][col]}</p>
                                            {#each Object.entries(tasks) as [title, details]}
                                                {#if Number(details.task_date.split('/')[0]) == month + 2 && Number(details.task_date.split('/')[1]) == mainCalendarDays[row][col] && Number(details.task_date.split('/')[2]) == year}
                                                    <p class="calendar-task-month-page" style="--background_color: {details.task_color}; --text_color: white">{title}</p>
                                                {/if}
                                            {/each}
                                        </div>
                                    {:else}
                                        <div class="calendar-box" style="--row_index: {row + 3}; --col_index: {col + 1}">
                                            <p class="main-calendar-days">{mainCalendarDays[row][col]}</p>
                                            {#each Object.entries(tasks) as [title, details]}
                                                {#if Number(details.task_date.split('/')[0]) == month + 1 && Number(details.task_date.split('/')[1]) == mainCalendarDays[row][col] && Number(details.task_date.split('/')[2]) == year}
                                                    <p class="calendar-task-month-page" style="--background_color: {details.task_color}; --text_color: white">{title}</p>
                                                {/if}
                                            {/each}
                                        </div>
                                    {/if}
                            {:else}
                                <div class="calendar-box" style="--row_index: {row + 3}; --col_index: {col + 1}">
                                    <p class="main-calendar-days">{mainCalendarDays[row][col]}</p>
                                    {#each Object.entries(tasks) as [title, details]}
                                        {#if Number(details.task_date.split('/')[0]) == month + 1 && Number(details.task_date.split('/')[1]) == mainCalendarDays[row][col] && Number(details.task_date.split('/')[2]) == year}
                                            <p class="calendar-task-month-page" style="--background_color: {details.task_color}; --text_color: white">{title}</p>
                                        {/if}
                                    {/each}
                                </div>          
                            {/if}
                        {/each}
                    {/each}
                {:else if calendar_view == 2}
                    <div class="timestamps">
                        {#each times as time, _}
                            <p>{time}</p>
                        {/each}
                    </div>
                    {#each weekDates as week, index}
                        <div class="week-calendar-box" style="--col_index: {index + 2}">
                            <label>{week.split('/')[1]}</label>
                            {#each Object.entries(tasks) as [title, details]}
                                    {#if Number(details.task_date.split('/')[0]) == Number(week.split('/')[0]) && Number(details.task_date.split('/')[1]) == Number(week.split('/')[1]) && Number(details.task_date.split('/')[2]) == Number(week.split('/')[2])}
                                        <div class="day-box" style="--row_start: {details.task_start_time}; --row_end: {details.task_end_time}">
                                            {console.log(details.task_start_time)}
                                            {console.log(details.task_end_time)}
                                            <p class="calendar-task-month-page" style="--background_color: {details.task_color}; --text_color: white">{title}</p>
                                        </div>
                                    {/if}
                            {/each}
                        </div>
                    {/each}
                {:else}
                    <div class="week-headings" style="--row_index: {2}; --col_index: {1}">
                        <h3>{weekdays_spelled_out[weekday]} {curDay}</h3>
                    </div>
                    <div class="day-calendar-box">
                        {#each Object.entries(tasks) as [title, details]}
                            {#if Number(details.task_date.split('/')[0]) == month + 1 && Number(details.task_date.split('/')[1]) == curDay && Number(details.task_date.split('/')[2]) == year}
                                <p class="calendar-task-day-page" style="--background_color: {details.task_color}; --text_color: white">{title}</p>
                            {/if}
                        {/each}
                    </div>
                {/if}
            </div>
        </div>
    </main>
{/if}