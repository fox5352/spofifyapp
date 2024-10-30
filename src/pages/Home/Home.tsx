// import { useState } from 'react'
//
// import ErrorMessage from '../../components/ErrorMessage'
// import Loading from '../../components/Loading'
//
// TODO: change home page to have a carousel and dashboard

import Carousel from './components/Carousel'

/**
 *
 */
function Home() {
  return (
    <div className="flex flex-col w-full justify-center items-center ">
      {/*TODO: Carousel*/}
      <Carousel />
      {/*TODO: load 3 random rows of preview by genre and lmit to 5*/}
    </div>
  )
}

export default Home
