<script lang="ts">
    type IOSelectOption = {
        displayText: string;
        displayTextTransform: "uppercase" | "capitalize";
        onclick: () => void;
    };
    const options: IOSelectOption[] = [
        {
            displayText: "input",
            displayTextTransform: "capitalize",
            onclick: () => {},
        },
        {
            displayText: "output",
            displayTextTransform: "capitalize",
            onclick: () => {},
        },
        {
            displayText: "button",
            displayTextTransform: "capitalize",
            onclick: () => {},
        },
        {
            displayText: "constant",
            displayTextTransform: "capitalize",
            onclick: () => {},
        },
        {
            displayText: "delay",
            displayTextTransform: "capitalize",
            onclick: () => {},
        },
        {
            displayText: "clock",
            displayTextTransform: "capitalize",
            onclick: () => {},
        },
        {
            displayText: "led",
            displayTextTransform: "uppercase",
            onclick: () => {},
        },
        {
            displayText: "display",
            displayTextTransform: "capitalize",
            onclick: () => {},
        },
        {
            displayText: "debug",
            displayTextTransform: "capitalize",
            onclick: () => {},
        },
        {
            displayText: "beep",
            displayTextTransform: "capitalize",
            onclick: () => {},
        },
        {
            displayText: "counter",
            displayTextTransform: "capitalize",
            onclick: () => {},
        },
        {
            displayText: "timer start",
            displayTextTransform: "capitalize",
            onclick: () => {},
        },
        {
            displayText: "timer end",
            displayTextTransform: "capitalize",
            onclick: () => {},
        },
        {
            displayText: "rom",
            displayTextTransform: "uppercase",
            onclick: () => {},
        },
    ];
</script>

<ul class="container">
    {#each options as option (option.displayText)}
        <li class="io-option">
            <button
                onclick={option.onclick}
                class={[
                    "select-button",
                    {
                        "select-button--text-upper":
                            option.displayTextTransform === "uppercase",
                    },
                ]}>{option.displayText}</button
            >
        </li>
    {/each}
</ul>

<style>
    .container {
        position: absolute;
        bottom: 50px;
        list-style: none;
        font-size: 0.9375rem;
        background: var(--color-app-black);
        color: var(--color-app-white);
        box-shadow: 0 0 20px rgba(0 0 0 / 0.5);
        border-radius: 5px;
        max-height: 300px;
        overflow-y: auto;
        width: 150px;

        &::-webkit-scrollbar-track {
            background: rgba(225 225 225 / 0.1);
        }

        &::-webkit-scrollbar-thumb {
            background: rgba(255 255 255 / 0.3);
            border-radius: 5px;
        }
    }

    .select-button {
        display: block;
        width: 100%;
        padding: 10px;
        cursor: pointer;
        background: none;
        border: none;
        border-radius: 5px;
        color: var(--color-app-white);
        text-align: start;
        text-transform: capitalize;

        &:hover {
            background-color: #222;
        }
    }
    .select-button--text-upper {
        text-transform: uppercase;
    }
</style>
