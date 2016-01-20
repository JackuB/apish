import fs from 'fs';
import hippie from 'hippie';
import apish from '../src/apish.js';

describe('Mock Plutonium service', () => {
  let mockResult = {};
  before(() => {
    const apib = fs.readFileSync(__dirname + '/fixtures/plutonium-blueprint.apib');
    return mockResult = apish(apib.toString());
  });

  after(() => {
    mockResult.value().restore();
  });

  it('should mock the GET / request', (done) => {
    hippie()
    .json()
    .base('https://api.apiblueprint.org')
    .get('/')
    .expectStatus(200)
    .expectHeader('Content-Type', 'application/hal+json')
    .expectBody({'_links':{'self':{'href':'/'},'parse':{'href':'/parser'},'compose':{'href':'/composer'}}})
    .end(done);
  });

  it('should mock the POST /transform request', (done) => {
    hippie()
    .json()
    .base('https://api.apiblueprint.org')
    .post('/transform')
    .header('Content-Type', 'application/json')
    .send({"input_document":"","input_type":"","options":{"source_map":false},"output_type":""})
    .expectStatus(200)
    .expectHeader('Content-Type', 'application/hal+json')
    .expectBody({"meta":{"transformation_time":"","input_size":0,"output_size":0},"output_document":"","output_type":""})
    .end(done);
  });

  it('should mock the POST /parser request', (done) => {
    hippie()
    .json()
    .serializer((input, callback) => {
      callback(null, input);
    })
    .base('https://api.apiblueprint.org')
    .post('/parser')
    .header('Content-Type', 'text/vnd.apiblueprint')
    .header('Accept', 'application/vnd.refract+json')
    .send('FORMAT: 1A')
    .expectStatus(200)
    .expectHeader('Content-Type', 'application/vnd.refract+json')
    .expectBody({"element":"parseResult","content":[{"element":"category","meta":{"classes":["api"],"title":""},"content":[{"element":"category","meta":{"classes":["resourceGroup"],"title":""},"content":[{"element":"resource","meta":{"title":""},"attributes":{"href":"/message"},"content":[{"element":"transition","meta":{"title":""},"content":[{"element":"httpTransaction","content":[{"element":"httpRequest","attributes":{"method":"GET"},"content":[]},{"element":"httpResponse","attributes":{"statusCode":"200","headers":{"element":"httpHeaders","content":[{"element":"member","content":{"key":{"element":"string","content":"Content-Type"},"value":{"element":"string","content":"text/plain"}}}]}},"content":[{"element":"asset","meta":{"classes":"messageBody"},"attributes":{"contentType":"text/plain"},"content":"Hello World!\n"}]}]}]}]}]}]}]})
    .end(done);
  });

  it('should mock the POST /composer request', (done) => {
    hippie()
    .json()
    .parser((input, callback) => {
      callback(null, input);
    })
    .base('https://api.apiblueprint.org')
    .post('/composer')
    .header('Content-Type', 'application/vnd.apiblueprint.ast+json')
    .send({"_version": "4.0"})
    .expectStatus(200)
    .expectHeader('Content-Type', 'text/vnd.apiblueprint')
    .expectBody(/\+ Response 200 \(text\/plain\)/)
    .end(done);
  });
});
