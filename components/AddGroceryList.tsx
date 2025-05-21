import React, { useState } from 'react';

interface AddGroceryListProps {
  onAddGroceryList: (name: string) => Promise<any | null>;
}

const SeedPacketIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" {...props}>
    <path d="M16.5 4.5a2.5 2.5 0 00-3.536-3.536L5.5 8.464V10h1.536L16.5 4.5zM10 11.536V10H8.464L3.5 14.964A2.5 2.5 0 007.036 18.5L10 15.536zm6.5-7a.75.75 0 00-1.06-1.06L10 8.939l-5.44-5.439a.75.75 0 00-1.06 1.06L8.939 10l-5.439 5.44a.75.75 0 101.06 1.06L10 11.061l5.44 5.439a.75.75 0 101.06-1.06L11.061 10l5.439-5.44z" />
    <path d="M3 4.5A1.5 1.5 0 014.5 3H6v1.5H4.5A.5.5 0 004 5v1H2.5V4.5zM15.5 17A1.5 1.5 0 0114 18.5h-1.5V17H14a.5.5 0 00.5-.5v-1H16V17z" />
  </svg>
);

export const AddGroceryList: React.FC<AddGroceryListProps> = ({ onAddGroceryList }) => {
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      setIsLoading(true);
      await onAddGroceryList(name);
      setIsLoading(false);
      setName('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 items-stretch p-4 bg-card-input rounded-lg shadow-lg border border-card-border/50 notepad-lines">
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Label your shopping list"
        aria-label="New grocery list name"
        className="flex-grow p-3 border-0 focus:ring-0 bg-transparent text-textInput placeholder-textPlaceholder font-nunito text-base focus:outline-none"
        disabled={isLoading}
      />
      <button
        type="submit"
        disabled={isLoading || name.trim() === ''}
        className="bg-primary-DEFAULT hover:bg-primary-dark text-primary-textOnPrimary font-semibold py-3 px-5 rounded-lg shadow-md hover:shadow-lg transition duration-150 ease-in-out transform hover:scale-105 flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-primary-light focus:ring-offset-2 focus:ring-offset-card-input font-nunito disabled:opacity-60 hover:animate-gentle-bloom"
      >
        <SeedPacketIcon className={`w-5 h-5 ${isLoading ? 'animate-pulse' : ''}`} />
        {isLoading ? 'Planting...' : 'Create List'}
      </button>
    </form>
  );
};