import axios from "axios";
import { useEffect, useState } from "react";

export function Users() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = () => {
      axios({
        method: "get",
        url: "http://localhost:3333/users",
        responseType: "stream",
        onDownloadProgress: (progressEvent) => {
          const receivedText = progressEvent.event.currentTarget.responseText;
          const matches = receivedText.match(/\{.*?\}/g);
          if (matches) {
            const newUsers = matches.map((match) => JSON.parse(match));
            setUsers(newUsers);
          }
        },
      });
    };

    fetchUsers();
  }, []);

  return (
    <div className="App">
      <h1>Users List</h1>
      <ul>
        {users.map((user) => (
          <li key={user.id}>
            {user.id}: {user.name}
          </li>
        ))}
      </ul>
    </div>
  );
}
