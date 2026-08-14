import React from 'react'
import Title from '../components/Title'
import Newsletter from '../components/Newsletter'
import { assets } from '../assets/assets'

const Contact = () => {
  return (
    <div className='bg-gradient-to-b from-white to-gray-50'>
      {/* Contact Us Section */}
      <div className='text-center text-2xl pt-16 border-t'>
        <Title text1={'CONTACT'} text2={'US'} />
        <p className='text-gray-400 text-sm mt-2 max-w-md mx-auto'>
          We'd love to hear from you — reach out anytime.
        </p>
      </div>

      <div className='my-14 flex flex-col justify-center md:flex-row gap-12 mb-20 px-4 md:px-0'>
        <img
          className='w-full md:max-w-[480px] rounded-2xl shadow-lg object-cover'
          src={assets.contact_img}
          alt='Contact Us'
          loading='lazy'
        />

        <div className='flex flex-col justify-center items-start gap-5'>
          <p className='font-semibold text-2xl text-gray-900 tracking-tight'>Drip District</p>
          <p className='text-gray-500 leading-relaxed'>
            Australia <br /> Operating from Adelaide & Sydney
          </p>

          <div className='w-12 h-[2px] bg-black'></div>

          <p className='text-gray-600 leading-relaxed'>
            Email:{' '}
            <a href='mailto:support@dripdistrict.com' className='font-medium hover:underline underline-offset-4'>
              support@dripdistrict.com
            </a>
            <br />
            Phone:{' '}
            <a href='tel:+61XXXXXXXXX' className='font-medium hover:underline underline-offset-4'>
              +61 XXX XXX XXX
            </a>
          </p>

          <p className='text-gray-500'>
            Business Hours: <br /> Monday – Saturday, 9:00 AM – 6:00 PM (AEST)
          </p>

          <div className='flex gap-3 mt-3'>
            <a
              href='https://www.instagram.com/dripdistrictaus?igsh=MXI2ZDRwZHl0ems3Zg=='
              target='_blank'
              rel='noreferrer'
              className='text-sm border border-gray-300 px-5 py-2 rounded-full hover:bg-black hover:text-white hover:border-black transition-all duration-300'
            >
              Instagram
            </a>
            <a
              href='https://tiktok.com/@dripdistrict'
              target='_blank'
              rel='noreferrer'
              className='text-sm border border-gray-300 px-5 py-2 rounded-full hover:bg-black hover:text-white hover:border-black transition-all duration-300'
            >
              TikTok
            </a>
            <a
              href='https://facebook.com/dripdistrict'
              target='_blank'
              rel='noreferrer'
              className='text-sm border border-gray-300 px-5 py-2 rounded-full hover:bg-black hover:text-white hover:border-black transition-all duration-300'
            >
              Facebook
            </a>
          </div>
        </div>
      </div>

      {/* Shipping Info */}
      <div className='px-4 md:px-0 mb-20 max-w-5xl mx-auto'>
        <p className='font-semibold text-2xl text-gray-900 mb-6 text-center'>Shipping Information</p>
        <div className='grid grid-cols-1 sm:grid-cols-3 gap-6'>
          {[
            { title: 'Shipping Location', desc: 'Australia-wide shipping' },
            { title: 'Based In', desc: 'Adelaide & Sydney, Australia' },
            { title: 'Delivery', desc: 'Fast, reliable & secure delivery with tracking' },
          ].map((item, i) => (
            <div
              key={i}
              className='border border-gray-200 rounded-2xl p-6 bg-white shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300'
            >
              <p className='font-medium text-gray-800 mb-2'>{item.title}</p>
              <p className='text-gray-500 text-sm'>{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Customer Support Section */}
      <div className='px-4 md:px-0 mb-20 max-w-5xl mx-auto'>
        <p className='font-semibold text-2xl text-gray-900 mb-6 text-center'>Customer Support</p>
        <div className='grid grid-cols-2 sm:grid-cols-5 gap-4'>
          {['Contact Form', 'Instagram DM', 'Live Chat', 'FAQ', 'Order Tracking'].map((item, i) => (
            <div
              key={i}
              className='border border-gray-200 rounded-xl p-5 text-center text-sm text-gray-600 font-medium bg-white hover:shadow-md hover:border-black transition-all duration-300 cursor-pointer'
            >
              {item}
            </div>
          ))}
        </div>
      </div>

      {/* Newsletter Section */}
      <Newsletter />
    </div>
  )
}

export default Contact
