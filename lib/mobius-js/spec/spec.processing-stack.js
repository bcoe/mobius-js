describe 'ProcessingStack'
  before_each
  end

  describe 'create'
    it 'Should create an item in the database using the processing stack.'
		// Create a processing stack.
		var mongo = require('mongodb');
		var ProcessingStack = require('processing-stack');
			
		// Create the synchronous stack
		var myProcessingStack = new ProcessingStack.ProcessingStack(
			{
				"database" : "test",
				"port" : "27017",
				"host" : "localhost"
			}
		);
		
		// First we must create an index for the new object.
		var indexes = {
			indexes : ['meta', ['_id', 1]],
			collectionName : 'process_stack_object_1'
		}
	
		myProcessingStack.createIndex(indexes, function() {
			sys.puts('Index created.')
		});

		
		// Now we initialize it with fake data.
		var object = {
			values : {
				'title' : 'A fake title.',
				'body' : 'A fake body of an article.',
				'votes' : 10
			},
			collectionName : "process_stack_object_1"
		};

		// Create an object.			
		var objectCreated = false;
		myProcessingStack.create(object, function() {
			print('object process_stack_object_1 created.');
			objectCreated = true;
		});
		
		// Query the object.
		var params = {};
		params['query'] = {};
		params['sort'] = {};
		params['collectionName'] = 'process_stack_object_1';
		
		myProcessingStack.find(params, function(data) {
			data[0].title.should.equal('A fake title.');
			data[0].body.should.equal('A fake body of an article.');
			data[0].votes.should.equal(10);
		});
    end
  end

end