import React, { useState } from 'react';

export default function UserOrders({ orders }) {
  const [selectedOrder, setSelectedOrder] = useState(null);
  return (
    <>
      <div className="bg-white border-l-black p-6 rounded shadow-2xl border-2 border-b-4 border-gray-200 w-full max-w-[45rem] mx-auto">
        <h2 className="text-2xl font-bold mb-6">My Orders</h2>
        <ul className="space-y-4">
          {orders.length ? (
            orders.map((order) => (
              <li
                key={order.id}
                className="bg-gray-50 hover:bg-gray-100 transition-all duration-200 ease-in-out p-4 rounded border border-gray-200 flex justify-between items-center"
              >
                <div>
                  <p className="text-gray-700 font-medium">
                    Order ID: <span className="font-normal">{order.id}</span>
                  </p>
                  <p className="text-gray-700">
                    Status: <span className="font-normal">{order.status}</span>
                  </p>
                  <p className="text-gray-700">
                    Date:{' '}
                    <span className="font-normal">
                      {new Date(order.orderDate).toLocaleDateString()}
                    </span>
                  </p>
                  <p className="text-gray-700">
                    Total:{' '}
                    <span className="font-normal">${order.totalAmount}</span>
                  </p>
                </div>
                <button
                  className="shadow-lg border-2 border-b-4 border-gray-800 bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded cursor-pointer active:shadow-sm active:border-b-2 active:translate-y-1"
                  onClick={() => setSelectedOrder(order)}
                >
                  View Items
                </button>
              </li>
            ))
          ) : (
            <div> No Orders </div>
          )}
        </ul>
      </div>

      {/* Modal for items */}
      {selectedOrder && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/30 z-50">
          <div className="bg-white rounded p-6 max-w-[800px] w-full">
            <h3 className="text-xl font-bold mb-4">
              Items for Order {selectedOrder.id}
            </h3>
            <ul className="space-y-2">
              {selectedOrder.items &&
                selectedOrder.items.map((item, index) => (
                  <li key={index} className="border-b border-gray-200 pb-2">
                    <p className="text-gray-700">
                      {item.quantity} x{' '}
                      {item.productName ? item.productName : item.name}{' '}
                      {item.productBrand ? item.productBrand : item.brand} --
                      {'>'} ${item.price}
                    </p>
                  </li>
                ))}
            </ul>
            <button
              className="mt-4 bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded"
              onClick={() => setSelectedOrder(null)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
}
