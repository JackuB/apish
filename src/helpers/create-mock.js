import nock from 'nock';
import { URI } from 'uri-template-lite';

export default (settings) => {
  let requestBody = settings.requestBody;
  return nock(settings.host)
    .persist()
    .filteringPath((path) => {
      const URITemplate = new URI.Template(settings.resourceUrl);
      return !!URITemplate.match(path) ? settings.resourceUrl : '';
    })
    .filteringRequestBody(function() {
      // Request bodies are not matched
      // TODO
      // Try matching by keys for JSON?
      return requestBody;
    })
    [settings.requestMethod](settings.resourceUrl, requestBody, {
      reqheaders: settings.requestHeaders
    })
    .reply(
      settings.responseStatusCode,
      settings.responseBody,
      settings.responseHeaders
    );
};
