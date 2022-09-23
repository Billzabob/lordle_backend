import { UserInputError } from 'apollo-server-lambda'
import { allCards, currentDay, getCardsForDay } from '../util'

async function pastCard(daysBack: number) {
  if (daysBack <= 0) throw new UserInputError('daysBack argument must be greater than zero.', { daysBack })

  const cards = await allCards()
  const day = currentDay() - daysBack
  return getCardsForDay(cards, day)
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
