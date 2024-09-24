import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Space Encoders',
  description: 'A Space Invaders-inspired game generated with o1-preview',
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