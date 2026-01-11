<script>
</script>
<ul class="container">
    <li class="menu-item">
        <i class="material-icon">content_copy</i>
        <div class="name-and-shortcut-container">
            <span class="name">Rotate</span>
            <span class="shortcut">R</span>
        </div>
    </li>
    <li class="menu-item">
        <i class="material-icon">content_paste</i>
        <div class="name-and-shortcut-container">
            <span class="name">Set Waypoint</span>
            <span class="shortcut">Shift + S</span>
        </div>
    </li>
    <li class="menu-item">
        <i class="material-icon">content_paste</i>
        <div class="name-and-shortcut-container">
            <span class="name">Set Waypoint</span>
            <span class="shortcut">Shift + S</span>
        </div>
    </li>
</ul>

<style>
    .container{
        position: fixed;
        background: var(--color-app-black);
        list-style: none;
        padding: 0;
        margin: 0;
        border-radius: 5px;
        box-shadow: 0 0 10px rgba(0,0,0,.25);
        transition: opacity .2s;


        bottom: 500px;
        left: 400px;
    }

    .menu-item {
        display: flex;
        align-items: center;
        font-size: 0.9375rem;
        color: var(--color-app-white);
        white-space: nowrap;
        cursor: pointer;
        padding: 0.5rem;

        &:hover {
            background: rgba(255 255 255 / .1);

            .material-icon{
                color: var(--color-app-white);
            }
        }

        &:disabled{
            cursor: not-allowed;
            opacity: 0.5;
        }

        &:first-of-type{
            border-start-start-radius: 5px;
            border-start-end-radius: 5px;
        }

        &:last-of-type{
            border-end-start-radius: 5px;
            border-end-end-radius: 5px;
        }
    }

    .name-and-shortcut-container{
        display: flex;
        justify-content: space-between;
        flex: 1;
        align-items: center;
        padding-inline-start: 0.625rem;
    }

    .material-icon{
        color: var(--color-app-gray);
        white-space: nowrap;
    }

    .shortcut{
        color: var(--color-app-gray);
        padding-inline-start: 0.625rem;
    }
</style>

