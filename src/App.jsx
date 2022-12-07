import React from 'react';
import Header from './Header.jsx';
import ToDoList from './ToDoList.jsx';
import ToDoForm from './ToDoForm.jsx';
import './App.css';

function App() {
  return (
    <div className="container">
      <Header />
      <ToDoForm />
      <ToDoList />
    </div>
  );
}

export default App;
