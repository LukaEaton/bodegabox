import { Tabs } from '@mantine/core';
import { useNavigate } from 'react-router-dom';

export function Navigation() {

    const navigate = useNavigate();

    return (
        <Tabs 
            inverted 
            style={{ 
                position: 'fixed', 
                bottom: 0, 
                width: '100%' 
            }}
            defaultValue="list"
            onChange={value => navigate(`/${value}`)}
        >
            <Tabs.List style={{ width: '100%' }} grow>
                <Tabs.Tab value="list">List</Tabs.Tab>
                <Tabs.Tab value="recipes">Recipes</Tabs.Tab>
                <Tabs.Tab value="expenses">Expenses</Tabs.Tab>
                <Tabs.Tab value="settings">Settings</Tabs.Tab>
            </Tabs.List>
        </Tabs>
    );
}