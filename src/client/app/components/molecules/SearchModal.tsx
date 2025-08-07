"use client";

import React from "react";
import {
  Search,
  X,
  ArrowRight,
  FileText,
  User,
  ShoppingCart,
  FolderOpen,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";

interface SearchResult {
  type: "product" | "category" | "user" | "transaction";
  id: string;
  title: string;
  description?: string;
}

interface SearchModalProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  query: string;
  setQuery: (query: string) => void;
  placeholder: string;
  searchResults: SearchResult[];
  isLoading: boolean;
  error: any;
}

// Centralized route configuration
const ROUTES = {
  transaction: (id: string) => `/transactions/${id}`,
  product: (id: string) => `/dashboard/products/${id}`,
  category: (id: string) => `/dashboard/categories/${id}`,
  user: (id: string) => `/dashboard/users/${id}`,
};

// Type icons mapping
const TYPE_ICONS = {
  transaction: <ShoppingCart size={16} />,
  product: <FileText size={16} />,
  category: <FolderOpen size={16} />,
  user: <User size={16} />,
};

const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  setIsOpen,
  query,
  setQuery,
  placeholder,
  searchResults,
  isLoading,
  error,
}) => {
  const router = useRouter();
  const handleResultClick = (result: SearchResult): void => {
    const route = ROUTES[result.type](result.id);
    router.push(route);
    setIsOpen(false);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-start justify-center z-50 p-4 pt-24 sm:pt-32"
          onClick={() => setIsOpen(false)}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: -20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: -20 }}
            transition={{
              duration: 0.2,
              type: "spring",
              stiffness: 350,
              damping: 25,
            }}
            className="bg-white rounded-xl shadow-xl w-full max-w-lg overflow-hidden border border-gray-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative flex items-center border-b border-gray-100">
              <Search className="absolute left-4 text-gray-400" size={18} />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={`&quot;${placeholder}&quot;`}
                className="w-full py-4 pl-12 pr-12 focus:outline-none text-gray-800 text-sm"
                autoFocus
              />
              <button
                onClick={() => setIsOpen(false)}
                className="absolute right-4 text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100 transition-colors"
                aria-label="Close search"
              >
                <X size={18} />
              </button>
            </div>

            <div className="max-h-96 overflow-y-auto overflow-x-hidden">
              {error ? (
                <div className="p-4 text-red-500 text-sm flex items-center gap-2">
                  <X size={16} className="flex-shrink-0" />
                  <span>Error: Unable to fetch results. Please try again.</span>
                </div>
              ) : isLoading ? (
                <div className="flex flex-col items-center justify-center py-8 text-gray-500 gap-2">
                  <div className="w-8 h-8 border-2 border-teal-500 border-t-transparent rounded-full animate-spin" />
                  <span className="text-sm">Searching...</span>
                </div>
              ) : !query ? (
                <div className="py-8 px-4">
                  <div className="text-center text-gray-500 text-sm">
                    <Search size={24} className="mx-auto mb-2 opacity-40" />
                    <p>Start typing to search across dashboard</p>
                  </div>
                  <div className="mt-6 grid grid-cols-2 gap-2">
                    {["Products", "Categories", "Users", "Transactions"].map(
                      (type) => (
                        <div
                          key={type}
                          className="p-3 bg-gray-50 rounded-lg text-sm flex items-center justify-between hover:bg-gray-100 cursor-pointer"
                        >
                          <span className="text-gray-700">{type}</span>
                          <ArrowRight size={14} className="text-gray-400" />
                        </div>
                      )
                    )}
                  </div>
                </div>
              ) : searchResults.length === 0 ? (
                <div className="py-12 text-center text-gray-500 text-sm">
                  <Search size={24} className="mx-auto mb-2 opacity-40" />
                  <p>No results found for &quot;{query}&quot;</p>
                </div>
              ) : (
                <div className="py-2">
                  {searchResults.map((result, index) => (
                    <motion.div
                      key={`${result.type}-${result.id}`}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.15, delay: index * 0.03 }}
                      className="px-4 py-3 hover:bg-gray-50 cursor-pointer transition-colors flex items-center justify-between gap-4 group"
                      onClick={() => handleResultClick(result)}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="flex-shrink-0 bg-gray-100 p-2 rounded-md text-gray-500 group-hover:bg-teal-100 group-hover:text-teal-600 transition-colors">
                          {TYPE_ICONS[result.type]}
                        </div>
                        <div className="truncate">
                          <p className="text-sm font-medium text-gray-800 truncate">
                            {result.title}
                          </p>
                          {result.description && (
                            <p className="text-xs text-gray-500 truncate">
                              {result.description}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-600 font-medium">
                          {result.type}
                        </span>
                        <ArrowRight
                          size={16}
                          className="text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity"
                        />
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            <div className="p-3 border-t border-gray-100 bg-gray-50 text-xs text-gray-500 flex items-center justify-between">
              <div className="flex gap-4">
                <span className="flex items-center gap-1">
                  <kbd className="px-1.5 py-0.5 bg-white border border-gray-200 rounded text-xs">
                    ↑
                  </kbd>
                  <kbd className="px-1.5 py-0.5 bg-white border border-gray-200 rounded text-xs">
                    ↓
                  </kbd>
                  navigate
                </span>
                <span className="flex items-center gap-1">
                  <kbd className="px-1.5 py-0.5 bg-white border border-gray-200 rounded text-xs">
                    ↵
                  </kbd>
                  select
                </span>
              </div>
              <span className="flex items-center gap-1">
                <kbd className="px-1.5 py-0.5 bg-white border border-gray-200 rounded text-xs">
                  Esc
                </kbd>
                close
              </span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SearchModal;
