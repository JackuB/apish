import fury from 'fury';
import swaggerAdapter from 'fury-adapter-swagger';
import generateMessageBodies from 'refract-message-body-generator';

import Promise from 'bluebird';

fury.use(swaggerAdapter);

const parseSwagger = (swagger) => {
  return new Promise((resolve, reject) => {
    fury.parse({ source: swagger }, (err, minim) => {
      return err ? reject(err) : resolve(generateMessageBodies(minim.toRefract()));
    });
  });
};

export default parseSwagger;
