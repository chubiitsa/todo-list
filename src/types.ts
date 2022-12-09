export type Todo = {
  id: string
  task: string
  description: string
  complete: boolean
  deadline: string
}

export type ModalInfo = {
  type: string
  todo: Todo
}

export type AppProps = {
  todo: Todo,
  handleToggle: (id: string) => void,
  handleRemove: () => void
}
