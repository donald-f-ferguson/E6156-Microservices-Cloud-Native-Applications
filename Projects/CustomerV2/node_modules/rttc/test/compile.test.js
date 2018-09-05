var assert = require('assert');
var rttc = require('../');

describe('.compile()', function() {


// *  |  actual                 |  util.inspect()                           |  rttc.compile()                      |
// *  | ----------------------- | ----------------------------------------- | -------------------------------------|
// *  | a function              | `[Function: foo]`                         | `'function foo (){}'`                |
// *  | a Date                  | `Tue May 26 2015 20:05:37 GMT-0500 (CDT)` | `'2015-05-27T01:06:37.072Z'`         |
// *  | a RegExp                | `/foo/gi`                                 | `'/foo/gi/'`                         |
// *  | an Error                | `[Error]`                                 | `'Error\n    at repl:1:24\n...'`     |
// *  | a deeply nested thing   | `{ a: { b: { c: [Object] } } }`           | `{ a: { b: { c: { d: {} } } } }`     |
// *  | a circular thing        | `{ y: { z: [Circular] } }`                | `{ y: { z: '[Circular ~]' } }`       |
// *  | undefined               | `undefined`                               | `null`                               |
// *  | Readable (Node stream)  | `{ _readableState: { highWaterMar..}}`    | `null`                               |
// *  | Buffer (Node bytestring)| `<Buffer 61 62 63>`                       | `[ 97, 98, 99 ]`                     |

  it('should wrap strings in single quotes', function() {
    _assertCompiledResultIsCorrect({
      value: 'foo',
      expected: '\'foo\''
    });
    _assertCompiledResultIsCorrect({
      value: '"foo"',
      expected: '\'"foo"\''
    });
    _assertCompiledResultIsCorrect({
      value: '999999999',
      expected: '\'999999999\''
    });
  });

  it('should return string version of number', function() {
    _assertCompiledResultIsCorrect({
      value: 9999999999,
      expected: '9999999999'
    });
  });

  it('should return string version of boolean', function() {
    _assertCompiledResultIsCorrect({
      value: false,
      expected: 'false'
    });
    _assertCompiledResultIsCorrect({
      value: true,
      expected: 'true'
    });
  });


  it('should `.toString()` function BUT NOT wrap it in single quotes!!', function() {
    _assertCompiledResultIsCorrect({
      value: function foobar(x,y){ return x+y; },
      expected: 'function foobar(x,y){ return x+y; }'
    });
  });

  it('should remove any whitespace between function name and arguments declaration', function() {
    _assertCompiledResultIsCorrect({
      value: function foobar   (x,y){ return x+y; },
      expected: 'function foobar(x,y){ return x+y; }'
    });
  });

  it('should get .stack property of Error and wrap it in single quotes', function() {
    var err = new Error('some passive aggressive message');
    err.stack = 'setting this stack property to something inane so that it\'s easy to compare, and so tests don\'t depend on file paths from the stack trace of my computer';

    _assertCompiledResultIsCorrect({
      value: err,
      expected: '\'setting this stack property to something inane so that it\\\'s easy to compare, and so tests don\\\'t depend on file paths from the stack trace of my computer\''
    });
  });

  it('should get timezone-agnostic ISO 6801 timestamp for Date and wrap it in single quotes', function() {
    _assertCompiledResultIsCorrect({
      value: new Date('November 5, 1605 GMT'),
      expected: '\'1605-11-05T00:00:00.000Z\''
    });
  });

  it('should call `.toString()` on RegExp, then wrap it in single quotes', function() {
    _assertCompiledResultIsCorrect({
      value: /waldo/gi,
      expected: '\'/waldo/gi\''
    });
  });

  it('should return string that looks like `null` for `undefined` and `null`', function() {
    _assertCompiledResultIsCorrect({
      value: undefined,
      expected: 'null'
    });
    _assertCompiledResultIsCorrect({
      value: null,
      expected: 'null'
    });
  });

  it('should return string that looks like `0` for weird values like Infinity, -Infinity, and NaN', function() {
    _assertCompiledResultIsCorrect({
      value: -Infinity,
      expected: '0'
    });
    _assertCompiledResultIsCorrect({
      value: Infinity,
      expected: '0'
    });
    _assertCompiledResultIsCorrect({
      value: NaN,
      expected: '0'
    });
  });

  it('should return string that looks like `null` for stream.Readable instances', function() {
    _assertCompiledResultIsCorrect({
      value: new (require('stream').Readable)(),
      expected: 'null'
    });
  });

  // TODO: make this work
  it.skip('should return string that looks like `null` for Buffer instances`', function() {
    _assertCompiledResultIsCorrect({
      value: new Buffer('alive with the glory of love'),
      expected: 'null'
    });
  });

  it('should return string that looks like dictionary for dictionary', function() {
    _assertCompiledResultIsCorrect({
      value: {},
      expected: '{}'
    });
    _assertCompiledResultIsCorrect({
      value: { a: 'b' },
      expected: '{ a: \'b\' }'
    });
  });

  it('should return string that looks like array for array', function() {
    _assertCompiledResultIsCorrect({
      value: [],
      expected: '[]'
    });
    _assertCompiledResultIsCorrect({
      value: [ 'a', 'b', 45 ],
      expected: '[ \'a\', \'b\', 45 ]'
    });
  });

  it('should put spaces on the insides of brackets/braces for arrays/dictionaries, and remove extraneous spaces between keys and values, and between array items', function() {
    _assertCompiledResultIsCorrect({
      value: {a: 'b'},
      expected: '{ a: \'b\' }'
    });
    _assertCompiledResultIsCorrect({
      value: ['a','b',45],
      expected: '[ \'a\', \'b\', 45 ]'
    });
    _assertCompiledResultIsCorrect({
      value: ['a','b',45,{x:    'stuff!'}],
      expected: '[ \'a\', \'b\', 45, { x: \'stuff!\' } ]'
    });
    _assertCompiledResultIsCorrect({
      value: ['a','b',45,[  {x:    'stuff!'}, null,    true]    ],
      expected: '[ \'a\', \'b\', 45, [ { x: \'stuff!\' }, null, true ] ]'
    });
  });

  it('should start using newlines when dictionaries have values that end up taking more characters when rendered (key length doesn\'t seem to matter)', function() {
    _assertCompiledResultIsCorrect({
      value: {a: 'b', c: 'dogfooddogfooddogfooddogfooddogfooddogfooddogfooddogfood' },
      expected: '{ a: \'b\',\n  c: \'dogfooddogfooddogfooddogfooddogfooddogfooddogfooddogfood\' }'
    });
    _assertCompiledResultIsCorrect({
      value: {a: 'b', catfoodcatfoodcatfoodcatfoodcatfood: 'd' },
      expected: '{ a: \'b\', catfoodcatfoodcatfoodcatfoodcatfood: \'d\' }'
    });
  });

  it('should act like `dehydrate` for nested values, and follow the same indentation/newline formatting rules as at the top-level', function() {

    _assertCompiledResultIsCorrect({
      value: [{
        someDate: new Date('November 5, 1605 GMT'),
        someRegExp: /waldo/gi,
        someError: (function(){
          var err = new Error('some passive aggressive message');
          err.stack = 'setting this stack property to something inane so that it\'s easy to compare, and so tests don\'t depend on file paths from the stack trace of my computer';
          return err;
        })(),
        someFunction: function foobar(x,y){ return x+y; },
        weirdNumbers: [Infinity, -Infinity, NaN, -0, 0],
        weirdExistentials: [null, undefined],
        nodejsThings: {
          stream: new (require('stream').Readable)()
        }
      }],
      expected: '[ { someDate: \'1605-11-05T00:00:00.000Z\',\n    someRegExp: \'/waldo/gi\',\n    someError: \'setting this stack property to something inane so that it\\\'s easy to compare, and so tests don\\\'t depend on file paths from the stack trace of my computer\',\n    someFunction: function foobar(x,y){ return x+y; },\n    weirdNumbers: [ 0, 0, 0, 0, 0 ],\n    weirdExistentials: [ null ],\n    nodejsThings: { stream: null } } ]'
    });

  });


});



function _assertCompiledResultIsCorrect(opts){
  // console.log('ACTUAL:',rttc.compile(opts.value));
  // console.log('\n\n\nEXPECTING:',opts.expected);
  assert.strictEqual(typeof rttc.compile(opts.value), 'string');
  assert.strictEqual(rttc.compile(opts.value), opts.expected);
}
