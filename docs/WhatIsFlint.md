# What is Flint?
Flint is a framework of components built on top of Meteor for operating highly interactive immersive simulations. These components include:
* Simulators
* Stations
* Cards
* Themes & Layouts
* Effects

This document will seek to serve as a starting place for anyone interested in participating in Flint. For clarifications of any jargon, please see the Glossary section. If a given definition is not available, make a request for more information.
## Meteor
For complete documentation about Meteor and its technical specifications, please refer to Meteor.com and the Meteor Docs. This section will focus on aspects of Meteor which directly affect Flint.
#### Packages
Meteor applications use Packages to extend functionality, and to scope modules of functionality within an application (preventing a cluttered namespace and better organization). Flint presently has very little in the root app directory, and as such 99% of content and functionality is deployed
#### Collections
All data for Flint is stored in a single Mongo database in several collections. A collection is like a database table, but instead of being composed of rows and columns, a collection is composed of documents. These documents could all be exactly the same within the collection or they could vary drastically.
Flint has a few key collections which it uses in virtually every deployment:

* Simulators - referring to a simulator set which uses the Flint controls
* Stations - Station documents are children of a simulator (that is, they have a simulator_id key which refers to the simulator which they belong to). They refer to a specific set of controls which are rendered on a client computer (eg. Weapons Officer, or Security Station).
* Systems - Systems on a simulator (such as engines, weapons, or defensive measures). Also children of a simulator.
* Flint Clients - A collection which is auto-populated with information about clients which connect to the Flint server

Collection documents are JSON objects with values attached to keys. An example of a simulator document follows:

```
{
        "name": "USS Voyager",
        "power": 120,
        "coolant": 100,
        "alertCondition": 4,
        "_id": "voyager",
        "layout": "layout_digital",
        "themes": [
            "theme_vanguard_frame",
            ...
        ]
}
```

Notice that the simulator document has information which affects the simulator in general, such as the alertCondition (similar to DEFCON level). It also stores defaults for layout and themes for the individual stations, allowing each simulator to have a different layout and theme. More details about this will be covered in the station section.
Meteor has it’s own way of declaring and accessing collections; Flint simplifies this with a simple api:

```
Flint.collections - returns a list of every Flint collection.
Flint.collection(‘collection name’) - returns the named collection. Collection name does not need to be case sensitive.
```

The collections mentioned above are accessed directly from the Flint namespace and provide an api for accessing and modifying individual keys in a named document:

```
Flint.station(‘voyager’) - returns the ‘voyager’ document
Flint.station(‘voyager’,’alertCondition’) - returns the ‘alertcondition’ key
```

In order for a collection to be accessed on the client, it must be
1. Published by the server
2. Subscribed by the client

@TODO - DESCRIBE PUBLISH AND SUBSCRIBE
#### Session Variables
Session variables contain data exclusive to a client which is cleared when the client webpage refreshes. They are useful for containing session state, but not especially useful for long-term data storage, or data which needs to be communicated between stations. Examples include which card the user is on or state of the specific UI on the specific client (some UI should be reactive between clients running the same card). The syntax is:

```
Session.set(‘variable name’, ‘variable value’);
Session.get(‘variable name’);
```

Usually, it’s good to namespace session variables with the name of the card or even UI element.
#### Blaze/Spacebars
Blaze is an HTML templating and rendering engine for Meteor. It uses a syntax called Spacebars for compiling and composing web page elements. Here’s what the log-in page looks like:

```
<template name="card_login">
  <div class="container">
    <div class="row">
      <div class="col-sm-4 col-sm-offset-4">
        <img class="simLogo" draggable=false src={{loginImage}} />
      </div>
    </div>
    <div class="row">
      <div class="col-sm-6 col-sm-offset-3">
        {{#if client.name}}
        <div class="text-center">
          <h1>{{t "Welcome"}} {{client.name}}</h1>
          <a href="#" class="btn btn-default btn-logout">{{t "Logout"}}</a>
        </div>
        {{else}}
        <div class="login-group">
          <label class="control-label">{{ t "Name" }}</label>
          <input type="text" class="loginname login-input form-control {{alertStyle}}"/>
        </div>
        <button class="btn btn-block {{alertStyle}} btn-login">{{t "Login" }}</button>
        {{/if}}
      </div>
    </div>
  </div>
</template>
```

A few notable elements:
* <template name=”templateName”> - every single thing rendered on the page comes from a template. Templates are either rendered as full-page cards (by giving the name a “card_” prefix) or within other templates using the {{> templateName}} syntax.
* {{helperName}} - helpers are defined for each template in a javascript file and renders whatever the helper function returns. Templates also have a data scope which automatically creates helpers for keys in that data scope object. Helpers can also take parameters, as in {{t “Welcome”}} - the parameters are passed to the javascript controller.
* {{#if}}, {{else}}, {{#each}} - Operate just like their javascript equivalents.

## Simulators
A simulator refers to the primary fictional vessel used in a simulation. It is worth noting that a simulator is not tied to a physical set (ie a simulator could be used in many sets) and a set is bound to the simulator (a set could run multiple simulators during different simulations).
The simulator could be anything from a battleship, a space station, a fighter, a submarine, a miniaturized blood vessel transport unit, a mission control, or a UAV drone control center.
Usually, a set is only one simulator at a time - it does not operate as two simulators simultaneously (although it isn’t necessarily impossible)
## Stations
Stations are the children of simulators, that is they are each assigned a simulator ID. A station’s primary purpose is to contain all of the controls which can and should be displayed on a single (or multiple) client(s).
While stations can contain inheritance override properties (such as themes or layouts), most stations only contain an array of the cards which can be accessed on that station.
## Cards
Cards are the actual front-facing aspect of Flint. Every single control and view is rendered as a card. Cards are Blaze templates (with the “card_” prefix before the name of the card) with the HTML, styles, and Javascript needed to display and operate the card all contained in a single Meteor package.
Card subscribe to, display, and update Flint data. They can be used for in-simulator functions, such as firing weapons, connecting communications, viewing sensors, or displaying a damage report. They can also be used for behind-the-scenes operations, such as controlling the voice distorter, adjusting the lights, or managing assets. All of these things are done with a card.
Cards are not necessarily stored in the database. Rather, (akin to OOP) the card constructor is the template and card instances are stored in an array within Simulator documents.
I already showed a sample card (the login card) above.
There are several special things which are available to cards:
#### ThreeJS Canvas
ThreeJS is a library that makes WebGL (A raw graphics drawing library for 2D and 3D applications that’s modelled after OpenGL) much easier to work with. It includes the ability to create cameras, light sources, meshes, import objects, apply shaders and textures, and more. Flint uses ThreeJS for cards with more advanced graphics requirements, including the Sensors Grid and the Sandbox. See http://threejs.org/ for more information on ThreeJS. For examples of ThreeJS in action within Flint, check out `card-sensor3d`.
#### GSAP
GreenSock Animation Platform (GSAP) is the de-facto Animation library bundled with Flint at this time. It is performant, feature-rich, and handles animations in a way that is both understandable and powerful. The `Flint.tween` API provides the ability to arbitrarily animate any object in the database. This is the preferred method for animation (excluding superfluous animations on a given template that have no bearing on the simulation), as it synchronizes animation state across the simulator to interested parties. See http://greensock.com/gsap for more information about GSAP. For examples of GSAP powering the Flint.
## User Interface Control
#### Themes
Themes provide the basic backbone for applying dynamic styles to a station. Themes are applied hierarchically from the Simulator level down to the station level and even the card level. A station can have multiple themes applied, and can also have specific themes blacklisted to prevent themes from propagating from higher levels (e.g. a Simulator theme may apply to 90% of stations, but a specialized station in a simulator may require a different theme. Higher-level themes can be blacklisted or “restricted” to prevent interference).
#### Layouts
Layouts are modeled around Iron Router’s layout implementation. Layouts provide the chrome or frame within which cards can be rendered, and typically include the name of the simulator and/or station, a menu to choose cards from, and gauges or indicators (most commonly just the current alert condition). Layouts can be defined in a hierarchy from Simulator to Station to Card. More information about Layouts is available in the Flint package.
#### Components
Components are added features to a given simulator, station, or card that provide additional technical capabilities. A component is essentially a template with no content that has onCreated and onDestroyed methods attached to it, and is reactively added or removed based on where the user happens to be working at a station. Although a component can have content, it is not often required, as a component serves to provide additional support for non-visual elements, including sound playback, logging and analytics, and providing hooks to the WebMIDI API. Other potential component uses could include providing code for a hardware driver, speech recognition tools, or initializing a programming object that needs to exist on a specific station.
## Effects
### Lighting/DMX
The physical sets that Flint controls typically include theatrical lighting systems based on the DMX protocol. The DMX protocol is a common system used in theaters around the world of many shapes and sizes, and provides the ability to automate the control of a fleet of lights from a computer or lighting console. Flint uses DMX and a DMX network to control all lighting and smoke effects, and additional effects could easily be added for controlling “exploding” hatches, strobe lights or spark machines, or other effects that would respond best in coordination with lighting or require a simple “on/off” signal or a range of analog values from 0% to 100% intensity.
Flint interfaces with a satellite codebase (flint-dmx) for operating a DMX driver. Flint-dmx directly connects to a Serial/USB DMX device, which serves as the driver for a DMX network. Flint-DMX is also a Meteor project, and is available as a remote (see the package file `flint/remotes.js` and Meteor’s documentation for the `DDP.connect` method at http://docs.meteor.com/#/full/ddp_connect).  The `server/methods.js` file in flint-dmx describes available methods for controlling individual lighting channels.
Flint comes bundled with lighting macros to simplify lighting control, as well as a package (in development) for creating lighting logic circuits that enable rich but straightforward control over a myriad of lighting effects.
### Sound Effects
Sound Effects in Flint are powered by a sophisticated audio engine, flint-audio-engine. This engine enables the scheduling and playback of sound effects anywhere in the ship, using a unified API for dispatching sound events on a local machine (e.g. in response to a button press or other event), to another system, or to an audio matrix channel.
### Audio
The heart of the audio playback system in Flint is a MOTU (or other AVB-compliant) audio interface with a JSON HTTP API. Flint was originally designed to support the 16A device by MOTU (hereafter referred to as the Audio Matrix). The Audio Matrix provides an API-controllable mixing interface, similar to a standard sound board in end result but with support for computers to interact with the system rather than requiring manual manipulation of faders and dials. The Audio Matrix can theoretically scale to hundreds of inputs and outputs distributed across multiple stages or sets (as AVB-compliant devices can connect over their own network segment to stream audio between AVB devices), making it the heart and soul of powerful audio experiences on multiple sets.
The Audio Matrix supports a set of inputs, mixes, and outputs, all of which are computer controllable (including mix levels, volumes, DSP settings, reverb, and routing). An input for a control room microphone could be mixed and output to several output channels, where each channel is a specific audio signal (left, right, subwoofer, center, etc.).
Flint provides an API for manipulating sends (inputs), buses (outputs), and mixes (routes) as database objects, and feeding information from Flint directly back to the MOTU for mixing and control.
### Voice Changer
Flint’s onboard voice changer uses the Web Audio API and JS Workers to take microphone signals, reprocess them for pitch, formant, reverb, mixture, and an optional carrier wave (e.g. “robot” voice that strips out all pitch information), and send that resulting audio to a hardware output (we hope to enable encoding via WebRTC for bridging into AVB or in-browser devices). The Voice Changer currently supports pitch shifting and works best with male input voices. As the JS Workers API and Web Audio API matures, additional support may arrive as well.
### MIDI Control
A MIDI Control surface is a physical interface with faders, dials, buttons, and other physical implements that enables a user to physically manipulate hardware in order to manipulate some setting in software. Flint provides users with the ability to connect a MIDI Controller to a Flint Station (using a component) and the ability to create, edit, and remove mappings between a given MIDI channel and a property of a given database object. This mapping is bidirectional, meaning that a mapping from a fader to the sound volume of an audio channel object in the database will not only update the audio channel volume, but updates to the volume from other places (including source hardware or from elsewhere within Flint like a software GUI control or mute button) will go back to the fader. We recommend using motorized MIDI control surfaces to achieve the best results with Flint and the bi-directional features it supports.
### Specialized Effects (Brig control, etc)
Flint’s foundation, Meteor, provides developers of separate hardware modules with raw tools for interacting with and reacting to Flint as a whole. For example, the Brig of the Voyager is designed to be equipped with a Raspberry Pi that has a “human detector” component installed, intended to detect when the force field is breached. When triggered, the human detector can be read by a JavaScript program (or something in any programming language) running on the Raspberry Pi, which can dispatch events back to Flint via DDP (The protocol Meteor uses to connect clients and servers). Likewise, as a full-scale client over DDP, the Rasberry Pi can listen for changes in publications or collections from Flint and respond accordingly.
### Macros
Macros are bite-sized commands to execute a given action, including toggling lights, fluctuating power, blacking out a station, or otherwise performing literally any command within the system. Macros execute on the server, and therefore can control significantly complex elements within Flint (however most actions are best performed with database operations, as those are automatically propagated across the system). Macros include parameters and can be triggered from a variety of places within Flint, however they find the most value when coupled with the Timeline.
### Timelines
Flint Timelines provide a way to script storylines in advance, simplifying the operation of a simulator for general storytelling purposes while still providing every ounce of power from a Flint-based simulation experience. A timeline is a directed graph of steps in the story, and each step consists of one or more Macros (with some macros actually serving as blanks with only notes attached, e.g. “Send actors to bridge”). As a directed graph, stories or timelines may branch into multiple story paths, join back together at different points, and otherwise direct storylines from point to point to point in an intuitive and understandable way.
### Snapshots
Snapshots serve as saved copies of all simulation data at a point in time, enabling a flight director to quickly and easily return to a given point in the simulation without manually resetting all of the information in the simulation.
## Distributed Workers
Flint includes the excellent vsivsi:job-collection package, which provides the ability to schedule, run, monitor, and complete jobs on distributed clients in a job queue. Distributed workers are an important component of any scalable system, as it enables the master server to offload long-running processes (such as animations or other calculations) to separate hardware with more available resources.

See the package [vsivsi:job-collection](https://github.com/vsivsi/meteor-job-collection) or flint-jobs for more detailed information about use and API, or worker-animation for an example of these packages in action.
## Asset Engine
Flint’s Asset Engine provides a centralized mechanism for accessing images, audio, video, and other binary assets for any part of the simulation. The engine handles determining the proper asset to provide to a client, based on the context the client is operating in. This enables Flint developers to develop a card or component once and for that component to look, feel, and sound differently depending on which simulator or station the card is operating in. As an example, suppose a Login screen has a logo in the middle of the screen, meant to be the ship’s logo or insignia. With the Flint Asset API, that logo can be requested using Flint.a(‘/ship/logo’), and that Flint will return the URL to the Logo that matches the simulation running on that ship. As a reactive data source, it also means that if a change occurs in the configuration of an asset, a simulator, a station, or a card, that the Assets update automatically on screen.
Flint’s Asset Engine is built on top of the fantastic CFS package, enabling Flint to use a variety of data stores for handling content on the backend of Flint. These stores include local file directories, MongoDB GridFS, and Amazon S3 (or an S3 compliant system like Skylable or OpenStack).
## Video Playback
A Space EdVentures Simulation requires rich video playback to provide information and context to participants. Video playback is handled by pushing individual content cards to the main viewscreen. The main viewscreen is a special station that takes published content and automatically arranges it to make the most important content easily viewable by enlarging it, while showing smaller views of less important content on the margins. This design is intended to prevent the use of multiple video sources and an HDMI switcher, or requiring a set to have multiple video outputs available at a given time.
## The Sandbox
Flint includes a rich 3D sandbox built on ThreeJS. “The Sandbox” is essentially a window into the 3D world outside of the simulator, including showing 3D meshes of ships, their position, rotation, their movement, explosions, weapons, planets, nebulas, black holes, and wormhole travel. The sandbox is still under active development, but provides for an extremely high degree of fidelity between the simulation on the set and the perceived simulation outside of the set (without resorting to hollywood effects and clips from movies and other productions).
## Universe Modeling
For 3D rendering of the ship in space, relative to planets, we have to sacrifice reality for effect, or effect for reality in 99% of instances. This fundamental issue revolves around the fact that space is mind-bendingly huge, and animation up-close requires movement on units relative to the object on your 3D canvas (e.g. the ship is measured in meters, not lightyears). Given the limitations of number sizes in Javascript, we have to make some clever adjustments to how we handle the size of the universe.
The current approach we plan on using in Flint is to create “stages”, where stages nest within each other. So, one stage could be the entire universe, measured in lightyears or parsecs. Another stage is a galaxy, which has a relationship to the universe stage (given by its XYZ dimensions in the universe stage’s units of lightyears). Another stage is a quadrant, with a similar relationship to the galaxy, and so on, with the potential to subdivide as needed from the highest to the lowest units (understanding that comparing the position of an atom in one stage with the universe as a whole is going to have a whole lot of rounding error). This enables rough calculations of position on a universal or galactic scale (e.g. for navigation) while still pinpointing our location within a local stage.
A drawback of this approach is inherently that an observer should never be able to reach the edge of the stage they presently occupy. Otherwise, they will either hit a wall, or float off into no-mans land.
An alternative approach is to provide a sandbox in meters as large as possible, set a relative positioning coordinate to provide a sense of place and scale to galactic or regional maps (similar to the stage approach), and then operate within that sandbox entirely, with periodic reconciliation between the relative positioning coordinate and the overall coordinate system used within the smaller-scale system. Essentially, we have a working space with whatever objects we want in them, and as we travel that space we quietly reset the local coordinates for those objects while translating them into global coordinates at all times. In this way, the local space never runs out, objects are still pinned on a global scale, and no one knows the difference. This may still run into issues dealing with hyper-galactic or universal scale coordinates, however it isn’t a bad approach to handling local-scale objects. Objects from a universal coordinate system could be prompted to the flight director, who would be responsible for selecting which objects to place them and where within local coordinate system.

## Flint AI System
## Improvements to Flint
1. Apart from actually finishing flint and getting it running in production, a few thoughts come to mind that would tremendously benefit Flint as a whole:
2. Using React or Web Components instead of Blaze (enabling us to get rid of Session variables)
3. Implementing concepts for tracking a “campaign” (a series of flights), a “flight” (one session in the simulator, perhaps templated from a “story”), multiple simulators joining the same “flight”, separation of concerns for data within a simulator vs without a simulator, perhaps using a “simulator” to mean the real life set, while having a “craft” be an instance of that simulator as applied within a given “flight”, and being able to use templates to drive the creation of campaigns, flights, simulators, crafts, etc.
4. Unit Tests
5. Documentation
6. Deployments via Docker/Containerization
  1. Breaking Flint up into smaller pieces that work together as a framework
  2. Animation engine + fleet of workers
  3. Authentication
  4. Assets
  5. Audio Engine
  6. Lighting control
7. Testing database performance, considering spreading data across specific data stores
  1. MongoDB replaced with RethinkDB for general station/simulator/card, bulk of data
  2. Neo4J for graphs, potentially other data
      * This is particularly interesting, due to Neo4Js graph approach, and how data and data dependencies are at the heart and soul of Flint. The two could be combined
  3. Redis for frequently-accessed data
      * Sensor coordinates
    Power levels
    Anything being animated
  4. ElasticSearch for any large databases for querying
      * This is likely to not be a major issue in the short-term, if Flint ever goes beyond where it’s at now to serve a variety of users and clients and experiences, then having a fast search mechanism wouldn’t be bad.

# Glossary
Flight Director - A Space Center staff member responsible for delivering the entire flight experience to a group of participants. Flight Directors serve as skilled storytellers, special effects technicians, DJs of music, and are the primary users of Flint from behind-the-scenes. Using Flint, Flight directors are able to deliver the full story experience, including playing video, using voices and voice changers, setting up sensor contacts, damaging systems, serving as the voice behind the many characters the participants interact with, and so forth. Comparable to a dungeon or game master in Dungeons and Dragons or other role playing games.
