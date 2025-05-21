import React from 'react';
import { Task } from '../types';
import { TaskItem } from './TaskItem';

interface TaskListProps {
  tasks: Task[];
  onToggleTask: (id: string) => void;
  onDeleteTask: (id: string) => void;
  onEditTask: (id: string, newContent: string, newDueDate?: string) => void;
  listTitle?: string;
  emptyStateMessage?: string;
  emptyStateSubtext?: string;
  containerClassName?: string; // Added for styling/animation of the list container
}

const EmptyNotepadIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.2} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M16 2.75L16 6.25M16 6.25L19.5 6.25M16 6.25L12.5 9.75" strokeWidth="1" opacity="0.7"/>
     <path d="M14.5 4.5 C14 5, 13.5 5, 13 5.5 C12.5 6, 12.5 7, 13.5 7.5 C14.5 8, 15 7.5, 15.5 7 C16 6.5, 15.5 5.5, 14.5 4.5Z" fill="var(--color-primary-light)" opacity="0.5"/>
  </svg>
);


export const TaskList: React.FC<TaskListProps> = ({ 
  tasks, 
  onToggleTask, 
  onDeleteTask, 
  onEditTask,
  listTitle,
  emptyStateMessage = "This page is clear!",
  emptyStateSubtext = "Add a new note to fill your journal.",
  containerClassName = ""
}) => {
  if (tasks.length === 0) {
    return (
      <div className={`text-center py-12 text-textMuted font-nunito ${containerClassName}`}>
        <EmptyNotepadIcon className="w-20 h-20 mx-auto mb-6 text-textMuted/40" />
        <p className="text-xl font-playfair font-semibold text-textBase mb-1">{emptyStateMessage}</p>
        <p className="text-sm">{emptyStateSubtext}</p>
      </div>
    );
  }

  return (
    <div className={`mb-8 ${containerClassName}`}>
      {listTitle && <h2 className="text-2xl font-playfair font-semibold text-textBase mb-4 mt-8 border-b-2 border-primary-light pb-2">{listTitle}</h2>}
      <ul className="space-y-3">
        {tasks.map(task => (
          <TaskItem
            key={task.id}
            task={task}
            onToggleTask={onToggleTask}
            onDeleteTask={onDeleteTask}
            onEditTask={onEditTask}
          />
        ))}
      </ul>
    </div>
  );
};