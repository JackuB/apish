import nock from 'nock';
import { URI } from 'uri-template-lite';

const ignoredHeaders = ['content-type'];

export default (settings) => {
  // Create nock reference for this host
  let nockObject = nock(settings.host);

  // Setup nock basic properties

  // Allow multiple requests
  // TODO: allow to disable it
  nockObject.persist();

  // Setup URI template filtering
  nockObject.filteringPath((path) => {
    const URITemplate = new URI.Template(settings.resourceUrl);
    return !!URITemplate.match(path) ? settings.resourceUrl : '';
  });

  // Filter for Request bodies
  nockObject.filteringRequestBody((requestBody) => {
    // Request bodies are not matched
    // TODO
    // Try matching by keys for JSON?
    if (settings.requestBody && requestBody) {
      return settings.requestBody;
    }
    return false;
  });

  if (settings.requestHeaders) {
    for (let header in settings.requestHeaders) {
      if (ignoredHeaders.indexOf(header.toLowerCase()) > -1) {
        delete settings.requestHeaders[header];
      } else {
        // TODO
        // allow checking for a match with settings.requestHeaders[header]
        nockObject['matchHeader'](header, (val) => val ? true : false);
      }
    }
  }

  // Setup Request and Response
  nockObject[settings.requestMethod](settings.resourceUrl, settings.requestBody, {
    reqheaders: settings.requestHeaders
  })
  .reply(
    settings.responseStatusCode,
    settings.responseBody,
    settings.responseHeaders
  );

  return nockObject;
};
