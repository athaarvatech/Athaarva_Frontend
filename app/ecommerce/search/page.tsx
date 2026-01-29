import { Suspense } from "react";
import SearchResults from "./SearchResults";
import { CartProvider } from "../contexts/CartContext";
import { SearchProvider } from "../contexts/SearchContext";

export default function SearchPage() {
  return (
    <CartProvider>
      <SearchProvider>
        <div className="min-h-screen bg-gray-50">
          <Suspense fallback={<div>Loading search results...</div>}>
            <SearchResults />
          </Suspense>
        </div>
      </SearchProvider>
    </CartProvider>
  );
}
