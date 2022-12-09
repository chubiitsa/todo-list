import { Remove } from './Remove.tsx';

const modals = {
  removing: Remove,
};

export const getModal = (modalName) => modals[modalName];
