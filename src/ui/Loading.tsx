import { BiLoaderCircle } from 'react-icons/bi'

function Loading({ className }: { className?: string }) {
  return (
    <BiLoaderCircle
      className={`text-xl text-[--ac-three] animate-spinslow text-primary ${className}`}
    />
  )
}
//

export default Loading
