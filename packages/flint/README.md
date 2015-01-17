# Flint Core

@TODO - Flesh out functionality in Flint

## Remotes

Remote meteor instances are directly supported in Flint, including in the collections API.

To get the handle of a remote meteor server:

	Flint.remote(remoteName)

This returns a Meteor connection object with all the trimmings, which can be used for subscriptions,
calls, and other odds and ends.

Remotes are set up in settings.json under public.flintRemotes, which should look something like this:

```
{
	"public": {
		"flintRemotes": {
			"remoteKeyName": "http://URL-to-remote.com:3000/"
		}
	}
}
```

## Collections

Collections are accessed through a seamless interface that provisions the collection and retains a reference to it:

	Flint.collection(collectionName[, remoteName])

The collectionName keys the collections anywhere in the application. The optional remoteName corresponds to a 
Flint.remote() key defined in settings.json (see the section on Remotes).