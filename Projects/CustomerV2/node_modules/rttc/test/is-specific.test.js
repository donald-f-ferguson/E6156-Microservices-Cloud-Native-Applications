var util = require('util');
var assert = require('assert');
var _  = require('@sailshq/lodash');
var rttc = require('../');

describe('.isSpecific()', function() {

  // TODO: test that this doesn't go nuts given circular objects
  // (they should never be circular because they are type schemas, but still, for everyone's sanity)

  describe('using type schemas', function (){

    it('should consider string SPECIFIC', function() {
      assert(rttc.isSpecific('string'));
    });
    it('should consider number SPECIFIC', function() {
      assert(rttc.isSpecific('string'));
    });
    it('should consider boolean SPECIFIC', function() {
      assert(rttc.isSpecific('boolean'));
    });
    it('should consider lamda SPECIFIC', function() {
      assert(rttc.isSpecific('lamda'));
    });
    it('should consider generic dictionary NOT SPECIFIC', function() {
      assert(! rttc.isSpecific({}) );
    });
    it('should consider generic array NOT SPECIFIC', function() {
      assert(! rttc.isSpecific([]) );
    });
    it('should consider patterned dictionaries SPECIFIC', function() {
      assert(rttc.isSpecific({x: 'string'}) );
      assert(rttc.isSpecific({y:'number'}) );
      assert(rttc.isSpecific({z: 'boolean'}) );
      assert(rttc.isSpecific({l: 'lamda'}) );
      assert(rttc.isSpecific({foo:'string', bar: 'boolean', baz: 'number'}) );
      assert(rttc.isSpecific({x: ['string'], y: ['number'], z: ['boolean'], l:{a:{m:{d:{a:'lamda'}}}}  }) );
    });
    it('should consider patterned arrays SPECIFIC', function() {
      assert(rttc.isSpecific(['string']) );
      assert(rttc.isSpecific(['number']) );
      assert(rttc.isSpecific(['boolean']) );
      assert(rttc.isSpecific(['lamda']) );
      assert(rttc.isSpecific([{foo:'string', bar: 'boolean', baz: 'number'}]) );
      assert(rttc.isSpecific([['string']]) );
      assert(rttc.isSpecific([['number']]) );
      assert(rttc.isSpecific([['boolean']]) );
      assert(rttc.isSpecific([['lamda']]) );
      assert(rttc.isSpecific([[{foo:'string', bar: 'boolean', baz: 'number'}]]) );
    });
    it('should consider json NOT SPECIFIC', function() {
      assert(! rttc.isSpecific('json') );
    });
    it('should consider ref NOT SPECIFIC', function() {
      assert(! rttc.isSpecific('ref') );
    });
    it('should consider faceted/patterned things with nested json,ref,[],and {} as SPECIFIC by default', function (){
      assert(rttc.isSpecific({saltySurprise: 'json', x: 'string'}) );
      assert(rttc.isSpecific({saltySurprise: 'json', y:'number'}) );
      assert(rttc.isSpecific({saltySurprise: 'json', z: 'boolean'}) );
      assert(rttc.isSpecific({saltySurprise: 'json', l: 'lamda'}) );
      assert(rttc.isSpecific({saltySurprise: 'json', foo:'string', bar: 'boolean', baz: 'number'}) );
      assert(rttc.isSpecific({saltySurprise: 'json', x: ['string'], y: ['number'], z: ['boolean'], l:{a:{m:{d:{a:'lamda'}}}}  }) );
      assert(rttc.isSpecific([{saltySurprise: 'json', x: ['string'], y: ['number'], z: ['boolean'], l:{a:{m:{d:{a:'lamda'}}}}  }]) );
      assert(rttc.isSpecific(['json']) );
      assert(rttc.isSpecific([['json']]) );
      assert(rttc.isSpecific({saltySurprise: 'ref', x: 'string'}) );
      assert(rttc.isSpecific({saltySurprise: 'ref', y:'number'}) );
      assert(rttc.isSpecific({saltySurprise: 'ref', z: 'boolean'}) );
      assert(rttc.isSpecific({saltySurprise: 'ref', l: 'lamda'}) );
      assert(rttc.isSpecific({saltySurprise: 'ref', foo:'string', bar: 'boolean', baz: 'number'}) );
      assert(rttc.isSpecific({saltySurprise: 'ref', x: ['string'], y: ['number'], z: ['boolean'], l:{a:{m:{d:{a:'lamda'}}}}  }) );
      assert(rttc.isSpecific([{saltySurprise: 'ref', x: ['string'], y: ['number'], z: ['boolean'], l:{a:{m:{d:{a:'lamda'}}}}  }]) );
      assert(rttc.isSpecific(['ref']) );
      assert(rttc.isSpecific([['ref']]) );
      assert(rttc.isSpecific({saltySurprise: {}, x: 'string'}) );
      assert(rttc.isSpecific({saltySurprise: {}, y:'number'}) );
      assert(rttc.isSpecific({saltySurprise: {}, z: 'boolean'}) );
      assert(rttc.isSpecific({saltySurprise: {}, l: 'lamda'}) );
      assert(rttc.isSpecific({saltySurprise: {}, foo:'string', bar: 'boolean', baz: 'number'}) );
      assert(rttc.isSpecific({saltySurprise: {}, x: ['string'], y: ['number'], z: ['boolean'], l:{a:{m:{d:{a:'lamda'}}}}  }) );
      assert(rttc.isSpecific([{saltySurprise: {}, x: ['string'], y: ['number'], z: ['boolean'], l:{a:{m:{d:{a:'lamda'}}}}  }]) );
      assert(rttc.isSpecific([{}]) );
      assert(rttc.isSpecific([[{}]]) );
      assert(rttc.isSpecific({saltySurprise: [], x: 'string'}) );
      assert(rttc.isSpecific({saltySurprise: [], y:'number'}) );
      assert(rttc.isSpecific({saltySurprise: [], z: 'boolean'}) );
      assert(rttc.isSpecific({saltySurprise: [], l: 'lamda'}) );
      assert(rttc.isSpecific({saltySurprise: [], foo:'string', bar: 'boolean', baz: 'number'}) );
      assert(rttc.isSpecific({saltySurprise: [], x: ['string'], y: ['number'], z: ['boolean'], l:{a:{m:{d:{a:'lamda'}}}}  }) );
      assert(rttc.isSpecific([{saltySurprise: [], x: ['string'], y: ['number'], z: ['boolean'], l:{a:{m:{d:{a:'lamda'}}}}  }]) );
      assert(rttc.isSpecific([[]]) );
      assert(rttc.isSpecific([[[]]]) );
    });
    it('should consider faceted/patterned things with nested json,ref,[],and {} as NOT SPECIFIC if recursive flag is set', function (){
      assert(! rttc.isSpecific({saltySurprise: 'json', x: 'string'}, true) );
      assert(! rttc.isSpecific({saltySurprise: 'json', y:'number'}, true) );
      assert(! rttc.isSpecific({saltySurprise: 'json', z: 'boolean'}, true) );
      assert(! rttc.isSpecific({saltySurprise: 'json', l: 'lamda'}, true) );
      assert(! rttc.isSpecific({saltySurprise: 'json', foo:'string', bar: 'boolean', baz: 'number'}, true) );
      assert(! rttc.isSpecific({saltySurprise: 'json', x: ['string'], y: ['number'], z: ['boolean'], l:{a:{m:{d:{a:'lamda'}}}}  }, true) );
      assert(! rttc.isSpecific([{saltySurprise: 'json', x: ['string'], y: ['number'], z: ['boolean'], l:{a:{m:{d:{a:'lamda'}}}}  }], true) );
      assert(! rttc.isSpecific(['json'], true) );
      assert(! rttc.isSpecific([['json']], true) );
      assert(! rttc.isSpecific({saltySurprise: 'ref', x: 'string'}, true) );
      assert(! rttc.isSpecific({saltySurprise: 'ref', y:'number'}, true) );
      assert(! rttc.isSpecific({saltySurprise: 'ref', z: 'boolean'}, true) );
      assert(! rttc.isSpecific({saltySurprise: 'ref', l: 'lamda'}, true) );
      assert(! rttc.isSpecific({saltySurprise: 'ref', foo:'string', bar: 'boolean', baz: 'number'}, true) );
      assert(! rttc.isSpecific({saltySurprise: 'ref', x: ['string'], y: ['number'], z: ['boolean'], l:{a:{m:{d:{a:'lamda'}}}}  }, true) );
      assert(! rttc.isSpecific([{saltySurprise: 'ref', x: ['string'], y: ['number'], z: ['boolean'], l:{a:{m:{d:{a:'lamda'}}}}  }], true) );
      assert(! rttc.isSpecific(['ref'], true) );
      assert(! rttc.isSpecific([['ref']], true) );
      assert(! rttc.isSpecific({saltySurprise: {}, x: 'string'}, true) );
      assert(! rttc.isSpecific({saltySurprise: {}, y:'number'}, true) );
      assert(! rttc.isSpecific({saltySurprise: {}, z: 'boolean'}, true) );
      assert(! rttc.isSpecific({saltySurprise: {}, l: 'lamda'}, true) );
      assert(! rttc.isSpecific({saltySurprise: {}, foo:'string', bar: 'boolean', baz: 'number'}, true) );
      assert(! rttc.isSpecific({saltySurprise: {}, x: ['string'], y: ['number'], z: ['boolean'], l:{a:{m:{d:{a:'lamda'}}}}  }, true) );
      assert(! rttc.isSpecific([{saltySurprise: {}, x: ['string'], y: ['number'], z: ['boolean'], l:{a:{m:{d:{a:'lamda'}}}}  }], true) );
      assert(! rttc.isSpecific([{}], true) );
      assert(! rttc.isSpecific([[{}]], true) );
      assert(! rttc.isSpecific({saltySurprise: [], x: 'string'}, true) );
      assert(! rttc.isSpecific({saltySurprise: [], y:'number'}, true) );
      assert(! rttc.isSpecific({saltySurprise: [], z: 'boolean'}, true) );
      assert(! rttc.isSpecific({saltySurprise: [], l: 'lamda'}, true) );
      assert(! rttc.isSpecific({saltySurprise: [], foo:'string', bar: 'boolean', baz: 'number'}, true) );
      assert(! rttc.isSpecific({saltySurprise: [], x: ['string'], y: ['number'], z: ['boolean'], l:{a:{m:{d:{a:'lamda'}}}}  }, true) );
      assert(! rttc.isSpecific([{saltySurprise: [], x: ['string'], y: ['number'], z: ['boolean'], l:{a:{m:{d:{a:'lamda'}}}}  }], true) );
      assert(! rttc.isSpecific([[]], true) );
      assert(! rttc.isSpecific([[[]]], true) );
    });
  });


  describe('using exemplar schemas', function (){

    it('should consider string SPECIFIC', function() {
      assert(rttc.isSpecific('Regis Philbin', undefined, true));
    });
    it('should consider number SPECIFIC', function() {
      assert(rttc.isSpecific(130, undefined, true));
    });
    it('should consider boolean SPECIFIC', function() {
      assert(rttc.isSpecific(false, undefined, true));
    });
    it('should consider lamda SPECIFIC', function() {
      assert(rttc.isSpecific('->', undefined, true));
    });
    it('should consider generic dictionary NOT SPECIFIC', function() {
      assert(! rttc.isSpecific({}, undefined, true) );
    });
    it('should consider generic array NOT SPECIFIC', function() {
      assert(! rttc.isSpecific([], undefined, true) );
    });
    it('should consider patterned dictionaries SPECIFIC', function() {
      assert(rttc.isSpecific({x: 'Regis Philbin'}, undefined, true) );
      assert(rttc.isSpecific({y:130}, undefined, true) );
      assert(rttc.isSpecific({z: false}, undefined, true) );
      assert(rttc.isSpecific({l: '->'}, undefined, true) );
      assert(rttc.isSpecific({foo:'Regis Philbin', bar: false, baz: 130}, undefined, true) );
      assert(rttc.isSpecific({x: ['Regis Philbin'], y: [130], z: [false], l:{a:{m:{d:{a:'->'}}}}  }, undefined, true) );
    });
    it('should consider patterned arrays SPECIFIC', function() {
      assert(rttc.isSpecific(['Regis Philbin'], undefined, true) );
      assert(rttc.isSpecific([130], undefined, true) );
      assert(rttc.isSpecific([false], undefined, true) );
      assert(rttc.isSpecific(['->'], undefined, true) );
      assert(rttc.isSpecific([{foo:'Regis Philbin', bar: false, baz: 130}], undefined, true) );
      assert(rttc.isSpecific([['Regis Philbin']], undefined, true) );
      assert(rttc.isSpecific([[130]], undefined, true) );
      assert(rttc.isSpecific([[false]], undefined, true) );
      assert(rttc.isSpecific([['->']], undefined, true) );
      assert(rttc.isSpecific([[{foo:'Regis Philbin', bar: false, baz: 130}]], undefined, true) );
    });
    it('should consider json NOT SPECIFIC', function() {
      assert(! rttc.isSpecific('*', undefined, true) );
    });
    it('should consider ref NOT SPECIFIC', function() {
      assert(! rttc.isSpecific('===', undefined, true) );
    });
    it('should consider faceted/patterned things with nested json,ref,[],and {} as SPECIFIC by default', function (){
      assert(rttc.isSpecific({saltySurprise: '*', x: 'Regis Philbin'}, undefined, true) );
      assert(rttc.isSpecific({saltySurprise: '*', y:130}, undefined, true) );
      assert(rttc.isSpecific({saltySurprise: '*', z: false}, undefined, true) );
      assert(rttc.isSpecific({saltySurprise: '*', l: '->'}, undefined, true) );
      assert(rttc.isSpecific({saltySurprise: '*', foo:'Regis Philbin', bar: false, baz: 130}, undefined, true) );
      assert(rttc.isSpecific({saltySurprise: '*', x: ['Regis Philbin'], y: [130], z: [false], l:{a:{m:{d:{a:'->'}}}}  }, undefined, true) );
      assert(rttc.isSpecific([{saltySurprise: '*', x: ['Regis Philbin'], y: [130], z: [false], l:{a:{m:{d:{a:'->'}}}}  }], undefined, true) );
      assert(rttc.isSpecific(['*'], undefined, true) );
      assert(rttc.isSpecific([['*']], undefined, true) );
      assert(rttc.isSpecific({saltySurprise: '===', x: 'Regis Philbin'}, undefined, true) );
      assert(rttc.isSpecific({saltySurprise: '===', y:130}, undefined, true) );
      assert(rttc.isSpecific({saltySurprise: '===', z: false}, undefined, true) );
      assert(rttc.isSpecific({saltySurprise: '===', l: '->'}, undefined, true) );
      assert(rttc.isSpecific({saltySurprise: '===', foo:'Regis Philbin', bar: false, baz: 130}, undefined, true) );
      assert(rttc.isSpecific({saltySurprise: '===', x: ['Regis Philbin'], y: [130], z: [false], l:{a:{m:{d:{a:'->'}}}}  }, undefined, true) );
      assert(rttc.isSpecific([{saltySurprise: '===', x: ['Regis Philbin'], y: [130], z: [false], l:{a:{m:{d:{a:'->'}}}}  }], undefined, true) );
      assert(rttc.isSpecific(['==='], undefined, true) );
      assert(rttc.isSpecific([['===']], undefined, true) );
      assert(rttc.isSpecific({saltySurprise: {}, x: 'Regis Philbin'}, undefined, true) );
      assert(rttc.isSpecific({saltySurprise: {}, y:130}, undefined, true) );
      assert(rttc.isSpecific({saltySurprise: {}, z: false}, undefined, true) );
      assert(rttc.isSpecific({saltySurprise: {}, l: '->'}, undefined, true) );
      assert(rttc.isSpecific({saltySurprise: {}, foo:'Regis Philbin', bar: false, baz: 130}, undefined, true) );
      assert(rttc.isSpecific({saltySurprise: {}, x: ['Regis Philbin'], y: [130], z: [false], l:{a:{m:{d:{a:'->'}}}}  }, undefined, true) );
      assert(rttc.isSpecific([{saltySurprise: {}, x: ['Regis Philbin'], y: [130], z: [false], l:{a:{m:{d:{a:'->'}}}}  }], undefined, true) );
      assert(rttc.isSpecific([{}], undefined, true) );
      assert(rttc.isSpecific([[{}]], undefined, true) );
      assert(rttc.isSpecific({saltySurprise: [], x: 'Regis Philbin'}, undefined, true) );
      assert(rttc.isSpecific({saltySurprise: [], y:130}, undefined, true) );
      assert(rttc.isSpecific({saltySurprise: [], z: false}, undefined, true) );
      assert(rttc.isSpecific({saltySurprise: [], l: '->'}, undefined, true) );
      assert(rttc.isSpecific({saltySurprise: [], foo:'Regis Philbin', bar: false, baz: 130}, undefined, true) );
      assert(rttc.isSpecific({saltySurprise: [], x: ['Regis Philbin'], y: [130], z: [false], l:{a:{m:{d:{a:'->'}}}}  }, undefined, true) );
      assert(rttc.isSpecific([{saltySurprise: [], x: ['Regis Philbin'], y: [130], z: [false], l:{a:{m:{d:{a:'->'}}}}  }], undefined, true) );
      assert(rttc.isSpecific([[]], undefined, true) );
      assert(rttc.isSpecific([[[]]], undefined, true) );
    });
    it('should consider faceted/patterned things with nested json,ref,[],and {} as NOT SPECIFIC if recursive flag is set', function (){
      assert(! rttc.isSpecific({saltySurprise: '*', x: 'Regis Philbin'}, true, true) );
      assert(! rttc.isSpecific({saltySurprise: '*', y:130}, true, true) );
      assert(! rttc.isSpecific({saltySurprise: '*', z: false}, true, true) );
      assert(! rttc.isSpecific({saltySurprise: '*', l: '->'}, true, true) );
      assert(! rttc.isSpecific({saltySurprise: '*', foo:'Regis Philbin', bar: false, baz: 130}, true, true) );
      assert(! rttc.isSpecific({saltySurprise: '*', x: ['Regis Philbin'], y: [130], z: [false], l:{a:{m:{d:{a:'->'}}}}  }, true, true) );
      assert(! rttc.isSpecific([{saltySurprise: '*', x: ['Regis Philbin'], y: [130], z: [false], l:{a:{m:{d:{a:'->'}}}}  }], true, true) );
      assert(! rttc.isSpecific(['*'], true, true) );
      assert(! rttc.isSpecific([['*']], true, true) );
      assert(! rttc.isSpecific({saltySurprise: '===', x: 'Regis Philbin'}, true, true) );
      assert(! rttc.isSpecific({saltySurprise: '===', y:130}, true, true) );
      assert(! rttc.isSpecific({saltySurprise: '===', z: false}, true, true) );
      assert(! rttc.isSpecific({saltySurprise: '===', l: '->'}, true, true) );
      assert(! rttc.isSpecific({saltySurprise: '===', foo:'Regis Philbin', bar: false, baz: 130}, true, true) );
      assert(! rttc.isSpecific({saltySurprise: '===', x: ['Regis Philbin'], y: [130], z: [false], l:{a:{m:{d:{a:'->'}}}}  }, true, true) );
      assert(! rttc.isSpecific([{saltySurprise: '===', x: ['Regis Philbin'], y: [130], z: [false], l:{a:{m:{d:{a:'->'}}}}  }], true, true) );
      assert(! rttc.isSpecific(['==='], true, true) );
      assert(! rttc.isSpecific([['===']], true, true) );
      assert(! rttc.isSpecific({saltySurprise: {}, x: 'Regis Philbin'}, true, true) );
      assert(! rttc.isSpecific({saltySurprise: {}, y:130}, true, true) );
      assert(! rttc.isSpecific({saltySurprise: {}, z: false}, true, true) );
      assert(! rttc.isSpecific({saltySurprise: {}, l: '->'}, true, true) );
      assert(! rttc.isSpecific({saltySurprise: {}, foo:'Regis Philbin', bar: false, baz: 130}, true, true) );
      assert(! rttc.isSpecific({saltySurprise: {}, x: ['Regis Philbin'], y: [130], z: [false], l:{a:{m:{d:{a:'->'}}}}  }, true, true) );
      assert(! rttc.isSpecific([{saltySurprise: {}, x: ['Regis Philbin'], y: [130], z: [false], l:{a:{m:{d:{a:'->'}}}}  }], true, true) );
      assert(! rttc.isSpecific([{}], true, true) );
      assert(! rttc.isSpecific([[{}]], true, true) );
      assert(! rttc.isSpecific({saltySurprise: [], x: 'Regis Philbin'}, true, true) );
      assert(! rttc.isSpecific({saltySurprise: [], y:130}, true, true) );
      assert(! rttc.isSpecific({saltySurprise: [], z: false}, true, true) );
      assert(! rttc.isSpecific({saltySurprise: [], l: '->'}, true, true) );
      assert(! rttc.isSpecific({saltySurprise: [], foo:'Regis Philbin', bar: false, baz: 130}, true, true) );
      assert(! rttc.isSpecific({saltySurprise: [], x: ['Regis Philbin'], y: [130], z: [false], l:{a:{m:{d:{a:'->'}}}}  }, true, true) );
      assert(! rttc.isSpecific([{saltySurprise: [], x: ['Regis Philbin'], y: [130], z: [false], l:{a:{m:{d:{a:'->'}}}}  }], true, true) );
      assert(! rttc.isSpecific([[]], true, true) );
      assert(! rttc.isSpecific([[[]]], true, true) );
    });
  });

});

