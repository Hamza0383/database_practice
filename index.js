const { faker } = require("@faker-js/faker");
const mysql = require("mysql2");
const express = require("express");
const app = express();
const path = require("path");
const methodOverride = require("method-override");
const { v4: uuidv4 } = require("uuid");
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"));
app.use(methodOverride("_method"));
app.use(express.urlencoded({ extended: true }));
app.get("/", (req, res) => {
  let q = "SELECT count(*) FROM user";

  try {
    connection.query(q, (err, result) => {
      if (err) throw err;
      const count = result[0]["count(*)"];
      res.render("home.ejs", { count });
    });
  } catch (error) {
    console.log(error);
    res.send("some error in db");
  }
});
app.get("/user", (req, res) => {
  let q = "SELECT * FROM user";
  try {
    connection.query(q, (err, users) => {
      if (err) throw err;
      res.render("user.ejs", { users });
    });
  } catch (error) {
    console.log(error);
    res.send("some error in db");
  }
});

app.get("/user/:id/edit", (request, res) => {
  let { id } = request.params;
  let q = `SELECT * FROM user WHERE id="${id}"`;
  try {
    connection.query(q, (err, result) => {
      if (err) throw err;
      let user = result[0];
      res.render("edit.ejs", { user });
    });
  } catch (error) {
    console.log(error);
    res.send("Some Error in DB");
  }
});
app.patch("/user/:id", (req, res) => {
  let { id } = req.params;
  let { username: updateUserName, password: updatePassword } = req.body;
  let q = `SELECT * FROM user WHERE id="${id}"`;

  try {
    connection.query(q, (err, result) => {
      if (err) throw err;
      let user = result[0];
      if (updatePassword != user.password) {
        res.send("worng password");
      } else {
        let q2 = `UPDATE user SET username='${updateUserName}' WHERE id='${id}'`;
        connection.query(q2, (err, result) => {
          if (err) throw err;
          res.redirect("/user");
        });
      }
    });
  } catch (error) {
    console.log(error);
    res.send("Some Error in DB");
  }
});
app.get("/newUser", (req, res) => {
  res.render("newUser.ejs");
});
app.post("/newUser", (req, res) => {
  let { username, email, password } = req.body;
  let q = "INSERT INTO user(id, username, email, password) VALUES (?)";
  let data = [uuidv4(), username, email, password];
  try {
    connection.query(q, [data], (err, result) => {
      if (err) throw err;
      console.log(result);
      res.redirect("/");
    });
  } catch (error) {
    console.log(error);
    res.send("SOme Error");
  }
});
app.delete("/user/:id", (req, res) => {
  let { id } = req.params;
  let q = `DELETE FROM user WHERE id='${id}'`;
  try {
    connection.query(q, (err, reslut) => {
      if (err) throw err;
      console.log(reslut);
      res.send("delete");
    });
  } catch (error) {
    console.log(error);
    res.send("SOme Error");
  }
});
app.listen("8080", () => {
  console.log("app is listening");
});
const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  database: "delta_app",
  password: "Hamxa##0383",
});
const getRandomUser = () => {
  return [
    faker.string.uuid(),
    faker.internet.userName(),
    faker.internet.email(),
    faker.internet.password(),
  ];
};

// let q = "INSERT INTO user(id, username, email, password) VALUES ?";
// try {
//   connection.query(q, [data], (err, result) => {
//     if (err) throw err;
//     console.log(result);
//   });
// } catch (error) {
//   console.log(error);
// }
// connection.end();
