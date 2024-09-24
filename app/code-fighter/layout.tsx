import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Code Fighter / o1-games',
  description: 'A Street Fighter-inspired game generated with o1-preview',
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