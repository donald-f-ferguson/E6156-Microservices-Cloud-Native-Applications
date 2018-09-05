# flaverr

Utility library for JavaScript Errors, stack traces, and omens.

> Take your JavaScript Errors to "flavortown".

## Installation &nbsp; [![NPM version](https://badge.fury.io/js/flaverr.svg)](http://badge.fury.io/js/flaverr)

```bash
$ npm install flaverr
```


## Usage

The most basic usage of `flaverr` is just to call it as a function.

#### Basics

Flavor an Error instance with the specified error code string or dictionary of customizations:

```js
var flaverr = require('flaverr');

var someError = new Error('Whoa whoa whoa!');
//…
someError = flaverr({
  name: 'CompatibilityError',
  code: 'E_WHOA_WHOA_WHOA'
}, someError);
```

- If you provide a string as the first argument, that string will be set as the Error's `code`.
- If you provide a dictionary as the first argument, that dictionary's keys will get folded into the Error as properties.


#### Attach an error code

```javascript
var err = new Error('Could not find user with the specified id.');
err = flaverr('E_NOT_FOUND', err);
// => assert(err.code === 'E_NOT_FOUND' && err.message === 'Could not find user with the specified id.')
// => assert(err.constructor.name === 'Error')
```

#### Attach arbitrary properties

```javascript
var err = flaverr({
  code: 'E_NOT_FOUND',
  raw: { foo: 'bar' }
}, new Error('Could not find user with the specified id.'));
// => assert(err.code === 'E_NOT_FOUND' && err.message === 'Could not find user with the specified id.')
// => assert(err.raw.foo === 'bar')
// => assert(err.constructor.name === 'Error')
```


#### Improve the error message

```javascript
var err = new Error('Could not find user with the specified id.');
err = flaverr({
  name: 'ConsistencyViolation',
  message: 'Logged-in user has gone missing!',
  code: 'E_NOT_FOUND',
  raw: { id: 123 }
}, err);
// => assert(err.code === 'E_NOT_FOUND' && err.message === 'Logged-in user has gone missing!')
// => assert(err.raw.id === 123 && err.name === 'ConsistencyViolation')
// => assert(err.constructor.name === 'Error')
```

#### Build a new Error

```javascript
var err = flaverr({
  name: 'ConsistencyViolation',
  message: 'Logged-in user has gone missing!',
  raw: { id: 123 }
}, err);
// => assert(err.code === 'notFound' && err.message === 'Logged-in user has gone missing!')
// => assert(err.raw.id === 123 && err.name === 'ConsistencyViolation')
// => assert(err.constructor.name === 'Error')
```


## A few examples of common use cases

#### In .intercept()

```javascript
var html = await sails.renderView('emails/email-verify-account', { token: '…' })
.intercept('ENOENT', (err)=>flaverr({
  code: 'E_MISSING_TEMPLATE_OR_LAYOUT',
  message: 'Could not locate either template or layout file on disk.  '+err.message
}));
```


#### In a `try` statement

```javascript
try {
  _.each(paths, function (thisPath) {
    var isDirectory = fs.statFileSync(path.resolve(thisPath)).isDirectory();
    if (!isDirectory) {
      throw flaverr('notADirectory', new Error('One of the provided paths (`'+path.resolve(thisPath)+'`) points to something other than a directory.'));
    }
  });
} catch (e) {
  switch (e.code) {
    case 'ENOENT': return exits.notFound();
    case 'notADirectory': return exits.invalidPath(e);
    default: return exits.error(e);
  }
}
```


#### Tagging an error with a code before sending it through an asynchronous callback

```javascript
if (err) { return done(err); }
if (!user) {
  return done(flaverr('notFound', new Error('Could not find a user with that id (`'+req.param('id')+'`).')));
}
```

#### In a traditional asynchronous loop

> This is less of a thing now that we have async/await!  But still leaving this example here for reference.

```javascript
async.eachSeries(userRecords, function (user, next) {

  if (user.pets.length === 0) {
    return next(flaverr('noPets', new Error('User (`'+user.id+'`) has no pets yet!')));
  }

  if (!user.hobby) {
    return next(flaverr('noHobby', new Error('Consistency violation: User (`'+user.id+'`) has no hobby!')));
  }

  async.each(user.pets, function (pet, next){
    Pet.update().where({ id: pet.id })
    .set({ likelyHobby: user.hobby })
    .exec(next);
  }, function (err){
    if (err) { return next(err); }
    if (err.code === 'E_UNIQUE') { return next(flaverr('nonUniquePetHobby', err)); }
    return next();
  });

}, function afterwards(err) {
  if (err) {
    switch (err.code) {
      case 'noPets': return res.send(409, err.message);
      case 'noHobby': return res.serverError(err);
      case 'nonUniquePetHobby': return res.send(409, 'A pet already exists with that hobby.');
      default: return res.serverError(err);
    }
  }//--•

  return res.ok();
});
```


## Advanced

So, `flaverr()` can be used for more than just flavoring Error instances.

Some of this stuff is pretty low-level, and intended to be used in building higher level libraries (not necessarily from app-level Node.js or browser JavaScript code).

But in the interest of completeness, here's what you can do:


#### flaverr(…, …, caller)

If an optional third argument is passed in, it is understood as the caller-- i.e. the function where you called `flaverr()`.  If provided, this function will be used to improve the stack trace of the provided error.

**This is particularly useful for customizing a stack trace; e.g. for building better omens.**  _By "omen", I mean an Error instance instantiated at an earlier time, so that when you use it at a later time, it has the right stack trace, and hasn't been "cliffed out" at an EventEmitter, setTimeout, setImmediate, etc._

> Note: This is not a particularly speedy operation in JavaScript!  For most usages, it won't matter at all.  But for very hot code paths, or use cases that are highly sensitive to performance, you should consider avoiding this feature-- at least some of the time.
>
> For example, in parts of [Waterline ORM](http://waterlinejs.org) and the [machine runner](http://node-machine.org), this argument is omitted when running in a production environment:
> ```js
> var omen;
> if (process.env.NODE_ENV!=='production' || process.env.DEBUG) {
>   omen = flaverr({}, new Error('omen'), theCurrentFunction);
> }
>
> //…
> ```

In the example above, the stack trace of our omen will be snipped based on the instruction where this was invoked (i.e. whatever called "theCurrentFunction").



#### flaverr.buildOmen()

Build an omen.

> This is just a convenience method.


```javascript
doSomethingThatRandomlyFailsSometimes();
```

```javascript
function doSomethingThatRandomlyFailsSometimes() {
  var omen;
  if (process.env.NODE_ENV !== 'production' || process.env.DEBUG) {
    omen = flaverr.buildOmen(doSomethingThatRandomlyFailsSometimes);
  }

  // …

  if (Math.random() > 0.5) {
    throw flaverr({
      message: 'Wulp, it randomly failed.'
    }, omen);
  }

}
```


#### flaverr.parseError()

There are certain Error-like values (e.g. from the bluebird library) that aren't quite ready to use as normal Errors, but can be easily parsed without being forced to construct a new Error instance or mutating anything.

This method provides a way to normalize errors like that.  If it determines that it cannot, then it just returns undefined.

```js
// …
err = flaverr.parseError(err) || err;

if (_.isError(err)) {
  throw flaverr({
    message: 'Something went wrong in aisle 6: '+err.message
  }, omen);
}
else {
  throw flaverr({
    message: 'Something went wrong in aisle 6: '+util.inspect(err, {depth:5})
  }, omen);
}
```


#### flaverr.parseOrBuildError()

Sometimes, you really want to make sure you have an Error instance, no matter what-- even if you have to construct one!

This method does just that.

```javascript
// …

err = flaverr.parseOrBuildError(err, omen);
throw flaverr({
  message: 'Something went wrong in aisle 6: '+err.message
}, err);
```


#### flaverr.getBareTrace()

Return the bare stack trace of an Error, with the identifying preamble (`.name` + colon + space + `.message`) trimmed off, leaving only the info about stack frames.

This is **particularly useful for including proper context within warning messages**.  (More rarely, it's useful for situations where you want an error to contain more than one trace-- although in that case, it's usually best to store the nested error as a separate property, such as `.raw`.  See `.wrap()` for ideas.)


If you pass in an error, its stack trace will be harvested:

```js
var err = new Error('Some error');

flaverr.getBareTrace(err);
//=>
//'    at repl:1:28\n    at ContextifyScript.Script.runInThisContext (vm.js:44:33)\n    at REPLServer.defaultEval (repl.js:239:29)\n    at bound (domain.js:301:14)\n    at REPLServer.runBound [as eval] (domain.js:314:12)\n    at REPLServer.onLine (repl.js:433:10)\n    at emitOne (events.js:120:20)\n    at REPLServer.emit (events.js:210:7)\n    at REPLServer.Interface._onLine (readline.js:278:10)\n    at REPLServer.Interface._line (readline.js:625:8)'
// ^^^ this is a string
```


If nothing is passed in, a new Error will be instantiated on the fly and its stack will be used:

```js
flaverr.getBareTrace();
//=>
//'    at repl:1:28\n    at ContextifyScript.Script.runInThisContext (vm.js:44:33)\n    at REPLServer.defaultEval (repl.js:239:29)\n    at bound (domain.js:301:14)\n    at REPLServer.runBound [as eval] (domain.js:314:12)\n    at REPLServer.onLine (repl.js:433:10)\n    at emitOne (events.js:120:20)\n    at REPLServer.emit (events.js:210:7)\n    at REPLServer.Interface._onLine (readline.js:278:10)\n    at REPLServer.Interface._line (readline.js:625:8)'
```

If a function is passed in instead of an Error, it is understood to be a "caller" from somewhere on the current call stack.  A new Error will be instantiated instead, and the provided function will be used to align the stack trace of that new Error so that it begins at the point the provided function was called:

```js
function foo() {
  console.log(flaverr.getBareTrace(foo));
}

foo();
//=>
//'    at repl:1:28\n    at ContextifyScript.Script.runInThisContext (vm.js:44:33)\n    at REPLServer.defaultEval (repl.js:239:29)\n    at bound (domain.js:301:14)\n    at REPLServer.runBound [as eval] (domain.js:314:12)\n    at REPLServer.onLine (repl.js:433:10)\n    at emitOne (events.js:120:20)\n    at REPLServer.emit (events.js:210:7)\n    at REPLServer.Interface._onLine (readline.js:278:10)\n    at REPLServer.Interface._line (readline.js:625:8)'
// ^^Note that `foo()` does not appear in the stack trace like it normally would.
```


Finally, to tie that all together, here is a more real-world example lifted straight out of [parley](https://npmjs.com/package/parley):

```javascript
// Implementorland spinlock
if (self._hasFinishedExecuting) {
  console.warn(
    '- - - - - - - - - - - - - - - - - - - - - - - - - - - - - -\n'+
    'WARNING: Something seems to be wrong with this function.\n'+
    'It is trying to signal that it has finished AGAIN, after\n'+
    'already resolving/rejecting once.\n'+
    '(silently ignoring this...)\n'+
    '\n'+
    'To assist you in hunting this down, here is a stack trace:\n'+
    '```\n'+
    flaverr.getBareTrace(self._omen)+'\n'+
    '```\n'+
    '\n'+
    ' [?] For more help, visit https://sailsjs.com/support\n'+
    '- - - - - - - - - - - - - - - - - - - - - - - - - - - - - -'
  );
  return;
}
```

> ##### The second argument to .getBareTrace()
>
> .getBareTrace() also accepts a second argument, `framesToKeep`: the number of frames from the top of the call stack to retain in the output trace.  (i.e. all other stack frames will be trimmed off)
>
> ```js
> //
> var top3StackFrames = flaverr.getBareTrace(self._omen, 3);
> ```
>
> In the general case, without this argument, all frames will be included- up to the JavaScript engine's configured stack trace depth.  **This default behavior is good, and is how you should leave things in the vast majority of cases.**
> Especially never use the second argument unless your code is aware of the source of the error being trimmed, and you're sure that all relevant context will exist in the top _n_ stack frames.
> Proceed at your own risk.  You have been warned!


## Help

If you have a question, need commercial support from the engineers who build Sails, or you just want to talk Sails/Node.js with other folks in the community, click [here](https://sailsjs.com/support).


## Bugs &nbsp; [![NPM version](https://badge.fury.io/js/flaverr.svg)](http://npmjs.com/package/flaverr)

To report a bug, [click here](https://sailsjs.com/bugs).


## Contributing

Please observe the guidelines and conventions laid out in the [Sails project contribution guide](https://sailsjs.com/documentation/contributing) when opening issues or submitting pull requests.

[![NPM](https://nodei.co/npm/flaverr.png?downloads=true)](http://npmjs.com/package/flaverr)

## License

MIT &copy; 2016, 2017 [Mike McNeil](https://twitter.com/mikermcneil)
