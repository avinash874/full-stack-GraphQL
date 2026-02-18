const express = require("express");
const { ApolloServer } = require("@apollo/server");
const { expressMiddleware } = require("@apollo/server/express4");
const cors = require("cors");
const axios = require("axios");

async function startServer() {
    const app = express();

    const server = new ApolloServer({
        typeDefs: `
    type User {
          id: ID!
          name: String!
          username: String!
          email: String!
          phone: String!
          website: String!
    }
          
      type Todo {
       id: ID!
         userId: ID!
         title: String!
         completed: Boolean
         user: User
}

      type Query {
        getTodos: [Todo]
        getAllUsers: [User]
        getUser(id: ID!): User
      }
    `,
        resolvers: {
            Todo: {
              user: async (todo) => {
                try{
            const response = await axios.get(
               `https://jsonplaceholder.typicode.com/users/${todo.id}`
    );
    return response.data;  
  } catch (error) {
      return null; // Don't crash GraphQL
    }
}
},
            Query: {
                getTodos: async () => {
                    const response = await axios.get(
                        "https://jsonplaceholder.typicode.com/todos"
                    );
                    return response.data;
                },

                getAllUsers: async () => {
                    const response = await axios.get(
                        "https://jsonplaceholder.typicode.com/users"
                    );
                    return response.data;
                },

                getUser: async (parent, { id }) => {
                    const response = await axios.get(
                        `https://jsonplaceholder.typicode.com/users/${id}`
                    );
                    return response.data;
                }
            }
        }
    });

    await server.start();
    app.use(cors());
    app.use(express.json());
    app.use("/graphql", expressMiddleware(server));

    app.listen(8000, () =>
        console.log("Server Started at PORT 8000")
    );
}

startServer();
