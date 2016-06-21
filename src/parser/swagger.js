import fury from 'fury';
import swaggerAdapter from 'fury-adapter-swagger';

import Promise from 'bluebird';

fury.use(swaggerAdapter);

const parseSwagger = (swagger) => {
  return new Promise((resolve, reject) => {
    fury.parse({ source: swagger }, (err, minim) => {
      return err ? reject(err) : resolve(minim.toRefract());
    });
  });
};

export default parseSwagger;
