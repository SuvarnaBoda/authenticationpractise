const express = require("express");
const path = require("path");
const dbpath = path.join(__dirname, "userData.db");
const app = express();
app.use(express.json());
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
const db = null;
const bcrypt = require("bcrypt");
initializeDBandserver = async () => {
  try {
    const db = await open({
      filename: dbpath,
      driver: sqlite3.Database,
    });
    app.listen(3000, () => {
      console.log("server is running at 3000 port");
    });
  } catch (e) {
    console.log(`DB Error '${e.message}'`);
  }
};

app.post("/register", async (request, response) => {
  const { username, name, password, gender, location } = require.body;
  let hashedpassword = await bcrypt.hash(require.body.password, 10);
  const selectquery = `SELECT * FROM user WHERE username='${username}';`;
  const selectresponse = await db.get(selectquery);
  if (selectresponse === undefined) {
    const createuser = `INSERT INTO user (username,name,password,gender,location) 
            VALUES  '${username}','${name}','${hashedpassword}','${gender}','${location}';`;

    if (password.length < 5) {
      response.status(400);
      response.send("Password is too short");
    } else {
      const newuser = await db.run(createuser);
      response.status(200);
      response.send("User created successfully");
    }
  } else {
    resposne.status(400);
    response.send("User already exists");
  }
});

app.post("/login", async (request, resposne) => {
  const { username, password } = request.body;
  const loginquery = `
        SELECT * FROM user WHERE username='${username}';
    `;
  const loginresponse = await db.get(loginquery);
  if (loginresponse === undefined) {
    response.status(400);
    response.send("Invalid user");
  } else {
    const passwordmatched = bcrypt.compare(password, loginresponse.password);
    if (passwordmatched === true) {
      response.status(200);
      response.send("Login success!");
    } else {
      response.status(400);
      resposne.send("Invalid password");
    }
  }
});

app.put("/change-password", async (request, resposne) => {
  const { username, oldpassword, newpassword } = request.body;
  const putquery = `SELECT * FROM user WHERE username='${username}';`;
  const putresposne = await db.get(putquery);
  if (putresposne === undefined) {
    response.status(400);
    response.send("User not registered");
  } else {
    const ispasswordmatched = bcrypt.compare(oldpassword, putresposne.password);
    if (ispasswordmatched === true) {
      if (newpassword.length < 5) {
        resonse.status(400);
        response.send("Password is too short");
      } else {
        const newpassword = await bcrypt.hash(newpassword, 10);
        const updatepassword = `
            UPDATE user SET newpassword='${newpassword}' WHERE username='${username}';
        `;
        await db.run(updatepassword);
        response.status(200);
        response.send("Password updated");
      }
    } else {
      resposne.status(400);
      reponse.send("Invalid current password");
    }
  }
});
module.exports = app;
