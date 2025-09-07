import React from "react";
import {
  Clock,
  Package,
  BadgePercent,
  ShieldCheck,
  Truck,
  Headphones,
} from "lucide-react";

const WhyShopWithUs = () => {
  const features = [
    {
      id: 1,
      title: "10-Minute Delivery",
      description:
        "Groceries at your doorstep in record time, anytime of the day.",
      icon: <Clock className="w-8 h-8 text-green-600" />,
    },
    {
      id: 2,
      title: "Wide Range of Products",
      description:
        "From fresh fruits to daily essentials, shop 5000+ items easily.",
      icon: <Package className="w-8 h-8 text-green-600" />,
    },
    {
      id: 3,
      title: "Best Prices & Offers",
      description:
        "Save more with exclusive deals, discounts, and bulk offers.",
      icon: <BadgePercent className="w-8 h-8 text-green-600" />,
    },
    {
      id: 4,
      title: "Safe & Secure Payments",
      description: "Multiple payment methods with full encryption and trust.",
      icon: <ShieldCheck className="w-8 h-8 text-green-600" />,
    },
    {
      id: 5,
      title: "Live Order Tracking",
      description: "Know exactly where your order is, in real-time.",
      icon: <Truck className="w-8 h-8 text-green-600" />,
    },
    {
      id: 6,
      title: "24x7 Customer Support",
      description:
        "Our support team is always available to assist you instantly.",
      icon: <Headphones className="w-8 h-8 text-green-600" />,
    },
  ];

  return (
    <section className="px-6 py-16 bg-gradient-to-b from-white to-green-50">
      {/* Section Title */}
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-extrabold text-gray-800">
          Why Shop With <span className="text-green-600">Green Basket</span>?
        </h2>
        <p className="mt-3 text-gray-600 max-w-2xl mx-auto">
          Trusted by thousands, we make grocery shopping simple, fast, and
          affordable. Experience the future of instant delivery.
        </p>
      </div>

      {/* Features Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {features.map((feature) => (
          <div
            key={feature.id}
            className="bg-white rounded-2xl shadow-md hover:shadow-lg transition-all p-6 flex flex-col items-start border border-gray-100 hover:border-green-200"
          >
            <div className="mb-4 bg-green-100 p-3 rounded-xl">
              {feature.icon}
            </div>
            <h3 className="text-lg font-bold text-gray-800 mb-2">
              {feature.title}
            </h3>
            <p className="text-gray-600 text-sm">{feature.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default WhyShopWithUs;
