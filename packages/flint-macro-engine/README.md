# Flint Macro Engine

The Flint Macro Engine handles the scheduling and execution of macros, which are basically just
pre-recorded functions. Each macro has a name, a description, a function, and an object which
describes how its arguments are layed out.

# Executing a macro
From the client:

    Flint.macro('macroName', {--argumentObject--})

Arguments are provided as a plain old Javascript object. Macros may only be scheduled from a client
at this time. Moving this implementation to the server would be pretty easy to do as well, however
restricting calls to the client was a design decision since the server already has access to everything
in the system, it was not readily clear how permitting server-side macro calls would necessarily
benefit the organization or cleanliness of the execution environment.

Server-side, macros are executed on the server that has the least load when called, using the 
`flint-server-monitor` package. They are executed immediately upon being received.

If needs be, future implementations could implement a delay or could be set up in a directed
dependency graph so that macros can depend on the execution of prior macros. This is presently
out of scope.

# Registering a Macro
From the server:

    Flint.registerMacro('name', 'string description', { -- argument declaration --}, function(macroArgs) {...});

Note that the macro name is the key and must be globally unique. It is recommended that macro
registrations namespace from the package making the registration, e.g. `flint-audio.playSound` to
prevent name collisions (which will be very obvious when they happen in the server logs).

The argument declaration is described below.

# Argument Declaration

```
{
	argumentName: "Detailed Description of said argument"
}
```

The argument declaration object is useful purely for informational purposes by the user.
Arguments can be listed in any order, since they are provided as an object upon execution.