import { isDemoMode } from "@/app/lib/demo";

export function isDemoCatalogForced(): boolean {
  return (
    isDemoMode() || process.env.NEXT_PUBLIC_USE_DEMO_CATALOG === "true"
  );
}

export function shouldUseDemoCatalog(hasError: boolean): boolean {
  return isDemoCatalogForced() || hasError;
}
