# Flint Audio Engine

The Flint audio engine handles the scheduling, dependency management, and playback of sound effects.

-- We need to decide how audio engine will be useful. It's a bit overwhelming at the moment, mostly because of sound stack requirements.

Sound stacks need:
* Sound looping
* Multiple sounds at once
* Sound cancel
* Sound pause?
* Sound antecedents

-- Do we want to have a sound-stack playback system, and then a client playback system (e.g. beep sounds)?

