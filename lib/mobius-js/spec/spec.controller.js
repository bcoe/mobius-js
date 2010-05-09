describe 'MobiusController'
  before_each
  end

  describe '_loadParams'
    it 'should combine express\' get and post parameters.'

		var controller = new MobiusController();

		controller.express = {
			params : {
			}
		};
	
		controller.express.params.get = {'a' : 'apple', 'b' : 'banana'}
		controller.express.params.post = {'c' : 'candy'}
		controller._loadParams()
	
		controller.params.a.should.equal('apple');
		controller.params.b.should.equal('banana');
		controller.params.c.should.equal('candy');
    end
  end

end