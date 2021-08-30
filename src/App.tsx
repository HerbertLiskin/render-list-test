import React from 'react'

import ListWithCursorPaginationQL from './components/ListWithCursorPaginationGraphQL'
import ListWithPagination from './components/ListWithPagination'
import ListWithJsonCursorPagination from './components/ListWithJsonCursorPagination'

import usersList from './data.json'

function App() {
  return (
    <div className='font-mono'>
      <ListWithJsonCursorPagination usersList={usersList}/>
      <ListWithCursorPaginationQL /> 
      <ListWithPagination usersList={usersList}/>
    </div>
  )
}

export default App
