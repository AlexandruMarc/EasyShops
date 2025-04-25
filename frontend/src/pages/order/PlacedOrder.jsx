import { faCheckCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

export default function PlacedOrder() {
  const location = useLocation();
  const navigate = useNavigate();
  const { order } = location.state || {};

  return (
    <div className="container mx-auto font-serif mt-10 p-6 bg-white rounded shadow-lg border-2 border-b-4 border-gray-200">
      <div className="text-center mb-6">
        <FontAwesomeIcon
          icon={faCheckCircle}
          className="text-green-500 text-6xl mb-4"
        />
        <h1 className="text-3xl font-bold mb-6">Thank You for Your Order!</h1>
        <p className="text-lg">
          Your order has been placed successfully. Check your email for
          confirmation.
        </p>
        <p className="text-lg">Order ID: {order.data.id}</p>
      </div>
      <div className="mb-6 text-left ">
        <h2 className="text-2xl font-semibold mb-4">Order Details</h2>
        <div className="overflow-x-auto">
          <table className="table-auto w-full">
            <thead className="bg-gray-800 text-white text-left shadow-lg border-2 border-b-4 border-gray-200">
              <tr>
                <th className="py-2 px-4">Product</th>
                <th className="py-2 px-4">Quantity</th>
                <th className="py-2 px-4">Price</th>
              </tr>
            </thead>
            <tbody>
              {order &&
                order.data.items.map((item) => (
                  <tr
                    key={item.productId}
                    className="hover:bg-gray-200 shadow-lg border-2 border-b-4 border-gray-200"
                  >
                    <td className="py-2 px-4 border-b overflow-hidden text-ellipsis whitespace-nowrap max-w-[900px]">
                      {item.productName}
                    </td>
                    <td className="py-2 px-4 border-b">{item.quantity}</td>
                    <td className="py-2 px-4 border-b">${item.price}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
      <div className="text-center">
        <button
          onClick={() => navigate('/')}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded cursor-pointer"
        >
          Back to Home
        </button>
      </div>
    </div>
  );
}
