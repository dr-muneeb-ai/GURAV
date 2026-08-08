import React, { useContext } from 'react'
import { ShopContext } from '../context/ShopContext';
import Title from './Title';

const CartTotal = () => {

  const { currency, delivery_fee, getCartAmount } = useContext(ShopContext);

  return (
    <div className="w-full">
      <div className='w-[350px]'>
        <Title text1={'Cart'} text2={'Totals'} />
      </div>

      <div className='flex flex-col gap-2 mt-2 text-sm'>
        <div className='flex justify-between text-[#ffffff]'>
          <p>Subtotal</p>
          <p>{currency} {getCartAmount()}.00</p>
        </div>
        <div className='flex justify-between text-[#ffffff]'>
          <p>shipping Fee</p>
          <p>{currency} {delivery_fee}.00</p>
        </div>
        <hr/>
        <p></p>
        <div className='flex justify-between text-[#ffffff] text-lg'>
          <b>Total</b>
          <b>{currency} {getCartAmount() === 0 ? 0 : getCartAmount() + delivery_fee}.00</b>
        </div>
      </div>
    </div>
  )
}

export default CartTotal
