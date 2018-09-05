parley
=========

Practical, lightweight flow control for Node.js, with support for `await`, deferred execution, traditional Node callbacks, and promise chaining.

> Powered by [bluebird](http://bluebirdjs.com/)

## Usage

These days, there are several different common ways that developers call functions in Node.js and JavaScript.  Parley helps _your code_ support all three of the mainstream flow control paradigms.

Parley helps you write functions that can be called like this:

```javascript
var result = await doStuff(123);
```

Or like this:

```javascript
doStuff(123)
.exec(function (err, result){

});
```

Or even like this:

```javascript
doStuff(123)
.then(function (result){

})
.catch(function(err) {

});
```

> parley functions return a Deferred.  You can also obtain a promise simply by calling [`.toPromise()`](#toPromise).

On top of the basics, parley makes it simple to implement timeouts (userland or implementorland), advanced error negotiation, improved stack traces (through omens), and retries (e.g. exponential backoff).

> For more information on usage, keep reading below.

## About

Parley is brought to you by [the team behind Sails.js](https://sailsjs.com/about), and used internally by the [Sails framework](https://sailsjs.com), [Waterline ORM](http://waterlinejs.org), the [node-machine project](http://node-machine.org), and more.  


## Compatibility

Parley supports Node 8 and up, with backwards-compatibility for Node 6 and Node 4.  (But note that `await` is not supported by Node versions < 7.9.)


## Benchmarks

As of July 3, 2017:

```
  baseline.benchmark.js
  •  •      •       •      •    •    
           •      •              o  
  •    b e n c h m a r k s      •    
   •    (instantiation)       °     
------------------------------------
    parley(handler)
 • just_build#0 x 28,097,782 ops/sec ±1.42% (90 runs sampled)
      ✓ should be performant enough (using benchSync())
    parley(handler).exec(cb)
 • build_AND_exec#0 x 3,185,038 ops/sec ±1.53% (93 runs sampled)
      ✓ should be performant enough (using benchSync())
    parley(handler, undefined, {...})  (w/ 9 custom methods)
 • just_build_with_9_custom_methods#0 x 4,274,101 ops/sec ±1.38% (89 runs sampled)
      ✓ should be performant enough (using benchSync())
    parley(handler, undefined, {...}).exec(cb)   (w/ 9 custom methods)
 • build_AND_exec_with_9_custom_methods#0 x 1,822,064 ops/sec ±1.24% (88 runs sampled)
      ✓ should be performant enough (using benchSync())
    practical benchmark
 • mock "find().exec()"#0 x 34.61 ops/sec ±0.99% (78 runs sampled)
      ✓ should be performant enough when calling fake "find" w/ .exec() (using bench())
 • mock "find(..., explicitCb)"#0 x 35.04 ops/sec ±1.11% (79 runs sampled)
      ✓ should be performant enough when calling NAKED fake "find" (using bench())
 • mock "validate().exec()"#0 x 1,463,995 ops/sec ±1.03% (89 runs sampled)
      ✓ should be performant enough when calling fake "validate" w/ .exec() (using benchSync())
 • mock "validate().exec()"#0 x 1,240,289 ops/sec ±2.69% (94 runs sampled)
      ✓ should be performant enough when calling fake "validate" w/ .exec() + uncaught exception handler (using benchSync())
 • mock "validateButWith9CustomMethods().exec()"#0 x 1,030,355 ops/sec ±2.26% (96 runs sampled)
      ✓ should be performant enough calling fake "validateButWith9CustomMethods" w/ .exec() (using benchSync())
 • mock "validate(..., explicitCb)"#0 x 9,696,815 ops/sec ±2.76% (88 runs sampled)
      ✓ should be performant enough when calling NAKED "validate" (using benchSync())
------------------------------------
  •  •      •       •      •    •    
           •      •              o  
  • < / b e n c h m a r k s >    •    
   •                           °     
                      o°            
```


_Originally, back in January 15, 2017:_

```
    parley(handler)
 • just_build#0 x 18,162,364 ops/sec ±0.98% (90 runs sampled)
      ✓ should be performant enough (using benchSync())
    parley(handler).exec(cb)
 • build_AND_exec#0 x 1,804,891 ops/sec ±1.77% (84 runs sampled)
      ✓ should be performant enough (using benchSync())
    parley(handler, undefined, {...})  (w/ 9 custom methods)
 • just_build_with_9_custom_methods#0 x 3,947,502 ops/sec ±1.62% (90 runs sampled)
      ✓ should be performant enough (using benchSync())
    parley(handler, undefined, {...}).exec(cb)   (w/ 9 custom methods)
 • build_AND_exec_with_9_custom_methods#0 x 1,259,925 ops/sec ±2.08% (76 runs sampled)
      ✓ should be performant enough (using benchSync())
    practical benchmark
 • mock "find().exec()"#0 x 33.69 ops/sec ±0.98% (73 runs sampled)
      ✓ should be performant enough when calling fake "find" w/ .exec() (using bench())
 • mock "find(..., explicitCb)"#0 x 33.93 ops/sec ±0.90% (73 runs sampled)
      ✓ should be performant enough when calling NAKED fake "find" (using bench())
 • mock "validate().exec()"#0 x 789,446 ops/sec ±1.85% (92 runs sampled)
      ✓ should be performant enough when calling fake "validate" w/ .exec() (using benchSync())
 • mock "validateButWith9CustomMethods().exec()"#0 x 686,544 ops/sec ±1.21% (90 runs sampled)
      ✓ should be performant enough calling fake "validateButWith9CustomMethods" w/ .exec() (using benchSync())
 • mock "validate(..., explicitCb)"#0 x 10,157,027 ops/sec ±1.77% (87 runs sampled)
      ✓ should be performant enough when calling NAKED "validate" (using benchSync())
```


## Help

If you have questions or are having trouble, click [here](http://sailsjs.com/support).

If you're in a hurry to use a _parley-enabled API in practice_, it might help to check out a couple of real-world examples:
• [.find()](https://github.com/balderdashy/sails-docs/blob/f4858b0d3c6bb80bc130060ecdd428e735ec111e/reference/waterline/models/find.md)  _(in Sails.js / Waterline ORM)_
• [`.build()`](https://github.com/node-machine/machine/tree/c65d6430d72fa93c794f0f80344665028b94cb0c#callables)  _(in `machine`)_

If you're interested in learning more about this approach to async flow control in general, or considering using parley to support `await`, promises, and traditional Node callbacks _for your own functions_, then keep reading-- there's a whole lot more for you below.

## Bugs &nbsp; [![NPM version](https://badge.fury.io/js/parley.svg)](http://npmjs.com/package/parley)

To report a bug, [click here](http://sailsjs.com/bugs).



## Overview

This section offers a high-level look at how to use parley from both a userland and implementor perspective.  You can also skip ahead to the [API reference below](#api-reference).


### Building a deferred object

Use parley to build a **deferred object**.  This provides access to `.exec()`, `.then()`, `.catch()`, and `.toPromise()`, but you can also attach any extra methods you'd like to add.  (There are also a few extra methods like `.log()` provided automatically as syntactic sugar-- more on that below.)

```javascript
var parley = require('parley');

var deferred = parley(function (done){
  setTimeout(function (){
    if (Math.random() > 0.5) {
      return done(new Error('whoops, unlucky I guess'));
    }
    if (Math.random() > 0.2) {
      return done(undefined, Math.floor(5*Math.random()));
    }
    return done();
  }, 50);
});
```

> For a more complete version of the above example, [click here](https://gist.github.com/mikermcneil/621b55cfc54f133a1db30d7238ca52b1).


### Results

To send back a result value from your handler, specify it as the second argument when invoking `done`.

```javascript
return done(undefined, 'hello world');
```

Depending on how userland code chooses to work with the deferred object, your result will be passed back to userland as either the return value, the second argument to the `.exec()` callback, or as the value resolved from the promise.

```javascript
// Recommended approach   (available in Node.js >= v7.9)
var result = await yourFn();
```

```javascript
// traditional Node-style callback
.exec(function(err, result) {
  // => undefined, 'hello world'
});

// or legacy promise chaining
.then(function(result) {
  // => 'hello world'
});
```


### Errors

To send back an error from your handler, handle it in the conventional Node.js way.

```javascript
return done(new Error('Oops'));
```

Depending on how userland code chooses to work with the deferred object, your error will be passed back to userland as either the first argument to the `.exec()` callback, or as the promise's rejection "reason".

```javascript
// Recommended approach   (available in Node.js >= v7.9)
var result;
try {
  result = await yourFn();
} catch (err) {
  // => [Error: oops]
}
```

```javascript
// traditional Node-style callback
.exec(function(err, result) {
  // => [Error: oops], undefined
});

// or legacy promise-chaining
.catch(function(err) {
  // => [Error: oops]
});
```

#### Custom exceptions

Sometimes, there is one or more "exceptional" exit a function might take, which are fundamentally different than other generic errors that might occur-- for example, consider the difference between a "someone with that username already exists" exception and a bug resulting from a typo, missing dependency, etc.

To make it possible for userland code to negotiate different exits from your function, give your error a `code` property.

```javascript
var x = Math.random();

// Miscellaneous error (no code)
if (x > 1) {
  return done(new Error('Consistency violation: This should never happen.'));
}

var flaverr = require('flaverr');
// Other recognized exceptions
if (x > 0.6) {
  return done(flaverr('E_TOO_BIG', new Error('Oops: too big')));
}
if (x < 0.4) {
  return done(flaverr('E_TOO_SMALL', new Error('Too small -- probably already in use!')))
}
```

#### Negotiating errors

The aforementioned approach makes it easy to negotiate errors in userland.  Whether the userland code is using `await`, a Node-style callback, or promise-chaining, the underlying approach is conceptually the same regardless.

```javascript
// Recommended approach   (available in Node.js >= v7.9)
var result;
try {
  result = await yourFn();
} catch (err) {
  switch(err.code) {
    case 'E_TOO_BIG': return res.status(400).json({ reason: 'Ooh, too bad!  '+err.message });
    case 'E_TOO_SMALL': return res.status(401).json({ reason: 'Please try again later.  '+err.message });
    default:
      console.error('Unexpected error:',err.stack);
      return res.sendStatus(500);
  }
}

// …
```


```javascript
// traditional Node-style callback
.exec(function(err, result) {
  if (err) {
    switch(err.code) {
      case 'E_TOO_BIG': return res.status(400).json({ reason: 'Ooh, too bad!  '+err.message });
      case 'E_TOO_SMALL': return res.status(401).json({ reason: 'Please try again later.  '+err.message });
      default:
        console.error('Unexpected error:',err.stack);
        return res.sendStatus(500);
    }
  }//-•

  // ...
});
```

```Javascript
// or legacy promise-chaining
.then(function (result) {
  // ...
})
.catch({ code: 'E_TOO_BIG' }, function(err) {
  return res.status(400).json({ reason: 'Ooh, too bad!  '+err.message });
})
.catch({ code: 'E_TOO_SMALL' }, function(err) {
  return res.status(401).json({ reason: 'Please try again later.  '+err.message });
})
.catch(function(err) {
  console.error('Unexpected error:',err.stack);
  return res.sendStatus(500);
});
```


#### Handling uncaught exceptions

For a long time, uncaught exceptions were the skeletons in JavaScript's closet.  That's because, out of the box, when using asynchronous callbacks in Node.js, _if the code in your callback throws an uncaught error, the process **will crash!**_

For example, the following code would crash the process:

```javascript
setTimeout(function (){

  // Since this string can't be parsed as JSON, this will throw an error.
  // And since we aren't using try...catch, it will crash the process.
  JSON.parse('who0ps"thisis totally not valid js{}n');

  return res.ok();

}, 50);
```

This behavior leads to stability issues, wasted dev hours, security vulnerabilities, extreme susceptibility to denial-of-service attacks, weeping, crying, moaning, therapist appointments and much wailing and gnashing of teeth.

**But if you're using Node >= v7.9, you're in luck.  [`await`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/await) solves _all_ of these problems.**

> If you're new to Node, congratulations!  You're getting started at _the best possible time_.  It's never been faster, easier, and more secure to build apps with JavaScript.
>
> And for those of us that have been using Node.js for years, these are incredibly exciting times to be a Node.js developer.  As a community, we've finally conquered one of Node's biggest challenges and it's often-quoted only remaining hurdle to adoption: "callback hell".   The callbacks are dead.  Long live `await`!

#### What if I'm stuck with an old version of Node.js?

Well, then buckle up.  

To protect against the problems mentioned above, you'll need to always be sure to use try...catch blocks around any logic
that might throw in an asynchronous, Node-style callback.

For example:

```javascript
setTimeout(function (){

  try {
    JSON.parse('who0ps"thisis totally not valid js{}n');
  } catch (e) { return res.serverError(e); }

  return res.ok();

}, 50);
```

Here are a few common use cases to watch out for:
+ basic JavaScript errors; e.g. syntax issues, or trying to use the dot (.) operator on `null`.
+ trying to JSON.parse() some data that is not a valid, parseable JSON string
+ trying to JSON.stringify() a circular object
+ RPS methods in Sails.js; e.g. `.publish()`, `.subscribe()`, `.unsubscribe()`
+ Waterline's `.validate()` model method
+ Node core's `assert()`
+ most synchronous methods from Node core (e.g. `fs.readFileSync()`)
+ any synchronous machine called with `.execSync()`
+ other synchronous functions from 3rd party libraries


_Note that this is not an issue when using promises, since `.then()` automatically catches uncaught errors
(although there are other considerations when using promises-- for instance, forgetting to use .catch()
each time .then() is used is a common source of hard-to-debug issues, technical debt, and memory leaks.)_


> **EXPERIMENTAL:** As of parley 2.3.x, there is a new, experimental feature that allows you to
> easily provide an extra layer of protection: an optional 2nd argument to `.exec()`.  If specified,
> this function will be used as an uncaught exception handler-- a simple fallback just in case something
> happens to go wrong in your callback function.
>
> This allows you to safely write code like the following without crashing the server:
>
> ```javascript
> User.create({ username: 'foo' }).exec(function (err, result) {
>   if (err) {
>     if (err.code === 'E_UNIQUE') { return res.badRequest('Username already in use.'); }
>     else { return res.serverError(err); }
>   }
>
>   var thisWillNeverWork = JSON.parse('who0ps"thisis totally not valid js{}n');
>
>   return res.json(result);
>
> }, res.serverError);
> ```
>
> Of course, it's still best to be explicit about error handling whenever possible.
> The extra layer of protection is just that-- it's here to help prevent issues
> stemming from the myriad runtime edge cases it's almost impossible to anticipate
> when building a production-ready web application.


#### Tolerating errors

Sometimes, you just don't care.

```javascript
var result = await sails.helpers.fs.readJson('./package.json')
.tolerate('notFound', ()=>{
  return {
    name: 'not-a-real-package',
    description: 'This is not a real package, and I don\'t care.'
  };
});

// Now `result` is either the contents of the real package.json file... or our fake stuff.
```


#### Catching and rethrowing errors

But sometimes, you care a little _too_ much.

```javascript
var result = await sails.helpers.fs.readJson('./package.json')
.intercept('notFound', (err)=>{
  return flaverr({
    message: 'No package.json file could be found in the current working directory.  And I care _very_ much.',
    code: 'E_WHERE_IS_MY_PACKAGE_JSON'
  }, err);
});

// If the package.json file doesn't exist, we will have now thrown a much more useful error.
```



### Flow control

If you're using Node >= v7.9, you're in luck.  With `await`, flow control works just like it does in any other language (with one exception: parallel processing/races.  More on that below.)


##### What if I'm stuck with an old version of Node.js?

Sorry to hear that...  Once again, `await` solves all of these problems too.  It's the biggest boon to JavaScript development since Node.js was released.

But don't worry- this section's for you.  Since Node.js is asynchronous, when using Node < v7.9, seemingly-tricky flow control problems often arise in practical, userland code.  Fortunately, they're easy to solve when equipped with the proper tools and strategies.

> Most of the examples below use simple Node callbacks, but note that many similar affordances are available for promise-chaining -- for example, check out `.toPromise()` ([below](#toPromise)) and `Promise.all()` (in bluebird, or native in ES6, etc.).  The concepts are more or less the same regardless.
>
> _Unless you and the rest of your team are experts with legacy promise-chaining and already have tight, consistently-applied and agreed-upon conventions for how to implement the use cases below, you're probably best off using Node callbacks._

#### Async loops

Using Node >= v7.9?  You can just do a `for` loop.

```javascript
var results = [];
for (let letter of ['a','b','c','d','e','f','g','h','i','j','k','l']) {
  results.push(await doStuff(letter));
}
return res.json(results);
```

But otherwise...


##### What if I'm stuck with an old version of Node.js?

Loop over many asynchronous things, one at a time, using `async.eachSeries()`.

> For this example, make sure you have access to the [`async` library](http://npmjs.com/package/async):
>
>```javascript
>var async = require('async');
>```

```javascript
var results = [];
async.eachSeries(['a','b','c','d','e','f','g','h','i','j','k','l'], function (letter, next) {
  doStuff(letter).exec(function (err, resultForThisLetter){
    if (err) { return next(err); }
    results.push(resultForThisLetter)
    return next();
  });
},
// ~∞%°
function afterwards(err) {
  if (err) {
    console.error(err);
    return res.sendStatus(500);
  }
  return res.json(results);
});
```

#### Async "if"

Using Node >= v7.9?  You can just do an `if` statement.

```javascript
var profileUser = await User.findOne({ id: req.param('id') });
if (!profileUser) { return res.notFound(); }

var loggedInUser;
if (req.session.userId) {
  loggedInUser = await User.findOne({ id: req.session.userId });
}

return res.view('profile', {
  profile: _.omit(profileUser, ['password', 'email']),
  me: loggedInUser ? _.omit(loggedInUser, 'password') : {}
});
```

But otherwise...

##### What if I'm stuck with an old version of Node.js?

Even simple detours and conditionals can sometimes be tricky when things get asynchronous.

Fortunately, relatively concise and robust branching logic can be easily implemented using out-of-the-box JavaScript using this weird trick™.

```javascript
User.findOne({ id: req.param('id') })
.exec(function(err, profileUser) {
  if (err) { return res.serverError(err); }
  if (!profileUser) { return res.notFound(); }

  // If the request came from a logged in user,
  // then fetch that user's record from the database.
  (function(proceed) {
    if (!req.session.userId) {
      return proceed();
    }
    User.findOne({ id: req.session.userId })
    .exec(function (err, loggedInUser) {
      if (err) { return proceed(err); }
      if (!loggedInUser) { return proceed(new Error('Logged-in user ('+req.session.userId+') is missing from the db!')); }
      return proceed(undefined, loggedInUser);
    });

  // ~∞%°
  })(function afterwards(err, loggedInUser){
    if (err) { return res.serverError(err); }

    return res.view('profile', {
      profile: _.omit(profileUser, ['password', 'email']),
      me: loggedInUser ? _.omit(loggedInUser, 'password') : {}
    });

  });
});
```

> [More background on using the if/then/finally pattern for asynchronous flow control](https://gist.github.com/mikermcneil/32391da94cbf212611933fabe88486e3)


#### Async recursion

Using Node >= v7.9?  Recursion is never exactly "fun and easy" (IMO) but with `await`, you can do recursion just like you would with normal, synchronous code (like any other programming language).

In the example below, we demonstrate that, but also take advantage of `.tolerate()` for error negotiation instead of using a try/catch block:

```javascript
#!/usr/bin/env node

var path = require('path');

// Starting from the current working directory, ascend upwards
// looking for a package.json file.  (Keep looking until we hit an error; if so, throw it.)
// Otherwise, if there was no error, we found it!
var nearestPJ = await (async function _recursively(thisDir){
  var pathToCheck = path.resolve(thisDir, 'package.json');
  return await sails.helpers.fs.exists(pathToCheck)
  .tolerate('doesNotExist', async (unusedErr)=>{
    return await _recursively(path.dirname(thisDir));
  }) || pathToCheck;
})(process.cwd());

console.log('Found nearest package.json file at:',nearestPJ);
```



But otherwise...

##### What if I'm stuck with an old version of Node.js?

Much like "if/then/finally" above, the secret to tidy asynchronous recursion is the (notorious) self-calling function.

```javascript
#!/usr/bin/env node

var path = require('path');
var fs = require('fs');

// Starting from the current working directory, ascend upwards
// looking for a package.json file.  (Keep looking until we hit an error.)
(function _recursively(thisDir, done){

  var pathToCheck = path.resolve(thisDir, './package.json');
  fs.stat(pathToCheck, function(err) {
    if (err) {
      switch (err.code) {

        // Not found -- so keep going.
        case 'ENOENT':
          var oneLvlUp = path.dirname(thisDir);
          _recursively(oneLvlUp, function(err, nearestPJ) {
            if (err) { return done(err); }
            return done(undefined, nearestPJ);
          });
          return;

        // Misc. error
        default: return done(err);
      }
    }//-•

    // Otherwise, found it!
    return done(undefined, pathToCheck);

  });//</ fs.exists >

// ~∞%°
})(process.cwd(), function afterwards(err, nearestPJ) {
  if (err) {
    console.error(err);
    return process.exit(1);
  }

  console.log('Found nearest package.json file at:',nearestPJ);

});
```

> [More examples and thoughts on asynchronous recursion](https://gist.github.com/mikermcneil/225198a46317050af1f772296f67e6ce)



#### Parallel processing / "races"

Sometimes, for performance reasons, it's convenient to do more than one thing at the same time.  In many languages, this can be tricky.  But in JavaScript (and thus, in Node.js), this kind of optimization is supported right out of the box.

However, note that this _is_ one area where you can't just use `await`-- you'll need to use either callbacks or promise chaining.

> **When should I optimize my code with parallel processing?**
> 
> It's never worth optimizing until you've hit an _actual_ bottleneck, usually as far as per-user latency (or more rarely, as far as overall scalability).  It's never worth inheriting the complexity of parallel processing until you're 100% sure your performance issue is related to "having to wait for one thing to finish before the next thing can start".  If you're having performance issues for other reasons (e.g. slow SQL queries, slow 3rd party APIs, or a lack of indexes in your Mongo database), this won't help you at all, and like most forms of premature optimization, it'll just make your app more bug-prone, more complicated to understand, and harder to optimize in the future if _real_ performance issues arise.
>
> That said, if you actually need the performance boost from parallel processing, you're in luck:  when Node.js puts its mind to it, the engine can be incredibly fast.

To manage "races" between deferred objects while still performing tasks simultaneously, you can use `async.each()` -- for example, here's the `async.eachSeries()` code from above again, but optimized to run on groups of letters simultaneously, while still processing letters within those groups in sequential order:

```javascript
var results = [];
async.each(['abc','def','ghi','jkl'], function (group, next) {

  var theseLetters = group.split('');
  var resultsForThisGroup = [];
  async.eachSeries(theseLetters, function (letter, next) {
    doStuff(letter).exec(function (err, resultForThisLetter){
      if (err) { return next(err); }
      resultsForThisGroup.push(resultForThisLetter)
      return next();
    });
  },// ~∞%°
  function (err) {
    if (err) { return next(err); }

    resultsForThisGroup.forEach(function(letter){
      results.push(letter);
    });

    return next();
  });

},// ~∞%°
function afterwards(err) {
  if (err) {
    console.error(err);
    return res.sendStatus(500);
  }
  return res.json(results);
});
```

> [More background on asynchronous vs. synchronous flow control in general](https://gist.github.com/mikermcneil/755a2ae7cc62d9a59656ab3ba9076cc1)




## API reference

### Implementor interface

#### parley()

Build and return a deferred object.

As its first argument, expects a function (often called the handler, or more specifically "handleExec") that will run whenever userland code executes the deferred object (e.g. with `await`, `.exec()`, or `.then()`).

```javascript
var deferred = parley(function (done) {
  // • If something goes wrong, call `done(new Error('something went wrong'))`
  // • If everything worked out, and you want to send a result back, call `done(undefined, result);`
  // • Otherwise, if everything worked out but no result is necessary, simply call:
  return done();
});
```

This first argument is mandatory-- it defines what your implementation _actually does_ when the `await` or `.exec()` is triggered.

##### Optional callback
There is also an optional second argument you can use: another function that, if provided, will cause your handler (the first arg) to run _immediately_.

This provides a simple, optimized shortcut for exposing an optional callback to your users.

> Why bother?  Well, for one thing, it's stylistically a good idea to give users a way to call your handler with as little sugar on top as possible.  More rarely, for very performance-sensitive applications, direct callback usage does provide a mild performance benefit.

```javascript
var deferred = parley(function (done){
  // ...
}, optionalCbFromUserland);

// Note: if an optional cb was provided from userland, then parley **will not return anything**.
// In other words:
if (optionalCbFromUserland) {
  assert(deferred === undefined);
}
```

##### Custom methods
The safest way to attach custom methods is by using parley's optional 3rd argument.  The usual approach is for these custom methods to be chainable (i.e. return `this`).

```javascript
var privateMetadata = {};

var deferred = parley(function (done){
  // ...
}, optionalCbFromUserland, {
  someCustomMethod: function(a,b,c){
    privateMetadata = privateMetadata || {};
    privateMetadata.foo = privateMetadata.foo || 1;
    privateMetadata.foo++;
    return deferred;
  }
});
```

> Don't use this approach to define non-functions or overrides with special meaning (e.g. `inspect`, `toString`, or `toJSON`).
> To do that, just set the property directly-- for example:
> ```javascript
> deferred.inspect = function(){ return '[My cool deferred!]'; };
> ```


#### Stack traces

When building asynchronous functions, you're likely to encounter issues with unhelpful stack traces.  There's no _easy_ solution to this problem per se, but over the years, our team has developed a decent approach to solving this problem.  It involves using temporary Error instances known colloquially as "omens":

```javascript
const flaverr = require('flaverr');

// Take a snapshot of the stack trace BEFORE doing anything asynchronous.
var omen = flaverr.omen();

var deferred = parley((done)=>{
  
  // Wait for up to 8 seconds.
  var msToWait = 8 * Math.floor(Math.random()*1000);
  setTimeout(()=>{
    if (Math.random() > 0.5) {
      // Use our "omen" (stack trace snapshot) to "flavor" our actual error.
      return done(flaverr({
        code: 'E_LUCK_RAN_OUT',
        message: 'Too bad, your luck ran out!'
      }, omen));
    }
    else {
      return done();
    }
  }, msToWait);
 
}, optionalCbFromUserland, {
  someCustomMethod: (a,b,c)=>{
    privateMetadata = privateMetadata || {};
    privateMetadata.foo = privateMetadata.foo || 1;
    privateMetadata.foo++;
    return deferred;
  }
}, undefined, omen);
```

Now, when your function gets called, if there's an error, the developer who wrote the relevant code will get an excellent stack trace.


#### Timeouts

Sometimes, it's helpful to automatically time out if execution takes too long.  In parley, Sails, Waterline, and the node-machine project, this is supported right out of the box.

For instance, in the code from the previous example above, the execution of our little function might take anywhere from one or two milliseconds all the way up to 8 entire seconds.  But what if we wanted it to time out after only 2 seconds?  For that, we can use the fourth argument to parley: the timeout.

This should be a number, expressed in milliseconds:

```javascript
// … same code as the example above …

// This time, with a timeout of 2 seconds (2000 milliseconds):
var deferred = parley((done)=>{
  // … same code as the example above …
}, optionalCbFromUserland, {
  … custom methods here …
}, 2000);
```

If the timeout is exceeded, an error is triggered, and any subsequent calls to `done` from your provided custom implementation are ignored.

#### Improving stack traces of built-in errors

For important modules that impact many developers (or for authors that really care about the sanity of their users, and who want to make it easier to debug their code), it is sometimes useful to go so far as improving the stack trace of _even parley's built-in errors_ such as timeouts.  For this, simply use the 5th argument: the "omen".

To stick with our running example:

```javascript
// … same code as the example above …

// Take a snapshot of the stack trace BEFORE doing anything asynchronous.
var omen = new Error('omen');

var deferred = parley((done)=>{
  // … same code as the example above …
}, optionalCbFromUserland, {
  … custom methods here …
}, 2000, omen);
```




### Userland interface

The deferred object returned by `parley()` exposes a few different methods.

#### .exec()

```javascript
parley(function(done){ return done(undefined, 1+1); })
.exec(function (err, result) {
  // => undefined, 2
});
```

```javascript
parley(function(done){ return done(new Error('whoops'), 1+1); })
.exec(function (err, result) {
  // => [Error: whoops], undefined
});
```

#### .then()

```javascript
parley(function(done){ return done(undefined, 1+1); })
.then(function (result) {
  // => 2
});
```

#### .catch()

```javascript
parley(function(done){ return done(new Error('whoops'), 1+1); })
.catch(function (err) {
  // => [Error: whoops]
});
```

#### .toPromise()

```javascript
var promise1 = parley(function(done){ return done(undefined, 1+1); }).toPromise();
var promise2 = parley(function(done){ setTimeout(function(){ return done(); }, 10); }).toPromise();

Promise.all([
  promise1,
  promise2
])
.then(function(result){
  // => [2, undefined]
}).catch(function (err) {

});
```


#### Other methods

Implementors may also choose to attach other methods to the deferred object (e.g. `.where()`).  See "Custom methods" above for more information.


## Contributing &nbsp; [![Master Branch Build Status](https://travis-ci.org/mikermcneil/parley.svg?branch=master)](https://travis-ci.org/mikermcneil/parley) &nbsp; [![Master Branch Build Status (Windows)](https://ci.appveyor.com/api/projects/status/tdu70ax32iymvyq3?svg=true)](https://ci.appveyor.com/project/mikermcneil/parley)

Please observe the guidelines and conventions laid out in the [Sails project contribution guide](http://sailsjs.com/documentation/contributing) when opening issues or submitting pull requests.

[![NPM](https://nodei.co/npm/parley.png?downloads=true)](http://npmjs.com/package/parley)

## Pronunciation

[`/ˈpärlē/`](http://www.macmillandictionary.com/us/pronunciation/american/parley)

> _Rather than picking barley and getting snarly, she decided to `npm install parley` and listen to some Bob Marley._

## License

This package, like the [Sails framework](http://sailsjs.com), is free and open-source under the [MIT License](http://sailsjs.com/license).


