/* eslint-disable no-param-reassign */
import _get from 'lodash.get';

import {
  modifySelectedShippingMethod,
  modifyShippingAddressList,
  modifyShippingMethods,
} from '../setShippingAddress/modifier';
import { _isArrayEmpty } from '../../../utils';
import { formatPrice } from '../../../utils/price';
import { modifyBillingAddressData } from '../setBillingAddress/modifier';

function modifyCartItemsData(cartItems) {
  return cartItems.reduce((cartItemsInfo, item) => {
    const { id, quantity, prices, product } = item;
    const priceAmount = _get(prices, 'price.value');
    const price = formatPrice(priceAmount);
    const rowTotalAmount = _get(prices, 'row_total.value');
    const rowTotal = formatPrice(rowTotalAmount);
    const rowTotalAmountIncTax  = _get(prices, 'row_total_including_tax.value');
    const priceAmountIncTax = rowTotalAmountIncTax / quantity;
    const priceIncTax = formatPrice(priceAmountIncTax);
    const rowTotalIncTax  = formatPrice(rowTotalAmountIncTax);
    const rowTotalDiscountAmount = _get(prices, 'total_item_discount.value');
    const rowTotalDiscount  = formatPrice(rowTotalDiscountAmount);;
    const productId = _get(product, 'id');
    const productSku = _get(product, 'sku');
    const productName = _get(product, 'name');
    const productUrl = _get(product, 'url_key');
    const productSmallImgUrl = _get(product, 'small_image.url');

    cartItemsInfo[id] = {
      id,
      quantity,
      priceAmount,
      price,
      priceAmountIncTax,
      priceIncTax,
      rowTotal,
      rowTotalAmount,
      rowTotalIncTax,
      rowTotalAmountIncTax,
      rowTotalDiscount,
      rowTotalDiscountAmount,
      productId,
      productSku,
      productName,
      productUrl,
      productSmallImgUrl,
    };

    return cartItemsInfo;
  }, {});
}

function modifyCartPricesData(cartPrices) {
  const grandTotal = _get(cartPrices, 'grand_total', {});
  const subTotalIncTax = _get(cartPrices, 'subtotal_including_tax', {});
  const subTotalExTax = _get(cartPrices, 'subtotal_excluding_tax', {});
  const discountPrices = _get(cartPrices, 'discounts', []) || [];
  const discounts = discountPrices.map(discount => ({
    label: discount.label,
    price: formatPrice(-discount.amount.value, true),
    amount: discount.amount.value,
  }));
  const appliedTaxes = _get(cartPrices, 'applied_taxes', []) || [];
  const taxes = appliedTaxes.map(tax => ({
    label: tax.label,
    price: formatPrice(tax.amount.value),
    amount: tax.amount.value,
  }));
  const grandTotalAmount = _get(grandTotal, 'value');
  const subTotalIncTaxAmount = _get(subTotalIncTax, 'value');
  const subTotalExTaxAmount = _get(subTotalExTax, 'value');

  return {
    discounts,
    hasDiscounts: !_isArrayEmpty(discountPrices),
    taxes,
    hasTaxes: !_isArrayEmpty(taxes),
    subTotalIncTax: formatPrice(subTotalIncTaxAmount),
    subTotalExTax: formatPrice(subTotalExTaxAmount),
    subTotalIncTaxAmount,
    subTotalExTaxAmount,
    grandTotal: formatPrice(grandTotalAmount),
    grandTotalAmount,
  };
}

function modifyPaymentMethodsData(paymentMethods) {
  return paymentMethods.reduce((methodList, method) => {
    methodList[method.code] = method;
    return methodList;
  }, {});
}

export default function fetchGuestCartModifier(result, dataMethod) {
  const cartData = _get(result, `data.${dataMethod || 'cart'}`, {});
  const shippingAddresses = _get(cartData, 'shipping_addresses', []);
  const billingAddress = _get(cartData, 'billing_address', {}) || {};
  const cartItems = _get(cartData, 'items', []);
  const cartPrices = _get(cartData, 'prices', {});
  const paymentMethods = _get(cartData, 'available_payment_methods', []);
  const selectedPaymentMethod = _get(cartData, 'selected_payment_method', {});

  return {
    id: cartData.id,
    email: cartData.email,
    items: modifyCartItemsData(cartItems),
    billing_address: modifyBillingAddressData(billingAddress),
    shipping_address: modifyShippingAddressList(shippingAddresses),
    shipping_methods: modifyShippingMethods(shippingAddresses),
    selected_shipping_method: modifySelectedShippingMethod(shippingAddresses),
    prices: modifyCartPricesData(cartPrices),
    available_payment_methods: modifyPaymentMethodsData(paymentMethods),
    selected_payment_method: selectedPaymentMethod,
  };
}
