"I built a full-stack GraphQL application using Apollo Server and Apollo Client. The backend fetches data from a REST API and exposes it via GraphQL with nested resolvers. The React frontend consumes the GraphQL API using Apollo Client v4. I also handled relational data, error handling, and understood the N+1 problem."

* npm init -y
* npm install express @apollo/server graphql cors body-parser

* for checking in the apollo use this
https://studio.apollographql.com/sandbox/explorer

# 🚀 Full Stack GraphQL Todo Application — Summary

* 📌 Project Overview

This project demonstrates a Full Stack GraphQL Application built using:

* 🔹 Backend

Node.js
Express
Apollo Server (GraphQL)
Axios (REST API integration)
JSONPlaceholder (Mock API)

* 🔹 Frontend

React (Create React App)
Apollo Client v4
GraphQL

* The application fetches Todos and Users from a REST API and exposes them via a GraphQL server. The React frontend consumes that GraphQL API.

🧠 What is GraphQL?

* GraphQL is:
A query language for APIs
A runtime for executing queries
A single endpoint API architecture

* Unlike REST, GraphQL allows:
Requesting exactly the fields needed
Fetching nested relational data in one request
Reducing over-fetching and under-fetching

# 🔁 REST vs GraphQL (In This Project)
* REST Approach
To fetch todos with user info:
```fs
GET /todos
GET /users/:id   (multiple times)
```
Multiple requests required.

# GraphQL Approach
```fs
query {
  getTodos {
    title
    completed
    user {
      name
      email
    }
  }
}
```
Single request → Nested data returned.

# 🏗 Backend Architecture
# 📄 GraphQL Schema
```fs
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

```

# ⚙ Backend Implementation

# 1️⃣ Express + Apollo Server Setup

Express runs server on port 8000
Apollo Server handles GraphQL
expressMiddleware connects Apollo with Express

```fs
app.use(cors());
app.use(express.json());
app.use("/graphql", expressMiddleware(server));
```
# 2️⃣ Root Query Resolvers
* getTodos
```fs
getTodos: async () => {
  const response = await axios.get(
    "https://jsonplaceholder.typicode.com/todos"
  );
  return response.data;
}

```
* getUser
```fs
getUser: async (parent, { id }) => {
  const response = await axios.get(
    `https://jsonplaceholder.typicode.com/users/${id}`
  );
  return response.data;
}

```
# 3️⃣ Nested Resolver (Relation)
```fs
Todo: {
  user: async (todo) => {
    try {
      const response = await axios.get(
        `https://jsonplaceholder.typicode.com/users/${todo.userId}`
      );
      return response.data;
    } catch {
      return null;
    }
  }
}

```
This connects:
```fs
Todo → User
```

# 🎯 Frontend Implementation
Apollo Client v4 Setup
Apollo v4 requires HttpLink.
```fs
const client = new ApolloClient({
  link: new HttpLink({
    uri: "http://localhost:8000/graphql",
  }),
  cache: new InMemoryCache(),
});

```
# GraphQL Query in React
```fs
const query = gql`
  query GetAllTodos {
    getTodos {
      id
      title
      completed
      user {
        id
        name
        email
      }
    }
  }
`;

```

* Using useQuery Hook
```fs
const { loading, error, data } = useQuery(query);
```

* Rendering Data
```fs
{data.getTodos.slice(0, 10).map((todo) => (
  <div key={todo.id}>
    <h3>{todo.title}</h3>
    <p>Status: {todo.completed ? "✅" : "❌"}</p>
    <p>User: {todo.user?.name}</p>
  </div>
))}
```
# 🔄 Full Data Flow

```tree
React (Frontend)
        ↓
Apollo Client
        ↓
GraphQL Server (Apollo Server)
        ↓
Axios
        ↓
JSONPlaceholder REST API

```
# ⚠ N+1 Problem

* When fetching 100 todos:

1 API call for todos
100 API calls for users
This is called:
N+1 Problem
Better solutions:
DataLoader
Batching

Fetch users once and map locally