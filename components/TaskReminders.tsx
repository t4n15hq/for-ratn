import React, { useState } from 'react';
import { Task } from '../types';

// Re-use existing icons or create new ones if needed
const FlowerCheckboxIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 text-primary-DEFAULT" {...props}>
      <path d="M10 4C8.34 4 7 4.92 6.22 6.22A5.002 5.002 0 004 10c0 1.66.92 3 2.22 3.78A5.002 5.002 0 0010 16c1.66 0 3-.92 3.78-2.22A5.002 5.002 0 0016 10c0-1.66-.92-3-2.22-3.78A5.002 5.002 0 0010 4zm0 1.5c1.13 0 2.12.53 2.74 1.34A3.508 3.508 0 0114.5 10a3.495 3.495 0 01-1.76 2.16A3.508 3.508 0 0110 14.5a3.495 3.495 0 01-2.74-1.76A3.508 3.508 0 015.5 10a3.495 3.495 0 011.76-2.74A3.508 3.508 0 0110 5.5z"/>
      <path d="M10 8.46a1.54 1.54 0 100 3.08 1.54 1.54 0 000-3.08z" />
    </svg>
);

const EditIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" {...props}>
    <path d="M5.433 13.917l1.262-3.155A4 4 0 0 1 7.58 9.42l6.92-6.918a2.121 2.121 0 0 1 3 3l-6.92 6.918c-.383.383-.84.685-1.343.886l-3.154 1.262a.5.5 0 0 1-.65-.65Z" />
    <path d="M3.5 5.75c0-.69.56-1.25 1.25-1.25H10A.75.75 0 0 0 10 3H4.75A2.75 2.75 0 0 0 2 5.75v9.5A2.75 2.75 0 0 0 4.75 18h9.5A2.75 2.75 0 0 0 17 15.25V10a.75.75 0 0 0-1.5 0v5.25c0 .69-.56 1.25-1.25 1.25h-9.5c-.69 0-1.25-.56-1.25-1.25v-9.5Z" />
  </svg>
);

const BellflowerIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" {...props}>
    <path d="M10 2a1 1 0 011 1v1.21c1.26.29 2.33.99 3.06 1.98l.73-.73a1 1 0 111.41 1.41l-.73.73c.99.73 1.69 1.8 1.98 3.06H18a1 1 0 110 2h-.54c-.29 1.26-.99 2.33-1.98 3.06l.73.73a1 1 0 11-1.41 1.41l-.73-.73A7.007 7.007 0 0112 17.99V19a1 1 0 11-2 0v-1.01A7.007 7.007 0 016.21 14.9l-.73.73a1 1 0 11-1.41-1.41l.73-.73a7.007 7.007 0 01-1.98-3.06H2a1 1 0 110-2h.54a7.007 7.007 0 011.98-3.06l-.73-.73a1 1 0 011.41-1.41l.73.73c.73-.99 1.8-1.69 3.06-1.98V3a1 1 0 011-1zm0 4a4 4 0 100 8 4 4 0 000-8z" />
    <path d="M10 7a3 3 0 100 6 3 3 0 000-6z" opacity="0.5" />
  </svg>
);


interface TaskRemindersProps {
  tasks: Task[];
  onToggleTask: (id: string) => void;
  onEditTask: (id: string, currentContent: string, currentDueDate?: string) => void; // For initiating edit
}

export const TaskReminders: React.FC<TaskRemindersProps> = ({ tasks, onToggleTask, onEditTask }) => {
  if (tasks.length === 0) {
    return null;
  }

  const calculateDaysOverdue = (dueDateStr: string): number => {
    const today = new Date();
    today.setUTCHours(0, 0, 0, 0);
    // Ensure dueDate is treated as UTC midnight
    const dueDateParts = dueDateStr.split('-');
    const dueDateObj = new Date(Date.UTC(parseInt(dueDateParts[0], 10), parseInt(dueDateParts[1], 10) - 1, parseInt(dueDateParts[2], 10)));

    const diffTime = today.getTime() - dueDateObj.getTime();
    return Math.floor(diffTime / (1000 * 60 * 60 * 24));
  };
  
  // State to manage which task's edit mode is open
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [editedContent, setEditedContent] = useState('');
  const [editedDueDate, setEditedDueDate] = useState('');

  const handleEditClick = (task: Task) => {
    setEditingTaskId(task.id);
    setEditedContent(task.content);
    setEditedDueDate(task.dueDate || '');
  };

  const handleSaveEdit = (taskId: string) => {
    if (editedContent.trim()) {
      onEditTask(taskId, editedContent, editedDueDate || undefined);
    }
    setEditingTaskId(null);
  };

  const handleCancelEdit = () => {
    setEditingTaskId(null);
  };


  return (
    <div className="mb-8 p-4 sm:p-6 bg-secondary-light/60 rounded-xl shadow-lg border border-primary-light/70 relative z-10 animate-fadeInSoft" role="region" aria-labelledby="reminders-heading">
      <div className="flex items-center mb-4">
        <BellflowerIcon className="w-7 h-7 text-primary-dark mr-3 animate-swaying-leaf" />
        <h2 id="reminders-heading" className="text-2xl font-playfair font-semibold text-textBase"> Gentle Reminders </h2>
      </div>
      <ul className="space-y-3">
        {tasks.map(task => {
          const daysOverdue = task.dueDate ? calculateDaysOverdue(task.dueDate) : 0;
          const isCurrentlyEditing = editingTaskId === task.id;

          return (
            <li 
              key={task.id} 
              className="flex flex-col sm:flex-row items-start sm:items-center gap-3 p-3.5 bg-card-DEFAULT/80 rounded-lg shadow-md border-l-4 border-primary-DEFAULT hover:shadow-lg transition-shadow"
            >
              {isCurrentlyEditing ? (
                <div className="flex-grow w-full space-y-2">
                    <input
                        type="text"
                        value={editedContent}
                        onChange={(e) => setEditedContent(e.target.value)}
                        className="w-full p-2 border-b-2 border-primary-DEFAULT bg-transparent text-textInput focus:outline-none font-nunito"
                        aria-label="Edit reminder content"
                    />
                    <input
                        type="date"
                        value={editedDueDate}
                        onChange={(e) => setEditedDueDate(e.target.value)}
                        className="w-full sm:w-auto p-2 border border-card-border/70 rounded-md bg-card-DEFAULT/50 text-textInput focus:ring-1 focus:ring-primary-DEFAULT focus:border-primary-DEFAULT font-nunito"
                        aria-label="Edit reminder due date"
                    />
                </div>
              ) : (
                <div className="flex-grow">
                  <span className="text-base text-textBase font-nunito block">{task.content}</span>
                  <span className="text-xs text-error-text font-nunito block mt-0.5">
                    Due {daysOverdue} day{daysOverdue === 1 ? '' : 's'} ago
                  </span>
                </div>
              )}
              
              <div className="flex items-center space-x-1.5 shrink-0 mt-2 sm:mt-0 self-end sm:self-center">
                {isCurrentlyEditing ? (
                    <>
                        <button 
                            onClick={() => handleSaveEdit(task.id)} 
                            aria-label="Save changes to reminder"
                            className="p-1.5 text-green-600 hover:text-green-500 transition-colors duration-150 rounded-full hover:bg-green-100 focus:outline-none focus:ring-1 focus:ring-green-500"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5"><path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143Z" clipRule="evenodd" /></svg>
                        </button>
                        <button 
                            onClick={handleCancelEdit} 
                            aria-label="Cancel editing reminder"
                             className="p-1.5 text-textMuted hover:text-textBase transition-colors duration-150 rounded-full hover:bg-secondary-light focus:outline-none focus:ring-1 focus:ring-textMuted"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5"><path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22Z" /></svg>
                        </button>
                    </>
                ) : (
                    <>
                        <button
                            onClick={() => onToggleTask(task.id)}
                            aria-label={`Mark reminder ${task.content} as done`}
                            className="p-1.5 text-success-textOnSuccess hover:text-success-textOnSuccess/80 transition-colors duration-150 rounded-full hover:bg-success-DEFAULT/70 focus:outline-none focus:ring-1 focus:ring-success-DEFAULT"
                        >
                           <FlowerCheckboxIcon className="w-5 h-5 !text-success-textOnSuccess" />
                        </button>
                        <button 
                            onClick={() => handleEditClick(task)} 
                            aria-label={`Edit reminder ${task.content}`}
                            className="p-1.5 text-textMuted hover:text-primary-DEFAULT transition-colors duration-150 rounded-full hover:bg-primary-light/50 focus:outline-none focus:ring-1 focus:ring-primary-DEFAULT"
                        >
                            <EditIcon className="w-5 h-5" />
                        </button>
                    </>
                )}
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
};