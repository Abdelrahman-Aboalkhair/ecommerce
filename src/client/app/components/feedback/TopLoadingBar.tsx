"use client";
import { useEffect, useState } from "react";
import NProgress from "nprogress";
import { usePathname } from "next/navigation";

const TopLoadingBar: React.FC = () => {
  const pathname = usePathname();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    NProgress.configure({ showSpinner: false, speed: 400, minimum: 0.2 });

    // Simulate route change start
    setIsLoading(true);
    console.log("Route change started to:", pathname);
    NProgress.start();

    // Simulate route change complete after a delay
    const timer = setTimeout(() => {
      setIsLoading(false);
      console.log("Route change completed to:", pathname);
      NProgress.done();
    }, 400); // Match NProgress speed

    return () => {
      clearTimeout(timer);
      NProgress.done();
    };
  }, [pathname]);

  return null;
};

export default TopLoadingBar;
