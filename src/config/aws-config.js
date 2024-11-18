export const awsConfig = {
  region: process.env.AWS_REGION || 'us-east-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
}

export const dynamoConfig = {
  TableName: process.env.DYNAMODB_TABLE || 'linksgo-users',
}

export const s3Config = {
  bucketName: process.env.S3_BUCKET || 'linksgo-assets',
}
