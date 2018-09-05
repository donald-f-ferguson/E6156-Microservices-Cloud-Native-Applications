# @sailshq/lodash

A fork of Lodash 3.10.x with ongoing maintenance from the [Sails core team](http://sailsjs.com/about).

This repo will only be updated when there are immediate, material issues affecting expected usage, like [this one](https://github.com/lodash/lodash/issues/2768).  Our goal is to diverge as little as possible, and to encourage the use of Lodash 4 and above whenever possible.  This repo is really just for us, and anyone else who really likes Lodash 3 exactly the way it is.

**In other words, there will _never_ be any new methods or options added to Lodash on this fork, and consequently there will be no minor version or major version bumps from this fork-- only patches.**



> #### Sails <=v0.12 users:
>
> **This is the version of Lodash exposed as a default global (`_`) in Sails apps prior to Sails v1.0.**
>
> ...but Sails v1.0 changes that.
>
> If your app is using Sails v1.0 or above, or if you are on <=0.12, but are not using the Lodash global,
> then you needn't worry about this package-- it is used interally in Sails, but does not touch userland
> code in your application unless you `require` it -- e.g. from your config/globals.js file.
> [Click here](https://github.com/balderdashy/sails-docs/blob/1.0/reference/sails.config/sails.config.globals.md)
> to learn about how the Lodash global works in Sails v1.0.
>
> On the other hand, if your app _is_ using Sails <=0.12 and you _are_ using the Lodash global:
> + [Click here](https://lodash.com/docs/3.10.1) for usage docs
> + [Click here](http://0.12.sailsjs.com/documentation/reference/configuration/sails-config-globals) to see how to disable that global and use your own version of Lodash.




## Changes since lodash@3.10.1

- [Make `_.isFunction()` properly detect arrow functions (`()=>{}`) and AsyncFunctions (`async function(){}` or `async ()=>{}`)](https://github.com/lodash/lodash/issues/2768)
- [Fix prototype polution security vulnerability](https://github.com/lodash/lodash/issues/2768) _(see also JD's comments [here](https://hackerone.com/reports/310443))_

## Bugs &nbsp; [![npm version](https://badge.fury.io/js/%40sailshq%2Flodash.svg)](https://badge.fury.io/js/%40sailshq%2Flodash)

To report a bug, [click here](http://sailsjs.com/bugs).


## Contributing

Please observe the guidelines and conventions laid out in the [Sails project contribution guide](http://sailsjs.com/documentation/contributing) when opening issues or submitting pull requests.

[![NPM](https://nodei.co/npm/@sailshq/lodash.png)](http://npmjs.com/package/@sailshq/lodash)

## License

#### Lodash license

[Lodash](http://lodash.com) is free and open source under the [MIT License](https://github.com/lodash/lodash/blob/3.10.1/LICENSE).

#### Supplementary license

All ad hoc additions in this repo are also MIT-licensed, copyright &copy; 2017 [The Sails Company](http://sailsjs.com/about).

#### Sails framework license

The [Sails framework](http://sailsjs.com) is free and open-source under the [MIT License](http://sailsjs.com/license).
