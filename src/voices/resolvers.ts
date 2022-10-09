import { UserInputError } from 'apollo-server-lambda'
import { getVoiceCard, incrementCorrectVoiceAnswers } from '../db-client'
import { getVoiceLinesForCard } from '../s3-client'
import { allCards, currentDay } from '../util'

async function getVoiceLines(day: number) {
  const today = currentDay()
  if (day > today) throw new UserInputError('day argument cannot be greater than current day.', { day, today })

  const card = await getVoiceCard(day)
  const lines = await getVoiceLinesForCard(card)
  return lines.filter(line => !line.includes('interaction')).filter(line => !line.includes('spell_resolve'))
}

async function guessVoice(code: string, day: number, language?: string) {
  const cardCode = await getVoiceCard(day)
  const cards = await allCards(language)
  const card = cards.find(c => c.cardCode === code)

  const correct = code === cardCode
  if (correct) await incrementCorrectVoiceAnswers(day)

  if (!card) throw 'Card code does not exist'

  return {
    cardCode: code,
    correct: correct,
    image: card.assets[0].gameAbsolutePath,
    name: card.name,
    language: card.language
  }
}

async function pastCard(day: number, language?: string) {
  const today = currentDay()
  if (day >= today) throw new UserInputError('day argument must be less than current day.', { day, today })

  const cards = await allCards(language)
  const cardCode = await getVoiceCard(day)
  const card =  cards.find(c => c.cardCode === cardCode)
  if (!card) throw 'Card does not exist'
  return { ...card, image: card.assets[0].gameAbsolutePath, backgroundImage: card.assets[0].fullAbsolutePath }
}

type VoiceLineArgs = {
  day: number
}

type VoiceGuessArgs = {
  code: string
  day: number,
  language?: string
}

type VoiceArgs = {
  day: number
  language?: string
}

export default {
  Query: {
    async voiceLines(_parent: undefined, args: VoiceLineArgs) {
      return getVoiceLines(args.day)
    },
    async guessVoice(_parent: undefined, args: VoiceGuessArgs) {
      return guessVoice(args.code, args.day, args.language)
    },
    voiceCardsForDay(_parent: undefined, args: VoiceArgs) {
      const card = pastCard(args.day, args.language)
      return [card]
    },
  },
}
