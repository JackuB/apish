import Promise from 'bluebird';
import deckardcain from 'deckardcain';

import mock from './mock';
import parseSwagger from './parser/swagger';
import callParsingService from './parser/parsing-service';
import parseBlueprint from './parser/protagonist';

const init = (apiDescription, options={}) => {
  return new Promise((resolve, reject) => {
    if (typeof apiDescription !== 'string') {
      return reject(new Error(`API description must be a string. I got '${typeof apiDescription}'`));
    }

    const contentType = deckardcain.identify(apiDescription);

    switch (contentType) {
      case 'application/swagger+yaml':
        resolve(parseSwagger(apiDescription).then((refract) => mock(refract, options)));
      case 'text/vnd.apiblueprint':
        return resolve(parseBlueprint(apiDescription).then((refract) => mock(refract, options)));
      default:
        return reject(new Error('Unknown or unsupported content-type'));
    }
  });
};

export default init;
