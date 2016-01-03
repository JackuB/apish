import _ from 'lodash';
import URI from 'urijs';
import nock from 'nock';
import Promise from 'bluebird';
import apiDescription from 'lodash-api-description';

import extractHost from './helpers/extract-host';
import extractBody from './helpers/extract-body';
import extractHeaders from './helpers/extract-headers';
import mockRoute from './helpers/create-mock';

apiDescription(_); // Extend lodash

const mock = (response='', options) => {
  return new Promise((resolve, reject) => {
    let refract = {};
    try {
      refract = JSON.parse(response);
    } catch (error) {
      return reject(new Error('Failed to JSON.parse refract object'));
    }

    if (refract.element !== 'parseResult') {
      return reject(new Error('Expected refract object'));
    }

    const resourceGroups = _.filter(refract.content, {
      'element': 'category'
    });
    const host = options.host || extractHost(resourceGroups[0].attributes.meta);

    resourceGroups.forEach((resourceGroup) => {
      // Plutonium sometimes returns categories inside resourceGroups
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

                const nextElement = transactions[index + 1];
                if (!nextElement || nextElement.element !== 'httpResponse') {
                  return;
                }

                const request = requestOrResponse;
                const response = transactions[index + 1];
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
                mockRoute(nockOptions);
              });
            });
          });
        });
      });
    });

    const restore = () => {
      nock.removeInterceptor({
        hostname: new URI(host).hostname()
      });
    };

    resolve({
      restore
    });
  });
};

export default mock;
