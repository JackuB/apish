import fs from 'fs';
import nock from 'nock';
import apish from '../src/apish.js';
import sinon from 'sinon';
import { expect } from 'chai';

const parserService = 'https://api.apiblueprint.org';

describe('plutonium call fails', () => {
  let apib = null;
  before(() => {
    apib = fs.readFileSync(__dirname + '/fixtures/basic-swagger.yaml').toString();
    nock.disableNetConnect('apiblueprint.org');
  });

  after(() => {
    nock.cleanAll();
    nock.enableNetConnect('apiblueprint.org');
  });

  describe('with 503 error and no body', () => {
    let mockResultError = {};
    let thenCallbackSpy = {};

    before((done) => {
      nock(parserService)
        .post('/transform', (() => true))
        .reply(503);

      thenCallbackSpy = sinon.spy();
      apish(apib)
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
      expect(mockResultError.message).to.contain('Parsing service responded with invalid data:');
    });
  });

  describe('with 503 error and some body', () => {
    let mockResultError = {};
    let thenCallbackSpy = {};
    const serverErrorMessage = 'Server died';

    before((done) => {
      nock(parserService)
        .post('/transform', (() => true))
        .reply(503, serverErrorMessage);

      thenCallbackSpy = sinon.spy();
      apish(apib)
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

    it('should provide correct error message including page body', () => {
      expect(mockResultError.message).to.contain('Parsing service responded with invalid data:', serverErrorMessage);
    });
  });

  describe('with 200 page and some non-JSON body', () => {
    let mockResultError = {};
    let thenCallbackSpy = {};
    const serverMessage = 'This is not JSON';

    before((done) => {
      nock(parserService)
        .post('/transform', (() => true))
        .reply(200, serverMessage);

      thenCallbackSpy = sinon.spy();
      apish(apib)
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

    it('should provide correct error message including page body', () => {
      expect(mockResultError.message).to.contain('Parsing service responded with invalid data:', serverMessage);
    });
  });

  describe('with 200 page and some JSON body', () => {
    let mockResultError = {};
    let thenCallbackSpy = {};
    const serverMessage = { content: 'JSON' };

    before((done) => {
      nock(parserService)
        .post('/transform', (() => true))
        .reply(200, serverMessage);

      thenCallbackSpy = sinon.spy();
      apish(apib)
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

    it('should provide correct error message including page body', () => {
      expect(mockResultError.message).to.contain('Parsing service responded with invalid data:', serverMessage);
    });
  });


  describe('with 200 page and JSON body but with empty "output_document"', () => {
    let mockResultError = {};
    let thenCallbackSpy = {};
    const serverMessage = { output_document: null };

    before((done) => {
      nock(parserService)
        .post('/transform', (() => true))
        .reply(200, serverMessage);

      thenCallbackSpy = sinon.spy();
      apish(apib)
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

    it('should provide correct error message including page body', () => {
      expect(mockResultError.message).to.contain('Parsing service responded with invalid data:', serverMessage);
    });
  });

  describe('with 200 page and JSON body but "output_document" is not refract element', () => {
    let mockResultError = {};
    let thenCallbackSpy = {};
    const serverMessage = { output_document: 'This is not refract' };

    before((done) => {
      nock(parserService)
        .post('/transform', (() => true))
        .reply(200, serverMessage);

      thenCallbackSpy = sinon.spy();
      apish(apib)
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

    it('should provide correct error message including page body', () => {
      expect(mockResultError.message).to.equal('Failed to JSON.parse refract object from parsing service');
    });
  });

  describe('with 200 page and JSON body but "output_document" is not "parseResult" refract element', () => {
    let mockResultError = {};
    let thenCallbackSpy = {};
    const serverMessage = { output_document: { element: "notParseResult" } };

    before((done) => {
      nock(parserService)
        .defaultReplyHeaders({
          'Content-Type': 'application/json'
        })
        .post('/transform', (() => true))
        .reply(200, serverMessage);

      thenCallbackSpy = sinon.spy();
      apish(apib)
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

    it('should provide correct error message including page body', () => {
      expect(mockResultError.message).to.equal('Expected refract object');
    });
  });

  describe('with error', () => {
    let mockResultError = {};
    let thenCallbackSpy = {};
    const serverErrorMessage = 'Everything crashed';

    before((done) => {
      nock(parserService)
        .post('/transform', (() => true))
        .replyWithError(serverErrorMessage);

      thenCallbackSpy = sinon.spy();
      apish(apib)
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

    it('should provide correct error message including page body', () => {
      expect(mockResultError.message).to.equal(serverErrorMessage);
    });
  });
});
