import { BiLoaderCircle } from 'react-icons/bi'

function Loading({ className }: { className?: string }) {
  return (
    <BiLoaderCircle
      className={`text-xl text-purple-500 animate-spinslow text-primary ${className}`}
    />
  )
}
//

export default Loading
