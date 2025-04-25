import React from 'react';
import { Link } from 'react-router-dom';

export default function UsersTable({ users }) {
  return (
    <div className="overflow-x-auto">
      <table className="table-auto w-full">
        <thead className="bg-gray-800 text-white text-left border-b">
          <tr>
            <th className="py-2 px-4">ID</th>
            <th className="py-2 px-4">Name</th>
            <th className="py-2 px-4">Email</th>
            <th className="py-2 px-4">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.length > 0 ? (
            users.map((user) => (
              <tr key={user.id} className="hover:bg-gray-100">
                <td className="py-2 px-4 border-b">{user.id}</td>
                <td className="py-2 px-4 border-b">
                  {user.firstName} {user.lastName}
                </td>
                <td className="py-2 px-4 border-b">{user.email}</td>
                <td className="py-2 px-4 border-b">
                  <Link
                    to={`/admin/users/update/${user.id}`}
                    className="bg-yellow-500 hover:bg-yellow-700 
                        text-white font-bold py-1 px-3 rounded mr-2"
                  >
                    Update
                  </Link>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4" className="py-2 px-4 text-center">
                No users found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
