import React, { useContext } from "react";
import { AppContext } from "../../context/AppContext";
import HeroSection from "../../components/HeroSection";
import CategorySection from "../../components/CategorySection";

const Home = () => {
  const { user, isAuthenticated } = useContext(AppContext);

  return (
    <div>
      <HeroSection />
      <CategorySection />
    </div>
  );
};

export default Home;
