import { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [data, setData] = useState();
  const [todoName, setTodoName] = useState("");

  useEffect(() => {
    const fetchData = () => {
      fetch("/api/TodoItems")
        .then((response) => response.json())
        .then((data) => setData(data));
    };

    fetchData();
  }, []);

  const handleOnSubmit = (e) => {
    e.preventDefault();
    fetch("/api/TodoItems", {
      method: "POST",
      body: JSON.stringify({ Name: todoName, IsComplete: false }),
      headers: { "Content-Type": "application/json" },
    })
      .then((res) => res.json())
      .then((json) => {
        setData([...data, json]);
        setTodoName("");
      });
  };

  const handleIsCompleteChange = (e) => {
    const id = Number(e.target.value);
    const { name, isComplete } =
      data.find(({ id: todoId }) => todoId === id) || {};

    fetch(`/api/TodoItems/${id}`, {
      method: "PUT",
      body: JSON.stringify({ Id: id, Name: name, IsComplete: !isComplete }),
      headers: { "Content-Type": "application/json" },
    }).then(() =>
      setData(
        data.map((item) =>
          item?.id === id ? { ...item, isComplete: !item.isComplete } : item
        )
      )
    );
  };

  const handleDelete = (e) => {
    e.preventDefault();
    const id = Number(e.target.value);

    fetch(`/api/TodoItems/${id}`, {
      method: "DELETE",
    }).then(() => setData(data.filter((item) => item.id !== id)));
  };

  console.log(data);

  return (
    <div className="App">
      <header className="App-header">
        <form onSubmit={handleOnSubmit}>
          <input
            type="text"
            value={todoName}
            onChange={(e) => setTodoName(e.target.value)}
          />
          <input type="submit" disabled={!todoName} />
        </form>
        {data &&
          data.map(({ id, name, isComplete }, i) => (
            <p key={i}>
              <input
                type="checkbox"
                id={id}
                value={id}
                checked={isComplete}
                onChange={handleIsCompleteChange}
              />
              {name}
              <button value={id} onClick={handleDelete}>
                Delete
              </button>
            </p>
          ))}
      </header>
    </div>
  );
}

export default App;
