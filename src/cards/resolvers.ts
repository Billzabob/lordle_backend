import { UserInputError } from 'apollo-server-lambda'
import { allCards, currentDay, getCardsForDay } from '../util'

async function pastCard(day: number, language?: string) {
  const today = currentDay()
  if (day >= today) throw new UserInputError('day argument must be less than current day.', { day, currentDay })

  const cards = await allCards(language)
  return getCardsForDay(cards, day)
}

type CardArgs = {
  day: number
  language?: string
}

type CardsArgs = {
  language?: string
}

export default {
  Query: {
    async cards(_parent: undefined, args: CardsArgs) {
      const cards = await allCards(args.language)
      return cards.map(card => {
        return { ...card, image: card.assets[0].gameAbsolutePath, backgroundImage: card.assets[0].fullAbsolutePath }
      })
    },
    cardsForDay(_parent: undefined, args: CardArgs) {
      return pastCard(args.day, args.language)
    },
  },
}
