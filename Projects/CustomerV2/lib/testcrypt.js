let sandh = require('./salthash');
let logging = require('./logging');

const myPlaintextPassword = 's0/\/\P4$$w0rD';
const someOtherPlaintextPassword = 'not_bacon';

x = sandh.saltAndHash(myPlaintextPassword);
console.log("H = " + x);

console.log("Match 1 = " + sandh.compare(myPlaintextPassword, x));

console.log("Match 2 = " + sandh.compare('canary', x));

