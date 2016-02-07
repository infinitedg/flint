Flint Timelines provide a way to script storylines in advance, simplifying the operation of a simulator for general storytelling purposes while still providing every ounce of power from a Flint-based simulation experience. A timeline is a series of steps in the story, and each step consists of one or more Macros (with some macros actually serving as blanks with only notes attached, e.g. "Send actors to the bridge").

Future developments for the timeline will involve the following:
A timeline is a directed graph of steps in the story, and each step consists of one or more Macros (with some macros actually serving as blanks with only notes attached, e.g. “Send actors to bridge”). As a directed graph, stories or timelines may branch into multiple story paths, join back together at different points, and otherwise direct storylines from point to point to point in an intuitive and understandable way.

# Data Structure
The following data hierarchy exists:

flinttimelines
  - id
  - name

flintsteps
  - id
  - priorStep
  - flinttimeline_id
  - macros[]
    - macroName
    - macroArguments: {
        key: value
      }
