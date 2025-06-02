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

    let selectedTags = [];
</script>

<style>
    .background {
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        height: 70vh;
        width: 70%;
        background-color: lightgrey;
        display: flex;
        flex-direction: column;
        padding: 48px;
    }

    .inputBox {
        display: block;
        width: 100%;              
        padding: 16px;
        background-color: lightblue;
        border: none;
        border-radius: 8px;
        box-sizing: border-box;
    }
    .commentBox {
        display: block;
        margin-top: 16px;
        width: 100%; 
        height: 30%;             
        padding: 16px;
        background-color: lightblue;
        border: none;
        border-radius: 8px;
        box-sizing: border-box;
    }

    .tagContainer {
        margin:16px;
        padding: 16px;
        display: flex;
        flex-wrap: wrap;
        justify-content:space-between;
    }

</style>

<main>
    <div class="background">
        <input
            class="inputBox"
            type="text"
            placeholder="enter task name here"
            required
        />
        <textarea
            class="commentBox"
            placeholder="enter any comments, or task description"
            required
        />
        <h3>tags:</h3>
        <div class="tagContainer">
            {#each allTags as tag}
                <label>
                    <input
                        class="tagItem"
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
            {/each}
        </div>
        <input
            class="inputBox"
            type="date"
            placeholder="enter due date here"
            required
        />
    </div>
</main>