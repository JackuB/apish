import fs from 'fs';
import sinon from 'sinon';
import { expect } from 'chai';
import apish from '../src/apish.js';

describe('apish initialization with invalid API description', () => {
  describe('initialize apish with undefined', () => {
    let mockResultError = {};
    let thenCallbackSpy = {};

    before((done) => {
      thenCallbackSpy = sinon.spy();
      apish()
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
      expect(mockResultError.message).to.equal('API description must be a string. I got \'undefined\'');
    });
  });

  describe('initialize apish with JSON', () => {
    let mockResultError = {};
    let thenCallbackSpy = {};

    before((done) => {
      thenCallbackSpy = sinon.spy();
      apish({ content: 'Definitely not API description.' })
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

  describe('initialize apish with unrecognized string', () => {
    let mockResultError = {};
    let thenCallbackSpy = {};

    before((done) => {
      thenCallbackSpy = sinon.spy();
      apish('Definitely not API description.')
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

  describe('initialize apish with invalid API Blueprint', () => {
    let mockResultError = {};
    let thenCallbackSpy = {};

    before((done) => {
      thenCallbackSpy = sinon.spy();
      apish(fs.readFileSync(__dirname + '/fixtures/invalid-blueprint.apib', 'utf8'))
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
      expect(mockResultError.result.content[0].content).to.equal('expected API name, e.g. \'# <API Name>\'');
    });
  });
});
