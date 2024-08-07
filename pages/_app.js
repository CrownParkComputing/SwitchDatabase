import '../styles/globals.css'
import { FilterProvider } from '../context/FilterContext'

function MyApp({ Component, pageProps }) {
  return (
    <FilterProvider>
      <Component {...pageProps} />
    </FilterProvider>
  )
}

export default MyApp