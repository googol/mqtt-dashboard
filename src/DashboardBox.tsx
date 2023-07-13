import './DashboardBox.css'
import { classnames } from './className'
import type { FC, PropsWithChildren } from 'react'

export const DashboardBox: FC<
  PropsWithChildren<{
    className?: string | undefined
  }>
> = ({ children, className }) => {
  return (
    <div className={classnames('dashboard-box', className)}>{children}</div>
  )
}
