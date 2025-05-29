import { useState, useEffect } from "react";

interface WorkoutPlan {
  id: string;
  name: string;
  description: string;
  clientName: string;
  startDate: string;
  endDate?: string;
  isActive: boolean;
  exercises: Exercise[];
}

interface Exercise {
  id: string;
  exerciseName: string;
  muscleGroup: string;
  sets: number;
  reps: string;
  weight?: number;
  restTime?: number;
  notes?: string;
  order: number;
}

export default function WorkoutPlans() {
  const [workoutPlans, setWorkoutPlans] = useState<WorkoutPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddPlanModal, setShowAddPlanModal] = useState(false);

  useEffect(() => {
    const fetchWorkoutPlans = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch("http://localhost:3000/api/trainer/workout-plans", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();
        setWorkoutPlans(data);
      } catch (error) {
        console.error("Errore nel caricamento delle schede:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchWorkoutPlans();
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
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Schede di Allenamento</h2>
        <button
          onClick={() => setShowAddPlanModal(true)}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          + Crea Nuova Scheda
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {workoutPlans.map((plan) => (
          <div
            key={plan.id}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-lg"
          >
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-semibold">{plan.name}</h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Cliente: {plan.clientName}
                  </p>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-sm ${
                    plan.isActive
                      ? "bg-green-100 text-green-800"
                      : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {plan.isActive ? "Attiva" : "Inattiva"}
                </span>
              </div>

              <p className="text-gray-600 dark:text-gray-400 mb-4">
                {plan.description}
              </p>

              <div className="space-y-2 text-sm">
                <p>
                  <span className="font-medium">Data inizio:</span>{" "}
                  {new Date(plan.startDate).toLocaleDateString()}
                </p>
                {plan.endDate && (
                  <p>
                    <span className="font-medium">Data fine:</span>{" "}
                    {new Date(plan.endDate).toLocaleDateString()}
                  </p>
                )}
              </div>
            </div>

            <div className="border-t border-gray-200 dark:border-gray-700 p-6">
              <h4 className="font-medium mb-4">Esercizi</h4>
              <div className="space-y-3">
                {plan.exercises.map((exercise) => (
                  <div
                    key={exercise.id}
                    className="flex justify-between items-center"
                  >
                    <div>
                      <p className="font-medium">{exercise.exerciseName}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {exercise.sets} serie x {exercise.reps}
                        {exercise.weight ? ` @ ${exercise.weight}kg` : ""}
                      </p>
                    </div>
                    <span className="text-sm text-gray-500">
                      {exercise.muscleGroup}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}