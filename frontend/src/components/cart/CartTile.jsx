import { useState } from 'react';
import { Link } from 'react-router-dom';

const URL = 'http://localhost:8080';

export default function CartTile({
  item,
  handleRemoveItem,
  handleUpdateQuantity,
}) {
  const [quantity, setQuantity] = useState(item.quantity);

  function handleQuantityChange(e) {
    const newQuantity = parseInt(e.target.value, 10);
    if (newQuantity < 1 || newQuantity > item.product.inventory) return;
    setQuantity(newQuantity);
    handleUpdateQuantity(item.product.id, newQuantity);
  }

  return (
    <Link to={`/product-details/${item.product.id}`} className="block">
      <div className="bg-white shadow-lg border-2 border-b-4 border-gray-200 rounded-md p-4 mb-4">
        <div className="grid grid-cols-3 items-start gap-5">
          {/* Image + Title + Remove */}
          <div className="col-span-2 flex items-start gap-4">
            <div className="w-28 h-28 max-sm:w-20 shrink-0 bg-gray-100 p-1 rounded-md">
              <img
                src={URL + item.product.images[0].downloadURL}
                alt={item.product.images[0]?.imageName}
                className="w-full h-full object-contain rounded-sm"
              />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900 overflow-hidden text-ellipsis whitespace-nowrap max-w-[1000px]">
                {item.product.name}
              </h3>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  handleRemoveItem(item.product.id);
                }}
                className="shadow-lg border-2 border-b-4 border-red-800 text-sm px-4 py-2 bg-red-400 hover:bg-red-600 text-white rounded-md mt-5 cursor-pointer active:shadow-sm active:border-b-2 active:translate-y-1"
              >
                Remove
              </button>
            </div>
          </div>

          {/* Price + control quantity */}
          <div className="ml-auto">
            <h3 className="text-lg font-bold text-center text-gray-900">
              ${item.product.price.toFixed(2)}
            </h3>
            <div className="mt-5 flex items-center justify-center">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  handleQuantityChange({ target: { value: quantity - 1 } });
                }}
                className="shadow-lg border-2 border-b-4 border-gray-300 text-sm px-3 py-1 bg-gray-50 hover:bg-gray-400 text-gray-900 rounded-md cursor-pointer active:shadow-sm active:border-b-2 active:translate-y-1"
              >
                -
              </button>
              <span className="text-lg font-bold text-gray-900 mx-2">
                {quantity}
              </span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  handleQuantityChange({ target: { value: quantity + 1 } });
                }}
                className="shadow-lg border-2 border-b-4 border-gray-300 text-sm px-3 py-1 bg-gray-50 hover:bg-gray-400 text-gray-900 rounded-md cursor-pointer active:shadow-sm active:border-b-2 active:translate-y-1"
              >
                +
              </button>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
