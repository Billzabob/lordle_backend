import { DynamoDBClient, GetItemCommand, GetItemCommandInput } from '@aws-sdk/client-dynamodb';

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