var sys = require('sys');
sys = require("sys");
var mongo = require('mongodb');

/**
 * This patch monkey patch addresses a problem caused by an incompatibility 
 * between the current version of the mongodb native driver and node.js.
 * For some reason the error return value is populated when it shouldn't be.
 */
process.EventEmitter.prototype.emit = function (type) {

  // If there is no 'error' event listener then throw.
  if (type === 'error') {
    if (!this._events || !this._events.error ||
        (this._events.error instanceof Array && !this._events.error.length))
    {
      if (arguments[1] instanceof Error) {
        throw arguments[1];
      } else {
        throw new Error("Uncaught, unspecfied 'error' event.");
      }
      return false;
    }
  }

  if (!this._events) return false;
  if (!this._events[type]) return false;

  if (typeof this._events[type] == 'function') {
    if (arguments.length < 3) {
      // fast case
      this._events[type].call( this
                             , arguments[1]
                             , arguments[2]
                             );
    } else {
      // slower
      var args = Array.prototype.slice.call(arguments, 1);
	  // My ugly monkey patch.
	  if (args[0]['ok']) {
		args[0] = null; // My monkey patch.
	  }
      this._events[type].apply(this, args);
    }
    return true;

  } else if (this._events[type] instanceof Array) {
    var args = Array.prototype.slice.call(arguments, 1);


    var listeners = this._events[type].slice(0);
    for (var i = 0, l = listeners.length; i < l; i++) {
      listeners[i].apply(this, args);
    }
    return true;

  } else {
    return false;
  }
};
// End of crazy monkey patch that should be removed A.S.A.P.

exports.connect = function(dbConfiguration, callback) {

	var host = dbConfiguration['host'];
	var port = dbConfiguration['port'];

	sys.puts("Connecting to " + host + ":" + port);
	var db = new mongo.Db(dbConfiguration['database'], new mongo.Server(host, port, {'autoReconnect' : true}), {});
	
	db.open(function(err, db) {
		callback(db);
	});
	
}

exports.close = function(self, params, callback) {
	self.db.close();
	callback();
}

exports.createIndex = function(self, params, callback) {
	self.db.collection(params['collectionName'], function(err, collection) {

		collection.createIndex(params['indexes'], function(err, indexName) {
			sys.puts(indexName);
			callback();
		});
		
	});
}

exports.create = function(self, params, callback) {
	
	self.db.collection(params['collectionName'], function(err, collection) {
		
		var results = {};
        // Insert the model.
        collection.insert(params['values'], function(err, docs) {		
            docs.forEach(function(doc) {
              sys.puts(sys.inspect(doc));
              results[doc.name] = doc;
            });
			callback();
        });
		
	});
}

// {'sort':[['title', 1]]}
exports.find = function(self, params, callback) {
	
	// Used to return results back to a controller.
	var callbackTemp = function(results) {
		callback(results)
	}
	
	self.db.collection(params['collectionName'], function(err, collection) {
		
		var results = [];
        // Return the results.
		collection.find(params['query'], {}, function(err, cursor) {
			cursor.each(function(err, article) {
				if(article != null) {
					results.push(article);
				} else {
					callbackTemp(results);
				}
			});
		});
	});
}