export default {
  s3: {
    REGION: "ap-southeast-2",
    BUCKET: "events-manual"
  },
  apiGateway: {
    REGION: "ap-southeast-2",
    URL: "https://f5zpdqztb3.execute-api.ap-southeast-2.amazonaws.com/prod/"
  },
  cognito: {
    REGION: "ap-southeast-2",
    USER_POOL_ID: "ap-southeast-2_h9j3oythX",
    APP_CLIENT_ID: "568pg6c9ghkhd1aibfsc5urkj7",
    IDENTITY_POOL_ID: "ap-southeast-2:24c1bdaf-00bf-45ac-aa7f-0cabc8498065"
  }
};