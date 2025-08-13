"use client";
import { Controller, useForm } from "react-hook-form";
import { useState } from "react";
import { useQuery } from "@apollo/client";
import { Download } from "lucide-react";
import Dropdown from "@/app/components/molecules/Dropdown";
import DateRangePicker from "@/app/components/molecules/DateRangePicker";
import useFormatPrice from "@/app/hooks/ui/useFormatPrice";
import { useLazyExportAnalyticsQuery } from "@/app/store/apis/AnalyticsApi";
import { GET_ALL_ANALYTICS } from "@/app/gql/Dashboard";
import CustomLoader from "@/app/components/feedback/CustomLoader";
import StatisticsCard from "./StatisticsCard";
import Charts from "./Charts";
import Lists from "./Lists";

interface FormData {
  timePeriod: string;
  year?: string;
  startDate?: string;
  endDate?: string;
  useCustomRange: boolean;
}

const AnalyticsContent = () => {
  const { control, watch } = useForm<FormData>({
    defaultValues: {
      timePeriod: "allTime",
      useCustomRange: false,
      year: new Date().getFullYear().toString(),
    },
  });
  const formatPrice = useFormatPrice();

  const timePeriodOptions = [
    { label: "Last 7 Days", value: "last7days" },
    { label: "Last Month", value: "lastMonth" },
    { label: "Last Year", value: "lastYear" },
    { label: "All Time", value: "allTime" },
  ];

  const { timePeriod, year, startDate, endDate, useCustomRange } = watch();

  const queryParams = {
    timePeriod: timePeriod || "allTime",
    year: useCustomRange ? undefined : year ? parseInt(year, 10) : undefined,
    startDate: useCustomRange && startDate ? startDate : undefined,
    endDate: useCustomRange && endDate ? endDate : undefined,
  };

  const { data, loading, error } = useQuery(GET_ALL_ANALYTICS, {
    variables: { params: queryParams },
  });

  const [exportType, setExportType] = useState<string>("all");
  const [exportFormat, setExportFormat] = useState<string>("csv");

  console.log("Analytics data => ", data);
  console.log("error loading analytics => ", error);

  const minYear = data?.yearRange?.minYear || 2020;
  const maxYear = data?.yearRange?.maxYear || 2020;

  const yearOptions = Array.from({ length: maxYear - minYear + 1 }, (_, i) => ({
    label: (minYear + i).toString(),
    value: (minYear + i).toString(),
  }));

  const [, { isLoading: isExporting, error: exportError }] =
    useLazyExportAnalyticsQuery();

  console.log("export error => ", exportError);

  // const handleExport = async () => {
  //   try {
  //     await triggerExport({
  //       type: exportType || "overview",
  //       format: exportFormat || "csv",
  //       timePeriod: queryParams.timePeriod,
  //       year: queryParams.year,
  //       startDate: queryParams.startDate,
  //       endDate: queryParams.endDate,
  //     });
  //     if (exportData) {
  //       const mimeTypes = {
  //         csv: "text/csv",
  //         pdf: "application/pdf",
  //         xlsx: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  //       };
  //       const blob = new Blob([exportData], { type: mimeTypes[exportFormat] });
  //       const link = document.createElement("a");
  //       link.href = URL.createObjectURL(blob);
  //       link.download = `analytics_${exportType}_${exportFormat}_${new Date().toISOString()}.${exportFormat}`;
  //       link.click();
  //     }
  //   } catch (err) {
  //     console.error("Export failed:", err);
  //     alert("Failed to export data");
  //   }
  // };

  const handleExport = async () => {};

  if (loading) {
    return <CustomLoader />;
  }

  if (error) {
    console.error("GraphQL Error:", error);
    return <div>Error loading analytics data</div>;
  }

  const mostSoldProducts = {
    labels: data?.productPerformance?.slice(0, 10).map((p) => p.name) || [],
    data: data?.productPerformance?.slice(0, 10).map((p) => p.quantity) || [],
  };

  const salesByProduct = {
    categories: data?.productPerformance?.map((p) => p.name) || [],
    data: data?.productPerformance?.map((p) => p.revenue) || [],
  };

  const interactionByType = {
    labels: ["Views", "Clicks", "Others"],
    data: [
      data?.interactionAnalytics?.byType?.views || 0,
      data?.interactionAnalytics?.byType?.clicks || 0,
      data?.interactionAnalytics?.byType?.others || 0,
    ],
  };

  const topItems =
    data?.productPerformance?.slice(0, 10).map((p) => ({
      id: p.id,
      name: p.name,
      quantity: p.quantity,
      revenue: formatPrice(p.revenue),
    })) || [];

  const topUsers =
    data?.userAnalytics?.topUsers?.slice(0, 10).map((u) => ({
      id: u.id,
      name: u.name,
      email: u.email,
      orderCount: u.orderCount,
      totalSpent: formatPrice(u.totalSpent),
      engagementScore: u.engagementScore,
    })) || [];

  const mostViewedProducts =
    data?.interactionAnalytics?.mostViewedProducts?.slice(0, 10).map((p) => ({
      id: p.productId,
      name: p.productName,
      viewCount: p.viewCount,
    })) || [];

  const exportTypeOptions = [
    { label: "All Data", value: "all" },
    { label: "Overview", value: "overview" },
    { label: "Products", value: "products" },
    { label: "Users", value: "users" },
  ];

  const exportFormatOptions = [
    { label: "CSV", value: "csv" },
    { label: "PDF", value: "pdf" },
    { label: "XLSX", value: "xlsx" },
  ];

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Analytics Dashboard</h1>
        <div className="flex items-center gap-4">
          <Controller
            name="timePeriod"
            control={control}
            render={({ field }) => (
              <Dropdown
                onChange={field.onChange}
                options={timePeriodOptions}
                value={field.value}
                label="Time Period"
                className="min-w-[150px] max-w-[200px]"
              />
            )}
          />
          <Controller
            name="year"
            control={control}
            render={({ field }) => (
              <Dropdown
                onChange={field.onChange}
                options={yearOptions}
                value={field.value ?? "all"}
                label="Year"
                className="min-w-[150px] max-w-[200px]"
                disabled={useCustomRange}
              />
            )}
          />
          <DateRangePicker
            label="Custom Date Range"
            control={control}
            startName="startDate"
            endName="endDate"
          />
          <Dropdown
            options={exportTypeOptions}
            value={exportType}
            onChange={(value) => value !== null && setExportType(value)}
            label="Export Type"
            className="min-w-[150px] max-w-[200px]"
          />
          <Dropdown
            options={exportFormatOptions}
            value={exportFormat}
            onChange={(value) => setExportFormat(value ?? "")}
            label="Export Format"
            className="min-w-[150px] max-w-[200px]"
          />
          <button
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-blue-400"
            onClick={handleExport}
            disabled={isExporting}
          >
            <Download className="w-5 h-5" />
            {isExporting ? "Exporting..." : "Export"}
          </button>
        </div>
      </div>

      <StatisticsCard data={data} />

      <Charts
        data={data}
        mostSoldProducts={mostSoldProducts}
        interactionByType={interactionByType}
      />

      <Lists
        topItems={topItems}
        topUsers={topUsers}
        mostViewedProducts={mostViewedProducts}
        salesByProduct={salesByProduct}
      />
    </div>
  );
};

export default AnalyticsContent;
