//  ██████╗ ████████╗████████╗ ██████╗    ███████╗██████╗ ███████╗ ██████╗
//  ██╔══██╗╚══██╔══╝╚══██╔══╝██╔════╝    ██╔════╝██╔══██╗██╔════╝██╔════╝    ██╗██╗
//  ██████╔╝   ██║      ██║   ██║         ███████╗██████╔╝█████╗  ██║         ╚═╝╚═╝
//  ██╔══██╗   ██║      ██║   ██║         ╚════██║██╔═══╝ ██╔══╝  ██║         ██╗██╗
//  ██║  ██║   ██║      ██║   ╚██████╗    ███████║██║     ███████╗╚██████╗    ╚═╝╚═╝
//  ╚═╝  ╚═╝   ╚═╝      ╚═╝    ╚═════╝    ╚══════╝╚═╝     ╚══════╝ ╚═════╝
//
//  ██╗   ██╗ █████╗ ██╗     ██╗██████╗  █████╗ ████████╗██╗ ██████╗ ███╗   ██╗
//  ██║   ██║██╔══██╗██║     ██║██╔══██╗██╔══██╗╚══██╔══╝██║██╔═══██╗████╗  ██║
//  ██║   ██║███████║██║     ██║██║  ██║███████║   ██║   ██║██║   ██║██╔██╗ ██║
//  ╚██╗ ██╔╝██╔══██║██║     ██║██║  ██║██╔══██║   ██║   ██║██║   ██║██║╚██╗██║
//   ╚████╔╝ ██║  ██║███████╗██║██████╔╝██║  ██║   ██║   ██║╚██████╔╝██║ ╚████║
//    ╚═══╝  ╚═╝  ╚═╝╚══════╝╚═╝╚═════╝ ╚═╝  ╚═╝   ╚═╝   ╚═╝ ╚═════╝ ╚═╝  ╚═══╝
//

// Export the array of tests below
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

  { example: 'foo', actual: {}, error: true },
  { example: 'foo', actual: {foo:'bar'}, error: true },
  { example: 'foo', actual: {foo:{bar:{baz:{}}}}, error: true },
  { example: 'foo', actual: {foo:['bar']}, error: true },
  { example: 'foo', actual: {foo:{bar:{baz:[{}]}}}, error: true },

  { example: 'foo', actual: [], error: true },
  { example: 'foo', actual: ['asdf'], error: true },
  { example: 'foo', actual: [''], error: true },
  { example: 'foo', actual: [235], error: true },
  { example: 'foo', actual: [false], error: true },
  { example: 'foo', actual: [{}], error: true },
  { example: 'foo', actual: [{foo:'bar'}], error: true },

  { example: 'foo', actual: undefined, error: true },

  { example: 'foo', actual: NaN, error: true },
  { example: 'foo', actual: Infinity, error: true },
  { example: 'foo', actual: -Infinity, error: true },
  { example: 'foo', actual: null, error: true },

  { example: 'foo', actual: /some regexp/, error: true },
  { example: 'foo', actual: function(){}, error: true },
  { example: 'foo', actual: new Date('November 5, 1605 GMT'), result: '1605-11-05T00:00:00.000Z' },
  { example: 'foo', actual: new (require('stream').Readable)(), error: true },
  { example: 'foo', actual: new Buffer('asdf'), error: true },
  { example: 'foo', actual: new Error('asdf'), error: true },

  ////////////////////////////////////////////
  // NUMBERS
  ////////////////////////////////////////////

  { example: 123, actual: 'bar', error: true },
  { example: 123, actual: '', error: true },
  { example: 123, actual: '0', result: 0 },
  { example: 123, actual: '1', result: 1 },
  { example: 123, actual: '-1.1', result: -1.1 },
  { example: 123, actual: 'NaN', error: true },
  { example: 123, actual: 'undefined', error: true },
  { example: 123, actual: 'null', error: true },
  { example: 123, actual: '-Infinity', error: true },
  { example: 123, actual: 'Infinity', error: true },

  { example: 123, actual: 0, result: 0 },
  { example: 123, actual: 1, result: 1 },
  { example: 123, actual: -1.1, result: -1.1 },
  { example: 123, actual: -0, result: 0 },
  { example: 123, actual: +0, result: 0 },

  { example: 123, actual: true, result: 1 },
  { example: 123, actual: false, result: 0 },

  { example: 123, actual: {}, error: true },
  { example: 123, actual: {foo:'bar'}, error: true },
  { example: 123, actual: {foo:{bar:{baz:{}}}}, error: true },
  { example: 123, actual: {foo:['bar']}, error: true },
  { example: 123, actual: {foo:{bar:{baz:[{}]}}}, error: true },

  { example: 123, actual: [], error: true },
  { example: 123, actual: ['asdf'], error: true },
  { example: 123, actual: [''], error: true },
  { example: 123, actual: [235], error: true },
  { example: 123, actual: [false], error: true },
  { example: 123, actual: [{}], error: true },
  { example: 123, actual: [{foo:'bar'}], error: true },

  { example: 123, actual: undefined, error: true },

  { example: 123, actual: NaN, error: true },
  { example: 123, actual: Infinity, error: true },
  { example: 123, actual: -Infinity, error: true },
  { example: 123, actual: null, error: true },

  { example: 123, actual: /some regexp/, error: true },
  { example: 123, actual: function(){}, error: true },
  { example: 123, actual: new Date('November 5, 1605 GMT'), result: -11491632000000 },
  { example: 123, actual: new (require('stream').Readable)(), error: true },
  { example: 123, actual: new Buffer('asdf'), error: true },
  { example: 123, actual: new Error('asdf'), error: true },

  ////////////////////////////////////////////
  // BOOLEANS
  ////////////////////////////////////////////
  { example: true, actual: 'bar', error: true },
  { example: true, actual: '', error: true },
  { example: true, actual: '-1.1', error: true },
  { example: true, actual: 'NaN', error: true },
  { example: true, actual: 'undefined', error: true },
  { example: true, actual: 'null', error: true },
  { example: true, actual: '-Infinity', error: true },
  { example: true, actual: 'Infinity', error: true },
  { example: true, actual: 'true', result: true },
  { example: true, actual: 'false', result: false },
  { example: true, actual: '0', result: false },
  { example: true, actual: '1', result: true },

  { example: true, actual: 0, result: false },
  { example: true, actual: 1, result: true },
  { example: true, actual: -1.1, error: true },
  { example: true, actual: -0, result: false },
  { example: true, actual: +0, result: false },

  { example: true, actual: true, result: true },
  { example: true, actual: false, result: false },

  { example: true, actual: {}, error: true },
  { example: true, actual: {foo:'bar'}, error: true },
  { example: true, actual: {foo:{bar:{baz:{}}}}, error: true },
  { example: true, actual: {foo:['bar']}, error: true },
  { example: true, actual: {foo:{bar:{baz:[{}]}}}, error: true },

  { example: true, actual: [], error: true },
  { example: true, actual: ['asdf'], error: true },
  { example: true, actual: [''], error: true },
  { example: true, actual: [235], error: true },
  { example: true, actual: [false], error: true },
  { example: true, actual: [{}], error: true },
  { example: true, actual: [{foo:'bar'}], error: true },

  { example: true, actual: undefined, error: true },

  { example: true, actual: NaN, error: true },
  { example: true, actual: Infinity, error: true },
  { example: true, actual: -Infinity, error: true },
  { example: true, actual: null, error: true },

  { example: true, actual: /some regexp/, error: true },
  { example: true, actual: function(){}, error: true },
  { example: true, actual: new Date('November 5, 1605 GMT'), error: true },
  { example: true, actual: new (require('stream').Readable)(), error: true },
  { example: true, actual: new Buffer('asdf'), error: true },
  { example: true, actual: new Error('asdf'), error: true },

  ////////////////////////////////////////////
  // DICTIONARIES (json-serializable, except `null` not allowed)
  ////////////////////////////////////////////

  { example: {}, actual: 'bar', error: true },
  { example: {}, actual: 123, error: true },
  { example: {}, actual: true, error: true },

  { example: {}, actual: {}, result: {} },
  { example: {}, actual: {foo:'bar'}, result: {foo:'bar'} },
  { example: {}, actual: {foo:{bar:{baz:{}}}}, result: {foo:{bar:{baz:{}}}} },
  { example: {}, actual: {foo:['bar']}, result: {foo:['bar']} },
  { example: {}, actual: {foo:{bar:{baz:[{}]}}}, result: {foo:{bar:{baz:[{}]}}} },

  { example: {}, actual: [], error: true },
  { example: {}, actual: ['asdf'], error: true },
  { example: {}, actual: [''], error: true },
  { example: {}, actual: [235], error: true },
  { example: {}, actual: [false], error: true },
  { example: {}, actual: [{}], error: true },
  { example: {}, actual: [{foo:'bar'}], error: true },

  { example: {}, actual: undefined, error: true },

  { example: {}, actual: NaN, error: true },
  { example: {}, actual: Infinity, error: true },
  { example: {}, actual: -Infinity, error: true },
  { example: {}, actual: null, error: true },

  { example: {}, actual: /some regexp/, error: true },
  { example: {}, actual: function(){}, error: true },
  { example: {}, actual: new Date('November 5, 1605 GMT'), error: true },
  // Note that the enumerable properties for Streams vary between Node.js versions.
  { example: {}, actual: new (require('stream').Readable)(), error: true },
  // Note that the enumerable properties for Buffers vary between Node.js versions.
  { example: {}, actual: new Buffer('asdf'), error: true },
  { example: {}, actual: new Error('asdf'), error: true },


  ////////////////////////////////////////////
  // ARRAYS (json-serializable, except `null` not allowed)
  // (all of the tests below pass w/ [], not necessarily ['==='])
  ////////////////////////////////////////////

  { example: [], actual: 'bar', error: true },
  { example: [], actual: 123, error: true },
  { example: [], actual: true, error: true },

  { example: [], actual: {}, error: true },
  { example: [], actual: {foo:'bar'}, error: true },
  { example: [], actual: {foo:{bar:{baz:{}}}}, error: true },
  { example: [], actual: {foo:['bar']}, error: true },
  { example: [], actual: {foo:{bar:{baz:[{}]}}}, error: true },

  { example: [], actual: [], result: [] },
  { example: [], actual: ['asdf'], result: ['asdf'] },
  { example: [], actual: [''], result: [''] },
  { example: [], actual: [235], result: [235] },
  { example: [], actual: [false], result: [false] },
  { example: [], actual: [{}], result: [{}] },
  { example: [], actual: [{foo:'bar'}], result: [{foo: 'bar'}] },

  { example: [], actual: undefined, error: true },

  { example: [], actual: NaN, error: true },
  { example: [], actual: Infinity, error: true },
  { example: [], actual: -Infinity, error: true },
  { example: [], actual: null, error: true },

  { example: [], actual: /some regexp/, error: true },
  { example: [], actual: function(){}, error: true },
  { example: [], actual: new Date('November 5, 1605 GMT'), error: true },
  { example: [], actual: new (require('stream').Readable)(), error: true }, // TODO: consider enhancing this behavior to concat the stream contents? Needs community discussion.
  // Skip Buffer tests for now since the enumerable properties vary between Node.js versions.
  // { example: [], actual: new Buffer('asdf'), result: [ 97, 115, 100, 102 ] },
  // Note: we could bring back support for this by explicitly filtering properties of buffers in `.exec()`
  // TODO: but actually, this should cause an error- use `example: '==='` for things like this.
  { example: [], actual: new Error('asdf'), error: true },


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
  { example: {}, actual: { x: NaN }, result: {x:0} },
  { example: {}, actual: { x: Infinity }, result: {x:0} },
  { example: {}, actual: { x: -Infinity }, result: {x:0} },
  { example: {}, actual: { x: null }, result: {x: null} },
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
  // Skip Readable stream tests for now since the enumerable properties vary between Node.js versions.
  // { example: [], actual: [new (require('stream').Readable)()], result: [ { _readableState: {},readable: true,_events: {},_maxListeners: 10 }] },
  // Skip Buffer stream tests for now since the enumerable properties vary between Node.js versions.
  // { example: [], actual: [new Buffer('asdf')], result: [{}] },
  (function (){
    var e = new Error('asdf');
    e.stack = 'fake_error';
    return { example: [], actual: [e], result: ['fake_error'] };
  })(),



  ////////////////////////////////////////////
  // example: '*'  (any JSON-serializable value)
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

  { example: '*', actual: undefined, error: true,  },

  { example: '*', actual: NaN, result: 0  },
  { example: '*', actual: Infinity, result: 0  },
  { example: '*', actual: -Infinity, result: 0  },

  { example: '*', actual: null, result: null,  },

  { example: '*', actual: /some regexp/gi, result: '/some regexp/gi' },
  { example: '*', actual: new Date('November 5, 1605 GMT'), result: '1605-11-05T00:00:00.000Z' },
  { example: '*', actual: (function(){var err=new Error();err.stack='test';return err;})(), result: 'test' },
  { example: '*', actual: function(){}, result: 'function (){}' },
  { example: '*', actual: new (require('stream').Readable)(), error: true },



  ////////////////////////////////////////////
  // RECURSIVE OBJECTS
  ////////////////////////////////////////////

  // Missing keys (general case)
  { example: {a:1, b:'hi', c: false}, actual: {a: 11}, error: true  },
  { example: {a:1, b:'hi', c: false}, actual: {a: 23, b: undefined, c: undefined}, error: true  },
  { example: {a:1}, actual: {a: undefined}, error: true  },
  { example: {a:1}, actual: {}, error: true  },

  // Missing keys (`===` case)
  { example: {a:'==='}, actual: {a: undefined}, error: true  },
  { example: {a:'==='}, actual: {}, error: true  },

  // Strip keys with `undefined` values (`{}` case)
  { example: {}, actual: {a: undefined, b: 3}, result: {b: 3}  },
  { example: [{}], actual: [{a: undefined, b: 3}], result: [{b: 3}]  },
  { example: {x:{}}, actual: {x:{a: undefined, b: 3}}, result: {x:{b: 3}}  },

  // Don't strip keys with `undefined` values (`===` case)
  { example: '===', actual: {a: undefined, b: 3}, result: {a: undefined, b: 3}  },

  // Extra keys:
  { example: {a:1, b:'hi'}, actual: {a: 23, b: 'stuff', d: true}, result: {a: 23, b: 'stuff'}  },
  { example: {a:1, b:'hi'}, actual: {a: 23, b: 'stuff', d: undefined}, result: {a: 23, b: 'stuff'}  },





  ////////////////////////////////////////////
  // example: ===
  ////////////////////////////////////////////

  { example: '===', actual: 'bar', result: 'bar',  },
  { example: '===', actual: '', result: '',  },
  { example: '===', actual: '-1.1', result: '-1.1',  },
  { example: '===', actual: 'NaN', result: 'NaN',  },
  { example: '===', actual: 'undefined', result: 'undefined',  },
  { example: '===', actual: 'null', result: 'null',  },
  { example: '===', actual: '-Infinity', result: '-Infinity',  },
  { example: '===', actual: 'Infinity', result: 'Infinity',  },
  { example: '===', actual: 'true', result: 'true',  },
  { example: '===', actual: 'false', result: 'false',  },
  { example: '===', actual: '0', result: '0',  },
  { example: '===', actual: '1', result: '1',  },

  { example: '===', actual: -0, result: -0,  },
  { example: '===', actual: +0, result: +0,  },
  { example: '===', actual: 0, result: 0,  },
  { example: '===', actual: 1, result: 1,  },
  { example: '===', actual: -1.1, result: -1.1,  },

  { example: '===', actual: true, result: true,  },
  { example: '===', actual: false, result: false,  },

  { example: '===', actual: {}, result: {},  },
  { example: '===', actual: {foo:'bar'}, result: {foo:'bar'},  },
  { example: '===', actual: {foo:{bar:{baz:{}}}}, result: {foo:{bar:{baz:{}}}},  },
  { example: '===', actual: {foo:['bar']}, result: {foo:['bar']},  },
  { example: '===', actual: {foo:{bar:{baz:[{}]}}}, result: {foo:{bar:{baz:[{}]}}},  },

  { example: '===', actual: [], result: [],  },
  { example: '===', actual: ['asdf'], result: ['asdf'],  },
  { example: '===', actual: [''], result: [''],  },
  { example: '===', actual: [235], result: [235],  },
  { example: '===', actual: [false], result: [false],  },
  { example: '===', actual: [{}], result: [{}],  },
  { example: '===', actual: [{foo:'bar'}], result: [{foo:'bar'}],  },

  { example: '===', actual: undefined, error: true  },

  { example: '===', actual: NaN, result: NaN,  },
  { example: '===', actual: Infinity, result: Infinity,  },
  { example: '===', actual: -Infinity, result: -Infinity,  },
  { example: '===', actual: null, result: null,  },




  ////////////////////////////////////////////
  // example: '->'
  ////////////////////////////////////////////

  { example: '->', actual: 'bar', error: true },
  { example: '->', actual: '', error: true },
  { example: '->', actual: '-1.1', error: true },
  { example: '->', actual: 'NaN', error: true },
  { example: '->', actual: 'undefined', error: true },
  { example: '->', actual: 'null', error: true },
  { example: '->', actual: '-Infinity', error: true },
  { example: '->', actual: 'Infinity', error: true },
  { example: '->', actual: 'true', error: true },
  { example: '->', actual: 'false', error: true },
  { example: '->', actual: '0', error: true },
  { example: '->', actual: '1', error: true },

  { example: '->', actual: -0, error: true },
  { example: '->', actual: +0, error: true },
  { example: '->', actual: 0, error: true },
  { example: '->', actual: 1, error: true },
  { example: '->', actual: -1.1, error: true },

  { example: '->', actual: true, error: true },
  { example: '->', actual: false, error: true },

  { example: '->', actual: {}, error: true },
  { example: '->', actual: {foo:'bar'}, error: true },
  { example: '->', actual: {foo:{bar:{baz:{}}}}, error: true },
  { example: '->', actual: {foo:['bar']}, error: true },
  { example: '->', actual: {foo:{bar:{baz:[{}]}}}, error: true },

  { example: '->', actual: [], error: true },
  { example: '->', actual: ['asdf'], error: true },
  { example: '->', actual: [''], error: true },
  { example: '->', actual: [235], error: true },
  { example: '->', actual: [false], error: true },
  { example: '->', actual: [{}], error: true },
  { example: '->', actual: [{foo:'bar'}], error: true },

  { example: '->', actual: undefined, error: true  },

  { example: '->', actual: NaN, error: true },
  { example: '->', actual: Infinity, error: true },
  { example: '->', actual: -Infinity, error: true },
  { example: '->', actual: null, error: true },

  { example: '->', actual: function (inputs, exits){return exits.success();}, result: function (inputs, exits){return exits.success();} },





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

  // Some basic deep dicts and array
  {
    example: {a:1, b:'hi', c: false},
    actual: {a: 23},
    error: true
  },
  {
    example: {a:1, b:'hi', c: false},
    actual: {a: 23, d: true},
    error: true
  },

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

  // Reject when there are missing or undefined required keys
  { example: {b: 235}, actual: {b: undefined}, error: true  },
  { example: {b: 235}, actual: {}, error: true  },

  // Strip extra keys with `undefined` values (`{...}` case)
  { example: {b: 235}, actual: {a: undefined, b: 3}, result: {b: 3}  },
  // Strip extra nested keys with `undefined` values (`{...}` case)
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

  // Prune `undefined` items from arrays and nested arrays (`[]` case)
  {
    example: [],
    actual: [{a:3}, undefined, {a: 5}, undefined, {a: 7}, {a:9, b: [undefined, 9,2,4,undefined,8]}],
    result: [{a: 3}, {a: 5}, {a:7}, {a:9, b:[9,2,4,8]}]
  },

  // DO allow `undefined` items from arrays and nested arrays (`===` case)
  {
    example: '===',
    actual: [{a:3}, undefined, {a: 5}, undefined, {a: 7}, {a:9, b: [undefined, 9,2,4,undefined,8]}],
    result: [{a:3}, undefined, {a: 5}, undefined, {a: 7}, {a:9, b: [undefined, 9,2,4,undefined,8]}]
  },

  // Don't allow `undefined` items from arrays and nested arrays (`[===]` case)
  // (because '===' does not allow `undefined`)
  {
    example: ['==='],
    actual: [{a:3}, undefined, {a: 5}, undefined, {a: 7}, {a:9, b: [undefined, 9,2,4,undefined,8]}],
    result: [{a:3}, {a: 5}, {a: 7}, {a:9, b: [undefined, 9,2,4,undefined,8]}]
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



  {
    example: [{}],
    actual: [ { name: 'Lucy' }, { name: 'Ricky' }, { name: 'Louise' }, { name: 'Estelle' } ],
    expected: [ { name: 'Lucy' }, { name: 'Ricky' }, { name: 'Louise' }, { name: 'Estelle' } ]
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

  { example: '===', actual: /some regexp/, strictEq: true },
  { example: '===', actual: function (){}, strictEq: true },
  { example: '===', actual: new Date('November 5, 1605 GMT'), strictEq: true },
  { example: '===', actual: new (require('stream').Readable)(), strictEq: true },
  { example: '===', actual: new Buffer('asdf'), strictEq: true },
  { example: '===', actual: new Error('asdf'), strictEq: true },


];


