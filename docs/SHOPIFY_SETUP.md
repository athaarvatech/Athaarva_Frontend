# Shopify Storefront Integration

This Next.js application integrates with Shopify's Storefront API to provide a complete headless ecommerce experience for medical equipment sales.

## Environment Setup

Create a `.env.local` file in the root directory with the following variables:

```env
# Shopify Configuration
NEXT_PUBLIC_SHOPIFY_DOMAIN=your-store.myshopify.com
NEXT_PUBLIC_STOREFRONT_TOKEN=your-storefront-access-token
```

### Getting Your Shopify Credentials

1. **Shopify Domain**: Your store's myshopify.com domain (e.g., `mystore.myshopify.com`)
2. **Storefront Access Token**: 
   - Go to your Shopify admin
   - Navigate to Apps > Manage private apps (or create a custom app)
   - Enable Storefront API access
   - Copy the generated Storefront access token

## Features

- ✅ **Product Catalog**: Real-time product listing from Shopify
- ✅ **Product Details**: Individual product pages with images, variants, and options
- ✅ **Search**: Live product search with debouncing
- ✅ **Cart Management**: Full cart operations (add, update, remove) with Shopify Cart API
- ✅ **Checkout**: Redirect to Shopify-hosted checkout
- ✅ **Responsive Design**: Mobile-first design with Tailwind CSS
- ✅ **TypeScript**: Fully typed Shopify GraphQL responses

## API Usage

The integration uses Shopify's Storefront API v2025-07 with the following GraphQL operations:

- `PRODUCTS_QUERY`: Fetch products with filtering and pagination
- `PRODUCT_BY_HANDLE`: Get individual product details
- `SEARCH_PRODUCTS`: Search products by query string
- Cart mutations: `cartCreate`, `cartLinesAdd`, `cartLinesUpdate`, `cartLinesRemove`

## Quick Start

```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your Shopify credentials

# Run development server
npm run dev
```

Visit `http://localhost:3000/ecommerce` to see the storefront in action.

## Security Notes

- Only the **public Storefront token** is used on the client-side
- No admin or private tokens are exposed
- All cart operations use Shopify's secure Cart API
- Customer authentication can be added later via server-side implementation
