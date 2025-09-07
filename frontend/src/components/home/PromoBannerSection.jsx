import React from "react";
import { assets } from "../../assets/assets";

const promos = [
  {
    title: "Up to 50% Off Fruits",
    subtitle: "Fresh & Juicy Everyday",
    image: assets.fruit,
    gradient: "from-orange-100 to-yellow-50",
  },
  {
    title: "Snacks & Munchies",
    subtitle: "Crunchy Deals Await",
    image: assets.snacks,
    gradient: "from-green-100 to-emerald-50",
  },
  {
    title: "Beverages Deals",
    subtitle: "Chill Your Thirst",
    image: assets.coldDrink,
    gradient: "from-blue-100 to-indigo-50",
  },
];

const PromoBannerSection = () => {
  return (
    <div className="w-full px-4 py-12">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {promos.map((promo, index) => (
          <div
            key={index}
            className={`relative flex items-center justify-between p-6 rounded-3xl shadow-lg cursor-pointer bg-gradient-to-r ${promo.gradient} hover:scale-[1.02] transition-transform duration-300`}
          >
            {/* Left: Text */}
            <div className="z-10 max-w-[60%]">
              <h3 className="text-2xl font-extrabold text-gray-800">
                {promo.title}
              </h3>
              <p className="mt-1 text-base font-medium text-gray-600">
                {promo.subtitle}
              </p>
              <button className="mt-4 px-5 py-2 bg-green-600 text-white text-sm font-semibold rounded-xl hover:bg-green-700 transition">
                Shop Now
              </button>
            </div>

            {/* Right: Image */}
            <div className="absolute right-4 bottom-2 w-28 h-28 sm:w-32 sm:h-32">
              <img
                src={promo.image}
                alt={promo.title}
                className="w-full h-full object-contain drop-shadow-md"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PromoBannerSection;
