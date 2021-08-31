const usersList = require('./data.json')

const resolvers = {
  Query: {
    users: (parent, args) => {
      const {first, after} = args;
      let afterIndex = 0

      const data = usersList

      if(after) {
        let nodeIndex = data.findIndex((datum) => datum.id === after)
        if (nodeIndex >= 0) {
          afterIndex = nodeIndex + 1
        }
      }

      const slicedData = data.slice(Number(afterIndex), Number(afterIndex) + Number(first))

      const edges = slicedData.map ((node) => ({
        node,
        cursor: node.id
      }))

      let endCursor = null
      let startCursor = null
      if (edges.length > 0) {
        startCursor = edges[0].node.id
        endCursor = edges[edges.length - 1].node.id
      }

      let hasNextPage = data.length > afterIndex + first

      return {
        totalCount: data.length,
        edges,
        pageInfo: {
          startCursor,
          endCursor,
          hasNextPage,
        }
      }
    }
  },
}

module.exports = resolvers
