import Header from "@/components/header";

export default function FeaturesPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
      <Header />
      
      <main className="pt-24 pb-16">
        <section className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center mb-16">
            <h1 className="text-4xl sm:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
              Funzionalità
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Scopri tutti gli strumenti che CoachConnect mette a disposizione per migliorare la tua attività di personal trainer.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-5xl mx-auto">
            {features.map((feature, index) => (
              <div key={index} className="flex gap-6">
                <div className="w-14 h-14 shrink-0 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                  <span className="text-2xl">{feature.icon}</span>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                  <p className="text-gray-600 dark:text-gray-300">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
        
        <section className="container mx-auto px-4 py-16">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 max-w-5xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-8">Perché scegliere CoachConnect?</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">⏱️</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">Risparmia tempo</h3>
                <p className="text-gray-600 dark:text-gray-300">Automatizza le attività ripetitive e concentrati su ciò che conta davvero.</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">📈</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">Aumenta i risultati</h3>
                <p className="text-gray-600 dark:text-gray-300">Monitora i progressi e ottimizza i programmi in base ai dati raccolti.</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-yellow-100 dark:bg-yellow-900 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🤝</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">Fidelizza i clienti</h3>
                <p className="text-gray-600 dark:text-gray-300">Migliora la comunicazione e l&apos;esperienza complessiva dei tuoi clienti.</p>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

const features = [
  {
    icon: "📊",
    title: "Dashboard personalizzata",
    description: "Visualizza a colpo d'occhio tutti i dati importanti dei tuoi clienti e della tua attività."
  },
  {
    icon: "👥",
    title: "Gestione clienti avanzata",
    description: "Crea profili dettagliati, imposta obiettivi e monitora i progressi di ogni cliente."
  },
  {
    icon: "💪",
    title: "Creazione schede di allenamento",
    description: "Progetta programmi personalizzati con un'interfaccia intuitiva e una vasta libreria di esercizi."
  },
  {
    icon: "🍎",
    title: "Piani nutrizionali",
    description: "Crea e assegna piani alimentari personalizzati in base agli obiettivi e alle esigenze dei clienti."
  },
  {
    icon: "📱",
    title: "App mobile per i clienti",
    description: "Offri ai tuoi clienti un'app dedicata per seguire allenamenti, piani alimentari e comunicare con te."
  },
  {
    icon: "💬",
    title: "Messaggistica integrata",
    description: "Comunica direttamente con i tuoi clienti attraverso la piattaforma, senza dover utilizzare app esterne."
  },
  {
    icon: "📅",
    title: "Gestione appuntamenti",
    description: "Organizza il tuo calendario e permetti ai clienti di prenotare sessioni direttamente dall'app."
  },
  {
    icon: "📈",
    title: "Analisi e reportistica",
    description: "Genera report dettagliati sui progressi dei clienti e sull'andamento della tua attività."
  }
];