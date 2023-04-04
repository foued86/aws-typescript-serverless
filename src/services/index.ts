import { dynamoDBClient } from "src/models";
import { TodoService } from "./TodoService";

const todoService = new TodoService(dynamoDBClient());

export default todoService;