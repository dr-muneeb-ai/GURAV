import React, { useRef, useEffect } from "react";

// 👉 Replace these paths with your actual video files from your assets folder
const videos = [
  "/video1.mp4",
  "/video2.mp4",
  "/video3.mp4",
  "/video4.mp4",
  "/video5.mp4",
  "/video6.mp4",
];

// 👉 Yahan se speed control karo (0.5 = half speed / slow, 1 = normal speed, 0.25 = bohot slow)
const VIDEO_SPEED = 0.5;

const InstagramSection = () => {
  const videoRefs = useRef([]);

  useEffect(() => {
    videoRefs.current.forEach((video) => {
      if (video) {
        video.playbackRate = VIDEO_SPEED;
      }
    });
  }, []);

  return (
    <section className="relative py-24 md:py-32 overflow-hidden">

      {/* Subtle premium texture */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, #fff 1px, transparent 0)",
          backgroundSize: "28px 28px",
        }}
      />

      {/* Soft background details */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-[#b9572c]/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-0 w-[28rem] h-[28rem] bg-[#b9572c]/5 rounded-full blur-3xl" />

      <div className="relative max-w-7xl mx-auto px-6 lg:px-10">

        {/* INSTAGRAM SECTION */}
        <div className="grid lg:grid-cols-[0.8fr_1.2fr] gap-14 lg:gap-20 items-center">

          {/* LEFT CONTENT */}
          <div className="max-w-xl">

            <div className="flex items-center gap-4 mb-6">
              <span className="h-px w-10 bg-[#b9572c]" />

              <p className="uppercase tracking-[6px] text-[#d4774c] text-xs font-semibold">
                Instagram
              </p>
            </div>

            <h2
              className="text-5xl md:text-6xl lg:text-7xl leading-[1.05] text-white"
              style={{ fontFamily: "'Prata', serif" }}
            >
              Follow
              <br />
              <span className="text-[#d4774c]"
              style={{ fontFamily: "'Prata', serif" }}>
                @dripdistrictaus
              </span>
            </h2>

            <p className="mt-7 text-black text-base md:text-lg leading-8 max-w-md"
            style={{ fontFamily: "'Prata', serif" }}>
              Discover our latest drops, styling inspiration,
              behind-the-scenes moments and premium streetwear
              looks from the District.
            </p>

            <a
              href="https://www.instagram.com/dripdistrictaus"
              target="_blank"
              rel="noreferrer"
              className="
                group
                inline-flex
                items-center
                gap-4
                mt-9
                bg-[#000000]
                text-white
                px-7
                py-4
                rounded-full
                text-sm
                font-medium
                tracking-wide
                hover:bg-[#d4774c]
                transition-all
                duration-300
                shadow-[0_10px_40px_rgba(185,87,44,0.35)]
                hover:shadow-[0_15px_50px_rgba(185,87,44,0.5)]
              "
            >
              View Instagram

              <span className="text-lg transition-transform duration-300 group-hover:translate-x-1">
                →
              </span>
            </a>

          </div>

          {/* RIGHT VIDEO GRID */}
          <div className="grid grid-cols-3 gap-3 md:gap-2">

            {videos.map((videoSrc, index) => (
              <a
                key={index}
                href="https://www.instagram.com/dripdistrictaus"
                target="_blank"
                rel="noreferrer"
                className="
                  group
                  relative
                  overflow-hidden
                  rounded-xl
                  md:rounded-2xl
                  bg-white/5
                  border
                  border-white/10
                  aspect-[4/5]
                  shadow-[0_15px_40px_rgba(0,0,0,0.4)]
                "
              >

                <video
                  ref={(el) => (videoRefs.current[index] = el)}
                  src={videoSrc}
                  className="
                    h-full
                    w-full
                    object-cover
                    transition-transform
                    duration-500
                    ease-out
                    group-hover:scale-110
                  "
                  autoPlay
                  muted
                  loop
                  playsInline
                  onLoadedMetadata={(e) => {
                    e.currentTarget.playbackRate = VIDEO_SPEED;
                  }}
                />

                {/* Overlay */}
                <div
                  className="
                    absolute
                    inset-0
                    bg-black/0
                    group-hover:bg-black/20
                    transition-all
                    duration-500
                  "
                />

                {/* Instagram icon */}
                <div
                  className="
                    absolute
                    inset-0
                    flex
                    items-center
                    justify-center
                    opacity-0
                    group-hover:opacity-100
                    transition-all
                    duration-500
                  "
                >
                  <div className="
                    h-11
                    w-11
                    rounded-full
                    bg-white/90
                    backdrop-blur-sm
                    flex
                    items-center
                    justify-center
                    text-black
                    shadow-xl
                  ">
                    ↗
                  </div>
                </div>

              </a>
            ))}

          </div>

        </div>


        {/* PREMIUM DIVIDER */}
        <div className="flex items-center gap-5 my-24">
          <div className="h-px flex-1 bg-white/10" />
          <div className="h-2 w-2 rounded-full bg-[#b9572c]" />
          <div className="h-px flex-1 bg-white/10" />
        </div>


        {/* NEWSLETTER */}
        <div
          className="
            relative
            overflow-hidden
            rounded-[32px]
            bg-gradient-to-br
            from-[#1c1c1c]
            to-[#111111]
            border
            border-[#b9572c]/20
            px-6
            py-16
            md:px-12
            lg:px-20
            md:py-20
            text-center
            shadow-[0_30px_90px_rgba(0,0,0,0.6)]
          "
        >

          {/* Decorative circles */}
          <div
            className="
              absolute
              -top-32
              -right-32
              h-80
              w-80
              rounded-full
              border
              border-white/10
            "
          />

          <div
            className="
              absolute
              -bottom-40
              -left-32
              h-96
              w-96
              rounded-full
              border
              border-white/10
            "
          />

          <div className="relative z-10 max-w-3xl mx-auto">

            <p className="
              uppercase
              tracking-[6px]
              text-[#d4774c]
              text-xs
              font-semibold
            ">
              Join The District
            </p>

            <h2
              className="text-4xl md:text-5xl lg:text-6xl text-white mt-5"
              style={{ fontFamily: "'Prata', serif" }}
            >
              Get Early Access
            </h2>

            <p className="
              mt-5
              text-white/60
              text-sm
              md:text-base
              leading-7
              max-w-lg
              mx-auto
            ">
              Be the first to discover new drops, exclusive offers
              and limited releases before everyone else.
            </p>

            <div className="
              flex
              flex-col
              sm:flex-row
              justify-center
              gap-3
              mt-9
              max-w-xl
              mx-auto
            ">

              <input
                type="email"
                placeholder="Enter your email address"
                className="
                  flex-1
                  px-6
                  py-4
                  rounded-full
                  bg-white/10
                  border
                  border-white/15
                  text-white
                  placeholder:text-white/40
                  outline-none
                  focus:border-[#b9572c]
                  focus:bg-white/15
                  transition
                "
              />

              <button
                className="
                  bg-[#b9572c]
                  text-white
                  px-8
                  py-4
                  rounded-full
                  font-medium
                  tracking-wide
                  hover:bg-[#d4774c]
                  transition-all
                  duration-300
                  shadow-lg
                "
              >
                Subscribe
              </button>

            </div>

            <p className="
              mt-5
              text-[11px]
              uppercase
              tracking-[2px]
              text-white/30
            ">
              No spam · Only premium drops
            </p>

          </div>

        </div>

      </div>
    </section>
  );
};

export default InstagramSection;
