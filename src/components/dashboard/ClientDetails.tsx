import React from "react";

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

interface ClientDetailsProps {
  client: Client;
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

const getBMIColor = (bmi: number) => {
  if (bmi < 18.5) {
    return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"; // Sottopeso
  } else if (bmi >= 18.5 && bmi < 25) {
    return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"; // Normale
  } else if (bmi >= 25 && bmi < 30) {
    return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"; // Sovrappeso
  } else {
    return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"; // Obeso
  }
};

export default function ClientDetails({ client }: ClientDetailsProps) {
  return (
    <>
      <div className="flex items-center gap-4 mb-6">
        <div className="w-20 h-20 rounded-full flex items-center justify-center text-2xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 text-white">
          {getInitials(client.firstName, client.lastName)}
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-800 dark:text-white">
            {client.firstName} {client.lastName}
          </h2>
          <p className="text-gray-500 dark:text-gray-400">{client.email}</p>
        </div>
      </div>

      <div className="space-y-6">
        <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-3">
            Informazioni Fitness
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">Livello</p>
              <p className="font-medium text-gray-800 dark:text-white">
                <span
                  className={`inline-block mt-1 text-xs px-2 py-1 rounded-full ${
                    getFitnessLevelColor(
                      client.clientProfile?.fitnessLevel || "Principiante"
                    )
                  }`}
                >
                  {client.clientProfile?.fitnessLevel || "Principiante"}
                </span>
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">BMI</p>
              {client.clientProfile?.weight && client.clientProfile?.height ? (
                <div className="inline-flex items-center">
                  <span 
                    className={`px-2 py-1 rounded-full text-sm font-medium ${
                      getBMIColor(
                        client.clientProfile.weight /
                        Math.pow(client.clientProfile.height / 100, 2)
                      )
                    }`}
                  >
                    {(
                      client.clientProfile.weight /
                      Math.pow(client.clientProfile.height / 100, 2)
                    ).toFixed(1)}
                  </span>
                </div>
              ) : (
                <p className="font-medium text-gray-800 dark:text-white">N/A</p>
              )}
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Obiettivi Fitness
          </h3>
          <div className="flex flex-wrap gap-2">
            {client.clientProfile?.fitnessGoals?.length ? (
              client.clientProfile.fitnessGoals.map(
                (goal: string, index: number) => (
                  <span
                    key={index}
                    className="text-sm bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 px-3 py-1 rounded-full"
                  >
                    {goal}
                  </span>
                )
              )
            ) : (
              <span className="text-sm text-gray-500 dark:text-gray-400">
                Non specificati
              </span>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div>
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Peso
            </h3>
            <p className="text-lg font-semibold text-gray-800 dark:text-white">
              {client.clientProfile?.weight
                ? `${client.clientProfile.weight} kg`
                : "Non specificato"}
            </p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Altezza
            </h3>
            <p className="text-lg font-semibold text-gray-800 dark:text-white">
              {client.clientProfile?.height
                ? `${client.clientProfile.height} cm`
                : "Non specificato"}
            </p>
          </div>
        </div>
      </div>
    </>
  );
}