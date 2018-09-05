# encrypted-attr

[![travis](http://img.shields.io/travis/simonratner/node-encrypted-attr/master.svg?style=flat-square)](https://travis-ci.org/simonratner/node-encrypted-attr) &nbsp;
[![npm](http://img.shields.io/npm/v/encrypted-attr.svg?style=flat-square)](https://www.npmjs.org/package/encrypted-attr) &nbsp;
[![license](https://img.shields.io/github/license/simonratner/node-encrypted-attr.svg?style=flat-square)](LICENSE)

Encrypted model attributes in your favourite ORM.

# Security model

* AES-256-GCM:
    * 96-bit random nonce
    * 128-bit authentication tag
* Additional authenticated data:
    * Key id: use different keys for different attributes (or different users),
      rotate keys for new data over time without re-encrypting old data
    * Object id: prevent substitution of encrypted values

All keys should be 32 bytes long, and cryptographically random. Manage these
keys as you would any other sensitive credentials (environment config, vault,
keychain). You can generate random keys with this snippet:
```
node -p "require('crypto').randomBytes(32).toString('base64')"
```

Refer to [NIST Special Publication 800-38D](http://doi.org/10.6028/NIST.SP.800-38D)
for additional recommendations. In particular, you should pay attention to
uniqueness requirements for keys and IVs, and constraints on the number of
invocations with a given key (Section 8). These should inform key rotation
policies.

# Threat model

This is designed to protect you from leaking sensitive user data under very
specific scenarios:

* Full data dump
    * Misplaced unencrypted backups
    * Compromised database host
* Partial data dump
    * Query injection via unsanitized input

Specifically, this does *not* provide any protection in cases of a compromised
app host, app-level vulnerabilities, or accidentally leaking sensitive data
into logs. It is also not a substitute for actually encrypting your backups,
sanitizing your input, et cetera.

# Install

```
npm install encrypted-attr
```

# Use

This module can be used stand-alone to encrypt individual values, or wrapped
into a plugin or hook to your favourite ORM.

Here is a quick example to get started:

```js
const EncryptedAttributes = require('encrypted-attr')

let encryptedAttributes = EncryptedAttributes(null, {
  keys: {
    k1: crypto.randomBytes(32).toString('base64') // use a persistent key
  },
  keyId: 'k1'
})

let secretNumber = '555-55-5555'
let encryptedNumber = encryptedAttributes.encryptAttribute(null, secretNumber)
// YWVzLTI1Ni1nY20kJGsx$r2JF/XHvpsgNwJDs$c/P6GwnUZGokEjQ=$sEMv0cyKPBL90mo2zZ1MpQ
```

### EncryptedAttributes(attributes, options)

Construct an instance to handle encryption and decryption. You should construct
for each unique set of attributes and keys that you want to encrypt.

| Parameter    | Type             | Required?  | Details                                                                                                                                                                                                                                                    |
| :----------- | :--------------- | :--------- | :----------------------------                                                                                                                                                                                                                              |
| `attributes` | array of strings | _Optional_ | List attributes which should be encrypted.  These can be specified as top-level string keys, or nested paths using dot-separated notation.  This list is used by `encryptAll`/`decryptAll`, and is also useful for creating helper methods on your models. |
| `options`    | dictionary       | _Optional_ | See below.                                                                                                                                                                                                                                                 |

These options are supported:

| Option       | Type             | Required?  | Details                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| :----------- | :--------------- | :--------- | :----------------------------                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              |
| `keys`       | dictionary       | Required   | Dictionary of all relevant data encryption keys, as `base64` strings.  Since encrypted strings _embed the key id that was used to encrypt them_, it's important that `keys` contains the appropriate key for any previously encrypted data you might run across.                                                                                                                                                                                                                                                                                           |
| `keyId`      | string           | Required   | The id of the key to use for all _new encryptions_.  This is not necessarily the only key that will be used for decryptions, because the key id gets embedded into the encrypted string.  When that string is decrypted, this module unpacks that key id and uses it to determine the appropriate decryption key.  This approach allows multiple keys to be used for the same attribute.  (Note that this option is only _technically_ required if you need to encrypt new data. If you are only decrypting existing data, you do not need to provide it.) |
| `verifyId`   | boolean          | _Optional_ | Whether or not to (a) use the `id` property of a provided source object as an additional piece of metadata during encryption, and (b) expect that metadata to be embedded in encrypted strings during decryption, and throw an error if the expected id does not match the source object.  Defaults to `false`.                                                                                                                                                                                                                                            |


### encryptAttribute(sourceObject, plaintextString)

Encrypt a value using one of your keys (specifically, the key indicated by the
`keyId` option specified in the constructor).

Returns the encrypted representation of the value. Does nothing if the provided
value is already encrypted using this module (so this method is idempotent).

```js
let encryptedString = encryptAttributes.encryptAttribute(sourceObject, plaintextString)
```

> `sourceObject` is optional, and only relevant if the `verifyId` option is used;
otherwise you may pass `null` or `undefined`.


### encryptAll(sourceObject)

Encrypt a subset of fields in the provided plain object. The set of fields to
be encrypted is specified by the array of attribute paths supplied to the
`EncryptedAttributes` constructor.

Returns the source object with any to-by-encrypted fields replaced by their
encrypted representation. Note that this method modifies the provided object.

```js
let partiallyEncryptedObject = encryptedAttributes.encryptAll(sourceObject)
```


### decryptAttribute(sourceObject, encryptedString)

Decrypt a value.

Returns the plaintext string. Does nothing if the provided value does not look
like it was encrypted using this module (so this method is idempotent).

```js
let plaintextString = encryptedAttributes.decryptAttribute(sourceObject, encryptedString)
```

> `sourceObject` is optional, and only relevant if the `verifyId` option is used;
otherwise you may pass `null` or `undefined`.


### decryptAll(sourceObject)

Decrypt a subset of fields in the provided plain object. The set of fields to
be decrypted is specified by the array of attribute paths supplied to the

Returns the source object with any encrypted fields replaced by their plaintext
value. Note that this method modifies the provided object.

```js
let decryptedObject = encryptedAttributes.decryptAll(partiallyEncryptedObject)
```


# Use with an ORM

While this module can be used stand-alone, it is designed to be wrapped into
a plugin or hook to your favourite ORM. Eventually, this package may include
such plugins for common ORMs, but for now, here's an example using
[thinky](https://github.com/neumino/thinky):

```js
const EncryptedAttributes = require('encrypted-attr')
const thinky = require('thinky')()
const _ = require('lodash')

let Model = thinky.createModel('Model', {})

let encryptedAttributes = EncryptedAttributes(['secret', 'nested.secret'], {
  keys: {
    k1: crypto.randomBytes(32).toString('base64') // use an actual key here
  },
  keyId: 'k1',
  verifyId: true
})

// Pre-save hook: encrypt model attributes that need to be encrypted.
Model.docOn('saving', function (doc) {
  encryptedAttributes.encryptAll(doc)
})

// Post-save hook: decrypt model attributes that need to be decrypted.
Model.docOn('saved', function (doc) {
  encryptedAttributes.decryptAll(doc)
})

// Post-retrieve hook: ditto.
Model.on('retrieved', function (doc) {
  encryptedAttributes.decryptAll(doc)
})

// Optionally, add some helpers in case we need to set or read the value
// directly (such as an update query), without going through model hooks.
for (let attr of encryptedAttributes.attributes) {
  Model.define(_.camelCase(`encrypt ${attr}`), function (val) {
    return encryptedAttributes.encryptAttribute(this, val)
  })
  Model.define(_.camelCase(`decrypt ${attr}`), function (val) {
    return encryptedAttributes.decryptAttribute(this, val)
  })
}
```

And a usage example:

```js
async function storeSomeSecrets (doc) {
  await doc.merge({
    secret: 'red',
    nested: {
      hint: 'colour',
      secret: 'yellow'
    }
  }).save()

  console.log(await Model.get(doc.id))
  // {
  //   id: '543bed92-e241-4151-9d8f-1aa942c36d24',
  //   nested: {
  //     hint: 'colour',
  //     secret: 'yellow'
  //   },
  //   secret: 'red'
  // }

  console.log(await Model.get(doc.id).execute())
  // {
  //   id: '543bed92-e241-4151-9d8f-1aa942c36d24',
  //   nested: {
  //     hint: 'colour',
  //     secret: 'YWVzLTI1Ni1nY20k...$NFvcFAaPTDay3uWH$t3G9Jrpy$g+BJT/UvfuboMB3ARiDRIQ'
  //   },
  //   secret: 'YWVzLTI1Ni1nY20k...$6UdqWqv9ox305Wmt$zyNF$S5BOgZSvMG3H24foFaTQjg'
  // }
}
```


# License

[MIT](LICENSE)
