/**
 * Shopify Storefront API Client
 * Provides typed GraphQL client for Shopify Storefront API
 */

// Types for Shopify GraphQL responses
export interface ShopifyProduct {
  id: string;
  handle: string;
  title: string;
  description: string;
  featuredImage?: {
    url: string;
    altText?: string;
  };
  images: {
    edges: Array<{
      node: {
        url: string;
        altText?: string;
      };
    }>;
  };
  priceRange: {
    minVariantPrice: {
      amount: string;
      currencyCode: string;
    };
  };
  variants: {
    edges: Array<{
      node: {
        id: string;
        title: string;
        price: {
          amount: string;
          currencyCode: string;
        };
        availableForSale: boolean;
        selectedOptions: Array<{
          name: string;
          value: string;
        }>;
      };
    }>;
  };
  options: Array<{
    name: string;
    values: string[];
  }>;
  productType: string;
  tags: string[];
}

export interface ShopifyCart {
  id: string;
  checkoutUrl: string;
  totalQuantity: number;
  cost: {
    totalAmount: {
      amount: string;
      currencyCode: string;
    };
    subtotalAmount: {
      amount: string;
      currencyCode: string;
    };
  };
  lines: {
    edges: Array<{
      node: {
        id: string;
        quantity: number;
        merchandise: {
          id: string;
          title: string;
          product: {
            id: string;
            title: string;
            handle: string;
            featuredImage?: {
              url: string;
              altText?: string;
            };
          };
          price: {
            amount: string;
            currencyCode: string;
          };
        };
      };
    }>;
  };
}

export interface ShopifyCartLine {
  id: string;
  quantity: number;
  merchandise: {
    id: string;
    title: string;
    product: {
      id: string;
      title: string;
      handle: string;
      featuredImage?: {
        url: string;
        altText?: string;
      };
    };
    price: {
      amount: string;
      currencyCode: string;
    };
  };
}

// GraphQL Error types
interface GraphQLError {
  message: string;
  locations?: Array<{
    line: number;
    column: number;
  }>;
  path?: string[];
}

interface ShopifyGraphQLResponse<T> {
  data?: T;
  errors?: GraphQLError[];
}

/**
 * Shopify Storefront API client
 */
class ShopifyStorefront {
  private domain: string;
  private storefrontToken: string;
  private apiVersion: string;

  constructor() {
    this.domain = process.env.NEXT_PUBLIC_SHOPIFY_DOMAIN || "";
    this.storefrontToken = process.env.NEXT_PUBLIC_STOREFRONT_TOKEN || "";
    this.apiVersion = "2025-07";

    if (!this.domain || !this.storefrontToken) {
      console.warn("Shopify domain or storefront token not configured");
    }
  }

  /**
   * Make a GraphQL request to Shopify Storefront API
   */
  async sfFetch<T>(
    query: string,
    variables: Record<string, unknown> = {}
  ): Promise<T> {
    if (!this.domain || !this.storefrontToken) {
      throw new Error("Shopify domain and storefront token must be configured");
    }

    const url = `https://${this.domain}/api/${this.apiVersion}/graphql.json`;

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Shopify-Storefront-Access-Token": this.storefrontToken,
        },
        body: JSON.stringify({
          query,
          variables,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result: ShopifyGraphQLResponse<T> = await response.json();

      if (result.errors) {
        console.error("GraphQL errors:", result.errors);
        throw new Error(`GraphQL error: ${result.errors[0]?.message}`);
      }

      if (!result.data) {
        throw new Error("No data returned from GraphQL query");
      }

      return result.data;
    } catch (error) {
      console.error("Shopify API request failed:", error);
      throw error;
    }
  }

  /**
   * Check if Shopify is properly configured
   */
  isConfigured(): boolean {
    return !!(this.domain && this.storefrontToken);
  }

  /**
   * Get the configured domain
   */
  getDomain(): string {
    return this.domain;
  }
}

// Export singleton instance
export const shopify = new ShopifyStorefront();

// Helper function for easier imports
export const sfFetch = <T>(
  query: string,
  variables?: Record<string, unknown>
) => shopify.sfFetch<T>(query, variables);
