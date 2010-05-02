var sys = require('sys');

(function() {

/*	process.EventEmitter.prototype.emit = function (type) {
		sys.puts(type);
	
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
		  args[0] = null; // My monkey patch.
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
	};*/






GLOBAL.DEBUG = true;

sys = require("sys");
test = require("mjsunit");

var mongo = require('mongodb');

var host = process.env['MONGO_NODE_DRIVER_HOST'] != null ? process.env['MONGO_NODE_DRIVER_HOST'] : 'localhost';
var port = process.env['MONGO_NODE_DRIVER_PORT'] != null ? process.env['MONGO_NODE_DRIVER_PORT'] : 27017;

var LINE_SIZE = 120;

sys.puts("Connecting to " + host + ":" + port);
var db = new mongo.Db('node-mongo-blog', new mongo.Server(host, port, {}), {});


db.open(function(err, db) {
  db.dropDatabase(function(err, result) {
    sys.puts("===================================================================================");
    sys.puts(">> Adding Authors");
    db.collection('authors', function(err, collection) {
      collection.createIndex(["meta", ['_id', 1], ['name', 1], ['age', 1]], function(err, indexName) {
        sys.puts("===================================================================================");        
        var authors = {};
        
        // Insert authors
        collection.insert([{'name':'William Shakespeare', 'email':'william@shakespeare.com', 'age':587},
          {'name':'Jorge Luis Borges', 'email':'jorge@borges.com', 'age':123}], function(err, docs) {
            docs.forEach(function(doc) {
              sys.puts(sys.inspect(doc));
              authors[doc.name] = doc;
            });
        });

        sys.puts("===================================================================================");        
        sys.puts(">> Authors ordered by age ascending");        
        sys.puts("===================================================================================");        
        collection.find({}, {'sort':[['age', 1]]}, function(err, cursor) {
          cursor.each(function(err, author) {
            if(author != null) {
              sys.puts("[" + author.name + "]:[" + author.email + "]:[" + author.age + "]");
            } else {
              sys.puts("===================================================================================");        
              sys.puts(">> Adding users");        
              sys.puts("===================================================================================");                        
              db.collection('users', function(err, userCollection) {
                var users = {};
                
                userCollection.insert([{'login':'jdoe', 'name':'John Doe', 'email':'john@doe.com'}, 
                  {'login':'lsmith', 'name':'Lucy Smith', 'email':'lucy@smith.com'}], function(err, docs) {
                    docs.forEach(function(doc) {
                      sys.puts(sys.inspect(doc));
                      users[doc.login] = doc;
                    });              
                });
        
                sys.puts("===================================================================================");        
                sys.puts(">> Users ordered by login ascending");        
                sys.puts("===================================================================================");        
                userCollection.find({}, {'sort':[['login', 1]]}, function(err, cursor) {
                  cursor.each(function(err, user) {
                    if(user != null) {
                      sys.puts("[" + user.login + "]:[" + user.name + "]:[" + user.email + "]");
                    } else {
                      sys.puts("===================================================================================");        
                      sys.puts(">> Adding articles");        
                      sys.puts("===================================================================================");                                              
                      db.collection('articles', function(err, articlesCollection) {
                        articlesCollection.insert([
                          { 'title':'Caminando por Buenos Aires', 
                            'body':'Las callecitas de Buenos Aires tienen ese no se que...', 
                            'author_id':authors['Jorge Luis Borges']._id},
                          { 'title':'I must have seen thy face before', 
                            'body':'Thine eyes call me in a new way', 
                            'author_id':authors['William Shakespeare']._id, 
                            'comments':[{'user_id':users['jdoe']._id, 'body':"great article!"}]
                          }
                        ], function(err, docs) {
                          docs.forEach(function(doc) {
                            sys.puts(sys.inspect(doc));
                          });              
                        })
                        
                        sys.puts("===================================================================================");        
                        sys.puts(">> Articles ordered by title ascending");        
                        sys.puts("===================================================================================");        
                        articlesCollection.find({}, {'sort':[['title', 1]]}, function(err, cursor) {
                          cursor.each(function(err, article) {
                            if(article != null) {
                              sys.puts("[" + article.title + "]:[" + article.body + "]:[" + article.author_id.toHexString() + "]");
                              sys.puts(">> Closing connection");
                              db.close();






                            }
                          });
                        });
                      });
                    }
                  });
                });
              });              
            }
          });
        });
      });
    });
  });
});

})();