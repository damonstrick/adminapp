import PageHeader from '@/components/PageHeader';
import ProductsContent from '@/components/ProductsContent';

export default function ProductsPage() {
  return (
    <div className="w-full">
      <PageHeader 
        title="Products & Features" 
        description="Manage products and feature access"
      />
      <ProductsContent />
    </div>
  );
}

