import { allCards } from '../util.js'

export default {
  Query: {
    cards: () => allCards(),
  },
};
