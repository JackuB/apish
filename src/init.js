import nock from 'nock';
import request from 'request';
import deckardcain from 'deckardcain';
import Promise from 'bluebird';

import mock from './mock';

const parserService = 'https://api.apiblueprint.org/transform';
nock.enableNetConnect('apiblueprint.org');

const init = (blueprint='', options={}) => {
  return new Promise((resolve, reject) => {
    if (typeof blueprint !== 'string') {
      return reject(new Error(`API description must be a string. I got '${typeof blueprint}'`));
    }

    const contentType = deckardcain.identify(blueprint);
    if (!contentType) {
      return reject(new Error('Unknown or unsupported content-type'));
    }

    const requestOptions = {
      'url': parserService,
      'method': 'POST',
      'json': true,
      'body': {
        'input_type': contentType,
        'input_document': blueprint,
        'output_type': 'application/vnd.refract.parse-result',
        'options': {
          'source_map': false
        }
      },
    };

    request(requestOptions, (error, response) => {
      if (error) {
        return reject(error);
      }

      if (!response.body || !response.body.output_document) {
        return reject(new Error(`Parsing service responded with invalid data: ${response.body}`));
      }

      return resolve(mock(response.body.output_document, options));
    });
  });
};

export default init;
