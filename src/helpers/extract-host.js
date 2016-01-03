import _ from 'lodash';

export default (refract) => {
  let attributes = refract.content ? refract.content : refract;
  return _.chain(attributes)
    .filter({ 'element': 'member' })
    .filter((item) => item.content.key.content === 'HOST')
    .first()
    .get('content.value.content')
    .value();
};
