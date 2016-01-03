import _ from 'lodash';

export default (transaction) => {
  return _.chain(transaction.content)
    .filter({
      'element': 'asset',
      'meta': {
        'classes': ['messageBody']
      }
    })
    .get('[0].content')
    .value();
};
