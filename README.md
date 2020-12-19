# Easymerch Back End
[![License: ISC](https://img.shields.io/badge/License-ISC-blue.svg)](https://opensource.org/licenses/ISC)

## Table of Contents
- [Links](#Links)
- [Installation](#Installation)
- [Usage](#Usage)
- [Tag Routes](#Tags)
- [Categories Routes](#Categories)
- [Product Routes](#Products)
- [License](#License)

## Description

This application functions as back-end for an e-commerce site that establishes a database relation map to construct an API that can be used to create, read, updated, and delete products, categories and tags

![Insomnia Core API setup](https://github.com/jdmarty/easymerchBackEnd/blob/main/Assets/finishedsnip.PNG)

## Links

- [Repository](https://github.com/jdmarty/easymerchBackEnd)
- [Demonstration Video](https://drive.google.com/file/d/1Kmy6ExaT_blDG9yZd1Kd91n0cWaQVxsX/view?usp=sharing)

## Installation
1. Clone the github repo from the following link [https://github.com/jdmarty/easymerchBackEnd](https://github.com/jdmarty/easymerchBackEnd).
2. Update the .env.EXAMPLE file with the username (DB_USER) and password (DB_PW) for the desired MySQL database
3. Remove the .EXAMPLE extension from the .env file.
4. Run the code in schema.sql in an SQL workbench to create the database that will be connected based on the information in the .env file.
5. Open a node terminal in the root directory.
6. Run "npm install" in the terminal
7. Run "npm run seed" in the terminal to seed the database with a pre-built data set.
8. Run "npm start" in the terminal to start the application server

## Usage

Use an application like Postman or Insomnia Core to make calls to the API once the server is listening

### Tags
- GET http://localhost:3001/api/tags to Read all tags
- GET http://localhost:3001/api/tags/{id} to Read a single tag by id
- POST http://localhost:3001/api/tags to Create a new tag
  - request body is a JSON object containing a single key "tag_name" with a string value
- PUT http://localhost:3001/api/tags/{id} to Update a single tag name by id
  - request body is a JSON object containing a single key "tag_name" with a string value
- DELETE http://localhost:3001/api/tags/{id} to Delete a single tag by id


### Categories
- GET http://localhost:3001/api/categories to Read all categories
- GET http://localhost:3001/api/categories/{id} to Read a single category by id
- POST http://localhost:3001/api/categories to Create a new category
  - request body is a JSON object with the following key-value pairs:
    - category_name: string **required**
- PUT http://localhost:3001/api/categories/{id} to Update a single category name by id
  - request body is a JSON object with the following key-value pairs:
    - category_name: string **required**
- DELETE http://localhost:3001/api/categories/{id} to Delete a single category by id

### Products
- GET http://localhost:3001/api/products to Read all products
- GET http://localhost:3001/api/products{id} to Read a single product by id
- POST http://localhost:3001/api/products to Create a new product
  - request body is a JSON object with the following key-value pairs:
    - product_name: string **required**
    - price: decimal **required**
    - tagIds: Array of tag id integers **required**
    - stock: integer
- PUT http://localhost:3001/api/products/{id} to Update a single product by id
  - request body is an JSON object with the the following key-value pairs
    - tagIds: Array of tag id integers **required**
    - category_id: category id integer
    - product_name: string
    - price: decimal
    - stock: integer
- DELETE http://localhost:3001/api/tags/{id} to Delete a single product by id

## License
This application uses the ISC license

