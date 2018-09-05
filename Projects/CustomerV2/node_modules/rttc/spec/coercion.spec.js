//  ██████╗ ████████╗████████╗ ██████╗    ███████╗██████╗ ███████╗ ██████╗
//  ██╔══██╗╚══██╔══╝╚══██╔══╝██╔════╝    ██╔════╝██╔══██╗██╔════╝██╔════╝    ██╗██╗
//  ██████╔╝   ██║      ██║   ██║         ███████╗██████╔╝█████╗  ██║         ╚═╝╚═╝
//  ██╔══██╗   ██║      ██║   ██║         ╚════██║██╔═══╝ ██╔══╝  ██║         ██╗██╗
//  ██║  ██║   ██║      ██║   ╚██████╗    ███████║██║     ███████╗╚██████╗    ╚═╝╚═╝
//  ╚═╝  ╚═╝   ╚═╝      ╚═╝    ╚═════╝    ╚══════╝╚═╝     ╚══════╝ ╚═════╝
//
//   ██████╗ ██████╗ ███████╗██████╗  ██████╗██╗ ██████╗ ███╗   ██╗
//  ██╔════╝██╔═══██╗██╔════╝██╔══██╗██╔════╝██║██╔═══██╗████╗  ██║
//  ██║     ██║   ██║█████╗  ██████╔╝██║     ██║██║   ██║██╔██╗ ██║
//  ██║     ██║   ██║██╔══╝  ██╔══██╗██║     ██║██║   ██║██║╚██╗██║
//  ╚██████╗╚██████╔╝███████╗██║  ██║╚██████╗██║╚██████╔╝██║ ╚████║
//   ╚═════╝ ╚═════╝ ╚══════╝╚═╝  ╚═╝ ╚═════╝╚═╝ ╚═════╝ ╚═╝  ╚═══╝
//
// Export the array of tests below.
module.exports = [

  ////////////////////////////////////////////
  // STRINGS
  ////////////////////////////////////////////

  { example: 'foo', actual: 'bar', result: 'bar' },
  { example: 'foo', actual: '', result: '' },

  { example: 'foo', actual: 0, result: '0' },
  { example: 'foo', actual: 1, result: '1' },
  { example: 'foo', actual: -1.1, result: '-1.1' },
  { example: 'foo', actual: -0, result: '0' },
  { example: 'foo', actual: +0, result: '0' },

  { example: 'foo', actual: true, result: 'true' },
  { example: 'foo', actual: false, result: 'false' },

  { example: 'foo', actual: {}, result: '' },
  { example: 'foo', actual: {foo:'bar'}, result: '' },
  { example: 'foo', actual: {foo:{bar:{baz:{}}}}, result: '' },
  { example: 'foo', actual: {foo:['bar']}, result: '' },
  { example: 'foo', actual: {foo:{bar:{baz:[{}]}}}, result: '' },

  { example: 'foo', actual: [], result: '' },
  { example: 'foo', actual: ['asdf'], result: '' },
  { example: 'foo', actual: [''], result: '' },
  { example: 'foo', actual: [235], result: '' },
  { example: 'foo', actual: [false], result: '' },
  { example: 'foo', actual: [{}], result: '' },
  { example: 'foo', actual: [{foo:'bar'}], result: '' },

  { example: 'foo', actual: undefined, result: '' },
  { example: 'foo', actual: NaN, result: '' },
  { example: 'foo', actual: Infinity, result: '' },
  { example: 'foo', actual: -Infinity, result: '' },
  { example: 'foo', actual: null, result: '' },

  { example: 'foo', actual: /some regexp/, result: '' },
  { example: 'foo', actual: function(){}, result: '' },
  { example: 'foo', actual: new Date('November 5, 1605 GMT'), result: '1605-11-05T00:00:00.000Z' },
  { example: 'foo', actual: new (require('stream').Readable)(), result: '' }, // TODO: consider buffering into a string..?  needs community discussion
  { example: 'foo', actual: new Buffer('asdf'), result: '' }, // TODO: consider converting to string
  { example: 'foo', actual: new Error('asdf'), result: '' }, // TODO: consider converting to error stack trace

  ////////////////////////////////////////////
  // NUMBERS
  ////////////////////////////////////////////

  { example: 123, actual: 'bar', result: 0 },
  { example: 123, actual: '', result: 0 },
  { example: 123, actual: '0', result: 0 },
  { example: 123, actual: '1', result: 1 },
  { example: 123, actual: '-1.1', result: -1.1 },
  { example: 123, actual: 'NaN', result: 0 },
  { example: 123, actual: 'undefined', result: 0 },
  { example: 123, actual: 'null', result: 0 },
  { example: 123, actual: '-Infinity', result: 0 },
  { example: 123, actual: 'Infinity', result: 0 },

  { example: 123, actual: 0, result: 0 },
  { example: 123, actual: 1, result: 1 },
  { example: 123, actual: -1.1, result: -1.1 },
  { example: 123, actual: +0, result: 0 },
  { example: 123, actual: -0, result: 0 },

  { example: 123, actual: true, result: 1 },
  { example: 123, actual: false, result: 0 },

  { example: 123, actual: {}, result: 0 },
  { example: 123, actual: {foo:'bar'}, result: 0 },
  { example: 123, actual: {foo:{bar:{baz:{}}}}, result: 0 },
  { example: 123, actual: {foo:['bar']}, result: 0 },
  { example: 123, actual: {foo:{bar:{baz:[{}]}}}, result: 0 },

  { example: 123, actual: [], result: 0 },
  { example: 123, actual: ['asdf'], result: 0 },
  { example: 123, actual: [''], result: 0 },
  { example: 123, actual: [235], result: 0 },
  { example: 123, actual: [false], result: 0 },
  { example: 123, actual: [{}], result: 0 },
  { example: 123, actual: [{foo:'bar'}], result: 0 },

  { example: 123, actual: undefined, result: 0 },
  { example: 123, actual: NaN, result: 0 },
  { example: 123, actual: Infinity, result: 0 },
  { example: 123, actual: -Infinity, result: 0 },
  { example: 123, actual: null, result: 0 },

  { example: 123, actual: /some regexp/, result: 0 },
  { example: 123, actual: function(){}, result: 0 },
  { example: 123, actual: new Date('November 5, 1605 GMT'), result: -11491632000000 },
  { example: 123, actual: new (require('stream').Readable)(), result: 0 }, // TODO: ??? maybe num bytes read so far?
  { example: 123, actual: new Buffer('asdf'), result: 0 },  // TODO: ??? maybe size of the buffer in bytes?
  { example: 123, actual: new Error('asdf'), result: 0 }, // TODO: ??? maybe `.status`?

  ////////////////////////////////////////////
  // BOOLEANS
  ////////////////////////////////////////////
  { example: true, actual: 'bar', result: false },
  { example: true, actual: '', result: false },
  { example: true, actual: '-1.1', result: false },
  { example: true, actual: 'NaN', result: false },
  { example: true, actual: 'undefined', result: false },
  { example: true, actual: 'null', result: false },
  { example: true, actual: '-Infinity', result: false },
  { example: true, actual: 'Infinity', result: false },
  { example: true, actual: 'true', result: true },
  { example: true, actual: 'false', result: false },
  { example: true, actual: '0', result: false },
  { example: true, actual: '1', result: true },

  { example: true, actual: 0, result: false },
  { example: true, actual: 1, result: true },
  { example: true, actual: -1.1, result: false },
  { example: true, actual: +0, result: false },
  { example: true, actual: -0, result: false },

  { example: true, actual: true, result: true },
  { example: true, actual: false, result: false },

  { example: true, actual: {}, result: false },
  { example: true, actual: {foo:'bar'}, result: false },
  { example: true, actual: {foo:{bar:{baz:{}}}}, result: false },
  { example: true, actual: {foo:['bar']}, result: false },
  { example: true, actual: {foo:{bar:{baz:[{}]}}}, result: false },

  { example: true, actual: [], result: false },
  { example: true, actual: ['asdf'], result: false },
  { example: true, actual: [''], result: false },
  { example: true, actual: [235], result: false },
  { example: true, actual: [false], result: false },
  { example: true, actual: [{}], result: false },
  { example: true, actual: [{foo:'bar'}], result: false },

  { example: true, actual: undefined, result: false },
  { example: true, actual: NaN, result: false },
  { example: true, actual: Infinity, result: false },
  { example: true, actual: -Infinity, result: false },
  { example: true, actual: null, result: false },

  { example: true, actual: /some regexp/, result: false },
  { example: true, actual: function(){}, result: false },
  { example: true, actual: new Date('November 5, 1605 GMT'), result: false },
  { example: true, actual: new (require('stream').Readable)(), result: false },
  { example: true, actual: new Buffer('asdf'), result: false },
  { example: true, actual: new Error('asdf'), result: false },

  ////////////////////////////////////////////
  // DICTIONARIES (w/ json-serializable contents)
  // (note that `{}` in an exemplar indicates that any keys are permitted, but that their values must be json-serializable)
  // (there is no way to specifically indicate a dictionary of literally anything, including a mix of functions and other stuff
  //  so in that scenario, just use `'==='` instead of `{}` and add additional checks in relevant code to ensure you're dealing
  //  with a dictionary vs the other things `===` might produce; e.g. strings/functions/streams/whatever - literally anything.)
  ////////////////////////////////////////////

  { example: {}, actual: 'bar', result: {} },
  { example: {}, actual: 123, result: {} },
  { example: {}, actual: -0, result: {} },
  { example: {}, actual: +0, result: {} },
  { example: {}, actual: true, result: {} },

  { example: {}, actual: {}, result: {} },
  { example: {}, actual: {foo:'bar'}, result: {foo:'bar'} },
  { example: {}, actual: {foo:{bar:{baz:{}}}}, result: {foo:{bar:{baz:{}}}} },
  { example: {}, actual: {foo:['bar']}, result: {foo:['bar']} },
  { example: {}, actual: {foo:{bar:{baz:[{}]}}}, result: {foo:{bar:{baz:[{}]}}} },

  { example: {}, actual: [], result: {} },
  { example: {}, actual: ['asdf'], result: {} },
  { example: {}, actual: [''], result: {} },
  { example: {}, actual: [235], result: {} },
  { example: {}, actual: [false], result: {} },
  { example: {}, actual: [{}], result: {} },
  { example: {}, actual: [{foo:'bar'}], result: {} },

  { example: {}, actual: undefined, result: {} },
  { example: {}, actual: NaN, result: {} },
  { example: {}, actual: Infinity, result: {} },
  { example: {}, actual: -Infinity, result: {} },
  { example: {}, actual: null, result: {} },

  { example: {}, actual: /some regexp/, result: {} },
  { example: {}, actual: function(){}, result: {} },
  { example: {}, actual: new Date('November 5, 1605 GMT'), result: {} },
  // Skip Readable stream tests for now since the enumerable properties vary between Node.js versions.
  // TODO: bring back support for this by explicitly filtering properties of streams in `.exec()`
  // { example: {}, actual: new (require('stream').Readable)(), result: { _readableState: { highWaterMark: 16384, buffer: [], length: 0, pipes: null, pipesCount: 0, flowing: false, ended: false, endEmitted: false, reading: false, calledRead: false, sync: true, needReadable: false, emittedReadable: false, readableListening: false, objectMode: false, defaultEncoding: 'utf8', ranOut: false, awaitDrain: 0, readingMore: false, decoder: null, encoding: null }, readable: true, domain: null, _events: {}, _maxListeners: 10 } },

  // Skip Buffer tests for now since the enumerable properties vary between Node.js versions.
  // TODO: bring back support for this by explicitly filtering properties of buffers in `.exec()`
  // { example: {}, actual: new Buffer('asdf'), result: {} },

  { example: {}, actual: new Error('asdf'), result: {} },  // TODO: consider enhancing this behavior to guarantee e.g. `.message` (string), `.stack` (string), `.code` (string), and `.status` (number).  Needs community discussion



  ////////////////////////////////////////////
  // ARRAYS (with json-serializable contents)
  // (note that `[]` in an exemplar is actually just shorthand for `['*']`)
  // (to indicate an array of literally anything, including a mix of functions and other stuff, use `['===']`)
  ////////////////////////////////////////////

  { example: [], actual: 'bar', result: [] },
  { example: [], actual: 123, result: [] },
  { example: [], actual: -0, result: [] },
  { example: [], actual: +0, result: [] },
  { example: [], actual: true, result: [] },

  { example: [], actual: {}, result: [] },
  { example: [], actual: {foo:'bar'}, result: [] },
  { example: [], actual: {foo:{bar:{baz:{}}}}, result: [] },
  { example: [], actual: {foo:['bar']}, result: [] },
  { example: [], actual: {foo:{bar:{baz:[{}]}}}, result: [] },

  { example: [], actual: [], result: [] },
  { example: [], actual: ['asdf'], result: ['asdf'] },
  { example: [], actual: [''], result: [''] },
  { example: [], actual: [235], result: [235] },
  { example: [], actual: [false], result: [false] },
  { example: [], actual: [{}], result: [{}] },
  { example: [], actual: [{foo:'bar'}], result: [{foo: 'bar'}] },

  { example: [], actual: undefined, result: [] },
  { example: [], actual: NaN, result: [] },
  { example: [], actual: Infinity, result: [] },
  { example: [], actual: -Infinity, result: [] },
  { example: [], actual: null, result: [] },

  { example: [], actual: /some regexp/, result: [] },
  { example: [], actual: function(){}, result: [] },
  { example: [], actual: new Date('November 5, 1605 GMT'), result: [] },
  // { example: [], actual: new (require('stream').Readable)(), result: [] }, // TODO: consider enhancing this behavior to concat the stream contents? Needs community discussion.
  // Skip Buffer tests for now since the enumerable properties vary between Node.js versions.
  // TODO: bring back support for this by explicitly filtering properties of buffers in `.exec()`
  // { example: [], actual: new Buffer('asdf'), result: [ 97, 115, 100, 102 ] },
  { example: [], actual: new Error('asdf'), result: [] },


  //////////////////////////////////////////////////////
  // nested contents of `example: []` and `example: {}`
  //////////////////////////////////////////////////////

  // Follow JSON-serialization rules for nested objects within `example: []` and `example: {}`
  // with the following exceptions:
  // • convert Error instances to their `.stack` property (a string)
  // • convert RegExp instances to a string
  // • convert functions to a string
  // • after doing the rest of the things, prune undefined/null items
  // • after doing the rest of the things, strip keys w/ undefined/null values
  { example: {}, actual: { x: undefined }, result: {} },
  { example: {}, actual: { x: NaN }, result: { x: 0 } },
  { example: {}, actual: { x: Infinity }, result: { x: 0 } },
  { example: {}, actual: { x: -Infinity }, result: { x: 0 } },
  { example: {}, actual: { x: null }, result: { x:null } },
  { example: {}, actual: { x: function foo(a,b){return a+' '+b;} }, result: { x: 'function foo(a,b){return a+\' \'+b;}' } },
  // { example: {}, actual: { x: undefined, null, NaN, -Infinity, Infinity, function(){} }, result: [] },
  { example: {}, actual: { x: /some regexp/ig }, result: {x:'/some regexp/gi' }},
  { example: {}, actual: { x: new Date('November 5, 1605 GMT') }, result: {x: '1605-11-05T00:00:00.000Z'} },
  // Skip Readable stream tests for now since the enumerable properties vary between Node.js versions.
  // { example: {}, actual: { x: new (require('stream').Readable)() }, result: { x: { _readableState: {},readable: true,_events: {},_maxListeners: 10 } } },
  // Skip Buffer stream tests for now since the enumerable properties vary between Node.js versions.
  // { example: {}, actual: { x: new Buffer('asdf') } , result: {x: {}} },
  (function (){
    // Hard-code a fake `.stack` to avoid differences between computers that would cause tests to fail
    var e = new Error('asdf');
    e.stack = 'fake_error';
    return { example: {}, actual: { x: e }, result: {x:'fake_error'} };
  })(),

  { example: [], actual: [undefined], result: [] },
  { example: [], actual: [null], result: [null] },
  { example: [], actual: [NaN], result: [0] },
  { example: [], actual: [Infinity], result: [0] },
  { example: [], actual: [-Infinity], result: [0] },
  { example: [], actual: [function foo(a,b){return a+' '+b;}], result: ['function foo(a,b){return a+\' \'+b;}'] },
  { example: [], actual: [/some regexp/gi], result: ['/some regexp/gi'] },
  { example: [], actual: [new Date('November 5, 1605 GMT')], result: ['1605-11-05T00:00:00.000Z'] },
  // { example: [], actual: [new (require('stream').Readable)()], result: [] },
  // { example: [], actual: [new Buffer('asdf')], result: [] },
  (function (){
    var e = new Error('asdf');
    e.stack = 'fake_error';
    return { example: [], actual: [e], result: ['fake_error'] };
  })(),


  ////////////////////////////////////////////
  // example: '*' (any JSON-serializable value)
  ////////////////////////////////////////////

  { example: '*', actual: 'bar', result: 'bar',  },
  { example: '*', actual: '', result: '',  },
  { example: '*', actual: '-1.1', result: '-1.1',  },
  { example: '*', actual: 'NaN', result: 'NaN',  },
  { example: '*', actual: 'undefined', result: 'undefined',  },
  { example: '*', actual: 'null', result: 'null',  },
  { example: '*', actual: '-Infinity', result: '-Infinity',  },
  { example: '*', actual: 'Infinity', result: 'Infinity',  },
  { example: '*', actual: 'true', result: 'true',  },
  { example: '*', actual: 'false', result: 'false',  },
  { example: '*', actual: '0', result: '0',  },
  { example: '*', actual: '1', result: '1',  },

  { example: '*', actual: -0, result: 0,  },
  { example: '*', actual: +0, result: 0,  },
  { example: '*', actual: 0, result: 0,  },
  { example: '*', actual: 1, result: 1,  },
  { example: '*', actual: -1.1, result: -1.1,  },

  { example: '*', actual: true, result: true,  },
  { example: '*', actual: false, result: false,  },

  { example: '*', actual: {}, result: {},  },
  { example: '*', actual: {foo:'bar'}, result: {foo:'bar'},  },
  { example: '*', actual: {foo:{bar:{baz:{}}}}, result: {foo:{bar:{baz:{}}}},  },
  { example: '*', actual: {foo:['bar']}, result: {foo:['bar']},  },
  { example: '*', actual: {foo:{bar:{baz:[{}]}}}, result: {foo:{bar:{baz:[{}]}}},  },

  { example: '*', actual: [], result: [],  },
  { example: '*', actual: ['asdf'], result: ['asdf'],  },
  { example: '*', actual: [''], result: [''],  },
  { example: '*', actual: [235], result: [235],  },
  { example: '*', actual: [false], result: [false],  },
  { example: '*', actual: [{}], result: [{}],  },
  { example: '*', actual: [{foo:'bar'}], result: [{foo:'bar'}],  },

  { example: '*', actual: undefined, result: null,  },

  { example: '*', actual: NaN, result: 0,  },
  { example: '*', actual: Infinity, result: 0,  },
  { example: '*', actual: -Infinity, result: 0,  },

  { example: '*', actual: null, result: null,  },

  { example: '*', actual: /some regexp/gi, result: '/some regexp/gi' },
  { example: '*', actual: new Date('November 5, 1605 GMT'), result: '1605-11-05T00:00:00.000Z' },


  ////////////////////////////////////////////
  // example: '->' (any function)
  ////////////////////////////////////////////

  { example: '->', actual: 'bar', result: function () { throw new Error('Not implemented! (this function was automatically created by `rttc`'); } },
  { example: '->', actual: '', result: function () { throw new Error('Not implemented! (this function was automatically created by `rttc`'); } },
  { example: '->', actual: '-1.1', result: function () { throw new Error('Not implemented! (this function was automatically created by `rttc`'); } },
  { example: '->', actual: 'NaN', result: function () { throw new Error('Not implemented! (this function was automatically created by `rttc`'); } },
  { example: '->', actual: 'undefined', result: function () { throw new Error('Not implemented! (this function was automatically created by `rttc`'); } },
  { example: '->', actual: 'null', result: function () { throw new Error('Not implemented! (this function was automatically created by `rttc`'); } },
  { example: '->', actual: '-Infinity', result: function () { throw new Error('Not implemented! (this function was automatically created by `rttc`'); } },
  { example: '->', actual: 'Infinity', result: function () { throw new Error('Not implemented! (this function was automatically created by `rttc`'); } },
  { example: '->', actual: 'true', result: function () { throw new Error('Not implemented! (this function was automatically created by `rttc`'); } },
  { example: '->', actual: 'false', result: function () { throw new Error('Not implemented! (this function was automatically created by `rttc`'); } },
  { example: '->', actual: '0', result: function () { throw new Error('Not implemented! (this function was automatically created by `rttc`'); } },
  { example: '->', actual: '1', result: function () { throw new Error('Not implemented! (this function was automatically created by `rttc`'); } },

  { example: '->', actual: -0, result: function () { throw new Error('Not implemented! (this function was automatically created by `rttc`'); } },
  { example: '->', actual: +0, result: function () { throw new Error('Not implemented! (this function was automatically created by `rttc`'); } },
  { example: '->', actual: 0, result: function () { throw new Error('Not implemented! (this function was automatically created by `rttc`'); } },
  { example: '->', actual: 1, result: function () { throw new Error('Not implemented! (this function was automatically created by `rttc`'); } },
  { example: '->', actual: -1.1, result: function () { throw new Error('Not implemented! (this function was automatically created by `rttc`'); } },

  { example: '->', actual: true, result: function () { throw new Error('Not implemented! (this function was automatically created by `rttc`'); } },
  { example: '->', actual: false, result: function () { throw new Error('Not implemented! (this function was automatically created by `rttc`'); } },

  { example: '->', actual: {}, result: function () { throw new Error('Not implemented! (this function was automatically created by `rttc`'); } },
  { example: '->', actual: {foo:'bar'}, result: function () { throw new Error('Not implemented! (this function was automatically created by `rttc`'); } },
  { example: '->', actual: {foo:{bar:{baz:{}}}}, result: function () { throw new Error('Not implemented! (this function was automatically created by `rttc`'); } },
  { example: '->', actual: {foo:['bar']}, result: function () { throw new Error('Not implemented! (this function was automatically created by `rttc`'); } },
  { example: '->', actual: {foo:{bar:{baz:[{}]}}}, result: function () { throw new Error('Not implemented! (this function was automatically created by `rttc`'); } },

  { example: '->', actual: [], result: function () { throw new Error('Not implemented! (this function was automatically created by `rttc`'); } },
  { example: '->', actual: ['asdf'], result: function () { throw new Error('Not implemented! (this function was automatically created by `rttc`'); } },
  { example: '->', actual: [''], result: function () { throw new Error('Not implemented! (this function was automatically created by `rttc`'); } },
  { example: '->', actual: [235], result: function () { throw new Error('Not implemented! (this function was automatically created by `rttc`'); } },
  { example: '->', actual: [false], result: function () { throw new Error('Not implemented! (this function was automatically created by `rttc`'); } },
  { example: '->', actual: [{}], result: function () { throw new Error('Not implemented! (this function was automatically created by `rttc`'); } },
  { example: '->', actual: [{foo:'bar'}], result: function () { throw new Error('Not implemented! (this function was automatically created by `rttc`'); } },

  { example: '->', actual: undefined, result: function () { throw new Error('Not implemented! (this function was automatically created by `rttc`'); } },

  { example: '->', actual: NaN, result: function () { throw new Error('Not implemented! (this function was automatically created by `rttc`'); } },
  { example: '->', actual: Infinity, result: function () { throw new Error('Not implemented! (this function was automatically created by `rttc`'); } },
  { example: '->', actual: -Infinity, result: function () { throw new Error('Not implemented! (this function was automatically created by `rttc`'); } },
  { example: '->', actual: null, result: function () { throw new Error('Not implemented! (this function was automatically created by `rttc`'); } },

  { example: '->', actual: function (inputs, exits){return exits.success();}, result: function (inputs, exits){return exits.success();} },



  ////////////////////////////////////////////
  // example: === (literally anything)
  // (undefined changes to '===' automatically)
  ////////////////////////////////////////////

  { example: undefined, actual: 'bar', result: 'bar',  },
  { example: undefined, actual: '', result: '',  },
  { example: undefined, actual: '-1.1', result: '-1.1',  },
  { example: undefined, actual: 'NaN', result: 'NaN',  },
  { example: undefined, actual: 'undefined', result: 'undefined',  },
  { example: undefined, actual: 'null', result: 'null',  },
  { example: undefined, actual: '-Infinity', result: '-Infinity',  },
  { example: undefined, actual: 'Infinity', result: 'Infinity',  },
  { example: undefined, actual: 'true', result: 'true',  },
  { example: undefined, actual: 'false', result: 'false',  },
  { example: undefined, actual: '0', result: '0',  },
  { example: undefined, actual: '1', result: '1',  },

  { example: undefined, actual: -0, result: -0,  },
  { example: undefined, actual: +0, result: +0,  },
  { example: undefined, actual: 0, result: 0,  },
  { example: undefined, actual: 1, result: 1,  },
  { example: undefined, actual: -1.1, result: -1.1,  },

  { example: undefined, actual: true, result: true,  },
  { example: undefined, actual: false, result: false,  },

  { example: undefined, actual: {}, result: {},  },
  { example: undefined, actual: {foo:'bar'}, result: {foo:'bar'},  },
  { example: undefined, actual: {foo:{bar:{baz:{}}}}, result: {foo:{bar:{baz:{}}}},  },
  { example: undefined, actual: {foo:['bar']}, result: {foo:['bar']},  },
  { example: undefined, actual: {foo:{bar:{baz:[{}]}}}, result: {foo:{bar:{baz:[{}]}}},  },

  { example: undefined, actual: [], result: [],  },
  { example: undefined, actual: ['asdf'], result: ['asdf'],  },
  { example: undefined, actual: [''], result: [''],  },
  { example: undefined, actual: [235], result: [235],  },
  { example: undefined, actual: [false], result: [false],  },
  { example: undefined, actual: [{}], result: [{}],  },
  { example: undefined, actual: [{foo:'bar'}], result: [{foo:'bar'}],  },

  { example: undefined, actual: undefined, result: null,  },

  { example: undefined, actual: NaN, result: NaN,  },
  { example: undefined, actual: Infinity, result: Infinity,  },
  { example: undefined, actual: -Infinity, result: -Infinity,  },
  { example: undefined, actual: null, result: null,  },

  { example: undefined, actual: /some regexp/gi, result: /some regexp/gi },
  { example: undefined, actual: new Date('November 5, 1605 GMT'), result: new Date('November 5, 1605 GMT') },











  //                                                              $$\
  //                                                              \__|
  //   $$$$$$\   $$$$$$\   $$$$$$$\ $$\   $$\  $$$$$$\   $$$$$$$\ $$\ $$\    $$\  $$$$$$\
  //  $$  __$$\ $$  __$$\ $$  _____|$$ |  $$ |$$  __$$\ $$  _____|$$ |\$$\  $$  |$$  __$$\
  //  $$ |  \__|$$$$$$$$ |$$ /      $$ |  $$ |$$ |  \__|\$$$$$$\  $$ | \$$\$$  / $$$$$$$$ |
  //  $$ |      $$   ____|$$ |      $$ |  $$ |$$ |       \____$$\ $$ |  \$$$  /  $$   ____|
  //  $$ |      \$$$$$$$\ \$$$$$$$\ \$$$$$$  |$$ |      $$$$$$$  |$$ |   \$  /   \$$$$$$$\
  //  \__|       \_______| \_______| \______/ \__|      \_______/ \__|    \_/     \_______|
  //
  //
  //

  // Some basic deep objects
  { example: {a:1, b:'hi', c: false}, actual: {a: 23}, result: {a: 23, b: '', c: false}  },
  { example: {a:1, b:'hi', c: false}, actual: {a: 23, d: true}, result: {a: 23, b: '', c: false}  },

  // Ensure that this allows extra keys when coercing to `example: {}`
  {
    example: {},
    actual: {a: 23, d: true},
    result: {a: 23, d: true}
  },

  // Omit extra keys when coercing to `example: {...}`
  {
    example: { a:23 },
    actual: {a: 23, d: true},
    result: {a: 23}
  },

  // Coerce missing/undefined required keys to base value
  { example: {b: 235}, actual: {b: undefined}, result: {b: 0}  },
  { example: {b: 235}, actual: {}, result: {b: 0}  },

  // Strip keys with `undefined` values (`{...}` case)
  { example: {b: 235}, actual: {a: undefined, b: 3}, result: {b: 3}  },
  // Strip nested keys with `undefined` values (`{...}` case)
  { example: {a: {}, b: 235}, actual: {a: {x: undefined}, b: 3}, result: {a: {}, b: 3}  },

  // Strip keys with `undefined` values (`{}` case)
  { example: {}, actual: {a: undefined, b: 3}, result: {b: 3}  },
  // Strip nested keys with `undefined` values (`{}` case)
  { example: {}, actual: {a: {x: undefined}, b: 3}, result: {a: {}, b: 3}  },

  // Don't strip keys or nested keys with `undefined` values (`===` and nested `===` cases)
  { example: '===', actual: {a: undefined, b: 3, c: {x: undefined}}, result: {a: undefined, b: 3, c: {x: undefined}}  },
  { example: {c:'==='}, actual: {a: undefined, b: 3, c: {x: undefined}}, result: { c: {x: undefined}}  },


  // Ensure that this allows arbitary arrays when coercing to `example: []`
  {
    example: [],
    actual: [{a: 23, d: true}],
    result: [{a: 23, d: true}]
  },

  // Ensure that nested dictionaries inside of an array passed
  // through `example: []` are stripped of keys with undefined values
  {
    example: [],
    actual: [{a:3, b: undefined}, {a: undefined}],
    result: [{a: 3},{}]
  },
  {
    example: [],
    actual: [{a:3,someStuff: [{x: undefined, y: 'foo'}, {x: 'bar', y: undefined}]},{a: 5, b: undefined}],
    result: [{a: 3, someStuff: [{y:'foo'}, {x:'bar'}]}, {a: 5}]
  },

  // With `===`:
  // Leave `undefined` items from arrays and nested arrays alone
  {
    example: '===',
    actual: [{a:3}, undefined, {a: 5}, undefined, {a: 7}, {a:9, b: [undefined, 9,2,4,undefined,8]}],
    result: [{a:3}, undefined, {a: 5}, undefined, {a: 7}, {a:9, b: [undefined, 9,2,4,undefined,8]}]
  },

  // With [`===`]:
  // Leave `undefined` items from NESTED arrays alone
  // (because they are being compared as '===')
  {
    example: ['==='],
    actual: [{a:3}, undefined, {a: 5}, undefined, {a: 7}, {a:9, b: [undefined, 9,2,4,undefined,8]}],
    result: [{a:3}, {a: 5}, {a: 7}, {a:9, b: [undefined, 9,2,4,undefined,8]}]
  },

  // Prune `undefined` items from arrays and nested arrays (`[]` case)
  {
    example: [],
    actual: [{a:3}, undefined, {a: 5}, undefined, {a: 7}, {a:9, b: [undefined, 9,2,4,undefined,8]}],
    result: [{a: 3}, {a: 5}, {a:7}, {a:9, b:[9,2,4,8]}]
  },

  // Ensure that nested dictionaries inside of an array passed
  // through `example: ['===']` are NOT stripped of keys with undefined values--
  // and are left utterly alone
  {
    example: ['==='],
    actual: [{a:3, b: undefined}, {a: undefined}],
    result: [{a: 3, b: undefined},{a:undefined}]
  },
  {
    example: ['==='],
    actual: [{a:3,someStuff: [{x: undefined, y: 'foo'}, {x: 'bar', y: undefined}]},{a: 5, b: undefined}],
    result: [{a:3,someStuff: [{x: undefined, y: 'foo'}, {x: 'bar', y: undefined}]},{a: 5, b: undefined}]
  },

  // Ensure the recursive cloning / undefined-key-stripping doesn't get
  // stumped by circular dictionaries/arrays.
  // • dict keys whose values point to a past reference should be deleted
  // • array items that point to past references should be pruned
  (function (){
    var someDict = {};
    var someArray = [];
    someDict.x = {z: someDict, foo: undefined};
    someDict.y = someArray;
    someArray.push(someDict);
    someArray.push(someDict.x);
    var test = {
      example: {},
      actual: {
        someDict: someDict,
        someArray: someArray
      },
      result: {
        someDict: {
          x: {
            z: '[Circular ~.someDict]'
          },
          y: [
            '[Circular ~.someDict]',
            {
              z: '[Circular ~.someDict]'
            }
          ]
        },
        someArray: [
          {
            x: {
              z: '[Circular ~.someArray.0]'
            },
            y: '[Circular ~.someArray]'
          },
          {
            z: {
              x: '[Circular ~.someArray.1]',
              y: '[Circular ~.someArray]'
            }
          }
        ]
      }
    };
    return test;
  })(),



  // Wholistic, complex multi-item array test
  {
    example: [{
      id: 123,
      title: 'Scott',
      body: 'Scott',
      votes: 0,
      resolved: true
    }],

    actual: [{
      votes: 10,
      title: 'first',
      resolved: false
    }, {
      votes: -5,
      title: 'second',
      resolved: false
    }, {
      votes: 0,
      title: 'third',
      resolved: false
    }],

    result: [{
      id: 0,
      votes: 10,
      title: 'first',
      body: '',
      resolved: false
    }, {
      id: 0,
      votes: -5,
      title: 'second',
      body: '',
      resolved: false
    }, {
      id: 0,
      votes: 0,
      title: 'third',
      body: '',
      resolved: false
    }]
  },


  // Complex multi-item array test w/ edge cases
  {
    example: [{
      id: 123,
      title: 'Scott',
      body: 'Scott',
      votes: 0,
      resolved: true
    }],

    actual: [{
      votes: 10,
      title: 'first',
      resolved: false
    }, {
      votes: -5,
      title: 'second',
      resolved: false
    }, {
      votes: 0,
      title: 'third',
      resolved: false
    },
     {
      votes: null,
      title: 'fourth',
      resolved: false
    },
     {
      votes: undefined,
      title: 'fifth',
      resolved: false
    },
     {
      title: 'sixth',
      resolved: false
    }],

    result: [{
      id: 0,
      votes: 10,
      title: 'first',
      body: '',
      resolved: false
    }, {
      id: 0,
      votes: -5,
      title: 'second',
      body: '',
      resolved: false
    }, {
      id: 0,
      votes: 0,
      title: 'third',
      body: '',
      resolved: false
    },
    {
      id: 0,
      votes: 0,
      title: 'fourth',
      body: '',
      resolved: false
    },
    {
      id: 0,
      votes: 0,
      title: 'fifth',
      body: '',
      resolved: false
    },
    {
      id: 0,
      votes: 0,
      title: 'sixth',
      body: '',
      resolved: false
    }]
  },

  // Tricky multi-item array javascript black magic
  {
    example: [{
      id: 123,
      title: 'Scott',
      body: 'Scott',
      votes: 0,
      resolved: true
    }],

    actual: {
      0: {
        votes: 10,
        title: 'first',
        resolved: false
      },
      1: {
        votes: -5,
        title: 'second',
        resolved: false
      },
      2: {
        votes: 0,
        title: 'third',
        resolved: false
      },
      3: {
        votes: null,
        title: 'fourth',
        resolved: false
      },
      4: {
        votes: undefined,
        title: 'fifth',
        resolved: false
      },
      5: {
        title: 'sixth',
        resolved: false
      }
    },

    result: []
  },






  //              $$\               $$\             $$\                                       $$$\               $$$\
  //              $$ |              \__|            $$ |                                     $$  _|               \$$\
  //   $$$$$$$\ $$$$$$\    $$$$$$\  $$\  $$$$$$$\ $$$$$$\          $$$$$$\   $$$$$$\        $$  /$$$$\ $$$$\ $$$$\ \$$\
  //  $$  _____|\_$$  _|  $$  __$$\ $$ |$$  _____|\_$$  _|        $$  __$$\ $$  __$$\       $$ | \____|\____|\____| $$ |
  //  \$$$$$$\    $$ |    $$ |  \__|$$ |$$ /        $$ |          $$$$$$$$ |$$ /  $$ |      $$ | $$$$\ $$$$\ $$$$\  $$ |
  //   \____$$\   $$ |$$\ $$ |      $$ |$$ |        $$ |$$\       $$   ____|$$ |  $$ |      \$$\ \____|\____|\____|$$  |
  //  $$$$$$$  |  \$$$$  |$$ |      $$ |\$$$$$$$\   \$$$$  |      \$$$$$$$\ \$$$$$$$ |       \$$$\               $$$  /
  //  \_______/    \____/ \__|      \__| \_______|   \____/        \_______| \____$$ |        \___|              \___/
  //                                                                              $$ |
  //                                                                              $$ |
  //                                                                              \__|
  //
  // (strictEq / isNew checks to assert for and
  //  against passing-by-reference in different
  //  situations)
  ////////////////////////////////////////////////




  ////////////////////////////////////////////////
  // example: '==='
  // result value should always be strictly equal (===)
  ////////////////////////////////////////////////

  { example: undefined, actual: {}, strictEq: true },
  { example: undefined, actual: {a:23,b:'asdg',c:true,d: {x:32,y:'sagd',z: [{a:2,b:'gsda',c:false}]}, e: [2]}, strictEq: true },
  { example: undefined, actual: [], strictEq: true },
  { example: undefined, actual: [{a:23,b:'asdg',c:true,d: {x:32,y:'sagd',z: [{a:2,b:'gsda',c:false}]}, e: [2]}], strictEq: true },
  { example: undefined, actual: /some regexp/, strictEq: true },
  { example: undefined, actual: function (){}, strictEq: true },
  { example: undefined, actual: new Date('November 5, 1605 GMT'), strictEq: true },
  { example: undefined, actual: new (require('stream').Readable)(), strictEq: true },
  { example: undefined, actual: new Buffer('asdf'), strictEq: true  },
  { example: undefined, actual: new Error('asdf'), strictEq: true },

  ////////////////////////////////////////////////////////////////////////////////////////////////
  // example: nested '===' in dictionaries/arrays
  // TODO: needs to be tested some other way, since we'd be checking reference passing within another nested obj.
  // also check against strict equality between sub-values (`!==` between nested things...)
  // This is prbly eaiest if we just pull it out into a separate test; ie. don't make the test declarative.
  ////////////////////////////////////////////////////////////////////////////////////////////////


  ////////////////////////////////////////////////
  // example: {} should perform a deep copy on things
  ////////////////////////////////////////////////
  { example: {}, actual: {}, isNew: true },
  { example: {}, actual: {a:23,b:'asdg',c:true,d: {x:32,y:'sagd',z: [{a:2,b:'gsda',c:false}]}, e: [2]}, isNew: true },

  ////////////////////////////////////////////////
  // example: {...} should perform a shallow copy
  // Assert pass-by-reference behavior for more specific `example`
  ////////////////////////////////////////////////
  {
    example: { id: 123, title: 'Scott', body: 'Scott', votes: 33, resolved: true },
    actual: {},
    result:  { id: 0, title: '', body: '', votes: 0, resolved: false },
    isNew: true
  },
  {
    example: { id: 123, title: 'Scott', body: 'Scott', votes: 33, resolved: true },
    actual: {a:23,b:'asdg',c:true,d: {x:32,y:'sagd',z: [{a:2,b:'gsda',c:false}]}, e: [2]},
    result:  { id: 0, title: '', body: '', votes: 0, resolved: false },
    isNew: true
  },
  {
    example: { id: 123, title: 'Scott', body: 'Scott', votes: 33, resolved: true, something: '===' },
    actual: {},
    result:  { id: 0, title: '', body: '', votes: 0, resolved: false, something: null },
    isNew: true
  },
  {
    example: { id: 123, title: 'Scott', body: 'Scott', votes: 33, resolved: true, something: '===' },
    actual: {a:23,b:'asdg',c:true,d: {x:32,y:'sagd',z: [{a:2,b:'gsda',c:false}]}, e: [2]},
    result:  { id: 0, title: '', body: '', votes: 0, resolved: false, something: null },
    isNew: true
  },
  {
    example: { id: 123, title: 'Scott', body: 'Scott', votes: 33, resolved: true, something: '===' },
    actual: { something: new Date('November 5, 1605 GMT')},
    result:  { id: 0, title: '', body: '', votes: 0, resolved: false, something: new Date('November 5, 1605 GMT') },
    isNew: true
  },
  {
    example: { id: 123, title: 'Scott', body: 'Scott', votes: 33, resolved: true, something: '===' },
    actual: { something: new Date('November 5, 1605 GMT'), a:23,b:'asdg',c:true,d: {x:32,y:'sagd',z: [{a:2,b:'gsda',c:false}]}, e: [2]},
    result:  { id: 0, title: '', body: '', votes: 0, resolved: false, something: new Date('November 5, 1605 GMT') },
    isNew: true
  },

  ////////////////////////////////////////////////
  // example: [] should copy things
  ////////////////////////////////////////////////
  { example: [], actual: [], isNew: true },
  { example: [], actual: [{a:23,b:'asdg',c:true,d: {x:32,y:'sagd',z: [{a:2,b:'gsda',c:false}]}, e: [2]}], isNew: true },

  ////////////////////////////////////////////////
  // example: {...} should perform a shallow copy
  // Assert pass-by-reference behavior for more specific `example`s
  ////////////////////////////////////////////////
  {
    example: [{ id: 123, title: 'Scott', body: 'Scott', votes: 0, resolved: true }],
    actual: [],
    result: [],
    isNew: true
  },
  {
    example: [{ id: 123, title: 'Scott', body: 'Scott', votes: 0, resolved: true }],
    actual: [{a:23,b:'asdg',c:true,d: {x:32,y:'sagd',z: [{a:2,b:'gsda',c:false}]}, e: [2]}],
    result: [{ id: 0, title: '', body: '', votes: 0, resolved: false }],
    isNew: true
  },
  {
    example: [{ id: 123, title: 'Scott', body: 'Scott', votes: 33, resolved: true, something: '===' }],
    actual: [],
    result:  [],
    isNew: true
  },
  {
    example: [{ id: 123, title: 'Scott', body: 'Scott', votes: 33, resolved: true, something: '===' }],
    actual: [{a:23,b:'asdg',c:true,d: {x:32,y:'sagd',z: [{a:2,b:'gsda',c:false}]}, e: [2]}],
    result:  [{ id: 0, title: '', body: '', votes: 0, resolved: false, something: null }],
    isNew: true
  },
  {
    example: [{ id: 123, title: 'Scott', body: 'Scott', votes: 33, resolved: true, something: '===' }],
    actual: [{ something: new Date('November 5, 1605 GMT')}],
    result:  [{ id: 0, title: '', body: '', votes: 0, resolved: false, something: new Date('November 5, 1605 GMT') }],
    isNew: true
  },
  {
    example: [{ id: 123, title: 'Scott', body: 'Scott', votes: 33, resolved: true, something: '===' }],
    actual: [{ something: new Date('November 5, 1605 GMT'), a:23,b:'asdg',c:true,d: {x:32,y:'sagd',z: [{a:2,b:'gsda',c:false}]}, e: [2]}],
    result:  [{ id: 0, title: '', body: '', votes: 0, resolved: false, something: new Date('November 5, 1605 GMT') }],
    isNew: true
  },


  ////////////////////////////////////////////////
  // objects which contain other crazy objects
  // with no `constructor` should not throw errors
  ////////////////////////////////////////////////
  {
    example: [{
      id: 123,
      title: 'Robinson Crusoe',
      surprise: {}
    }],
    actual: [{
      title: 'Hank the Cowdog',
      surprise: (function(){
        function Dog(){}
        var rover = new Dog();
        rover.coolProps = 'wow so cool';
        rover.constructo = 'hmm maybe ill try really annoying property names!';
        rover.prototype = null;
        rover.__proto__ = null;
        rover.constructor = null;
        // hehehehehhe
        return rover;
      })()
    }],
    result: [{
      id: 0,
      title: 'Hank the Cowdog',
      surprise: {
        coolProps: 'wow so cool',
        constructo: 'hmm maybe ill try really annoying property names!',
        prototype: null,
        constructor: null
      }
    }]
  }


];
