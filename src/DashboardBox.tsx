import './DashboardBox.css'
import type { FC, PropsWithChildren } from 'react'

export const DashboardBox: FC<
  PropsWithChildren<{
    className?: string | undefined
  }>
> = ({ children, className }) => {
  return (
    <div className={['dashboard-box', className].join(' ')}>{children}</div>
  )
}
