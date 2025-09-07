import React from "react";
import { ShoppingCart } from "lucide-react";

const PopularNearYouSection = () => {
  // Dummy products (replace with API data later)
  const products = [
    {
      id: 1,
      name: "Amul Gold Milk 1L",
      price: 65,
      oldPrice: 72,
      image:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRuaC5tg-eZ6ciDVms7DNWv-acbDX6bMoFyyQ&s",
    },
    {
      id: 2,
      name: "Parle-G Biscuits (Pack of 10)",
      price: 50,
      oldPrice: 60,
      image:
        "https://www.bbassets.com/media/uploads/p/l/302110_7-parle-gluco-biscuits-parle-g.jpg",
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
    },
    {
      id: 5,
      name: "Sunfeast Yippee Noodles",
      price: 48,
      oldPrice: 60,
      image: "https://m.media-amazon.com/images/I/81VCexwW4tL.jpg",
    },
  ];

  return (
    <section className="px-6 py-10">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Popular Near You</h2>
        <button className="text-green-600 font-semibold hover:underline">
          View All
        </button>
      </div>

      {/* Product List */}
      <div className="flex gap-6 overflow-x-auto scrollbar-hide md:grid md:grid-cols-3 lg:grid-cols-5 md:gap-8">
        {products.map((product) => (
          <div
            key={product.id}
            className="relative min-w-[220px] md:min-w-0 bg-white border border-gray-100 rounded-2xl shadow-md hover:shadow-xl transition-transform hover:-translate-y-1 flex flex-col p-4"
          >
            {/* Discount badge */}
            {product.oldPrice > product.price && (
              <span className="absolute top-3 z-100 left-3 bg-gradient-to-r from-green-500 to-green-300 text-white text-xs font-bold px-2 py-1 rounded-lg shadow-sm">
                Save ₹{product.oldPrice - product.price}
              </span>
            )}

            {/* Image */}
            <div className="h-40 flex items-center justify-center mb-4 overflow-hidden rounded-xl">
              <img
                src={product.image}
                alt={product.name}
                className="max-h-full object-contain transform transition-transform duration-300 hover:scale-110"
              />
            </div>

            {/* Info */}
            <h3 className="text-sm font-semibold text-gray-800 line-clamp-2">
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

            {/* Add button (floats bottom-right) */}
            <button className="absolute bottom-4 right-4 bg-green-600 hover:bg-green-700 text-white rounded-full p-3 shadow-lg transition-transform hover:scale-110">
              <ShoppingCart size={18} />
            </button>
          </div>
        ))}
      </div>
    </section>
  );
};

export default PopularNearYouSection;
