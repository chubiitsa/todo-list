import { Header } from './Header'
import { ToDoForm } from './ToDoForm'
import { ToDoList } from './ToDoList'
import './App.css'

export function App () {
  return (
    <div className="container">
      <Header />
      <ToDoForm />
      <ToDoList />
    </div>
  )
}
