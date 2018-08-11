

var Waterline = require('waterline');
var dbAdaptor = require('sails-mysql');
var logging = require('/Users/donaldferguson/Dropbox/ColumbiaCourse/Courses/Fall2018/lib/logging');

var waterline = new Waterline();

var config = {
    adapters: {
        'db': dbAdaptor
    },

    datastores: {
        default: {
            adapter: 'db',
            url: 'mysql://dbuser:dbuser@localhost:3306/E6165'
        }
    }
};

var peopleCollection = Waterline.Collection.extend({
    identity: 'people',
    datastore: 'default',
    primaryKey: 'people_email',

    attributes: {
        people_email: {type: 'string', required: true},
        people_last_name: {type: 'string', required: true},
        people_first_name: {type: 'string', required: true}
    }

});

waterline.registerModel(peopleCollection);

var getOntology = function() {
    "use strict";

    return new Promise(function (resolve, reject) {
        waterline.initialize(config, function (err, ontology) {
            if (err) {
                console.error(err);
                reject(error);
            }
            else {
                resolve(ontology);
            }
        });
    });
};

var getPeopleCollection = function() {
    "use strict";

    return new Promise(function (resolve, reject) {

        getOntology().then(
            function (result) {
                "use strict";
                resolve(result.collections.people);
            },
            function (err) {
                "use strict";
                logging.error_message("Error = ", err);
                reject(error);
            });
    });
};

var getAll = function(r) {
    "use strict";
    return r.find()
};

var getByQ = function(t) {
    "use strict";

    return getPeopleCollection().then(
        function(r) {
            return r.find(t)
        });
};

getByQ({"people_last_name": "Ferguson"}).then(
    function(d) {
        "use strict";
        logging.debug_message("D = ", d);
        config.adapters.db.teardown(null,
            function(error, message) {
                logging.debug_message("Teardown said ...", message);
            });
    }
);

/*
 getAssetCollection().then(getAll).then(
 console.log
 ).
 catch(function(err) {
 logging.debug_message("Boom", err);
 });
 */

/*
 var getAllAssets = function() {
 return getAssetCollection().then(
 function (r) {
 "use strict";
 //console.log("r = ", r);
 return r.find()
 });
 };

 getAllAssets()
 .then(
 function(r2) {
 console.log(r2);
 }
 ).catch(function(err) {
 logging.debug_message("Boom", err);
 });*/








/*
 // Tease out fully initialized models.
 var asset = ontology.collections.asset_types;


 // Since we're using `await`, we'll scope our selves an async IIFE:
 (async ()=>{
 // First we create a user
 var nasset = await asset.create({
 assetTypeId: 'foo',
 assetSubtypeId: 'bar',
 assetTypeDescription: 'cat'
 });
 })()
 .then(()=>{
 // All done.
 })
 .catch((err)=>{
 console.error(err);
 });


 });
 */

