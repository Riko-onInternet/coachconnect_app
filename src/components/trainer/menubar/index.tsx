"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useRouter, usePathname } from "next/navigation";
import { Avatar } from "@heroui/react";

// icons
import {
  Menu,
  X,
  LogOut,
  Home,
  Users,
  Dumbbell,
  MessageCircle,
  Bell,
} from "lucide-react";

// Array menù
const menuItems = [
  { name: "Home", icon: <Home size={20} />, href: "/trainer/dashboard" },
  {
    name: "Clienti",
    icon: <Users size={20} />,
    href: "/trainer/dashboard/clients",
  },
  {
    name: "Esercizi",
    icon: <Dumbbell size={20} />,
    href: "/trainer/dashboard/workout",
  },
  {
    name: "Messaggi",
    icon: <MessageCircle size={20} />,
    href: "/trainer/dashboard/messages",
  },
  {
    name: "Invio notifiche",
    icon: <Bell size={20} />,
    href: "/trainer/dashboard/notifications",
  },
];

export function MenuBar({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const { logout } = useAuth();
  const router = useRouter();

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  if (isOpen == false) {
    document.querySelector("#background_menubar")?.classList.add("hidden");
  } else {
    document.querySelector("#background_menubar")?.classList.remove("hidden");
  }

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  return (
    <>
      <div className="absolute top-2 left-2 z-50">
        <button
          className="sm:hidden cursor-pointer p-2 bg-gray-100 rounded-md shadow-md"
          onClick={toggleSidebar}
        >
          {isOpen ? <X /> : <Menu />}
        </button>
      </div>
      <div
        className={`h-full relative z-20 transition-all duration-300 ${
          isOpen ? "w-[220px]" : "w-0"
        } sm:w-[220px] md:w-[280px] bg-gray-100 rounded-md shadow-md overflow-hidden`}
        id="menubar"
      >
        <div className="flex flex-col h-full w-full mt-12 sm:m-0 p-2 sm:p-3">
          <div>
            <div className="flex items-center justify-center gap-1 h-10 text-sm sm:text-base select-none leading-0 font-bold">
              <div className="bg-[rgb(var(--primary))] p-1 rounded-md text-white">
                <Dumbbell size={20} />
              </div>
              CoachConnect
            </div>
            <hr className="text-black/10 my-3" />
          </div>
          <div className="h-full">
            <div>{children}</div>
          </div>
          <div>
            <hr className="text-black/10 my-3" />
            <button
              type="button"
              onClick={handleLogout}
              className="w-full bg-red-600/40 hover:bg-red-600/80 transition-all duration-300 h-10 rounded-md text-white inline-flex items-center justify-center gap-1 text-sm"
            >
              <LogOut size={20} />
              Logout
            </button>
          </div>
        </div>
      </div>
      <div
        className={`bg-black/50 w-full h-full absolute inset-0 z-10 transition-all duration-300 ${
          isOpen ? "opacity-100" : "opacity-0"
        }`}
        id="background_menubar"
      />
    </>
  );
}

export function MenuItem() {
  const router = useRouter();
  const { trainer, isLoading } = useAuth();
  const pathname = usePathname();

  useEffect(() => {
    if (!isLoading && !trainer) {
      router.push("/trainer/login");
    }
  }, [trainer, isLoading, router]);

  if (isLoading) {
    return (
      <div className="w-dvw h-dvh flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[rgb(var(--primary))]"></div>
      </div>
    );
  }

  if (!trainer) {
    return null;
  }

  return (
    <MenuBar>
      <div className="mb-2 flex flex-col items-center gap-1">
        <Avatar name={trainer.name} size="lg" src={trainer.profilePicture} />
        <p>Bentornato {trainer.name}!</p>
      </div>
      <hr className="text-black/10 my-3" />
      <div className="flex flex-col gap-2">
        {menuItems.map((item) => (
          <button
            key={item.name}
            onClick={() => router.push(item.href)}
            className={`w-full transition-all duration-300 h-12 rounded-md text-black inline-flex items-center justify-start gap-1 text-sm px-4
              ${
                pathname === item.href
                  ? "bg-[rgb(var(--primary))] hover:bg-[rgb(var(--primary-hover))] text-white"
                  : "bg-neutral-200 hover:bg-neutral-300"
              }`}
          >
            {item.icon}
            {item.name}
          </button>
        ))}
      </div>
    </MenuBar>
  );
}
