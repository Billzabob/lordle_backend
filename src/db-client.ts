import { DynamoDBClient, GetItemCommand, GetItemCommandInput, UpdateItemCommand, UpdateItemCommandInput } from '@aws-sdk/client-dynamodb';

const dbclient = new DynamoDBClient({ region: 'us-west-1' })
const dailyDataTable = 'DailyData'

export async function getNumCorrectAnswers(day: number) {
  const params: GetItemCommandInput = {
    TableName: dailyDataTable,
    Key: { day: { N: day.toString() } },
    ProjectionExpression: 'CorrectAnswers',
  }
  const data = await dbclient.send(new GetItemCommand(params))
  return data?.Item?.CorrectAnswers?.N || 0
}

export async function incrementCorrectAnswers(day: number) {
  const params: UpdateItemCommandInput = {
    TableName: dailyDataTable,
    Key: { day: { N: day.toString()}},
    ExpressionAttributeValues: { ':val': { N: '1' } },
    UpdateExpression: 'ADD CorrectAnswers :val',
    ReturnValues: 'UPDATED_NEW'
  }
  const data = await dbclient.send(new UpdateItemCommand(params))
  return data?.Attributes?.CorrectAnswers?.N || 0
}