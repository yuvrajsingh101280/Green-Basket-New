import React from "react";
import { Star } from "lucide-react";

const testimonials = [
  {
    id: 1,
    name: "Ananya Sharma",
    avatar: "https://randomuser.me/api/portraits/women/65.jpg",
    rating: 5,
    message:
      "Amazing service! My groceries arrived fresh and on time. Highly recommend!",
  },
  {
    id: 2,
    name: "Rohit Verma",
    avatar: "https://randomuser.me/api/portraits/men/32.jpg",
    rating: 4,
    message:
      "Great deals and smooth checkout experience. The app is very user-friendly!",
  },
  {
    id: 3,
    name: "Priya Singh",
    avatar: "https://randomuser.me/api/portraits/women/44.jpg",
    rating: 5,
    message:
      "Love the daily essentials combos! Perfect for my family’s weekly groceries.",
  },
  {
    id: 4,
    name: "Arjun Kapoor",
    avatar: "https://randomuser.me/api/portraits/men/51.jpg",
    rating: 4,
    message:
      "Fast delivery and fresh products. Customer support is very helpful too!",
  },
];

const TestimonialsSection = () => {
  return (
    <section className="px-6 py-12 bg-gray-50">
      <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-800 text-center mb-10">
        What Our Customers Say
      </h2>

      <div className="flex gap-6 overflow-x-auto scrollbar-hide">
        {testimonials.map((testimonial) => (
          <div
            key={testimonial.id}
            className="min-w-[280px] md:min-w-[300px] bg-white rounded-3xl shadow-md hover:shadow-xl p-6 flex flex-col transition-transform transform hover:-translate-y-2 cursor-pointer"
          >
            {/* Avatar */}
            <div className="flex items-center gap-4 mb-4">
              <img
                src={testimonial.avatar}
                alt={testimonial.name}
                className="w-12 h-12 rounded-full object-cover border-2 border-green-600"
              />
              <div>
                <h4 className="font-semibold text-gray-800">
                  {testimonial.name}
                </h4>
                <div className="flex items-center mt-1">
                  {Array.from({ length: testimonial.rating }).map((_, idx) => (
                    <Star key={idx} className="w-4 h-4 text-yellow-400" />
                  ))}
                  {Array.from({ length: 5 - testimonial.rating }).map(
                    (_, idx) => (
                      <Star key={idx} className="w-4 h-4 text-gray-300" />
                    )
                  )}
                </div>
              </div>
            </div>

            {/* Message */}
            <p className="text-gray-600 text-sm sm:text-base line-clamp-4">
              "{testimonial.message}"
            </p>

            {/* Verified Badge */}
            <span className="mt-4 inline-block bg-green-100 text-green-700 text-xs font-semibold px-3 py-1 rounded-full self-start">
              Verified Buyer
            </span>
          </div>
        ))}
      </div>
    </section>
  );
};

export default TestimonialsSection;
