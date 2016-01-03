import fs from 'fs';
import hippie from 'hippie';
import nockmock from '../src/nockmock.js';

describe('Mock basic APIB and allow multiple requests to same resource', () => {
  let mockResult = {};
  before(() => {
    const apib = fs.readFileSync(__dirname + '/fixtures/basic-blueprint.apib');
    return mockResult = nockmock(apib.toString());
  });

  after(() => {
    mockResult.value().restore();
  });

  [1, 2, 3].forEach((index) => {
    it(`should persists the mock of the GET /questions request - try #${index}`, (done) => {
      hippie()
      .json()
      .base('http://example.com')
      .get('/questions')
      .expectStatus(200)
      .expectHeader('Content-Type', 'application/json')
      .expectBody({"question":"Favourite programming language?","choices":[{"choice":"Swift","votes":2048},{"choice":"Python","votes":1024}]})
      .end(done);
    });
  });

});
