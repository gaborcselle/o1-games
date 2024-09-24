import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'CodeBreak / o1-games',
  description: 'A Breakout-inspired game generated with o1-preview',
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