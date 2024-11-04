type textStize =
  | 'text-sm'
  | 'text-md'
  | 'text-lg'
  | 'text-xl'
  | 'text-2xl'
  | 'text-3xl'

function ErrorMessage({
  message,
  size,
  className = '',
}: {
  message: string
  size: textStize
  className?: string
}) {
  return (
    <div
      className={`w-full h-full flex justify-center items-center text-red-600 ${className}`}
    >
      <h3 className={`font-bold text-center text-inherit ${size}`}>
        {message}
      </h3>
    </div>
  )
}

export default ErrorMessage
