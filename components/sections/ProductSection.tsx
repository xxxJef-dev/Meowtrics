"use client";
import { ProductInfo } from "@/types/calculator";
import SectionCard from "@/components/ui/SectionCard";
import InputField from "@/components/ui/InputField";

/**
 * ProductSection — product name and material type inputs.
 * Always visible, no toggle.
 */
interface ProductSectionProps {
  product: ProductInfo;
  onChange: (updates: Partial<ProductInfo>) => void;
}

export default function ProductSection({
  product,
  onChange,
}: ProductSectionProps) {
  return (
    <SectionCard icon="🏷️" title="Product Setup">
      <InputField
        label="Product Name"
        tooltip="Give this calculation a name"
        value={product.productName}
        onChange={(v) => onChange({ productName: v })}
        type="text"
      />
      <InputField
        label="Material Type"
        tooltip="e.g. Glossy Paper, Matte Vinyl, Clear Sticker"
        value={product.materialType}
        onChange={(v) => onChange({ materialType: v })}
        type="text"
      />
    </SectionCard>
  );
}
