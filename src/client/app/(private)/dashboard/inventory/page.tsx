"use client";
import { useState } from "react";
import {
  useGetAllVariantsQuery,
  useRestockVariantMutation,
} from "@/app/store/apis/VariantApi";
import Table from "@/app/components/layout/Table";
import { History, Plus } from "lucide-react";
import useToast from "@/app/hooks/ui/useToast";
import RestockModal from "./RestockModal";
import RestockHistoryModal from "./RestockHistoryModal";
import { withAuth } from "@/app/components/HOC/WithAuth";

interface Variant {
  id: string;
  productId: string;
  sku: string;
  price: number;
  stock: number;
  lowStockThreshold?: number;
  barcode?: string;
  warehouseLocation?: string;
  attributes: Array<{
    attributeId: string;
    valueId: string;
    attribute: { id: string; name: string; slug: string };
    value: { id: string; value: string; slug: string };
  }>;
  product: { id: string; name: string };
}

const InventoryDashboard = () => {
  const { showToast } = useToast();
  const [isRestockModalOpen, setIsRestockModalOpen] = useState(false);
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
  const [selectedVariant, setSelectedVariant] = useState<Variant | null>(null);
  const { data, isLoading } = useGetAllVariantsQuery({});
  console.log("data: ", data);
  const [restockVariant, { isLoading: isRestocking }] =
    useRestockVariantMutation();
  const variants = data?.variants || [];
  console.log("variants: ", variants);

  const handleRestock = async (
    variantId: string,
    data: { quantity: number; notes?: string }
  ) => {
    try {
      await restockVariant({ id: variantId, data }).unwrap();
      setIsRestockModalOpen(false);
      setSelectedVariant(null);
      showToast("Variant restocked successfully", "success");
    } catch (err) {
      console.error("Failed to restock variant:", err);
      showToast("Failed to restock variant", "error");
    }
  };

  const columns = [
    {
      key: "productName",
      label: "Product",
      sortable: true,
      render: (row: Variant) => <span>{row.product.name}</span>,
    },
    {
      key: "sku",
      label: "SKU",
      sortable: true,
      render: (row: Variant) => <span>{row.sku}</span>,
    },
    {
      key: "attributes",
      label: "Attributes",
      sortable: false,
      render: (row: Variant) => (
        <div>
          {row.attributes.map((attr) => (
            <span
              key={attr.attributeId}
              className="inline-block mr-2 bg-gray-100 px-2 py-1 rounded"
            >
              {attr.attribute.name}: {attr.value.value}
            </span>
          ))}
        </div>
      ),
    },
    {
      key: "stock",
      label: "Stock",
      sortable: true,
      render: (row: Variant) => (
        <span
          className={
            row.stock <= (row.lowStockThreshold || 10)
              ? "text-red-600 font-medium"
              : ""
          }
        >
          {row.stock}
        </span>
      ),
    },
    {
      key: "lowStockThreshold",
      label: "Low Stock Threshold",
      sortable: true,
      render: (row: Variant) => <span>{row.lowStockThreshold || 10}</span>,
    },
    {
      key: "warehouseLocation",
      label: "Warehouse Location",
      sortable: true,
      render: (row: Variant) => <span>{row.warehouseLocation || "N/A"}</span>,
    },
    {
      key: "status",
      label: "Status",
      sortable: false,
      render: (row: Variant) => (
        <span
          className={`inline-block px-2 py-1 rounded text-xs font-medium ${
            row.stock <= (row.lowStockThreshold || 10)
              ? "bg-red-100 text-red-600"
              : "bg-green-100 text-green-600"
          }`}
        >
          {row.stock <= (row.lowStockThreshold || 10)
            ? "Low Stock"
            : "In Stock"}
        </span>
      ),
    },
    {
      key: "actions",
      label: "Actions",
      render: (row: Variant) => (
        <div className="flex space-x-2">
          <button
            onClick={() => {
              setSelectedVariant(row);
              setIsRestockModalOpen(true);
            }}
            className="text-blue-600 hover:text-blue-800 flex items-center gap-1"
            disabled={isRestocking}
          >
            <Plus size={16} />
            Restock
          </button>
          <button
            onClick={() => {
              setSelectedVariant(row);
              setIsHistoryModalOpen(true);
            }}
            className="text-gray-600 hover:text-gray-800 flex items-center gap-1"
          >
            <History size={16} />
            History
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h1 className="text-xl font-semibold">Inventory Dashboard</h1>
          <p className="text-sm text-gray-500">
            Manage variant stock and restock history
          </p>
        </div>
      </div>

      <Table
        data={variants}
        columns={columns}
        isLoading={isLoading}
        emptyMessage="No variants available"
        totalPages={data?.totalPages}
        totalResults={data?.totalResults}
        resultsPerPage={data?.resultsPerPage}
        currentPage={data?.currentPage}
      />

      <RestockModal
        isOpen={isRestockModalOpen}
        onClose={() => {
          setIsRestockModalOpen(false);
          setSelectedVariant(null);
        }}
        onSubmit={handleRestock}
        variant={selectedVariant}
        isLoading={isRestocking}
      />

      <RestockHistoryModal
        isOpen={isHistoryModalOpen}
        onClose={() => {
          setIsHistoryModalOpen(false);
          setSelectedVariant(null);
        }}
        variantId={selectedVariant?.id}
      />
    </div>
  );
};

export default withAuth(InventoryDashboard);
