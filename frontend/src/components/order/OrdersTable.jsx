import React from 'react';
import { Link } from 'react-router-dom';

export default function OrdersTable({ orders }) {
  return (
    <div className="overflow-x-auto">
      <table className="table-auto w-full">
        <thead className="bg-gray-800 text-white text-left border-b">
          <tr>
            <th className="py-2 px-4">Order ID</th>
            <th className="py-2 px-4">Status</th>
            <th className="py-2 px-4">Total</th>
            <th className="py-2 px-4">Actions</th>
          </tr>
        </thead>
        <tbody>
          {orders.length > 0 ? (
            orders.map((order) => (
              <tr key={order.id} className="hover:bg-gray-100">
                <td className="py-2 px-4 border-b">{order.id}</td>
                <td className="py-2 px-4 border-b">{order.status}</td>
                <td className="py-2 px-4 border-b">${order.totalAmount}</td>
                <td className="py-2 px-4 border-b">
                  <Link
                    to={`/admin/orders/update/${order.id}`}
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded"
                  >
                    Update
                  </Link>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4" className="py-2 px-4 text-center">
                No orders found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
