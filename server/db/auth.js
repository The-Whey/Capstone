const client = require('./client');
const { v4 } = require('uuid');
const uuidv4 = v4;
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { cli } = require('webpack');


const findUserByToken = async(token) => {
  try {
    const payload = await jwt.verify(token, process.env.JWT);
    const SQL = `
      SELECT id, username, is_admin, is_vip
      FROM users
      WHERE id = $1
    `;
    const response = await client.query(SQL, [payload.id]);
    if(!response.rows.length){
      const error = Error('bad credentials');
      error.status = 401;
      throw error;
    }

    return response.rows[0];
  }
  catch(ex){
    console.log(ex);
    const error = Error('bad credentials');
    error.status = 401;
    throw error;
  }
}

const authenticate = async(credentials)=> {
  const SQL = `
    SELECT id, password
    FROM users
    WHERE username = $1
  `;
  const response = await client.query(SQL, [credentials.username]);
  if(!response.rows.length){
    const error = Error('bad credentials');
    error.status = 401;
    throw error;
  }
  const valid = await bcrypt.compare(credentials.password, response.rows[0].password);
  if(!valid){
    const error = Error('bad credentials');
    error.status = 401;
    throw error;
  }

  return jwt.sign({ id: response.rows[0].id }, process.env.JWT);
};


const createUser = async(user)=> {
  if(!user.username.trim() || !user.password.trim()){
    throw Error('must have username and password');
  }
  user.password = await bcrypt.hash(user.password, 5);
  const SQL = `
    INSERT INTO users (id, username, password, is_admin, is_vip) VALUES($1, $2, $3, $4, $5) RETURNING *
  `;
  const response = await client.query(SQL, [ uuidv4(), user.username, user.password, user.is_admin, user.is_vip]);
  return response.rows[0];
};

const fetchUser = async(id) => {
  SQL = `
  SELECT * FROM users
  WHERE id = $1
  `
  const response = await client.query(SQL, [id])
  return response.rows[0]
}

const updateUser = async(user, id)=> {
  const SQL =`
  UPDATE users
  SET is_vip = $1,
  username = $2,
  is_admin = $3
  WHERE id = $4
  RETURNING *
  `;
  const response = await client.query(SQL, [user.is_vip, user.username, user.is_admin, user.id]);
  return response.rows[0];
}

const fetchUsers = async() => {
  const SQL = `
  SELECT * FROM users
  `
  const response = await client.query(SQL);
  return response.rows
}

const createAddress = async(json) => {
  const SQL =`
  INSERT INTO addresses (id, data, user_id) VALUES ($1, $2, $3)
  `;
  const response = await client.query(SQL, [uuidv4(), json.data, json.user_id])
}

module.exports = {
  createUser,
  authenticate,
  findUserByToken,
  fetchUsers,
  fetchUser,
  updateUser,
  createAddress
};
