"use strict";

const db = require("../../../models/index.js");

module.exports.read = async (event) => {
  console.log(event);

  var headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, OPTIONS",
    "Access-Control-Allow-Headers":
      "Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With, Accept, Referer, Sec-Fetch-Dest, User-Agent",
  };

  var categories = {};
  var response = {};

  try {
    categories = await db.Category.scope("withAllActiveDescendants").findAll();
  } catch (err) {
    console.log(err);

    response = {
      statusCode: 500,
      headers: headers,
      body: JSON.stringify({
        error: ["Error occured while fetching categories.", err],
      }),
    };
  }

  if (categories.length > 0) {
    response = {
      statusCode: 200,
      headers: headers,
      body: JSON.stringify(categories, null, 2),
    };
  } else {
    response = {
      statusCode: 404,
      headers: headers,
      body: JSON.stringify({ error: "Categories not found" }),
    };
  }

  return response;
};
