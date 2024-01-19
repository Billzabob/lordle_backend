import {
  DynamoDBClient,
  GetItemCommand,
  GetItemCommandInput,
  ScanCommand,
  ScanCommandInput,
  UpdateItemCommand,
  UpdateItemCommandInput
} from '@aws-sdk/client-dynamodb'

const dbclient = new DynamoDBClient({ region: 'us-west-1' })
const dailyDataTable = 'DailyData'

export async function getCardsForEveryDayBefore(day: number) {
  const params: ScanCommandInput = {
    TableName: dailyDataTable,
    ProjectionExpression: 'Cards',
    ExpressionAttributeValues: { ':today': {N: day.toString()} },
    FilterExpression: 'DayIndex <= :today'
  }
  const data = await dbclient.send(new ScanCommand(params))
  return data?.Items || []
}

export async function setCards(day: number, cards: string[]) {
  const params: UpdateItemCommandInput = {
    TableName: dailyDataTable,
    Key: { DayIndex: { N: day.toString()}},
    ExpressionAttributeValues: { ':val': { SS: cards } },
    UpdateExpression: 'SET Cards = :val',
    ReturnValues: 'UPDATED_NEW'
  }
  const data = await dbclient.send(new UpdateItemCommand(params))
  return data?.Attributes?.Cards?.SS || []
}

export async function getVoiceCardsForEveryDayBefore(day: number) {
  const params: ScanCommandInput = {
    TableName: dailyDataTable,
    ProjectionExpression: 'VoiceCard',
    ExpressionAttributeValues: { ':today': {N: day.toString()} },
    FilterExpression: 'DayIndex <= :today'
  }
  const data = await dbclient.send(new ScanCommand(params))
  return data?.Items?.map(r => r?.VoiceCards?.S).filter(c => c) || []
}

export async function setVoiceCard(day: number, card: string) {
  const params: UpdateItemCommandInput = {
    TableName: dailyDataTable,
    Key: { DayIndex: { N: day.toString()}},
    ExpressionAttributeValues: { ':val': { S: card } },
    UpdateExpression: 'SET VoiceCard = :val',
    ReturnValues: 'UPDATED_NEW'
  }
  const data = await dbclient.send(new UpdateItemCommand(params))
  return data?.Attributes?.VoiceCard?.S
}

export async function getCards(day: number) {
  const params: GetItemCommandInput = {
    TableName: dailyDataTable,
    Key: { DayIndex: { N: day.toString() } },
    ProjectionExpression: 'Cards',
  }
  const data = await dbclient.send(new GetItemCommand(params))
  return data?.Item?.Cards?.SS || []
}

export async function getVoiceCard(day: number) {
  const d = day % 635
  const adjusted  = d < 10 ? d + 300 : d
  const params: GetItemCommandInput = {
    TableName: dailyDataTable,
    Key: { DayIndex: { N: adjusted.toString() } },
    ProjectionExpression: 'VoiceCard',
  }
  const data = await dbclient.send(new GetItemCommand(params))
  return data?.Item?.VoiceCard?.S || ''
}

export async function getNumCorrectAnswers(day: number) {
  const params: GetItemCommandInput = {
    TableName: dailyDataTable,
    Key: { DayIndex: { N: day.toString() } },
    ProjectionExpression: 'CorrectAnswers',
  }
  const data = await dbclient.send(new GetItemCommand(params))
  return Number(data?.Item?.CorrectAnswers?.N || 0)
}

export async function incrementCorrectAnswers(day: number) {
  const params: UpdateItemCommandInput = {
    TableName: dailyDataTable,
    Key: { DayIndex: { N: day.toString()}},
    ExpressionAttributeValues: { ':val': { N: '1' } },
    UpdateExpression: 'ADD CorrectAnswers :val',
    ReturnValues: 'UPDATED_NEW'
  }
  const data = await dbclient.send(new UpdateItemCommand(params))
  return Number(data?.Attributes?.CorrectAnswers?.N || 0)
}

export async function getNumCorrectVoiceAnswers(day: number) {
  const params: GetItemCommandInput = {
    TableName: dailyDataTable,
    Key: { DayIndex: { N: day.toString() } },
    ProjectionExpression: 'CorrectVoiceAnswers',
  }
  const data = await dbclient.send(new GetItemCommand(params))
  return Number(data?.Item?.CorrectVoiceAnswers?.N || 0)
}

export async function incrementCorrectVoiceAnswers(day: number) {
  const params: UpdateItemCommandInput = {
    TableName: dailyDataTable,
    Key: { DayIndex: { N: day.toString()}},
    ExpressionAttributeValues: { ':val': { N: '1' } },
    UpdateExpression: 'ADD CorrectVoiceAnswers :val',
    ReturnValues: 'UPDATED_NEW'
  }
  const data = await dbclient.send(new UpdateItemCommand(params))
  return Number(data?.Attributes?.CorrectVoiceAnswers?.N || 0)
}