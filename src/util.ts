import dayjs from 'dayjs'
import fs from 'fs'
import got from 'got'
import https from 'https'
import shuffleSeed from 'shuffle-seed'
import { exec } from 'child_process'
import { getCards, getCardsForEveryDayBefore, getVoiceCardsForEveryDayBefore, setCards, setVoiceCard } from './db-client'
import { groupBy } from 'lodash'

// Use whenever a new set comes out to add it's cards to the possible future cards
export async function updateCards() {
  const seed = process.env.SEED
  if (!seed) throw 'No seed set'
  const today = currentDay()
  const cards = await allCards()
  const groups = groupBy(cards, c => c.set + c.cost + c.rarity + c.type + c.regionRefs.sort().join())
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

// Use whenever a new set comes out to add it's cards to the possible future cards
export async function updateVoiceCards() {
  const seed = process.env.SEED
  if (!seed) throw 'No seed set'
  const today = currentDay()
  const cardsAll = await allCards()
  const cards = fs.readFileSync('voice_cards.txt').toString().split('\n')
  const previousCards = await getVoiceCardsForEveryDayBefore(today)
  const filtered = cards.filter(c => !previousCards.includes(c)).filter(c => cardsAll.find(a => a.cardCode === c)?.collectible)
  const shuffled = shuffleSeed.shuffle(filtered, seed)

  const result = shuffled.map((card, i) => {
    console.log(`Setting voice card for ${today + i + 1} to ${card}`)
    setVoiceCard(today + i + 1, card)
  })

  const updates = await Promise.all(result)
  return updates.length
}

export async function backgroundToWebp() {
  const cards = await allCards('en_us', '4_3_0', ['set7'])
  const existingCards = await allCards('en_us', '4_2_0', ['set7'])
  const blah = cards.filter(c => !existingCards.includes(c))
  console.log(blah.length)
  const foo = blah.map(async c => {
    await downloadImage(c.assets[0].fullAbsolutePath.replace('http', 'https'), `pngs/${c.cardCode}.png`)
    return exec(`cwebp 'pngs/${c.cardCode}.png' -o webps/${c.cardCode}.webp`)
  })

  return foo
}

function downloadImage(url: string, filepath: string) {
  return new Promise((resolve, reject) => {
      https.get(url, (res) => {
          if (res.statusCode === 200) {
              res.pipe(fs.createWriteStream(filepath))
                  .on('error', reject)
                  .once('close', () => resolve(filepath))
          } else {
              res.resume()
              reject(new Error(`Request Failed With a Status Code: ${res.statusCode}`))

          }
      })
  })
}

export async function allCards(language = 'en_us', patch = '4_3_0', sets = allSets) {
  const allCards = sets.map(set => got(`http://dd.b.pvp.net/${patch}/${set}/${language}/data/${set}-${language}.json`).json())
  const allCardsEnglish = sets.map(set => got(`http://dd.b.pvp.net/${patch}/${set}/en_us/data/${set}-en_us.json`).json())
  const englishCards = (await Promise.all(allCardsEnglish)).flat() as Card[]
  const cards = (await Promise.all(allCards)).flat() as Card[]
  const grouped = groupBy([...englishCards, ...cards], c => c.cardCode)
  const cardsWithLanguage = Object.values(grouped).map(([en, c]) => ({ ...en, name: c.name, assets: c.assets, language: language } as Card))
  return cardsWithLanguage.filter(c => c.collectible)
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
    return { ...card, image: card.assets[0].gameAbsolutePath, backgroundImage: card.assets[0].fullAbsolutePath }
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
  language: string
}

enum Set {
  Set1 = 'Set1',
  Set2 = 'Set2',
  Set3 = 'Set3',
  Set4 = 'Set4',
  Set5 = 'Set5',
  Set6 = 'Set6',
  Set6cde = 'Set6cde',
  Set7 = 'Set7'
}

const allSets = Object.values(Set).map(set => set.toLowerCase())
