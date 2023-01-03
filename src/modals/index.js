import { Remove } from './Remove.tsx';
import { Edit } from './Edit.tsx';

const modals = {
  removing: Remove,
  edit: Edit,
};

export const getModal = (modalName) => modals[modalName];
