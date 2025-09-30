import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import ProductDetailClient from './ProductDetailClient';
import { ProductService } from '../../lib/products';

interface ProductPageProps {
  params: {
    handle: string;
  };
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  try {
    const product = await ProductService.getProductByHandle(params.handle);
    
    if (!product) {
      return {
        title: 'Product Not Found | Athaarva Medical',
      };
    }

    return {
      title: `${product.title} | Athaarva Medical`,
      description: product.description,
      openGraph: {
        title: product.title,
        description: product.description,
        images: product.featuredImage ? [product.featuredImage.url] : [],
      },
    };
  } catch (error) {
    return {
      title: 'Product | Athaarva Medical',
    };
  }
}

export default async function ProductPage({ params }: ProductPageProps) {
  try {
    const product = await ProductService.getProductByHandle(params.handle);

    if (!product) {
      notFound();
    }

    return <ProductDetailClient product={product} />;
  } catch (error) {
    console.error('Error loading product:', error);
    notFound();
  }
}
