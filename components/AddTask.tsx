import React, { useState } from 'react';

interface AddTaskProps {
  onAddTask: (content: string, dueDate?: string) => void;
  initialDueDate?: string; 
}

const QuillPenIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" {...props}>
    <path d="M9.25 1C9.25 1 4.5 3.25 4.5 8.75C4.5 14.25 9.25 19 9.25 19H10.75C10.75 19 15.5 14.25 15.5 8.75C15.5 3.25 10.75 1 10.75 1H9.25ZM10 12.125L5.125 8.375L10 4.625L14.875 8.375L10 12.125Z" />
    <path d="M12.732 4.043a.75.75 0 011.06 0l1.88 1.88a.75.75 0 11-1.06 1.06L12.732 5.104a.75.75 0 010-1.06zM7.268 4.043a.75.75 0 00-1.06 0L4.328 5.922a.75.75 0 001.06 1.06L7.268 5.104a.75.75 0 000-1.06z" />
  </svg>
);


export const AddTask: React.FC<AddTaskProps> = ({ onAddTask, initialDueDate = '' }) => {
  const [content, setContent] = useState('');
  const [dueDate, setDueDate] = useState(initialDueDate);

  React.useEffect(() => {
    setDueDate(initialDueDate);
  }, [initialDueDate]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (content.trim()) {
      onAddTask(content, dueDate);
      setContent('');
      setDueDate(''); 
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 items-stretch p-4 bg-card-input rounded-lg shadow-lg border border-card-border/50 notepad-lines">
      <input
        type="text"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Jot down a new thought or task."
        aria-label="Task content"
        className="flex-grow p-3 border-0 focus:ring-0 bg-transparent text-textInput placeholder-textPlaceholder font-nunito text-base focus:outline-none"
      />
      <div className="flex flex-col sm:flex-row gap-3 items-center sm:items-stretch">
        <input
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          aria-label="Due date"
          className="p-3 border border-card-border/70 rounded-lg shadow-sm focus:ring-1 focus:ring-primary-DEFAULT focus:border-primary-DEFAULT bg-card-input text-textInput placeholder-textPlaceholder font-nunito sm:w-auto appearance-none"
          min={new Date().toISOString().split('T')[0]}
        />
        <button
          type="submit"
          className="bg-primary-DEFAULT hover:bg-primary-dark text-primary-textOnPrimary font-semibold py-3 px-5 rounded-lg shadow-md hover:shadow-lg transition duration-150 ease-in-out transform hover:scale-105 flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-primary-light focus:ring-offset-2 focus:ring-offset-card-input font-nunito hover:animate-gentle-bloom"
        >
          <QuillPenIcon className="w-5 h-5" />
          Add Note
        </button>
      </div>
    </form>
  );
};