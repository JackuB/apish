import fs from 'fs';
import hippie from 'hippie';
import apish from '../dist/apish.js';

describe('Mock APIB with parameters in URL', () => {
  let mockResult = {};
  before(() => {
    const apib = fs.readFileSync(__dirname + '/fixtures/apib-url-parameters.apib');
    return mockResult = apish(apib.toString());
  });

  after(() => {
    mockResult.value().restore();
  });

  it('should mock the GET /users/example/posts/ request including body', (done) => {
    hippie()
    .json()
    .base('http://example.com')
    .get('/users/example/posts/')
    .expectStatus(200)
    .expectHeader('Content-Type', 'application/json')
    .expectBody([
      {
        id: 1,
        user_id: 1,
        text: 'Post text'
      }
    ])
    .end(done);
  });
});
