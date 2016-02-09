This package is the companion component to the Flint Audio Units application.

The desktop application connects to a Flint server and provides realtime audio
transformation via CoreAudio and Audio Units. Essentially, this package provides
the necessary publications and collections to enable that application to work.

The Flint Audio Units application receives realtime Core Audio configuration
information via DDP from Flint, and translates those messages into node and
engine configurations. This package, therefore, provides the `flintAudioUnits`
publication (taking a parameter for the simulator ID), which includes the
following collections:

  * flintAudioUnitEngine
  * flintAudioUnitNode

# flintAudioUnitEngine
```JSON
{
  "_id": "GUID",
  "name": "Human readable name for UI",
  "input": "UID for Input Device",
  "output": "UID for Output Device",
  "simulatorId":
}
```

# flintAudioUnitNode

```JSON
{
  "name": "AUNewPitch",
  "engineId": "idOfFlintAudioUnitEngine",
  "input": "ID of another node OR ENGINE_INPUT",
  "output": "ID of another node OR  ENGINE_OUTPUT",
  "parameterMapping": {
    "kParameterKeyName": 0
  },

  "kParameterKeyName": "Setting"
}
```
