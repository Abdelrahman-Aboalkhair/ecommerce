"use client";

import { useParams } from "next/navigation";
import MainLayout from "@/app/components/templates/MainLayout";
import ShippingAddressCard from "../ShippingAddressCard";
import OrderSummary from "../OrderSummary";
import OrderStatus from "../OrderStatus";
import OrderItems from "../OrderItems";
import { useGetOrderQuery } from "@/app/store/apis/OrderApi";
import CustomLoader from "@/app/components/feedback/CustomLoader";

const OrderTrackingPage = () => {
  const { orderId } = useParams();
  const { data, isLoading, error } = useGetOrderQuery(orderId);
  const order = data?.order;
  console.log("order: ", order);

  if (isLoading) {
    return (
      <MainLayout>
        <CustomLoader />
      </MainLayout>
    );
  }
  if (error || !order)
    return <div>Error loading order or order not found.</div>;

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <OrderItems order={order} />

          <div className="col-span-2 space-y-6">
            <OrderStatus order={order} />

            <OrderSummary order={order} />
          </div>

          <ShippingAddressCard order={order} />
        </div>
      </div>
    </MainLayout>
  );
};

export default OrderTrackingPage;
