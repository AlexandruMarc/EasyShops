import React from 'react';
import { Link } from 'react-router-dom';

export default function ProductTable({ products, deleteProduct }) {
  return (
    <div className="overflow-x-auto">
      <table className="table-auto w-full">
        <thead className="bg-gray-800 text-white text-left">
          <tr>
            <th className="py-2 px-4 border-b">ID</th>
            <th className="py-2 px-4 border-b">Name</th>
            <th className="py-2 px-4 border-b">Price</th>
            <th className="py-2 px-4 border-b">Inventory</th>
            <th className="py-2 px-4 border-b">Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.length > 0 ? (
            products.map((product) => (
              <tr key={product.id} className="hover:bg-gray-100">
                <td className="py-2 px-4 border-b">{product.id}</td>
                <td className="py-2 px-4 border-b overflow-hidden text-ellipsis whitespace-nowrap max-w-[500px]">
                  {product.name}
                </td>
                <td className="py-2 px-4 border-b">
                  ${product.price.toFixed(2)}
                </td>
                <td className="py-2 px-4 border-b">{product.inventory}</td>
                <td className="py-2 px-4 border-b">
                  <Link
                    to={`/admin/products/update/${product.id}`}
                    className="bg-yellow-500 hover:bg-yellow-700
                     text-white font-bold py-1 px-3 rounded mr-2"
                  >
                    Update
                  </Link>
                  <button
                    className="bg-red-500 hover:bg-red-800
                     text-white font-bold py-1 px-3 cursor-pointer rounded"
                    onClick={() => deleteProduct(product.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4" className="py-2 px-4 text-center">
                No products found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
