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
import { API_BASE_URL } from "@/utils/config";
import { getValidToken } from "@/utils/auth";

import ProgressGraph from "./Progress_graph";

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

/* interface WorkoutSession {
  id: string;
  createdAt: string;
  exercises: {
    exerciseName: string;
    weightUsed: number;
    repsCompleted: string;
    setsCompleted: number;
  }[];
} */

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

// Giorni della settimana in italiano
const DAYS_OF_WEEK = [
  "Lunedì",
  "Martedì",
  "Mercoledì",
  "Giovedì",
  "Venerdì",
  "Sabato",
  "Domenica",
];

export default function Progress() {
  const [progressData, setProgressData] = useState<ProgressResponse>({
    weight: [],
    bodyFat: [],
    personalBests: [],
    muscleGroups: [],
    workoutFrequency: [],
    exerciseProgress: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedExercise, setSelectedExercise] = useState<string | null>(null);
  const [showGraph, setShowGraph] = useState(false);

  // Funzione per recuperare i dati di progresso
  const fetchProgressData = async () => {
    try {
      setLoading(true);
      const token = getValidToken();
      if (!token) {
        setError("Token non valido. Effettua nuovamente l'accesso.");
        setLoading(false);
        return;
      }

      // Recupera i dati di progresso (peso, grasso corporeo, record personali)
      const progressResponse = await fetch(`${API_BASE_URL}/api/progress`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!progressResponse.ok) {
        throw new Error(`Errore API progress: ${progressResponse.status}`);
      }

      const progressResponseData = await progressResponse.json();

      // Recupera i dati degli allenamenti
      const workoutsResponse = await fetch(`${API_BASE_URL}/api/workouts`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!workoutsResponse.ok) {
        throw new Error(`Errore API workouts: ${workoutsResponse.status}`);
      }

      const workoutsData = await workoutsResponse.json();

      // Elabora i dati degli allenamenti per ottenere informazioni sui gruppi muscolari e sulla frequenza
      const processedData = processWorkoutData(
        workoutsData,
        progressResponseData
      );
      setProgressData(processedData);

      // Imposta l'esercizio selezionato di default
      if (
        processedData.exerciseProgress &&
        processedData.exerciseProgress.length > 0
      ) {
        setSelectedExercise(
          (processedData.exerciseProgress[0] as ExerciseProgress).exercise
        );
      }

      setLoading(false);
    } catch (error) {
      console.error("Errore nel recupero dei dati di progresso:", error);
      setError(
        "Si è verificato un errore nel recupero dei dati. Riprova più tardi."
      );
      setLoading(false);
    }
  };

  // Funzione per elaborare i dati degli allenamenti
  interface WorkoutData {
    id: string;
    title: string;
    date: string;
    completed: boolean;
    exercises: {
      name: string;
      muscleGroup?: string;
      weight?: number;
      reps?: number | string;
    }[];
  }

  interface ProgressResponseData {
    weight?: WeightData[];
    bodyFat?: WeightData[];
    personalBests?: PersonalBest[];
  }

  // Poi nella funzione:
  const processWorkoutData = (
    workouts: WorkoutData[],
    progressData: ProgressResponseData
  ): ProgressResponse => {
    // Inizializza l'oggetto risultato con i dati di progresso esistenti
    const result: ProgressResponse = {
      weight: progressData.weight || [],
      bodyFat: progressData.bodyFat || [],
      personalBests: progressData.personalBests || [],
      muscleGroups: [],
      workoutFrequency: DAYS_OF_WEEK.map((day) => ({ day, count: 0 })),
      exerciseProgress: [],
    };

    // Aggiungi il gruppo muscolare ai record personali se disponibile
    if (result.personalBests.length > 0) {
      // Cerca di trovare il gruppo muscolare per ogni esercizio nei record personali
      result.personalBests = result.personalBests.map((pb) => {
        // Cerca l'esercizio in tutti gli allenamenti
        for (const workout of workouts) {
          if (workout.exercises) {
            const matchingExercise = workout.exercises.find(
              (ex) => ex.name?.toLowerCase() === pb.exercise.toLowerCase()
            );
            if (matchingExercise && matchingExercise.muscleGroup) {
              return { ...pb, muscleGroup: matchingExercise.muscleGroup };
            }
          }
        }
        return pb;
      });
    }

    // Mappa per tenere traccia dei gruppi muscolari e degli esercizi associati
    const muscleGroupMap = new Map();
    // Mappa per tenere traccia del progresso degli esercizi
    const exerciseProgressMap = new Map();

    // Elabora ogni allenamento
    for (const workout of workouts) {
      if (workout.completed && workout.date) {
        // Aggiorna la frequenza degli allenamenti
        const workoutDate = new Date(workout.date);
        const dayIndex =
          workoutDate.getDay() === 0 ? 6 : workoutDate.getDay() - 1; // Converti da 0-6 (domenica-sabato) a 0-6 (lunedì-domenica)
        result.workoutFrequency[dayIndex].count += 1;

        // Elabora gli esercizi dell'allenamento
        if (workout.exercises) {
          for (const exercise of workout.exercises) {
            // Aggiorna la mappa dei gruppi muscolari
            if (exercise.muscleGroup) {
              if (!muscleGroupMap.has(exercise.muscleGroup)) {
                muscleGroupMap.set(exercise.muscleGroup, {
                  name: exercise.muscleGroup,
                  value: 0,
                  exercises: [],
                });
              }
              const muscleGroup = muscleGroupMap.get(exercise.muscleGroup);
              muscleGroup.value += 1;
              if (!muscleGroup.exercises.includes(exercise.name)) {
                muscleGroup.exercises.push(exercise.name);
              }
            }

            // Aggiorna il progresso degli esercizi
            if (exercise.name) {
              if (!exerciseProgressMap.has(exercise.name)) {
                exerciseProgressMap.set(exercise.name, {
                  exercise: exercise.name,
                  muscleGroup: exercise.muscleGroup || "Altro",
                  dates: [],
                  weights: [],
                  reps: [],
                });
              }
              const progress = exerciseProgressMap.get(exercise.name);
              // Aggiungi solo se ci sono dati di peso e ripetizioni
              if (exercise.weight && exercise.reps) {
                progress.dates.push(workout.date);
                progress.weights.push(exercise.weight);
                progress.reps.push(parseInt(exercise.reps.toString()));
              }
            }
          }
        }
      }
    }

    // Converti le mappe in array
    result.muscleGroups = Array.from(muscleGroupMap.values()).sort(
      (a, b) => b.value - a.value
    ); // Ordina per valore decrescente

    result.exerciseProgress = Array.from(exerciseProgressMap.values())
      .filter((progress) => progress.dates.length > 0) // Filtra solo gli esercizi con dati
      .sort((a, b) => b.dates.length - a.dates.length); // Ordina per numero di date decrescente

    return result;
  };

  useEffect(() => {
    fetchProgressData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
            onClick={() => fetchProgressData()}
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
    <div className="space-y-8 p-6">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
        I Miei Progressi
      </h2>

      <button
        onClick={() => {
          setShowGraph(!showGraph);
        }}
      >Cambia grafico</button>

      {showGraph === true ? (
        <ProgressGraph />
      ) : (
        <>
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
                      progressData.weight[progressData.weight.length - 1]
                        ?.weight || "N/A"
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
                    <CartesianGrid
                      strokeDasharray="3 3"
                      className="opacity-30"
                    />
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
                          style={{
                            backgroundColor: COLORS[index % COLORS.length],
                          }}
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
                  Completa i tuoi allenamenti per vedere la frequenza
                  settimanale
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
                        <YAxis
                          yAxisId="left"
                          orientation="left"
                          stroke="#3B82F6"
                        />
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
        </>
      )}
    </div>
  );
}
