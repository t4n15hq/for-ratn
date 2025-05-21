import React, { useState, useRef, useEffect } from 'react';
import { Task } from '../types';

interface TaskItemProps {
  task: Task;
  onToggleTask: (id: string) => void;
  onDeleteTask: (id: string) => void;
  onEditTask: (id: string, newContent: string, newDueDate?: string) => void;
}

const formatDateDisplay = (dateString?: string | null): string | null => {
  if (!dateString) return null;
  try {
    const dateValue = dateString.includes('T') ? dateString : dateString + 'T00:00:00Z';
    const date = new Date(dateValue);
    return date.toLocaleDateString(undefined, { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric', timeZone: 'UTC' });
  } catch (e) {
    return dateString; 
  }
};

// Icon Definitions
const TrashIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" {...props}>
    <path fillRule="evenodd" d="M8.75 1A2.75 2.75 0 0 0 6 3.75H4.5a.75.75 0 0 0 0 1.5h11a.75.75 0 0 0 0-1.5H14A2.75 2.75 0 0 0 11.25 1h-2.5ZM10 4c.84 0 1.532.647 1.719 1.466H8.281A1.75 1.75 0 0 1 10 4ZM7.5 6.75A.75.75 0 0 0 6.75 6H6a.75.75 0 0 0-.75.75v9c0 .414.336.75.75.75h8c.414 0 .75-.336.75-.75v-9a.75.75 0 0 0-.75-.75h-.75a.75.75 0 0 0-.75.75V15a.75.75 0 0 1-1.5 0V6.75Zm2.25 0V15a.75.75 0 0 1-1.5 0V6.75a.75.75 0 0 1 1.5 0Zm3-0.001V15a.75.75 0 0 1-1.5 0V6.75a.75.75 0 0 1 1.5 0Z" clipRule="evenodd" />
  </svg>
);

const EditIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" {...props}>
    <path d="M5.433 13.917l1.262-3.155A4 4 0 0 1 7.58 9.42l6.92-6.918a2.121 2.121 0 0 1 3 3l-6.92 6.918c-.383.383-.84.685-1.343.886l-3.154 1.262a.5.5 0 0 1-.65-.65Z" />
    <path d="M3.5 5.75c0-.69.56-1.25 1.25-1.25H10A.75.75 0 0 0 10 3H4.75A2.75 2.75 0 0 0 2 5.75v9.5A2.75 2.75 0 0 0 4.75 18h9.5A2.75 2.75 0 0 0 17 15.25V10a.75.75 0 0 0-1.5 0v5.25c0 .69-.56 1.25-1.25 1.25h-9.5c-.69 0-1.25-.56-1.25-1.25v-9.5Z" />
  </svg>
);

const SaveIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
 <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" {...props}>
    <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z" clipRule="evenodd" />
  </svg>
);

const CancelIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" {...props}><path d="M6.28 5.22a.75.75 0 0 0-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 1 0 1.06 1.06L10 11.06l3.72 3.72a.75.75 0 1 0 1.06-1.06L11.06 10l3.72-3.72a.75.75 0 0 0-1.06-1.06L10 8.94 6.28 5.22Z" /></svg>
);

const CalendarIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" {...props}>
    <path fillRule="evenodd" d="M4 1.75a.75.75 0 0 1 .75-.75h6.5a.75.75 0 0 1 .75.75V3h1.25c.966 0 1.75.784 1.75 1.75v6.5A1.75 1.75 0 0 1 13.25 13H2.75A1.75 1.75 0 0 1 1 11.25v-6.5C1 3.784 1.784 3 2.75 3H4V1.75ZM2.5 7.5v3.75c0 .138.112.25.25.25h10.5a.25.25 0 0 0 .25-.25V7.5h-11Z" clipRule="evenodd" />
  </svg>
);

// Simple flower icon for checkbox
const FlowerCheckboxIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 text-primary-DEFAULT" {...props}>
      <path d="M10 4C8.34 4 7 4.92 6.22 6.22A5.002 5.002 0 004 10c0 1.66.92 3 2.22 3.78A5.002 5.002 0 0010 16c1.66 0 3-.92 3.78-2.22A5.002 5.002 0 0016 10c0-1.66-.92-3-2.22-3.78A5.002 5.002 0 0010 4zm0 1.5c1.13 0 2.12.53 2.74 1.34A3.508 3.508 0 0114.5 10a3.495 3.495 0 01-1.76 2.16A3.508 3.508 0 0110 14.5a3.495 3.495 0 01-2.74-1.76A3.508 3.508 0 015.5 10a3.495 3.495 0 011.76-2.74A3.508 3.508 0 0110 5.5z"/>
      <path d="M10 8.46a1.54 1.54 0 100 3.08 1.54 1.54 0 000-3.08z" />
    </svg>
);
const PetalIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg viewBox="0 0 10 15" fill="currentColor" className="w-2 h-3 text-primary-light absolute" {...props}>
    <path d="M5 0C2 0 0 2.5 0 5.5C0 9.5 3.5 14.5 5 15C6.5 14.5 10 9.5 10 5.5C10 2.5 8 0 5 0Z" />
  </svg>
);


export const TaskItem: React.FC<TaskItemProps> = ({ task, onToggleTask, onDeleteTask, onEditTask }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(task.content);
  const [editedDueDate, setEditedDueDate] = useState(task.dueDate || '');
  const contentInputRef = useRef<HTMLInputElement>(null);
  const [isCompleting, setIsCompleting] = useState(false);
  const [showPetals, setShowPetals] = useState(false);

  useEffect(() => {
    if (isEditing && contentInputRef.current) {
      contentInputRef.current.focus();
      contentInputRef.current.select();
    }
  }, [isEditing]);

  useEffect(() => {
    if (!isEditing) {
        setEditedContent(task.content);
        setEditedDueDate(task.dueDate || '');
    }
  }, [task.content, task.dueDate, isEditing]);


  const handleToggleTask = () => {
    onToggleTask(task.id);
    if (!task.is_done) { 
      setIsCompleting(true);
      setShowPetals(true);
      setTimeout(() => setIsCompleting(false), 600); 
      setTimeout(() => setShowPetals(false), 3000); // Petals visible for 3s
    }
  };

  const handleEdit = () => {
    setEditedContent(task.content); 
    setEditedDueDate(task.dueDate || '');
    setIsEditing(true);
  };

  const handleSave = () => {
    if (editedContent.trim()) {
      onEditTask(task.id, editedContent.trim(), editedDueDate || undefined);
    }
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedContent(task.content);
    setEditedDueDate(task.dueDate || '');
    setIsEditing(false);
  };
  
  const handleContentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditedContent(e.target.value);
  };

  const handleDueDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditedDueDate(e.target.value);
  };

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') handleSave();
    else if (e.key === 'Escape') handleCancel();
  };
  
  const formattedDueDate = formatDateDisplay(task.dueDate);
  const liClasses = `
    flex items-center gap-3 p-4 bg-card-DEFAULT rounded-lg shadow-lg transition-all duration-300 ease-in-out group relative
    border-l-4 border-primary-light 
    hover:shadow-xl hover:border-primary-DEFAULT group-hover:shadow-[0_0_15px_var(--color-primary-light)]
    ${isCompleting ? 'animate-task-complete-notepad' : ''}
    ${task.is_done && !isCompleting ? 'completed-task-style' : ''}
  `;
  // Use notepad-lines for a subtle lined paper effect inside the card
  // Note: actual lines might need more precise padding/margin adjustments on text containers

  return (
    <li className={liClasses}>
      {showPetals && Array.from({ length: 5 }).map((_, i) => (
        <PetalIcon 
          key={i} 
          className="animate-petal-float absolute"
          style={{ 
            left: `${20 + i * 15}%`, 
            bottom: '50%', 
            animationDelay: `${i * 0.1}s`,
            transformOrigin: 'bottom center',
          }} 
        />
      ))}
      <button
        onClick={handleToggleTask}
        aria-label={task.is_done ? 'Mark task as not done' : 'Mark task as done'}
        className={`w-7 h-7 flex-shrink-0 rounded-full border-2 flex items-center justify-center transition-all duration-200 cursor-pointer
          ${task.is_done ? 'bg-success border-success/70' : 'border-primary-DEFAULT/50 hover:border-primary-DEFAULT bg-card-hover'}
          focus:outline-none focus:ring-2 focus:ring-primary-DEFAULT/70 focus:ring-offset-2 focus:ring-offset-card-DEFAULT
        `}
      >
        {task.is_done && <FlowerCheckboxIcon className="animate-flower-bloom-checkbox text-success-textOnSuccess" />}
      </button>

      {isEditing ? (
        <div className="flex-grow flex flex-col sm:flex-row gap-2 items-center">
          <input
            ref={contentInputRef}
            type="text"
            value={editedContent}
            onChange={handleContentChange}
            onKeyDown={handleInputKeyDown}
            aria-label="Edit task content"
            className="flex-grow p-2 border-b-2 border-primary-DEFAULT bg-transparent text-textInput focus:outline-none w-full sm:w-auto font-nunito"
          />
          <input
            type="date"
            value={editedDueDate}
            onChange={handleDueDateChange}
            onKeyDown={handleInputKeyDown}
            aria-label="Edit task due date"
            className="p-2 border border-card-border/70 rounded-md bg-card-DEFAULT/50 text-textInput focus:ring-1 focus:ring-primary-DEFAULT focus:border-primary-DEFAULT sm:w-auto mt-2 sm:mt-0 font-nunito"
          />
        </div>
      ) : (
        <div className="flex-grow cursor-pointer notepad-lines py-1" onDoubleClick={handleEdit} role="button" tabIndex={0} onKeyDown={(e) => {if (e.key === 'Enter' || e.key === ' ') handleEdit()}}>
          <span id={`task-content-${task.id}`} className={`text-base transition-colors duration-300 font-nunito ${task.is_done ? 'text-textMuted' : 'text-textBase'}`}>
            {task.content}
          </span>
          {formattedDueDate && (
            <div className={`flex items-center text-xs mt-1 transition-colors duration-300 font-nunito ${task.is_done ? 'text-textMuted/70' : 'text-textMuted'}`}>
              <CalendarIcon className={`w-3.5 h-3.5 mr-1.5 ${task.is_done ? 'text-textMuted/50' : 'text-primary-DEFAULT/70'}`} />
              {formattedDueDate}
            </div>
          )}
        </div>
      )}
      <div className="flex items-center space-x-1 sm:space-x-1.5 shrink-0 opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity duration-200">
        {isEditing ? (
          <>
            <button onClick={handleSave} aria-label="Save task" className="p-1.5 text-green-600 hover:text-green-500 transition-colors duration-150 rounded-full hover:bg-green-100 focus:outline-none focus:ring-1 focus:ring-green-500">
              <SaveIcon className="w-5 h-5" />
            </button>
            <button onClick={handleCancel} aria-label="Cancel edit" className="p-1.5 text-textMuted hover:text-textBase transition-colors duration-150 rounded-full hover:bg-secondary-light focus:outline-none focus:ring-1 focus:ring-textMuted">
              <CancelIcon className="w-5 h-5" />
            </button>
          </>
        ) : (
          <button onClick={handleEdit} aria-label="Edit task" className="p-1.5 text-textMuted hover:text-primary-DEFAULT transition-colors duration-150 rounded-full hover:bg-primary-light/50 focus:outline-none focus:ring-1 focus:ring-primary-DEFAULT">
            <EditIcon className="w-5 h-5" />
          </button>
        )}
        <button onClick={() => onDeleteTask(task.id)} aria-label="Delete task" className="p-1.5 text-textMuted hover:text-red-500 transition-colors duration-150 rounded-full hover:bg-red-100 focus:outline-none focus:ring-1 focus:ring-red-500">
          <TrashIcon className="w-5 h-5" />
        </button>
      </div>
    </li>
  );
};