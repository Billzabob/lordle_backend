import got from 'got'

export async function allCards(patch = 'latest', sets = allSets) {
  const allCards = sets.map(set => got(`https://dd.b.pvp.net/${patch}/${set}/en_us/data/${set}-en_us.json`).json())
  return (await Promise.all(allCards)).flat() as [Card]
}

export async function calculateExpansion(cardCode: String) {
  const cards = await allCards()
  const card = cards.find(card => card.cardCode === cardCode)

  if (card) {
    const expansions = expansionPatch.filter(expansion => expansion.set === card.set)
    const expansionCards = await Promise.all(expansions.map(expansion => allCards(expansion.patch, [expansion.set.toLowerCase()])))
    const expansionIndex = expansionCards.findIndex(expansionCards => expansionCards.some(card => card.cardCode == cardCode))
    return expansions[expansionIndex].expansion
  } else {
    throw 'Card code does not exist'
  }
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
  Equipment,
}

enum Expansion {
  Foundations = 'Foundations',
  RisingTides = 'RisingTides',
  CallOfTheMountain = 'CallOfTheMountain',
  MonumentsOfPower = 'MonumentsOfPower',
  KDAAllOut = 'KDAAllOut',
  CosmicCreation = 'CosmicCreation',
  Aphelios = 'Aphelios',
  EmpiresOfTheAscended = 'EmpiresOfTheAscended',
  GuardiansOfTheAncient = 'GuardiansOfTheAncient',
  RiseOfTheUnderworlds = 'RiseOfTheUnderworlds',
  SentinelsOfLight = 'SentinelsOfLight',
  BeyondTheBandlewood = 'BeyondTheBandlewood',
  ThePathOfChampions = 'ThePathOfChampions',
  MagicMisadventures = 'MagicMisadventures',
  ACuriousJourney = 'ACuriousJourney',
  v34CardExpansion = 'v34CardExpansion',
  v36CardExpansion = 'v36CardExpansion',
  Worldwalker = 'Worldwalker',
  ForcesFromBeyond = 'ForcesFromBeyond',
  TheDarkinSagaAwakening = 'TheDarkinSagaAwakening',
}

export type Card = {
  cost: number,
  cardCode: string
  name: string
  regionRefs: [Region]
  rarity: Rarity
  type: CardType,
  set: Set
}

type ExpansionInfo = {
  expansion: Expansion,
  set: Set,
  patch: string
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

const expansionPatch: ExpansionInfo[] = [
  {
    expansion: Expansion.Foundations,
    set: Set.Set1,
    patch: "1_0_0"
  },
  {
    expansion: Expansion.RisingTides,
    set: Set.Set2,
    patch: "1_0_0"
  },
  {
    expansion: Expansion.CallOfTheMountain,
    set: Set.Set3,
    patch: "1_8_0"
  },
  {
    expansion: Expansion.CosmicCreation,
    set: Set.Set3,
    patch: "1_16_0"
  },
  {
    expansion: Expansion.Aphelios,
    set: Set.Set3,
    patch: "2_1_0"
  },
  {
    expansion: Expansion.EmpiresOfTheAscended,
    set: Set.Set4,
    patch: "2_3_0"
  },
  {
    expansion: Expansion.GuardiansOfTheAncient,
    set: Set.Set4,
    patch: "2_7_0"
  },
  {
    expansion: Expansion.RiseOfTheUnderworlds,
    set: Set.Set4,
    patch: "2_11_0"
  },
  {
    expansion: Expansion.SentinelsOfLight,
    set: Set.Set4,
    patch: "2_12_0"
  },
  {
    expansion: Expansion.BeyondTheBandlewood,
    set: Set.Set5,
    patch: "2_14_0"
  },
  {
    expansion: Expansion.ThePathOfChampions,
    set: Set.Set5,
    patch: "2_19_0"
  },
  {
    expansion: Expansion.MagicMisadventures,
    set: Set.Set5,
    patch: "2_21_0"
  },
  {
    expansion: Expansion.MagicMisadventures,
    set: Set.Set5,
    patch: "3_2_0"
  },
  {
    expansion: Expansion.v34CardExpansion,
    set: Set.Set5,
    patch: "3_4_0"
  },
  {
    expansion: Expansion.v36CardExpansion,
    set: Set.Set5,
    patch: "3_6_0"
  },
  {
    expansion: Expansion.Worldwalker,
    set: Set.Set6,
    patch: "3_8_0"
  },
  {
    expansion: Expansion.ForcesFromBeyond,
    set: Set.Set6,
    patch: "3_11_0"
  },
  {
    expansion: Expansion.TheDarkinSagaAwakening,
    set: Set.Set6cde,
    patch: "3_14_0"
  },
]