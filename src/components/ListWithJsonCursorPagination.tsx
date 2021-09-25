
import React, { useState, WheelEvent } from 'react'
import Bowser from 'bowser'
import {
  UserItem
} from '../gql/graphql'
import { UsersListProps } from '../types'

const OFFSET = 40;


const ListWithJsonCursorPagination: React.FC<UsersListProps> = ({usersList}) => {
  const [usersFullList] = useState(usersList)
  const [startCursor, setStartCursor] = useState(usersFullList[0].id)
  const [endCursor, setEndCursor] = useState(usersFullList[OFFSET*2-1].id)
  const [usersCurrentList, setUsersCurrentList] = useState(usersFullList.slice(0, OFFSET*2))
  const [browserName] = useState(Bowser.getParser(window.navigator.userAgent).getBrowserName())

  const nextPage = () => {
    const lastIndex = usersFullList.findIndex(user => user.id === endCursor)
    const currentList = usersFullList.slice(lastIndex-OFFSET+1, lastIndex+OFFSET+1)

    setUsersCurrentList(currentList)
    setStartCursor(currentList[0].id)
    setEndCursor(currentList[currentList.length -1].id)
  }

  const prevPage = () => {
    const startElementIndex = usersFullList.findIndex(user => user.id === startCursor)
    const startIndex = startElementIndex - OFFSET < 0 ? 0 : startElementIndex - OFFSET
    const lastIndex = startElementIndex - OFFSET < 0 ? OFFSET : startElementIndex

    const currentList = usersFullList.slice(startIndex, lastIndex+OFFSET)

    setUsersCurrentList(currentList)
    setStartCursor(currentList[0].id)
    setEndCursor(currentList[currentList.length -1].id)
  }

  const handleScrole = (e: WheelEvent<HTMLDivElement>) => {
    const targetDiv = e.currentTarget
    const	wrapperDiv = targetDiv.children[0] as HTMLElement
    
    const overflowHeight = targetDiv.offsetHeight
    const scrollTop = targetDiv.scrollTop
    const wrapperHeight = wrapperDiv.offsetHeight
    const isScrollDown = e.deltaY > 0

    const nextScrollPos = (wrapperHeight - overflowHeight)/2 - overflowHeight*4.5 //*2.5//*2//*1.5
    const prevScrollPos = wrapperHeight - overflowHeight*5 //*3//*2.5//*2

    if(
      isScrollDown && 
      scrollTop > prevScrollPos &&
      usersCurrentList[usersCurrentList.length - 1].index < usersFullList[usersFullList.length - 1].index
    ) {
      nextPage()
      if(browserName === 'Safari') {
        targetDiv.scrollTop = nextScrollPos
      }
    } else if(
      !isScrollDown && 
      scrollTop < nextScrollPos && 
      usersCurrentList[0].index > 0
    ) {
      prevPage()
      if(browserName === 'Safari') {
        targetDiv.scrollTop = prevScrollPos
      }
    }
  }

  const listFirstIndex = usersCurrentList[0].index
  const listLastIndex = usersCurrentList[usersCurrentList.length-1].index

  return (
    <div className='bg-purple-500 pt-10 pb-10 md:pr-20 md:pl-20 pr-4 pl-4'>
      <div className='text-white text-3xl mb-3'>List with somthing like cursor pagination</div>
      <div className='text-white text-xl mb-3'>Previous/next elements remove on scroll. Cursor bound to id's.</div>
      <div className='w-full flex justify-between'>
        <div className='mb-2 mr-4 p-2 bg-red-500 rounded-md text-white'>Total count: {usersFullList.length}</div>
        <div className='mb-2 p-2 bg-red-500 rounded-md text-white'>Elements [start - end] indexes: {listFirstIndex} - {listLastIndex}</div>
      </div>
        <div 
          className='max-h-96 overflow-auto rounded-md bg-red-500'
          onWheel={handleScrole}
        >
          <div 
            className='p-2 grid grid-cols-1 gap-4 truncate'
          >
            {
              usersCurrentList.map((user) => {
                const {
                  id,
                  index,
                  firstName, 
                  lastName
                } = user
                
                return (
                  <div 
                    className={`p-2 bg-gray-50 text-purple-500 rounded-md`}
                    key={id}
                  >
                    <>
                    index: {index} {firstName} {lastName} <br />
                    <span className='text-xs'>id: {id}</span>
                    </>
                  </div>
                )
              })
            }
          </div>
        </div>
    </div>
  )
}

export default ListWithJsonCursorPagination