import React from 'react'
import Title from '../components/Title'
import Newsletter from '../components/Newsletter'
import { assets } from '../assets/assets'
import { FaInstagram, FaTiktok, FaFacebookF, FaEnvelope, FaPhone, FaClock } from 'react-icons/fa'

const Contact = () => {
  return (
    <div className="bg-gradient-to-br from-[#121212] via-[#ece7e2] to-[#121212] py-12 sm:py-16 rounded-3xl overflow-hidden">
      <div className="max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-10">

        {/* HERO */}
        <div className="text-center pt-4 sm:pt-8">
          <Title text1={'CONTACT'} text2={'US'} />
          <p className="text-gray-500 text-xs sm:text-sm mt-2 max-w-md mx-auto">
            We'd love to hear from you — reach out anytime.
          </p>
        </div>

        {/* MAIN CONTACT CARD */}
        <div className="my-10 sm:my-14 bg-white rounded-[28px] sm:rounded-[40px] shadow-[0_30px_80px_rgba(0,0,0,0.12)] overflow-hidden">
          <div className="flex flex-col md:flex-row">
            <img
              className="w-full md:w-[46%] h-56 sm:h-72 md:h-auto object-cover"
              src={assets.contact_img}
              alt="Contact Us"
              loading="lazy"
            />

            <div className="flex-1 flex flex-col justify-center gap-4 sm:gap-5 p-6 sm:p-10">
              <p
                className="font-normal text-2xl sm:text-3xl text-[#1d1d1b]"
                style={{ fontFamily: "'Prata', serif" }}
              >
                Drip District
              </p>

              <p className="text-gray-500 text-sm sm:text-base leading-relaxed">
                Australia <br /> Operating from Adelaide & Sydney
              </p>

              <div className="w-12 h-[3px] bg-[#b9572c] rounded-full"></div>

              <div className="flex flex-col gap-3 text-sm sm:text-base">
                <a
                  href="mailto:support@dripdistrict.com"
                  className="flex items-center gap-3 text-gray-700 hover:text-[#b9572c] transition-colors"
                >
                  <span className="w-9 h-9 rounded-full bg-[#f5f2ec] flex items-center justify-center shrink-0">
                    <FaEnvelope size={13} className="text-[#b9572c]" />
                  </span>
                  support@dripdistrict.com
                </a>

                <a
                  href="tel:+61XXXXXXXXX"
                  className="flex items-center gap-3 text-gray-700 hover:text-[#b9572c] transition-colors"
                >
                  <span className="w-9 h-9 rounded-full bg-[#f5f2ec] flex items-center justify-center shrink-0">
                    <FaPhone size={13} className="text-[#b9572c]" />
                  </span>
                  +61 XXX XXX XXX
                </a>

                <div className="flex items-start gap-3 text-gray-500">
                  <span className="w-9 h-9 rounded-full bg-[#f5f2ec] flex items-center justify-center shrink-0">
                    <FaClock size={13} className="text-[#b9572c]" />
                  </span>
                  <span>
                    Monday – Saturday <br /> 9:00 AM – 6:00 PM (AEST)
                  </span>
                </div>
              </div>

              <div className="flex gap-3 mt-2 flex-wrap">
                <a
                  href="https://www.instagram.com/dripdistrictaus?igsh=MXI2ZDRwZHl0ems3Zg=="
                  target="_blank"
                  rel="noreferrer"
                  className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center hover:bg-[#1d1d1b] hover:text-white hover:border-[#1d1d1b] transition-all duration-300"
                  aria-label="Instagram"
                >
                  <FaInstagram size={15} />
                </a>
                <a
                  href="https://tiktok.com/@dripdistrict"
                  target="_blank"
                  rel="noreferrer"
                  className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center hover:bg-[#1d1d1b] hover:text-white hover:border-[#1d1d1b] transition-all duration-300"
                  aria-label="TikTok"
                >
                  <FaTiktok size={14} />
                </a>
                <a
                  href="https://facebook.com/dripdistrict"
                  target="_blank"
                  rel="noreferrer"
                  className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center hover:bg-[#1d1d1b] hover:text-white hover:border-[#1d1d1b] transition-all duration-300"
                  aria-label="Facebook"
                >
                  <FaFacebookF size={14} />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* SHIPPING INFO */}
        <div className="mb-10 sm:mb-16">
          <p
            className="text-center text-2xl sm:text-3xl text-[#1d1d1b] mb-6 sm:mb-8"
            style={{ fontFamily: "'Prata', serif" }}
          >
            Shipping Information
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
            {[
              { title: 'Shipping Location', desc: 'Australia-wide shipping' },
              { title: 'Based In', desc: 'Adelaide & Sydney, Australia' },
              { title: 'Delivery', desc: 'Fast, reliable & secure delivery with tracking' },
            ].map((item, i) => (
              <div
                key={i}
                className="rounded-2xl p-6 bg-white/90 backdrop-blur-sm shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
              >
                <p className="font-semibold text-[#b9572c] text-xs uppercase tracking-[2px] mb-2">
                  {String(i + 1).padStart(2, '0')}
                </p>
                <p className="font-medium text-[#1d1d1b] mb-1">{item.title}</p>
                <p className="text-gray-500 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CUSTOMER SUPPORT */}
        <div className="mb-4 sm:mb-8">
          <p
            className="text-center text-2xl sm:text-3xl text-[#1d1d1b] mb-6 sm:mb-8"
            style={{ fontFamily: "'Prata', serif" }}
          >
            Customer Support
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 sm:gap-4">
            {['Contact Form', 'Instagram DM', 'Live Chat', 'FAQ', 'Order Tracking'].map((item, i) => (
              <div
                key={i}
                className="rounded-xl p-4 sm:p-5 text-center text-xs sm:text-sm text-[#1d1d1b] font-medium bg-white/90 backdrop-blur-sm hover:bg-[#1d1d1b] hover:text-white transition-all duration-300 cursor-pointer shadow-sm hover:shadow-lg"
              >
                {item}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* NEWSLETTER */}
      <Newsletter />
    </div>
  )
}

export default Contact
