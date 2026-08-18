import React from 'react'
import Title from '../components/Title'
import { assets } from '../assets/assets'
import Newsletter from '../components/Newsletter'
import {
  FaGem,
  FaTruck,
  FaHeadset,
  FaCity,
  FaUsers,
  FaShippingFast,
} from 'react-icons/fa'

const About = () => {
  return (
    <div>

      {/* ================= HERO ================= */}
      <div className="rounded-[24px] sm:rounded-[40px] overflow-hidden bg-gradient-to-br from-[#1d1d1b] via-[#262626] to-[#111] mt-6 sm:mt-10">
        <div className="flex flex-col lg:flex-row items-center gap-8 sm:gap-12 p-6 sm:p-10 lg:p-16">

          <div className="flex-1">
            <p className="uppercase tracking-[4px] sm:tracking-[6px] text-[#d4774c] text-xs font-semibold mb-4">
              Our Story
            </p>

            <h1
              className="text-3xl sm:text-5xl lg:text-6xl leading-[1.1] text-white"
              style={{ fontFamily: "'Prata', serif" }}
            >
              Built for the
              <br />
              <span className="text-[#b9572c] italic">Individual.</span>
            </h1>

            <p className="mt-5 sm:mt-7 text-gray-300 text-sm sm:text-base leading-6 sm:leading-8 max-w-xl">
              Drip District is an Australia-based streetwear brand built
              around individuality, confidence, and modern fashion culture.
              We bring premium styles inspired by global trends to customers
              across Adelaide, Sydney, and Australia-wide.
            </p>
          </div>

          <div className="flex-1 w-full">
            <img
              className="w-full max-w-[480px] mx-auto rounded-2xl sm:rounded-3xl object-cover shadow-2xl"
              src={assets.about_img}
              alt="Drip District"
            />
          </div>

        </div>
      </div>

      {/* ================= OUR MISSION ================= */}
      <div className="my-14 sm:my-20 flex flex-col md:flex-row gap-8 sm:gap-16 items-center">

        <div className="flex flex-col justify-center gap-4 sm:gap-6 text-gray-600 order-2 md:order-1">
          <b className="text-gray-900 text-lg sm:text-xl" style={{ fontFamily: "'Prata', serif" }}>
            Who We Are
          </b>

          <p className="text-sm sm:text-base leading-6 sm:leading-7">
            We are a community based on self-expression, not just a clothing company. Drip District is a place for people who wear their confidence loudly and dress with purpose, from Adelaide to Sydney and all points in between. Each drop is made to flow with contemporary fashion culture rather than to conform to it.
          </p>

          <b className="text-gray-900 text-lg sm:text-xl mt-2" style={{ fontFamily: "'Prata', serif" }}>
            Our Mission
          </b>

          <p className="text-sm sm:text-base leading-6 sm:leading-7">
            To make premium streetwear accessible to every Australian who
            wants to stand out. We obsess over fit, fabric, and finish so
            that when you wear Drip District, you feel it before anyone
            else even sees it.
          </p>
        </div>

        <div className="order-1 md:order-2 w-full md:w-[45%]">
          <div className="rounded-[24px] sm:rounded-[32px] bg-gradient-to-br from-[#f5f2ec] to-white border border-gray-100 p-6 sm:p-10 shadow-lg">
            <p
              className="text-2xl sm:text-3xl text-[#1d1d1b]"
              style={{ fontFamily: "'Prata', serif" }}
            >
              "Dress with intent. <br />
              Wear your confidence loud."
            </p>
            <div className="w-12 h-[3px] bg-[#b9572c] rounded-full mt-5"></div>
          </div>
        </div>

      </div>

      {/* ================= PREMIUM SECTION ================= */}
      <div className="rounded-[24px] sm:rounded-[40px] overflow-hidden bg-gradient-to-br from-[#1d1d1b] via-[#252525] to-[#111] p-6 sm:p-12 lg:p-16 mb-14 sm:mb-20">

        <div className="text-center mb-10 sm:mb-14">
          <p className="uppercase tracking-[4px] sm:tracking-[6px] text-[#d4774c] text-xs font-semibold mb-3">
            The Difference
          </p>

          <h2
            className="text-2xl sm:text-4xl text-white"
            style={{ fontFamily: "'Prata', serif" }}
          >
            Premium, By Design
          </h2>

          <p className="text-gray-400 text-sm sm:text-base mt-3 max-w-xl mx-auto">
            Every piece is chosen and finished to a standard, not a season.
          </p>
        </div>

        <div className="grid sm:grid-cols-3 gap-4 sm:gap-6">

          <div className="bg-white/5 border border-white/10 rounded-2xl sm:rounded-3xl p-6 sm:p-8 hover:bg-white/10 transition-colors duration-300">
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-[#b9572c] flex items-center justify-center text-xl sm:text-2xl mb-5">
              <FaGem className="text-white" />
            </div>
            <h3 className="text-white text-lg sm:text-xl font-semibold mb-2">
              Premium Materials
            </h3>
            <p className="text-gray-400 text-sm sm:text-base leading-6 sm:leading-7">
              Heavyweight cotton, real leather, and durable hardware —
              nothing that fades, thins, or falls apart after a few washes.
            </p>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-2xl sm:rounded-3xl p-6 sm:p-8 hover:bg-white/10 transition-colors duration-300">
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-[#b9572c] flex items-center justify-center text-xl sm:text-2xl mb-5">
              <FaCity className="text-white" />
            </div>
            <h3 className="text-white text-lg sm:text-xl font-semibold mb-2">
              Global Trends, Local Roots
            </h3>
            <p className="text-gray-400 text-sm sm:text-base leading-6 sm:leading-7">
              We track international streetwear culture and translate it
              into pieces designed for how Australians actually dress.
            </p>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-2xl sm:rounded-3xl p-6 sm:p-8 hover:bg-white/10 transition-colors duration-300">
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-[#b9572c] flex items-center justify-center text-xl sm:text-2xl mb-5">
              <FaShippingFast className="text-white" />
            </div>
            <h3 className="text-white text-lg sm:text-xl font-semibold mb-2">
              Built to Last, Delivered Fast
            </h3>
            <p className="text-gray-400 text-sm sm:text-base leading-6 sm:leading-7">
              Quick, tracked shipping across Australia — because premium
              shouldn't mean waiting weeks to wear it.
            </p>
          </div>

        </div>

        {/* STATS STRIP */}
        <div className="grid grid-cols-3 gap-4 sm:gap-6 mt-10 sm:mt-14 pt-8 sm:pt-10 border-t border-white/10 text-center">

          <div>
            <h3 className="text-2xl sm:text-4xl text-[#b9572c]" style={{ fontFamily: "'Prata', serif" }}>
              2
            </h3>
            <p className="text-gray-400 text-xs sm:text-sm mt-1 uppercase tracking-wide">
              Cities Served
            </p>
          </div>

          <div>
            <h3 className="text-2xl sm:text-4xl text-[#b9572c]" style={{ fontFamily: "'Prata', serif" }}>
              100%
            </h3>
            <p className="text-gray-400 text-xs sm:text-sm mt-1 uppercase tracking-wide">
              Australia Owned
            </p>
          </div>

          <div>
            <h3 className="text-2xl sm:text-4xl text-[#b9572c]" style={{ fontFamily: "'Prata', serif" }}>
              4.8/5
            </h3>
            <p className="text-gray-400 text-xs sm:text-sm mt-1 uppercase tracking-wide">
              Customer Rating
            </p>
          </div>

        </div>

      </div>

      {/* ================= WHY CHOOSE US ================= */}
      <div className="text-2xl sm:text-3xl text-center py-4 sm:py-6">
        <Title text1={'WHY'} text2={'CHOOSE US'} />
      </div>

      <div className="grid md:grid-cols-3 gap-4 sm:gap-6 mb-14 sm:mb-20">

        <div className="rounded-2xl sm:rounded-3xl border border-gray-200 px-6 sm:px-10 py-8 sm:py-14 flex flex-col gap-3 sm:gap-4 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
          <FaGem className="text-[#b9572c] text-2xl sm:text-3xl" />
          <b className="text-base sm:text-lg text-gray-900">Quality Assurance</b>
          <p className="text-gray-600 text-sm sm:text-base leading-6 sm:leading-7">
            Every piece goes through strict quality checks before it ships.
            We source premium fabrics and hardware so what you wear holds
            up wash after wash, wear after wear.
          </p>
        </div>

        <div className="rounded-2xl sm:rounded-3xl border border-gray-200 px-6 sm:px-10 py-8 sm:py-14 flex flex-col gap-3 sm:gap-4 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
          <FaTruck className="text-[#b9572c] text-2xl sm:text-3xl" />
          <b className="text-base sm:text-lg text-gray-900">Easy Delivery & Returns</b>
          <p className="text-gray-600 text-sm sm:text-base leading-6 sm:leading-7">
            Fast, reliable shipping across Australia with hassle-free
            returns and exchanges within 7 days. Seamless from checkout
            to your doorstep.
          </p>
        </div>

        <div className="rounded-2xl sm:rounded-3xl border border-gray-200 px-6 sm:px-10 py-8 sm:py-14 flex flex-col gap-3 sm:gap-4 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
          <FaHeadset className="text-[#b9572c] text-2xl sm:text-3xl" />
          <b className="text-base sm:text-lg text-gray-900">Real Customer Support</b>
          <p className="text-gray-600 text-sm sm:text-base leading-6 sm:leading-7">
            Our support team is here to actually help — questions, sizing,
            order issues, all sorted quickly by real people who care about
            getting it right.
          </p>
        </div>

      </div>

      <Newsletter />

    </div>
  )
}

export default About
