import { Link } from 'react-router-dom';

export default function Admin() {
  return (
    <div className="container mx-auto mt-15">
      <div className="bg-white shadow-lg rounded-lg">
        <div className="bg-gray-800 text-white p-4 rounded-t-lg">
          <h1 className="text-3xl font-bold">Admin Actions</h1>
        </div>
        <div className="p-4">
          <ul className="list-none">
            <li className="mb-2 border-b border-gray-300 pb-2">
              <Link
                to="/admin/products/list"
                className="text-gray-600 hover:text-gray-800"
              >
                Product List
              </Link>
            </li>
            <li className="mb-2 border-b border-gray-300 pb-2">
              <Link
                to="/admin/users/list"
                className="text-gray-600 hover:text-gray-800"
              >
                User List
              </Link>
            </li>
            <li className="mb-2 border-b border-gray-300 pb-2">
              <Link
                to="/admin/categories"
                className="text-gray-600 hover:text-gray-800"
              >
                Category Create/List
              </Link>
            </li>
            <li className="mb-2 border-b border-gray-300 pb-2">
              <Link
                to="/admin/orders/list"
                className="text-gray-600 hover:text-gray-800"
              >
                Order List/Update
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
