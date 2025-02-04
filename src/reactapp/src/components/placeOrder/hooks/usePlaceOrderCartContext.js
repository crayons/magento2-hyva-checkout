import _get from 'lodash.get';

import { isCartAddressValid } from '../../../utils/address';
import useCartContext from '../../../hook/useCartContext';

export default function usePlaceOrderCartContext() {
  const {
    cart,
    setShippingMethod,
    setEmailOnGuestCart,
    setCartBillingAddress,
    addCartShippingAddress,
  } = useCartContext();
  const email = _get(cart, 'email');
  const isVirtualCart = _get(cart, 'isVirtualCart');
  const billingAddress = _get(cart, 'billing_address');
  const shippingAddress = _get(cart, 'shipping_address');

  return {
    email,
    isVirtualCart,
    billingAddress,
    shippingAddress,
    setShippingMethod,
    setEmailOnGuestCart,
    setCartBillingAddress,
    addCartShippingAddress,
    hasBillingAddress: !!isCartAddressValid(billingAddress),
    hasShippingAddress: !!isCartAddressValid(shippingAddress),
  };
}
