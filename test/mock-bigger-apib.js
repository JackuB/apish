import fs from 'fs';
import hippie from 'hippie';
import apish from '../src/apish.js';
import { expect } from 'chai';

describe('Mock bigger APIB', () => {
  let mockResult = {};
  before(() => {
    const apib = fs.readFileSync(__dirname + '/fixtures/bigger-blueprint.apib');
    return mockResult = apish(apib.toString());
  });

  after(() => {
    mockResult.value().restore();
  });


  it('should mock the GET /questions?page=1 request including body', (done) => {
    hippie()
    .json()
    .base('http://polls.apiblueprint.org')
    .get('/questions?page=1')
    .expectStatus(200)
    .expectHeader('Content-Type', 'application/vnd.siren+json')
    .expectBody({"actions":[{"name":"add","href":"/questions","method":"POST","type":"application/json","fields":[{"name":"question"},{"name":"choices"}]}],"links":[{"rel":["next"],"href":"/questions?page=2"},{"rel":["self"],"href":"/questions"}],"entities":[{"actions":[{"name":"delete","href":"/questions/1","method":"DELETE"}],"rel":["question"],"properties":{"published_at":"2014-11-11T08:40:51.620Z","question":"Favourite programming language?"},"links":[{"rel":["self"],"href":"/questions/1"}],"entities":[{"actions":[{"name":"vote","href":"/questions/1/choices/1","method":"POST"}],"rel":["choice"],"properties":{"choice":"Swift","votes":2048},"links":[{"rel":["self"],"href":"/questions/1/choices/1"}]},{"actions":[{"name":"vote","href":"/questions/1/choices/2","method":"POST"}],"rel":["choice"],"properties":{"choice":"Python","votes":1024},"links":[{"rel":["self"],"href":"/questions/1/choices/2"}]},{"actions":[{"name":"vote","href":"/questions/1/choices/3","method":"POST"}],"rel":["choice"],"properties":{"choice":"Objective-C","votes":512},"links":[{"rel":["self"],"href":"/questions/1/choices/3"}]},{"actions":[{"name":"vote","href":"/questions/1/choices/4","method":"POST"}],"rel":["choice"],"properties":{"choice":"Ruby","votes":256},"links":[{"rel":["self"],"href":"/questions/1/choices/4"}]}]}]})
    .end(done);
  });

  it('should mock the GET /questions?page=123 request including body', (done) => {
    hippie()
    .json()
    .base('http://polls.apiblueprint.org')
    .get('/questions?page=1')
    .expectStatus(200)
    .expectHeader('Content-Type', 'application/vnd.siren+json')
    .expectBody({"actions":[{"name":"add","href":"/questions","method":"POST","type":"application/json","fields":[{"name":"question"},{"name":"choices"}]}],"links":[{"rel":["next"],"href":"/questions?page=2"},{"rel":["self"],"href":"/questions"}],"entities":[{"actions":[{"name":"delete","href":"/questions/1","method":"DELETE"}],"rel":["question"],"properties":{"published_at":"2014-11-11T08:40:51.620Z","question":"Favourite programming language?"},"links":[{"rel":["self"],"href":"/questions/1"}],"entities":[{"actions":[{"name":"vote","href":"/questions/1/choices/1","method":"POST"}],"rel":["choice"],"properties":{"choice":"Swift","votes":2048},"links":[{"rel":["self"],"href":"/questions/1/choices/1"}]},{"actions":[{"name":"vote","href":"/questions/1/choices/2","method":"POST"}],"rel":["choice"],"properties":{"choice":"Python","votes":1024},"links":[{"rel":["self"],"href":"/questions/1/choices/2"}]},{"actions":[{"name":"vote","href":"/questions/1/choices/3","method":"POST"}],"rel":["choice"],"properties":{"choice":"Objective-C","votes":512},"links":[{"rel":["self"],"href":"/questions/1/choices/3"}]},{"actions":[{"name":"vote","href":"/questions/1/choices/4","method":"POST"}],"rel":["choice"],"properties":{"choice":"Ruby","votes":256},"links":[{"rel":["self"],"href":"/questions/1/choices/4"}]}]}]})
    .end(done);
  });

  it('should mock the GET /questions?page=xyz request including body', (done) => {
    hippie()
    .json()
    .base('http://polls.apiblueprint.org')
    .get('/questions?page=1')
    .expectStatus(200)
    .expectHeader('Content-Type', 'application/vnd.siren+json')
    .expectBody({"actions":[{"name":"add","href":"/questions","method":"POST","type":"application/json","fields":[{"name":"question"},{"name":"choices"}]}],"links":[{"rel":["next"],"href":"/questions?page=2"},{"rel":["self"],"href":"/questions"}],"entities":[{"actions":[{"name":"delete","href":"/questions/1","method":"DELETE"}],"rel":["question"],"properties":{"published_at":"2014-11-11T08:40:51.620Z","question":"Favourite programming language?"},"links":[{"rel":["self"],"href":"/questions/1"}],"entities":[{"actions":[{"name":"vote","href":"/questions/1/choices/1","method":"POST"}],"rel":["choice"],"properties":{"choice":"Swift","votes":2048},"links":[{"rel":["self"],"href":"/questions/1/choices/1"}]},{"actions":[{"name":"vote","href":"/questions/1/choices/2","method":"POST"}],"rel":["choice"],"properties":{"choice":"Python","votes":1024},"links":[{"rel":["self"],"href":"/questions/1/choices/2"}]},{"actions":[{"name":"vote","href":"/questions/1/choices/3","method":"POST"}],"rel":["choice"],"properties":{"choice":"Objective-C","votes":512},"links":[{"rel":["self"],"href":"/questions/1/choices/3"}]},{"actions":[{"name":"vote","href":"/questions/1/choices/4","method":"POST"}],"rel":["choice"],"properties":{"choice":"Ruby","votes":256},"links":[{"rel":["self"],"href":"/questions/1/choices/4"}]}]}]})
    .end(done);
  });

  it('should mock the GET request with URI template', (done) => {
    hippie()
    .json()
    .base('http://polls.apiblueprint.org')
    .post('/questions/123/choices/123')
    .expectStatus(201)
    .expectHeader('Content-Type', 'application/vnd.siren+json')
    .expectBody({"actions":[{"name":"vote","href":"/questions/1/choices/1","method":"POST"}],"rel":["choice"],"properties":{"choice":"Swift","votes":2049},"links":[{"rel":["self"],"href":"/questions/1/choices/1"}]})
    .end(done);
  });
});
