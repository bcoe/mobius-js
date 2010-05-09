describe 'MobiusModel'
  before_each
  end

  describe 'loadParameters'
    it 'should initialize a model with the parameters provided.'
		// Fake data go initialize the model with.
		var parameters = {
			'title' : 'A fake title.',
			'body' : 'A fake body of an article.',
			'votes' : 10
		};
		
		// Initialize a model with the parameters provided, without describing them
		// in the model's file. Should throw an exception.
		var model1 = new MobiusModel();
		model1.loadParameters(parameters);
	
		
		model1.title.should.match('A fake title');
		model1.body.should.match('A fake body');
		model1.votes.should.equal(10);
    end
  end

end