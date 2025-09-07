import React from "react";
import { Plus, ArrowRight } from "lucide-react";

const FeaturedProductsSection = () => {
  const products = [
    {
      id: 1,
      name: "Amul Butter 500g",
      price: 240,
      oldPrice: 280,
      image:
        "https://m.media-amazon.com/images/I/61vr7r8qqsL._UF894,1000_QL80_.jpg",
    },
    {
      id: 2,
      name: "Pepsi 2L Bottle",
      price: 95,
      oldPrice: 110,
      image:
        "https://m.media-amazon.com/images/I/71481z7T4kL._UF1000,1000_QL80_.jpg",
    },
    {
      id: 3,
      name: "Lays Classic Salted",
      price: 30,
      oldPrice: 40,
      image: "https://m.media-amazon.com/images/I/61e+UwnsWwL.jpg",
    },
    {
      id: 4,
      name: "Nestlé Milk Powder",
      price: 380,
      oldPrice: 420,
      image: "https://m.media-amazon.com/images/I/71fwfzc-iSL.jpg",
    },
    {
      id: 5,
      name: "Oreo Biscuits Pack",
      price: 60,
      oldPrice: 80,
      image:
        "https://m.media-amazon.com/images/I/81ka1J+d2lL._AC_UL600_FMwebp_QL65_.jpg",
    },
  ];

  return (
    <section className="px-4 sm:px-6 py-10">
      {/* Section Header with View All */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">
          Best Deals Today
        </h2>
        <button className="flex items-center gap-1 text-green-600 hover:text-green-700 font-medium text-sm sm:text-base">
          View All <ArrowRight size={16} />
        </button>
      </div>

      {/* MOBILE: horizontal scroll */}
      <div className="flex sm:hidden gap-4 overflow-x-auto scrollbar-hide pb-2">
        {products.map((product) => {
          const discount = product.oldPrice - product.price;
          return (
            <div
              key={product.id}
              className="min-w-[160px] bg-white rounded-2xl border border-gray-100 hover:shadow-md transition p-3 flex flex-col relative"
            >
              {discount > 0 && (
                <span className="absolute top-3 left-3 bg-green-600 text-white text-[10px] font-semibold px-2 py-1 rounded-lg">
                  Save ₹{discount}
                </span>
              )}

              <div className="h-28 flex items-center justify-center mb-2">
                <img
                  src={product.image}
                  alt={product.name}
                  className="max-h-full object-contain"
                />
              </div>

              <h3 className="text-xs font-medium text-gray-800 line-clamp-2">
                {product.name}
              </h3>
              <div className="flex items-center gap-1 mt-1">
                <span className="text-sm font-bold">₹{product.price}</span>
                <span className="text-[11px] line-through text-gray-400">
                  ₹{product.oldPrice}
                </span>
              </div>

              <button className="mt-2 w-full bg-green-600 hover:bg-green-700 text-white rounded-lg py-1 text-xs font-semibold flex items-center justify-center gap-1">
                <Plus size={12} />
                Add
              </button>
            </div>
          );
        })}
      </div>

      {/* DESKTOP/TABLET: grid view */}
      <div className="hidden sm:grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-6">
        {products.map((product) => {
          const discount = product.oldPrice - product.price;
          return (
            <div
              key={product.id}
              className="bg-white rounded-2xl border border-gray-100 hover:shadow-md transition p-3 flex flex-col relative"
            >
              {discount > 0 && (
                <span className="absolute top-3 left-3 bg-green-600 text-white text-xs font-semibold px-2 py-1 rounded-lg">
                  Save ₹{discount}
                </span>
              )}

              <div className="h-36 flex items-center justify-center mb-3">
                <img
                  src={product.image}
                  alt={product.name}
                  className="max-h-full object-contain"
                />
              </div>

              <h3 className="text-sm sm:text-base font-medium text-gray-800 line-clamp-2">
                {product.name}
              </h3>
              <div className="flex items-center gap-2 mt-2">
                <span className="text-lg font-bold text-gray-900">
                  ₹{product.price}
                </span>
                <span className="text-sm line-through text-gray-400">
                  ₹{product.oldPrice}
                </span>
              </div>

              <button className="mt-3 w-full bg-green-600 hover:bg-green-700 text-white rounded-xl py-2 flex items-center justify-center gap-1 text-sm font-semibold">
                <Plus size={16} />
                Add
              </button>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default FeaturedProductsSection;
