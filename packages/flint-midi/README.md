# Flint Midi

The Flint Midi package provides support via the Web MIDI API to MIDI control
devices. These devices are extremely useful for providing tactile controls
including audio mixers, light faders, and other special effects.

# flintMidiMappings definition
Below is a sample flintMidiMappings object, for reference
```
  {
    _id: "",
    midiCommand: "", // First byte of a MIDI message
    midiNote: "", // Second byte of a MIDI message

    collection: "", // The collection name
    selector: {}, // The selector used to find the appropriate object
    propertyPath: "", // The property name to select @TODO translate from top-level property to nested property, if needed,
    transform: "", // Name of function to apply to value (both directly and inverse); useful for scaling values or otherwise converting signals to different types
  }
```
