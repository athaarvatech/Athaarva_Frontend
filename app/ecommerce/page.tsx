"use client";

import React from "react";
import Header from "./components/Header";
import Hero from "./components/Hero";
import CategoriesBar from "./components/CategoriesBar";
import ProductCatalog from "./components/ProductCatalog";
import FeaturedProducts from "./components/FeaturedProducts";
import CartSidebar from "./components/CartSidebar";
import B2BValueBlock from "./components/B2BValueBlock";
import ContactRFQ from "./components/ContactRFQ";
import Footer from "./components/Footer";
import { CartProvider } from "./contexts/CartContext";

export default function EcommercePage() {
  return (
    <CartProvider>
      <div className="min-h-screen bg-white">
        <Header />
        <main>
          <Hero />
          <CategoriesBar />
          <ProductCatalog />
          <FeaturedProducts />
          <B2BValueBlock />
          <ContactRFQ />
        </main>
        <Footer />
        <CartSidebar />
      </div>
    </CartProvider>
  );
}
