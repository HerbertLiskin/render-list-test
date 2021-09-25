
import React, { useState, WheelEvent } from 'react'
import Bowser from 'bowser'

import {
  UserItem
} from '../gql/graphql'
import { UsersListProps } from '../types'

const PAGE_SIZE = 20
const START_PAGE = 1

const ListWithPagination: React.FC<UsersListProps> = ({usersList}) => {
  const [usersFullList] = useState(usersList.slice(0, 300))
  const [usersCurrentList, setUsersCurrentList] = useState(usersFullList.slice(0, PAGE_SIZE*2))
  const [page, setPage] = useState(START_PAGE)
  const [browserName] = useState(Bowser.getParser(window.navigator.userAgent).getBrowserName())

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
    const targetDiv = e.currentTarget
    const	wrapperDiv = targetDiv.children[0] as HTMLElement
    
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
      if(browserName === 'Safari') {
        targetDiv.scrollTop = (wrapperHeight - overflowHeight)/2 - overflowHeight*1.33
      }
    } else if(
      !isScrollDown && 
      scrollTop <= overflowHeight*2 && 
      page > 1
    ) {
      prevPage()
      if(browserName === 'Safari') {
        targetDiv.scrollTop = wrapperHeight - overflowHeight*2.66
      }
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
              usersCurrentList.map((user) => {
                const {
                  id,
                  index,
                  firstName, 
                  lastName,
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