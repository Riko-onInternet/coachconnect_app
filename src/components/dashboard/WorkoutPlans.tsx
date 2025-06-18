import React, { useState, useEffect } from "react";
import {
  X,
  Plus,
  User,
  Dumbbell,
  List,
  ChevronRight,
  Trash2,
} from "lucide-react";
import { API_BASE_URL } from "@/utils/config";
import { getValidToken } from "@/utils/auth";
import { Client, Exercise, ExerciseInPlan, WorkoutPlan } from "@/types/workout";

interface ExerciseList {
  id: string;
  name: string;
  clientId: string;
  exercises: ExerciseInPlan[];
  createdAt: string;
}

export default function WorkoutPlans() {
  const [clients, setClients] = useState<Client[]>([]);
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [exerciseLists, setExerciseLists] = useState<ExerciseList[]>([]);
  const [workoutPlans, setWorkoutPlans] = useState<WorkoutPlan[]>([]); // Nuovo stato
  const [loading, setLoading] = useState(true);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [showCreateListModal, setShowCreateListModal] = useState(false);
  const [showAddExerciseModal, setShowAddExerciseModal] = useState(false);
  const [selectedList, setSelectedList] = useState<ExerciseList | null>(null);

  // Form data per nuova lista
  const [listFormData, setListFormData] = useState({
    name: "",
  });

  // Form data per nuovo esercizio
  const [exerciseFormData, setExerciseFormData] = useState({
    exerciseId: "",
    sets: 3,
    reps: "10",
    weight: "",
    notes: "",
  });

  useEffect(() => {
    fetchClients();
    fetchExercises();
    fetchExerciseLists();
    fetchWorkoutPlans();
  }, []);

  // Funzione fetchWorkoutPlans
  const fetchWorkoutPlans = async () => {
    try {
      const token = getValidToken();
      if (!token) {
        console.error("Token non valido");
        return;
      }
      
      const response = await fetch(
        `${API_BASE_URL}/api/trainer/workout-plans`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      setWorkoutPlans(data);
    } catch (error) {
      console.error("Errore nel caricamento dei piani di allenamento:", error);
      setWorkoutPlans([]);
    }
  };

  // Funzione handleDeleteWorkoutPlan
  const handleDeleteWorkoutPlan = async (planId: string) => {
    if (!confirm("Sei sicuro di voler ritirare questo piano di allenamento?")) {
      return;
    }
  
    try {
      const token = getValidToken();
      if (!token) {
        alert("Token non valido. Effettua nuovamente il login.");
        return;
      }
      
      const response = await fetch(
        `${API_BASE_URL}/api/trainer/workout-plans/${planId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
  
      if (response.ok) {
        alert("Piano di allenamento ritirato con successo!");
        setWorkoutPlans(workoutPlans.filter((plan) => plan.id !== planId));
      } else {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } catch (error) {
      console.error("Errore nel ritiro del piano:", error);
      alert("Errore nel ritiro del piano di allenamento");
    }
  };

  // Funzione fetchClients
  const fetchClients = async () => {
    try {
      const token = getValidToken();
      if (!token) {
        console.error("Token non valido");
        setLoading(false);
        return;
      }
      
      const response = await fetch(`${API_BASE_URL}/api/trainer/clients`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      setClients(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Errore nel caricamento dei clienti:", error);
      setClients([]);
    } finally {
      setLoading(false);
    }
  };
  

  const fetchExercises = async () => {
    try {
      const token = getValidToken();
      if (!token) {
        console.error("Token non valido");
        return;
      }
      
      const response = await fetch(`${API_BASE_URL}/api/exercises`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      setExercises(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Errore nel caricamento degli esercizi:", error);
      setExercises([]);
    }
  };

  const fetchExerciseLists = async () => {
    try {
      const token = getValidToken();
      if (!token) {
        console.error("Token non valido");
        return;
      }
      
      const response = await fetch(
        `${API_BASE_URL}/api/trainer/exercise-lists`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      setExerciseLists(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Errore nel caricamento delle liste esercizi:", error);
      setExerciseLists([]);
    }
  };

  const handleCreateList = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedClient) return;

    try {
      const token = getValidToken();
      if (!token) {
        alert("Token non valido. Effettua nuovamente il login.");
        return;
      }
      
      const response = await fetch(
        `${API_BASE_URL}/api/trainer/exercise-lists`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            name: listFormData.name,
            clientId: selectedClient.id,
            exercises: [],
          }),
        }
      );

      if (response.ok) {
        const newList = await response.json();
        setExerciseLists([...exerciseLists, newList]);
        setListFormData({ name: "" });
        setShowCreateListModal(false);
      } else {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } catch (error) {
      console.error("Errore nella creazione della lista:", error);
      alert("Errore nella creazione della lista");
    }
  };

  const handleAddExercise = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedList) return;

    const selectedExercise = exercises.find(
      (ex) => ex.id === exerciseFormData.exerciseId
    );
    if (!selectedExercise) return;

    const newExercise: ExerciseInPlan = {
      id: "",
      exerciseName: selectedExercise.name,
      muscleGroup: selectedExercise.muscleGroup,
      sets: exerciseFormData.sets,
      reps: exerciseFormData.reps,
      weight: exerciseFormData.weight
        ? parseFloat(exerciseFormData.weight)
        : undefined,
      notes: exerciseFormData.notes || undefined,
      order: selectedList.exercises.length + 1,
      listName: selectedList.name,
    };

    try {
      const token = getValidToken();
      if (!token) {
        alert("Token non valido. Effettua nuovamente il login.");
        return;
      }
      
      const response = await fetch(
        `${API_BASE_URL}/api/trainer/exercise-lists/${selectedList.id}/exercises`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(newExercise),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      if (response.ok) {
        const updatedList = await response.json();
        setExerciseLists(
          exerciseLists.map((list) =>
            list.id === updatedList.id ? updatedList : list
          )
        );
        setExerciseFormData({
          exerciseId: "",
          sets: 3,
          reps: "10",
          weight: "",
          notes: "",
        });
        setShowAddExerciseModal(false);
      }
    } catch (error) {
      console.error("Errore nell'aggiunta dell'esercizio:", error);
    }
  };

  const getClientLists = (clientId: string) => {
    return exerciseLists.filter((list) => list.clientId === clientId);
  };

  // Aggiungi questa funzione mancante
  const getClientWorkoutPlans = (clientId: string) => {
    return workoutPlans.filter((plan) => plan.clientId === clientId);
  };

  const removeExercise = async (listId: string, exerciseIndex: number) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${API_BASE_URL}/api/trainer/exercise-lists/${listId}/exercises/${exerciseIndex}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        const updatedList = await response.json();
        setExerciseLists(
          exerciseLists.map((list) =>
            list.id === updatedList.id ? updatedList : list
          )
        );
      }
    } catch (error) {
      console.error("Errore nella rimozione dell'esercizio:", error);
    }
  };

  // Funzione per assegnare un piano di allenamento
  const assignWorkoutPlan = async (list: ExerciseList, clientId: string) => {
    if (!selectedClient) return;
  
    try {
      const token = getValidToken();
      if (!token) {
        console.error("Token non valido");
        return;
      }
      
      const response = await fetch(
        `${API_BASE_URL}/api/trainer/workout-plans`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            name: list.name,
            description: `Piano di allenamento basato sulla lista: ${list.name}`,
            startDate: new Date().toISOString(),
            endDate: null,
            isActive: true,
            clientId: clientId,
            exercises: list.exercises.map((exercise, index) => ({
              exerciseName: exercise.exerciseName, // Cambiato da exerciseId
              muscleGroup: exercise.muscleGroup,   // Aggiunto campo mancante
              sets: exercise.sets,
              reps: exercise.reps,
              weight: exercise.weight,
              notes: exercise.notes,
              order: index + 1,
            })),
          }),
        }
      );

      if (response.ok) {
        const newPlan = await response.json();
        alert("Piano di allenamento assegnato con successo!");
        // Aggiorna la lista dei piani
        setWorkoutPlans([...workoutPlans, newPlan]);
      } else {
        alert("Errore nell'assegnazione del piano di allenamento");
      }
    } catch (error) {
      console.error("Errore nell'assegnazione del piano:", error);
      alert("Errore nell'assegnazione del piano di allenamento");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // Vista principale: lista clienti
  if (!selectedClient) {
    return (
      <div className="space-y-6 p-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
            Liste Esercizi Clienti
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {clients.map((client) => {
            const clientLists = getClientLists(client.id);
            return (
              <div
                key={client.id}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-700"
              >
                <div className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                      <User className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                        {client.firstName} {client.lastName}
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {client.email}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {clientLists.length > 0 ? (
                      <>
                        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                          <List className="w-4 h-4" />
                          <span>
                            {clientLists.length} lista
                            {clientLists.length !== 1 ? "e" : ""} di esercizi
                          </span>
                        </div>
                        <button
                          onClick={() => setSelectedClient(client)}
                          className="w-full px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-200 flex items-center justify-center gap-2 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                        >
                          <span>Gestisci Liste</span>
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      </>
                    ) : (
                      <>
                        <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-4">
                          Nessuna lista di esercizi
                        </p>
                        <button
                          onClick={() => {
                            setSelectedClient(client);
                            setShowCreateListModal(true);
                          }}
                          className="w-full px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg hover:from-green-600 hover:to-emerald-700 transition-all duration-200 flex items-center justify-center gap-2 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                        >
                          <Plus className="w-4 h-4" />
                          <span>Aggiungi Lista Esercizi</span>
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // Vista dettaglio cliente: gestione liste
  const clientLists = getClientLists(selectedClient.id);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setSelectedClient(null)}
            className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
          >
            <ChevronRight className="w-5 h-5 rotate-180" />
          </button>
          <div>
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
              {selectedClient.firstName} {selectedClient.lastName}
            </h2>
            <p className="text-gray-500 dark:text-gray-400">
              Gestione Liste Esercizi
            </p>
          </div>
        </div>
        <button
          onClick={() => setShowCreateListModal(true)}
          className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-200 flex items-center gap-2 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
        >
          <Plus className="w-4 h-4" />
          <span>Nuova Lista</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 my-4">
        {clientLists.map((list) => (
          <div
            key={list.id}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700"
          >
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center">
                    <Dumbbell className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                      {list.name}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {list.exercises.length} esercizi
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setSelectedList(list);
                    setShowAddExerciseModal(true);
                  }}
                  className="p-2 text-blue-500 hover:text-blue-700 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-3 max-h-64 overflow-y-auto">
                {list.exercises.map((exercise, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
                  >
                    <div>
                      <p className="font-medium text-gray-800 dark:text-white">
                        {exercise.exerciseName}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {exercise.sets} serie x {exercise.reps}
                        {exercise.weight ? ` @ ${exercise.weight}kg` : ""}
                      </p>
                      {exercise.notes && (
                        <p className="text-xs text-gray-500 italic mt-1">
                          {exercise.notes}
                        </p>
                      )}
                    </div>
                    <button
                      onClick={() => removeExercise(list.id, index)}
                      className="text-red-500 hover:text-red-700 p-1 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
                {list.exercises.length === 0 && (
                  <p className="text-center text-gray-500 dark:text-gray-400 py-8">
                    Nessun esercizio in questa lista
                  </p>
                )}
              </div>

              {list.exercises.length > 0 && (
                <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-600">
                  <button
                    onClick={() => assignWorkoutPlan(list, selectedClient.id)}
                    className="w-full px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg hover:from-green-600 hover:to-emerald-700 transition-all duration-200 flex items-center justify-center gap-2 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                  >
                    <Dumbbell className="w-4 h-4" />
                    <span>Assegna come Piano di Allenamento</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Sezione Piani di Allenamento Assegnati */}
      {selectedClient && (
        <div className="mt-8">
          <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">
            Piani di Allenamento Assegnati a {selectedClient.firstName} {selectedClient.lastName}
          </h3>
          
          {getClientWorkoutPlans(selectedClient.id).length === 0 ? (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 text-center">
              <p className="text-gray-600 dark:text-gray-300">
                Nessun piano di allenamento assegnato a questo cliente.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {getClientWorkoutPlans(selectedClient.id).map((plan) => (
                <div
                  key={plan.id}
                  className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h4 className="text-lg font-semibold text-gray-800 dark:text-white">
                        {plan.name}
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {plan.description}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span
                        className={`px-3 py-1 rounded-full text-sm ${
                          plan.isActive
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {plan.isActive ? "Attivo" : "Inattivo"}
                      </span>
                      <button
                        onClick={() => handleDeleteWorkoutPlan(plan.id)}
                        className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                        title="Ritira piano di allenamento"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      <strong>Data inizio:</strong> {new Date(plan.startDate).toLocaleDateString()}
                    </p>
                    {plan.endDate && (
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        <strong>Data fine:</strong> {new Date(plan.endDate).toLocaleDateString()}
                      </p>
                    )}
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      <strong>Esercizi:</strong> {plan.exercises.length}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Modal per creare nuova lista */}
      {showCreateListModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-md w-full">
            <div className="flex justify-between items-center p-6 border-b border-gray-100 dark:border-gray-700">
              <h3 className="text-xl font-semibold text-gray-800 dark:text-white">
                Nuova Lista Esercizi
              </h3>
              <button
                onClick={() => setShowCreateListModal(false)}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateList} className="p-6">
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Nome Lista
                </label>
                <input
                  type="text"
                  value={listFormData.name}
                  onChange={(e) => setListFormData({ name: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                  placeholder="es. Allenamento Petto e Tricipiti"
                  required
                />
              </div>

              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowCreateListModal(false)}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  Annulla
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                >
                  Crea Lista
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal per aggiungere esercizio */}
      {showAddExerciseModal && selectedList && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-lg w-full">
            <div className="flex justify-between items-center p-6 border-b border-gray-100 dark:border-gray-700">
              <h3 className="text-xl font-semibold text-gray-800 dark:text-white">
                Aggiungi Esercizio a {selectedList.name}
              </h3>
              <button
                onClick={() => setShowAddExerciseModal(false)}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddExercise} className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Esercizio
                  </label>
                  <select
                    value={exerciseFormData.exerciseId}
                    onChange={(e) =>
                      setExerciseFormData({
                        ...exerciseFormData,
                        exerciseId: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                    required
                  >
                    <option value="">Seleziona un esercizio</option>
                    {exercises.map((exercise) => (
                      <option key={exercise.id} value={exercise.id}>
                        {exercise.name} ({exercise.muscleGroup})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Serie
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={exerciseFormData.sets}
                    onChange={(e) =>
                      setExerciseFormData({
                        ...exerciseFormData,
                        sets: parseInt(e.target.value),
                      })
                    }
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Ripetizioni
                  </label>
                  <input
                    type="text"
                    value={exerciseFormData.reps}
                    onChange={(e) =>
                      setExerciseFormData({
                        ...exerciseFormData,
                        reps: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                    placeholder="es. 10 o 8-12"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Peso (kg, opzionale)
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="0.5"
                    value={exerciseFormData.weight || ""}
                    onChange={(e) =>
                      setExerciseFormData({
                        ...exerciseFormData,
                        weight: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Note (opzionale)
                  </label>
                  <input
                    type="text"
                    value={exerciseFormData.notes}
                    onChange={(e) =>
                      setExerciseFormData({
                        ...exerciseFormData,
                        notes: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                    placeholder="es. Pausa 60s tra le serie"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowAddExerciseModal(false)}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  Annulla
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                >
                  Aggiungi Esercizio
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
