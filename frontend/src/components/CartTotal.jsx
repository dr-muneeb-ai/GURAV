import React, { useContext } from 'react'
import { ShopContext } from '../context/ShopContext';
import Title from './Title';
const CartTotal = () => {
  const { currency, delivery_fee, getCartAmount } = useContext(ShopContext);
  return (
    <div className="w-full">
      <div className='w-full max-w-[280px]'>
        <Title text1={'Cart'} text2={'Totals'} />
      </div>
      <div className='flex flex-col gap-1.5 mt-1.5 text-xs sm:text-sm'>
        <div className='flex justify-between text-[#ffffff]'>
          <p>Subtotal</p>
          <p>{currency} {getCartAmount()}.00</p>
        </div>
        <div className='flex justify-between text-[#ffffff]'>
          <p>shipping Fee</p>
          <p>{currency} {delivery_fee}.00</p>
        </div>
        <hr/>
        <div className='flex justify-between text-[#ffffff] text-sm sm:text-base'>
          <b>Total</b>
          <b>{currency} {getCartAmount() === 0 ? 0 : getCartAmount() + delivery_fee}.00</b>
        </div>
      </div>
    </div>
  )
}
export default CartTotal;
