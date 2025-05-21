import React, { useState, useRef, useEffect } from 'react';
import { GroceryItem as GroceryItemType } from '../types'; // Renamed import

interface GroceryItemProps {
  item: GroceryItemType;
  onToggleItem: (id: string) => void;
  onDeleteItem: (id: string) => void;
  onEditItem: (id: string, newContent: string, newQuantity?: string) => void;
}

// Re-using icons from TaskItem for consistency, or create specific ones
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

const CheckboxFlowerIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 text-primary-DEFAULT" {...props}>
      <path d="M10 4C8.34 4 7 4.92 6.22 6.22A5.002 5.002 0 004 10c0 1.66.92 3 2.22 3.78A5.002 5.002 0 0010 16c1.66 0 3-.92 3.78-2.22A5.002 5.002 0 0016 10c0-1.66-.92-3-2.22-3.78A5.002 5.002 0 0010 4zm0 1.5c1.13 0 2.12.53 2.74 1.34A3.508 3.508 0 0114.5 10a3.495 3.495 0 01-1.76 2.16A3.508 3.508 0 0110 14.5a3.495 3.495 0 01-2.74-1.76A3.508 3.508 0 015.5 10a3.495 3.495 0 011.76-2.74A3.508 3.508 0 0110 5.5z"/>
      <path d="M10 8.46a1.54 1.54 0 100 3.08 1.54 1.54 0 000-3.08z" />
    </svg>
);

export const GroceryItem: React.FC<GroceryItemProps> = ({ item, onToggleItem, onDeleteItem, onEditItem }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(item.content);
  const [editedQuantity, setEditedQuantity] = useState(item.quantity || '');
  const contentInputRef = useRef<HTMLInputElement>(null);
  const [isCompleting, setIsCompleting] = useState(false);

  useEffect(() => {
    if (isEditing && contentInputRef.current) {
      contentInputRef.current.focus();
      contentInputRef.current.select();
    }
  }, [isEditing]);
  
  useEffect(() => {
    if (!isEditing) {
        setEditedContent(item.content);
        setEditedQuantity(item.quantity || '');
    }
  }, [item.content, item.quantity, isEditing]);


  const handleToggleItem = () => {
    onToggleItem(item.id);
    if (!item.is_checked) { 
      setIsCompleting(true);
      setTimeout(() => setIsCompleting(false), 600); 
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = () => {
    if (editedContent.trim()) {
      onEditItem(item.id, editedContent.trim(), editedQuantity.trim() || undefined);
    }
    setIsEditing(false);
  };
  
  const handleCancel = () => {
    setIsEditing(false);
  };

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') handleSave();
    else if (e.key === 'Escape') handleCancel();
  };

  const liClasses = `
    flex items-center gap-3 p-3.5 bg-card-DEFAULT rounded-lg shadow-md transition-all duration-300 ease-in-out group
    border-l-4 border-primary-light/70 
    hover:shadow-lg hover:border-primary-DEFAULT/70 group-hover:shadow-[0_0_15px_var(--color-primary-light)]
    ${isCompleting ? 'animate-task-complete-notepad' : ''}
    ${item.is_checked && !isCompleting ? 'completed-task-style opacity-70' : ''} 
  `;
  // Reduced opacity for checked grocery items for differentiation from tasks.

  return (
    <li className={liClasses}>
      <button
        onClick={handleToggleItem}
        aria-label={item.is_checked ? 'Mark item as not checked' : 'Mark item as checked'}
        className={`w-6 h-6 flex-shrink-0 rounded-full border-2 flex items-center justify-center transition-all duration-200 cursor-pointer
          ${item.is_checked ? 'bg-success border-success/70' : 'border-primary-DEFAULT/50 hover:border-primary-DEFAULT bg-card-hover'}
          focus:outline-none focus:ring-2 focus:ring-primary-DEFAULT/70 focus:ring-offset-2 focus:ring-offset-card-DEFAULT
        `}
      >
        {item.is_checked && <CheckboxFlowerIcon className="animate-flower-bloom-checkbox text-success-textOnSuccess" />}
      </button>

      {isEditing ? (
        <div className="flex-grow flex flex-col sm:flex-row gap-2 items-center">
          <input
            ref={contentInputRef}
            type="text"
            value={editedContent}
            onChange={(e) => setEditedContent(e.target.value)}
            onKeyDown={handleInputKeyDown}
            aria-label="Edit item content"
            className="flex-grow p-1.5 border-b-2 border-primary-DEFAULT bg-transparent text-textInput focus:outline-none w-full sm:w-auto font-nunito"
          />
          <input
            type="text"
            value={editedQuantity}
            onChange={(e) => setEditedQuantity(e.target.value)}
            onKeyDown={handleInputKeyDown}
            placeholder="Qty"
            aria-label="Edit item quantity"
            className="p-1.5 border border-card-border/50 rounded-md bg-card-DEFAULT/50 text-textInput focus:ring-1 focus:ring-primary-DEFAULT focus:border-primary-DEFAULT sm:w-28 mt-1 sm:mt-0 font-nunito text-sm"
          />
        </div>
      ) : (
        <div className="flex-grow cursor-pointer notepad-lines py-0.5" onDoubleClick={handleEdit} role="button" tabIndex={0} onKeyDown={(e) => {if (e.key === 'Enter' || e.key === ' ') handleEdit()}}>
          <span className={`text-base transition-colors duration-300 font-nunito ${item.is_checked ? 'text-textMuted' : 'text-textBase'}`}>
            {item.content}
          </span>
          {item.quantity && (
            <span className={`text-xs ml-2 transition-colors duration-300 font-nunito ${item.is_checked ? 'text-textMuted/70' : 'text-textMuted'}`}>
              ({item.quantity})
            </span>
          )}
        </div>
      )}
      <div className="flex items-center space-x-1 sm:space-x-1.5 shrink-0 opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity duration-200">
        {isEditing ? (
          <>
            <button onClick={handleSave} aria-label="Save item" className="p-1.5 text-green-600 hover:text-green-500 transition-colors duration-150 rounded-full hover:bg-green-100 focus:outline-none focus:ring-1 focus:ring-green-500">
              <SaveIcon className="w-5 h-5" />
            </button>
            <button onClick={handleCancel} aria-label="Cancel edit" className="p-1.5 text-textMuted hover:text-textBase transition-colors duration-150 rounded-full hover:bg-secondary-light focus:outline-none focus:ring-1 focus:ring-textMuted">
              <CancelIcon className="w-5 h-5" />
            </button>
          </>
        ) : (
          <button onClick={handleEdit} aria-label="Edit item" className="p-1.5 text-textMuted hover:text-primary-DEFAULT transition-colors duration-150 rounded-full hover:bg-primary-light/50 focus:outline-none focus:ring-1 focus:ring-primary-DEFAULT">
            <EditIcon className="w-5 h-5" />
          </button>
        )}
        <button onClick={() => onDeleteItem(item.id)} aria-label="Delete item" className="p-1.5 text-textMuted hover:text-red-500 transition-colors duration-150 rounded-full hover:bg-red-100 focus:outline-none focus:ring-1 focus:ring-red-500">
          <TrashIcon className="w-5 h-5" />
        </button>
      </div>
    </li>
  );
};

// Note: Make sure GroceryItemType is correctly imported as 'item' prop's type.
// If there's a naming conflict, ensure type imports are aliased or component names are unique.
// Here, I've aliased 'GroceryItem' from types to 'GroceryItemType'.
// And the component itself is 'GroceryItem'.