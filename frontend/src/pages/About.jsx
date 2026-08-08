import React from 'react'
import Title from '../components/Title'
import { assets } from '../assets/assets'
import Newsletter from '../components/Newsletter'

const About = () => {
  return (
    <div>
      <div className='text-2xl text-center pt-8 border-t'>
        <Title text1={'ABOUT'} text2={'US'} />
      </div>

      <div className='my-10 flex flex-col md:flex-row gap-16'>
        <img className='w-full md:max-w-[450px]' src={assets.about_img} alt="" />
        <div className='flex flex-col justify-center gap-6 md:w-2/4 text-gray-600'>
          <p>Welcome to our exclusive embellished slippers collection! We are dedicated to bringing luxury, comfort, and style directly to your doorstep. With over a decade of experience in footwear craftsmanship, we have perfected the art of creating beautiful, comfortable slippers that make you feel special every single day.</p>
          <p>Our passion lies in combining traditional embellishment techniques with modern comfort technology. Each pair in our collection is meticulously handcrafted with premium materials and adorned with exquisite details such as rhinestones, pearls, and beads. We believe that your feet deserve nothing but the best, and that's exactly what we deliver with every product.</p>
          <b className='text-gray-800' >Our Mission</b>
          <p>Our mission is to empower our customers to express their unique style through beautifully crafted embellished slippers. We strive to provide exceptional quality, outstanding customer service, and authentic luxury accessible to everyone. Every product we create tells a story of dedication, artistry, and commitment to excellence.</p>
        </div>
      </div>


      <div className='text-xl py-4'>
          <Title text1={'WHY'} text2={'CHOOSE US'}/>
      </div>


      <div className='flex flex-col md:flex-row text-sm mb-20'>
        <div className='border px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-5'>
          <b>Quality Assurance:</b>
          <p className='text-gray-600'>Every pair of slippers undergoes rigorous quality checks to ensure premium craftsmanship. We source only the finest materials and employ skilled artisans to hand-place embellishments with precision. Your satisfaction with our quality is our guarantee.</p>
        </div>
        <div className='border px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-5'>
          <b>Easy Delivery & Returns:</b>
          <p className='text-gray-600'>We offer fast, reliable shipping to your doorstep with hassle-free returns and exchanges within 7 days. Your shopping experience should be seamless from checkout to arrival, with friendly support every step of the way.</p>
        </div>
        <div className='border px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-5'>
          <b>Exceptional Customer Service:</b>
          <p className='text-gray-600'>Our dedicated support team is available 24/7 to answer your questions and resolve any concerns. We're committed to providing a personalized shopping experience that exceeds your expectations and builds lasting relationships.</p>
        </div>
      </div>

      <Newsletter/>

    </div>
  )
}

export default About
