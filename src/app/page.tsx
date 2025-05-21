export default function Home() {
  return (
    <div className="w-dvw h-dvh flex flex-col md:flex-row items-center justify-center relative">
      <div className="w-1/2 h-full">
        <div className="w-full h-full flex flex-col items-center justify-center">
          <p>Area Trainer</p>

          <div className="w-1/2 flex flex-col items-center justify-center gap-4 p-4">
            <a
              href="/trainer/register"
              className="h-10 w-full bg-[rgb(var(--primary))] flex items-center justify-center rounded-md text-white hover:bg-[rgba(var(--primary),0.5)] transition-all duration-200"
            >
              Registrati come trainer
            </a>
            <a
              href="/trainer/login"
              className="h-10 w-full border-2 border-[rgb(var(--primary))] flex items-center justify-center rounded-md text-[rgb(var(--primary))] hover:border-[rgba(var(--primary),0.5)] transition-all duration-200"
            >
              Accedi come trainer
            </a>
          </div>
        </div>
      </div>
      <div className="w-1/2 bg-purple-500 h-full">
        <div className="w-full h-full flex flex-col items-center justify-center">
          <p>Area Clienti</p>
        </div>
      </div>
    </div>
  );
}
