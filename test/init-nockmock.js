import { expect } from 'chai'; // coverage runner fix
import fs from 'fs';
import nock from 'nock';
import nockmock from '../src/nockmock.js';

describe('nockmock initialization', () => {
  let mockResult = {};
  const actionsInBasicBlueprint = 2;

  before(() => {
    const apib = fs.readFileSync(__dirname + '/fixtures/basic-blueprint.apib');
    return mockResult = nockmock(apib.toString());
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
