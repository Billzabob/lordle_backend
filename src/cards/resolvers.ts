import { allCards } from '../util'

export default {
  Query: {
    async cards() {
      const cards = await allCards()
      return cards.map(card => {
        return {...card, image: card.assets[0].gameAbsolutePath}
      })
    }
  },
}
