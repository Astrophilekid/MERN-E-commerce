import axios from 'axios'

const filterProducts = async (page, filters) => {
  const { category, year, sortBy, sortOrder } = filters

  let apiUrl = `/products/filter/?page=${page}`

  if (category) {
    apiUrl += `&category=${category}`
  }

  if (year) {
    apiUrl += `&year=${year}`
  }

  if (sortBy) {
    apiUrl += `&sortBy=${sortBy}&sortOrder=${sortOrder || 'asc'}`
  }

  try {
    const { data } = await axios.get(apiUrl)
    return data
  } catch (error) {
    console.error('Error fetching products:', error)
    return []
  }
}

export default filterProducts
