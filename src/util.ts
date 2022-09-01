import got from 'got'
import shuffleSeed from 'shuffle-seed'

export async function allCards(patch = 'latest', sets = allSets) {
  const allCards = sets.map(set => got(`http://dd.b.pvp.net/${patch}/${set}/en_us/data/${set}-en_us.json`).json())
  const cards = (await Promise.all(allCards)).flat() as Card[]
  return cards.filter(c => c.collectible)
}

export function getCardForDay(date: Date, cards: Card[], daysBack = 0) {
  // Adjust the time so that new cards are released around midnight in the US
  const adjustedTime = new Date(date.setTime(date.getTime() - (7 * 60 * 60 * 1000)))
  const startDate = new Date('8/26/2022')
  const diffTime = Math.abs(adjustedTime.getTime() - startDate.getTime())
  const day = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) - daysBack

  return shuffleSeed.shuffle(cards, "super_cool_seed")[day]
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
