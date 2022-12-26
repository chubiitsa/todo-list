import {useState, useRef, useEffect, FC} from 'react'
import {collection, addDoc} from '@firebase/firestore'
import {ref, uploadBytesResumable, getDownloadURL} from 'firebase/storage'
import * as dayjs from 'dayjs'
import {db, filesRef} from './firebase'

export const ToDoForm: FC = () => {
    const curValue = dayjs().format('YYYY-MM-DD')
    const [userData, setUserData] = useState({deadline: curValue, fileUrl: ''})

    const deadlineInputEl = useRef(null)
    const fileInputEl = useRef(null)
    const taskInputEl = useRef(null)
    const formEl = useRef(null)
    useEffect(() => {
        deadlineInputEl.current.value = curValue
        taskInputEl.current.focus()
    }, [])

    const addTask = async (userInput: { deadline: string, name?: string, description?: string }) => {
        const {name, description, deadline} = userInput

        const file = fileInputEl.current.files[0]

        if (file) {
            const storageRef = ref(filesRef, `${file.name}`)
            const uploadTask = uploadBytesResumable(storageRef, file);

            uploadTask.on('state_changed',
                (snapshot) => {
                    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    console.log('Upload is ' + progress + '% done');
                    switch (snapshot.state) {
                        case 'paused':
                            console.log('Upload is paused');
                            break;
                        case 'running':
                            console.log('Upload is running');
                            break;
                    }
                },
                (error) => {
                    switch (error.code) {
                        case 'storage/unauthorized':
                            break;
                        case 'storage/canceled':
                            break;
                        case 'storage/unknown':
                            break;
                    }
                },
                () => {
                    getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
                        setUserData({...userData, fileUrl: downloadURL})
                        await addDoc(collection(db, 'todos'), {
                            task: name, description, deadline, complete: false, fileUrl: downloadURL
                        })
                    });
                }
            );
        } else {
            await addDoc(collection(db, 'todos'), {
                task: name, description, deadline, complete: false, fileUrl: ''
            })
        }
    }

    const handleChange = (e: { currentTarget: { name: string, value: string } }) => {
        const fieldName = e.currentTarget.name
        setUserData({...userData, [fieldName]: e.currentTarget.value})
    }

    const handleDeadlineChange = (e: { currentTarget: { value: string } }) => {
        setUserData({...userData, deadline: e.currentTarget.value})
        deadlineInputEl.current.value = e.currentTarget.value
    }

    const submitHandler = (e: { preventDefault: () => void }) => {
        e.preventDefault()
        addTask(userData).then(() => console.log('task is added'))
        formEl.current.reset()
        deadlineInputEl.current.value = curValue
        setUserData({deadline: curValue, fileUrl: ''})
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
            <div className="input-wrapper">
                <label htmlFor="description">
                    Add some files
                    <input
                        ref={fileInputEl}
                        type="file"
                        id="file"
                        name="fileUrl"
                        onChange={handleChange}
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
