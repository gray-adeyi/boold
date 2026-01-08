<script>
</script>
<ul class="container">
    <li class="menu-item">
        <i class="material-icon">content_copy</i>
        <span class="name">Rotate</span>
        <span class="shortcut">R</span>
    </li>
    <li class="menu-item">
        <i class="material-icon">content_paste</i>
        <span class="name">Set Waypoint</span>
        <span class="shortcut">Shift + S</span>
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
        font-size: 0.9375rem;
        color: var(--color-app-white);
        white-space: nowrap;
        cursor: pointer;

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
    }

    .material-icon{
        color: var(--color-app-gray);
        white-space: nowrap;
    }

    .shortcut{
        color: var(--color-app-gray);
    }
</style>

