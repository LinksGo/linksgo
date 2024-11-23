export const awsConfig = {
  region: process.env.REGION || 'ap-south-1',
  credentials: {
    accessKeyId: process.env.ACCESS_KEY_ID,
    secretAccessKey: process.env.SECRET_ACCESS_KEY,
  },
}

export const dynamoConfig = {
  TableName: process.env.APP_DYNAMODB_TABLE || 'linksgo-users',
}

export const s3Config = {
  bucketName: process.env.APP_S3_BUCKET || 'linksgo-assets',
}
