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


const insertProductTags = async (product_id, tag_id) => {
    try {
      const SQL = `
        INSERT INTO product_tags (product_id, tag_id) VALUES ($1, $2);
      `
      await client.query(SQL, [product_id, tag_id])
  
      console.log(`Successfully inserted product tag for product_id: ${product_id}, tag_name: ${tag_id}`)
    } catch (error) {
      console.error(`Error inserting product tag: ${error.message}`)
    }
  }
  const createTags = async (tag) => {
    try {
      const SQL = `
        INSERT INTO tags (id, tag) VALUES ($1, $2);
      `
      const response = await client.query(SQL, [ uuidv4(), tag.tag])
      return response.rows[0];
  
    } catch (error) {
      console.error(`Error inserting product tag: ${error.message}`)
    }
  }
module.exports = {
  fetchTags,
  insertProductTags,
  createTags,
};
