const {ApolloServer, gql} = require('apollo-server')
const resolvers= require('./resolvers')

const typeDefs = gql`
	type Query {
		users(first: Int, after: String): Users
	}

	type UserItem {
		id: ID!
		index: Int!
		firstName: String!
		lastName: String!
	}

	type Edge {
		node: UserItem
		cursor: String
	}

	type Users {
		edges: [Edge]!
		pageInfo: PageInfo!
		totalCount: String!
	}

  type PageInfo {
    startCursor: String
    endCursor: String
    hasNextPage: Boolean
  }
`

const server = new ApolloServer({
  typeDefs,
  resolvers,
})

server.listen().then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`)
})
