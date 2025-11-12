import React from 'react';

interface SidebarProps {
  inventory: string[];
  quest: string;
}

const QuestIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-3 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l5.447 2.724A1 1 0 0021 16.382V5.618a1 1 0 00-1.447-.894L15 7m-6 0l6 3m0 0l6-3m-6 3v10" />
    </svg>
);

const InventoryIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-3 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h12a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM4 12a2 2 0 012-2h12a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM4 18a2 2 0 012-2h12a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2z" />
    </svg>
);

const Sidebar: React.FC<SidebarProps> = ({ inventory, quest }) => {
  return (
    <aside className="w-full lg:w-1/4 bg-gray-900/70 backdrop-blur-sm p-6 rounded-lg border border-gray-700 space-y-8">
      <div>
        <h2 className="text-2xl font-bold mb-4 text-yellow-400 flex items-center"><QuestIcon /> 현재 퀘스트</h2>
        <p className="text-gray-300 italic">{quest || '모험이 이제 막 시작됩니다...'}</p>
      </div>
      <div>
        <h2 className="text-2xl font-bold mb-4 text-yellow-400 flex items-center"><InventoryIcon /> 인벤토리</h2>
        {inventory.length > 0 ? (
          <ul className="space-y-2">
            {inventory.map((item, index) => (
              <li key={index} className="bg-gray-800 p-2 rounded-md text-gray-300 shadow-sm">{item}</li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">주머니가 비어있습니다.</p>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;