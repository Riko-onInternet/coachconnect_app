import { useState, useEffect } from "react";
import { API_BASE_URL } from "@/utils/config";

interface Workout {
  id: number;
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

  useEffect(() => {
    const fetchWorkouts = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(`${API_BASE_URL}/api/workouts`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();
        setWorkouts(data);
      } catch (error) {
        console.error("Errore nel caricamento degli allenamenti:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchWorkouts();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">I Miei Allenamenti</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {workouts.map((workout) => (
          <div
            key={workout.id}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6"
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">{workout.title}</h3>
              <span
                className={`px-3 py-1 rounded-full text-sm ${
                  workout.completed
                    ? "bg-green-100 text-green-800"
                    : "bg-yellow-100 text-yellow-800"
                }`}
              >
                {workout.completed ? "Completato" : "Da fare"}
              </span>
            </div>
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
          </div>
        ))}
      </div>
    </div>
  );
}