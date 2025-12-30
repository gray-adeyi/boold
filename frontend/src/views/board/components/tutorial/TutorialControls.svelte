<script lang="ts">
type Props = {
	currentStep: number;
	totalSteps: number;
	ongotopreviousstep: () => void;
	ongotonextstep: () => void;
};
const { currentStep, totalSteps, ongotopreviousstep, ongotonextstep } =
	$props();

const isPreviousDisabled = $derived(currentStep === 1);
const isNextDisabled = $derived(currentStep === totalSteps);
</script>

<div class="container">
    <button class="step-button" onclick={ongotopreviousstep}
        disabled={isPreviousDisabled}
        ><i class="material-icon step-icon">keyboard_arrow_left</i></button
    >
    <span>{currentStep} / {totalSteps}</span>
    <button class="step-button" onclick={ongotonextstep}
        disabled={isNextDisabled}
        ><i class="material-icon step-icon">keyboard_arrow_right</i></button
    >
</div>

<style>
    .container {
        display: flex;
        gap: 50px;
        align-items: center;
    }

    .step-button {
        color: var(--color-app-gray);
        background: none;
        border: none;
        cursor: pointer;
        
        &:disabled{
            opacity: .5;
            cursor: default;
        }
    }
    .step-icon {
        font-size: 50px;
    }
</style>
