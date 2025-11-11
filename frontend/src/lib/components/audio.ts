

export function beep(audioContext: AudioContext, frequency: number = 440, duration: number = 500){
 const oscillator = audioContext.createOscillator()
oscillator.type = "sine"
oscillator.frequency.value = frequency
oscillator.connect(audioContext.destination)
oscillator.start(0)
setTimeout(() => oscillator.stop(0), duration)
}