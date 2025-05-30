<script>

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
        padding: 24px;
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
        height: 40%;             
        padding: 16px;
        background-color: lightblue;
        border: none;
        border-radius: 8px;
        box-sizing: border-box;
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
    </div>
</main>