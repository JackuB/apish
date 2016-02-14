import fs from 'fs';
import hippie from 'hippie';
import apish from '../src/apish.js';

describe('Mock basic Swagger', () => {
  let mockResult = {};
  before(() => {
    const apib = fs.readFileSync(__dirname + '/fixtures/basic-swagger.yaml');
    return mockResult = apish(apib.toString());
  });

  after(() => {
    mockResult.value().restore();
  });

  it('should mock the GET /pets request with generated body', (done) => {
    hippie()
    .json()
    .base('http://petstore.swagger.io')
    .get('/api/pets')
    .expectStatus(200)
    .expectValue('[0].name', /\S+/)
    .expectValue('[0].id', /\d+/)
    .end(done);
  });
});
