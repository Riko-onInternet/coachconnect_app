import TrainerRegisterCard from "@/components/trainer/registercard";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function TrainerRegister() {
  return (
    <div className="w-dvw h-dvh flex items-center justify-center relative bg-[url(/img/bg_register.png)] bg-no-repeat bg-center bg-cover">
      <Link href={"/"} className="absolute top-2 left-2 p-2 rounded-full text-white hover:bg-white/20 transition-all duration-200" title="Torna alla home">
        <ArrowLeft size={32} />
      </Link>
      <TrainerRegisterCard />
    </div>
  );
}
