const client = require('./client');
const { v4 } = require('uuid');
const uuidv4 = v4;

const fetchTags = async()=> {
  const SQL = `
    SELECT *
    FROM product_tags
  `;
  const response = await client.query(SQL);
  return response.rows;
};

const fetchTagList = async() => {
  const SQL = `
    SELECT * FROM tags
  `;
  const response = await client.query(SQL);
  return response.rows
}

const checkDupeTags = async(json) => {
  const SQL =`
    SELECT * FROM tags WHERE tag = $1
  `;
  const response = await client.query(SQL, [json.tag])
  return response.rows[0]
}

const checkDupeProductTags = async(product_id, tag_id) => {
  const SQL =`
  SELECT * FROM product_tags
  WHERE product_id = $1 AND tag_id = $2
  `
  const response = await client.query(SQL, [product_id, tag_id]);
  return response.rows[0]
}


const insertProductTags = async (product_id, tag_id, tag) => {

    const SQL = `
      INSERT INTO product_tags (id, product_id, tag_id, tag) VALUES ($1, $2, $3, $4)  RETURNING *;
    `
    const response = await client.query(SQL, [uuidv4(), product_id, tag_id, tag])
    return response.rows[0];
  }
  
const createTags = async (tag) => {

  const SQL = `
    INSERT INTO tags (id, tag) VALUES ($1, $2)  RETURNING *;
  `
  const response = await client.query(SQL, [ uuidv4(), tag.tag])
  console.log(`inserting tag: ${tag.tag}`)
  return response.rows[0];

  }

module.exports = {
  fetchTags,
  insertProductTags,
  createTags,
  fetchTagList,
  checkDupeTags,
  checkDupeProductTags
};
