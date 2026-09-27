const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const JWT_SECRET = "netdef-soc-demo-secret";

const users = [
  {
    id: "USR-001",
    username: "admin",
    passwordHash: bcrypt.hashSync("Admin@123", 10),
    role: "ADMIN",
    name: "SOC Administrator"
  },
  {
    id: "USR-002",
    username: "analyst",
    passwordHash: bcrypt.hashSync("Analyst@123", 10),
    role: "ANALYST",
    name: "SOC Analyst"
  },
  {
    id: "USR-003",
    username: "viewer",
    passwordHash: bcrypt.hashSync("Viewer@123", 10),
    role: "VIEWER",
    name: "SOC Viewer"
  }
];

function authenticateUser(username, password) {

  const user = users.find(
    user => user.username === username
  );

  if (!user) {
    return null;
  }

  const passwordValid =
    bcrypt.compareSync(
      password,
      user.passwordHash
    );

  if (!passwordValid) {
    return null;
  }

  const token = jwt.sign(
    {
      userId: user.id,
      username: user.username,
      role: user.role,
      name: user.name
    },
    JWT_SECRET,
    {
      expiresIn: "2h"
    }
  );

  return {
    token,
    user: {
      id: user.id,
      username: user.username,
      role: user.role,
      name: user.name
    }
  };
}

function verifyToken(token) {

  try {

    return jwt.verify(
      token,
      JWT_SECRET
    );

  }
  catch (error) {

    return null;

  }

}

function getUsers() {

  return users.map(user => ({
    id: user.id,
    username: user.username,
    role: user.role,
    name: user.name
  }));

}

module.exports = {
  authenticateUser,
  verifyToken,
  getUsers
};