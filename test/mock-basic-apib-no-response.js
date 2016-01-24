import fs from 'fs';
import hippie from 'hippie';
import apish from '../src/apish.js';

describe('Mock basic APIB without specified response', () => {
  let mockResult = {};
  before(() => {
    const apib = fs.readFileSync(__dirname + '/fixtures/basic-blueprint-no-response.apib');
    return mockResult = apish(apib.toString());
  });

  after(() => {
    mockResult.value().restore();
  });

  it('should not mock the GET /questions request', (done) => {
    hippie()
    .json()
    .base('http://example.com')
    .get('/questions')
    .expectStatus(200)
    .expectHeader('Content-Type', 'application/json')
    .expectBody({"question":"Favourite programming language?","choices":[{"choice":"Swift","votes":2048},{"choice":"Python","votes":1024}]})
    .end((err) => {
      expect(err).to.exist;
      expect(err).to.be.an.instanceOf(Error);
      done();
    });
  });
});
