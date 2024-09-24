import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Among Code / o1-games',
  description: 'An Among Us-inspired game generated with o1-preview',
}

export default function Layout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div>
      {children}
    </div>
  )
}