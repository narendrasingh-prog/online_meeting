"use client";
import React from "react";

import { sidebarLink } from "@/constants";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";
import Image from "next/image";

const Sidebar = () => {
  const pathname = usePathname();
 
  return (
    <section className="sticky h-screen flex flex-col left-0 top-0 justify-between bg-gray-800 p-6 pt-20 max-sm:hidden lg:w-[264px]">
      <div className="flex flex-1 flex-col gap-6 ">
       
        {sidebarLink.map((link) => {
          const isActive =
            pathname === link.route || pathname.startsWith(`${link.route}/`);
          return (
            <Link
              href={link.route}
              key={link.label}
              className={cn("flex gap-6 rounded-lg justify-start p-3", {
                "bg-blue-600": isActive,
              })}
            >
              <Image
            src={link.imgUrl}
            alt={link.label}
            width={24}
            height={24}/>
            <p className="text-lg font-semibold max-lg:hidden">{link.label}</p>

            </Link>
            
          );
        })}
      </div>
    </section>
  );
};

export default Sidebar;
