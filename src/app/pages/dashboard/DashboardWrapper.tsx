import { FC, useEffect, useState } from 'react'
import { useQuery } from 'react-query'
import { fetchAllTradeSummary } from '../../../services/api'
import { TradeWidget } from '../../../_metronic/partials/widgets/custom/TradeWidget'
import { ToolbarCustom } from '../../../_metronic/layout/components/toolbar/toolbars'

const DashboardPage: FC = () => {
  const [currentPage, setCurrentPage] = useState<number>(1)
  const totalPages = 10

  const {
    data: summary,
    isLoading,
    isError,
  } = useQuery(['summary', currentPage], () =>
    fetchAllTradeSummary(undefined, currentPage)
  )

  const [tradesData, setTradesData] = useState(summary)
  const [filterDataLoading, setFilterDataLoading] = useState(false)

  useEffect(() => {
    // Update tradesData whenever summary changes
    setTradesData(summary)
  }, [summary])

  const handlePageClick = (pageNumber: number) => {
    setCurrentPage(pageNumber)
  }

  const renderPageNumbers = () => {
    const pageNumbers = []

    for (let i = 1; i <= totalPages; i++) {
      if (
        i === currentPage ||
        i === currentPage - 1 ||
        i === currentPage + 1 ||
        i === 1 ||
        i === totalPages
      ) {
        pageNumbers.push(
          <li
            key={i}
            className={`page-item ${currentPage === i ? 'active' : ''}`}
          >
            <a
              href='#'
              className='page-link'
              onClick={() => handlePageClick(i)}
            >
              {i}
            </a>
          </li>
        )
      } else if (i === currentPage - 2 || i === currentPage + 2) {
        // Display ellipsis for pages not directly adjacent to current page
        pageNumbers.push(
          <li key={i} className='page-item disabled'>
            <span className='page-link'>...</span>
          </li>
        )
      }
    }

    return pageNumbers
  }

  return (
    <>
      <ToolbarCustom action={setTradesData} loader={setFilterDataLoading} />

      {/* custom begin::Row */}
      <div className='row gy-5 g-xl-8 mb-5 mb-xl-10'>
        {filterDataLoading ? (
          <div>Loading...</div>
        ) : isLoading ? (
          <div>Loading...</div>
        ) : isError ? (
          <div>Error Loading Trades</div>
        ) : tradesData?.data?.summary_data?.length > 0 ? (
          <div>
            <TradeWidget
              data={tradesData?.data}
              showTitle={true}
              className='card-xl-stretch mb-xl-8'
            />
          </div>
        ) : (
          <div>No Trades Found</div>
        )}
      </div>
      {/* custom end::Row */}

      {/* begin:: Pagination */}
      <ul className='pagination'>
        <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
          <a
            href='#'
            className='page-link'
            onClick={() => handlePageClick(currentPage - 1)}
            aria-label='Go to Previous page'
          >
            <i className='previous'></i>
          </a>
        </li>

        {renderPageNumbers()}

        <li className={`page-item ${currentPage === 10 ? 'disabled' : ''}`}>
          <a
            href='#'
            className='page-link'
            onClick={() => handlePageClick(currentPage + 1)}
            aria-label='Go to Next page'
          >
            <i className='next'></i>
          </a>
        </li>
      </ul>
      {/* end:: Pagination */}
    </>
  )
}

const DashboardWrapper: FC = () => {
  return (
    <>
      <DashboardPage />
    </>
  )
}

export { DashboardWrapper }
