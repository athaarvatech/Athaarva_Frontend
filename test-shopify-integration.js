// Test file to verify Shopify integration
// This is a simple test that can be run to verify the integration

console.log('🚀 Testing Shopify Storefront API Integration...\n');

// Check configuration
console.log('📋 Configuration Check:');
console.log(`Domain: ${process.env.NEXT_PUBLIC_SHOPIFY_DOMAIN || 'NOT SET'}`);
console.log(`Token: ${process.env.NEXT_PUBLIC_STOREFRONT_TOKEN ? 'SET (hidden)' : 'NOT SET'}`);

if (!process.env.NEXT_PUBLIC_SHOPIFY_DOMAIN || !process.env.NEXT_PUBLIC_STOREFRONT_TOKEN) {
  console.log('❌ Shopify is not properly configured. Please check your environment variables.');
  console.log('Required variables:');
  console.log('- NEXT_PUBLIC_SHOPIFY_DOMAIN=your-store.myshopify.com');
  console.log('- NEXT_PUBLIC_STOREFRONT_TOKEN=your-storefront-access-token');
  console.log('\nCreate a .env.local file with these variables to get started.');
} else {
  console.log('✅ Environment variables are configured!');
  console.log('\n📝 Next steps:');
  console.log('1. Start your development server: npm run dev');
  console.log('2. Visit http://localhost:3000/ecommerce');
  console.log('3. Test the complete user flow: browse → search → add to cart → checkout');
}
