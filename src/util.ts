import got from 'got'

export async function allCards(patch = 'latest', sets = allSets) {
  const allCards = sets.map(set => got(`http://dd.b.pvp.net/${patch}/${set}/en_us/data/${set}-en_us.json`).json())
  const cards = (await Promise.all(allCards)).flat() as Card[]
  return cards.filter(c => c.collectible)
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
