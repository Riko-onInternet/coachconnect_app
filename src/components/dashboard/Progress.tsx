import React, { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import { API_BASE_URL } from "@/utils/config";

interface WeightData {
  date: string;
  weight: number;
  bodyFat?: number;
}

interface PersonalBest {
  exercise: string;
  weight: number;
  reps?: number;
  achievedAt: string;
}

interface ProgressResponse {
  weight: WeightData[];
  bodyFat: WeightData[];
  personalBests: PersonalBest[];
}

export default function Progress() {
  const [progressData, setProgressData] = useState<ProgressResponse>({
    weight: [],
    bodyFat: [],
    personalBests: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProgress = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setError("Token di autenticazione non trovato");
          return;
        }

        const response = await fetch(`${API_BASE_URL}/api/progress`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error(`Errore HTTP: ${response.status}`);
        }

        const data = await response.json();
        setProgressData(data);
      } catch (error) {
        console.error("Errore nel caricamento dei progressi:", error);
        setError("Errore nel caricamento dei dati di progresso");
      } finally {
        setLoading(false);
      }
    };

    fetchProgress();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <p className="text-red-500 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Riprova
          </button>
        </div>
      </div>
    );
  }

  const hasWeightData = progressData.weight && progressData.weight.length > 0;
  const hasPersonalBests = progressData.personalBests && progressData.personalBests.length > 0;

  return (
    <div className="space-y-8 p-6">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white">I Miei Progressi</h2>

      {/* Grafico del peso */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Andamento Peso</h3>
        {hasWeightData ? (
          <div className="w-full overflow-x-auto">
            <LineChart
              width={800}
              height={400}
              data={progressData.weight}
              margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
            >
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis 
                dataKey="date" 
                tick={{ fontSize: 12 }}
                tickFormatter={(value) => {
                  const date = new Date(value);
                  return `${date.getDate()}/${date.getMonth() + 1}`;
                }}
              />
              <YAxis 
                tick={{ fontSize: 12 }}
                label={{ value: 'Peso (kg)', angle: -90, position: 'insideLeft' }}
              />
              <Tooltip 
                labelFormatter={(value) => {
                  const date = new Date(value);
                  return date.toLocaleDateString('it-IT');
                }}
                formatter={(value: number, name: string) => [
                  `${value} ${name.includes('Peso') ? 'kg' : '%'}`,
                  name
                ]}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="weight"
                stroke="#3B82F6"
                strokeWidth={2}
                dot={{ fill: '#3B82F6', strokeWidth: 2, r: 4 }}
                name="Peso (kg)"
              />
              {progressData.weight.some(item => item.bodyFat) && (
                <Line
                  type="monotone"
                  dataKey="bodyFat"
                  stroke="#10B981"
                  strokeWidth={2}
                  dot={{ fill: '#10B981', strokeWidth: 2, r: 4 }}
                  name="Grasso Corporeo (%)"
                />
              )}
            </LineChart>
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400">Nessun dato di peso disponibile</p>
            <p className="text-sm text-gray-400 dark:text-gray-500 mt-2">
              Inizia a registrare i tuoi progressi per vedere i grafici
            </p>
          </div>
        )}
      </div>

      {/* Record Personali */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Record Personali</h3>
        {hasPersonalBests ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {progressData.personalBests.map((pb, index) => (
              <div
                key={index}
                className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900 dark:to-blue-800 rounded-lg p-4 border border-blue-200 dark:border-blue-700"
              >
                <h4 className="font-semibold text-lg mb-2 text-gray-900 dark:text-white">
                  {pb.exercise}
                </h4>
                <div className="flex items-baseline space-x-2">
                  <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                    {pb.weight} kg
                  </p>
                  {pb.reps && (
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      × {pb.reps} reps
                    </p>
                  )}
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                  {new Date(pb.achievedAt).toLocaleDateString('it-IT')}
                </p>
                <p className="text-xs text-blue-600 dark:text-blue-400 font-medium">
                  Record Personale
                </p>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400">Nessun record personale disponibile</p>
            <p className="text-sm text-gray-400 dark:text-gray-500 mt-2">
              Completa i tuoi allenamenti per stabilire nuovi record
            </p>
          </div>
        )}
      </div>

      {/* Statistiche Rapide */}
      {hasWeightData && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 text-center">
            <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
              Peso Attuale
            </h4>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">
              {progressData.weight[progressData.weight.length - 1]?.weight || 'N/A'} kg
            </p>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 text-center">
            <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
              Variazione Peso
            </h4>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">
              {progressData.weight.length > 1 ? (
                (() => {
                  const latest = progressData.weight[progressData.weight.length - 1]?.weight || 0;
                  const previous = progressData.weight[0]?.weight || 0;
                  const diff = latest - previous;
                  return (
                    <span className={diff >= 0 ? 'text-green-600' : 'text-red-600'}>
                      {diff >= 0 ? '+' : ''}{diff.toFixed(1)} kg
                    </span>
                  );
                })()
              ) : 'N/A'}
            </p>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 text-center">
            <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
              Record Totali
            </h4>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">
              {progressData.personalBests.length}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}