"use client";

import { MessageCircleOff } from "lucide-react";
import MainLayout from "@/app/components/templates/MainLayout";

interface DemoFeatureUnavailableProps {
  featureName?: string;
  useDashboardLayout?: boolean;
}

export default function DemoFeatureUnavailable({
  featureName = "Live chat",
  useDashboardLayout = false,
}: DemoFeatureUnavailableProps) {
  const content = (
    <div className="mx-auto flex max-w-lg flex-col items-center justify-center px-4 py-16 text-center">
      <MessageCircleOff className="mb-4 h-12 w-12 text-amber-600" aria-hidden />
      <h1 className="text-xl font-semibold text-gray-900">{featureName} unavailable</h1>
      <p className="mt-3 text-sm leading-relaxed text-gray-600">
        Real-time chat requires a running backend and Socket.IO server. This
        interactive demo uses simulated data only — browse other areas or run the
        project locally for the full chat experience.
      </p>
    </div>
  );

  if (useDashboardLayout) {
    return content;
  }

  return <MainLayout>{content}</MainLayout>;
}
