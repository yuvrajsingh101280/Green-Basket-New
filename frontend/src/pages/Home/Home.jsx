import React, { useContext } from "react";
import { AppContext } from "../../context/AppContext";
import HeroSection from "../../components/home/HeroSection";
import CategorySection from "../../components/home/CategorySection";
import FeaturedProductsSection from "../../components/home/FeaturedProductsSection";
import PromoBannerSection from "../../components/home/PromoBannerSection";
import PopularNearYouSection from "../../components/home/PopularNearYouSection";
import WhyShopWithUs from "../../components/home/WhyShopWithUs ";
import TopBrandsSection from "../../components/home/TopBrandsSection";
import FlashSaleSection from "../../components/home/FlashSaleSection";
import RecommendedProductsSection from "../../components/home/recommendedProducts";
import TrendingProductsSection from "../../components/home/TrendingProductsSection";
import TestimonialsSection from "../../components/home/TestimonialsSection";
import DownloadAppSection from "../../components/home/DownloadAppSection";
// import DailyEssentialsSection from "../../components/home/DailyEssentialsSection";?

const Home = () => {
  const { user, isAuthenticated } = useContext(AppContext);

  return (
    <div>
      <HeroSection />
      <CategorySection />
      <FeaturedProductsSection />
      <PromoBannerSection />
      <PopularNearYouSection />
      <WhyShopWithUs />
      <TopBrandsSection />
      <FlashSaleSection />
      <RecommendedProductsSection />
      <TrendingProductsSection />
      {/* <DailyEssentialsSection /> */}
      <TestimonialsSection />
      <DownloadAppSection />
    </div>
  );
};

export default Home;
