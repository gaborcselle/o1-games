import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'AI-Man / o1-games',
  description: 'A Pac-Man-inspired game generated with o1-preview',
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