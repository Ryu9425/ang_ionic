
  const { register, navigate } = require('../../../../../scripts/e2e');

  describe('list/standalone', () => {

    register('should init', navigate('http://localhost:3333/src/components/list/test/standalone'));

  });
  
