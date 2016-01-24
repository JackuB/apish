import fs from 'fs';
import nock from 'nock';
import hippie from 'hippie';
import apish from '../src/apish.js';

describe('Mock basic Swagger', () => {
  let mockResult = {};
  before(() => {
    nock.disableNetConnect('apiblueprint.org');
    const apib = fs.readFileSync(__dirname + '/fixtures/basic-swagger.yaml');
    return mockResult = apish(apib.toString());
  });

  after(() => {
    nock.enableNetConnect('apiblueprint.org');
    mockResult.value().restore();
  });

  it('should mock the GET /pets request with generated body', (done) => {
    hippie()
    .json()
    .base('http://petstore.swagger.io')
    .get('/api/pets')
    .expectStatus(200)
    //TODO: we need refract body generator
    //.expectValue('[0].name', /\S+/)
    //.expectValue('[0].id', /\d+/)
    .end(done);
  });
});
