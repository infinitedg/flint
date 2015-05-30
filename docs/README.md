# Flint
Flint is an advanced "edventures"-style simulation framework that supports the following high-level features:
* Multiple simulators in the same framework
* Multiple stations and cards
* Arbitrary card assignments that can update in realtime
* Realtime data sharing across devices
* Federated architecture for supporting satellite devices (e.g. lighting control, Arduino panels, etc.)
* Lighting Control
* Sound Control
* Video Control
* 3D Rendering
* Physics Simulations
* Pre-recorded macros
* Timelines

And more. The above merely scratches the surface.

Flint is flexible enough to provide a system for creating an integrated, distributed, fault-tolerant show-control system that can power lights, sound, video, and take input and provide output to a wide variety of devices.

## Meteor
Flint is built primarily with Meteor, a fullstack javascript framework that consists of backend and frontend technologies for synchronizing data and sending/receiving RPC messages "reactively" or in realtime as data sources change and events are fired. Meteor handles synchronizing client information, speaking with the database, and serving up web content.

Flint extends meteor with a namespace specifically designed for modular content updates in the form of meteor packages. Packages do all the work in Flint, and are built around a core set of packages that provide access to shared collections, logging, and a handful of other basic functions.

## Distributed
Flint is designed to run across a fleet of machines that are horizontally scaled. It is also designed to run on multiple processor cores on the same host using the same technologies that would horizontally scale the same system. For more information on how this works, check out the meteorhacks:cluster package on Atmosphere.

Flint also uses the vsivsi:job-collection package to schedule periodic or long-running processes and to assign different tasks that are long-running and high frequency like animation threads. This component could potentially be broken out into a separate system for better scaling capabilities (instead of spinning up monolithic flint apps, low-overhead specialized worker apps could be deployed instead, making for a more efficient use of resources).

Flint is currently built with MongoDB as the core database service. This may change in the future depending on performance, however Meteor is too valuable by itself to reject simply because Mongo is said to have some warts. At writing, potential alternatives to MongoDB would include RethinkDB, CouchDB, or maybe Redis. A combination of these services could be helpful for future scaling requirements, especially for certain types of workloads (e.g. sensor information is high-write and could be better served with redis).

Flint makes use of a variety of best practices in asset storage and retrieval as well, relying on distributed storage of binary assets like images, sound effects, meshes, and other content in services like S3, OpenStack Swift, or stored within MongoDB itself.

# Package Listing
TODO: Describe packages and their basic functions.

For more information on these packages, check out the README file that should be stored within each package itself.
