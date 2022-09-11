import { allCards, getCardsForDay } from '../util'

async function pastCard(daysBack: number) {
  if (Math.abs(daysBack) === 0) return null

  const cards = await allCards()
  return getCardsForDay(cards, daysBack)
}

type CardArgs = {
  daysBack: number
}

export default {
  Query: {
    async cards() {
      const cards = await allCards()
      return cards.map(card => {
        return { ...card, image: card.assets[0].gameAbsolutePath }
      })
    },
    cardsForDay(_parent: undefined, args: CardArgs) {
      return pastCard(args.daysBack)
    },
  },
}
