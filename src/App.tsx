import { FC } from 'react';
import { Header } from './Header';
import { ToDoForm } from './ToDoForm';
import { ToDoList } from './ToDoList';
import 'bootstrap/dist/css/bootstrap.min.css';

export const App: FC = () => {
  return (
    <div className="d-flex flex-column min-vh-100 bg-dark">
      <div className="container pt-3 bg-light">
        <Header />
        <ToDoForm />
        <ToDoList />
      </div>
    </div>
  );
};
