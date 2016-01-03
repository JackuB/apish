import _ from 'lodash';

export default (response={}) => {
  const headersArray = _.get(response, 'attributes.headers.content') || [];

  let responseHeaders = undefined;
  headersArray.forEach((member) => {
    responseHeaders = responseHeaders || {};
    responseHeaders[member.content.key.content] = member.content.value.content;
  });

  return responseHeaders;
};
