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
    <section className="px-6 py-12 bg-gradient-to-b from-[#f5fff7] to-[#e6f7eb]">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl md:text-3xl font-extrabold text-[#135e07]">
          Popular Near You
        </h2>
        <button className="text-[#2a6d1b] font-semibold hover:text-[#39841e] transition-colors">
          View All
        </button>
      </div>

      {/* Product List */}
      <div className="flex gap-6 overflow-x-auto scrollbar-hide md:grid md:grid-cols-3 lg:grid-cols-5 md:gap-8">
        {products.map((product) => (
          <div
            key={product.id}
            className="relative min-w-[220px] md:min-w-0 bg-gradient-to-br from-white to-[#f1fff4] border border-green-100 rounded-2xl shadow-md hover:shadow-xl transition-transform hover:-translate-y-1 flex flex-col p-4"
          >
            {/* Discount badge */}
            {product.oldPrice > product.price && (
              <span className="absolute top-3 z-12 left-3 bg-gradient-to-r from-[#c86404] to-[#c99443] text-white text-xs font-bold px-2 py-1 rounded-lg shadow-md">
                Save ₹{product.oldPrice - product.price}
              </span>
            )}

            {/* Image */}
            <div className="h-40 flex items-center justify-center mb-4 overflow-hidden rounded-xl bg-white">
              <img
                src={product.image}
                alt={product.name}
                className="max-h-full object-contain transform transition-transform duration-300 hover:scale-110"
              />
            </div>

            {/* Info */}
            <h3 className="text-sm font-semibold text-[#135e07] line-clamp-2">
              {product.name}
            </h3>
            <div className="flex items-center gap-2 mt-2">
              <span className="text-lg font-bold text-[#2a6d1b]">
                ₹{product.price}
              </span>
              <span className="text-sm line-through text-gray-500">
                ₹{product.oldPrice}
              </span>
            </div>

            {/* Add button (floating) */}
            <button className="absolute bottom-4 right-4 bg-gradient-to-r from-[#5c9c2c] to-[#39841e] hover:from-[#39841e] hover:to-[#2a6d1b] text-white rounded-full p-3 shadow-lg transition-transform hover:scale-110">
              <ShoppingCart size={18} />
            </button>
          </div>
        ))}
      </div>
    </section>
  );
};

export default PopularNearYouSection;
