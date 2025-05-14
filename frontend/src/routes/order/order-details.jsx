import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import BillingData from '../../components/address/BillingData';
import apiClient from '../../services/apiClient';
import { useCreateNotification } from '../../utils/toast';

export default function OrderDetails() {
  const [cart, setCart] = useState(null);
  const [userDetails, setUserDetails] = useState(null);
  const [totalPrice, setTotalPrice] = useState(0);
  const [selectedAddress, setSelectedAddress] = useState('');
  const [deliveryMethod, setDeliveryMethod] = useState('courier');
  const [paymentMethod, setPaymentMethod] = useState('');
  const navigate = useNavigate();
  const createNotification = useCreateNotification();
  const userId = useSelector((state) => state.auth.user.userId);

  async function getUserDetails() {
    try {
      const { data } = await apiClient.get(`/users/${userId}/user`);
      setUserDetails(data.data);
      setCart(data.data.cart);
      setTotalPrice(data.data.cart.totalAmount);

      // Set the default selected address
      // last placed order address if available to the first one in the list
      // or to the first one in the list if no orders are available
      setSelectedAddress(
        data.data.orders[0]
          ? data.data.orders[0].orderAddress
          : data.data.addresses[0],
      );
    } catch (error) {
      createNotification({ message: error, type: 'error' });
    }
  }

  useEffect(() => {
    getUserDetails();
  }, []);

  async function handlePlaceOrder() {
    navigate('/cart/summary', {
      state: {
        deliveryMethod,
        selectedAddress,
        paymentMethod,
        cart,
        totalPrice,
        userDetails,
      },
    });
  }

  return (
    <div className="p-20 font-serif max-w-5xl mx-auto max-md:max-w-xl py-4 text-[18px]">
      <h1 className="text-2xl text-gray-800 text-center">Checkout</h1>
      <div className="space-y-8 mt-12">
        {/* Delivery Method */}
        <div className="bg-white rounded-sm p-4 shadow-2xl border-2 border-b-4 border-gray-200">
          <div className="flex items-center space-x-2">
            <div className="flex items-center justify-center w-8 h-8 bg-gray-200 text-gray-700 font-bold rounded-full">
              1
            </div>
            <h2 className="text-lg font-semibold">Delivery Method</h2>
          </div>
          <div className="mt-4">
            <label className="block mb-2">
              <input
                type="radio"
                name="deliveryMethod"
                value="courier"
                checked={deliveryMethod === 'courier'}
                onChange={(e) => setDeliveryMethod(e.target.value)}
                className="mr-2"
              />
              Courier
            </label>
            <label className="block mb-2">
              <input
                type="radio"
                name="deliveryMethod"
                value="pickup"
                checked={deliveryMethod === 'pickup'}
                onChange={(e) => setDeliveryMethod(e.target.value)}
                className="mr-2"
              />
              Personal Pickup
            </label>
          </div>
        </div>
        <div>
          <BillingData
            userId={userId}
            selectedAddress={selectedAddress}
            setSelectedAddress={setSelectedAddress}
          />
        </div>
        {/* Payment Method */}
        <div className="bg-white rounded-sm p-4 shadow-2xl border-2 border-b-4 border-gray-200">
          <div className="flex items-center space-x-2">
            <div className="flex items-center justify-center w-8 h-8 bg-gray-200 text-gray-700 font-bold rounded-full">
              2
            </div>
            <h2 className="text-lg font-semibold">Payment Method</h2>
          </div>
          <div className="mt-4">
            <label className="block mb-2">
              <input
                type="radio"
                name="paymentMethod"
                value="creditCard"
                checked={paymentMethod === 'creditCard'}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="mr-2"
              />
              Credit Card
            </label>
            <label className="block mb-2">
              <input
                type="radio"
                name="paymentMethod"
                value="paypal"
                checked={paymentMethod === 'paypal'}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="mr-2"
              />
              PayPal
            </label>
            <label className="block mb-2">
              <input
                type="radio"
                name="paymentMethod"
                value="cashOnDelivery"
                checked={paymentMethod === 'cashOnDelivery'}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="mr-2"
              />
              Cash on Delivery
            </label>
          </div>
        </div>

        {/* Order Summary */}
        <div className="bg-white rounded-sm p-4 flex shadow-2xl border-2 border-b-4 border-gray-200">
          <div className="w-3/5 border-r border-gray-300 mr-2">
            <h3 className="font-bold text-gray-900 pb-2">Order Summary</h3>
            <ul className="text-gray-700 mt-4 space-y-2">
              <p className="flex flex-wrap gap-4  font-bold">
                Total items: {cart?.items.length || 0}
              </p>
              <p className="flex flex-wrap gap-4  font-bold">
                Total price: ${totalPrice.toFixed(2)}
              </p>
              <p className="flex flex-wrap gap-4  font-bold">
                Delivery cost: $10.00
              </p>
            </ul>
          </div>
          <div className="w-2/5 flex flex-col justify-between ml-4">
            <div className="font-bold text-gray-900">
              Total: ${(totalPrice + 10).toFixed(2)}
            </div>
            <button
              onClick={handlePlaceOrder}
              className="px-4 py-3 bg-black text-white rounded-3xl cursor-pointer mt-4"
            >
              Next Step
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
