import React from "react";
import FeaturesShowcase from "../components/FeatureShowCase";
import Hero from '../components/Hero'
const Home = () => {
  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-100 to-white">
      <Hero/>
      <FeaturesShowcase />
    </main>
  );
};

export default Home;
