import React from "react";
import { assets } from "../../assets/assets";

const categories = [
  { name: "Fruits", image: assets.fruit },
  { name: "Vegetables", image: assets.vegetable },
  { name: "Paan Corner", image: assets.paan },
  { name: "Cold Drink", image: assets.coldDrink },
  { name: "Snacks and Munchies", image: assets.snacks },
  { name: "Breakfast and instant food", image: assets.breakfast },
  { name: "Sweet Tooth", image: assets.iceCream },
  { name: "Biscuits", image: assets.oreo },
  { name: "Tea and Coffee", image: assets.coffee },
  { name: "Bakery", image: assets.bakery }, // add a 10th category if needed
  { name: "Atta, Rice &  Daal", image: assets.atta },
  { name: "Masala , Oil & more ", image: assets.masala },
  { name: "Sauces and Spread", image: assets.sauce },
  { name: "Chicken , meat &  Fish", image: assets.meat },
  { name: "Organic and healthy living", image: assets.organic },
  { name: "Baby Care", image: assets.baby_care },
  { name: "Pharma & Wellness", image: assets.medicine },
  { name: "Cleaning Essentials", image: assets.detergent },
  { name: "Home and Offices", image: assets.home },
  { name: "Personal Care", image: assets.Personal_Care },
];

const CategorySection = () => {
  return (
    <div className="w-full px-4 py-8 bg-gray-50">
      <h2 className="text-3xl sm:text-4xl font-extrabold mb-6 text-gray-800 text-center">
        Shop by Category
      </h2>

      {/* Responsive grid: 2 cols mobile, 3 tablet, 10 desktop */}
      <div className="grid grid-cols-3 sm:grid-cols-3 lg:grid-cols-10 gap-4">
        {categories.map((category, index) => (
          <div
            key={index}
            className="flex flex-col items-center cursor-pointer transform transition-transform duration-300 hover:scale-105"
          >
            <div className="w-full h-36 sm:h-40 lg:h-36 p-2 bg-[#D2F5D2] rounded-2xl overflow-hidden shadow-lg flex items-center justify-center">
              <img
                src={category.image}
                alt={category.name}
                className="w-full h-full object-contain"
              />
            </div>
            <h3 className="mt-2 text-sm sm:text-base lg:text-sm font-semibold text-gray-800 text-center">
              {category.name}
            </h3>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategorySection;
