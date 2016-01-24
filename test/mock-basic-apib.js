import fs from 'fs';
import hippie from 'hippie';
import apish from '../src/apish.js';
import { expect } from 'chai';

describe('Mock basic APIB', () => {
  let mockResult = {};
  before(() => {
    const apib = fs.readFileSync(__dirname + '/fixtures/basic-blueprint.apib');
    return mockResult = apish(apib.toString());
  });

  after(() => {
    mockResult.value().restore();
  });

  it('should mock the GET /questions request including body', (done) => {
    hippie()
    .json()
    .base('http://example.com')
    .get('/questions')
    .expectStatus(200)
    .expectHeader('Content-Type', 'application/json')
    .expectBody({"question":"Favourite programming language?","choices":[{"choice":"Swift","votes":2048},{"choice":"Python","votes":1024}]})
    .end(done);
  });

  it('should mock the POST /questions request including body', (done) => {
    hippie()
    .json()
    .base('http://example.com')
    .post('/questions')
    .expectStatus(200)
    .expectHeader('Content-Type', 'application/json')
    .expectBody({"question":"Favourite programming language?","choices":[{"choice":"Swift","votes":2048},{"choice":"Python","votes":1024}]})
    .end(done);
  });
});
