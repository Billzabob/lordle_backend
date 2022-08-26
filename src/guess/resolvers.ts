import { allCards, Card } from '../util.js'
import shuffleSeed from 'shuffle-seed'

async function guess(code: string) {
  const cards = await allCards()

  const guess = cards.find(card => card.cardCode === code)

  const card = chooseRandomCard(new Date(), cards)

  if (guess && card) {
    return {
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
        result: guess.cost === card.cost ? 'CORRECT' : 'WRONG',
      },
      typeResult: {
        type: guess.type,
        result: guess.type === card.type ? 'CORRECT' : 'WRONG',
      },
      expansionResult: {
        expansion: 'Foundations',
        result: 'CORRECT',
      }
    }
  } else {
    throw 'Card code does not exist'
  }
}

function chooseRandomCard(date: Date, cards: [Card]) {
  const startDate = new Date('8/26/2022');
  const diffTime = Math.abs(date.getTime() - startDate.getTime());
  const day = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 

  return shuffleSeed.shuffle(cards, "super_cool_seed")[day]
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

function compareLists<A>(list1: [A], list2: [A]) {
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
};