# RTTC
Runtime (recursive) type-checking for JavaScript.

This package is the official SDK for working with the RTTC type system.  It includes a lot of methods suitable for everyday use, as well as some lower-level methods that are intended for developers building tools which leverage the [machine specification](http://node-machine.org).

## What is RTTC?

Throwing errors in an asynchronous callback can be [dangerous](http://stackoverflow.com/questions/5999373/how-do-i-prevent-node-js-from-crashing-try-catch-doesnt-work), particularly in Node.js.  Too often, these types of errors and crashes occur because of a trivial mistake or miscommunication about the data type of a variable; particularly when you're working on a team with other developers.

RTTC is a lightweight type system that provides a safety net for JavaScript code. It provides flexible, performant type guarantees on an as-needed basis; without messing with your development stack or build tools. Instead, RTTC builds on top of the existing data structures and programming concepts from JavaScript and Node.js to validate and coerce data _at runtime_.  This allows you to add as much or as little type-checking as you like, in any new _or_ existing Node.js/Sails.js application.

RTTC semantics are used by:
+ the Node-Machine project's core utility packages, including the [`machine` runner](https://github.com/node-machine/machine)
+ the [Sails.js framework core](http://sailsjs.org)
+ every [Waterline driver](https://github.com/node-machine/driver-interface)
+ every [machinepack published on NPM](http://node-machine.org/machinepacks), and
+ the [Treeline](https://treeline.io) standard library


## Installation

```sh
$ npm install rttc --save
```

## Basic Usage

```javascript
var rttc = require('rttc');
```

The `rttc` package has many different methods for working with fixtures, examples, type schemas, and runtime data in JavaScript.  But the most commonly-used RTTC methods are related to validation and coercion of runtime data:

```javascript
// If the value is valid vs. the specified type schema, then `.validateStrict()` simply returns undefined
rttc.validateStrict('number', 999);
// => undefined

// But if the provided value is **even slightly off**, then `.validateStrict()` throws.
rttc.validateStrict('number', '999');
// throws Error

// If the provided value is close-ish, `.validate()` coerces as needed to make it fit.
rttc.validate('number', '999');
// => 999

// But when confronted with **major** differences, `.validate()` throws too.
rttc.validate('number', { x: 32, y: 79 });
// throws Error

// As long as the provided type schema is valid, `.coerce()` **never** throws
rttc.coerce('number', '999');
// => 999

// When confronted with **major** differences, `.coerce()` returns the _base value_ for the given type
rttc.coerce('number', { x: 32, y: 79 });
// => 0
```

Unless otherwise stated, all RTTC methods support recursive (or "deep") traversal of values.
In other words, they iterate over the keys of **dictionaries** (aka plain old JavaScript
objects) and the indices of **arrays**-- and if those dictionary properties and array items
are _themselves_ dictionaries or arrays, then `rttc` recursively dives into them too (and
so on and so forth).


For example:
```javascript
rttc.coerce([ { name: 'string', age: 'number', friends: [ 'string' ] } ], [
  { name: 'Karl', age: 258 },
  { name: 'Samantha', age: '937' },
  { name: 'Lupé', age: 82, friends: ['Henry', 'Mario', undefined] },
  { name: 'Andres', age: '22' },
  { age: ['nonsense!'] }
]);
// => [
//  { name: 'Karl', age: 258, friends: [] },
//  { name: 'Samantha', age: 937, friends: [] },
//  { name: 'Lupé', age: 82, friends: ['Henry', 'Mario'] },
//  { name: 'Andres', age: 22, friends: [] },
//  { name: '', age: 0, friends: [] },
// ]
//
```

#### Next Steps

For a quick rundown of common use cases, as well as some additional examples, check out [the RTTC quick start guide](https://gist.github.com/mikermcneil/8d20ba78b248ac9f5644fcdd0bb96b74).  Keep reading for a brief overview of how RTTC works and a tour of each of its data types.  Or, if this isn't your first rodeo, feel free to skip ahead to the complete [reference documentation](https://github.com/node-machine/rttc#methods) below.


&nbsp;
&nbsp;

## Types &amp; Exemplars

There are 10 different types recognized by `rttc`, each of which is uniquely expressed by special notation called **RTTC exemplar syntax**. For example, if we were to interpret `'hello world'` as an **exemplar**, we would be able to infer that it represents a string data type. Exemplars make it easier to write out intricate data structures and validation rules, because they allow us to reason about our data types using representative _examples_.  Plus, when working with exemplars programatically, you have access to a much richer set of information about any given API.  But most importantly: writing data types as examples makes it easier for other _humans_ to read and understand our intentions.

Exemplars can be mixed and matched with varying levels of specificity, up to any imaginable depth, by using the recursive
array and faceted dictionary types. For example, we can infer from the exemplar `['Rover']` that its **type schema** is `['string']`,
indicating that it accepts any array of strings.  Similarly, given the exemplar `[{ name: 'Rover' }]`, we can infer the type schema
`[{name: 'string'}]`.  This indicates that it accepts any array of dictionaries, so long as each of those dictionaries has a
key called `name` with any string value.

The table below gives each of the RTTC types, the exemplar notation used to describe it, as well as its _base value_:

| type                    | rttc exemplar syntax     | type schema     | base value                          |
|:------------------------|:-------------------------|:----------------|:-------------------|
| string                  | `'any string like this'` | `'string'`      | `''`
| number                  | `1337` _(any number)_    | `'number'`      | `0`
| boolean                 | `false` _(or `true`)_    | `'boolean'`     | `false`
| lamda (aka function)    | `'->'`                   | `'lamda'`       | `function () { throw new Error('Not implemented! (this function was automatically created by `rttc`'); };`
| generic dictionary      | `{}`                     | `{}`            | `{}` _(empty dictionary)_
| json                    | `'*'`                    | `'json'`        | `null`
| ref                     | `'==='`                  | `'ref'`         | `null`
| faceted dictionary  _(recursive, w/ keys called "facets")_  | `{...}` _(i.e. w/ facet:nested-exemplar pairs)_  | `{...}` _(i.e. w/ facet:nested-type-schema pairs)_   | `{...}` _(w/ facet:nested-base-value pairs)_
| array _(recursive, w/ 1 item called the "pattern")_         | `[...]` _(i.e. w/ pattern exemplar)_ | `[...]` _(i.e. w/ pattern type schema)_ | `[]` _(empty array)_


A type's "base value" is its minimum empty state. When coercing some data vs. an exemplar, if coercion fails
at a particular path within that exemplar, then the "base value" for the type will be used at that path instead.
For example, if you are coercing the value `{name:'Lynda'}` vs. the exemplar `{name: 'Angela', age: 47}`, then
the result would be `{name: 'Lynda', age: 0}` (because the base value for the number type is zero).



> ##### Compatibility Note
> RTTC also supports an 11th type, sometimes called the "generic array" and represented by the exemplar (`[]`).
> However, if an exemplar is specified as `[]`, it is really just an alias for `['*']`, an array
> exemplar with a `*` (json) pattern.  That means it accepts any array of JSON-compatible items.
>
> The `[]` alias is for consistency with the generic dictionary type (`{}`), as well as for backwards compatibility.
> While future versions of RTTC will likely continue to maintain support for the `[]` exemplar, for clarity, you should
> switch to using `['*']` in new code and documentation and migrate `[]` to `['*']` in existing code at your earliest convenience.



## Strings

| Exemplar               | RTTC Display Type      | Display Type Label            | Base Value   |
|:-----------------------|:-----------------------|:------------------------------|:-------------|
| `'foo'` _(any string)_ | `'string'`             | `'String'`                    | `''`         |

The **string** type accepts any string.



## Numbers

| Exemplar               | RTTC Display Type      | Display Type Label            | Base Value   |
|:-----------------------|:-----------------------|:------------------------------|:-------------|
| `32` _(any number)_    | `'number'`             | `'Number'`                    | `0`          |

The **number** type accepts integers and decimal numbers like `0`, `-4`, or `235.3`.  Number-ish  properties like `Infinity`, `-Infinity` and `NaN` (as well as `-0`) are all coerced to zero.

## Booleans

| Exemplar               | RTTC Display Type      | Display Type Label            | Base Value   |
|:-----------------------|:-----------------------|:------------------------------|:-------------|
| `true` _(or `false`)_  | `'boolean'`            | `'Boolean'`                   | `false`      |

The **boolean** type accepts `true` or `false`.


## Functions (aka "lamdas")

| Exemplar               | RTTC Display Type      | Display Type Label            | Base Value     |
|:-----------------------|:-----------------------|:------------------------------|:---------------|
| `'->'`                 | `'lamda'`              | `'Function'`                  | _(see below)_  |


The **lamda** type accepts any function.


#### Base Value

The base value for the lamda type is the following automatically-generated function:

```js
function () {
  throw new Error('Not implemented! (this function was automatically created by `rttc`');
};
```




## Generic dictionaries

| Exemplar               | Type Schema | RTTC Display Type      | Display Type Label            | Base Value                  |
|:-----------------------|:------------|:-----------------------|:------------------------------|:----------------------------|
| `{}`                   | `{}`        | `'dictionary'`         | `'Dictionary'`                | `{}` _(empty dictionary)_   |

The **generic dictionary** type accepts any JSON-serializable dictionary.

Dictionaries that have been validated/coerced against the generic dictionary type:
+ will have no prototypal properties, getters, or setters, as well as a complete deficit of any other sort of dark magic
+ are guaranteed to be JSON-serializable, with a few additional affordances:
  + normally, `Error` instances get stringified into empty objects.  Instead, rttc turns them into human-readable strings by reducing them to their `.stack` property (this includes the error message and the stack trace w/ line numbers)
  + normally, `RegExp` instances get stringified into empty objects.  Instead, rttc turns them into human-readable strings like `'/some regexp/gi'`
  + normally, `function()` instances get stringified into empty objects.  Instead, rttc turns them into human-readable strings like `'function doStuff (a,b) { console.log(\'wow I can actually read this!\'); }'`
+ keys with undefined values at any level will be stripped out
+ undefined items in nested arrays will be stripped out
+ keys with null values may be present
+ null items in nested arrays may be present


#### What about keys with `undefined` values?

When validating or coercing a value vs. a generic dictionary exemplar or type schema, keys with `undefined` values _will always be stripped out_.  For example, coercing `{ name: 'Rob', age: undefined, weight: undefined }` vs. the type schema `{}` would result in `{ name: 'Rob' }`. This ensures consistency with the behavior of the native JSON.stringify() and JSON.parse() methods in browser-side JavaScript and Node.js.

> Note that `undefined` array items are stripped out _even if you are using `['===']`_.



## JSON-Compatible Values

| Exemplar          | Rttc Display Type     | Display Type Label            | Base Value    |
|:------------------|:----------------------|:------------------------------|:--------------|
| `'*'`             | `'json'`              | `'JSON-Compatible Value'`     | `null`        |


This works pretty much like the generic dictionary type, with one major difference: the top-level value can be a string, boolean, number, dictionary, array, or `null` value.  When faced with a dictionary or array that contains nested values, the generic JSON type follows the same JSON-serializability as the generic dictionary type (see above).



## Mutable references (aka "ref")

| Exemplar               | RTTC Display Type      | Display Type Label            | Base Value    |
|:-----------------------|:-----------------------|:------------------------------|:--------------|
| `'==='`                | `'ref'`                | `'Anything'`                  | `null`        |

This special type allows anything except `undefined` at the top level (undefined is permitted at any other level).  It also _does not rebuild objects_, which means it maintains the original reference (i.e. is `===`).  It does not guarantee JSON-serializability.



## Faceted dictionaries

| Exemplar               | Type Schema           | RTTC Display Type      | Display Type Label            | Base Value            |
|:-----------------------|:----------------------|:-----------------------|:------------------------------|:----------------------|
| `{...}` _(recursive)_  | `{...}` _(see below)_ | `'dictionary'`         | `'Dictionary'`                | `{...}` _(see below)_ |

The **faceted dictionary** type is any dictionary type schema with at least one key.  When coercing a value to a faceted dictionary, any keys in the value that are _not_ in the type schema will be stripped out. Missing keys in the value will cause `.validate()` to throw.

Dictionary type schemas (i.e. plain old JavaScript objects nested like `{a:{}}`) can be infinitely nested.  Type validation and coercion will proceed through the nested objects recursively.

```javascript
{
  id: 'number',
  name: 'string',
  isAdmin: 'boolean',
  mom: {
    id: 'number',
    spouse: 'json',
    occupation: {
      title: 'string',
      workplace: 'json',
      hobbies: {},
      incomingUploads: [
        {
          fd: 'string',
          startBuffering: 'lamda',
          rawStream: 'ref'
        }
      ]
    }
  }
}
```

#### Base Value

The base value for the faceted dictionary type is a dictionary which consists of a key for every expected facet, each with _its own_ base value (recursively deep).

For example, for the type schema described above, the base value is:

```javascript
{
  id: 0,
  name: '',
  isAdmin: false,
  mom: {
    id: 0,
    spouse: null,
    hobbies: {},
    occupation: {
      title: '',
      workplace: null,
      incomingUploads: []
    }
  }
}
```



#### What about keys with `undefined` values?

When validating or coercing a value vs. a faceted dictionary exemplar or type schema, if a required key exists, but has an `undefined` value, it is _considered the same thing as if the key did not exist at all_. This is a deliberate decision designed to normalize the use of `null` vs. `undefined` in your application, and to avoid the pitfalls of `==` vs. `===` equality comparisons and `hasOwnProperty` checks. This approach prevents countless bugs and makes it much easier to hunt down the sources of problems when they occur.


##### Can I have optional facets?
The best way to allow dictionaries which _may or may not_ include certain keys is to always provide those keys using the appropriate base values.  For example, let's say a user in your app or script _may or may not_ have `msOutlookEmail`, `contactInfo`, or `misc` keys.  Regardless, you could still use the same faceted dictionary exemplar:

```js
var USER_SCHEMA = {
  id: 38,
  name: 'Margaret Thatcher',
  email: 'margaret@gmail.com',
  msOutlookEmail: 'marge@outlook.com',
  contactInfo: {},
  misc: '*'
}
```

Then whenever you build a dictionary that you want to validate at runtime, just coerce it first:
```js
var alfred = rttc.cast(USER_SCHEMA, {
  id: 100,
  name: 'Alfred Roberts',
  email: 'alfred@gmail.com',
  contactInfo: {
    phone: '+3 9284829424'
  }
});
```

This will ensure that all of the facets exist, even if it's just as base values; e.g.:

```js
console.log(alfred);

// - - - - - - - - - - - - -
{
  id: 100,
  name: 'Alfred Roberts',
  email: 'alfred@gmail.com',
  msOutlookEmail: '',
  contactInfo: {
    phone: '+3 9284829424'
  },
  misc: null
}
```


#### Can I have facets that could be vastly different types?

The best way to implement [union facets](https://en.wikipedia.org/wiki/Union_type), or facets that could be more than one type, is to use a more generic type (such as `{}`, `'*'`, or `'==='`), and then add additional specificity through custom code.


#### What if I don't need to validate every key recursively deep?

Even if you don't need to validate every key recursively deep, to use the faceted dictionary exemplar, you still need to declare every facet you plan to use.  Alternately, to indicate _any_ dictionary of JSON-compatible values, just use the generic dictionary (`{}`) type / exemplar instead.  Then, implement any additional validation or coercion logic you need on top of that by writing it into your code.

> This is another way you can go about validating dictionaries with keys that may or may not exist, and keys that could be multiple different types.  Just be careful: this approach has the problem of introducing human error into the equation.  If possible, the best, safest, and most foolproof approach is to use a faceted dictionary.  This ensures your runtime dictionaries always include the key/value pairs you expect them to, and it reduces the number of times you have to squint at the computer screen and read `Cannot read property "foo" of undefined`.




## Arrays

| Exemplar               | Type Schema            | RTTC Display Type      | Display Type Label            | Base Value            |
|:-----------------------|:-----------------------|:-----------------------|:------------------------------|:----------------------|
| `[...]` _(recursive)_  | `[...]` _(see below)_  | `'array'`              | `'Array'`                     | `[]` _(empty array)_  |


The **array** type accepts any array, so long as all of that array's items are also valid (recursively deep). Every array exemplar and type schema must declare a **pattern**: a nested exemplar or type schema which indicates the expected type of array items.  This pattern is how the array type is able to validate nested values. When validating vs. an array type schema, RTTC first checks that the corresponding value is an array (a la [`_.isArray()`](http://lodash.org)), then also recursively checks each of its items vs. the expected pattern.  For example, given the exemplar `['Margaret']`, we can infer that the type schema is `['string']`, and therefore that it would accept any array of strings.  So when designing an array exemplar or type schema, make sure the array has _exactly one item_ to serve as the pattern, which is itself another exemplar or type schema.  This pattern will be used for validating/coercing array items.

An array type schema or exemplar may be _infinitely nested_ simply by using another array or a faceted dictionary as its pattern.  For example:
```javascript
[
  {
    id: 'number',
    name: 'string',
    email: 'string',
    age: 'number',
    isAdmin: 'boolean',
    favoriteColors: ['string'],
    friends: [
      {
        id: 'number',
        name: 'string'
      }
    ]
  }
]
```

#### What if I don't need to validate array items recursively deep?

Even if you don't need to validate array items, you still need a pattern.  But luckily, there's another RTTC type (`'==='`) that you can easily use to accept _any value_.  To indicate an array of _anything_, just use the mutable reference type as your pattern:

```js
// Type schema that indicates an array of anything, where array items are passed by reference:
['ref']

// Exemplar that indicates an array of anything, where array items are passed by reference:
['===']
```

#### What about `undefined`?

When validating or coercing a value vs. an array exemplar or type schema, `undefined` items in the array _will always be stripped out_.  For example, coercing `['Jerry', undefined, undefined, 'Robin']` vs. the type schema `['string']` would result in `['Jerry', 'Robbin']`. This ensures consistency with the behavior of the native JSON.stringify() and JSON.parse() methods in browser-side JavaScript and Node.js.

> Note that `undefined` array items are stripped out _even if you are using `['===']`_.

&nbsp;





## Conventions and edge-cases

The following is a high-level overview of important conventions used by the `rttc` module. For detailed coverage of every permutation of validation and coercion, check out the declarative tests in the `spec/` folder of this repository.

##### `undefined` and `null` values

+ `undefined` _is never valid as a top-level value_ against ANY type, even mutable reference (`===`)
+ `undefined` IS, however, allowed as an item in a nested array or value in a nested dictionary, but only _within a dictionary or array_ being validated against the mutable reference type (`===`)
+ `null` is only valid against the JSON (`*`) and mutable reference (`===`) types.

##### Weird psuedo-numeric values

+ `NaN` is only valid against the mutable reference type (`'==='`)
+ `Infinity` and `-Infinity` are only valid against the mutable reference type (`'==='`)
+ `+0` and `-0` are always coerced to `0` (except against the mutable reference type)

##### Instances of ECMAScript core classes

When coerced against the generic dictionary or generic json types, the following is true:
+ `Error` instances are coerced to the string value of their `.stack` property (i.e. the message + stack trace you're used to seeing in the terminal)
+ `Date` instances are coerced to the string value of running their `.toJSON()` method (a ISO-8601 timestamp, e.g. `'2015-05-24T15:16:48.999Z'`.  This reflects the Date in GMT/UTC time, so is therefore timezone-agnostic).
+ `RegExp` instances are coerced to the string value you get from running their `.toString()` method (e.g. `'/foo/'` or `'/^bar/gi'`)
+ Functions are coerced to the string value you get from running their `.toString()` method (e.g. `'function someFunction (some,args,like,this,maybe){ /* and some kind of implementation in here prbly */ }'`)

##### Instances of Node.js core classes

+ `Stream` and `Buffer` instances (from Node.js) are only valid against the mutable reference type.
+ Streams and Buffers are coerced to `null` against the generic dictionary or the generic json types.



##### Base values

As mentioned above, every type has a base value.

+ For the "string" type, base value is `""`
+ For the "number" type, base value is `0`
+ For the "boolean" type, base value is `false`
+ For the "lamda" type (`'->'`), base value is a function that uses the standard machine fn signature and triggers its "error" callback w/ a message about being the rttc default (e.g. `function(inputs,exits,env) { return exits.error(new Error('not implemented')); }`)
+ For the generic dictionary type (`{}`) or a faceted dictionary type (e.g. `{foo:'bar'}`), the base value is `{}`.
+ For the array type (e.g. `[3]` or `[{age:48,name: 'Nico'}]`), the base value is `[]` (an empty array)
+ For the "json" type (`'*'`), base value is `null`.
+ For the "ref" type (`'==='`), base value is `null`.

> Note that, for both arrays and dictionaries, any keys in the schema will get the base value for their type (and their keys for their type, etc. -- recursive)





## Methods

This package exposes a number of different methods, some of which are much more likely to be relevant than others for your everyday development needs.  The methods in this reference documentation are listed roughly in descending order of familiarity, starting with the most commonly-used and ending with the more bizarre.


### Validation

##### .validateStrict(expectedTypeSchema, actualValue)

Throw an error if the provided value is not the right type (recursive).


##### .validate(expectedTypeSchema, actualValue)

Either return a (potentially "lightly" coerced) version of the value that was accepted, or throw an error.  The "lightly" coerced value turns `"3"` into `3`, `"true"` into `true`, `-4.5` into `"-4.5"`, etc.


##### .isEqual(firstValue, secondValue, [_expectedTypeSchema_=`undefined`])

Determine whether two values are equivalent using `_.isEqual()`.

This is the method used by `rttc`'s own tests to validate that expected values and actual values match.
If the third argument is provided, `.isEqual` also looks for expected `lamda` values in the optional type schema and calls `toString()` on functions before comparing them.



### Munging


##### .coerce(expectedTypeSchema, actualValue)

ALWAYS return an acceptable version of the value, even if it has to be mangled (i.e. by using the "base value" for the expected type schema).



##### .rebuild(value, handlePrimitive, [handleComposite])

Recursively rebuild (non-destructively) the specified `value` using the provided transformer function (`handlePrimitive`)
to potentially modify each primitive (`null`, string, number, boolean, or function) therein.  Values like JavaScript Dates,
Errors, streams, etc. are coerced to strings before being passed in to `handlePrimitive`.

The `handlePrimitive` transformer function is not run for dictionaries or arrays, since they're recursed into automatically
by default-- unless the `handleComposite` transformer is provided.  If provided, the `handleComposite` transformer function
is called once for each array and once for each dictionary in `value`.  It is expected to return a modified dictionary or array
that will then continue to be recursively iterated into by `rebuild()`.

In any case, arrays and dictionaries end up as normal array and dictionary literals in the rebuilt value, meaning that any
JavaScript-language-specific metadata such as getters/setters/non-enumerable properties like prototypal methods and constructor
information are all stripped out.  `.rebuild()` also protects against endless recursion due to circular references, whether or
not the `handleComposite` transformer function is being used (since even if it is provided, JSON-serializability is ensured _before_
it is called).

Both transformer functions should be written expecting the particular primitive, dictionary or array value as their first argument
and an RTTC display type string as the second argument.  For `handlePrimitive`, that second argument is either 'string', 'number',
'boolean', 'lamda', or 'null'.  For `handleComposite`, it is either 'dictionary' or 'array'.

> If you need further technical specifics, see the implementation of `rebuild()` in `lib/rebuild.js` in this repo.

Example usage:
```javascript
return res.json(rttc.rebuild(someData, function handlePrimitive(val, type){
  if (type === 'string') { return val + ' (a grass-type Pokemon)'; }
  else { return val; }
}));
```


##### .dehydrate(value, [_allowNull_=`false`], [_dontStringifyFunctions_=`false`])

Prepare a value for serialization by taking care of a few edge-cases, such as:

+ stringifying regexps, errors (grabs the `.stack` property), and functions (unless `dontStringifyFunctions` is set)
+ replacing circular references with a string (e.g. `[Circular]`)
+ replacing `-Infinity`, `Infinity`, and `NaN` with 0
+ stripping keys and array items with `undefined` or `null` values. If `allowNull` is set to true, `null` values will not be stripped from the encoded string.

Note that arrays, dictionaries and literals are _not_ stringified by `dehydrate`.  Rather, `dehydrate` prepares a value for stringification (see `rttc.stringify()` below).

##### .hydrate(value, [_typeSchema_=`undefined`])

Use the provided `typeSchema` to figure out where "lamda" values (functions) are expected, then  use `eval()` to bring them back to life.  Use with care.



##### .parseHuman(stringFromHuman, [_typeSchema_=`undefined`], [_unsafeMode_=`false`])

Parse a human-readable string (typically entered by a human into some kind of UI or CLI application) and return a best guess at the JavaScript value it represents.

+ If provided, `typeSchema` will be used to make a more educated guess.  If you are calling `parseHuman()` in order to parse a string that was generated using `stringifyHuman()`, then be sure to use the same type schema.
+ If the `unsafeMode` flag is enabled, lamda functions will be hydrated.


For example:

```js
var result;


result = rttc.parseHuman('hi');
// result === 'hi'

result = rttc.parseHuman('"hi"', 'string');
// result === '"hi"'

result = rttc.parseHuman('"hi"', 'json');
// result === 'hi'
// typeof result === 'string'




result = rttc.parseHuman('3');
// result === '3'
// typeof result === 'string'

result = rttc.parseHuman('3', 'number');
// result === 3
// typeof result === 'number'

result = rttc.parseHuman('3', 'json');
// result === 3
// typeof result === 'number'


// JSON is not parsed by default:
result = rttc.parseHuman('{"foo":"100"}')
// result === '{"foo":"100"}'
// typeof result === 'string'

// But it will be, if given the proper type schema:
// e.g. either one of these:
result = rttc.parseHuman('{"foo":"100"}', 'json')
result = rttc.parseHuman('{"foo":"100"}', {})
// assert.deepEqual(result, { foo: '100' })
// typeof result === 'object'
// typeof result.foo === 'string'

// But:
result = rttc.parseHuman('{"foo":"100"}', { foo: 'number' })
// assert.deepEqual(result, { foo: 100 })
// typeof result === 'object'
// typeof result.foo === 'number'
```



Another example, this time using a more complex type schema:

```js
var result = rttc.parseHuman('{"name":"Mr. Tumnus","friends":[{"name":"Broderick","age":13},{"name":"Ashley","age":8000}]}',{
  name: 'string',
  friends: [
    {
      name: 'string',
      age: 'number'
    }
  ]
});

// Results in the following dictionary:
//
// { name: 'Mr. Tumnus',
//   friends:
//    [ { name: 'Broderick', age: 13 },
//      { name: 'Ashley', age: 8000 } ] }
```





##### .stringifyHuman(value, typeSchema)

Convert a JavaScript value into a string that can be parsed by `parseHuman()`.

Specifically, this method is an inverse operation of `.parseHuman()`; that is, if you take the stringified result from this function and pass that in to `.parseHuman()` using the same type schema, you'll end up back where you started: with the original JavaScript value you passed in to `rttc.stringifyHuman()`.

> This losslessness is guaranteed by two factors: that `stringifyHuman()` (1) enforces _strict_ RTTC validation
> rules (i.e. `rttc.validateStrict(typeSchema, value)`) and (2) the fact that it rejects values which cannot be safely
> stringified in a reversible way (e.g. JavaScript Dates, Errors, streams, prototypal objects, dictionaries and arrays
> with circular references, etc.).  If either of these checks fails, `stringifyHuman()` throws an error.
>
> So even though `parseHuman()` is quite forgiving (it uses RTTC loose validation), you can rest assured that _any_ string you
> generate using `stringifyHuman()` will be properly deserialized by `parseHuman()`, provided it is passed in with the same type schema.


For example:
```js
var result;

// Basic usage:
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
result = rttc.stringifyHuman(100, 'number');
// result === 100
// typeof result === 'number'


// The method performs strict validation, so the value must be compatible with the provided type schema:
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
result = rttc.stringifyHuman('100', 'number');
// Error: rttc.stringifyHuman() failed: the provided value does not match the expected type schema.
// Details:
// Error: 1 error validating value:
//  • Specified value (a string: '100') doesn't match the expected type: 'number'
//     at consolidateErrors (/Users/mikermcneil/code/rttc/lib/helpers/consolidate-errors.js:45:13)
//     ...


// And even if you specify the `ref` type, non-serializable things are not allowed:
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
result = rttc.stringifyHuman(new Date(), 'ref');
// Error: rttc.stringifyHuman() failed: the provided value cannot be safely stringified in a reversible way.
//    at Object.stringifyHuman (/Users/mikermcneil/code/rttc/lib/stringify-human.js:49:11)
//    at repl:1:15
//    ...


// One more normal-case usage scenario, this time using the same more complex value and type schema
// from the `parseHuman()` example above:
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
var result = rttc.stringifyHuman({
  name: 'Mr. Tumnus',
  friends: [
    { name: 'Broderick', age: 13 },
    { name: 'Ashley', age: 8000 }
  ]
},
{
  name: 'string',
  friends: [
    {
      name: 'string',
      age: 'number'
    }
  ]
});
// result === '{"name":"Mr. Tumnus","friends":[{"name":"Broderick","age":13},{"name":"Ashley","age":8000}]}'
// typeof result === 'string'
```



##### .compile(value)

Given a value, return a human-readable string which represents it.  This string is equivalent to a JavaScript code snippet which would accurately represent the value in code.

This is a lot like `util.inspect(val, {depth: null})` in the Node core util package. But there are a few differences. `rttc.compile()` also has special handling for Errors, Dates, and RegExps (using `dehydrate()` with `allowNull` enabled), as well as for Functions (making them `eval()`-ready.) The biggest difference is that the string you get back from `rttc.compile()` is ready for use as the right hand side of a variable initialization statement in JavaSript.

Useful for:
  + bootstrapping data on server-rendered views for access by client-side JavaScript
    + see [this gist](https://gist.github.com/mikermcneil/f8faae5903f049640d15) for a comprehensive example
  + generating code samples
  + error messages
  + debugging
  + user interfaces

Finally, here's a table listing notable differences between `util.inspect()` and `rttc.compile()` for reference:


| value                    | util.inspect()                            | rttc.compile()                       |
|--------------------------|-------------------------------------------|--------------------------------------|
| a function               | `[Function: foo]`                         | `function foo (){}`                  |
| a Date                   | `Tue May 26 2015 20:05:37 GMT-0500 (CDT)` | `'2015-05-27T01:06:37.072Z'`         |
| a RegExp                 | `/foo/gi`                                 | `'/foo/gi/'`                         |
| an Error                 | `[Error]`                                 | `'Error\n    at repl:1:24\n...'`     |
| a deeply nested thing    | `{ a: { b: { c: [Object] } } }`           | `{ a: { b: { c: { d: {} } } } }`     |
| a circular thing         | `{ y: { z: [Circular] } }`                | `{ y: { z: '[Circular ~]' } }`       |
| undefined                | `undefined`                               | `null`                               |
| [undefined]              | `[undefined]`                             | `[]`                                 |
| {foo: undefined}         | `{foo: undefined}`                        | `{}`                                 |
| Infinity                 | `Infinity`                                | `0`                                  |
| -Infinity                | `-Infinity`                               | `0`                                  |
| NaN                      | `NaN`                                     | `0`                                  |
| Readable (Node stream)   | `{ _readableState: { highWaterMar..}}`    | `null`                               |
| Buffer (Node bytestring) | `<Buffer 61 62 63>`                       | `null`                               |


> Note that undefined values in arrays and undefined values of keys in dictionaries will be stripped out, and circular references will be handled as they are in `util.inspect(val, {depth: null})`.



##### .parse(stringifiedValue, [_typeSchema_=`undefined`], [_unsafeMode_=`false`])

Parse a stringified value back into a usable value.

This is basically just a variation on JSON.parse that calls `rttc.hydrate()` first if `unsafeMode` is enabled.


##### .stringify(value, [_allowNull_=`false`])

Encode a value into a string.

This is basically just a variation on JSON.stringify that calls `rttc.dehydrate()` first.




### Meta

> Methods for working w/ exemplars, type schemas, and display types



##### .infer(exemplar)

Infer the type schema from the given exemplar.

```javascript
rttc.infer([
  {
    name: 'Rachael',
    age: 27,
    filesBeingUploaded: ['==='],
    friends: [
      {
        name: 'Mr. Bailey',
        species: 'cat',
        getClawSharpness: '->'
      }
    ]
  }
]);

/* =>
[
  {
    name: 'string'
    age: 'number',
    filesBeingUploaded: [
      'ref'
    ],
    friends: [
      {
        name: 'string',
        species: 'string',
        getClawSharpness: 'lamda'
      }
    ]
  }
]
*/
```


##### .inferDisplayType(exemplar)

Compute the **display type** (aka "typeclass") for an RTTC exemplar.

Always returns one of the standard RTTC display types:
  + string
  + number
  + boolean
  + lamda
  + dictionary
  + array
  + json
  + ref

Or `''` (empty string) if the exemplar is unrecognized or invalid; e.g. `null`.


```javascript
rttc.inferDisplayType({foo: 'bar'});
// => 'dictionary'


rttc.inferDisplayType('->');
// => 'lamda'
```


##### .getDisplayTypeLabel(displayType)

Get the appropriate human-readable label for a given RTTC "display type" (aka "typeclass") string.

Useful for error messages, user interfaces, etc.

```js
rttc.getDisplayTypeLabel('ref');
//   => 'Anything'

rttc.getDisplayTypeLabel('string');
//   => 'String'

rttc.getDisplayTypeLabel('dictionary');
//   => 'Dictionary'
```


##### .coerceExemplar(value, [allowSpecialSyntax=false])

Build a reasonable-looking exemplar from a normal value-- specifically, the _most specific_ exemplar which would accept that value.

> Note: This is particularly useful for inferring RTTC exemplar schemas from fixture data.


In most cases, this leaves the value untouched-- however it does take care of a few special cases:

+ Empty dictionaries become generic dictionaries (`{}`).  The most specific exemplar which can accept an empty dictionary is the generic dictionary.
+ Empty arrays become generic arrays (`[]`).  Since we don't know the contents, we have to assume this array could be heterogeneous (i.e. have items with different types).
+ Multi-item arrays become pattern arrays, and any extra items (other than the first one) are lopped off.
+ Functions become '->'.
+ `null` becomes '*'.
+ If the top-level value is `undefined`, it becomes '==='. (however this behavior is subject to change in an upcoming release; since `undefined` is not supported by any exemplar)
+ '->' becomes the string: `'an arrow symbol'`.
+ '*' becomes the string: `'a star symbol'`.
+ '===' becomes the string: `'3 equal signs'`.
+ `NaN`, `Infinity`, `-Infinity`, and `-0` become 0.
+ Nested array items and keys with `undefined` values are stripped.
+ Other than the exceptions mentioned above, non-JSON-serializable things (like circular references) are boiled away when this calls `dehydrate` internally.

If the `allowSpecialSyntax` flag is enabled, then `*`, `->`, and `===` will be left untouched (allowing them to be intperpreted as special rttc exemplar syntax) instead of being replaced with string samples (e.g. "a star symbol" or "an arrow symbol").

```js
rttc.coerceExemplar([{a:null}, {b: [[74,39,'surprise string!']] }])
//   =>   [ {} ]

rttc.coerceExemplar([74,39,'surprise string!'])
//   =>   [ 'surprise string!' ]

rttc.coerceExemplar({x:'*'})
//   =>   { x: 'a star symbol' }

rttc.coerceExemplar({x:'*'}, true)
//   =>   { x: '*' }
```



<!--
##### .getDisplayType(value)

Given a value, return its type as a human-readable string (this is not limited to rttc types-- it can return strings like `"Error"` and `"Date"`).
If special rttc exemplar syntax is used, it is respected.

> May be deprecated in an upcoming release.

-->


##### .getPathInfo(exemplar, path)

Given an exemplar schema and a keypath, return information about the specified segment.  If the path is inside of a generic, then the exemplar is '*',  and this path is optional. If the path is inside of a `ref`,  then the exemplar is '===', and this path is optional.  If the path is not reachable (i.e. inside of a string, or lamda... or something) then throw an error.

> WARNING: Since hops in keypaths are represented by `.` (dots), this method is not safe to use on exemplars which contain any keys which contain dots.  This may be improved in future versions.

```js
var SOME_EXEMPLAR = {
  salutation: 'Mr.',
  hobbies: ['knitting'],
  medicalInfo: {
    numYearsBlueberryAbuse: 12.5,
    latestBloodWork: {}
  }
};

rttc.getPathInfo(SOME_EXEMPLAR, 'hobbies.238');
// =>
//     {
//       exemplar: 'knitting',
//       optional: false
//     }


rttc.getPathInfo(SOME_EXEMPLAR, 'medicalInfo.latestBloodWork.whiteBloodCellCount');
// =>
//     {
//       exemplar: '*',
//       optional: true
//     }
```


##### .union(schema0, schema1, [isExemplar=false], [isStrict=false])

Given two rttc schemas (e.g. `A` and `B`), return the most specific schema that would accept the superset of what both schemas accept normally (`A ∪ B`).

+ _schema0_ - the first schema
+ _schema1_ - the second schema (order doesn't matter)
+ _isExemplar_ - if set, the schemas will be treated as exemplars (rather than type schemas)
+ _isStrict_ - if set, the schemas will be unioned using strict validation rules (i.e. like `validateStrict()`)


##### .intersection(schema0, schema1, [isExemplar=false], [isStrict=false])

Given two rttc schemas, return the most specific schema that accepts the shared subset of values accepted by both. Formally, this subset is the intersection of A and B (A ∩ B), where A is the set of values accepted by `schema0` and B is the set of values accepted by `schema1`.  If `A ∩ B` is the empty set, then this function will return `null`.  Otherwise it will return the schema that precisely accepts `A ∩ B`.

+ _schema0_ - the first schema
+ _schema1_ - the second schema (order doesn't matter)
+ _isExemplar_ - if set, the schemas will be treated as exemplars (rather than type schemas)
+ _isStrict_ - if set, the schemas will be intersected using strict validation rules (i.e. like `validateStrict()`)



### Convenience

> Simple convenience methods that wrap up one or more of the other `rttc` methods for a particular use case.

##### .getBaseVal(exemplar)

A convenience method to return the base value for the given exemplar.  This is effectively the same thing as calling `rttc.infer()` to get the exemplar's type schema, then coercing `undefined` to match it (i.e. passing the type schema to `rttc.coerce()` without a second argument).

```js
rttc.getBaseVal(exemplar);
// ... is just a shorcut for doing:
rttc.coerce(rttc.infer(exemplar), undefined);
```


##### .cast(exemplar, actualValue)

A convenience method that calls `rttc.infer()` on the provided exemplar to get the type schema, then uses it to `rttc.coerce()` the `actualValue` provided.

```js
rttc.cast(exemplar, actualValue);

// ... is just a shorcut for doing:
rttc.coerce(rttc.infer(exemplar), actualValue);
```





### Experimental

The following functions are newly implemented, experimental, and tend to be a bit more advanced. They may undergo frequent changes over the coming months, so use with care.  You have been warned!


##### .sample(typeSchema, [n=2])

Given a type schema, return an array of up to `n` unique sample values that would validate against it (in random order).  `n` defaults to 2 if left undefined.


##### .isSpecific(typeSchemaOrExemplar, [recursive=false], [isExemplar=false])

Determine whether the given type schema is "specific".  String, number, boolean, lamda, faceted dictionary, or patterned array types are "specific".  Everything else is "generic".

If the second argument (`recursive`) is set to `true`, then also recursively check the subkeys of faceted dictionaries and patterns of arrays in the type schema.

If the third argument (`isExemplar`) is set to `true`, then treat the provided schema as an rttc example rather than a type schema.

For reference

| type                    | is specific?          |
|-------------------------|---------------------|
| string                  | yes _(always)_ |
| number                  | yes _(always)_ |
| boolean                 | yes _(always)_ |
| lamda                   | yes _(always)_ |
| `{}` (generic)          | no                 |
| `[]` (generic)          | no                 |
| `{...}` (faceted)       | yes _(maybe recursively)_  |
| `[...]` (patterned)     | yes _(maybe recursively)_  |
| json                    | no                 |
| ref                     | no                 |



##### .getDefaultExemplar(typeSchema)

Given a type schema, return a random exemplar which accepts precisely the same set of values.


<!--
##### .isInvalidExample(exemplar)

Return truthy if the provided value is NOT a valid rttc exemplar (e.g. `null`).

> May be deprecated in an upcoming release
-->


<!--

##### .reify(typeSchema)

> **DEPRECATED**.  This method will become an alias for `coerceExemplar` in future versions of rttc, and its current implementation will be removed.

Given a type schema, strip out generics ("ref", "json", {}, and []) to convert it into a "specific" type. In other words, the result of this function always passes `rttc.isSpecific()`.
-->




## License

MIT

&copy; 2014 Mike McNeil, Cody Stoltman;  &copy; 2015-2016 The Treeline Company
