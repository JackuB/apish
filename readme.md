[![Build Status](https://img.shields.io/travis/JackuB/apish.svg)](https://travis-ci.org/JackuB/apish/)
[![Coveralls Status](https://img.shields.io/coveralls/JackuB/apish.svg)](https://coveralls.io/github/JackuB/apish?branch=master)
![apish - Mock APIs and Services](readme.png)

Describe any API or Service you need mocked.
Supports [API Blueprint](http://apiblueprint.org) and [Swagger](http://swagger.io) API Description formats.

### Use cases
#### 3rd party APIs

- Your app is calling GitHub API, weather API, Trello API, …
- Describe endpoints in API Description format like [API Blueprint](http://apiblueprint.org) 
(or ask API provider for API Description)
- Add it as a test fixture and let apish create mock for you:

```js
before(() => {
  return apish(fs.readFileSync('github-api.apib').toString());
});

// Run your tests with mocked requests against GitHub API
```


#### (Micro)services

- Have all your services publish API Description onto (private) npm. Use [semver](http://semver.org) to version it
and tools like [Dredd](https://github.com/apiaryio/dredd) to test its implementation
- When you depend on another service, just require its package with API Description and run tests against its mocks, 
that are always in sync with implementation
- You can always compare version you've tested against to what is currently running in your environment

```js
import myOtherService from 'myOtherService';

before(() => {
  return myOtherService = apish(myOtherService);
});

// Run your tests…
```

## Installation

```
$ npm i apish --save-dev
```

## Usage
```js
import apish from 'apish';

// or
var apish = require('apish');

// In your test runner
let mockResult = {};
before(() => {
  const apib = fs.readFileSync('github-api.apib').toString();
  return mockResult = apish(apib); // apish returns Promise
});

// Cleanup
after(() => {
  // .value() is Promise-related helper in this case
  mockResult.value().restore();
});
```

### Arguments

```js
let mockedapi = apish(apiDescription, options);
```

- `apiDescription` (string) - [API Blueprint](http://apiblueprint.org) or [Swagger](http://swagger.io) API Description
- `options` (OPTIONAL, object)
  - `host` (string) - overwrite specified host (base URL) that should be used
  
returns `Promise`

Resolved promise returns object with methods:

- `restore()` - clears all mocks for this host

## License
MIT
