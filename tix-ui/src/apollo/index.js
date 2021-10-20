import { ApolloClient } from 'apollo-client';
import { HttpLink } from 'apollo-link-http';
import { InMemoryCache, IntrospectionFragmentMatcher } from 'apollo-cache-inmemory';
import { setContext } from 'apollo-link-context';
import nodeFetch from 'node-fetch';
import introspectionQueryResultData from '../fragmentTypes.json';

// This is a way of mocking fetch so Jest can understand it
global.fetch = nodeFetch;

const fragmentMatcher = new IntrospectionFragmentMatcher({
  introspectionQueryResultData,
});

const httpLink = new HttpLink({
  uri: process.env.API_URL,
});

const authLink = setContext((_, { headers }) => {
  const token = localStorage.token;
  return {
    headers: {
      headers,
      Authorization: token ? `Bearer ${token}` : null,
    },
  };
});


const apolloClient = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache({ fragmentMatcher }),
  connectToDevTools: true,
});


export default apolloClient;
