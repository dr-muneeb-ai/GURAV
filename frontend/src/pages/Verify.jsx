import React, { useEffect } from 'react'
import { useContext } from 'react'
import { useSearchParams } from 'react-router-dom'
import { ShopContext } from '../context/ShopContext'

const Verify = () => {

  const { navigate, setCartItems } = useContext(ShopContext)
  const [searchParams] = useSearchParams()

  const success = searchParams.get('success')
  // const orderId = searchParams.get('orderId')

  useEffect(() => {
    if (success === 'true') {
      setCartItems({});
      navigate('/orders');
    } else {
      navigate('/cart');
    }
  }, [success]);

  return (
    <div>

    </div>
  )
}

export default Verify;

