import { Message } from 'element-ui';

export default {
  throwError(body) {
    Message.error({
      title: 'Error',
      message: body,
    });
  },
  throwGraphQLError(response) {
    const errors = response.graphQLErrors || [response.networkError];
    if (!errors.length) {
      errors.push({
        message: response.message,
      });
    }
    errors.forEach((error) => {
      const message = (error && error.message) || 'We ran into an unidentified error. Please try again';
      this.throwError(message);
    });
  },
  getGraphQLError(response) {
    const errors = response.graphQLErrors || [];
    return errors[0].message;
  },
};
