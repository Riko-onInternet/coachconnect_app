import Header from "@/components/header";
import Link from "next/link";

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
      <Header />
      
      <main className="pt-24 pb-16">
        <section className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center mb-16">
            <h1 className="text-4xl sm:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
              Piani e Prezzi
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Scegli il piano più adatto alle tue esigenze e fai crescere la tua attività di personal trainer.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Piano Base */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden transition-transform hover:scale-105">
              <div className="p-8">
                <h3 className="text-2xl font-bold mb-4">Base</h3>
                <div className="mb-4">
                  <span className="text-4xl font-bold">€29</span>
                  <span className="text-gray-600 dark:text-gray-300">/mese</span>
                </div>
                <p className="text-gray-600 dark:text-gray-300 mb-6">Ideale per personal trainer che iniziano la loro attività.</p>
                <ul className="space-y-3 mb-8">
                  {basePlanFeatures.map((feature, index) => (
                    <li key={index} className="flex items-center">
                      <span className="text-green-500 mr-2">✓</span>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="px-8 pb-8">
                <Link href="/register" className="block w-full py-3 px-4 text-center rounded-lg bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors font-medium">
                  Inizia gratis
                </Link>
              </div>
            </div>
            
            {/* Piano Pro */}
            <div className="bg-blue-600 text-white rounded-2xl shadow-xl overflow-hidden transform scale-105">
              <div className="bg-blue-700 py-2 text-center">
                <span className="font-medium">Più popolare</span>
              </div>
              <div className="p-8">
                <h3 className="text-2xl font-bold mb-4">Pro</h3>
                <div className="mb-4">
                  <span className="text-4xl font-bold">€59</span>
                  <span>/mese</span>
                </div>
                <p className="text-blue-100 mb-6">Per trainer che vogliono far crescere la propria attività.</p>
                <ul className="space-y-3 mb-8">
                  {proPlanFeatures.map((feature, index) => (
                    <li key={index} className="flex items-center">
                      <span className="text-blue-300 mr-2">✓</span>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="px-8 pb-8">
                <Link href="/register" className="block w-full py-3 px-4 text-center rounded-lg bg-white text-blue-600 hover:bg-blue-50 transition-colors font-medium">
                  Prova 14 giorni gratis
                </Link>
              </div>
            </div>
            
            {/* Piano Business */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden transition-transform hover:scale-105">
              <div className="p-8">
                <h3 className="text-2xl font-bold mb-4">Business</h3>
                <div className="mb-4">
                  <span className="text-4xl font-bold">€99</span>
                  <span className="text-gray-600 dark:text-gray-300">/mese</span>
                </div>
                <p className="text-gray-600 dark:text-gray-300 mb-6">Per studi e team di personal trainer.</p>
                <ul className="space-y-3 mb-8">
                  {businessPlanFeatures.map((feature, index) => (
                    <li key={index} className="flex items-center">
                      <span className="text-green-500 mr-2">✓</span>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="px-8 pb-8">
                <Link href="/register" className="block w-full py-3 px-4 text-center rounded-lg bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors font-medium">
                  Contattaci
                </Link>
              </div>
            </div>
          </div>
        </section>
        
        <section className="container mx-auto px-4 py-16">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-center mb-8">Domande frequenti</h2>
            <div className="space-y-6">
              {faqs.map((faq, index) => (
                <div key={index} className="border-b border-gray-200 dark:border-gray-700 pb-6 last:border-0 last:pb-0">
                  <h3 className="text-xl font-semibold mb-2">{faq.question}</h3>
                  <p className="text-gray-600 dark:text-gray-300">{faq.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

const basePlanFeatures = [
  "Fino a 15 clienti",
  "Creazione schede di allenamento",
  "Gestione appuntamenti",
  "App mobile per i clienti",
  "Supporto email"
];

const proPlanFeatures = [
  "Fino a 50 clienti",
  "Tutte le funzionalità del piano Base",
  "Piani nutrizionali",
  "Analisi avanzate e reportistica",
  "Messaggistica illimitata",
  "Supporto prioritario"
];

const businessPlanFeatures = [
  "Clienti illimitati",
  "Tutte le funzionalità del piano Pro",
  "Gestione team e permessi",
  "Branding personalizzato",
  "API per integrazioni",
  "Account manager dedicato"
];

const faqs = [
  {
    question: "Posso cambiare piano in qualsiasi momento?",
    answer: "Sì, puoi passare a un piano superiore in qualsiasi momento. Il passaggio a un piano inferiore è possibile alla fine del periodo di fatturazione."
  },
  {
    question: "Come funziona il periodo di prova gratuito?",
    answer: "Offriamo 14 giorni di prova gratuita per tutti i piani. Non è richiesta alcuna carta di credito per iniziare la prova. Alla fine del periodo, potrai scegliere il piano più adatto alle tue esigenze."
  },
  {
    question: "Quali metodi di pagamento accettate?",
    answer: "Accettiamo tutte le principali carte di credito (Visa, Mastercard, American Express) e PayPal. Per i piani Business, offriamo anche la possibilità di pagamento tramite bonifico bancario."
  },
  {
    question: "Posso esportare i miei dati se decido di non utilizzare più il servizio?",
    answer: "Sì, offriamo la possibilità di esportare tutti i tuoi dati in formati standard come CSV o JSON in qualsiasi momento."
  }
];