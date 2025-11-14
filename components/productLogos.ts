export interface ProductLogoConfig {
  image: string;
  background: string;
  border: string;
}

const PRODUCT_LOGOS: Record<string, ProductLogoConfig> = {
  Analyze: {
    image: 'http://localhost:3845/assets/edda1c7748ffbc4d6687c85a64f5cf67242e91f6.svg',
    background: '#ffebe4',
    border: 'rgba(255, 122, 78, 0.2)',
  },
  'Clear Contracts': {
    image: 'http://localhost:3845/assets/6591b325e9592449c515b5999a4d7b5c65c4869d.svg',
    background: '#eff6e4',
    border: 'rgba(149, 197, 76, 0.25)',
  },
};

export default PRODUCT_LOGOS;

