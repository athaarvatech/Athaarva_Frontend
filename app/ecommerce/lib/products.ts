/**
 * Product services for Shopify integration
 */

import { sfFetch } from './shopify';
import {
  PRODUCTS_QUERY,
  PRODUCT_BY_HANDLE,
  SEARCH_PRODUCTS,
  COLLECTIONS_QUERY,
  ProductsQueryResponse,
  ProductByHandleResponse,
  SearchProductsResponse,
  CollectionsQueryResponse,
} from './queries';
import type { ShopifyProduct } from './shopify';

export interface ProductFilters {
  sortKey?: 'TITLE' | 'PRICE' | 'CREATED_AT' | 'UPDATED_AT' | 'BEST_SELLING' | 'RELEVANCE';
  reverse?: boolean;
  first?: number;
  after?: string;
  query?: string;
}

export interface ProductSearchOptions {
  query: string;
  first?: number;
  after?: string;
}

export interface Collection {
  id: string;
  handle: string;
  title: string;
  description: string;
  image?: {
    url: string;
    altText?: string;
  };
}

/**
 * Product service class for managing Shopify products
 */
export class ProductService {
  /**
   * Get all products with optional filters
   */
  static async getProducts(filters: ProductFilters = {}): Promise<{
    products: ShopifyProduct[];
    pageInfo: {
      hasNextPage: boolean;
      hasPreviousPage: boolean;
      startCursor: string;
      endCursor: string;
    };
  }> {
    const {
      sortKey = 'CREATED_AT',
      reverse = true,
      first = 20,
      after,
      query,
    } = filters;

    try {
      const response = await sfFetch<ProductsQueryResponse>(PRODUCTS_QUERY, {
        first,
        after,
        query,
        sortKey,
        reverse,
      });

      return {
        products: response.products.edges.map(edge => edge.node),
        pageInfo: response.products.pageInfo,
      };
    } catch (error) {
      console.error('Error fetching products:', error);
      throw new Error('Failed to fetch products');
    }
  }

  /**
   * Get a single product by handle
   */
  static async getProductByHandle(handle: string): Promise<ShopifyProduct | null> {
    try {
      const response = await sfFetch<ProductByHandleResponse>(PRODUCT_BY_HANDLE, {
        handle,
      });

      return response.productByHandle;
    } catch (error) {
      console.error('Error fetching product by handle:', error);
      throw new Error('Failed to fetch product');
    }
  }

  /**
   * Search products by query
   */
  static async searchProducts(options: ProductSearchOptions): Promise<{
    products: ShopifyProduct[];
    pageInfo: {
      hasNextPage: boolean;
      hasPreviousPage: boolean;
      startCursor: string;
      endCursor: string;
    };
  }> {
    const { query, first = 20, after } = options;

    try {
      const response = await sfFetch<SearchProductsResponse>(SEARCH_PRODUCTS, {
        query,
        first,
        after,
      });

      return {
        products: response.products.edges.map(edge => edge.node),
        pageInfo: response.products.pageInfo,
      };
    } catch (error) {
      console.error('Error searching products:', error);
      throw new Error('Failed to search products');
    }
  }

  /**
   * Get collections
   */
  static async getCollections(first = 10): Promise<Collection[]> {
    try {
      const response = await sfFetch<CollectionsQueryResponse>(COLLECTIONS_QUERY, {
        first,
      });

      return response.collections.edges.map(edge => edge.node);
    } catch (error) {
      console.error('Error fetching collections:', error);
      throw new Error('Failed to fetch collections');
    }
  }

  /**
   * Get featured products (first 8 products sorted by best selling)
   */
  static async getFeaturedProducts(): Promise<ShopifyProduct[]> {
    try {
      const response = await this.getProducts({
        sortKey: 'BEST_SELLING',
        reverse: false,
        first: 8,
      });

      return response.products;
    } catch (error) {
      console.error('Error fetching featured products:', error);
      return [];
    }
  }

  /**
   * Convert Shopify product to legacy format for backward compatibility
   */
  static convertToLegacyProduct(shopifyProduct: ShopifyProduct): {
    id: string;
    name: string;
    image: string;
    specs: string[];
    price: number;
    originalPrice?: number;
    category: string;
    brand?: string;
    inStock: boolean;
    minOrderQty?: number;
  } {
    const variant = shopifyProduct.variants.edges[0]?.node;
    const price = variant ? parseFloat(variant.price.amount) : parseFloat(shopifyProduct.priceRange.minVariantPrice.amount);

    return {
      id: shopifyProduct.id,
      name: shopifyProduct.title,
      image: shopifyProduct.featuredImage?.url || '',
      specs: shopifyProduct.tags,
      price,
      category: shopifyProduct.productType || 'General',
      inStock: variant ? variant.availableForSale : true,
    };
  }

  /**
   * Get product variants for selection
   */
  static getProductVariants(product: ShopifyProduct) {
    return product.variants.edges.map(edge => ({
      id: edge.node.id,
      title: edge.node.title,
      price: parseFloat(edge.node.price.amount),
      currencyCode: edge.node.price.currencyCode,
      availableForSale: edge.node.availableForSale,
      selectedOptions: edge.node.selectedOptions,
    }));
  }

  /**
   * Get product images
   */
  static getProductImages(product: ShopifyProduct) {
    return product.images.edges.map(edge => ({
      url: edge.node.url,
      altText: edge.node.altText,
    }));
  }

  /**
   * Format price for display
   */
  static formatPrice(amount: string | number, currencyCode = 'INR'): string {
    const price = typeof amount === 'string' ? parseFloat(amount) : amount;
    const symbol = currencyCode === 'INR' ? '₹' : currencyCode;
    return `${symbol}${price.toLocaleString()}`;
  }
}
