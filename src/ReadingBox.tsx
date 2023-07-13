import './ReadingBox.css'
import type { FC, PropsWithChildren } from 'react'

export const ReadingBox: FC<
  PropsWithChildren<{
    title: string
    className?: string | undefined
  }>
> = ({ title, children, className }) => {
  return (
    <div className={['reading-box', className].join(' ')}>
      <h2>{title}</h2>
      <p>{children}</p>
    </div>
  )
}
