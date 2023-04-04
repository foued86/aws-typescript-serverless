import { DocumentClient } from "aws-sdk/clients/dynamodb";
import Todo from "../models/Todo";

export class TodoService {
    private tableName: string = "TodosTable2";

    /**
     * Constructor
     * @param documentClient DocumentClient
     */
    constructor(private documentClient: DocumentClient) { }

    /**
     * Returns all todo items in the DB.
     * @returns Todo[]
     */
    async getAllTodos(): Promise<Todo[]> {
        const todos = await this.documentClient.scan({
            TableName: this.tableName,
        }).promise();

        return todos.Items as Todo[];
    }

    /**
     * Creates a new Todo item.
     * @param todo <Todo>
     * @returns Promise<Todo>
     */
    async createTodo(todo: Todo): Promise<Todo> {
        await this.documentClient.put({
            TableName: this.tableName,
            Item: todo,
        }).promise();

        return todo as Todo;
    }

    /**
     * Returns one Todo item by ID.
     * @param id string
     * @returns Promise<Todo>
     */
    async getTodo(id: string): Promise<Todo> {
        const todo = await this.documentClient.get({
            TableName: this.tableName,
            Key: { id }
        }).promise();

        if (!todo.Item) {
            throw new Error(`Item with ID ${id} does not exist!`)
        }

        return todo.Item as Todo;
    }

    /**
     * Updates a Todo item.
     * @param id string
     * @returns Promise<Todo>
     */
    async updateTodo(id: string): Promise<Todo> {
        const updatedTodo = await this.documentClient.update({
            TableName: this.tableName,
            Key: { id },
            UpdateExpression: "set #status = :status",
            ExpressionAttributeValues: {
                ":status": true,
            },
            ExpressionAttributeNames: {
                "#status": "status",
            },
            ReturnValues: "ALL_NEW",
        }).promise();

        return updatedTodo.Attributes as Todo;
    }

    async deleteTodo(id: string): Promise<any> {
        return await this.documentClient.delete({
            TableName: this.tableName,
            Key: {
                id
            }
        }).promise();
     }
}