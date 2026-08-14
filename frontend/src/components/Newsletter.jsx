import React, { useState } from 'react';
import { toast } from 'react-toastify';

const Newsletter = () => {
  const [email, setEmail] = useState('');

  const onSubmitHandler = (event) => {
    event.preventDefault();
    if (email) {
      toast.success('Subscribed successfully!');
      setEmail('');
    } else {
      toast.error('Please enter a valid email.');
    }
  };

  return (
    <div className="px-4 sm:px-6 lg:px-10 my-10 sm:my-14">
      <div className="relative max-w-3xl mx-auto bg-[#141414] rounded-[28px] sm:rounded-[36px] overflow-hidden px-6 sm:px-12 py-10 sm:py-14 text-center shadow-[0_30px_80px_rgba(0,0,0,0.35)]">

        {/* Decorative faint circles */}
        <div className="pointer-events-none absolute -top-10 -left-10 w-56 h-56 rounded-full border border-white/10"></div>
        <div className="pointer-events-none absolute -bottom-16 -right-10 w-64 h-64 rounded-full border border-white/10"></div>

        <p className="relative uppercase text-[11px] sm:text-xs tracking-[3px] text-[#c97a2c] font-semibold">
          Join The District
        </p>

        <h2
          className="relative text-3xl sm:text-5xl text-white mt-3"
          style={{ fontFamily: "'Prata', serif" }}
        >
          Get Early Access
        </h2>

        <p className="relative text-gray-400 text-sm sm:text-base mt-4 max-w-md mx-auto leading-relaxed">
          Be the first to discover new drops, exclusive offers and limited
          releases before everyone else.
        </p>

        <form
          onSubmit={onSubmitHandler}
          className="relative flex flex-col gap-3 max-w-md mx-auto mt-8"
        >
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-[#232323] text-white placeholder-gray-500 rounded-full px-5 py-3.5 outline-none border border-white/10 focus:border-[#b9572c] transition-colors"
            type="email"
            placeholder="Enter your email address"
            required
          />

          <button
            type="submit"
            className="w-full bg-[#b9572c] hover:bg-[#a8492a] text-white font-semibold rounded-full px-5 py-3.5 transition-colors duration-300"
          >
            Subscribe
          </button>
        </form>

        <p className="relative uppercase text-[10px] sm:text-[11px] tracking-[2px] text-gray-500 mt-5">
          No Spam &middot; Only Premium Drops
        </p>
      </div>
    </div>
  );
};

export default Newsletter;
