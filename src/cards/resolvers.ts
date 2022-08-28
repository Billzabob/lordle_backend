import { allCards } from '../util'

export default {
  Query: {
    cards: () => allCards(),
  },
};
