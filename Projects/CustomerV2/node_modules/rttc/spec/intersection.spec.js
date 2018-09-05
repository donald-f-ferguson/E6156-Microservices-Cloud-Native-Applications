//  ██████╗ ████████╗████████╗ ██████╗    ███████╗██████╗ ███████╗ ██████╗
//  ██╔══██╗╚══██╔══╝╚══██╔══╝██╔════╝    ██╔════╝██╔══██╗██╔════╝██╔════╝    ██╗██╗
//  ██████╔╝   ██║      ██║   ██║         ███████╗██████╔╝█████╗  ██║         ╚═╝╚═╝
//  ██╔══██╗   ██║      ██║   ██║         ╚════██║██╔═══╝ ██╔══╝  ██║         ██╗██╗
//  ██║  ██║   ██║      ██║   ╚██████╗    ███████║██║     ███████╗╚██████╗    ╚═╝╚═╝
//  ╚═╝  ╚═╝   ╚═╝      ╚═╝    ╚═════╝    ╚══════╝╚═╝     ╚══════╝ ╚═════╝
//
//  ██╗███╗   ██╗████████╗███████╗██████╗ ███████╗███████╗ ██████╗████████╗██╗ ██████╗ ███╗   ██╗
//  ██║████╗  ██║╚══██╔══╝██╔════╝██╔══██╗██╔════╝██╔════╝██╔════╝╚══██╔══╝██║██╔═══██╗████╗  ██║
//  ██║██╔██╗ ██║   ██║   █████╗  ██████╔╝███████╗█████╗  ██║        ██║   ██║██║   ██║██╔██╗ ██║
//  ██║██║╚██╗██║   ██║   ██╔══╝  ██╔══██╗╚════██║██╔══╝  ██║        ██║   ██║██║   ██║██║╚██╗██║
//  ██║██║ ╚████║   ██║   ███████╗██║  ██║███████║███████╗╚██████╗   ██║   ██║╚██████╔╝██║ ╚████║
//  ╚═╝╚═╝  ╚═══╝   ╚═╝   ╚══════╝╚═╝  ╚═╝╚══════╝╚══════╝ ╚═════╝   ╚═╝   ╚═╝ ╚═════╝ ╚═╝  ╚═══╝
//
// > NOTE:
// > All tests below assume `rttc.intersection()` is being called with
// > exemplars (rather than type schemas), and with `strict` mode disabled.
module.exports = [


  ////////////////////////////////////////////////////
  // null   ∩   ...
  //
  // > `null` is not actually a valid exemplar,
  // > rather it's a special value used for
  // > indicating that the set of values that
  // > validate against this is Ø (the empty set).
  ////////////////////////////////////////////////////

  { e0: null,       e1: null,                    result: null               },

  { e0: null,       e1: 'bar',                   result: null               },
  { e0: null,       e1: 'foo',                   result: null               },
  { e0: null,       e1: '',                      result: null               },

  { e0: null,       e1: 0,                       result: null               },
  { e0: null,       e1: 1,                       result: null               },
  { e0: null,       e1: -1.1,                    result: null               },

  { e0: null,       e1: true,                    result: null               },
  { e0: null,       e1: false,                   result: null               },

  { e0: null,       e1: '->',                    result: null               },

  { e0: null,       e1: '*',                     result: null               },

  { e0: null,       e1: '===',                   result: null               },

  { e0: null,       e1: {},                      result: null               },

  { e0: null,       e1: [],                      result: null               },

  { e0: null,       e1: {foo:'bar'},             result: null               },
  { e0: null,       e1: {foo:{bar:{baz:{}}}},    result: null               },
  { e0: null,       e1: {foo:['bar']},           result: null               },
  { e0: null,       e1: {foo:{bar:{baz:[{}]}}},  result: null               },

  { e0: null,       e1: ['asdf'],                result: null               },
  { e0: null,       e1: [''],                    result: null               },
  { e0: null,       e1: [235],                   result: null               },
  { e0: null,       e1: [false],                 result: null               },
  { e0: null,       e1: [{}],                    result: null               },
  { e0: null,       e1: [{foo:'bar'}],           result: null               },


  ////////////////////////////////////////////
  // "some string"   ∩   ...
  ////////////////////////////////////////////

  { e0: 'foo',       e1: 'bar',                   result: 'bar'              },
  { e0: 'bar',       e1: 'foo',                   result: 'foo'              },
  { e0: 'foo',       e1: '',                      result: ''                 },

  { e0: 'foo',       e1: 0,                       result: 0                  },
  { e0: 'foo',       e1: 1,                       result: 1                  },
  { e0: 'foo',       e1: -1.1,                    result: -1.1               },

  { e0: 'foo',       e1: true,                    result: true               },
  { e0: 'foo',       e1: false,                   result: false              },

  { e0: 'foo',       e1: '->',                    result: null               },

  { e0: 'foo',       e1: '*',                     result: 'foo'              },

  { e0: 'foo',       e1: '===',                   result: 'foo'              },

  { e0: 'foo',       e1: {},                      result: null               },

  { e0: 'foo',       e1: [],                      result: null               },

  { e0: 'foo',       e1: {foo:'bar'},             result: null               },
  { e0: 'foo',       e1: {foo:{bar:{baz:{}}}},    result: null               },
  { e0: 'foo',       e1: {foo:['bar']},           result: null               },
  { e0: 'foo',       e1: {foo:{bar:{baz:[{}]}}},  result: null               },

  { e0: 'foo',       e1: ['asdf'],                result: null               },
  { e0: 'foo',       e1: [''],                    result: null               },
  { e0: 'foo',       e1: [235],                   result: null               },
  { e0: 'foo',       e1: [false],                 result: null               },
  { e0: 'foo',       e1: [{}],                    result: null               },
  { e0: 'foo',       e1: [{foo:'bar'}],           result: null               },


  // Add more tests.
  // TODO

];
