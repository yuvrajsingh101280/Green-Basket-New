import React, { useContext } from "react";
import { AppContext } from "../../context/AppContext";
import HeroSection from "../../components/HeroSection";

const Home = () => {
  const { user, isAuthenticated } = useContext(AppContext);

  return <div>sdd</div>;
};

export default Home;
