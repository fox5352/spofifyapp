import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
//
import { getShow, Show } from '../../api/requests'
//
import ErrorMessage from '../../components/ErrorMessage'
import Loading from '../../components/Loading'


export default function PostDetail() {
  const { id } = useParams()
  // page states
  const [show, setShow] = useState<Show | null>(null)
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // ui state
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false)

  useEffect(() => {
    const fetchShow = async (id: string) => {
      setIsLoading(true)

      const res = await getShow(id)


      if (!res) {
        setError('Failed to fetch post')
        setIsLoading(false)
        return
      }

      setError(null)
      setIsLoading(false)
      setShow(res)

      // TODO: remove log later
      console.log(res)
    }

    if (!id) {
      setError('No post id provided in url params')
      return
    }


    fetchShow(id)
  }, [])
  // -----------------------------------------------  util functions -----------------------------------------------

  const convertDate = (date: string) => {
    const data = new Date(date)
    const options = { year: 'numeric', month: 'long', day: 'numeric' }
    return data.toLocaleDateString('en-US', options)
  }

  const toggleDescription = () => {
    setIsDescriptionExpanded(prev => !prev)
  }

  // ----------------------------------------------- other page states -----------------------------------------------
  if (error) {
    return <ErrorMessage message={error} size="text-3xl" />
  }

  if (isLoading) {
    return (
      <div className="w-screen h-screen flex justify-center items-center overflow-hidden">
        <Loading className="text-7xl h-full w-1/2 max-w-xs" />
      </div>
    )
  }

  if (!show) return

  return (
    <div className='main flex flex-col w-full md:px-2 md:pt-0.5'>
      {/*TODO:added header with banner title date and image*/}
      <div className='head flex flex-col md:flex-row justify-center p-2 min-h-[320px] text-white bg-zinc-950 md:rounded-md relative'>
        {/* heade content */}
        <div className='flex flex-col basis-1/2 w-full text-center md:text-start md:pt-4 md:pl-4'>
          <h2 className='text-4xl text-bold'>Show: {show.title}</h2>
          <div className='p-1 pt-1.5'>
            <h3 className='text-indigo-500'>Seasons {show.seasons.length}</h3>
            <h4 className='text-purple-500'>Updated {convertDate(show.updated)}</h4>
          </div>
          <div className='content p-2 overflow-y-auto max-h-[140px] text-start'>
            {/* TODO: genre section */}
            <p>{isDescriptionExpanded ? show.description : show.description.slice(0, 140) + "..."}</p>
          </div>
          <div className='mt-2'>
            <button className="w-auto p-[3px] relative " onClick={toggleDescription}>
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg" />
              <div className="px-2 py-0.5  bg-black rounded-[6px]  relative group transition duration-200 text-white hover:bg-transparent">
                {isDescriptionExpanded ? "Less..." : "More..."}
              </div>
            </button>
          </div>
        </div>
        {/* card image*/}
        <div className='overflow-hidden md:max-w-xs h-auto rounded-md'>
          <img src={show.image} alt="show banner" /></div>
      </div>
      {/*TODO:content section with seasons and and episodes in a drop down*/}
    </div>
  )
}
