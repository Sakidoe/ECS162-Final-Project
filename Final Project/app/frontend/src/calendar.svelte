<script lang="ts">
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

</style>

<main>
    <div class="calendar">
        <div class="side-bar">
            <div class="name">
                <p>First Name, Last Name</p>
            </div>
            <div class="upcoming-events">
                <p>Upcoming events</p>
            </div>
            <div class="mini-calendar">
                <h3>{monthString}, {year}</h3>
                {#each weekdays as day}
                    <label class="weekday-label">{day}</label>
                {/each}
                {#each chunckedDays as week, weekIndex}
                    {#each week as day}
                        {#if Math.floor(day / 10) == 0}
                            {#if day == curDay}
                                <label class="curday-single-digit">{day}</label>
                            {:else}
                                <label class="single-digit-day">{day}</label>
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
                <p>Time breakdown</p>
            </div>
            <div class="notes">
                <p>Notes</p>
            </div>
        </div>
    </div>
</main>