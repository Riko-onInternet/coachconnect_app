/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import React, { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from "recharts";
import { Dumbbell, Calendar, TrendingUp, Award } from "lucide-react";

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
  muscleGroup?: string;
}

interface MuscleGroupData {
  name: string;
  value: number;
  exercises: string[];
}

interface WorkoutFrequency {
  day: string;
  count: number;
}

interface ExerciseProgress {
  exercise: string;
  muscleGroup: string;
  dates: string[];
  weights: number[];
  reps: number[];
}

interface ProgressResponse {
  weight: WeightData[];
  bodyFat: WeightData[];
  personalBests: PersonalBest[];
  muscleGroups: MuscleGroupData[];
  workoutFrequency: WorkoutFrequency[];
  exerciseProgress: ExerciseProgress[];
}

const COLORS = [
  "#3B82F6", // blue-500
  "#10B981", // emerald-500
  "#F59E0B", // amber-500
  "#EF4444", // red-500
  "#8B5CF6", // violet-500
  "#EC4899", // pink-500
  "#06B6D4", // cyan-500
  "#F97316", // orange-500
];

// Dati locali di esempio
const mockProgressData: ProgressResponse = {
  weight: [
    { date: "2022-01-01", weight: 82.0, bodyFat: 20.0 },
    { date: "2022-02-01", weight: 81.2, bodyFat: 19.5 },
    { date: "2022-03-01", weight: 81.8, bodyFat: 19.8 },
    { date: "2022-04-01", weight: 80.5, bodyFat: 19.0 },
    { date: "2022-05-01", weight: 81.3, bodyFat: 19.6 },
    { date: "2022-06-01", weight: 79.8, bodyFat: 18.7 },
    { date: "2022-07-01", weight: 80.5, bodyFat: 19.2 },
    { date: "2022-08-01", weight: 78.9, bodyFat: 18.0 },
    { date: "2022-09-01", weight: 79.5, bodyFat: 18.5 },
    { date: "2022-10-01", weight: 77.8, bodyFat: 17.6 },
    { date: "2022-11-01", weight: 78.4, bodyFat: 18.2 },
    { date: "2022-12-01", weight: 76.9, bodyFat: 17.3 },
    { date: "2023-01-01", weight: 77.5, bodyFat: 17.8 },
    { date: "2023-02-01", weight: 75.8, bodyFat: 16.9 },
    { date: "2023-03-01", weight: 76.2, bodyFat: 17.2 },
    { date: "2023-04-01", weight: 74.9, bodyFat: 16.5 },
    { date: "2023-05-01", weight: 75.6, bodyFat: 17.0 },
    { date: "2023-06-01", weight: 73.8, bodyFat: 16.2 },
    { date: "2023-07-01", weight: 74.3, bodyFat: 16.7 },
    { date: "2023-08-01", weight: 72.5, bodyFat: 15.8 },
  ],
  bodyFat: [], // Incluso nei dati di peso
  personalBests: [
    {
      exercise: "Panca Piana",
      weight: 90,
      reps: 5,
      achievedAt: "2023-06-15",
      muscleGroup: "Petto",
    },
    {
      exercise: "Squat",
      weight: 120,
      reps: 3,
      achievedAt: "2023-05-20",
      muscleGroup: "Gambe",
    },
    {
      exercise: "Stacco da Terra",
      weight: 140,
      reps: 2,
      achievedAt: "2023-04-10",
      muscleGroup: "Schiena",
    },
    {
      exercise: "Military Press",
      weight: 60,
      reps: 6,
      achievedAt: "2023-03-05",
      muscleGroup: "Spalle",
    },
    {
      exercise: "Curl con Bilanciere",
      weight: 45,
      reps: 8,
      achievedAt: "2023-02-18",
      muscleGroup: "Bicipiti",
    },
  ],
  muscleGroups: [
    {
      name: "Petto",
      value: 12,
      exercises: ["Panca Piana", "Panca Inclinata", "Croci con Manubri"],
    },
    {
      name: "Schiena",
      value: 15,
      exercises: ["Stacco da Terra", "Trazioni", "Rematore", "Pulley"],
    },
    {
      name: "Gambe",
      value: 18,
      exercises: ["Squat", "Leg Press", "Affondi", "Leg Extension", "Leg Curl"],
    },
    {
      name: "Spalle",
      value: 10,
      exercises: ["Military Press", "Alzate Laterali", "Alzate Frontali"],
    },
    {
      name: "Braccia",
      value: 8,
      exercises: ["Curl con Bilanciere", "Estensioni al Cavo", "Dips"],
    },
    {
      name: "Addominali",
      value: 6,
      exercises: ["Crunch", "Plank", "Leg Raise"],
    },
  ],
  workoutFrequency: [
    { day: "Lunedì", count: 4 },
    { day: "Martedì", count: 0 },
    { day: "Mercoledì", count: 3 },
    { day: "Giovedì", count: 0 },
    { day: "Venerdì", count: 4 },
    { day: "Sabato", count: 2 },
    { day: "Domenica", count: 0 },
  ],
  exerciseProgress: [
    {
      exercise: "Panca Piana",
      muscleGroup: "Petto",
      dates: [
        "2022-01-15",
        "2022-02-15",
        "2022-03-15",
        "2022-04-15",
        "2022-05-15",
        "2022-06-15",
        "2022-07-15",
        "2022-08-15",
        "2022-09-15",
        "2022-10-15",
        "2022-11-15",
        "2022-12-15",
        "2023-01-15",
        "2023-02-15",
        "2023-03-15",
        "2023-04-15",
        "2023-05-15",
        "2023-06-15",
        "2023-07-15",
        "2023-08-15",
      ],
      weights: [
        70, 72.5, 70, 75, 72.5, 77.5, 75, 80, 77.5, 82.5, 80, 85, 82.5, 87.5,
        85, 87.5, 85, 90, 87.5, 95,
      ],
      reps: [5, 4, 5, 4, 5, 4, 5, 4, 5, 4, 5, 4, 5, 4, 5, 4, 5, 4, 5, 4],
    },
    {
      exercise: "Squat",
      muscleGroup: "Gambe",
      dates: [
        "2022-01-20",
        "2022-02-20",
        "2022-03-20",
        "2022-04-20",
        "2022-05-20",
        "2022-06-20",
        "2022-07-20",
        "2022-08-20",
        "2022-09-20",
        "2022-10-20",
        "2022-11-20",
        "2022-12-20",
        "2023-01-20",
        "2023-02-20",
        "2023-03-20",
        "2023-04-20",
        "2023-05-20",
        "2023-06-20",
        "2023-07-20",
        "2023-08-20",
      ],
      weights: [
        90, 92.5, 90, 95, 92.5, 97.5, 95, 100, 97.5, 102.5, 100, 105, 102.5,
        107.5, 105, 110, 107.5, 115, 112.5, 120,
      ],
      reps: [5, 4, 5, 4, 5, 4, 5, 4, 5, 4, 5, 4, 5, 4, 5, 4, 5, 3, 4, 3],
    },
    {
      exercise: "Stacco da Terra",
      muscleGroup: "Schiena",
      dates: [
        "2022-01-25",
        "2022-02-25",
        "2022-03-25",
        "2022-04-25",
        "2022-05-25",
        "2022-06-25",
        "2022-07-25",
        "2022-08-25",
        "2022-09-25",
        "2022-10-25",
        "2022-11-25",
        "2022-12-25",
        "2023-01-25",
        "2023-02-25",
        "2023-03-25",
        "2023-04-25",
        "2023-05-25",
        "2023-06-25",
        "2023-07-25",
        "2023-08-25",
      ],
      weights: [
        110, 112.5, 110, 115, 112.5, 117.5, 115, 120, 117.5, 122.5, 120, 125,
        122.5, 127.5, 125, 130, 127.5, 135, 132.5, 140,
      ],
      reps: [3, 2, 3, 2, 3, 2, 3, 2, 3, 2, 3, 2, 3, 2, 3, 2, 3, 2, 3, 1],
    },
  ],
};

export default function ProgressGraph() {
  const [progressData, setProgressData] =
    useState<ProgressResponse>(mockProgressData);
  const [loading, setLoading] = useState(false); // Impostato a false poiché i dati sono locali
  const [error, setError] = useState<string | null>(null);
  const [selectedExercise, setSelectedExercise] = useState<string | null>(null);

  useEffect(() => {
    // Se ci sono dati di esercizi, seleziona il primo come default
    if (
      progressData.exerciseProgress &&
      progressData.exerciseProgress.length > 0
    ) {
      setSelectedExercise(progressData.exerciseProgress[0].exercise);
    }
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
  const hasPersonalBests =
    progressData.personalBests && progressData.personalBests.length > 0;
  const hasMuscleGroupData =
    progressData.muscleGroups && progressData.muscleGroups.length > 0;
  const hasWorkoutFrequency =
    progressData.workoutFrequency && progressData.workoutFrequency.length > 0;
  const hasExerciseProgress =
    progressData.exerciseProgress && progressData.exerciseProgress.length > 0;

  // Trova i dati dell'esercizio selezionato
  const selectedExerciseData = hasExerciseProgress
    ? progressData.exerciseProgress.find(
        (ex) => ex.exercise === selectedExercise
      )
    : null;

  // Prepara i dati per il grafico dell'esercizio selezionato
  const exerciseChartData = selectedExerciseData
    ? selectedExerciseData.dates.map((date, index) => ({
        date,
        weight: selectedExerciseData.weights[index],
        reps: selectedExerciseData.reps[index],
      }))
    : [];

  return (
    <div className="space-y-8">
      {/* Statistiche Rapide */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 text-center">
          <div className="flex justify-center mb-3">
            <TrendingUp className="h-8 w-8 text-blue-500" />
          </div>
          <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
            Peso Attuale
          </h4>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">
            {hasWeightData
              ? `${
                  progressData.weight[progressData.weight.length - 1]?.weight ||
                  "N/A"
                } kg`
              : "N/A"}
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 text-center">
          <div className="flex justify-center mb-3">
            <Dumbbell className="h-8 w-8 text-emerald-500" />
          </div>
          <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
            Record Personali
          </h4>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">
            {progressData.personalBests.length}
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 text-center">
          <div className="flex justify-center mb-3">
            <Calendar className="h-8 w-8 text-amber-500" />
          </div>
          <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
            Allenamenti Settimanali
          </h4>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">
            {hasWorkoutFrequency
              ? progressData.workoutFrequency.reduce(
                  (sum, day) => sum + day.count,
                  0
                )
              : "N/A"}
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 text-center">
          <div className="flex justify-center mb-3">
            <Award className="h-8 w-8 text-violet-500" />
          </div>
          <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
            Gruppo Muscolare Principale
          </h4>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">
            {hasMuscleGroupData
              ? progressData.muscleGroups[0]?.name || "N/A"
              : "N/A"}
          </p>
        </div>
      </div>

      {/* Grafico del peso */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
          Andamento Peso
        </h3>
        {hasWeightData ? (
          <div className="w-full overflow-x-auto">
            <ResponsiveContainer width="100%" height={400}>
              <LineChart
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
                  label={{
                    value: "Peso (kg)",
                    angle: -90,
                    position: "insideLeft",
                  }}
                />
                <Tooltip
                  labelFormatter={(value) => {
                    const date = new Date(value);
                    return date.toLocaleDateString("it-IT");
                  }}
                  formatter={(value: number, name: string) => [
                    `${value} ${name.includes("Peso") ? "kg" : "%"}`,
                    name,
                  ]}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="weight"
                  stroke="#3B82F6"
                  strokeWidth={2}
                  dot={{ fill: "#3B82F6", strokeWidth: 2, r: 4 }}
                  name="Peso (kg)"
                />
                {progressData.weight.some((item) => item.bodyFat) && (
                  <Line
                    type="monotone"
                    dataKey="bodyFat"
                    stroke="#10B981"
                    strokeWidth={2}
                    dot={{ fill: "#10B981", strokeWidth: 2, r: 4 }}
                    name="Grasso Corporeo (%)"
                  />
                )}
              </LineChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400">
              Nessun dato di peso disponibile
            </p>
            <p className="text-sm text-gray-400 dark:text-gray-500 mt-2">
              Inizia a registrare i tuoi progressi per vedere i grafici
            </p>
          </div>
        )}
      </div>

      {/* Distribuzione Gruppi Muscolari */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
          Distribuzione Allenamento
        </h3>
        {hasMuscleGroupData ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={progressData.muscleGroups}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                    nameKey="name"
                    label={({ name, percent }) =>
                      `${name}: ${(percent * 100).toFixed(0)}%`
                    }
                  >
                    {progressData.muscleGroups.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value, name, props) => [
                      `${value} esercizi`,
                      props.payload.name,
                    ]}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex flex-col justify-center">
              <h4 className="text-md font-medium mb-4 text-gray-700 dark:text-gray-300">
                Gruppi Muscolari Allenati
              </h4>
              <div className="space-y-3">
                {progressData.muscleGroups.map((group, index) => (
                  <div key={index} className="flex items-center">
                    <div
                      className="w-4 h-4 rounded-full mr-3"
                      style={{ backgroundColor: COLORS[index % COLORS.length] }}
                    ></div>
                    <div className="flex-1">
                      <div className="flex justify-between">
                        <span className="font-medium">{group.name}</span>
                        <span className="text-gray-600 dark:text-gray-400">
                          {group.value} esercizi
                        </span>
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        {group.exercises.slice(0, 3).join(", ")}
                        {group.exercises.length > 3 &&
                          ` +${group.exercises.length - 3} altri`}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400">
              Nessun dato di allenamento disponibile
            </p>
            <p className="text-sm text-gray-400 dark:text-gray-500 mt-2">
              Completa i tuoi allenamenti per vedere la distribuzione
            </p>
          </div>
        )}
      </div>

      {/* Frequenza Allenamenti */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
          Frequenza Allenamenti
        </h3>
        {hasWorkoutFrequency ? (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={progressData.workoutFrequency}>
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis dataKey="day" />
              <YAxis allowDecimals={false} />
              <Tooltip
                formatter={(value) => [`${value} allenamenti`, "Frequenza"]}
              />
              <Bar
                dataKey="count"
                name="Allenamenti"
                fill="#3B82F6"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400">
              Nessun dato di frequenza disponibile
            </p>
            <p className="text-sm text-gray-400 dark:text-gray-500 mt-2">
              Completa i tuoi allenamenti per vedere la frequenza settimanale
            </p>
          </div>
        )}
      </div>

      {/* Progressione Esercizi */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
          Progressione Esercizi
        </h3>
        {hasExerciseProgress ? (
          <div className="space-y-6">
            <div className="flex flex-wrap gap-2">
              {progressData.exerciseProgress.map((ex, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedExercise(ex.exercise)}
                  className={`px-3 py-1.5 text-sm rounded-full transition-colors ${
                    selectedExercise === ex.exercise
                      ? "bg-blue-500 text-white"
                      : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                  }`}
                >
                  {ex.exercise}
                </button>
              ))}
            </div>

            {selectedExerciseData && (
              <div>
                <div className="flex items-center mb-4">
                  <h4 className="text-md font-medium text-gray-700 dark:text-gray-300">
                    {selectedExerciseData.exercise}
                  </h4>
                  <span className="ml-2 px-2 py-0.5 text-xs rounded-full bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200">
                    {selectedExerciseData.muscleGroup}
                  </span>
                </div>

                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={exerciseChartData}>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      className="opacity-30"
                    />
                    <XAxis
                      dataKey="date"
                      tickFormatter={(value) => {
                        const date = new Date(value);
                        return `${date.getDate()}/${date.getMonth() + 1}`;
                      }}
                    />
                    <YAxis yAxisId="left" orientation="left" stroke="#3B82F6" />
                    <YAxis
                      yAxisId="right"
                      orientation="right"
                      stroke="#10B981"
                    />
                    <Tooltip
                      labelFormatter={(value) => {
                        const date = new Date(value);
                        return date.toLocaleDateString("it-IT");
                      }}
                    />
                    <Legend />
                    <Line
                      yAxisId="left"
                      type="monotone"
                      dataKey="weight"
                      stroke="#3B82F6"
                      name="Peso (kg)"
                      strokeWidth={2}
                      dot={{ fill: "#3B82F6", strokeWidth: 2, r: 4 }}
                    />
                    <Line
                      yAxisId="right"
                      type="monotone"
                      dataKey="reps"
                      stroke="#10B981"
                      name="Ripetizioni"
                      strokeWidth={2}
                      dot={{ fill: "#10B981", strokeWidth: 2, r: 4 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400">
              Nessun dato di progressione disponibile
            </p>
            <p className="text-sm text-gray-400 dark:text-gray-500 mt-2">
              Completa i tuoi allenamenti per vedere la progressione degli
              esercizi
            </p>
          </div>
        )}
      </div>

      {/* Record Personali */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
          Record Personali
        </h3>
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
                  {new Date(pb.achievedAt).toLocaleDateString("it-IT")}
                </p>
                {pb.muscleGroup && (
                  <p className="text-xs bg-blue-200 dark:bg-blue-800 text-blue-800 dark:text-blue-200 px-2 py-0.5 rounded-full inline-block mt-2">
                    {pb.muscleGroup}
                  </p>
                )}
                <p className="text-xs text-blue-600 dark:text-blue-400 font-medium mt-2">
                  Record Personale
                </p>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400">
              Nessun record personale disponibile
            </p>
            <p className="text-sm text-gray-400 dark:text-gray-500 mt-2">
              Completa i tuoi allenamenti per stabilire nuovi record
            </p>
          </div>
        )}
      </div>

      {/* Radar Chart delle Capacità */}
      {hasMuscleGroupData && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
            Analisi Capacità
          </h3>
          <div className="flex justify-center">
            <ResponsiveContainer width="100%" height={400}>
              <RadarChart
                cx="50%"
                cy="50%"
                outerRadius="80%"
                data={progressData.muscleGroups}
              >
                <PolarGrid />
                <PolarAngleAxis dataKey="name" />
                <PolarRadiusAxis />
                <Radar
                  name="Livello di Sviluppo"
                  dataKey="value"
                  stroke="#3B82F6"
                  fill="#3B82F6"
                  fillOpacity={0.6}
                />
                <Tooltip
                  formatter={(value) => [`Livello ${value}`, "Sviluppo"]}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
}
