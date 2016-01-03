[![Build Status](https://img.shields.io/travis/JackuB/nockmock.svg)](https://travis-ci.org/JackuB/nockmock/)
[![Coveralls Status](https://img.shields.io/coveralls/JackuB/nockmock.svg)](https://coveralls.io/github/JackuB/nockmock?branch=master)
![nockmock - Mock APIs and Services in tests](https://cloud.githubusercontent.com/assets/1788727/12077109/7b16f488-b1d0-11e5-99ce-178a3ae81ae8.png)

Describe any API or Service you need mocked for tests.
Supports [API Blueprint](http://apiblueprint.org) and [Swagger](http://swagger.io) API description formats.

### Use cases
#### 3rd party APIs

- Your app is calling GitHub API, weather API, Trello API, …
- Describe endpoints in API description format like [API Blueprint](http://apiblueprint.org) 
(or ask API provider for API description)
- Add it as a test fixture and let nockmock create mock for you:

```js
before(() => {
  return nockmock(fs.readFileSync('github-api.apib').toString());
});

// Run your tests with mocked requests against GitHub API
```


#### (Micro)services

- Have all your services publish API description onto (private) npm. Use [semver](http://semver.org) to version it
and tools like [Dredd](https://github.com/apiaryio/dredd) to test its implementation
- When you depend on another service, just require its package with API description and run tests against its mocks, 
that are always in sync with implementation
- You can always compare version you've tested against to what is currently running in your environment

```js
import myOtherService from 'myOtherService';

before(() => {
  return myOtherService = nockmock(myOtherService);
});

// Run your tests…
```

## Installation

```
$ npm i nockmock --save-dev
```

## Usage
```js
import nockmock from 'nockmock';

// or
var nockmock = require('nockmock');

// In your test runner
let mockResult = {};
before(() => {
  const apib = fs.readFileSync('github-api.apib').toString();
  return mockResult = nockmock(apib); // nockmock returns Promise
});

// Cleanup
after(() => {
  // .value() is Promise-related helper in this case
  mockResult.value().restore();
});
```

### Arguments

```js
let mockedapi = nockmock(apiDescription, options);
```

- `apiDescription` (string) - [API Blueprint](http://apiblueprint.org) or [Swagger](http://swagger.io) API description
- `options` (OPTIONAL, object)
  - `host` (string) - overwrite specified host (base URL) that should be used
  
returns `Promise`

Resolved promise returns object with methods:

- `restore()` - clears all mocks for this host

## License
MIT
