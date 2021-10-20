import { ApolloClient } from 'apollo-client';
import { HttpLink } from 'apollo-link-http';
import { InMemoryCache, IntrospectionFragmentMatcher } from 'apollo-cache-inmemory';
import { setContext } from 'apollo-link-context';
import introspectionQueryResultData from '../fragmentTypes.json';

const fragmentMatcher = new IntrospectionFragmentMatcher({
  introspectionQueryResultData,
});

const adminHttpLink = new HttpLink({
  uri: process.env.ADMIN_API_URL,
});


const adminAuthLink = setContext((_, { headers }) => {
  const adminToken = localStorage.adminToken;
  return {
    headers: {
      headers,
      Authorization: adminToken ? `Bearer ${adminToken}` : null,
    },
  };
});

const adminApolloClient = new ApolloClient({
  link: adminAuthLink.concat(adminHttpLink),
  cache: new InMemoryCache({ fragmentMatcher }),
  connectToDevTools: true,
});

export default adminApolloClient;

