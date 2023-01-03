import { FC } from 'react';
import { Header } from './Header';
import { ToDoForm } from './ToDoForm';
import { ToDoList } from './ToDoList';
import './App.css';

export const App: FC = () => {
  return (
    <div className="container">
      <Header />
      <ToDoForm />
      <ToDoList />
    </div>
  );
};
