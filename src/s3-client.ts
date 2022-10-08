import { S3Client, ListObjectsCommand, ListObjectsCommandInput } from "@aws-sdk/client-s3"

const s3sclient = new S3Client({ region: 'us-west-1' })
const url = 'https://lor-voice-lines.s3.us-west-1.amazonaws.com/' 

export async function getVoiceLinesForCard(card: string) {
  const params: ListObjectsCommandInput = {
    Bucket: 'lor-voice-lines',
    Prefix: 'lordle_voices/' + card
  }

  const results = await s3sclient.send(new ListObjectsCommand(params))

  return results.Contents?.map(contents => url + contents.Key) || []
}