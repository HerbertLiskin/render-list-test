
import React, { useState, WheelEvent } from 'react';

import {
  UserItem
} from '../gql/graphql'
import { UsersListProps } from '../types';

const PAGE_SIZE: number = 20;
const START_PAGE: number = 1

const ListWithPagination: React.FC<UsersListProps> = ({usersList}) => {
  const [usersFullList] = useState<UserItem[]>(usersList.slice(0, 300))
  const [usersCurrentList, setUsersCurrentList] = useState<UserItem[]>(usersFullList.slice(0, PAGE_SIZE*2))
  const [page, setPage] = useState<number>(START_PAGE)

  const nextPage = () => {
    setUsersCurrentList(usersFullList.slice(PAGE_SIZE*(page - 1), PAGE_SIZE*(page+2)))
    setPage(page + 1)
  }

  const prevPage = () => {
    const sliceStart = page - 3 < 0
      ? 0
      : PAGE_SIZE*(page - 3)

    setUsersCurrentList(usersFullList.slice(sliceStart, PAGE_SIZE*page))
    setPage(page - 1)
  }

  const handleScrole = (e: WheelEvent<HTMLDivElement>) => {
    const targetDiv: HTMLElement = e.currentTarget as HTMLElement
    const	wrapperDiv: HTMLElement = targetDiv.children[0] as HTMLElement
    
    const overflowHeight: number = targetDiv.offsetHeight
    const scrollTop: number = targetDiv.scrollTop
    const wrapperHeight: number = wrapperDiv.offsetHeight
    const isScrollDown: boolean = e.deltaY > 0

    if(
      isScrollDown && 
      scrollTop >= wrapperHeight - overflowHeight*2 &&
      page < usersFullList.length/PAGE_SIZE
    ) {
      nextPage()
    } else if(
      !isScrollDown && 
      scrollTop <= overflowHeight*2 && 
      page > 1
    ) {
      prevPage()
    }
  }

  return (
    <div className='bg-green-300 pt-10 pb-10 md:pr-20 md:pl-20 pr-4 pl-4'>
      <div className='text-white text-3xl mb-3'>List with offset pagination</div>
      <div className='text-white text-xl mb-3'>Up/Down list with previous/next elements remove on scroll</div>
      <div className='inline-block mb-2 p-2 bg-pink-200 rounded-md text-white'>Page №: {page}</div>
        <div 
          className='max-h-96 overflow-scroll bg-pink-200 rounded-md'
          onWheel={handleScrole}
        >
          <div className='p-2'>
            {
              usersCurrentList.map((user: UserItem) => {
                const {
                  id,
                  index,
                  firstName, 
                  lastName
                } = user
                
                return (
                  <div 
                    className='p-2 m-2 mx-auto bg-gray-50 text-green-500 rounded-md'
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

export default ListWithPagination