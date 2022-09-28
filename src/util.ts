import got from 'got'
import shuffleSeed from 'shuffle-seed'
import dayjs  from 'dayjs'
import _ from 'lodash'
import { getCards, getCardsForEveryDayBefore, setCards } from './db-client'

// Use whenever a new set comes out to add it's cards to the possible future cards
export async function updateCards() {
  const seed = process.env.SEED
  if (!seed) throw 'No seed set'
  const today = currentDay()
  const cards = await allCards()
  const groups = _.groupBy(cards, c => c.set + c.cost + c.rarity + c.type + c.regionRefs.sort().join())
  const previousCardGroups = await getCardsForEveryDayBefore(today)
  const previousCards = previousCardGroups.flatMap(record => record.Cards.SS)
  const filtered = Object.values(groups).filter(group => !group.map(c => c.cardCode).some(code => previousCards.includes(code)))
  const shuffled = shuffleSeed.shuffle(filtered, seed)

  const result = shuffled.map((group, i) => {
    const codes = group.map(c => c.cardCode).sort()
    return setCards(today + i + 1, codes)
  })

  const updates = await Promise.all(result)
  return updates.length
}

export async function allCards(patch = 'latest', sets = allSets) {
  const allCards = sets.map(set => got(`http://dd.b.pvp.net/${patch}/${set}/en_us/data/${set}-en_us.json`).json())
  const cards = (await Promise.all(allCards)).flat() as Card[]
  return cards.filter(c => c.collectible)
}

export function currentDay() {
  // Adjust the time so that new cards are released around midnight in the US
  const startDate = dayjs(new Date('9/28/2022')).add(7, 'hours')
  const now = dayjs()
  return now.diff(startDate, 'days')
}

export async function getCardsForDay(cards: Card[], day: number) {
  const cardsForDay = await getCards(day)
  return cardsForDay.map(code => {
    const card = cards.find(c => c.cardCode === code)
    if (!card) throw 'Card does not exist'
    return card
  })
}

enum Region {
  BandleCity,
  Bilgewater,
  Demacia,
  Freljord,
  Ionia,
  Noxus,
  PiltoverZaun,
  Runeterra,
  ShadowIsles,
  Shurima,
  Targon,
}

enum Rarity {
  Champion,
  COMMON,
  EPIC,
  RARE,
}

enum CardType {
  Landmark,
  Spell,
  Unit,
  Equipment,
}

type Asset = {
  gameAbsolutePath: string
  fullAbsolutePath: string
}

export type Card = {
  cost: number,
  cardCode: string
  name: string
  regionRefs: Region[]
  rarity: Rarity
  type: CardType
  set: Set
  collectible: boolean
  assets: Asset[]
}

enum Set {
  Set1 = 'Set1',
  Set2 = 'Set2',
  Set3 = 'Set3',
  Set4 = 'Set4',
  Set5 = 'Set5',
  Set6 = 'Set6',
  Set6cde = 'Set6cde'
}

const allSets = Object.values(Set).map(set => set.toLowerCase())
