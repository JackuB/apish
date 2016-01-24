import nock from 'nock';
import request from 'request';

const parserService = 'https://api.apiblueprint.org/transform';
nock.enableNetConnect('apiblueprint.org');

const callParsingService = (apiDescription, contentType) => {
  return new Promise((resolve, reject) => {
    const requestOptions = {
      'url': parserService,
      'method': 'POST',
      'json': true,
      'body': {
        'input_type': contentType,
        'input_document': apiDescription,
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
        return reject(new Error(`Parsing service responded with invalid data: ${JSON.stringify(response.body)}`));
      }

      return resolve(response.body.output_document);
    });
  });
};

export default callParsingService;
