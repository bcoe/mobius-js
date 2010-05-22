/**
 * Mobius-JS
 *                   /\   \ 
 *                  /  \   \          
 *                 /    \   \
 *                /      \   \
 *               /   /\   \   \
 *              /   /  \   \   \
 *             /   /    \   \   \
 *            /   /    / \   \   \
 *           /   /    /   \   \   \
 *          /   /    /---------'   \
 *         /   /    /_______________\
 *         \  /                     /
 *          \/_____________________/                   
 *
 * Benjamin Coe (BenjaminCoe.com) - MIT Licensed.
 *
 * Description: A MongoDB database connector for Mobius-JS.
 */

// Dependencies.
var sys = require('sys');
var mongo = require('mongodb');
var OPERATION_TIMEOUT = 5000;

/**
 * This patch addresses a problem caused by an incompatibility 
 * between the current version of the mongodb native driver and Node.js.
 * For some reason the error return value is populated when it shouldn't be.
 *
 * @param {object} type
 * @type bool
 * @public
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
	  if (args[0] && args[0]['ok']) {
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

// This class is created for documentation purposes.
function MongoDBConnector() {};

/**
 * Connet to the MongoDB database.
 *
 * @param {object} dbConfiguration database configuration loaded in from db.json
 * @param {function} callback callback function returns control to the processing-stack.
 * @type void
 * @public
 */
MongoDBConnector.prototype.connect = function(self, callback) {
	// We must make sure that an operation completes after a set
	// timeout to prevent a deadlock situation.
	var success = false;
	setTimeout(function() {
		if (!success) {
			self.reset();
			setTimeout(function() {
				self._processStack(self);
			}, 10);
		}
	}, OPERATION_TIMEOUT);

	var host = self.dbConfiguration['host'];
	var port = self.dbConfiguration['port'];

	sys.puts("Connecting to " + host + ":" + port);
	var db = new mongo.Db(self.dbConfiguration['database'], new mongo.Server(host, port, {'autoReconnect' : true}), {});
	
	db.open(function(err, db) {
		success = true;
		callback(db);
	});
	
}
exports.connect = MongoDBConnector.prototype.connect;

/**
 * Close the MongoDB connection.
 *
 * @param {object} self reference to synchronous processing stack.
 * @param {object} params unused.
 * @param {function} callback callback for returning control to processing stack.
 * @type void
 * @public
 */
MongoDBConnector.prototype.close = function(self, params, callback) {
	// We must make sure that an operation completes after a set
	// timeout to prevent a deadlock situation.
	var success = false;
	setTimeout(function() {
		if (!success) {
			self.reset();
			setTimeout(function() {
				self._processStack(self);
			}, 10);
		}
	}, OPERATION_TIMEOUT);
	
	var connectionClosed = false;
	self.db.connections.forEach(function(connection) {
		if (!connectionClosed) {
			success = true;
			connection.close();
			callback();
			connectionClosed = true;
		}
	});
}
exports.close = MongoDBConnector.prototype.close;

/**
 * Create a new index on a MongoDB document.
 *
 * @param {object} self reference to synchronous processing stack.
 * @param {object} params object that describes the indexes on a MongoDB document.
 * @param {function} callback callback for returning control to processing stack.
 * @type void
 * @public
 */
MongoDBConnector.prototype.createIndex = function(self, params, callback) {
	// We must make sure that an operation completes after a set
	// timeout to prevent a deadlock situation.
	var success = false;
	setTimeout(function() {
		if (!success) {
			self.reset();
			setTimeout(function() {
				self._processStack(self);
			}, 10);
		}
	}, OPERATION_TIMEOUT);
	
	self.db.collection(params['collectionName'], function(err, collection) {

		collection.createIndex(params['indexes'], function(err, indexName) {
			success = true;
			callback();
		});
		
	});
}
exports.createIndex = MongoDBConnector.prototype.createIndex;

/**
 * Create a new MongoDB document.
 *
 * @param {object} self reference to synchronous processing stack.
 * @param {object} params parameters for creating new model.
 * @param {function} callback callback for returning control to processing stack.
 * @type void
 * @public
 */
MongoDBConnector.prototype.create = function(self, params, callback) {
	// We must make sure that an operation completes after a set
	// timeout to prevent a deadlock situation.
	var success = false;
	setTimeout(function() {
		if (!success) {
			self.reset();
			setTimeout(function() {
				self._processStack(self);
			}, 10);
		}
	}, OPERATION_TIMEOUT);
	
	self.db.collection(params['collectionName'], function(err, collection) {
		
		var results = {};
        // Insert the model.
        collection.insert(params['values'], function(err, docs) {
			success = true;
			callback();
        });
		
	});
}
exports.create = MongoDBConnector.prototype.create;

/**
 * Update a MongoDB document.
 *
 * @param {object} self reference to synchronous processing stack.
 * @param {object} params parameters for creating new model.
 * @param {function} callback callback for returning control to processing stack.
 * @type void
 * @public
 */
MongoDBConnector.prototype.update = function(self, params, callback) {
	// We must make sure that an operation completes after a set
	// timeout to prevent a deadlock situation.
	var success = false;
	setTimeout(function() {
		if (!success) {
			self.reset();
			setTimeout(function() {
				self._processStack(self);
			}, 10);
		}
	}, OPERATION_TIMEOUT);
	
	self.db.collection(params['collectionName'], function(err, collection) {
		
		var results = {};
		// Insert the model.
  		collection.update(params['restrict'], new mongo.OrderedHash().add("$set", params['values']), function(err, docs) {
			success = true;
			callback();
        });
		
	});
}
exports.update = MongoDBConnector.prototype.update;

/**
 * Remove a MongoDB document.
 *
 * @param {object} self reference to synchronous processing stack.
 * @param {object} params parameters for creating new model.
 * @param {function} callback callback for returning control to processing stack.
 * @type void
 * @public
 */
MongoDBConnector.prototype.remove = function(self, params, callback) {
	// We must make sure that an operation completes after a set
	// timeout to prevent a deadlock situation.
	var success = false;
	setTimeout(function() {
		if (!success) {
			self.reset();
			setTimeout(function() {
				self._processStack(self);
			}, 10);
		}
	}, OPERATION_TIMEOUT);
	
	self.db.collection(params['collectionName'], function(err, collection) {
		
		var results = {};
		// Insert the model.
  		collection.remove(params['restrict'], function(err, docs) {
			success = true;
			callback();
        });
		
	});
}
exports.remove = MongoDBConnector.prototype.remove;

/**
 * Query for a MongoDB document.
 *
 * @param {object} self reference to synchronous processing stack.
 * @param {object} params parameters for finding the document.
 * @param {function} callback callback for returning control to processing stack.
 * @type void
 * @public
 */
MongoDBConnector.prototype.find = function(self, params, callback) {
	// We must make sure that an operation completes after a set
	// timeout to prevent a deadlock situation.
	var success = false;
	setTimeout(function() {
		if (!success) {
			self.reset();
			setTimeout(function() {
				self._processStack(self);
			}, 10);
		}
	}, OPERATION_TIMEOUT);

	
	self.db.collection(params['collectionName'], function(err, collection) {
		
		var results = [];
        // Return the results.
		collection.find(params['query'], params['sort'], function(err, cursor) {
			cursor.each(function(err, article) {
				if(article != null) {
					results.push(article);
				} else {
					success = true;
					callback(results);
				}
			});
		});
	});
}
exports.find = MongoDBConnector.prototype.find;