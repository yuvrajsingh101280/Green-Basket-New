import React from "react";
import { ShoppingCart } from "lucide-react";

// Dummy trending products
const trendingProducts = [
  {
    id: 1,
    name: "Amul Gold Milk 1L",
    price: 65,
    oldPrice: 72,
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRuaC5tg-eZ6ciDVms7DNWv-acbDX6bMoFyyQ&s",
    badge: "Hot",
  },
  {
    id: 2,
    name: "Parle-G Biscuits Pack",
    price: 50,
    oldPrice: 60,
    image:
      "https://www.bbassets.com/media/uploads/p/l/302110_7-parle-gluco-biscuits-parle-g.jpg",
    badge: "Trending",
  },
  {
    id: 3,
    name: "Tata Salt 1kg",
    price: 22,
    oldPrice: 28,
    image: "https://m.media-amazon.com/images/I/614mm2hYHyL.jpg",
  },
  {
    id: 4,
    name: "Coca Cola 1.25L",
    price: 75,
    oldPrice: 90,
    image:
      "https://m.media-amazon.com/images/I/61y4HOllrdL._UF894,1000_QL80_.jpg",
    badge: "Hot",
  },
  {
    id: 5,
    name: "Sunfeast Yippee Noodles",
    price: 48,
    oldPrice: 60,
    image: "https://m.media-amazon.com/images/I/81VCexwW4tL.jpg",
    badge: "Trending",
  },
  {
    id: 6,
    name: "Amul Butter 500g",
    price: 240,
    oldPrice: 280,
    image:
      "https://m.media-amazon.com/images/I/61vr7r8qqsL._UF894,1000_QL80_.jpg",
  },
];

const TrendingProductsSection = () => {
  return (
    <section className="px-6 py-10 bg-gray-50">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-3xl font-extrabold text-gray-800">
          Trending Products
        </h2>
        <button className="text-green-600 font-semibold hover:underline">
          View All
        </button>
      </div>

      {/* Horizontal scroll container */}
      <div className="flex gap-6 overflow-x-auto scrollbar-hide">
        {trendingProducts.map((product) => (
          <div
            key={product.id}
            className="min-w-[200px] bg-white rounded-2xl shadow-md hover:shadow-xl transition-transform duration-300 transform hover:scale-105 p-4 flex flex-col relative cursor-pointer"
          >
            {/* Badge */}
            {product.badge && (
              <span className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-lg">
                {product.badge}
              </span>
            )}

            {/* Discount */}
            {product.oldPrice > product.price && (
              <span className="absolute top-3 right-3 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-lg">
                Save ₹{product.oldPrice - product.price}
              </span>
            )}

            {/* Product Image */}
            <div className="h-36 flex items-center justify-center mb-4">
              <img
                src={product.image}
                alt={product.name}
                className="max-h-full object-contain"
              />
            </div>

            {/* Product Info */}
            <h3 className="text-sm sm:text-base font-semibold line-clamp-2 mb-2">
              {product.name}
            </h3>
            <div className="flex items-center gap-2 mb-4">
              <span className="text-lg font-bold">₹{product.price}</span>
              <span className="text-sm line-through text-gray-400">
                ₹{product.oldPrice}
              </span>
            </div>

            {/* Add to Cart */}
            <button className="mt-auto bg-green-600 hover:bg-green-700 text-white rounded-xl py-2 px-4 flex items-center justify-center gap-2">
              <ShoppingCart size={18} />
              Add
            </button>
          </div>
        ))}
      </div>
    </section>
  );
};

export default TrendingProductsSection;
