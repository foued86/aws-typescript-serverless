export default {
  TodosTable: {
    Type: "AWS::DynamoDB::Table",
    Properties: {
      TableName: "TodosTable",
      AttributeDefinitions: [{ AttributeName: "id", AttributeType: "S" }],
      KeySchema: [{ AttributeName: "id", KeyType: "HASH" }],
      ProvisionedThroughput: {
        ReadCapacityUnits: "${self:custom.tableThroughput}",
        WriteCapacityUnits: "${self:custom.tableThroughput}",
      },
    },
  },
};