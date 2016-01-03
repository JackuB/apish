import nockmock from '../src/nockmock.js';

describe('nockmock initialization with invalid API description', () => {
  describe('initialize nockmock with undefined', () => {
    let mockResultError = {};
    let thenCallbackSpy = {};

    before((done) => {
      thenCallbackSpy = sinon.spy();
      nockmock()
        .then(thenCallbackSpy)
        .catch((error) => {
          mockResultError = error;
          done();
        });
    });

    it('should not call .then()', () => {
      expect(thenCallbackSpy).to.have.not.been.called;
    });

    it('should initialize with error', () => {
      expect(mockResultError).to.exists;
    });

    it('should provide correct error message', () => {
      expect(mockResultError.message).to.equal('Unknown or unsupported content-type');
    });
  });

  describe('initialize nockmock with JSON', () => {
    let mockResultError = {};
    let thenCallbackSpy = {};

    before((done) => {
      thenCallbackSpy = sinon.spy();
      nockmock({ content: 'Definitely not API description.' })
        .then(thenCallbackSpy)
        .catch((error) => {
          mockResultError = error;
          done();
        });
    });

    it('should not call .then()', () => {
      expect(thenCallbackSpy).to.have.not.been.called;
    });

    it('should initialize with error', () => {
      expect(mockResultError).to.exists;
    });

    it('should provide correct error message', () => {
      expect(mockResultError.message).to.equal('API description must be a string. I got \'object\'');
    });
  });

  describe('initialize nockmock with unrecognized string', () => {
    let mockResultError = {};
    let thenCallbackSpy = {};

    before((done) => {
      thenCallbackSpy = sinon.spy();
      nockmock('Definitely not API description.')
        .then(thenCallbackSpy)
        .catch((error) => {
          mockResultError = error;
          done();
        });
    });

    it('should not call .then()', () => {
      expect(thenCallbackSpy).to.have.not.been.called;
    });

    it('should initialize with error', () => {
      expect(mockResultError).to.exists;
    });

    it('should provide correct error message', () => {
      expect(mockResultError.message).to.equal('Unknown or unsupported content-type');
    });
  });
});
