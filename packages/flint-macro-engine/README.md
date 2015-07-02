# Flint Macro Engine

The Flint Macro Engine handles the scheduling and execution of macros, which are basically just
pre-recorded functions. Each macro has a name, a description, a function, and an object which
describes how its arguments are layed out.

## Executing a macro
From the client:

    Flint.macro('macroName', {--argumentObject--})

Arguments are provided as a plain old Javascript object. Macros may only be scheduled from a client
at this time. Moving this implementation to the server would be pretty easy to do as well, however
restricting calls to the client was a design decision since the server already has access to everything
in the system, it was not readily clear how permitting server-side macro calls would necessarily
benefit the organization or cleanliness of the execution environment.

The macro engine runs atop flint-jobs, which is really vsivsi:job-collection with some extra goodies.
When a macro is called from a client, it is scheduled as a job in a job queue specifically for macros.
In the future, this queue may be split into multiple queues for certain types of macros. For now, however
a general purpose queue is used for processing macros. This queue feeds into workers, where each server is a worker,
and where general purpose worker nodes could be created to support the overall Flint system, where needed.

Macros are typically executed immediately, with allowance for the `_executeDelay` macro property 
in the argument object (see below).

Using the raw Flint.Jobs API, it is possible to construct chains of macros that execute with dependency.
This particular use case, while very powerful, is presently not in scope for the `Flint.macro` function.

## Registering a Macro
Macros must be registered in advance on Flint servers and on any worker nodes that are not Flint core servers.
This registration informs the server how to process a macro, and serves as the heart of the Macro's function.

From the server:

    Flint.registerMacro('name', 'string description', { -- argument declaration --}, function(macroArgs) {...});

Workers may have an alternate implementation, however it is expected that macros execute in the same way regardless 
of the execution environment (server vs. worker).

Note that the macro name is the key and must be globally unique. It is recommended that macro
registrations namespace from the package making the registration, e.g. `flint-audio.playSound` to
prevent name collisions (which will be very obvious when they happen in the server logs).

The argument declaration is described below.

## Argument Declaration

```
{
	argumentName: "Detailed Description of said argument"
}
```

The argument declaration object is useful purely for informational purposes by the user.
Arguments can be listed in any order, since they are provided as an object upon execution.

## Macro Properties

Macro properties may be passed into the Macro function's argument declaration. These properties are
used only by the Macro engine and should not conflict with named arguments for a Macro. Macro properties
are set apart by being prefixed with an underscore.

___executeDelay__

## Flint.Macro under the hood

Flint.macro orchestrates the following functions in sequence:
1. `Flint.Macro.createMacro(name, arguments)` which returns a Job object
2. `macroJob.save()` which actually commits the job and schedules it for execution
