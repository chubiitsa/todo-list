import { useState, useRef, useEffect, FC } from 'react'
import * as dayjs from 'dayjs'
import { collection, addDoc } from '@firebase/firestore'
import { db } from './firebase'

export const ToDoForm:FC = () => {
  const curValue = dayjs().format('YYYY-MM-DD')
  const [userData, setUserData] = useState({ deadline: curValue })

  const deadlineInputEl = useRef(null)
  const taskInputEl = useRef(null)
  const formEl = useRef(null)
  useEffect(() => {
    deadlineInputEl.current.value = curValue
    taskInputEl.current.focus()
  }, [])

  const addTask = async (userInput: { deadline: string, name?: string, description?: string }) => {
    const { name, description, deadline } = userInput
    await addDoc(collection(db, 'todos'), {
      task: name, description, deadline, complete: false
    })
  }

  const handleChange = (e: { currentTarget: { name: string, value: string } }) => {
    const fieldName = e.currentTarget.name
    setUserData({ ...userData, [fieldName]: e.currentTarget.value })
  }

  const handleDeadlineChange = (e: { currentTarget: { value: string } }) => {
    setUserData({ ...userData, deadline: e.currentTarget.value })
    deadlineInputEl.current.value = e.currentTarget.value
  }

  const submitHandler = (e: { preventDefault: () => void }) => {
    e.preventDefault()
    addTask(userData).then(() => console.log('task is added'))
    formEl.current.reset()
    deadlineInputEl.current.value = curValue
    setUserData({ deadline: curValue })
    taskInputEl.current.focus()
  }

  return (
        <form ref={formEl} className="todo-form" onSubmit={submitHandler}>
            <div className="input-wrapper">
                <label htmlFor="name">
                    Task name
                    <input
                        required
                        ref={taskInputEl}
                        type="text"
                        id="name"
                        name="name"
                        maxLength={20}
                        size={10}
                        onChange={handleChange}
                    />
                </label>
            </div>
            <div className="input-wrapper">
                <label htmlFor="description">
                    Task description
                    <textarea
                        id="description"
                        name="description"
                        rows={5}
                        cols={33}
                        onChange={handleChange}
                        placeholder="Add more details to the task"
                        required
                    />
                </label>
            </div>
            <div className="input-wrapper-h">
                <div className="input-wrapper">
                    <label className="label" htmlFor="deadline">
                        <p className="field-name">Deadline </p>
                        <input
                            ref={deadlineInputEl}
                            type="date"
                            id="start"
                            name="deadline"
                            min="2021-12-31"
                            max="2050-12-31"
                            onChange={handleDeadlineChange}
                        />
                    </label>
                </div>
                <button type="submit" className="button">Add task</button>
            </div>

        </form>
  )
}
