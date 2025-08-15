"use client";

import { ArrowUpRight } from "lucide-react";
import { Item } from "../organisms/ListCard";
import Link from "next/link";
import Image from "next/image";
import {
  generateProductPlaceholder,
  generateUserAvatar,
} from "@/app/utils/placeholderImage";

interface ListItemProps {
  item: Item;
  itemType: "product" | "user";
}

const ListItem: React.FC<ListItemProps> = ({ item, itemType }) => {
  const getItemLink = () => {
    if (itemType === "product") {
      const slug = item.slug;

      return `/product/${slug}`;
    } else {
      return `/user/${item.id}`;
    }
  };

  return (
    <Link
      href={getItemLink()}
      className="flex items-center justify-between py-3 px-2 rounded-lg transition-all duration-200 hover:bg-gray-50 hover:shadow-md cursor-pointer group"
    >
      <div className="flex items-center space-x-3">
        {item.image ? (
          <Image
            src={item.image}
            alt={item.name}
            width={40}
            height={40}
            className={itemType === "user" ? "rounded-full" : "rounded-md"}
            onError={(e) => {
              e.currentTarget.src =
                itemType === "user"
                  ? generateUserAvatar(item.name)
                  : generateProductPlaceholder(item.name);
            }}
          />
        ) : (
          <div
            className={`w-10 h-10 bg-gray-200 ${
              itemType === "user" ? "rounded-full" : "rounded-md"
            }`}
          />
        )}
        <div>
          <h3 className="font-medium text-sm text-gray-700 group-hover:text-blue-600 transition-colors duration-200">
            {item.name}
          </h3>
          <p className="text-xs text-gray-400">{item.subtitle}</p>
        </div>
      </div>

      <div className="text-sm font-medium text-gray-600">
        {item.primaryInfo}
      </div>

      <div className="flex items-center space-x-3">
        <span className="text-sm text-gray-400">{item.secondaryInfo}</span>
        <span className="p-1 text-gray-400 group-hover:text-blue-500 group-hover:bg-blue-50 rounded-full transition-all duration-200 transform group-hover:rotate-45">
          <ArrowUpRight size={16} />
        </span>
      </div>
    </Link>
  );
};

export default ListItem;
