import InstagramSection from "../components/InstagramSection";
import CustomerReviews from "../components/CustomerReviews";
import FeaturedCategories from "../components/FeaturedCategories";
import React from 'react'
import Hero from '../components/Hero'
import LatestCollection from '../components/LatestCollection'
import Title from '../components/Title'
import BestSeller from '../components/BestSeller'
import Ourpolicy from '../components/Ourpolicy'
import Newsletter from '../components/Newsletter'

const Home = () => {
  return (
    <div className="bg-[#D3D3D3] min-h-screen">
      <Hero />
       <FeaturedCategories />

      <div id="products" className="scroll-mt-24">
        <LatestCollection />
        <BestSeller />
        <CustomerReviews/>
        <InstagramSection/>
      </div>

      <Ourpolicy />
    </div>
  )
}

export default Home;
