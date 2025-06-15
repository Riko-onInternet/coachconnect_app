import React, { useState, useEffect } from 'react';
import { Calendar, TrendingUp, Dumbbell, Target, Clock, Award } from 'lucide-react';
import { API_BASE_URL } from '@/utils/config';

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

interface ProgressData {
  date: string;
  weight: number;
  bodyFat?: number;
  personalBests: {
    exercise: string;
    weight: number;
  }[];
}

interface HomeStats {
  totalWorkouts: number;
  completedWorkouts: number;
  nextWorkout: Workout | null;
  latestProgress: ProgressData | null;
  weeklyGoal: number;
  weeklyCompleted: number;
}

export default function Home() {
  const [stats, setStats] = useState<HomeStats>({
    totalWorkouts: 0,
    completedWorkouts: 0,
    nextWorkout: null,
    latestProgress: null,
    weeklyGoal: 3,
    weeklyCompleted: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        const token = localStorage.getItem('token');
        
        // Fetch workouts
        const workoutsResponse = await fetch(`${API_BASE_URL}/api/workouts`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const workouts: Workout[] = await workoutsResponse.json();
        
        // Fetch progress (se disponibile)
        let progressData: ProgressData[] = [];
        try {
          const progressResponse = await fetch(`${API_BASE_URL}/api/progress`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          if (progressResponse.ok) {
            progressData = await progressResponse.json();
          }
        } catch {
          console.log('Progress API non disponibile');
        }
        
        // Calcola statistiche
        const completedWorkouts = workouts.filter(w => w.completed).length;
        const nextWorkout = workouts
          .filter(w => !w.completed)
          .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())[0] || null;
        
        // Calcola allenamenti completati questa settimana
        const weekStart = new Date();
        weekStart.setDate(weekStart.getDate() - weekStart.getDay());
        const weeklyCompleted = workouts.filter(w => 
          w.completed && new Date(w.date) >= weekStart
        ).length;
        
        setStats({
          totalWorkouts: workouts.length,
          completedWorkouts,
          nextWorkout,
          latestProgress: progressData[progressData.length - 1] || null,
          weeklyGoal: 3,
          weeklyCompleted
        });
      } catch (error) {
        console.error('Errore nel caricamento dei dati home:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchHomeData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  const progressPercentage = (stats.weeklyCompleted / stats.weeklyGoal) * 100;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
        <div className="text-sm text-gray-500 dark:text-gray-400">
          {new Date().toLocaleDateString('it-IT', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}
        </div>
      </div>

      {/* Statistiche principali */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-900">
              <Dumbbell className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Allenamenti Totali</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalWorkouts}</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100 dark:bg-green-900">
              <Award className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Completati</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.completedWorkouts}</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-purple-100 dark:bg-purple-900">
              <Target className="h-6 w-6 text-purple-600 dark:text-purple-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Obiettivo Settimanale</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.weeklyCompleted}/{stats.weeklyGoal}</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-orange-100 dark:bg-orange-900">
              <TrendingUp className="h-6 w-6 text-orange-600 dark:text-orange-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Peso Attuale</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {stats.latestProgress?.weight ? `${stats.latestProgress.weight}kg` : 'N/A'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Progresso settimanale */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center">
          <Target className="h-5 w-5 mr-2 text-blue-600" />
          Progresso Settimanale
        </h3>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 mb-2">
          <div 
            className="bg-blue-600 h-3 rounded-full transition-all duration-300"
            style={{ width: `${Math.min(progressPercentage, 100)}%` }}
          ></div>
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          {stats.weeklyCompleted} di {stats.weeklyGoal} allenamenti completati questa settimana
          {progressPercentage >= 100 && " 🎉 Obiettivo raggiunto!"}
        </p>
      </div>

      {/* Prossimo allenamento */}
      {stats.nextWorkout && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <Clock className="h-5 w-5 mr-2 text-green-600" />
            Prossimo Allenamento
          </h3>
          <div className="border-l-4 border-green-500 pl-4">
            <h4 className="font-semibold text-lg">{stats.nextWorkout.title}</h4>
            <p className="text-gray-600 dark:text-gray-400 mb-2">
              <Calendar className="h-4 w-4 inline mr-1" />
              {new Date(stats.nextWorkout.date).toLocaleDateString('it-IT')}
            </p>
            <div className="space-y-1">
              {stats.nextWorkout.exercises.slice(0, 3).map((exercise, index) => (
                <p key={index} className="text-sm text-gray-600 dark:text-gray-400">
                  • {exercise.name} - {exercise.sets}x{exercise.reps} @ {exercise.weight}kg
                </p>
              ))}
              {stats.nextWorkout.exercises.length > 3 && (
                <p className="text-sm text-gray-500 dark:text-gray-500">
                  +{stats.nextWorkout.exercises.length - 3} altri esercizi...
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Record personali recenti */}
      {stats.latestProgress?.personalBests && stats.latestProgress.personalBests.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <Award className="h-5 w-5 mr-2 text-yellow-600" />
            Record Personali
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {stats.latestProgress.personalBests.slice(0, 3).map((pb, index) => (
              <div key={index} className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <p className="font-semibold">{pb.exercise}</p>
                <p className="text-2xl font-bold text-yellow-600">{pb.weight}kg</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}