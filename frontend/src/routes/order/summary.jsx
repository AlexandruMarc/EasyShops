import { faCircleCheck } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useContext } from 'react';
import { useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';

import { ShoppingCartContext } from '../../context/ShoppingCartContext.jsx';
import apiClient from '../../services/apiClient.js';
import { useCreateNotification } from '../../utils/toast.js';

export default function Summary() {
  const navigate = useNavigate();
  const createNotification = useCreateNotification();
  const { setCartItems } = useContext(ShoppingCartContext);
  const userId = useSelector((state) => state.auth.user.userId);
  const location = useLocation();
  const {
    deliveryMethod,
    selectedAddress,
    paymentMethod,
    cart,
    totalPrice,
    userDetails,
  } = location.state || {};

  async function handlePlaceOrder() {
    try {
      const { data } = await apiClient.post(`/orders/order`, null, {
        params: { userId, addressId: selectedAddress.addressId },
      });
      setCartItems([]);
      navigate('/cart/placed', { state: { order: data } });
    } catch (error) {
      createNotification({ message: 'Error placing order', type: 'error' });
    }
  }

  return (
    <div className="p-20 font-serif max-w-5xl mx-auto max-md:max-w-xl py-4 shadow-lg border-2 border-b-4 border-gray-200 bg-gray-50 mt-20">
      <h1 className="text-2xl font-bold text-gray-800 text-center">
        Order Summary
      </h1>
      <div className="space-y-8 mt-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Delivery Method */}
          <div className="bg-gray-50 rounded-sm p-4 shadow-lg border-2 border-b-4 border-gray-200">
            <h3 className="text-xl font-bold text-gray-900 border-b border-gray-300 pb-2">
              <FontAwesomeIcon icon={faCircleCheck} /> Delivery Method
            </h3>
            <p className="mt-4 text-gray-700">{deliveryMethod}</p>
          </div>

          {/* Address */}
          <div className="bg-gray-50 rounded-sm p-4 shadow-lg border-2 border-b-4 border-gray-200">
            <h3 className="text-xl font-bold text-gray-900 border-b border-gray-300 pb-2">
              <FontAwesomeIcon icon={faCircleCheck} /> Address
            </h3>
            {selectedAddress ? (
              <p className="mt-4 text-gray-700">
                str {selectedAddress.street} in {selectedAddress.city} with
                postal code {selectedAddress.zipCode}, {selectedAddress.country}
              </p>
            ) : (
              <p className="mt-4 text-gray-700">Loading address...</p>
            )}
          </div>

          {/* Payment Method */}
          <div className="bg-gray-50 rounded-sm p-4 shadow-lg border-2 border-b-4 border-gray-200">
            <h3 className="text-xl font-bold text-gray-900 border-b border-gray-300 pb-2">
              <FontAwesomeIcon icon={faCircleCheck} /> Payment Method
            </h3>
            <p className="mt-4 text-gray-700">{paymentMethod}</p>
          </div>
        </div>

        {/* Order Items */}
        <div className="bg-gray-50 rounded-sm p-4 shadow-lg border-2 border-b-4 border-gray-200 mt-8">
          <h3 className="text-xl font-bold text-gray-900 border-b border-gray-300 pb-2">
            <FontAwesomeIcon icon={faCircleCheck} /> Order Items
          </h3>
          <ul className="text-gray-700 mt-4 space-y-2">
            {cart?.items.map((item) => (
              <li key={item.itemId} className="flex justify-between">
                <span className="overflow-hidden text-ellipsis whitespace-nowrap max-w-auto">
                  {item.quantity} x {item.product.name}
                </span>
                <span className="ml-1">
                  ${(item.product.price * item.quantity).toFixed(2)}
                </span>
              </li>
            ))}
            <li className="flex justify-between font-bold">
              <span>Delivery Cost</span>
              <span>$10.00</span>
            </li>
          </ul>
        </div>

        {/* Total Cost */}
        <div className="bg-gray-50 rounded-sm p-4 flex flex-col items-center shadow-lg border-2 border-b-4 border-gray-200 mt-8 mb-13">
          <div className="text-xl font-bold text-gray-900 mb-4">
            Total: ${(totalPrice + 10).toFixed(2)}
          </div>
          <button
            onClick={handlePlaceOrder}
            className="text-[18px] px-4 py-3 bg-black text-white rounded-full w-[250px] cursor-pointer"
          >
            Place Order
          </button>
        </div>
      </div>
    </div>
  );
}
