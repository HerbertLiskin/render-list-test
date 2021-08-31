
import React, { useState, WheelEvent } from 'react'

import {
  UserItem
} from '../gql/graphql'
import { UsersListProps } from '../types'

const OFFSET: number = 40;

const ListWithJsonCursorPagination: React.FC<UsersListProps> = ({usersList}) => {
  const [usersFullList] = useState<UserItem[]>(usersList)
  const [startCursor, setStartCursor] = useState<String>(usersFullList[0].id)
  const [endCursor, setEndCursor] = useState<String>(usersFullList[OFFSET].id)
  const [usersCurrentList, setUsersCurrentList] = useState<UserItem[]>(usersFullList.slice(0, OFFSET))


  const nextPage = () => {
    const lastIndex: number = usersFullList.findIndex(user => user.id === endCursor)
    const currentList: Array<UserItem> = usersFullList.slice(lastIndex-OFFSET, lastIndex+OFFSET)

    setUsersCurrentList(currentList)
    setStartCursor(currentList[0].id)
    setEndCursor(currentList[currentList.length -1].id)
  }

  const prevPage = () => {
    const startElementIndex: number = usersFullList.findIndex(user => user.id === startCursor)
    const startIndex: number = startElementIndex - OFFSET < 0 ? 0 : startElementIndex - OFFSET
    const lastIndex: number = startElementIndex - OFFSET < 0 ? OFFSET : startElementIndex

    const currentList: Array<UserItem>  = usersFullList.slice(startIndex, lastIndex+OFFSET)

    setUsersCurrentList(currentList)
    setStartCursor(currentList[0].id)
    setEndCursor(currentList[currentList.length -1].id)
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
      usersCurrentList[usersCurrentList.length - 1].index < usersFullList[usersFullList.length - 1].index
    ) {
      nextPage()
    } else if(
      !isScrollDown && 
      scrollTop <= overflowHeight*2 && 
      usersCurrentList[0].index > 0
    ) {
      prevPage()
    }
  }

  const listFirstIndex: number = usersCurrentList[0].index
  const listLastIndex: number = usersCurrentList[usersCurrentList.length-1].index

  return (
    <div className='bg-purple-500 pt-10 pb-10 md:pr-20 md:pl-20 pr-4 pl-4'>
      <div className='text-white text-3xl mb-3'>List with somthing like cursor pagination</div>
      <div className='text-white text-xl mb-3'>Previous/next elements remove on scroll. Cursor bound to id's.</div>
      <div className='w-full flex justify-between'>
        <div className='mb-2 mr-4 p-2 bg-red-500 rounded-md text-white'>Total count: {usersFullList.length}</div>
        <div className='mb-2 p-2 bg-red-500 rounded-md text-white'>Elements [start - end] indexes: {listFirstIndex} - {listLastIndex}</div>
      </div>
        <div 
          className='max-h-96 overflow-scroll rounded-md bg-red-500'
          onWheel={handleScrole}
        >
          <div className='p-2 grid grid-cols-2 md:grid-cols-3 gap-4'>
            {
              usersCurrentList.map((user: UserItem, i: number) => {
                const {
                  id,
                  index,
                  firstName, 
                  lastName
                } = user
                
                return (
                  <div 
                    className={`${i === 0 ? 'row-span-2': ''} p-2 bg-gray-50 text-purple-500 rounded-md`}
                    key={id}
                  >
                    <>
                    index: {index} <br /> 
                    {firstName} {lastName} <br />
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