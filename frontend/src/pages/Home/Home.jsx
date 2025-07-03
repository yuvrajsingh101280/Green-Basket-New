import React, { useContext } from "react";
import { AppContext } from "../../context/AppContext";

const Home = () => {
  const { user, isAuthenticated } = useContext(AppContext);

  return <div></div>;
};

export default Home;
