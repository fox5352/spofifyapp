import { BiLoaderCircle } from 'react-icons/bi'

function Loading() {
  return (
    <div className="w-[100%] h-[100%] flex justify-center items-center">
      <BiLoaderCircle className="w-1/2 h-1/2 text-purple-500 animate-spinslow text-primary" />
    </div>
  )
}

export default Loading
