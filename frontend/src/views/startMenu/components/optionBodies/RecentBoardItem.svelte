<script lang="ts">
</script>
<li>
    <span class="board-name">My Board</span>
    <span class="board-path">/documents/jigani/my-board.board</span>
    <span class="file-size">300 B</span>
    <div class="actions-container">
        <button class="action-button" title="Rename board"><span class="material-icon">edit</span></button>
        <button class="action-button" title="Delete board"><span class="material-icon">delete</span></button>
    </div>
</li>

<style>
    li{
        display: flex;
        align-items: center;
        gap: 5px;
        cursor: pointer;
        padding: 20px;
        transition: background-color .2s;
        &:hover {
            background-color: var(--color-app-black-alt);
        }
    }

    .board-name{
        font-weight: bold;
        margin-inline-end: 10px;
        min-width: 200px;

    }

    .board-path{
        color: var(--color-app-gray-alt-2);
        margin-inline-end: 30px;
        font-size: 0.9375rem;
    }

    .file-size{
        color: var(--color-app-gray-alt-2);
        margin-inline-end: 30px;
        font-size: 0.9375rem;
    }

    .actions-container{
        display: flex;
        gap: 30px;
    }

    .action-button{
        border: none;
        background: none;
        cursor: pointer;
        /*border: 1px solid black;*/
        /*padding: 20px;*/
    }
</style>