import Promise from 'bluebird';
import deckardcain from 'deckardcain';

import mock from './mock';
import callParsingService from './parser/parsing-service';

const init = (apiDescription='', options={}) => {
  return new Promise((resolve, reject) => {
    if (typeof apiDescription !== 'string') {
      return reject(new Error(`API description must be a string. I got '${typeof apiDescription}'`));
    }

    const contentType = deckardcain.identify(apiDescription);

    switch (contentType) {
      case 'application/swagger+yaml':
        resolve(callParsingService(apiDescription, contentType).then((refract) => mock(refract, options)));
      case 'text/vnd.apiblueprint':
        resolve(callParsingService(apiDescription, contentType).then((refract) => mock(refract, options)));
      default:
        reject(new Error('Unknown or unsupported content-type'));
    }
  });
};

export default init;
