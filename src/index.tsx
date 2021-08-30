import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import App from './App'

import { ApolloProvider } from '@apollo/client'
import { createApolloClient } from './gql/apollo'

const client = createApolloClient()

ReactDOM.render(
  <React.StrictMode>
    <ApolloProvider  client={client}>
      <App />
    </ApolloProvider>
  </React.StrictMode>,
  document.getElementById('root')
)