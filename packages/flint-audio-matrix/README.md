# Audio Matrix Features
Ability to control which inputs are routed to a single output
Control volume for each individual input and overall volume of output
This is done through the Aux Send and Group Send functions
When an input is requested for an output, the volume for that input’s Aux or Group Send is brought up to the set level.
When an input is removed, the volume is brought back down to zero
Apply equalizer settings to specific inputs

If we decide we want to go nuts on matrixing inputs/outputs, I’d recommend that create virtual inputs and outputs plus an intersection collection. Each virtual I/O would be backed by an object from the Motu, preferably raw inputs and outputs. As intersections are created, there would be an advanced dependency solver that would determine which inputs to map to a bus, 

For reverb:
1. We set up reverb as its own input and output in Flint
2. Inputs going into reverb are really mixes sending to reverb
3. Outputs going from reverb are treated like a mix going to a bus

Four collections
* AudioMatrix
	* _id
	* URL [string] e.g. http://voyager-audio-core.local
	* Name [string]
	* dspUtilization [integer] // Updated periodically by requesting mix/ctrls/dsp/usage
* AudioMatrixMix
	* _id
	* matrixId [id of AudioMatrix]
	* Name [string]
	* channel [0-47] // Read only
	* gate
		* enable [bool]
		* release [50-2000]
		* threshold [0.0-1.0]
		* attack [10-500] in milliseconds
	* comp
		* enable [bool]
		* release [10-2000] in milliseconds
		* threshold [-40-0] in dB
		* ratio [1-10]
		* attack [10-100] in ms
		* trim [-20-20] in dB
		* peak [0,1| 0 = RMS, 1 = Peak]
	* hpf
		* enable [bool]
		* freq [20-20000]
	* eq
		* highshelf
			* bw [.01-3] octaves
			* enable [bool]
			* freq [20-2000] Hz
			* gain [-20-20] dB
			* mode [0,1 | 0 = shelf, 1 = para]
		* lowshelf [see highshelf]
			* bw
			* enable
			* freq
			* gain
			* mode
		* mid1 [see highshelf]
			* bw
			* enable
			* freq
			* gain
		* mid2 [see highshelf]
			* bw
			* enable
			* freq
			* gain
	* matrix
		* fader [0-4] linear
		* pan [-1-1] 0 is balanced, -1 left, 1 right
		* enable [bool]
		* solo [bool]
		* mute [bool]
* AudioMatrixBus
	* _id
	* matrixId
	* Name
	* channel
	* type [group,aux,main,reverb,monitor]
	* eq
		* highshelf
			* bw [.01-3] octaves
			* enable [bool]
			* freq [20-2000] Hz
			* gain [-20-20] dB
			* mode [0,1 | 0 = shelf, 1 = para]
		* lowshelf [see highshelf]
			* bw
			* enable
			* freq
			* gain
			* mode
		* mid1 [see highshelf]
			* bw
			* enable
			* freq
			* gain
		* mid2 [see highshelf]
			* bw
			* enable
			* freq
			* gain
	* matrix
		* fader
		* enable
		* prefader
		* mute
* AudioMatrixSend
	* _id
	* mixId [ID of mix object]
	* busId [ID of bus object]
	* volume [0-4] linear
	* Mute // This doesn’t actually exist in MOTU, but we use it for toggling inputs without losing the volume setting
