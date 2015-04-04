############################################################################
#     Copyright (C) 2014-2015 by Vaughn Iverson
#     job-collection is free software released under the MIT/X11 license.
#     See included LICENSE file for details.
############################################################################

bind_env = (func) ->
  if Meteor.isServer and typeof func is 'function'
    return Meteor.bindEnvironment func, (err) -> throw err
  else
    return func

subWrapper = (sub, func) ->
  (test, onComplete) ->
    if Meteor.isClient
      Deps.autorun () ->
        if sub.ready()
          func test, onComplete
    else
      func test, onComplete

validId = (v) ->
  Match.test(v, Match.OneOf(String, Meteor.Collection.ObjectID))

defaultColl = new JobCollection()

validJobDoc = (d) ->
  Match.test(d, defaultColl.jobDocPattern)

Tinytest.add 'JobCollection default constructor', (test) ->
  test.instanceOf defaultColl, JobCollection, "JobCollection constructor failed"
  test.equal defaultColl.root, 'queue', "default root isn't 'queue'"
  if Meteor.isServer
    test.equal defaultColl.stopped, true, "isn't initially stopped"
    test.equal defaultColl.logStream, null, "Doesn't have a logStream"
    test.instanceOf defaultColl.allows, Object, "allows isn't an object"
    test.equal Object.keys(defaultColl.allows).length, 21, "allows not properly initialized"
    test.instanceOf defaultColl.denys, Object, "denys isn't an object"
    test.equal Object.keys(defaultColl.denys).length, 21, "denys not properly initialized"
  else
    test.equal defaultColl.logConsole, false, "Doesn't have a logConsole"

clientTestColl = new JobCollection 'ClientTest', { idGeneration: 'MONGO' }
serverTestColl = new JobCollection 'ServerTest', { idGeneration: 'STRING' }

# The line below is a regression test for issue #51
dummyTestColl = new JobCollection 'DummyTest', { idGeneration: 'STRING' }

if Meteor.isServer
  remoteTestColl = new JobCollection 'RemoteTest', { idGeneration: 'STRING' }
  remoteTestColl.allow
    admin: () -> true
else
  remoteConnection = DDP.connect 'localhost:3000'
  remoteServerTestColl = new JobCollection 'RemoteTest', { idGeneration: 'STRING', connection: remoteConnection }

testColl = null  # This will be defined differently for client / server

if Meteor.isServer

  clientTestColl.allow
    admin: () -> true

  Tinytest.add 'Set permissions to allow admin on ClientTest', (test) ->
    test.equal clientTestColl.allows.admin[0](), true

  Tinytest.add 'Set polling interval', (test) ->
    interval = clientTestColl.interval
    clientTestColl.promote 250
    test.notEqual interval, clientTestColl.interval, "clientTestColl interval not updated"
    interval = serverTestColl.interval
    serverTestColl.promote 250
    test.notEqual interval, serverTestColl.interval, "serverTestColl interval not updated"

testColl = if Meteor.isClient then clientTestColl else serverTestColl

# Tinytest.addAsync 'Run startJobs on new job collection', (test, onComplete) ->
#   testColl.startJobs (err, res) ->
#     test.fail(err) if err
#     test.equal res, true, "startJobs failed in callback result"
#     if Meteor.isServer
#       test.equal testColl.stopped, false, "startJobs didn't start job collection"
#     onComplete()

Tinytest.addAsync 'Run startJobServer on new job collection', (test, onComplete) ->
  testColl.startJobServer (err, res) ->
    test.fail(err) if err
    test.equal res, true, "startJobServer failed in callback result"
    if Meteor.isServer
      test.equal testColl.stopped, false, "startJobServer didn't start job collection"
    onComplete()

if Meteor.isServer

  Tinytest.addAsync 'Create a server-side job and see that it is added to the collection and runs', (test, onComplete) ->
    jobType = "TestJob_#{Math.round(Math.random()*1000000000)}"
    job = new Job testColl, jobType, { some: 'data' }
    test.ok validJobDoc(job.doc)
    res = job.save()
    test.ok validId(res), "job.save() failed in sync result"
    q = testColl.processJobs jobType, { pollInterval: 250 }, (job, cb) ->
      test.equal job._doc._id, res
      job.done()
      cb()
      q.shutdown { level: 'soft', quiet: true }, () ->
        onComplete()

Tinytest.addAsync 'Create a job and see that it is added to the collection and runs', (test, onComplete) ->
  jobType = "TestJob_#{Math.round(Math.random()*1000000000)}"
  job = new Job testColl, jobType, { some: 'data' }
  test.ok validJobDoc(job.doc)
  job.save (err, res) ->
    test.fail(err) if err
    test.ok validId(res), "job.save() failed in callback result"
    q = testColl.processJobs jobType, { pollInterval: 250 }, (job, cb) ->
      test.equal job._doc._id, res
      job.done()
      cb()
      q.shutdown { level: 'soft', quiet: true }, () ->
        onComplete()

Tinytest.addAsync 'Create a job and then make a new doc with its document', (test, onComplete) ->
  jobType = "TestJob_#{Math.round(Math.random()*1000000000)}"
  job2 = new Job testColl, jobType, { some: 'data' }
  if Meteor.isServer
    job = new Job 'ServerTest', job2.doc
  else
    job = new Job 'ClientTest', job2.doc
  test.ok validJobDoc(job.doc)
  job.save (err, res) ->
    test.fail(err) if err
    test.ok validId(res), "job.save() failed in callback result"
    q = testColl.processJobs jobType, { pollInterval: 250 }, (job, cb) ->
      test.equal job._doc._id, res
      job.done()
      cb()
      q.shutdown { level: 'soft', quiet: true }, () ->
        onComplete()

Tinytest.addAsync 'Dependent jobs run in the correct order', (test, onComplete) ->
  jobType = "TestJob_#{Math.round(Math.random()*1000000000)}"
  job = new Job testColl, jobType, { order: 1 }
  job2 = new Job testColl, jobType, { order: 2 }
  job.save (err, res) ->
    test.fail(err) if err
    test.ok validId(res), "job.save() failed in callback result"
    job2.depends [job]
    job2.save (err, res) ->
      test.fail(err) if err
      test.ok validId(res), "job.save() failed in callback result"
      count = 0
      q = testColl.processJobs jobType, { pollInterval: 250 }, (job, cb) ->
        count++
        test.equal count, job.data.order
        job.done()
        cb()
        if count is 2
          q.shutdown { level: 'soft', quiet: true }, () ->
            onComplete()

Tinytest.addAsync 'Job priority is respected', (test, onComplete) ->
  counter = 0
  jobType = "TestJob_#{Math.round(Math.random()*1000000000)}"
  jobs = []
  jobs[0] = new Job(testColl, jobType, {count: 3}).priority('low')
  jobs[1] = new Job(testColl, jobType, {count: 1}).priority('high')
  jobs[2] = new Job(testColl, jobType, {count: 2})

  jobs[0].save (err, res) ->
    test.fail(err) if err
    test.ok validId(res), "jobs[0].save() failed in callback result"
    jobs[1].save (err, res) ->
      test.fail(err) if err
      test.ok validId(res), "jobs[1].save() failed in callback result"
      jobs[2].save (err, res) ->
        test.fail(err) if err
        test.ok validId(res), "jobs[2].save() failed in callback result"
        q = testColl.processJobs jobType, { pollInterval: 250 }, (job, cb) ->
          counter++
          test.equal job.data.count, counter
          job.done()
          cb()
          if counter is 3
            q.shutdown { level: 'soft', quiet: true }, () ->
              onComplete()

Tinytest.addAsync 'A forever retrying job can be scheduled and run', (test, onComplete) ->
  counter = 0
  jobType = "TestJob_#{Math.round(Math.random()*1000000000)}"
  job = new Job(testColl, jobType, {some: 'data'}).retry({retries: testColl.forever, wait: 0})
  job.save (err, res) ->
    test.fail(err) if err
    test.ok validId(res), "job.save() failed in callback result"
    q = testColl.processJobs jobType, { pollInterval: 250 }, (job, cb) ->
      counter++
      test.equal job.doc._id, res
      if counter < 3
        job.fail('Fail test')
        cb()
      else
        job.fail('Fail test', { fatal: true })
        cb()
        q.shutdown { level: 'soft', quiet: true }, () ->
          onComplete()

Tinytest.addAsync 'Retrying job with exponential backoff', (test, onComplete) ->
  counter = 0
  jobType = "TestJob_#{Math.round(Math.random()*1000000000)}"
  job = new Job(testColl, jobType, {some: 'data'}).retry({retries: 2, wait: 200, backoff: 'exponential'})
  job.save (err, res) ->
    test.fail(err) if err
    test.ok validId(res), "job.save() failed in callback result"
    q = testColl.processJobs jobType, { pollInterval: 250 }, (job, cb) ->
      counter++
      test.equal job.doc._id, res
      if counter < 3
        job.fail('Fail test')
        cb()
      else
        job.fail('Fail test')
        cb()
        q.shutdown { level: 'soft', quiet: true }, () ->
          onComplete()

Tinytest.addAsync 'A forever retrying job with "until"', (test, onComplete) ->
  counter = 0
  jobType = "TestJob_#{Math.round(Math.random()*1000000000)}"
  job = new Job(testColl, jobType, {some: 'data'}).retry({until: new Date(new Date().valueOf() + 1500), wait: 500})
  job.save (err, res) ->
    test.fail(err) if err
    test.ok validId(res), "job.save() failed in callback result"
    q = testColl.processJobs jobType, { pollInterval: 250 }, (job, cb) ->
      counter++
      test.equal job.doc._id, res
      job.fail('Fail test')
      cb()
    Meteor.setTimeout(() ->
      job.refresh () ->
        test.ok job.status is 'failed', "Until didn't cause job to stop retrying"
        q.shutdown { level: 'soft', quiet: true }, () ->
          onComplete()
    ,
      2000
    )

# Tinytest.addAsync 'Run stopJobs on the job collection', (test, onComplete) ->
#   testColl.stopJobs { timeout: 1 }, (err, res) ->
#     test.fail(err) if err
#     test.equal res, true, "stopJobs failed in callback result"
#     if Meteor.isServer
#       test.notEqual testColl.stopped, false, "stopJobs didn't stop job collection"
#     onComplete()

Tinytest.addAsync 'Run shutdownJobServer on the job collection', (test, onComplete) ->
  testColl.shutdownJobServer { timeout: 1 }, (err, res) ->
    test.fail(err) if err
    test.equal res, true, "shutdownJobServer failed in callback result"
    if Meteor.isServer
      test.notEqual testColl.stopped, false, "shutdownJobServer didn't stop job collection"
    onComplete()

if Meteor.isClient

  Tinytest.addAsync 'Run startJobServer on remote job collection', (test, onComplete) ->
    remoteServerTestColl.startJobServer (err, res) ->
      test.fail(err) if err
      test.equal res, true, "startJobServer failed in callback result"
      onComplete()

  Tinytest.addAsync 'Create a job and see that it is added to a remote server collection and runs', (test, onComplete) ->
    jobType = "TestJob_#{Math.round(Math.random()*1000000000)}"
    job = new Job remoteServerTestColl, jobType, { some: 'data' }
    test.ok validJobDoc(job.doc)
    console.log "Job is valid!"
    job.save (err, res) ->
      test.fail(err) if err
      console.log "Job is saved!"
      test.ok validId(res), "job.save() failed in callback result"
      q = remoteServerTestColl.processJobs jobType, { pollInterval: 250 }, (job, cb) ->
        console.log "Job is running!"
        test.equal job._doc._id, res
        job.done()
        cb()
        q.shutdown { level: 'soft', quiet: true }, () ->
          onComplete()

  Tinytest.addAsync 'Run shutdownJobServer on remote job collection', (test, onComplete) ->
    remoteServerTestColl.shutdownJobServer { timeout: 1 }, (err, res) ->
      test.fail(err) if err
      test.equal res, true, "shutdownJobServer failed in callback result"
      onComplete()