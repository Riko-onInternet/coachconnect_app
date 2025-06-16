import React, { useState, useEffect, useCallback } from "react";
import { ArrowLeft, Check, Edit3, Save, X } from "lucide-react";
import { API_BASE_URL } from "@/utils/config";

interface Exercise {
  id?: string;
  name: string;
  sets: number;
  reps: number;
  weight: number;
  notes?: string;
  completed?: boolean;
  actualWeight?: number;
  actualReps?: number;
  actualSets?: number;
}

interface Workout {
  id: string; // Cambiato da number a string
  title: string;
  date: string;
  completed: boolean;
  exercises: Exercise[];
}

interface WorkoutDetailProps {
  workoutId: string; // Cambiato da number a string
  onBack: () => void;
}

export default function WorkoutDetail({
  workoutId,
  onBack,
}: WorkoutDetailProps) {
  const [workout, setWorkout] = useState<Workout | null>(null);
  const [loading, setLoading] = useState(true);
  const [editingExercise, setEditingExercise] = useState<string | null>(null);
  const [exerciseProgress, setExerciseProgress] = useState<{
    [key: string]: Exercise;
  }>({});

  const fetchWorkoutDetail = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");
      console.log(`Tentativo di recuperare workout con ID: ${workoutId}`);

      const response = await fetch(
        `${API_BASE_URL}/api/workouts/${workoutId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setWorkout(data);

        // Prova a recuperare i progressi salvati
        try {
          const progressResponse = await fetch(
            `${API_BASE_URL}/api/workouts/${workoutId}/progress`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          if (progressResponse.ok) {
            const savedProgress = await progressResponse.json();
            // Applica i progressi salvati
            const progressWithSaved: { [key: string]: Exercise } = {};

            data.exercises.forEach((exercise: Exercise, index: number) => {
              const exerciseKey = `${exercise.name}-${index}`;
              const savedExercise = savedProgress.exercises?.find(
                (saved: { exerciseName: string }) => saved.exerciseName === exercise.name
              );

              progressWithSaved[exerciseKey] = {
                ...exercise,
                completed: savedExercise?.completed || false,
                actualWeight: savedExercise?.weightUsed || exercise.weight,
                actualReps: savedExercise?.repsCompleted || exercise.reps,
                actualSets: savedExercise?.setsCompleted || exercise.sets,
                notes: savedExercise?.notes || "",
              };
            });

            setExerciseProgress(progressWithSaved);
          } else {
            // Se non ci sono progressi salvati, inizializza normalmente
            // Funzione helper per inizializzare i progressi
          }
        } catch {
          console.log("Nessun progresso salvato trovato, inizializzo nuovo");
          initializeProgress(data);
        }
      } else {
        const errorData = await response.json();
        console.error("Errore dal server:", errorData);
        // Mostra un messaggio di errore più informativo
      }
    } catch (error) {
      console.error("Errore nel caricamento del workout:", error);
    } finally {
      setLoading(false);
    }
  }, [workoutId]);

  useEffect(() => {
    fetchWorkoutDetail();
  }, [fetchWorkoutDetail]);

  const updateExerciseProgress = (
    exerciseKey: string,
    updates: Partial<Exercise>
  ) => {
    setExerciseProgress((prev) => ({
      ...prev,
      [exerciseKey]: {
        ...prev[exerciseKey],
        ...updates,
      },
    }));
  };

  const toggleExerciseComplete = (exerciseKey: string) => {
    const currentProgress = exerciseProgress[exerciseKey];
    updateExerciseProgress(exerciseKey, {
      completed: !currentProgress.completed,
    });
  };

  const saveWorkoutProgress = async () => {
    try {
      const token = localStorage.getItem("token");
      const progressData = {
        workoutId,
        exercises: Object.entries(exerciseProgress).map(([, exercise]) => ({
          exerciseName: exercise.name,
          completed: exercise.completed,
          actualSets: exercise.actualSets,
          actualReps: exercise.actualReps,
          actualWeight: exercise.actualWeight,
          notes: exercise.notes,
        })),
      };

      const response = await fetch(
        `${API_BASE_URL}/api/workouts/${workoutId}/progress`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(progressData),
        }
      );

      if (response.ok) {
        alert("Progresso salvato con successo!");
      }
    } catch (error) {
      console.error("Errore nel salvataggio del progresso:", error);
      alert("Errore nel salvataggio del progresso");
    }
  };

  const isWorkoutCompleted = () => {
    return Object.values(exerciseProgress).every(
      (exercise) => exercise.completed
    );
  };

  const initializeProgress = (data: { exercises: Exercise[] }) => {
    const initialProgress: { [key: string]: Exercise } = {};
    data.exercises.forEach((exercise: Exercise, index: number) => {
      const exerciseKey = `${exercise.name}-${index}`;
      initialProgress[exerciseKey] = {
        ...exercise,
        completed: false,
        actualWeight: exercise.weight,
        actualReps: exercise.reps,
        actualSets: exercise.sets,
        notes: "",
      };
    });
    setExerciseProgress(initialProgress);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!workout) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600 dark:text-gray-300">
          Allenamento non trovato
        </p>
        <button
          onClick={onBack}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
        >
          Torna indietro
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={onBack}
            className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold">{workout.title}</h1>
            <p className="text-gray-600 dark:text-gray-300">
              {new Date(workout.date).toLocaleDateString()}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <div
            className={`px-3 py-1 rounded-full text-sm ${
              isWorkoutCompleted()
                ? "bg-green-100 text-green-800"
                : "bg-yellow-100 text-yellow-800"
            }`}
          >
            {isWorkoutCompleted() ? "Completato" : "In corso"}
          </div>

          <button
            onClick={saveWorkoutProgress}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 flex items-center space-x-2"
          >
            <Save className="h-4 w-4" />
            <span>Salva Progresso</span>
          </button>
        </div>
      </div>

      {/* Esercizi */}
      <div className="space-y-4">
        {workout.exercises.map((exercise, index) => {
          const exerciseKey = `${exercise.name}-${index}`;
          const progress = exerciseProgress[exerciseKey] || exercise;
          const isEditing = editingExercise === exerciseKey;

          return (
            <div
              key={exerciseKey}
              className={`bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 border-l-4 ${
                progress.completed
                  ? "border-green-500 bg-green-50 dark:bg-green-900/20"
                  : "border-blue-500"
              }`}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => toggleExerciseComplete(exerciseKey)}
                    className={`p-2 rounded-full ${
                      progress.completed
                        ? "bg-green-500 text-white"
                        : "bg-gray-200 dark:bg-gray-600 text-gray-600 dark:text-gray-300"
                    }`}
                  >
                    <Check className="h-4 w-4" />
                  </button>
                  <h3
                    className={`text-lg font-semibold ${
                      progress.completed ? "line-through text-gray-500" : ""
                    }`}
                  >
                    {exercise.name}
                  </h3>
                </div>

                <button
                  onClick={() =>
                    setEditingExercise(isEditing ? null : exerciseKey)
                  }
                  className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600"
                >
                  {isEditing ? (
                    <X className="h-4 w-4" />
                  ) : (
                    <Edit3 className="h-4 w-4" />
                  )}
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                {/* Serie */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Serie
                  </label>
                  {isEditing ? (
                    <input
                      type="number"
                      value={progress.actualSets}
                      onChange={(e) =>
                        updateExerciseProgress(exerciseKey, {
                          actualSets: parseInt(e.target.value) || 0,
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700"
                    />
                  ) : (
                    <div className="px-3 py-2 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      {progress.actualSets} / {exercise.sets}
                    </div>
                  )}
                </div>

                {/* Ripetizioni */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Ripetizioni
                  </label>
                  {isEditing ? (
                    <input
                      type="number"
                      value={progress.actualReps}
                      onChange={(e) =>
                        updateExerciseProgress(exerciseKey, {
                          actualReps: parseInt(e.target.value) || 0,
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700"
                    />
                  ) : (
                    <div className="px-3 py-2 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      {progress.actualReps} / {exercise.reps}
                    </div>
                  )}
                </div>

                {/* Peso */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Peso (kg)
                  </label>
                  {isEditing ? (
                    <input
                      type="number"
                      step="0.5"
                      value={progress.actualWeight}
                      onChange={(e) =>
                        updateExerciseProgress(exerciseKey, {
                          actualWeight: parseFloat(e.target.value) || 0,
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700"
                    />
                  ) : (
                    <div className="px-3 py-2 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      {progress.actualWeight} / {exercise.weight} kg
                    </div>
                  )}
                </div>
              </div>

              {/* Note */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Note personali
                </label>
                {isEditing ? (
                  <textarea
                    value={progress.notes || ""}
                    onChange={(e) =>
                      updateExerciseProgress(exerciseKey, {
                        notes: e.target.value,
                      })
                    }
                    placeholder="Aggiungi note sull'esercizio..."
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700"
                    rows={3}
                  />
                ) : (
                  <div className="px-3 py-2 bg-gray-50 dark:bg-gray-700 rounded-lg min-h-[80px]">
                    {progress.notes || "Nessuna nota"}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Riepilogo */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <h3 className="text-lg font-semibold mb-4">Riepilogo Allenamento</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-500">
              {
                Object.values(exerciseProgress).filter((ex) => ex.completed)
                  .length
              }
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-300">
              Esercizi completati
            </div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-500">
              {workout.exercises.length}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-300">
              Esercizi totali
            </div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-500">
              {Math.round(
                (Object.values(exerciseProgress).filter((ex) => ex.completed)
                  .length /
                  workout.exercises.length) *
                  100
              )}
              %
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-300">
              Completamento
            </div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-500">
              {Object.values(exerciseProgress).reduce(
                (total, ex) => total + (ex.actualSets || 0),
                0
              )}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-300">
              Serie totali
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
