import { WorkoutPlan } from '@/types/workout';
import { Edit, Trash2 } from 'lucide-react';

interface WorkoutPlanCardProps {
  plan: WorkoutPlan;
  onEdit: (plan: WorkoutPlan) => void;
  onDelete: (planId: string) => void;
  getDayName: (day: number) => string;
}

export default function WorkoutPlanCard({ plan, onEdit, onDelete, getDayName }: WorkoutPlanCardProps) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg">
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-lg font-semibold">{plan.name}</h3>
            <p className="text-gray-600 dark:text-gray-400">
              Cliente: {plan.clientName}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span
              className={`px-3 py-1 rounded-full text-sm ${plan.isActive
                ? "bg-green-100 text-green-800"
                : "bg-gray-100 text-gray-800"
                }`}
            >
              {plan.isActive ? "Attiva" : "Inattiva"}
            </span>
            <button 
              onClick={() => onEdit(plan)}
              className="p-1 text-blue-500 hover:text-blue-700 transition-colors"
            >
              <Edit size={16} />
            </button>
            <button 
              onClick={() => onDelete(plan.id)}
              className="p-1 text-red-500 hover:text-red-700 transition-colors"
            >
              <Trash2 size={16} />
            </button>
          </div>
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
        
        {/* Raggruppa gli esercizi per giorno */}
        {Array.from(new Set(plan.exercises.map(ex => ex.day)))
          .sort((a, b) => (a ?? 0) - (b ?? 0))
          .map(day => (
            <div key={day} className="mb-4 border-b border-gray-100 dark:border-gray-700 pb-3">
              <h5 className="font-medium text-sm text-gray-700 dark:text-gray-300 mb-2">
                {getDayName(day ?? 0)}
              </h5>
              <div className="space-y-3 pl-2">
                {plan.exercises
                  .filter(ex => ex.day === day)
                  .sort((a, b) => a.order - b.order)
                  .map((exercise) => (
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
                        {exercise.notes && (
                          <p className="text-xs text-gray-500 italic mt-1">{exercise.notes}</p>
                        )}
                      </div>
                      <span className="text-sm text-gray-500">
                        {exercise.muscleGroup}
                      </span>
                    </div>
                  ))}
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}