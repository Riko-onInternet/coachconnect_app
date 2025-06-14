import { X, Plus, ChevronDown, ChevronUp, Trash2, Calendar } from 'lucide-react';
import { Client, Exercise, ExerciseInPlan, WorkoutPlan } from '@/types/workout';

interface WorkoutPlanFormProps {
  isEdit: boolean;
  clients: Client[];
  exercises: Exercise[];
  selectedPlan: WorkoutPlan | null;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
  formData: {
    name: string;
    description: string;
    clientId: string;
    startDate: string;
    endDate: string;
    isActive: boolean;
  };
  setFormData: React.Dispatch<React.SetStateAction<{
    name: string;
    description: string;
    clientId: string;
    startDate: string;
    endDate: string;
    isActive: boolean;
  }>>;
  exercisesByDay: {
    [key: number]: ExerciseInPlan[];
  };
  newExercise: {
    exerciseId: string;
    day: number;
    sets: number;
    reps: string;
    weight: string;
    notes: string;
  };
  setNewExercise: React.Dispatch<React.SetStateAction<{
    exerciseId: string;
    day: number;
    sets: number;
    reps: string;
    weight: string;
    notes: string;
  }>>;
  addExerciseToDay: () => void;
  removeExerciseFromDay: (day: number, exerciseIndex: number) => void;
  expandedDays: number[];
  toggleDayExpansion: (day: number) => void;
  getDayName: (day: number) => string;
}

export default function WorkoutPlanForm({
  isEdit,
  clients,
  exercises,
  onClose,
  onSubmit,
  formData,
  setFormData,
  exercisesByDay,
  newExercise,
  setNewExercise,
  addExerciseToDay,
  removeExerciseFromDay,
  expandedDays,
  toggleDayExpansion,
  getDayName
}: WorkoutPlanFormProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white dark:bg-gray-800 z-10 flex justify-between items-center p-5 border-b border-gray-100 dark:border-gray-700">
          <h3 className="text-xl font-semibold text-gray-800 dark:text-white">
            {isEdit ? "Modifica Scheda di Allenamento" : "Crea Nuova Scheda di Allenamento"}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={onSubmit} className="p-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Nome Scheda
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Cliente
              </label>
              <select
                value={formData.clientId}
                onChange={(e) => setFormData({ ...formData, clientId: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                required
              >
                <option value="">Seleziona un cliente</option>
                {clients.map(client => (
                  <option key={client.id} value={client.id}>
                    {client.firstName} {client.lastName}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Data Inizio
              </label>
              <input
                type="date"
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Data Fine (opzionale)
              </label>
              <input
                type="date"
                value={formData.endDate}
                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Descrizione
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                rows={3}
              />
            </div>

            <div className="md:col-span-2 flex items-center">
              <input
                type="checkbox"
                id={isEdit ? "isActiveEdit" : "isActive"}
                checked={formData.isActive}
                onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor={isEdit ? "isActiveEdit" : "isActive"} className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                Scheda attiva
              </label>
            </div>
          </div>

          <div className="border-t border-gray-200 dark:border-gray-700 pt-6 mb-6">
            <h4 className="text-lg font-medium mb-4">Aggiungi Esercizi</h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Giorno
                </label>
                <select
                  value={newExercise.day}
                  onChange={(e) => setNewExercise({ ...newExercise, day: parseInt(e.target.value) })}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                >
                  {[1, 2, 3, 4, 5, 6, 7].map(day => (
                    <option key={day} value={day}>{getDayName(day)}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Esercizio
                </label>
                <select
                  value={newExercise.exerciseId}
                  onChange={(e) => setNewExercise({ ...newExercise, exerciseId: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                >
                  <option value="">Seleziona un esercizio</option>
                  {exercises.map(exercise => (
                    <option key={exercise.id} value={exercise.id}>
                      {exercise.name} ({exercise.muscleGroup})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Serie
                </label>
                <input
                  type="number"
                  min="1"
                  value={newExercise.sets}
                  onChange={(e) => setNewExercise({ ...newExercise, sets: parseInt(e.target.value) })}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Ripetizioni
                </label>
                <input
                  type="text"
                  value={newExercise.reps}
                  onChange={(e) => setNewExercise({ ...newExercise, reps: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                  placeholder="es. 10 o 8-12"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Peso (kg, opzionale)
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.5"
                  value={newExercise.weight}
                  onChange={(e) => setNewExercise({ ...newExercise, weight: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                />
              </div>

              <div className="md:col-span-2 lg:col-span-3">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Note (opzionale)
                </label>
                <input
                  type="text"
                  value={newExercise.notes}
                  onChange={(e) => setNewExercise({ ...newExercise, notes: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                  placeholder="es. Pausa 60s tra le serie"
                />
              </div>
            </div>

            <button
              type="button"
              onClick={addExerciseToDay}
              disabled={!newExercise.exerciseId}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <Plus size={16} /> Aggiungi Esercizio
            </button>
          </div>

          {/* Visualizza esercizi aggiunti per giorno */}
          {Object.keys(exercisesByDay).length > 0 && (
            <div className="border-t border-gray-200 dark:border-gray-700 pt-6 mb-6">
              <h4 className="text-lg font-medium mb-4">Esercizi Aggiunti</h4>
              
              {Object.entries(exercisesByDay)
                .sort(([dayA], [dayB]) => parseInt(dayA) - parseInt(dayB))
                .map(([day, exercises]) => (
                  <div key={day} className="mb-4 border rounded-lg p-4">
                    <div 
                      className="flex justify-between items-center cursor-pointer"
                      onClick={() => toggleDayExpansion(parseInt(day))}
                    >
                      <h5 className="font-medium flex items-center gap-2">
                        <Calendar size={16} /> {getDayName(parseInt(day))}
                      </h5>
                      <button type="button" className="text-gray-500">
                        {expandedDays.includes(parseInt(day)) ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                      </button>
                    </div>
                    
                    {expandedDays.includes(parseInt(day)) && (
                      <div className="mt-3 space-y-3 pl-2">
                        {exercises.map((exercise, index) => (
                          <div key={index} className="flex justify-between items-center border-b pb-2">
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
                            <button
                              type="button"
                              onClick={() => removeExerciseFromDay(parseInt(day), index)}
                              className="text-red-500 hover:text-red-700 transition-colors"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
            </div>
          )}

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              Annulla
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200"
            >
              {isEdit ? "Salva Modifiche" : "Crea Scheda"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}