import clsx from 'clsx'

import { toAbsoluteUrl } from '../../../helpers'
import { KTIcon } from '../../../helpers'

type Props = {
  user: { image: string; name: string }
  trade: {
    title: string
    percent: number
    price: number
  }
  className: string
  reason?: boolean
}

const itemClass = ''
const btnClass =
  'btn btn-icon btn-custom btn-icon-gray-600 btn-active-gray-600 btn-active-color-primary w-35px h-35px'
const btnIconClass = 'fs-1 text-white-gray-600 -ms-5'

const TradeWidget = ({ user, className, reason, trade }: Props) => (
  <div className={`card card-flush ${className} bg-muted`}>
    <div className='p-2 pb-0 d-flex align-items-center justify-content-between w-xl-75'>
      <div className='d-flex align-items-center gap-3'>
        <div className='text-white-gray-600 fw-bolder fs-2'>{trade.title}</div>
        <img
          alt='Trade Icon'
          src={
            trade.percent < 0
              ? toAbsoluteUrl('media/custom/bull.png')
              : toAbsoluteUrl('media/custom/bear.png')
          }
          className='h-20px h-lg-30px'
        />
      </div>

      <div className='fw-bold'>
        <div className='text-success'>BOUGHT</div>
        <div className='text-warning'>OPTION</div>
      </div>

      <div className='d-flex align-items-center fw-bold fs-8'>
        <div className='bg-white-gray-600 bg-opacity-50 text-white-gray-600 rounded-start-2 p-2 text-center'>
          <div className='opacity-50 text-gray-600'>Price Loss</div>
          <div className='fs-5'>${trade.price}</div>
        </div>

        <div className='bg-gray-600 bg-opacity-25 text-gray-600 p-2 rounded-end-2 text-center'>
          <div className='fs-5 text-danger'>{trade.percent}%</div>
          <div className='text-white-gray-600 opacity-50'>% Loss</div>
        </div>
      </div>
    </div>

    <div className='separator separator-solid my-3 mx-2 d-xl-none' />

    {/* Data Display */}
    <div className='p-2 w-100'>
      {Array.from({ length: 2 }).map((_, index) => (
        <div
          key={index}
          className='d-flex align-items-center justify-content-between mb-2'
        >
          <div
            className={`rounded-2 w-80px text-center py-1  fw-bold fs-7 ${
              index === 1 ? 'bg-success' : 'bg-danger'
            }`}
          >
            {index === 1 ? 'BOUGHT' : 'SOLD'}
          </div>

          <div className='d-flex align-items-center fw-semibold fs-8'>
            <div className='bg-gray-600 text-white-gray-600 rounded-start-2 p-2'>
              Dec 15
            </div>{' '}
            <div className='bg-white-gray-600 bg-opacity-25 text-gray-600 p-2 rounded-end-2'>
              -2D
            </div>
          </div>

          <div className='d-flex align-items-center fw-semibold fs-8'>
            <div className='bg-gray-600 text-white-gray-600 rounded-start-2 p-2'>
              $77.5
            </div>{' '}
            <div className='bg-white-gray-600 bg-opacity-25 text-gray-600 p-2 rounded-end-2'>
              C
            </div>
          </div>

          <div className='d-flex align-items-center fw-semibold fs-8 gap-2'>
            <div>@</div>
            <div className='bg-gray-600 text-white-gray-600 rounded-2 p-2'>
              $0.025
            </div>
          </div>
        </div>
      ))}
    </div>

    {/* Conditional ... */}
    {reason ? (
      <div className='fw-bold text-warning p-2 pt-0 text-nowrap'>
        Reason: <span className='text-white-gray-600'>ER play</span>
      </div>
    ) : (
      <div style={{ height: '26px' }}></div>
    )}

    <div className='d-flex align-items-center justify-content-between bg-danger bg-opacity-25 p-2 ms-0 gap-2 rounded-bottom-2 w-100 h-100'>
      {/* Avatar */}
      <div className='symbol-group symbol-hover flex-nowrap  ms-0 gap-2'>
        <div
          className='symbol symbol-35px symbol-circle ms-0'
          data-bs-toggle='tooltip'
          // title={item.name}
        >
          <img alt='Pic' src={toAbsoluteUrl(user.image)} />
        </div>

        <div className='fw-bold text-white-gray-600 fs-7'>{user.name}</div>

        <div className={clsx('app-navbar-item', itemClass)}>
          <div className={btnClass}>
            <KTIcon iconName='arrow-right' className={btnIconClass} />
          </div>
        </div>
      </div>

      {/* Status:: Closed or Open */}
      <div className={clsx('d-flex align-items-center', itemClass)}>
        <div className={btnClass}>
          <KTIcon iconName='lock' className='text-danger fs-4' />
        </div>
        <div className='fw-bold text-white-gray-600 fs-7 text-white-gray-600'>
          Closed
        </div>
      </div>

      {/* Time & Date */}
      <div className='text-center'>
        <div className='fw-bold text-gray-600'>2023, Dec 15</div>
        <div className='fw-bold text-white-gray-600'>10:01PM</div>
      </div>
    </div>
  </div>
)
export { TradeWidget }
