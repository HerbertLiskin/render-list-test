
import React, { useState, WheelEvent } from 'react'
import Bowser from 'bowser'
import {
  UserItem
} from '../gql/graphql'
import { UsersListProps } from '../types'

const OFFSET: number = 40;


const ListWithJsonCursorPagination: React.FC<UsersListProps> = ({usersList}) => {
  const [usersFullList] = useState<UserItem[]>(usersList)
  const [startCursor, setStartCursor] = useState<String>(usersFullList[0].id)
  const [endCursor, setEndCursor] = useState<String>(usersFullList[OFFSET*2-1].id)
  const [usersCurrentList, setUsersCurrentList] = useState<UserItem[]>(usersFullList.slice(0, OFFSET*2))
  const [browserName] = useState<String>(Bowser.getParser(window.navigator.userAgent).getBrowserName())

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
      if(browserName === 'Safari') {
        targetDiv.scrollTop = (wrapperHeight - overflowHeight)/2 - overflowHeight*1.36 //1.33
      }

    } else if(
      !isScrollDown && 
      scrollTop <= overflowHeight && 
      usersCurrentList[0].index > 0
    ) {
      prevPage()
      if(browserName === 'Safari') {
        targetDiv.scrollTop = wrapperHeight - overflowHeight*2.50 //2.66
      }
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
          className='max-h-96 overflow-auto rounded-md bg-red-500'
          style={{maxHeight: '26rem'}}
          onWheel={handleScrole}
        >
          <div 
            className='p-2 grid grid-cols-2 md:grid-cols-3 gap-4 truncate'
          >
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