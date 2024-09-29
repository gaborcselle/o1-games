import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Grand Theft Aito / o1-games',
  description: 'A Car Theft-inspired game generated with o1-preview',
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