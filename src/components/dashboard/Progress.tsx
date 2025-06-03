import { useState, useEffect } from "react";
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

interface ProgressData {
  date: string;
  weight: number;
  bodyFat?: number;
  personalBests: {
    exercise: string;
    weight: number;
  }[];
}

export default function Progress() {
  const [progressData, setProgressData] = useState<ProgressData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProgress = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(`${API_BASE_URL}/api/progress`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();
        setProgressData(data);
      } catch (error) {
        console.error("Errore nel caricamento dei progressi:", error);
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

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold">I Miei Progressi</h2>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <h3 className="text-lg font-semibold mb-4">Andamento Peso</h3>
        <div className="w-full overflow-x-auto">
          <LineChart
            width={600}
            height={300}
            data={progressData}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="weight"
              stroke="#3B82F6"
              name="Peso (kg)"
            />
            {progressData[0]?.bodyFat && (
              <Line
                type="monotone"
                dataKey="bodyFat"
                stroke="#10B981"
                name="Grasso Corporeo (%)"
              />
            )}
          </LineChart>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {progressData[progressData.length - 1]?.personalBests.map(
          (pb, index) => (
            <div
              key={index}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6"
            >
              <h4 className="font-semibold text-lg mb-2">{pb.exercise}</h4>
              <p className="text-3xl font-bold text-blue-600">
                {pb.weight} kg
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Record Personale
              </p>
            </div>
          )
        )}
      </div>
    </div>
  );
}