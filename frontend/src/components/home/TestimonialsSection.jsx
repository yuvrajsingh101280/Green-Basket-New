import React from "react";
import Slider from "react-slick";
import { Star } from "lucide-react";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

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
  {
    id: 5,
    name: "Sanya Malhotra",
    avatar: "https://randomuser.me/api/portraits/women/68.jpg",
    rating: 5,
    message:
      "The flash deals are amazing! Always find the products I need at great prices.",
  },
];

const TestimonialsSection = () => {
  const settings = {
    dots: false,
    infinite: true,
    speed: 1000,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3500,
    pauseOnHover: true,
    responsive: [
      {
        breakpoint: 1024,
        settings: { slidesToShow: 2 },
      },
      {
        breakpoint: 640,
        settings: { slidesToShow: 1 },
      },
    ],
  };

  return (
    <section className="relative px-6 py-16 bg-gradient-to-r from-[#eaf3e8] via-white to-[#f0f9e9] overflow-hidden">
      {/* Floating decorative stars */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <Star className="absolute w-6 h-6 text-[#c99443] top-10 left-10 animate-pulse" />
        <Star className="absolute w-8 h-8 text-[#c86404] top-20 right-16 animate-bounce" />
        <Star className="absolute w-5 h-5 text-[#6b591d] bottom-12 left-1/4 animate-ping" />
        <Star className="absolute w-7 h-7 text-[#c99443] bottom-20 right-1/3 animate-pulse" />
      </div>

      <h2 className="text-3xl sm:text-4xl font-extrabold text-[#2a6d1b] text-center mb-12 relative z-10">
        What Our Customers Say
      </h2>

      <div className="relative z-10">
        <Slider {...settings}>
          {testimonials.map((testimonial) => (
            <div key={testimonial.id} className="px-3">
              <div className="bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 p-6 flex flex-col h-full border border-[#e5e5e5] hover:-translate-y-2">
                {/* Avatar + Name */}
                <div className="flex items-center gap-4 mb-4">
                  <img
                    src={testimonial.avatar}
                    alt={testimonial.name}
                    className="w-14 h-14 rounded-full object-cover border-2 border-[#2a6d1b] shadow-sm"
                  />
                  <div>
                    <h4 className="font-semibold text-[#135e07]">
                      {testimonial.name}
                    </h4>
                    <div className="flex items-center mt-1">
                      {Array.from({ length: testimonial.rating }).map(
                        (_, idx) => (
                          <Star key={idx} className="w-4 h-4 text-[#c99443]" />
                        )
                      )}
                      {Array.from({ length: 5 - testimonial.rating }).map(
                        (_, idx) => (
                          <Star key={idx} className="w-4 h-4 text-gray-300" />
                        )
                      )}
                    </div>
                  </div>
                </div>

                {/* Message */}
                <p className="text-gray-700 text-sm sm:text-base leading-relaxed line-clamp-4 flex-grow">
                  "{testimonial.message}"
                </p>

                {/* Verified Badge */}
                <span className="mt-4 inline-block bg-[#5c9c3c] text-white text-xs font-semibold px-3 py-1 rounded-full self-start">
                  ✅ Verified Buyer
                </span>
              </div>
            </div>
          ))}
        </Slider>
      </div>
    </section>
  );
};

export default TestimonialsSection;
