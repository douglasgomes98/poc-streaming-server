const express = require("express");
const cors = require("cors");
const { Readable } = require("stream");

const app = express();
app.use(cors());
const PORT = 3333;

const generateUsers = () => {
  const users = [];
  for (let i = 1; i <= 100; i++) {
    users.push({ id: i, name: `User${i}` });
  }
  return users;
};

app.get("/users", async (req, res) => {
  const users = generateUsers();

  const userStream = new Readable({
    read() {},
  });

  res.setHeader("Content-Type", "application/json");
  res.setHeader("Transfer-Encoding", "chunked");

  // Iniciar o streaming com um colchete de abertura de JSON
  userStream.push("[");

  // Função para adicionar delay de 1 segundo para cada usuário
  const pushUsersWithDelay = async () => {
    for (let i = 0; i < users.length; i++) {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      const userJson = JSON.stringify(users[i]);
      userStream.push(userJson);
      if (i < users.length - 1) {
        userStream.push(",");
      }
    }
    // Finalizar o streaming com um colchete de fechamento de JSON
    userStream.push("]");
    userStream.push(null);
  };

  pushUsersWithDelay();

  // Pipe o stream para a resposta
  userStream.pipe(res);
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
