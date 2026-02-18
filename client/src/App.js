import { gql } from "@apollo/client";
import { useQuery } from "@apollo/client/react";

const query = gql`
  query GetAllTodos{
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

function App() {
  const { loading, error, data } = useQuery(query);

  if (loading) return <h2>Loading...</h2>;
  if (error) return <h2>Error: {error.message}</h2>;

  return (
    <div>
      <h1>Todos</h1>
      {data.getTodos.slice(0, 10).map((todo) => (
        <div key={todo.id} style={{ marginBottom: "20px" }}>
          <h3>{todo.title}</h3>
          <p>Status: {todo.completed ? "✅ Completed" : "❌ Pending"}</p>
          <p>User: {todo.user?.name}</p>
          <p>Email: {todo.user?.email}</p>
          <hr />
        </div>
      ))}
    </div>
  );
}

export default App;
