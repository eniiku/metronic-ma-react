import { RotatingLines } from 'react-loader-spinner'

export const Loading: React.FC<{ height?: number }> = ({ height }) => {
  height = 400

  return (
    <div
      className='d-flex align-items-center justify-content-center'
      style={{ height: `${height}px` }}
    >
      <RotatingLines
        visible={true}
        width='70'
        strokeColor='gray'
        strokeWidth='5'
        animationDuration='0.75'
        ariaLabel='rotating-lines-loading'
      />
    </div>
  )
}
