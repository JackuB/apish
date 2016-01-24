import fs from 'fs';
import nock from 'nock';
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
