import React from 'react'
import { useGetCategoriesQuery } from '../hooks/categoryHook'
import LoadingBox from '../components/LoadingBox'
import MessageBox from '../components/MessageBox'
import HomeCarousel from '../components/HomeCarousel'

export default function HomePage() {
  const { data: categories, isLoading, error } = useGetCategoriesQuery()

  if (isLoading) return <LoadingBox />
  if (error)
    return (
      <MessageBox variant="danger">
        Error loading categories
      </MessageBox>
    )

  return (
    <div className="home-page">
      <HomeCarousel />
      <p>FROM THE HIGHLANDS OF SCOTLAND</p>
      <p>OUR FURNITURE IS IMMORTAL</p>
      <div className="category-grid">
        {categories?.map((category) => (
          <div key={category._id} className="category-item">
            <img src={category.urlImage} alt={category.name} />
            <h3>{category.name}</h3>
          </div>
        ))}
      </div>
      <h2>The Highlanders of the moment</h2>
      <div className="product-grid">
        {/* Product grid will be filled with data from the backoffice */}
      </div>
    </div>
  )
}
