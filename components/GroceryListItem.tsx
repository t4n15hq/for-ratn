import React from 'react';
import { GroceryList } from '../types';

interface GroceryListItemProps {
  list: GroceryList;
  onViewList: () => void;
  onDeleteList: (id: string) => void;
}

const ViewListIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" {...props}>
    <path d="M3.25 4A2.25 2.25 0 001 6.25v7.5A2.25 2.25 0 003.25 16h13.5A2.25 2.25 0 0019 13.75v-7.5A2.25 2.25 0 0016.75 4H3.25ZM10 8a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 8ZM6.25 9.5a.75.75 0 01.75-.75h1.5a.75.75 0 010 1.5h-1.5a.75.75 0 01-.75-.75Zm5.25.75a.75.75 0 000-1.5h-1.5a.75.75 0 000 1.5h1.5Z" />
    <path fillRule="evenodd" d="M2 6.25A3.25 3.25 0 015.25 3h9.5A3.25 3.25 0 0118 6.25v7.5A3.25 3.25 0 0114.75 17h-9.5A3.25 3.25 0 012 13.75v-7.5ZM3.5 6.25c0-.966.784-1.75 1.75-1.75h9.5c.966 0 1.75.784 1.75 1.75v7.5c0 .966-.784 1.75-1.75 1.75h-9.5A1.75 1.75 0 013.5 13.75v-7.5Z" clipRule="evenodd" />
  </svg>
);

const TrashIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" {...props}>
    <path fillRule="evenodd" d="M8.75 1A2.75 2.75 0 0 0 6 3.75H4.5a.75.75 0 0 0 0 1.5h11a.75.75 0 0 0 0-1.5H14A2.75 2.75 0 0 0 11.25 1h-2.5ZM10 4c.84 0 1.532.647 1.719 1.466H8.281A1.75 1.75 0 0 1 10 4ZM7.5 6.75A.75.75 0 0 0 6.75 6H6a.75.75 0 0 0-.75.75v9c0 .414.336.75.75.75h8c.414 0 .75-.336.75-.75v-9a.75.75 0 0 0-.75-.75h-.75a.75.75 0 0 0-.75.75V15a.75.75 0 0 1-1.5 0V6.75Zm2.25 0V15a.75.75 0 0 1-1.5 0V6.75a.75.75 0 0 1 1.5 0Zm3-0.001V15a.75.75 0 0 1-1.5 0V6.75a.75.75 0 0 1 1.5 0Z" clipRule="evenodd" />
  </svg>
);


export const GroceryListItem: React.FC<GroceryListItemProps> = ({ list, onViewList, onDeleteList }) => {
  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent triggering onViewList
    if (window.confirm(`Are you sure you want to delete the list "${list.name}"? This will also delete all items in it.`)) {
      onDeleteList(list.id);
    }
  };

  return (
    <div 
      className="flex items-center justify-between p-4 bg-card-DEFAULT rounded-lg shadow-lg hover:shadow-xl border-l-4 border-primary-light hover:border-primary-DEFAULT transition-all duration-200 cursor-pointer group"
      onClick={onViewList}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') onViewList(); }}
    >
      <span className="text-lg font-nunito font-semibold text-textBase group-hover:text-primary-dark transition-colors">
        {list.name}
      </span>
      <div className="flex items-center space-x-2">
        <button 
          onClick={onViewList} 
          aria-label={`View list ${list.name}`}
          className="p-1.5 text-textMuted hover:text-primary-DEFAULT transition-colors duration-150 rounded-full hover:bg-primary-light/50 focus:outline-none focus:ring-1 focus:ring-primary-DEFAULT"
        >
          <ViewListIcon className="w-5 h-5" />
        </button>
        <button 
          onClick={handleDelete} 
          aria-label={`Delete list ${list.name}`}
          className="p-1.5 text-textMuted hover:text-red-500 transition-colors duration-150 rounded-full hover:bg-red-100 focus:outline-none focus:ring-1 focus:ring-red-500"
        >
          <TrashIcon className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};
