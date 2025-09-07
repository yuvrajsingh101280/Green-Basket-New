import React, { useState, useEffect } from "react";
import { ShoppingCart } from "lucide-react";

const flashDeals = [
  {
    id: 1,
    name: "Amul Butter 500g",
    price: 240,
    oldPrice: 280,
    image:
      "https://m.media-amazon.com/images/I/61vr7r8qqsL._UF894,1000_QL80_.jpg",
    dealEnds: new Date(new Date().getTime() + 3600 * 1000),
  },
  {
    id: 2,
    name: "Pepsi 2L Bottle",
    price: 95,
    oldPrice: 110,
    image:
      "https://m.media-amazon.com/images/I/71481z7T4kL._UF1000,1000_QL80_.jpg",
    dealEnds: new Date(new Date().getTime() + 5400 * 1000),
  },
  {
    id: 3,
    name: "Nestlé Milk Powder",
    price: 380,
    oldPrice: 420,
    image: "https://m.media-amazon.com/images/I/71fwfzc-iSL.jpg",
    dealEnds: new Date(new Date().getTime() + 7200 * 1000),
  },
  {
    id: 4,
    name: "Lays Classic Salted",
    price: 30,
    oldPrice: 40,
    image: "https://m.media-amazon.com/images/I/61e+UwnsWwL.jpg",
    dealEnds: new Date(new Date().getTime() + 1800 * 1000),
  },
  {
    id: 5,
    name: "Sunfeast Yippee Noodles",
    price: 48,
    oldPrice: 60,
    image: "https://m.media-amazon.com/images/I/81VCexwW4tL.jpg",
    dealEnds: new Date(new Date().getTime() + 3600 * 1000),
  },
];

const FlashSaleSection = () => {
  const [timeLeft, setTimeLeft] = useState({});

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date().getTime();
      const updatedTime = {};
      flashDeals.forEach((deal) => {
        const distance = deal.dealEnds - now;
        updatedTime[deal.id] = distance > 0 ? distance : 0;
      });
      setTimeLeft(updatedTime);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const formatTime = (ms) => {
    const totalSeconds = Math.floor(ms / 1000);
    const hours = String(Math.floor(totalSeconds / 3600)).padStart(2, "0");
    const minutes = String(Math.floor((totalSeconds % 3600) / 60)).padStart(
      2,
      "0"
    );
    const seconds = String(totalSeconds % 60).padStart(2, "0");
    return `${hours}:${minutes}:${seconds}`;
  };

  return (
    <section className="px-6 py-10 bg-gray-50">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-3xl font-extrabold">Flash Sale</h2>
        <button className="text-green-600 font-semibold hover:underline">
          View All Deals
        </button>
      </div>

      {/* Cards */}
      <div className="flex gap-6 overflow-x-auto scrollbar-hide lg:grid lg:grid-cols-5 lg:gap-6">
        {flashDeals.map((deal) => (
          <div
            key={deal.id}
            className="min-w-[220px] lg:min-w-0 bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all transform hover:scale-105 hover:-translate-y-1 p-4 flex flex-col relative cursor-pointer"
          >
            {/* Discount Badge */}
            {deal.oldPrice > deal.price && (
              <span className="absolute top-3 left-3 bg-gradient-to-r from-green-500 to-green-300 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                Save ₹{deal.oldPrice - deal.price}
              </span>
            )}

            {/* Countdown */}
            <span className="absolute top-3 right-3 bg-gradient-to-r from-yellow-400 to-yellow-300 text-black text-xs font-bold px-3 py-1 rounded-full shadow">
              {timeLeft[deal.id] ? formatTime(timeLeft[deal.id]) : "00:00:00"}
            </span>

            {/* Image */}
            <div className="h-44 flex items-center justify-center mb-4 bg-gray-50 rounded-2xl shadow-inner p-2">
              <img
                src={deal.image}
                alt={deal.name}
                className="max-h-full object-contain"
              />
            </div>

            {/* Info */}
            <h3 className="text-base font-semibold line-clamp-2 mb-2">
              {deal.name}
            </h3>
            <div className="flex items-center gap-2 mb-4">
              <span className="text-lg font-bold text-green-600">
                ₹{deal.price}
              </span>
              <span className="text-sm line-through text-gray-400">
                ₹{deal.oldPrice}
              </span>
            </div>

            {/* Add Button */}
            <button className="mt-auto bg-green-600 hover:bg-green-700 text-white rounded-xl py-2 px-4 flex items-center justify-center gap-2 hover:scale-105 transition-transform duration-300">
              <ShoppingCart size={18} />
              Add
            </button>
          </div>
        ))}
      </div>
    </section>
  );
};

export default FlashSaleSection;
