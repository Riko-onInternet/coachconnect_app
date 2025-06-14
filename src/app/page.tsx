// import Link from "next/link";

import Header from "@/components/header";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
      {/* Header/Nav */}
      <Header />

      {/* Hero Section */}
      <main className="pt-24 pb-16">
        <section className="container mx-auto px-4">
          <div className="max-w-4xl h-96 mx-auto text-center flex flex-col items-center justify-center">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
              La tua palestra digitale, sempre con te
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
              Una piattaforma completa per personal trainer: gestisci clienti,
              programmi e comunicazioni da un&apos;unica app.
            </p>
          </div>
        </section>

        {/* Features Section */}
        <section className="container mx-auto px-4 py-16">
          <h2 className="text-3xl font-bold text-center mb-12">
            Tutto ciò che ti serve, in un’unica piattaforma
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="p-6 rounded-2xl bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transition-shadow"
              >
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}

const features = [
  {
    icon: "📊",
    title: "Clienti sempre sotto controllo",
    description:
      "Crea profili dettagliati, imposta obiettivi e monitora i progressi dei tuoi clienti con facilità.",
  },
  {
    icon: "💪",
    title: "Schede di allenamento smart",
    description:
      "Progetta programmi su misura per ogni cliente e aggiorna i piani in base ai risultati.",
  },
  {
    icon: "📱",
    title: "Chat integrata",
    description:
      "Resta in contatto con i tuoi clienti: rispondi, guida e motiva in tempo reale.",
  },
  {
    icon: "🔔",
    title: "Notifiche intelligenti",
    description:
      "Ricorda ai clienti gli allenamenti, gli obiettivi e gli aggiornamenti importanti in modo automatico.",
  },
  {
    icon: "📱",
    title: "Accessibile ovunque",
    description:
      "Un’interfaccia responsive per lavorare dal tuo smartphone, tablet o PC, senza limiti.",
  },
  {
    icon: "🔒",
    title: "Protezione dei dati",
    description:
      "Affidati a protocolli avanzati per la sicurezza delle informazioni personali e dei progressi dei clienti.",
  },
];
