import { allCards, Card, getCardForDay } from '../util'

async function guess(code: string) {
  const cards = await allCards()

  const guess = cards.find(card => card.cardCode === code)

  const card = getCardForDay(cards)

  if (guess && card) {
    return {
      image: guess.assets[0].gameAbsolutePath,
      correct: guess.cardCode === card.cardCode,
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
}

export default {
  Query: {
    guess(_parent: undefined, args: GuessArgs) {
      return guess(args.code)
    }
  },
}
