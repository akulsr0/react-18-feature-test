import { startTransition, useEffect, useState } from "react";
import { unstable_batchedUpdates } from "react-dom";
import "./App.css";

function App() {
  // Start Transition
  const [search, setSearchText] = useState("");
  const [names, setNames] = useState([]);
  const [filteredNames, setFilteredNames] = useState([]);

  // Batching
  const [count, setCount] = useState(0);
  const [isDark, setIsDark] = useState(true);
  console.count("ReRender: ");

  useEffect(() => {
    fetch("https://randomuser.me/api/?inc=name&results=100")
      .then((res) => res.json())
      .then(({ results }) => {
        setNames(results);
      });
  }, []);

  const onChangeSearch = (e) => {
    e.preventDefault();
    const searchText = e.target.value;

    // 1st Priority
    setSearchText(setSearchText);
    if (searchText === "") return setFilteredNames([]);

    // 2nd Priority
    startTransition(() => {
      const results = names.filter(({ name }) =>
        name.first.toLowerCase().startsWith(searchText)
      );
      setFilteredNames(results);
    });
  };

  const changeWithoutBatching = () => {
    setCount((prev) => prev + 1); // no rerender
    setIsDark((prev) => !prev); // no rerender
    // rerenders
  };

  const changeWithoutBatchingAPI = () => {
    setTimeout(() => {
      setCount((prev) => prev + 1); // rerender
      setIsDark((prev) => !prev); // rerender again
    });
  };

  const changeWithBatching = () => {
    setTimeout(() => {
      unstable_batchedUpdates(() => {
        setCount((prev) => prev + 1);
        setIsDark((prev) => !prev);
        // rerenders
      });
    });
  };

  return (
    <>
      <h2>React 18 New Features</h2>
      <br />
      <h3>setTransition</h3>
      <br />
      <input
        defaultValue={search}
        onChange={onChangeSearch}
        placeholder={"Search"}
      />
      <ul>
        {filteredNames.map((n, i) => (
          <li key={i}>{n.name.first}</li>
        ))}
      </ul>
      <br />
      <hr />
      <br />
      <h3>Batching</h3>
      <small>Open console for rerender count</small>
      <br />
      <br />
      <p
        style={{
          backgroundColor: isDark ? "#000" : "#fff",
          color: isDark ? "#fff" : "#000",
        }}
      >
        Number: {count}
      </p>
      <br />
      <button onClick={changeWithoutBatching}>Without Batching</button>
      <pre>
        {`const changeWithoutBatching = () => {
  setCount((prev) => prev + 1); // no rerender
  setIsDark((prev) => !prev); // no rerender
  // rerenders
};`}
      </pre>
      <p>
        This will cause <b>one</b> rerender and <b>two</b> state changes
      </p>
      <br />
      <button onClick={changeWithoutBatchingAPI}>
        Without Batching (API/Promise)
      </button>
      <pre>
        {`const changeWithoutBatchingAPI = () => {
  setTimeout(() => {
    setCount((prev) => prev + 1); // rerender
    setIsDark((prev) => !prev); // rerender again
  });
}`}
      </pre>
      <p>
        This will cause <b>two</b> rerender and <b>two</b> state changes
      </p>
      <br />
      <button onClick={changeWithBatching}>
        With Batching (unstable_batchedUpdates)
      </button>
      <pre>
        {`const changeWithBatching = () => {
  setTimeout(() => {
    unstable_batchedUpdates(() => {
      setCount((prev) => prev + 1);
      setIsDark((prev) => !prev);
      // rerenders
    });
  });
};`}
      </pre>
      <p>
        This will cause <b>one</b> rerender and <b>two</b> state changes
      </p>
      <hr />
    </>
  );
}

export default App;
