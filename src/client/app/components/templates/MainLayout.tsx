"use client";
import Footer from "../layout/Footer";
import Navbar from "../layout/Navbar";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="flex flex-col min-h-screen w-full">
      <Navbar />
      <div className="w-full px-4 sm:px-6 lg:px-8 xl:max-w-7xl xl:mx-auto">
        {children}
      </div>
      <Footer />
    </main>
  );
}
