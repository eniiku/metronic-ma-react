import React from 'react'

type Props = {
  className: string
  color: string
  title: string
  titleColor?: string
  description: string
  descriptionColor?: string
}

const StatisticsWidgetCustom2: React.FC<Props> = ({
  className,
  color,
  title,
  titleColor,
  description,
  descriptionColor,
}) => {
  return (
    <div className={`card bg-${color} hoverable ${className} card-p-0 mb-6`}>
      <div className='card-body'>
        <div className={`text-${titleColor} fw-bold fs-7 mb-2 mt-5`}>
          {title}
        </div>

        <div className={`fw-semibold fs-8 text-${descriptionColor} mb-5`}>
          {description}
        </div>
      </div>
    </div>
  )
}

export { StatisticsWidgetCustom2 }
