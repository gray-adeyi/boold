<script lang="ts">
import TutorialControls from "$/views/board/tutorial/TutorialControls.svelte";
const totalSteps = 11;
let currentStep = $state(1);

const gotoPreviousStep = () => {
	if (currentStep <= 1) return;
	currentStep--;
};

const gotoNextStep = () => {
	if (currentStep >= totalSteps) return;
	currentStep++;
};

const stepComponentModule = $derived.by(async () => {
	const module = await import(`./steps/TutorialStep${currentStep}.svelte`);
	return module.default;
});
</script>

<dialog class="container">
    <div class="header">
        <h1 class="title">tutorial</h1>
        <button class="close-button"><i class="material-icon">close</i></button>
    </div>
    <div class="main">
        {#await stepComponentModule then StepComponent}
            <StepComponent />
        {/await}
        <TutorialControls
            {currentStep}
            {totalSteps}
            ongotonextstep={gotoNextStep}
            ongotopreviousstep={gotoPreviousStep}
        />
    </div>
</dialog>

<style>
    .container {
        position: absolute;
        min-width: 500px;
        height: 100vh;
        z-index: 1;
        top: 0;
        background: var(--color-app-white);
        color: var(--color-app-black);
        border: none;
        box-shadow: 0 0 20px rgba(0 0 0 / 0.25);
    }

    .header {
        display: flex;
        justify-content: space-between;
        padding-inline: 8px;
        padding-block-start: 15px;
    }
    .title {
        text-align: center;
        text-transform: capitalize;
        width: 100%;
        font-weight: 400;
    }

    .close-button {
        padding: 10px;
        cursor: pointer;
        transform: rotateZ(0deg) scale(1);
        transition: transform 0.2s;
        border: none;
        background: none;
        color: var(--color-app-gray);

        &:hover {
            font-weight: 800;
            transform: rotateZ(90deg) scale(1.2);
        }
    }

    .main {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: space-between;
        height: calc(100% - 62px);
    }
</style>
