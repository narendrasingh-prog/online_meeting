"use client";

import Image from "next/image";
import Link from "next/link";
import MobileNav from "./MobileNav";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useRouter } from "next/navigation";
import { AuthService } from "@/services/AuthService";
import { toast } from "sonner";
import { useEffect } from "react";
import { subscribeToPush } from "@/lib/push/subscribe";
import { useAuth } from "@/contexts/AuthContext";

const Navbar = () => {
  const router = useRouter();
  const supabase = AuthService.Client();
  const { user } = useAuth();
  const handleLogout = async () => {
    const res = await supabase.signOut();
    if (res.error) {
      toast.error("something went wrong");
    } else {
      toast.success("Logout successfull");
      router.replace("/auth/login");
    }
  };

  useEffect(() => {
    if (typeof window === "undefined") return;

    if (!("Notification" in window)) {
      toast.error("Notifications not supported in this browser");
      return;
    }

    if (Notification.permission === "default") {
      Notification.requestPermission().then(async (permission) => {
        if (permission === "granted") {
          await subscribeToPush(user?.id ?? "");

          toast.success("Notifications enabled");
        } else if (permission === "denied") {
          toast.error("Notifications blocked");
        }
      });
    }
  }, []);
  return (
    <nav className="flex flex-between fixed z-50 w-full px-6 py-5 lg:px-10 bg-slate-800">
      <Link href="/" className="flex item-center gap-1">
        <Image
          src={"/icons/logo.svg"}
          width={32}
          height={32}
          alt="noom"
          className=""
        />
        <p className="text-[26px] max-sm:hidden font-extrabold">Noom</p>
      </Link>

      <div className="flex flex-between gap-6">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="destructive">View Profiles</Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuGroup>
              <DropdownMenuItem asChild>
                <Link href={"/profile"}>Profile</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href={"/auth/login?add-account=true"} target="_blank" >Add account +</Link>
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={handleLogout}>
                Log out
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
        <MobileNav />
      </div>
    </nav>
  );
};

export default Navbar;
