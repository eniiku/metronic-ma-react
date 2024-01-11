import { toAbsoluteUrl } from '../../_metronic/helpers'

type NoDataProps = {
  height?: number
  message: string
  type: string
}

const NoData: React.FC<NoDataProps> = ({ height, message, type }) => {
  height = 500
  message = 'No data found for this page!'

  return (
    <div
      className='d-flex flex-column align-items-center justify-content-center'
      style={{ height: `${height}px` }}
    >
      <img
        src={
          type === 'info'
            ? toAbsoluteUrl('images/empty.png')
            : toAbsoluteUrl('images/no_data.png')
        }
        alt=''
        style={{
          width: '140px',
          height: '140px',
          opacity: 0.8,
        }}
      />

      <p className='mt-10 text-gray-400 fs-4 font-medium'>{message}</p>
    </div>
  )
}

export default NoData
