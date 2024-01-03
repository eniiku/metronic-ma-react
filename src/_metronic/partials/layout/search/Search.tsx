import { FC, useEffect, useRef, useState } from 'react'
import { SearchComponent } from '../../../assets/ts/components'
import { KTIcon, toAbsoluteUrl } from '../../../helpers'
import { useQuery } from 'react-query'
import { fetchAllUsers } from '../../../../services/api'
import { Link } from 'react-router-dom'

const Search: FC = () => {
  const element = useRef<HTMLDivElement | null>(null)
  const wrapperElement = useRef<HTMLDivElement | null>(null)
  const resultsElement = useRef<HTMLDivElement | null>(null)
  const emptyElement = useRef<HTMLDivElement | null>(null)

  const { data: users } = useQuery('users', fetchAllUsers)

  const [filteredUsers, setFilteredUsers] = useState<any[]>(users?.data)
  const [searchTerm, setSearchTerm] = useState<string>('')

  const processs = (search: SearchComponent) => {
    const filteredData = users?.data.filter((user: any) =>
      user.username.toLowerCase().includes(searchTerm)
    )

    // Updated list with filtered data
    setFilteredUsers(filteredData)

    // Show/hide results and error based on filtered data
    if (filteredData && filteredData.length > 0) {
      resultsElement.current!.classList.remove('d-none')
      emptyElement.current!.classList.add('d-none')
    } else {
      resultsElement.current!.classList.add('d-none')
      emptyElement.current!.classList.remove('d-none')
    }

    // Complete search
    search.complete()
  }

  const clear = () => {
    // Hide results
    resultsElement.current!.classList.add('d-none')
    // Hide empty message
    emptyElement.current!.classList.add('d-none')

    // Reset filteredUsers to the initial state (all users)
    setFilteredUsers(users?.data)
  }

  useEffect(() => {
    // Initialize search handler
    const searchObject = SearchComponent.createInsance('#kt_header_search')

    // Search handler
    searchObject!.on('kt.search.process', processs)

    // Clear handler
    searchObject!.on('kt.search.clear', clear)
  }, [searchTerm])

  return (
    <>
      <div
        id='kt_header_search'
        className='d-flex align-items-stretch'
        data-kt-search-keypress='true'
        data-kt-search-min-length='2'
        data-kt-search-enter='enter'
        data-kt-search-layout='menu'
        data-kt-menu-trigger='auto'
        data-kt-menu-overflow='false'
        data-kt-menu-permanent='true'
        data-kt-menu-placement='bottom-end'
        ref={element}
      >
        <div
          className='d-flex align-items-center'
          data-kt-search-element='toggle'
          id='kt_header_search_toggle'
        >
          <div className='btn btn-icon btn-custom btn-icon-muted btn-active-light btn-active-color-primary w-35px h-35px'>
            <KTIcon iconName='magnifier' className='fs-2' />
          </div>
        </div>

        <div
          data-kt-search-element='content'
          className='menu menu-sub menu-sub-dropdown p-7 w-325px w-md-375px'
        >
          <div ref={wrapperElement} data-kt-search-element='wrapper'>
            <form
              data-kt-search-element='form'
              className='w-100 position-relative mb-3'
              autoComplete='off'
            >
              <KTIcon
                iconName='magnifier'
                className='fs-2 text-lg-1 text-gray-500 position-absolute top-50 translate-middle-y ms-0'
              />

              <input
                type='text'
                className='form-control form-control-flush ps-10'
                name='search'
                placeholder='Search...'
                data-kt-search-element='input'
                onChange={(e) => setSearchTerm(e.target.value)}
              />

              <span
                className='position-absolute top-50 end-0 translate-middle-y lh-0 d-none me-1'
                data-kt-search-element='spinner'
              >
                <span className='spinner-border h-15px w-15px align-middle text-gray-500' />
              </span>

              <span
                className='btn btn-flush btn-active-color-primary position-absolute top-50 end-0 translate-middle-y lh-0 d-none'
                data-kt-search-element='clear'
              >
                <KTIcon iconName='cross' className='fs-2 text-lg-1 me-0' />
              </span>
            </form>

            <div
              ref={resultsElement}
              data-kt-search-element='results'
              className={`${filteredUsers?.length > 0 ? '' : 'd-none'}`}
              // className='d-none'
            >
              <div className='scroll-y mh-200px mh-lg-350px'>
                {filteredUsers?.map((user: any) => (
                  <Link
                    key={user?._id}
                    to={`/user/${user._id}`}
                    data-kt-search-element='toggle'
                    className='d-flex text-gray-900 text-hover-primary align-items-center mb-5'
                  >
                    <div className='symbol symbol-40px me-4'>
                      {user?.profilePicture ? (
                        <img
                          alt={`${user.username} Profile Pictute`}
                          src={user.profilePicture}
                        />
                      ) : (
                        <div className='symbol-label fs-2 fw-bold bg-info text-inverse-info'>
                          {user.username.slice(0, 1)}
                        </div>
                      )}
                    </div>

                    <div className='d-flex flex-column justify-content-start fw-bold'>
                      <span className='fs-7 fw-bold'>{user.username}</span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            <div
              ref={emptyElement}
              data-kt-search-element='empty'
              // className='d-none'
              className={`${filteredUsers?.length <= 0 ? '' : 'd-none'}`}
            >
              <div className='pt-10 pb-10'>
                <KTIcon iconName='search-list' className='fs-4x opacity-50' />
              </div>

              <div className='pb-15 fw-bold'>
                <h3 className='text-gray-600 fs-5 mb-2'>No result found</h3>
                <div className='text-muted fs-7'>
                  Please try again with a different query
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export { Search }
