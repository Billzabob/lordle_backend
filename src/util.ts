import got from 'got'

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
  None,
  Champion,
  COMMON,
  EPIC,
  RARE,
}

enum CardType {
  Ability,
  Landmark,
  Spell,
  Trap,
  Unit,
}

export interface Card {
  cost: number,
  cardCode: string
  name: string
  regionRefs: [Region]
  rarity: Rarity
  type: CardType
}

export async function allCards() {
  const sets = ['set1', 'set2', 'set3', 'set4', 'set5', 'set6']
  const allCards = sets.map(set => got(`https://dd.b.pvp.net/latest/${set}/en_us/data/${set}-en_us.json`).json())
  return (await Promise.all(allCards)).flat() as [Card]
}