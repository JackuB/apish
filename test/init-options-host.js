import fs from 'fs';
import nock from 'nock';
import sinon from 'sinon';
import apish from '../src/apish.js';
import { expect } from 'chai';

describe('apish with specified host option', () => {
  let mockResult = {};
  const actionsInBasicBlueprint = 2;

  before(() => {
    const apib = fs.readFileSync(__dirname + '/fixtures/basic-blueprint.apib');
    const options = {
      host: 'http://newhost.com'
    };
    return mockResult = apish(apib.toString(), options);
  });

  it('should initialize without error', () => {
    expect(mockResult.value()).to.be.truthy;
  });

  it('should expose restore method', () => {
    expect(mockResult.value().restore).to.be.truthy;
  });

  it('should add interceptors to pendingMocks list', () => {
    expect(nock.pendingMocks()).to.have.length(actionsInBasicBlueprint);
  });

  it('should not throw when calling restore', () => {
    expect(mockResult.value().restore()).to.not.throw;
  });

  it('should clear pendingMocks list', () => {
    expect(nock.pendingMocks()).to.have.length(0);
  });
});

describe('apish without specified host option or host in API Description', () => {
  let mockResultError = {};
  let thenCallbackSpy = {};

  before((done) => {
    const apib = fs.readFileSync(__dirname + '/fixtures/basic-blueprint-no-host.apib', 'utf8');
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
    expect(mockResultError.message).to.equal('No "host" specified for mock in API Description or options');
  });
});
