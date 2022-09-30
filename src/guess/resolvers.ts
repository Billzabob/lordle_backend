import { UserInputError } from 'apollo-server-lambda'
import { incrementCorrectAnswers } from '../db-client'
import { allCards, Card, currentDay, getCardsForDay } from '../util'

async function guess(code: string, day: number, language?: string) {
  if (day > currentDay()) throw new UserInputError('Cannot guess a future day', { day })

  const cards = await allCards(language)

  const guess = cards.find(card => card.cardCode === code)

  const todaysCards = await getCardsForDay(cards, day)
  const card = todaysCards[0]

  if (guess) {
    const correct = todaysCards.map(card => card.cardCode).includes(code)

    if (correct) await incrementCorrectAnswers(currentDay())

    const otherCards = todaysCards.filter(c => c.cardCode != code).map(card => {
      return {...card, image: card.assets[0].gameAbsolutePath }
    })

    return {
      name: guess.name,
      cardCode: code,
      language: guess.language,
      image: guess.assets[0].gameAbsolutePath,
      otherCards: correct ? otherCards : null,
      correct: correct,
      regionResult: {
        regions: guess.regionRefs,
        result: compareRegions(guess, card)
      },
      rarityResult: {
        rarity: guess.rarity,
        result: guess.rarity === card.rarity ? 'CORRECT' : 'WRONG',
      },
      manaCostResult: {
        manaCost: guess.cost,
        result: guess.cost > card.cost ? 'DOWN' : (guess.cost < card.cost ? 'UP' : 'CORRECT'),
      },
      typeResult: {
        type: guess.type,
        result: guess.type === card.type ? 'CORRECT' : 'WRONG',
      },
      setResult: {
        set: guess.set,
        result: guess.set === card.set ? 'CORRECT' : 'WRONG',
      }
    }
  } else {
    throw 'Card code does not exist'
  }
}

function compareRegions(guess: Card, card: Card) {
  if (compareLists(guess.regionRefs, card.regionRefs)) {
    return 'CORRECT'
  } else if (guess.regionRefs.some(r => card.regionRefs.includes(r))) {
    return 'PARTIAL'
  } else {
    return 'WRONG'
  }
}

function compareLists<A>(list1: A[], list2: A[]) {
  return list1.length === list2.length && list1.sort().every((r, i) => r == list2.sort()[i])
}

type GuessArgs = {
  code: string
  day: number,
  language?: string
}

export default {
  Query: {
    guess(_parent: undefined, args: GuessArgs) {
      return guess(args.code, args.day, args.language)
    }
  },
}
