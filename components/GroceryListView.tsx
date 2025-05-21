import React from 'react';
import { GroceryList, SupabaseUser } from '../types';
import { useGroceryItems } from '../hooks/useGroceryItems';
import { AddGroceryItem } from './AddGroceryItem';
import { GroceryItem as GroceryItemComponent } from './GroceryItem'; // Renamed to avoid conflict

interface GroceryListViewProps {
  user: SupabaseUser;
  list: GroceryList;
  onBack: () => void;
}

const BackArrowIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" {...props}>
    <path fillRule="evenodd" d="M17 10a.75.75 0 01-.75.75H5.56l2.72 2.72a.75.75 0 11-1.06 1.06l-4.25-4.25a.75.75 0 010-1.06l4.25-4.25a.75.75 0 111.06 1.06L5.56 9.25H16.25A.75.75 0 0117 10z" clipRule="evenodd" />
  </svg>
);

const EmptyBasketIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
 <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.2} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 11.25a3.5 3.5 0 11-7 0 3.5 3.5 0 017 0zM6.75 6.75L5.25 17.25H18.75L17.25 6.75H6.75z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 6.75V4.5a2.25 2.25 0 012.25-2.25h0A2.25 2.25 0 0114.25 4.5v2.25" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 21h9" />
  </svg>
);


export const GroceryListView: React.FC<GroceryListViewProps> = ({ user, list, onBack }) => {
  const { 
    groceryItems, 
    addGroceryItem, 
    toggleGroceryItem, 
    deleteGroceryItem, 
    editGroceryItem,
    loadingGroceryItems, 
    groceryItemError 
  } = useGroceryItems(user, list.id);

  return (
    <div className="py-4">
      <div className="flex items-center mb-6">
        <button
          onClick={onBack}
          className="p-2 mr-3 rounded-full hover:bg-secondary-light text-textMuted hover:text-textBase transition-colors focus:outline-none focus:ring-2 focus:ring-primary-DEFAULT"
          aria-label="Back to grocery lists"
        >
          <BackArrowIcon className="w-6 h-6" />
        </button>
        <h2 className="text-3xl font-playfair font-bold text-textBase">{list.name}</h2>
      </div>

      <div className="mb-8">
        <AddGroceryItem onAddItem={addGroceryItem} />
      </div>

      {groceryItemError && (
        <div className="mb-6 p-4 bg-error-bg text-error-text border border-error-border rounded-lg shadow font-nunito">
          <p className="font-semibold">Oops, a dropped item!</p>
          <p className="text-sm">{groceryItemError}</p>
        </div>
      )}

      {loadingGroceryItems && groceryItems.length === 0 && (
        <div className="text-center py-12 text-textMuted">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary-DEFAULT mx-auto mb-4"></div>
          <p className="text-lg font-nunito">Loading items...</p>
        </div>
      )}

      {!loadingGroceryItems && groceryItems.length === 0 && (
        <div className="text-center py-12 text-textMuted font-nunito">
            <EmptyBasketIcon className="w-20 h-20 mx-auto mb-6 text-textMuted/40" />
            <p className="text-xl font-playfair font-semibold text-textBase mb-1">Your list is empty.</p>
            <p className="text-sm">Add some items to start filling your basket!</p>
        </div>
      )}

      {groceryItems.length > 0 && (
        <ul className="space-y-3">
          {groceryItems.map(item => (
            <GroceryItemComponent
              key={item.id}
              item={item}
              onToggleItem={toggleGroceryItem}
              onDeleteItem={deleteGroceryItem}
              onEditItem={editGroceryItem}
            />
          ))}
        </ul>
      )}
    </div>
  );
};
