import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Aisteroids / o1-games',
  description: 'An Asteroids-inspired game generated with o1-preview',
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