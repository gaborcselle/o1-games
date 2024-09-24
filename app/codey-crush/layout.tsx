import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Codey Crush / o1-games',
  description: 'A Candy Crush-inspired game generated with o1-preview',
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