import React from "react";
import { Search } from "lucide-react";

interface EmptyStateProps {
  searchTerm: string;
}

export default function EmptyState({ searchTerm }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-full mb-4">
        <Search size={32} className="text-gray-400" />
      </div>
      <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-1">
        Nessun cliente trovato
      </h3>
      <p className="text-gray-500 dark:text-gray-400 max-w-md">
        {searchTerm
          ? `Nessun risultato per "${searchTerm}"`
          : "Non hai ancora aggiunto clienti"}
      </p>
    </div>
  );
}