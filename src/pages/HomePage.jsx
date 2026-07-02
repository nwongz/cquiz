import { useState } from 'react';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import Features from '../components/Features';
import CategorySection from '../components/CategorySection';
import GameGrid from '../components/GameGrid';
import About from '../components/About';
import Footer from '../components/Footer';
import { games, categories } from '../data/games';

export default function HomePage() {
  const [activeCategory, setActiveCategory] = useState('all');

  return (
    <>
      <Navbar />
      <Hero />
      <Features />
      <CategorySection
        categories={categories}
        activeCategory={activeCategory}
        onSelect={setActiveCategory}
      />
      <GameGrid
        games={games}
        categories={categories}
        activeCategory={activeCategory}
        onCategoryChange={setActiveCategory}
      />
      <About />
      <Footer />
    </>
  );
}
