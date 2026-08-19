import { useEffect, useState } from 'react'

export function useMediaQuery(query: string) {
  const [matches, setMatches] = useState(() => window.matchMedia(query).matches)

  useEffect(() => {
    const mediaQueryList = window.matchMedia(query)
    const handleChange = () => setMatches(mediaQueryList.matches)
    handleChange()
    mediaQueryList.addEventListener('change', handleChange)
    return () => mediaQueryList.removeEventListener('change', handleChange)
  }, [query])

  return matches
}

export function useIsMobile() {
  return useMediaQuery('(max-width: 1023px)')
}
