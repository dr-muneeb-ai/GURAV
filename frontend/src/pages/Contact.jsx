import React from 'react'
import Title from '../components/Title'
import Newsletter from '../components/Newsletter'
import { assets } from '../assets/assets'

const Contact = () => {
  return (
    <div>
      {/* Contact Us Section */}
      <div className='text-center text-2xl pt-10 border-t'>
        <Title text1={'CONTACT'} text2={'US'} />
      </div>

      <div className='my-10 flex flex-col justify-center md:flex-row gap-10 mb-16 px-4 md:px-0'>
        <img className='w-full md:max-w-[480px] rounded-xl' src={assets.contact_img} alt="Contact Us" loading="lazy" />

        <div className='flex flex-col justify-center items-start gap-4'>
          <p className='font-semibold text-xl text-gray-800'>Drip District</p>
          <p className='text-gray-500'>Australia <br /> Operating from Adelaide & Sydney</p>

          <p className='text-gray-600'>
            Email: <a href="mailto:support@dripdistrict.com" className='hover:underline'>support@dripdistrict.com</a>
            <br />
            Phone: <a href="tel:+61XXXXXXXXX" className='hover:underline'>+61 XXX XXX XXX</a>
          </p>

          <p className='text-gray-500'>
            Business Hours: <br /> Monday – Saturday, 9:00 AM – 6:00 PM (AEST)
          </p>

          <div className='flex gap-4 mt-2'>
            <a href="https://www.instagram.com/dripdistrictaus?igsh=MXI2ZDRwZHl0ems3Zg==" target="_blank" rel="noreferrer" className='text-sm border px-4 py-2 rounded-full hover:bg-black hover:text-white transition-all duration-300'>Instagram</a>
            <a href="https://tiktok.com/@dripdistrict" target="_blank" rel="noreferrer" className='text-sm border px-4 py-2 rounded-full hover:bg-black hover:text-white transition-all duration-300'>TikTok</a>
            <a href="https://facebook.com/dripdistrict" target="_blank" rel="noreferrer" className='text-sm border px-4 py-2 rounded-full hover:bg-black hover:text-white transition-all duration-300'>Facebook</a>
          </div>
        </div>
      </div>

      {/* Shipping Info */}
      <div className='px-4 md:px-0 mb-16'>
        <p className='font-semibold text-xl text-gray-800 mb-4'>Shipping Information</p>
        <div className='grid grid-cols-1 sm:grid-cols-3 gap-6'>
          <div className='border rounded-lg p-5'>
            <p className='font-medium text-gray-700 mb-1'>Shipping Location</p>
            <p className='text-gray-500 text-sm'>Australia-wide shipping</p>
          </div>
          <div className='border rounded-lg p-5'>
            <p className='font-medium text-gray-700 mb-1'>Based In</p>
            <p className='text-gray-500 text-sm'>Adelaide & Sydney, Australia</p>
          </div>
          <div className='border rounded-lg p-5'>
            <p className='font-medium text-gray-700 mb-1'>Delivery</p>
            <p className='text-gray-500 text-sm'>Fast, reliable & secure delivery with tracking</p>
          </div>
        </div>
      </div>

      {/* Customer Support Section */}
      <div className='px-4 md:px-0 mb-16'>
        <p className='font-semibold text-xl text-gray-800 mb-4'>Customer Support</p>
        <div className='grid grid-cols-2 sm:grid-cols-5 gap-4'>
          <div className='border rounded-lg p-4 text-center text-sm text-gray-600 hover:shadow-md transition-shadow'>Contact Form</div>
          <div className='border rounded-lg p-4 text-center text-sm text-gray-600 hover:shadow-md transition-shadow'>Instagram DM</div>
          <div className='border rounded-lg p-4 text-center text-sm text-gray-600 hover:shadow-md transition-shadow'>Live Chat</div>
          <div className='border rounded-lg p-4 text-center text-sm text-gray-600 hover:shadow-md transition-shadow'>FAQ</div>
          <div className='border rounded-lg p-4 text-center text-sm text-gray-600 hover:shadow-md transition-shadow'>Order Tracking</div>
        </div>
      </div>

      {/* Newsletter Section */}
      <Newsletter />
    </div>
  )
}

export default Contact
