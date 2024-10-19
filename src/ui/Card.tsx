'use client'
import { Preview } from '../api/requests'

export function Card({
  // id,
  title,
  description,
  seasons,
  image,
  // genres,
  // updated,
}: Preview) {
  // TODO: add links later
  // TODO: add genres reel and date stamp

  return (
    <div className="max-w-xs w-full group/card relative">
      <div className="cursor-pointer overflow-hidden relative card h-96 rounded-md shadow-xl  max-w-sm mx-auto backgroundImage flex flex-col justify-between p-4 bg-zinc-950">
        <div className="absolute w-full h-full top-0 left-0 transition duration-300 group-hover/card:bg-black opacity-60"></div>
        {/* header */}
        <div className="flex flex-row items-center space-x-4 z-10">
          <div className="flex flex-col">
            <p className="font-normal text-base text-gray-50 relative z-10">
              {title}
            </p>
            <p className="text-sm text-gray-400">{seasons} seasons</p>
          </div>
        </div>
        <div className="absolute w-full">
          <div className="absolute inset-0 bg-black opacity-50"></div>
          <img className="w-full h-auto" src={image} alt="" />
        </div>
        {/*  */}
        <div className="text content">
          {/* <h1 className="font-bold text-xl md:text-2xl text-gray-50 relative z-10">
            Author Card
          </h1> */}
          <p className="font-normal text-sm text-gray-50 relative z-10 my-4">
            {description.slice(0, 220)}
          </p>
        </div>
      </div>
    </div>
  )
}
