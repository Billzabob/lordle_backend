import { DynamoDBClient, GetItemCommand, GetItemCommandInput, UpdateItemCommand, UpdateItemCommandInput } from '@aws-sdk/client-dynamodb';

const dbclient = new DynamoDBClient({ region: 'us-west-1' })

export async function getNumCorrectAnswers(day: number) {
  const params: GetItemCommandInput = {
    TableName: 'num_correct_answers',
    Key: { day: { N: day.toString() } },
    ProjectionExpression: 'correct_answers',
  }
  const data = await dbclient.send(new GetItemCommand(params))
  return data?.Item?.correct_answers?.N || 0
}

export async function incrementCorrectAnswers(day: number) {
  const params: UpdateItemCommandInput = {
    TableName: 'num_correct_answers',
    Key: { day: { N: day.toString()}},
    ExpressionAttributeValues: { ':val': { N: '1' } },
    UpdateExpression: 'ADD correct_answers :val',
    ReturnValues: 'UPDATED_NEW'
  }
  const data = await dbclient.send(new UpdateItemCommand(params))
  return data?.Attributes?.correct_answers?.N || 0
}