import {
  ApolloClient,
  createHttpLink,
  InMemoryCache,
} from '@apollo/client'
import { relayStylePagination } from '@apollo/client/utilities'

export function createApolloClient() {
  const cache = new InMemoryCache(
    {
      typePolicies: {
        Query: {
          fields: {
            users: relayStylePagination(),						
          },
        },
      },
    }
  )

  const httpLink = createHttpLink({
    uri: 'http://localhost:4000'
  })

  const client = new ApolloClient({
    link: httpLink,
    cache
  })

  return client
}
  