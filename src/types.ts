export type Todo = {
  id: string;
  name: string;
  description: string;
  complete: boolean;
  deadline: string;
  fileUrl: string;
};

export type ModalInfo = {
  type: string;
  todo: Todo;
};

export type AppProps = {
  todo: Todo;
  handleToggle: (id: string) => void;
  handleRemove: () => void;
  handleEdit: () => void;
};
