import React from 'react'

type Props = {
  className: string
  color: string
  title: string
  titleColor?: string
  description: string
  descriptionColor?: string
}

const StatisticsWidgetCustom: React.FC<Props> = ({
  className,
  color,
  title,
  titleColor,
  description,
  descriptionColor,
}) => {
  return (
    <div className={`card bg-${color} hoverable ${className}`}>
      <div className='card-body'>
        <div className={`text-${titleColor} fw-bold fs-2 mb-2 mt-5`}>
          {title}
        </div>

        <div className={`fw-semibold text-${descriptionColor}`}>
          {description}
        </div>
      </div>
    </div>
  )
}

export { StatisticsWidgetCustom }
