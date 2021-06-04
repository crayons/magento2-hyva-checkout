/* eslint-disable no-param-reassign */
import _get from 'lodash.get';
import { config } from '../../../config';
import { prepareFullName } from '../../customer/utility';

export function modifySelectedShippingMethod(addressList) {
  const addrWithShippingMethod = addressList.find(
    addr => addr.selected_shipping_method
  );

  if (_get(addrWithShippingMethod, 'selected_shipping_method')) {
    const {
      carrier_code: carrierCode,
      method_code: methodCode,
      amount: { currency, value },
    } = addrWithShippingMethod.selected_shipping_method;
    const currencySymbol = _get(config.currencySymbols, currency, '');

    return {
      carrierCode,
      methodCode,
      amount: value,
      price: `${currencySymbol}${value}`,
    };
  }

  return {};
}

export function modifyShippingMethods(addressList) {
  return addressList.reduce((addrMethods, address, index) => {
    /** @todo seems no way to uniquely identify an address. so faking it here */
    addrMethods[`address_${index + 1}`] = _get(
      address,
      'available_shipping_methods',
      []
    ).map(
      ({
        carrier_code: carrierCode,
        carrier_title: carrierTitle,
        method_code: methodCode,
        method_title: methodTitle,
        price_incl_tax: { currency: priceCurrency, value: amount },
      }) => ({
        carrierCode,
        carrierTitle,
        methodCode,
        methodTitle,
        price: `${_get(config.currencySymbols, priceCurrency, '')}${amount}`,
        amount,
      })
    );
    return addrMethods;
  }, {});
}

export function modifyShippingAddressList(addressList) {
  return addressList.reduce((addressItems, address, index) => {
    const {
      company,
      firstname,
      lastname,
      street,
      telephone: phone,
      postcode: zipcode,
      city,
      country: { code: countryCode },
      region: { code: regionCode },
    } = address;
    addressItems[`address_${index + 1}`] = {
      company,
      firstname,
      lastname,
      fullName: prepareFullName(address),
      street,
      phone,
      zipcode,
      city,
      region: regionCode,
      country: countryCode,
    };

    return addressItems;
  }, {});
}

export default function setShippingAddressModifier(result) {
  const shippingAddresses = _get(
    result,
    'data.setShippingAddressesOnCart.cart.shipping_addresses',
    []
  );

  return modifyShippingAddressList(shippingAddresses);
}