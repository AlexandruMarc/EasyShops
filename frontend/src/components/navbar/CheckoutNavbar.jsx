import { faHippo, faShoppingCart } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';

import { ShoppingCartContext } from '../../context/Contex';

export default function CheckoutNavbar() {
  const { cartItems } = useContext(ShoppingCartContext);
  const location = useLocation();

  const steps = [
    { name: 'My Cart', path: '/cart/my' },
    { name: 'Details', path: '/cart/checkout' },
    { name: 'Summary', path: '/cart/summary' },
    { name: 'Order Placed', path: '/cart/placed' },
  ];

  const currentPathIndex = steps.findIndex(
    (step) => step.path === location.pathname,
  );

  const isStepCompleted = (stepPath) => {
    const stepIndex = steps.findIndex((step) => step.path === stepPath);
    return stepIndex <= currentPathIndex;
  };

  return (
    <div>
      {/* Navigation Bar */}
      <div className="bg-white p-4 font-serif shadow-md border-b-4 border-cyan-500 z-10 flex items-center justify-center space-x-30">
        <div>
          <Link to="/" className="text-black font-serif text-2xl">
            <FontAwesomeIcon icon={faHippo} />
            <span>Easy-shops</span>
          </Link>
        </div>

        {/* Middle Section: Steps - Centered */}
        <div className="flex items-center space-x-4">
          {steps.map((step, index) => {
            const completed = isStepCompleted(step.path);
            const isClickable = index <= currentPathIndex;

            return (
              <div key={index} className="flex items-center">
                {isClickable ? (
                  <Link
                    to={step.path}
                    className="flex flex-col items-center text-center"
                  >
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold 
                      ${
                        completed
                          ? 'bg-blue-500 text-white'
                          : 'bg-gray-200 text-gray-500'
                      }
                    `}
                    >
                      {/* If the step is completed and not the last, show a checkmark instead of index */}
                      {completed && index < currentPathIndex ? (
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth={3}
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      ) : (
                        index + 1
                      )}
                    </div>
                    <span
                      className={`mt-1 text-sm font-medium ${
                        completed ? 'text-blue-600' : 'text-gray-500'
                      }`}
                    >
                      {step.name}
                    </span>
                  </Link>
                ) : (
                  <div className="flex flex-col items-center text-center">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center font-semibold bg-gray-200 text-gray-500">
                      {index + 1}
                    </div>
                    <span className="mt-1 text-sm font-medium text-gray-500">
                      {step.name}
                    </span>
                  </div>
                )}

                {/* Connecting Line (except after the last step) */}
                {index < steps.length - 1 && (
                  <div
                    className={`w-8 h-1 ml-4 mr-4 ${
                      isStepCompleted(steps[index + 1].path)
                        ? 'bg-blue-500'
                        : 'bg-gray-300'
                    }`}
                  />
                )}
              </div>
            );
          })}
        </div>
        <div>
          <Link
            to="/cart/my"
            className="relative text-gray-700 hover:text-gray-900"
          >
            {cartItems.length > 0 && (
              <span className="absolute -top-4 -right-3 px-2 py-1 text-[10px] leading-none text-white bg-red-500 rounded-[12px]">
                {cartItems.length}
              </span>
            )}
            <FontAwesomeIcon icon={faShoppingCart} className="h-6 w-6" />
          </Link>
        </div>
      </div>
    </div>
  );
}
