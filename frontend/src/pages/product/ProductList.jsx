import { useContext, useState } from 'react';

import Pagination from '../../components/Pagination';
import SearchFilters from '../../components/SearchFilters';
import ProductCard from '../../components/products/ProductCard';
import Loader from '../../components/utils/Loader';
import { ShoppingCartContext } from '../../context/Contex';

export default function ProductList() {
  const {
    listOfProducts,
    loading,
    searchResults,
    selectedProduct,
    userId,
    selectedCategory,
    setSelectedCategory,
    selectedBrand,
    setSelectedBrand,
  } = useContext(ShoppingCartContext);
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 15;

  let productsToDisplay;
  if (selectedProduct) {
    productsToDisplay = selectedProduct.products;
  } else if (searchResults) {
    productsToDisplay = searchResults;
  } else {
    productsToDisplay = listOfProducts;
  }

  if (loading) return <Loader />;

  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = productsToDisplay?.slice(
    indexOfFirstProduct,
    indexOfLastProduct,
  );

  const totalPages = Math.ceil(productsToDisplay?.length / productsPerPage);

  function handlePageChange(pageNumber) {
    setCurrentPage(pageNumber);
  }

  return (
    <section className="py-12 bg-gray-50 sm:py-20 lg:py-24 mt-6">
      <div className="px-4 mx-auto sm:px-8 lg:px-12 max-w-[2030px] flex gap-8">
        <SearchFilters />
        <div className="flex-1">
          <div className="max-w-lg mx-auto text-center">
            <h2 className="text-4xl font-bold text-gray-800 sm:text-5xl">
              Explore Our Products
            </h2>
            <p className="mt-4 text-base text-gray-600 sm:mt-6">
              Discover a variety of items tailored to your needs.
            </p>
          </div>

          {(selectedCategory || selectedBrand) && (
            <div className="mt-4 text-left text-lg font-medium text-gray-700">
              {selectedCategory && <span>Category: {selectedCategory}</span>}
              {selectedCategory && selectedBrand && <span> | </span>}
              {selectedBrand && <span>Brand: {selectedBrand}</span>}
            </div>
          )}
          <div className="grid grid-cols-2 gap-6 mt-12 lg:mt-20 lg:gap-10 lg:grid-cols-5">
            {currentProducts && currentProducts.length > 0 ? (
              currentProducts.map((singleProductCard) => (
                <ProductCard
                  product={singleProductCard}
                  key={singleProductCard.id}
                />
              ))
            ) : (
              <div className="text-center text-lg font-medium text-gray-700">
                No products found
              </div>
            )}
          </div>
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      </div>
    </section>
  );
}
