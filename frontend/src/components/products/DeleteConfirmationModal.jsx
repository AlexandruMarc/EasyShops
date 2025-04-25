export default function DeleteConfirmationModal({
  users,
  onConfirm,
  onCancel,
}) {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/30 z-50">
      <div className="bg-white rounded p-6 max-w-md w-full">
        <h3 className="text-xl font-bold mb-4">Attention!</h3>
        <p className="text-sm text-gray-600 mb-3">
          The product is present in the carts of the following customers:
        </p>
        <ul className="space-y-2">
          {users?.map((user, index) => (
            <li key={index} className="border-b border-gray-200 pb-2">
              {user.email}
            </li>
          ))}
        </ul>
        <div className="flex items-center justify-between mt-3">
          <button
            className=" bg-red-500 hover:bg-red-800 text-white font-bold py-2 px-4 rounded cursor-pointer"
            onClick={onConfirm}
          >
            Remove from cart and delete
          </button>
          <button
            className="align-right bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline cursor-pointer"
            onClick={onCancel}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
