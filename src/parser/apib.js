import drafter from 'drafter.js';
import Promise from 'bluebird';

const parseBlueprint = (blueprint) => {
  return new Promise((resolve, reject) => {
    drafter.parse(blueprint, { requireBlueprintName: true }, (error, result) => {
      if (error) {
        return reject(error);
      }

      return resolve(result);
    });
  });
};

export default parseBlueprint;
