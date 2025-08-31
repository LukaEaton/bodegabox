import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';

export function Navigation() {

    const navigate = useNavigate();
    const [ activeTab, setActiveTab ] = useState(1);

    const tabsData = [
        { id: 1, label: 'Shopping List', path: '/list' },
        { id: 2, label: 'Recipes', path: '/recipes' },
        { id: 3, label: 'Expenses', path: '/expenses' },
        { id: 4, label: 'Settings', path: '/settings' }
    ];

    const tabs = tabsData.map((tab) => (
        <button 
            key={tab.id} 
            className={activeTab === tab.id ? 'active' : ''} 
            onClick={() => { setActiveTab(tab.id); navigate(tab.path); }}
        >{tab.label}</button>
    ));

    return (
        <nav>
            {tabs}
        </nav>
    );
}