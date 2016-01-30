import protagonist from 'protagonist';
import Promise from 'bluebird';

const parseBlueprint = (blueprint) => {
  return new Promise((resolve, reject) => {
    protagonist.parse(blueprint, { requireBlueprintName: true }, (error, result) => {
      if (error) {
        return reject(error);
      }

      return resolve(result);
    });
  });
};

export default parseBlueprint;
