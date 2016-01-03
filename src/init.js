import nock from 'nock';
import request from 'request';
import deckardcain from 'deckardcain';
import Promise from 'bluebird';

import mock from './mock';

const parserService = 'https://api.apiblueprint.org/transform';
nock.enableNetConnect('apiblueprint.org');

const init = (blueprint='', options={}) => {
  return new Promise((resolve, reject) => {
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

      return resolve(mock(response.body.output_document, options));
    });
  });
};

export default init;
