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
    <div className=' text-center'>
      <p className='text-2xl font-medium text-gray-800'>Subscribe now & get 20% off</p>
      <p className='text-gray-400 mt-3'>
      Join our community of shoe lovers and stay updated on exclusive collections, new arrivals, and special offers. Be the first to know about limited-edition embellished slippers and enjoy early access to our sales events.
      </p>
      <form onSubmit={onSubmitHandler} className='w-full sm:w-1/2 flex items-center gap-3 mx-auto my-6 border pl-3'>
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className='w-full sm:flex-1 outline-none'
          type="email"
          placeholder='Enter your email'
          required
        />
        <button type='submit' className='bg-black text-white text-xs px-10 py-4'>SUBSCRIBE</button>
      </form>
    </div>
  );
};

export default Newsletter;
