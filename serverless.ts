import type { AWS } from "@serverless/typescript";
import { createTodo, getTodo, getAllTodos, updateTodo, deleteTodo } from "@functions/todo";
import dynamoDbTables from "./resources/dynamodb-tables";

const serverlessConfiguration: AWS = {
  service: "aws-serverless-typescript-api",
  frameworkVersion: '3',
  plugins: ["serverless-esbuild", "serverless-offline", "serverless-dynamodb-local"],
  provider: {
    name: "aws",
    runtime: "nodejs14.x",
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },
    stage: "${opt:stage, 'dev'}",
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: "1",
      NODE_OPTIONS: "--enable-source-maps --stack-trace-limit=1000",
    },
    iam: {
      role: {
        statements: [{
          Effect: "Allow",
          Action: [
            "dynamodb:DescribeTable",
            "dynamodb:Query",
            "dynamodb:Scan",
            "dynamodb:GetItem",
            "dynamodb:PutItem",
            "dynamodb:UpdateItem",
            "dynamodb:DeleteItem",
          ],
          Resource: [
            { "Fn::GetAtt": ["TodosTable", "Arn"] }
          ],
        }],
      }
    }
  },
  resources: {
    Resources: {
      ...dynamoDbTables,
    },
  },
  // import the function via paths
  functions: { getAllTodos, createTodo, getTodo, updateTodo, deleteTodo },
  package: { individually: true },
  custom: {
    esbuild: {
      bundle: true,
      minify: false,
      sourcemap: true,
      exclude: ['aws-sdk'],
      target: 'node14',
      define: { 'require.resolve': undefined },
      platform: 'node',
      concurrency: 10,
    },
    dynamodb:{
      stages: ["dev"],
      start:{
        port: 5000,
        inMemory: true,
        migrate: true,
      },
    },
    tableThroughputs: {
      prod: 5,
      default: 1,
    },
    tableThroughput:
      "${self:custom.tableThroughputs.${self:provider.stage}, self:custom.tableThroughputs.default}",
  },
};

module.exports = serverlessConfiguration;
