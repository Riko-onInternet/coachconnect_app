import Header from "@/components/header";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
      <Header />
      
      <main className="pt-24 pb-16">
        <section className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center mb-16">
            <h1 className="text-4xl sm:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
              Chi Siamo
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Scopri la storia e la missione di CoachConnect, la piattaforma creata da personal trainer per personal trainer.
            </p>
          </div>
          
          <div className="max-w-3xl mx-auto mb-16">
            <div className="aspect-video rounded-2xl overflow-hidden mb-8">
              <div className="w-full h-full bg-gray-300 dark:bg-gray-700 flex items-center justify-center">
                <span className="text-gray-500 dark:text-gray-400 text-lg">Immagine del team</span>
              </div>
            </div>
            
            <h2 className="text-2xl font-bold mb-4">La nostra storia</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              CoachConnect è nato nel 2022 dalla visione di un gruppo di personal trainer e sviluppatori software che hanno identificato una lacuna nel mercato: la mancanza di una piattaforma completa e intuitiva specificamente progettata per le esigenze dei personal trainer.
            </p>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Dopo anni di esperienza nel settore del fitness e del coaching, abbiamo unito le nostre competenze per creare uno strumento che potesse realmente semplificare il lavoro quotidiano dei personal trainer e migliorare l&apos;esperienza dei loro clienti.
            </p>
            
            <h2 className="text-2xl font-bold mb-4 mt-10">La nostra missione</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              La nostra missione è semplice: aiutare i personal trainer a concentrarsi su ciò che sanno fare meglio - allenare e motivare i loro clienti - eliminando le complessità amministrative e tecnologiche che spesso sottraggono tempo prezioso.
            </p>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Crediamo che la tecnologia debba essere al servizio del rapporto umano tra trainer e cliente, non sostituirlo. Per questo motivo, ogni funzionalità di CoachConnect è progettata per rafforzare questa relazione e migliorare i risultati di entrambe le parti.
            </p>
          </div>
        </section>
        
        <section className="container mx-auto px-4 py-8">
          <h2 className="text-3xl font-bold text-center mb-12">Il nostro team</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 max-w-5xl mx-auto">
            {teamMembers.map((member, index) => (
              <div key={index} className="text-center">
                <div className="w-40 h-40 rounded-full overflow-hidden mx-auto mb-4">
                  <div className="w-full h-full bg-gray-300 dark:bg-gray-700 flex items-center justify-center">
                    <span className="text-gray-500 dark:text-gray-400">{member.initials}</span>
                  </div>
                </div>
                <h3 className="text-xl font-semibold mb-1">{member.name}</h3>
                <p className="text-blue-600 dark:text-blue-400 mb-2">{member.role}</p>
                <p className="text-gray-600 dark:text-gray-300 text-sm">{member.bio}</p>
              </div>
            ))}
          </div>
        </section>
        
        <section className="container mx-auto px-4 py-16">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 max-w-4xl mx-auto text-center">
            <h2 className="text-2xl font-bold mb-6">Unisciti a noi</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
              Sei un personal trainer che vuole portare la propria attività al livello successivo? Prova CoachConnect oggi stesso e scopri come possiamo aiutarti a crescere, risparmiare tempo e migliorare i risultati dei tuoi clienti.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="/register" className="px-6 py-3 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors font-medium">
                Inizia la prova gratuita
              </a>
              <a href="/contact" className="px-6 py-3 rounded-lg bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors font-medium">
                Contattaci
              </a>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

const teamMembers = [
  {
    name: "Marco Rossi",
    role: "CEO & Co-fondatore",
    bio: "Ex personal trainer con 10 anni di esperienza e una passione per la tecnologia.",
    initials: "MR"
  },
  {
    name: "Laura Bianchi",
    role: "CTO & Co-fondatrice",
    bio: "Sviluppatrice software con background in scienze motorie e nutrizione sportiva.",
    initials: "LB"
  },
  {
    name: "Alessandro Verdi",
    role: "Head of Product",
    bio: "Designer UX/UI specializzato in applicazioni per il fitness e il benessere.",
    initials: "AV"
  },
  {
    name: "Giulia Neri",
    role: "Customer Success",
    bio: "Personal trainer e coach nutrizionale, esperta in supporto clienti e formazione.",
    initials: "GN"
  }
];