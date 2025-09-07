import React from "react";
import { assets } from "../../assets/assets";
import Marquee from "react-fast-marquee";

const brands = [
  { name: "Amul", image: assets.amul },
  { name: "Pepsi", image: assets.pepsi },
  { name: "Nestlé", image: assets.nestle },
  { name: "Britannia", image: assets.britannia },
  { name: "Tata", image: assets.tata },
  { name: "Dabur", image: assets.dabur },
  { name: "Coca Cola", image: assets.coke },
  { name: "Hershey", image: assets.hershey },
  { name: "Maggi", image: assets.maggi },
  { name: "Parle", image: assets.parle },
];

const TopBrandsSection = () => {
  return (
    <section className="w-full px-4 py-10 bg-gray-50">
      {/* Section Title */}
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-800">
          Top Brands
        </h2>
        <button className="text-green-600 font-semibold hover:underline">
          View All Brands
        </button>
      </div>

      {/* Marquee */}
      <Marquee gradient={false} speed={50} className="overflow-visible">
        {brands.map((brand, index) => (
          <div
            key={index}
            className="inline-block cursor-pointer mr-6" // gap between cards
          >
            <div
              className="flex flex-col items-center justify-center p-4 rounded-3xl
                   min-w-[120px] bg-gradient-to-tr from-white to-gray-100
                   border border-gray-200 shadow-md hover:shadow-xl
                   transition-all duration-300 transform hover:scale-105 hover:-translate-y-1"
            >
              <div className="w-20 h-20 flex items-center justify-center mb-2 p-2 bg-white rounded-full shadow-sm">
                <img
                  src={brand.image}
                  alt={brand.name}
                  className="w-full h-full object-contain"
                />
              </div>
              <span className="text-sm sm:text-base font-semibold text-gray-800 text-center">
                {brand.name}
              </span>
            </div>
          </div>
        ))}
      </Marquee>
    </section>
  );
};

export default TopBrandsSection;
