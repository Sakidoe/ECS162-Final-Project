<script>
    let checked=false;
    let allTags = [
        { name: 'school', checked: false },
        { name: 'work', checked: false },
        { name: 'tag', checked: false },
        { name: 'personal', checked: false },
        { name: 'tag', checked: false },
        { name: 'tag', checked: false }
    ];

    let priorityTags = [
        { name: 'low', checked: false },
        { name: 'medium', checked: false },
        { name: 'high', checked: false }
    ]

    let selectedTags = [];

    let taskName = "";
    let taskDescription = "";
    let dueDate = "";

    let priorityOptions = ['low', 'medium', 'high'];
    let selectedPriority = 'medium'; 

    // 4) Feedback from the server
    let feedback = "";

    // 5) Build payload and POST to Flask when the form is submitted
    async function createTask() {
        // Grab all tag names whose checkbox is checked
        selectedTags = allTags
        .filter((t) => t.checked)
        .map((t) => t.name);

        const payload = {
        user_id:         'david',          // hard‐coded or from a store
        task_name:       taskName,
        task_description: taskDescription,
        tags:             selectedTags,     // send an array of strings
        priority:         selectedPriority, // single string
        due_date:         dueDate           // e.g. "2025-06-15"
        };

        try {
        const res = await fetch("http://localhost:8000/create_task", {
            method:  "POST",
            headers: { "Content-Type": "application/json" },
            body:    JSON.stringify(payload)
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);

        const data = await res.json();
        if (data.success) {
            feedback = "✅ Task created successfully!";
            // Clear everything
            taskName = "";
            taskDescription = "";
            dueDate = "";
            allTags.forEach((t) => (t.checked = false));
            selectedPriority = 'medium';
        } else {
            feedback = "Unexpected response: " + JSON.stringify(data);
        }
        } catch (err) {
        feedback = "Error: " + err.message;
        }
    } 
</script>

<style>
    .background {
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        height: 60vh;
        width: 60%;
        background-color: lightgrey;
        display: flex;
        flex-direction: column;
        padding: 32px;
    }

    .inputBox {
        display: block;
        width: 100%;              
        padding: 16px;
        background-color: #687D31CC;
        border: none;
        border-radius: 8px;
        box-sizing: border-box;
    }
    input::placeholder {
        color: white;          
    }
    input {
        color: white;
    }
    textarea::placeholder {
        color: white;
    }
    .commentBox {
        display: block;
        margin-top: 16px;
        margin-bottom: 16px;
        width: 100%; 
        height: 30%;             
        padding: 16px;
        background-color: #687D31CC;
        border: none;
        border-radius: 8px;
        box-sizing: border-box;
    }

    .tagContainer {
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;
        margin: 16px;
    }
    .tagItem {
        flex: 1;
    }
    .tagLabel{
        margin: 0px;
    }

    .buttonContainer {
        display: flex;
        justify-content: flex-end;
        align-items: center;
        margin-top: 16px;
    }
    .submitButton {
        display: block;
        width: 20%;
        padding: 16px;
        background-color: #687D31CC;
        border: none;
        border-radius: 8px;
        color: white;
        cursor: pointer;
    }
</style>

<main>
    <div class="background">
        <input
            class="inputBox"
            type="text"
            placeholder="enter task name here"
            bind:value={taskName}
            required
        />
        <textarea
            class="commentBox"
            placeholder="enter any comments, or task description"
            bind:value={taskDescription}
            required
        />
        <h3 class="tagLabel">tags:</h3>
        <div class="tagContainer">
            {#each allTags.slice(0,3) as tag}
                <div class="tagItem">
                    <label>
                        <input
                            type="checkbox"
                            bind:checked={tag.checked}
                            on:change={() => {
                                if (tag.checked) {
                                    selectedTags.push(tag.name);
                                } else {
                                    selectedTags = selectedTags.filter(
                                        (t) => t !== tag.name
                                    );
                                }
                            }}
                        />
                        {tag.name}
                    </label>
                </div>
            {/each}
        </div>
        <div class="tagContainer">
            {#each allTags.slice(3) as tag}
                <div class="tagItem">
                    <label>
                        <input
                            type="checkbox"
                            bind:checked={tag.checked}
                            on:change={() => {
                                if (tag.checked) {
                                    selectedTags.push(tag.name);
                                } else {
                                    selectedTags = selectedTags.filter(
                                        (t) => t !== tag.name
                                    );
                                }
                            }}
                        />
                        {tag.name}
                    </label>
                </div>
            {/each}
        </div>
        <h3 class="tagLabel" >priority:</h3>
        <div class="tagContainer">
            {#each priorityTags as tag}
                <div class="tagItem">
                    <label>
                        <input
                            class="tagItem"
                            type="radio"
                            value={tag.name}
                            bind:group={selectedPriority}
                            on:change={() => {
                                if (tag.checked) {
                                    selectedTags.push(tag.name);
                                } else {
                                    selectedTags = selectedTags.filter(
                                        (t) => t !== tag.name
                                    );
                                }
                            }}
                        />
                        {tag.name}
                    </label>
                </div>
            {/each}
        </div>
        <input
            class="inputBox"
            type="date"
            placeholder="enter due date here"
            bind:value={dueDate}
            required
        />
        <div class="buttonContainer">
            <button
                class="submitButton"
                type="button"
                on:click={() => {
                    console.log('Task submitted with tags:', selectedTags);
                    // Here you would typically handle the form submission
                    createTask();
                }}
                disabled={!taskName}
            >
                Submit
            </button>
        </div>
    </div>
</main>