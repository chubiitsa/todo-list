import Remove from './Remove.jsx';

const modals = {
  removing: Remove,
};

export default (modalName) => modals[modalName];
