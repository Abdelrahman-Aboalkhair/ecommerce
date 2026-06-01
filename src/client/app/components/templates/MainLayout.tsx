"use client";
import Footer from "../layout/Footer";
import Navbar from "../layout/Navbar";
import DemoCatalogBanner from "../feedback/DemoCatalogBanner";

export default function MainLayout({
  children,
  isDemoCatalog = false,
}: {
  children: React.ReactNode;
  isDemoCatalog?: boolean;
}) {
  return (
    <main className="flex flex-col min-h-screen w-full">
      <Navbar />
      {isDemoCatalog && <DemoCatalogBanner />}
      <div className="w-full px-4 sm:px-6 lg:px-8 xl:max-w-7xl xl:mx-auto">
        {children}
      </div>
      <Footer />
    </main>
  );
}
