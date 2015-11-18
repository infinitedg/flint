# Flint Lighting Matrix
__Still under active development__  

This package provides Flint with virtual lighting control circuitry. This circuitry essentially enables a simulator have rich reactions to various changes in the data model for the simulator, while still maintaining fine-grained manual controls where appropriate.

An example of a circuit could start with a set of DMX channels linked to a brig force field. This force field's logic involves an on/off switch that turns the brig off or on as a master switch, a dimmer that reacts when the force field monitor (a microcomputer with onboard sensors) is tripped, or when power is taken out of the brig force field. Instead of hand-coding each of these cases, the logic can be visually composed by an administrator, and Flint will transform that logic into sets of reactive observers that compute values along the circuit graph. These values are cached and recomputed as values change throughout the simulation.
