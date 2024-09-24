import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Code Lemmings',
  description: 'A Lemmings-inspired game generated with o1-preview',
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