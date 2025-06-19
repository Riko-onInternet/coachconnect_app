/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useEffect } from "react";
import { API_BASE_URL } from "@/utils/config";
import { getValidToken } from "@/utils/auth";
import WorkoutDetail from "./WorkoutDetail";

interface Workout {
  id: string; // Cambiato da number a string
  title: string;
  date: string;
  completed: boolean;
  exercises: Exercise[];
}

interface Exercise {
  name: string;
  sets: number;
  reps: number;
  weight: number;
}

export default function MyWorkouts() {
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedWorkoutId, setSelectedWorkoutId] = useState<string | null>(
    null
  ); // Cambiato da number a string

  const fetchWorkouts = async () => {
    try {
      setLoading(true);
      const token = getValidToken();
      if (!token) {
        console.error("Token non valido");
        setLoading(false);
        return;
      }

      const response = await fetch(`${API_BASE_URL}/api/workouts`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Errore API: ${response.status}`);
      }

      const data = await response.json();
      console.log("Dati ricevuti dall'API:", data); // Aggiungi questo log

      // Verifica che data sia un array prima di usarlo
      const workoutsArray = Array.isArray(data) ? data : [];

      setWorkouts(workoutsArray);
    } catch (error) {
      console.error("Errore nel caricamento degli allenamenti:", error);
      // Imposta un array vuoto in caso di errore
      setWorkouts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWorkouts();
  }, []);

  // Se è selezionato un workout, mostra la schermata dettagliata
  if (selectedWorkoutId) {
    return (
      <WorkoutDetail
        workoutId={selectedWorkoutId}
        onBack={() => {
          setSelectedWorkoutId(null);
          setTimeout(() => {
            fetchWorkouts();
          }, 1000); // Aumenta a 1000ms
        }}
      />
    );
  }

  // Aggiungi questa funzione
  const updateWorkoutStatus = (workoutId: string, completed: boolean) => {
    setWorkouts((prevWorkouts) =>
      prevWorkouts.map((workout) =>
        workout.id === workoutId ? { ...workout, completed } : workout
      )
    );
  };

  // Passa la funzione al componente WorkoutDetail
  if (selectedWorkoutId) {
    return (
      <WorkoutDetail
        workoutId={selectedWorkoutId}
        onBack={() => {
          setSelectedWorkoutId(null);
          setTimeout(() => {
            fetchWorkouts();
          }, 300);
        }}
        onStatusUpdate={updateWorkoutStatus} // Aggiungi questa prop
      />
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">I Miei Allenamenti</h2>

      {workouts.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 text-center">
          <p className="text-gray-600 dark:text-gray-300">
            Non hai ancora allenamenti assegnati. Il tuo trainer ti assegnerà
            presto un programma di allenamento.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {workouts.map((workout) => (
            <div
              key={workout.id}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 cursor-pointer hover:shadow-xl transition-shadow"
              onClick={() => setSelectedWorkoutId(workout.id)}
            >
              <h3 className="text-lg font-semibold">{workout.title}</h3>

              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Data: {new Date(workout.date).toLocaleDateString()}
              </p>
              <div className="space-y-3">
                {workout.exercises.map((exercise, index) => (
                  <div
                    key={index}
                    className="border-t border-gray-200 dark:border-gray-700 pt-3"
                  >
                    <h4 className="font-medium">{exercise.name}</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {exercise.sets} serie x {exercise.reps} ripetizioni @{" "}
                      {exercise.weight}kg
                    </p>
                  </div>
                ))}
              </div>

              <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                <button className="w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
                  Inizia Allenamento
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
