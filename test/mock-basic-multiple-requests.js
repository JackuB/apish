import fs from 'fs';
import nock from 'nock';
import hippie from 'hippie';
import apish from '../src/apish.js';
import { expect } from 'chai'; // coverage runner fix

describe('Mock basic APIB with multiple requests and 1 response', () => {
  let mockResult = {};
  before(() => {
    const apib = fs.readFileSync(__dirname + '/fixtures/basic-blueprint-multiple-requests.apib');
    return mockResult = apish(apib.toString());
  });

  after(() => {
    mockResult.value().restore();
  });

  describe('mocking GET /questions depending on headers in request', () => {
    it('should mock the request with custom header "MyHeader1" and exact header content', (done) => {
      hippie()
      .json()
      .base('http://example.com')
      .get('/questions')
      .header('MyHeader1', 'content')
      .expectStatus(200)
      .expectHeader('Content-Type', 'application/json')
      .expectBody({"question":"Favourite programming language?","choices":[{"choice":"Swift","votes":2048},{"choice":"Python","votes":1024}]})
      .end(done);
    });

    it('should mock the request with custom header "MyHeader2" and different header content than specified', (done) => {
      hippie()
      .json()
      .base('http://example.com')
      .get('/questions')
      .header('MyHeader2', 'different header content')
      .expectStatus(200)
      .expectHeader('Content-Type', 'application/json')
      .expectBody({"question":"Favourite programming language?","choices":[{"choice":"Swift","votes":2048},{"choice":"Python","votes":1024}]})
      .end(done);
    });

    it('should not mock the request with some header "MyHeader3" and not "MyHeader1" or "MyHeader2"', (done) => {
      hippie()
      .json()
      .base('http://example.com')
      .get('/questions')
      .header('MyHeader3', 'some content')
      .expectStatus(200)
      .expectHeader('Content-Type', 'application/json')
      .expectBody({"question":"Favourite programming language?","choices":[{"choice":"Swift","votes":2048},{"choice":"Python","votes":1024}]})
      .end((err, res, body) => {
        expect(err).to.exist;
        expect(err).to.be.an.instanceOf(Error);
        done();
      });
    });
  });
});
