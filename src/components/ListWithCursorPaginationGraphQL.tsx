
import { Maybe } from 'graphql/jsutils/Maybe';
import React, { UIEvent } from 'react';

import {
    useGetUsersQuery,
    UserItem
  } from '../gql/graphql'

const ListWithCursorPaginationGraphQL = () => {
  const { 
    data,
    fetchMore, 
  } = useGetUsersQuery({
    variables: {
      first: 20
    }
  })

  const handleScrole = (e: any) => {
    const targetDiv = e.target
    const wrapperDiv = targetDiv.children[0]

    const overflowHeight = targetDiv.offsetHeight
    const scrollTop = targetDiv.scrollTop
    const wrapperHeight = wrapperDiv.offsetHeight

    if(scrollTop >= wrapperHeight - overflowHeight*2) {
      fetchMore({
        variables: { 
          cursor: data?.users?.pageInfo.endCursor
        }
      })
    }
  }

  return (
    <div className='bg-indigo-200 pt-10 pb-10 md:pr-20 md:pl-20 pr-4 pl-4'>
      <div className='text-yellow-600 text-3xl mb-3'>List with relay style cursor pagination (Apollo)</div>
      <div className='text-yellow-600 text-xl mb-3'>Only down list without remove previous elements</div>
        <div 
          className='max-h-96 overflow-scroll bg-gray-200 rounded-md'
          onScroll={handleScrole}
        >
          <div className='p-2'>
            {
              data?.users?.edges.map((user) => {
                const {
                  id,
                  index,
                  firstName, 
                  lastName
                } = user?.node as UserItem
                
                return (
                  <div 
                    className='p-2 m-2 mx-auto bg-yellow-200 rounded-md text-indigo-500'
                    key={id}
                  >
                    {index} | {firstName} {lastName} | id: {id}
                  </div>
                )
              })
            }
          </div>
        </div>
    </div>
  )
}

export default ListWithCursorPaginationGraphQL