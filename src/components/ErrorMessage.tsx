type textStize =
  | 'text-sm'
  | 'text-md'
  | 'text-lg'
  | 'text-xl'
  | 'text-2xl'
  | 'text-3xl'

function ErrorMessage({ message, size }: { message: string; size: textStize }) {
  return (
    <div className="w-full h-full flex justify-center items-center">
      <h3 className={`font-bold text-center text-red-600 ${size}`}>
        {message}
      </h3>
    </div>
  )
}

export default ErrorMessage
