import { FC, useEffect, useRef, useState } from 'react';
import { updateDoc, doc } from '@firebase/firestore';
import { db, filesRef } from '../firebase';
import { ModalInfo, Todo } from '../types';
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';

export const Edit: FC<{ modalInfo: ModalInfo; onHide: () => void }> = ({ modalInfo, onHide }) => {
  const { todo } = modalInfo;
  const [userData, setUserData] = useState(todo);
  const [fileStatus, setFileStatus] = useState(false);

  const deadlineInputEl = useRef(null);
  const descriptionInputEl = useRef(null);
  const fileInputEl = useRef(null);
  const taskInputEl = useRef(null);
  const formEl = useRef(null);
  useEffect(() => {
    if (todo.fileUrl.length > 0) {
      setFileStatus(true);
    }
    taskInputEl.current.value = todo.name;
    descriptionInputEl.current.value = todo.description;
    deadlineInputEl.current.value = todo.deadline;
    taskInputEl.current.focus();
  }, []);

  const handleChange = (e: { currentTarget: { name: string; value: string } }) => {
    const fieldName = e.currentTarget.name;
    setUserData({ ...userData, [fieldName]: e.currentTarget.value });
  };

  const handleDeadlineChange = (e: { currentTarget: { value: string } }) => {
    setUserData({ ...userData, deadline: e.currentTarget.value });
    deadlineInputEl.current.value = e.currentTarget.value;
  };

  const handleDeleteFile = () => {
    setUserData({ ...userData, fileUrl: '' });
    setFileStatus(false);
  };

  const editTask = async (userInput: Todo) => {
    const toDoRef = doc(db, 'todos', todo.id);
    const { name, description, deadline } = userInput;

    const file = fileInputEl.current.files[0];

    if (file) {
      const storageRef = ref(filesRef, `${file.name}`);
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        'state_changed',
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
            setUserData({ ...userData, fileUrl: downloadURL });
            await updateDoc(toDoRef, {
              name,
              description,
              deadline,
              complete: false,
              fileUrl: downloadURL,
            });
          });
        },
      );
    } else {
      await updateDoc(toDoRef, {
        name,
        description,
        deadline,
        complete: false,
        fileUrl: '',
      });
    }
  };

  const handleSubmit = (e: { preventDefault: () => void }) => {
    e.preventDefault();
    editTask(userData).then(() => console.log('task is changed'));
    formEl.current.reset();
    taskInputEl.current.focus();
    onHide();
  };

  const renderFile = (state: boolean) => {
      return (state ?
        <a href={todo.fileUrl} target="_blank" rel="noreferrer" >
          View file
        </a> : null
      )
  };

  return (
    <div className="modal">
      <form ref={formEl} className="todo-form" onSubmit={handleSubmit}>
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
              ref={descriptionInputEl}
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
          {fileStatus ? (
            <div>
              {renderFile(fileStatus)}
              <button type="button" onClick={handleDeleteFile}>
                X
              </button>
            </div>
          ) : (
            <label htmlFor="description">
              Add some files
              <input ref={fileInputEl} type="file" id="file" name="fileUrl" onChange={handleChange} />
            </label>
          )}
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
          <button className="button" type="button" onClick={onHide}>
            Close
          </button>
          <button className="button" type="submit">
            Save
          </button>
        </div>
      </form>
    </div>
  );
};
