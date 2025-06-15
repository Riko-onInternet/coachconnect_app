import React from "react";
import { Activity, Target, ChevronRight } from "lucide-react";

interface Client {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  clientProfile?: {
    fitnessLevel: string;
    fitnessGoals: string[];
    weight: number | null;
    height: number | null;
  };
}

interface ClientCardProps {
  client: Client;
  onClick: () => void;
}

const getFitnessLevelColor = (level: string) => {
  switch (level?.toLowerCase()) {
    case "principiante":
      return "bg-green-100 text-green-800";
    case "intermedio":
      return "bg-yellow-100 text-yellow-800";
    case "avanzato":
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

const getInitials = (firstName: string, lastName: string) => {
  return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
};

export default function ClientCard({ client, onClick }: ClientCardProps) {
  return (
    <div
      onClick={onClick}
      className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all border border-gray-100 dark:border-gray-700 flex flex-col cursor-pointer"
    >
      <div className="p-5 flex items-start gap-4">
        <div className="flex-shrink-0">
          {client.firstName && client.lastName ? (
            <div className="w-16 h-16 rounded-full flex items-center justify-center text-xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 text-white">
              {getInitials(client.firstName, client.lastName)}
            </div>
          ) : (
            <div className="w-16 h-16 rounded-full bg-gray-200 dark:bg-gray-700"></div>
          )}
        </div>

        <div className="flex-grow min-w-0">
          <h3 className="font-semibold text-lg text-gray-800 dark:text-white truncate">
            {client.firstName} {client.lastName}
          </h3>
          <p className="text-gray-500 dark:text-gray-400 text-sm truncate mb-2">
            {client.email}
          </p>

          <div className="flex items-center gap-2 mb-2">
            <Activity size={14} className="text-gray-400" />
            <span
              className={`text-xs px-2 py-1 rounded-full ${
                getFitnessLevelColor(
                  client.clientProfile?.fitnessLevel || "Principiante"
                )
              }`}
            >
              {client.clientProfile?.fitnessLevel || "Principiante"}
            </span>
          </div>
        </div>
      </div>

      <div className="px-5 pb-5 mt-auto">
        <div className="border-t border-gray-100 dark:border-gray-700 pt-3">
          <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2 flex items-center gap-1">
            <Target size={14} /> Obiettivi
          </p>
          <div className="flex flex-wrap gap-2">
            {client.clientProfile?.fitnessGoals?.length ? (
              client.clientProfile.fitnessGoals
                .slice(0, 2)
                .map((goal: string, index: number) => (
                  <span
                    key={index}
                    className="text-xs bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 px-2 py-1 rounded-full truncate max-w-[120px]"
                  >
                    {goal}
                  </span>
                ))
            ) : (
              <span className="text-xs bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400 px-2 py-1 rounded-full">
                Non specificati
              </span>
            )}
            {(client.clientProfile?.fitnessGoals?.length ?? 0) > 2 && (
              <span className="text-xs bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400 px-2 py-1 rounded-full">
                +{(client.clientProfile?.fitnessGoals?.length ?? 0) - 2}
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="bg-gray-50 dark:bg-gray-800/50 px-5 py-3 flex justify-end">
        <button className="text-blue-600 dark:text-blue-400 text-sm font-medium flex items-center gap-1 hover:underline">
          Dettagli <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
}