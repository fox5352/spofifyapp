import { ReactNode } from 'react'

type Variant = 'outline' | 'filled'

function GenreTag({
  children,
  variant = 'outline',
  className,
}: {
  children: ReactNode
  variant?: Variant
  className?: string
}) {
  const colors = [
    'blue-500',
    'red-500',
    'lime-500',
    'purple-500',
    'lime-500',
    'orange-500',
    'green-500',
    'fuchsia-500',
    'indigo-500',
  ]
  const randomColor = colors[Math.floor(Math.random() * colors.length)]

  return (
    <span
      className={`rounded-full border text-nowrap py-1 px-2 text-center text-inherit transition-all shadow-sm ${variant === 'outline' ? 'text-inherit border-zinc-950' : `text-white bg-${randomColor} border-${randomColor}`} ${className}`}
    >
      {children}
    </span>
  )
}

export default GenreTag
