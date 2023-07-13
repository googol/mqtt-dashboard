import { DashboardBox } from './DashboardBox'
import type { FC, PropsWithChildren } from 'react'

export const ReadingBox: FC<
  PropsWithChildren<{
    title: string
    className?: string | undefined
  }>
> = ({ title, children, className }) => {
  return (
    <DashboardBox className={className}>
      <h2>{title}</h2>
      <p>{children}</p>
    </DashboardBox>
  )
}
