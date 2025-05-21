import React, { useState } from 'react';

interface AddGroceryItemProps {
  onAddItem: (content: string, quantity?: string) => void;
}

const PlusCircleIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" {...props}>
    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm.75-11.25a.75.75 0 00-1.5 0v2.5h-2.5a.75.75 0 000 1.5h2.5v2.5a.75.75 0 001.5 0v-2.5h2.5a.75.75 0 000-1.5h-2.5v-2.5z" clipRule="evenodd" />
  </svg>
);


export const AddGroceryItem: React.FC<AddGroceryItemProps> = ({ onAddItem }) => {
  const [content, setContent] = useState('');
  const [quantity, setQuantity] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (content.trim()) {
      onAddItem(content, quantity);
      setContent('');
      setQuantity('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 items-stretch p-3 bg-card-input/70 rounded-lg shadow-md border border-card-border/30 notepad-lines">
      <input
        type="text"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Add an item (e.g., Apples)"
        aria-label="Grocery item content"
        className="flex-grow p-2.5 border-0 focus:ring-0 bg-transparent text-textInput placeholder-textPlaceholder font-nunito text-base focus:outline-none"
      />
      <div className="flex flex-col sm:flex-row gap-3 items-center sm:items-stretch">
        <input
          type="text"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          placeholder="Qty (e.g., 2 lbs)"
          aria-label="Grocery item quantity"
          className="p-2.5 border border-card-border/50 rounded-md shadow-sm focus:ring-1 focus:ring-primary-DEFAULT focus:border-primary-DEFAULT bg-transparent text-textInput placeholder-textPlaceholder font-nunito sm:w-36"
        />
        <button
          type="submit"
          className="bg-primary-DEFAULT hover:bg-primary-dark text-primary-textOnPrimary font-semibold py-2.5 px-4 rounded-lg shadow-sm hover:shadow-md transition duration-150 ease-in-out transform hover:scale-105 flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-primary-light focus:ring-offset-2 focus:ring-offset-card-input font-nunito hover:animate-gentle-bloom"
          disabled={content.trim() === ''}
        >
          <PlusCircleIcon className="w-5 h-5" />
          Add
        </button>
      </div>
    </form>
  );
};