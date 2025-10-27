import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { FaList, FaPiggyBank, FaUtensils } from 'react-icons/fa';
import { FaBookOpen, FaGear } from "react-icons/fa6";

export function Navigation() {

    const navigate = useNavigate();
    const [ activeTab, setActiveTab ] = useState(1);

    const tabsData = [
        { id: 1, label: 'Shopping List', path: '/list' },
        { id: 2, label: 'Recipes', path: '/recipes' },
        { id: 5, label: 'Meal Plan', path: '/meal-plan' },
        { id: 3, label: 'Expenses', path: '/expenses' },
        { id: 4, label: 'Settings', path: '/settings' }
    ];

    const renderTabIcon = (label: string) => {
        switch(label) {
            case 'Shopping List':
                return <FaList size={20}/>;
            case 'Recipes':
                return <FaBookOpen size={20}/>;
            case 'Meal Plan':
                return <FaUtensils size={20}/>;
            case 'Expenses':
                return <FaPiggyBank size={20}/>;
            case 'Settings':
                return <FaGear size={20}/>;
            default:
                return null;
        }
    }

    const tabs = tabsData.map((tab) => (
        <button 
            key={tab.id} 
            className={activeTab === tab.id ? 'active' : ''} 
            onClick={() => { setActiveTab(tab.id); navigate(tab.path); }}
        >{renderTabIcon(tab.label)}</button>
    ));

    return (
        <nav>
            {tabs}
        </nav>
    );
}