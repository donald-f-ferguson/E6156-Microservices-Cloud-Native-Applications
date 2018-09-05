'use strict'

const EncryptedAttributes = require('..')
const expect = require('unexpected')

describe('encrypted attributes', function () {
  beforeEach(function () {
    this.options = {
      keys: {
        k1: 'ZZIMKOjE6NPLI0JgB3QlLvhcqLr5Bq+F9a25/bZqQAw=',
        k2: 'scJmBOP559QM/Cj0nHL5Aj8XOgUIV7MkpsyDu5BmG0U='
      },
      keyId: 'k1',
      verifyId: true
    }
  })

  it('should encrypt value via helper method', function () {
    let enc = EncryptedAttributes(['secret'], this.options)
    let obj = {id: 1}
    // expect: YWVzLTI1Ni1nY20kMSRrMQ==$sK91YfUvv+O8Jx/m$OOQniq8=$WLbWYz7uCQBTNO3Fc+5UvA
    expect(enc.encryptAttribute(obj, 'value'), 'not to equal', 'value')
      .and('to begin with', 'YWVzLTI1Ni1nY20k')
  })

  it('should encrypt object attributes', function () {
    let enc = EncryptedAttributes(['secret'], this.options)
    let obj = {id: 1, secret: 'value'}
    // expect: YWVzLTI1Ni1nY20kMSRrMQ==$sK91YfUvv+O8Jx/m$OOQniq8=$WLbWYz7uCQBTNO3Fc+5UvA
    enc.encryptAll(obj)
    expect(obj.secret, 'not to equal', 'value').and('to begin with', 'YWVzLTI1Ni1nY20k')
  })

  it('should encrypt nested attributes', function () {
    let enc = EncryptedAttributes(['secret.data'], this.options)
    let obj = {id: 1, secret: {data: 'value', dataLength: 5}}
    // expect: YWVzLTI1Ni1nY20kMSRrMQ==$sK91YfUvv+O8Jx/m$OOQniq8=$WLbWYz7uCQBTNO3Fc+5UvA
    enc.encryptAll(obj)
    expect(obj.secret.data, 'not to equal', 'value').and('to begin with', 'YWVzLTI1Ni1nY20k')
    expect(obj.secret.dataLength, 'to equal', 5)
  })

  it('should not create missing nested attributes', function () {
    let enc = EncryptedAttributes(['secret.data'], this.options)
    let obj = {id: 1}
    enc.encryptAll(obj)
    expect(obj.secret, 'to be undefined')
  })

  it('should not encrypt null', function () {
    let enc = EncryptedAttributes(['secret'], this.options)
    let obj = {id: 1}
    expect(enc.encryptAttribute(obj, null), 'to be null')
  })

  it('should not encrypt undefined', function () {
    let enc = EncryptedAttributes(['secret'], this.options)
    let obj = {id: 1}
    expect(enc.encryptAttribute(obj, undefined), 'to be undefined')
  })

  it('should not encrypt already encrypted value', function () {
    let enc = EncryptedAttributes(['secret'], this.options)
    let obj = {id: 1}
    let encrypted = 'YWVzLTI1Ni1nY20kMSRrMQ==$sK91YfUvv+O8Jx/m$OOQniq8=$WLbWYz7uCQBTNO3Fc+5UvA'
    expect(enc.encryptAttribute(obj, encrypted), 'to equal', encrypted)
  })

  it('should throw when encrypting non-string value', function () {
    let enc = EncryptedAttributes(['secret'], this.options)
    let obj = {id: 1}
    expect(() => enc.encryptAttribute(obj, 42), 'to throw', /must be a string/i)
  })

  it('should throw when encrypting without id', function () {
    let enc = EncryptedAttributes(['secret'], this.options)
    let obj = {}
    expect(() => enc.encryptAttribute(obj, 'value'), 'to throw', /cannot encrypt without 'id'/i)
  })

  it('should encrypt without id when verify id option is false', function () {
    let enc = EncryptedAttributes(['secret'], Object.assign(this.options, {verifyId: false}))
    let obj = {}
    expect(() => enc.encryptAttribute(obj, 'value'), 'not to throw')
  })

  it('should decrypt value via helper method', function () {
    let enc = EncryptedAttributes(['secret'], this.options)
    let obj = {id: 1}
    let encrypted = 'YWVzLTI1Ni1nY20kMSRrMQ==$sK91YfUvv+O8Jx/m$OOQniq8=$WLbWYz7uCQBTNO3Fc+5UvA'
    expect(enc.decryptAttribute(obj, encrypted), 'to equal', 'value')
  })

  it('should decrypt object attributes', function () {
    let enc = EncryptedAttributes(['secret'], this.options)
    let obj = enc.encryptAll({id: 1, secret: 'value'})
    enc.decryptAll(obj)
    expect(obj.secret, 'to equal', 'value')
  })

  it('should decrypt nested attributes', function () {
    let enc = EncryptedAttributes(['secret.data'], this.options)
    let obj = enc.encryptAll({id: 1, secret: {data: 'value', dataLength: 5}})
    enc.decryptAll(obj)
    expect(obj.secret.data, 'to equal', 'value')
    expect(obj.secret.dataLength, 'to equal', 5)
  })

  it('should not create missing nested attributes', function () {
    let enc = EncryptedAttributes(['secret.data'], this.options)
    let obj = {id: 1}
    enc.decryptAll(obj)
    expect(obj.secret, 'to be undefined')
  })

  it('should not decrypt null', function () {
    let enc = EncryptedAttributes(['secret'], this.options)
    let obj = {id: 1}
    expect(enc.decryptAttribute(obj, null), 'to be null')
  })

  it('should not decrypt undefined', function () {
    let enc = EncryptedAttributes(['secret'], this.options)
    let obj = {id: 1}
    expect(enc.decryptAttribute(obj, undefined), 'to be undefined')
  })

  it('should not decrypt non-string value', function () {
    let enc = EncryptedAttributes(['secret'], this.options)
    let obj = {id: 1}
    expect(enc.decryptAttribute(obj, 42), 'to equal', 42)
  })

  it('should not decrypt value that is not encrypted', function () {
    let enc = EncryptedAttributes(['secret'], this.options)
    let obj = {id: 1}
    expect(enc.decryptAttribute(obj, 'value'), 'to equal', 'value')
  })

  it('should throw when decrypting with invalid id', function () {
    let enc = EncryptedAttributes(['secret'], this.options)
    let obj = {id: 1}
    // aad: aes-256-gcm$02$k1
    let invalidId = 'YWVzLTI1Ni1nY20kMiRrMQ==$sK91YfUvv+O8Jx/m$OOQniq8=$WLbWYz7uCQBTNO3Fc+5UvA'
    expect(() => enc.decryptAttribute(obj, invalidId), 'to throw', /invalid id/i)
  })

  it('should throw when decrypting with invalid key id', function () {
    let enc = EncryptedAttributes(['secret'], this.options)
    let obj = {id: 1}
    // aad: aes-256-gcm$01$k3
    let invalidKeyId = 'YWVzLTI1Ni1nY20kMSRrMw==$sK91YfUvv+O8Jx/m$OOQniq8=$WLbWYz7uCQBTNO3Fc+5UvA'
    expect(() => enc.decryptAttribute(obj, invalidKeyId), 'to throw', /invalid key id/i)
  })

  it('should throw when decrypting with wrong key', function () {
    let enc = EncryptedAttributes(['secret'], this.options)
    let obj = {id: 1}
    // aad: aes-256-gcm$01$k2
    let wrongKey = 'YWVzLTI1Ni1nY20kMSRrMg==$sK91YfUvv+O8Jx/m$OOQniq8=$WLbWYz7uCQBTNO3Fc+5UvA'
    expect(() => enc.decryptAttribute(obj, wrongKey), 'to throw', /unable to auth/i)
  })

  it('should throw when decrypting with wrong auth tag', function () {
    let enc = EncryptedAttributes(['secret'], this.options)
    let obj = {id: 1}
    // aad: aes-256-gcm$01$k1
    let wrongAuthTag = 'YWVzLTI1Ni1nY20kMSRrMQ==$sK91YfUvv+O8Jx/m$OOQniq8=$VLbWYz7uCQBTNO3Fc+5UvA'
    expect(() => enc.decryptAttribute(obj, wrongAuthTag), 'to throw', /unable to auth/i)
  })

  it('should throw when decrypting without id', function () {
    let enc = EncryptedAttributes(['secret'], this.options)
    let obj = {}
    let encrypted = 'YWVzLTI1Ni1nY20kMSRrMQ==$sK91YfUvv+O8Jx/m$OOQniq8=$WLbWYz7uCQBTNO3Fc+5UvA'
    expect(() => enc.decryptAttribute(obj, encrypted), 'to throw', /cannot decrypt without 'id'/i)
  })

  it('should decrypt without id when verify id option is false', function () {
    let enc = EncryptedAttributes(['secret'], Object.assign(this.options, {verifyId: false}))
    let obj = {}
    let encrypted = 'YWVzLTI1Ni1nY20kMSRrMQ==$sK91YfUvv+O8Jx/m$OOQniq8=$WLbWYz7uCQBTNO3Fc+5UvA'
    expect(() => enc.decryptAttribute(obj, encrypted), 'not to throw')
  })
})
