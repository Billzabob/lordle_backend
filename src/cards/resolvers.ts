import { UserInputError } from 'apollo-server-lambda'
import { allCards, currentDay, getCardsForDay } from '../util'

async function pastCard(day: number) {
  const today = currentDay()
  if (day >= today) throw new UserInputError('day argument must be less than current day.', { day, currentDay })

  const cards = await allCards()
  return getCardsForDay(cards, day)
}

type CardArgs = {
  day: number
}

export default {
  Query: {
    async cards() {
      const cards = await allCards()
      return cards.map(card => {
        return { ...card, image: card.assets[0].gameAbsolutePath, backgroundImage: card.assets[0].fullAbsolutePath }
      })
    },
    cardsForDay(_parent: undefined, args: CardArgs) {
      return pastCard(args.day)
    },
  },
}
