import { allCards, getCardForDay } from '../util'

// Not sure if this works on the day a new set gets released since it would change the amount of cards
// and change the index for yesterday's guess
async function pastCard(daysBack: number) {
  if(daysBack == 0) return null

  const cards = await allCards()
  return getCardForDay(new Date(), cards, daysBack)
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
    card(_parent: undefined, args: CardArgs) {
      return pastCard(Math.abs(args.daysBack))
    }
  },
}
