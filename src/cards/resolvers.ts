import { getCardsForEveryDay, setCards } from '../db-client'
import { allCards, getCardForDay } from '../util'

// Not sure if this works on the day a new set gets released since it would change the amount of cards
// and change the index for yesterday's guess
async function pastCard(daysBack: number) {
  if(Math.abs(daysBack) === 0) return null

  const cards = await allCards()
  return getCardForDay(cards, daysBack)
}

type CardArgs = {
  daysBack: number
}

type SetCardArgs = {
  day: number
  cards: string[]
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
      return pastCard(args.daysBack)
    },
    // TODO: Delete this, just to help during development
    allDays() {
      return getCardsForEveryDay()
    }
  },
  Mutation: {
    // TODO: Delete this, just to help during development
    async setCards(_parent: undefined, args: SetCardArgs) {
      return setCards(args.day, args.cards)
    }
  },
}
