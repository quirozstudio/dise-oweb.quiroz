import { useEffect, useState } from 'react'
import { QuirozExperience } from '@/components/quiroz-experience'
import { QuirozHome } from '@/components/quiroz-home'

function App() {
  const [route, setRoute] = useState(window.location.hash)

  useEffect(() => {
    const updateRoute = () => setRoute(window.location.hash)
    window.addEventListener('hashchange', updateRoute)
    return () => window.removeEventListener('hashchange', updateRoute)
  }, [])

  return route.startsWith('#/experiencia') ? <QuirozExperience /> : <QuirozHome />
}

export default App
