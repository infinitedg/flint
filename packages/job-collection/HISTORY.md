## Revision history

### 1.0.0

* `jc.startJobs` and `jc.stopJobs` have been renamed to `jc.startJobServer` and `jc.shutdownJobServer` respectively. The old versions will now generate deprecation warnings.
* `jc.makeJob()` and `jc.createJob()` have been deprecated in favor of just calling `new Job(...)`
* Fixed an issue similar to #51 on the client-side.
* Fixed issue #55. All standard Mongo.Collection options should now work with JobCollections as well.
* Updated versions of package dependencies
* Fixed issue #41. The potential race condition in getWork is handled internally
* Fixed issue #57. Default MongoDB indexes enabled by default
* Fixed issue #55, all valid Mongo.Collection options are now supported. However, transformed documents may fail to validate unless "scrubbed". More work needs to go into documenting this.
* Fixed #28. Eliminated all "success" console logs.
* job objects now have `job.doc` readable attribute
* `jc.jobDocPattern` can now be used to validate Job documents.
* `j.refresh()` is now chainable
* Added `jq.trigger()` method to provide a mechanism to trigger `getWork` using an alternative method to `pollInterval`
* `job.log()` can now accept a `data` option, which must be an object.
* `log.data` field is now permitted in the Job document model.
* When `job.fail(err)` is used, the error object stored in the `failures` array will have the `runId` as an added field.
* `connection` option to `new JobCollection()` on client or server will now direct the local Job Collection to connect to an alternate remote server's Job Collection rather than using the default connection (client) or hosting a collection locally (server).

### 0.0.18

* Fixed issue #51, which caused errors on the server-side when multiple job-collection instances were used.

### 0.0.17

#### Note! There are some breaking changes here!  Specifically, the `job.fail()` change below. See the docs for specifics.

* Added support for Meteor 0.9.x style packages, including name change to accomodate
* `job.fail()` now takes an object for `error`. Previously this was a string message.
* Refactored JobCollection classes
* Jobs that are ready-to-run go straight from `waiting` to `ready` without waiting for a promote cycle to come around.
* Don't check for `after` and `retries` in `getWork()`

#### The following two features are experimental and may change significantly or be eliminated.

* Allow the server to add data to `job._private` that won't be shared with a client via `getWork()` and `getJob()`. Be sure not to publish cursors that return `job._private`!
* Added support for `@scrub` hook function to sanitize documents before validating them in `getWork()` and `getJob()`

### 0.0.16

* Updated to use the latest version of the `meteor-job` npm package

### 0.0.15

* Added `until` option for `job.repeat()`, `job.retry()`, job.restart() and job.rerun().
* Added `jc.foreverDate` to indicate a Date that will never come
* Fixed bug where `jc.forever` was not available
* Default Date for `job.after()` is now based on the server clock, not the clock of the machine creating the job. (thanks @daeq)
* Added `created` field to job document model to keep track of when a job was first created on the server

### 0.0.14

* Added `idGeneration` and `noCollectionSuffix` options to JobCollection constructor. Thanks to @mitar for suggestions.
* Removed unnecessary console log outputs
* Updated README to point to new sample app, and to clarify the use of `jc.promote()` in Meteor multi-instance deployments.

### 0.0.13

* Fixed bugs in client simulations of stopJobs and startJobs DDP methods

### 0.0.12

* Fixed bug due to removal of validNumGTEOne

### 0.0.11

* Fixed bug in jobProgress due to missing validNumGTZero

### 0.0.10

* Changed the default value of `job.save()` `cancelRepeats` option to be `false`.
* Fixed a case where the `echo` options to `job.log()` could be sent to the server, resulting in failure of the operation.
* Documentation improvements courtesy of @dandv.

### 0.0.9

* Added `backoff` option to `job.retry()`. Implements resolves enhancement request [#2](https://github.com/vsivsi/meteor-job-collection/issues/2)

### 0.0.8

* Fixed bug introduced by "integer enforcement" change in v0.0.7. Integers may now be up to 53-bits (the Javascript maxInt). Fixes [#3](https://github.com/vsivsi/meteor-job-collection/issues/3)
* Fixed sort inversion of priority levels in `getWork()`. Fixes [#4](https://github.com/vsivsi/meteor-job-collection/issues/4)
* Thanks to @chhib for reporting the above two issues.

### 0.0.7

* Bumped meteor-job version to 0.0.9, fixing several bugs in Meteor.server and Meteor.client workers handling.
* Corrected validation of jobDocuments for non-negative integer attributes (integer enforcement was missing).
* jc.promote() formerly had a minimum valid polling rate of 1000ms, now any value > 0ms is valid
* Added a few more acceptance tests including client and server scheduling and running of a job.
* Documentation improvements

### 0.0.6

* Added initial testing harness
* Fixed issue with collection root name in DDP method naming.
* Changed evaluation of allow/deny rules so deny rules run first, just like in Meteor.
* Documentation improvements.

### 0.0.5

* Really fixed issue #1, thanks again to @chhib for reporting this.

### 0.0.4

* Test release debugging git submodule issues around issue #1

### 0.0.3

* Fixed issue #1, thanks to @chhib for reporting this.

### 0.0.2

* Documentation improvements
* Removed meteor-job subproject and added npm dependency on it instead

### 0.0.1

* Initial revision.
