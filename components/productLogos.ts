import { ANALYZE_PRODUCT_NAME } from '@/constants/products';

export interface ProductLogoConfig {
  image?: string;
}

const PRODUCT_LOGOS: Record<string, ProductLogoConfig> = {
  [ANALYZE_PRODUCT_NAME]: {
    image: '/product-logos/analyze-badge.png',
  },
  'Clear Contracts': {
    image: '/product-logos/clear-contracts-badge.png',
  },
};

export default PRODUCT_LOGOS;

