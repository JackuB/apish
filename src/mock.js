import _ from 'lodash';
import nock from 'nock';
import Promise from 'bluebird';
import apiDescription from 'lodash-api-description';

import extractHost from './helpers/extract-host';
import extractBody from './helpers/extract-body';
import extractHeaders from './helpers/extract-headers';
import extractNextResponse from './helpers/extract-next-response';
import mockRoute from './helpers/create-mock';

apiDescription(_); // Extend lodash

const mock = (refract, options) => {
  return new Promise((resolve, reject) => {
    let routes = [];

    const resourceGroups = _.filter(refract.content, {
      'element': 'category'
    });

    const host = options.host || extractHost(resourceGroups[0].attributes.meta);
    if (!host) {
      return reject(new Error('No "host" specified for mock in API Description or options'));
    }

    resourceGroups.forEach((resourceGroup) => {
      // Parsing sometimes returns categories inside resourceGroups
      const resourcesFix = [{
        element: 'category',
        meta: {},
        content: _.filter(resourceGroup.content, { 'element': 'resource' })
      }];
      let categories = _.filter(resourceGroup.content, { 'element': 'category' });
      if (!categories.length) {
        categories = resourcesFix;
      }
      categories.forEach((category) => {
        const resources = _.resources(category);
        resources.forEach((resource) => {
          const resourceUrl = resource.attributes.href;
          const transitions = _.transitions(resource);
          transitions.forEach((transition) => {
            const httpTransactions = _.httpTransactions(transition);
            httpTransactions.forEach((httpTransaction) => {
              const transactions = httpTransaction.content;
              transactions.forEach((requestOrResponse, index) => {
                if (requestOrResponse.element !== 'httpRequest') {
                  return;
                }

                const nextElement = extractNextResponse(transactions, index);
                if (!nextElement) {
                  return;
                }

                const request = requestOrResponse;
                const response = nextElement;
                const requestMethod = request.attributes.method.toLowerCase();
                const requestHeaders = extractHeaders(request);
                const requestBody = extractBody(request);

                const responseStatusCode = response.attributes.statusCode;
                const responseBody = extractBody(response);

                // Prepare response headers
                const responseHeaders = extractHeaders(response);

                // Create nock for this transaction
                const nockOptions = {
                  host,
                  resourceUrl,
                  requestMethod,
                  requestBody,
                  requestHeaders,
                  responseStatusCode,
                  responseBody,
                  responseHeaders
                };

                // mocks.push(mockRoute(nockOptions));
                routes.push([resourceUrl, nockOptions]);
              });
            });
          });
        });
      });
    });

    // sort mocks by URL length
    routes.sort((a, b) => b[0].length - a[0].length);

    // collect mocks
    const mocks = [];
    routes.forEach(route => {
      mocks.push(mockRoute(route[1]));
    });
    
    const restore = () => {
      mocks.forEach((mock) => {
        mock.interceptors.forEach((interceptor) => nock.removeInterceptor(interceptor));
      });
    };

    resolve({
      restore
    });
  });
};

export default mock;
