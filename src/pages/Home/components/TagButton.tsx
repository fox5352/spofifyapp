import { MouseEvent, ReactNode, useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import GenreTag from '../../../components/GenreTag'

function TagButton({
  param,
  children,
}: {
  param: string
  children: ReactNode
}) {
  const query = 'q'
  const [isActive, setIsActive] = useState(false)
  const [searchParams, setSearchParams] = useSearchParams()

  useEffect(() => {
    const isActiveParam = searchParams.get(query)
    setIsActive(isActiveParam == param)
  }, [searchParams, param])

  const toggleParam = (event: MouseEvent) => {
    event.stopPropagation()
    if (searchParams.get(query) === param) {
      searchParams.delete(query)
    } else {
      searchParams.set('page', '0')
      searchParams.set(query, param)
    }
    setSearchParams(searchParams)
  }

  return (
    <button className="flex" onClick={toggleParam} type="button">
      <GenreTag variant={isActive ? 'filled' : 'outline'}>{children}</GenreTag>
    </button>
  )
}

export default TagButton
