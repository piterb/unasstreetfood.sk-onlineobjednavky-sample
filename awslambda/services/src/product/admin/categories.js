"use strict";

const db = require("../../../../models/index.js");

const { ValidationError, EmptyResultError } = require("sequelize");

module.exports.create = async (event) => {
  console.log(event);

  if (typeof event.body === "string") {
    var body = JSON.parse(event.body); // sync request
  } else {
    var body = event.body; // async request or local environment
  }

  var headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers":
      "Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With, Accept, Referer, Sec-Fetch-Dest, User-Agent",
  };

  try {
    const category = await db.Category.push(body);

    return {
      statusCode: 201,
      headers: headers,
      body: JSON.stringify(category),
    };
  } catch (e) {
    console.error(e);

    if (e instanceof ValidationError) {
      return {
        statusCode: 400,
        headers: headers,
        body: JSON.stringify({
          type: "ValidationError",
          error: e.errors,
        }),
      };
    } else {
      return {
        statusCode: 500,
        headers: headers,
        body: JSON.stringify({
          error: "Error occured while creating category.",
        }),
      };
    }
  }
};

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
    categories = await db.Category.scope("withAllDescendants").findAll();
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

module.exports.update = async (event) => {
  console.log(event);

  if (typeof event.body === "string") {
    var body = JSON.parse(event.body); // sync request
  } else {
    var body = event.body; // async request or local environment
  }

  var headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "PUT, OPTIONS",
    "Access-Control-Allow-Headers":
      "Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With, Accept, Referer, Sec-Fetch-Dest, User-Agent",
  };

  if (!event.pathParameters.id || event.pathParameters.id == "undefined") {
    return {
      statusCode: 400,
      headers: headers,
      body: JSON.stringify({
        type: "ValidationError",
        error: "Id parameter must be specified",
      }),
    };
  }

  try {
    let category = await db.Category.findByPk(event.pathParameters.id);

    if (!category) {
      return {
        statusCode: 404,
        headers: headers,
        body: JSON.stringify({
          error: "Category was not found",
        }),
      };
    }

    await category.update(body);

    category = await db.Category.scope("withAllDescendants").findByPk(
      event.pathParameters.id
    );

    return {
      statusCode: 200,
      headers: headers,
      body: JSON.stringify(category),
    };
  } catch (e) {
    console.error(e);

    if (e instanceof ValidationError) {
      return {
        statusCode: 400,
        headers: headers,
        body: JSON.stringify({
          type: "ValidationError",
          error: e,
        }),
      };
    } else {
      return {
        statusCode: 500,
        headers: headers,
        body: JSON.stringify({
          error: "Error occured while updating category.",
        }),
      };
    }
  }
};

module.exports.delete = async (event) => {
  console.log(event);

  var headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "PUT, OPTIONS",
    "Access-Control-Allow-Headers":
      "Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With, Accept, Referer, Sec-Fetch-Dest, User-Agent",
  };

  if (!event.pathParameters.id || event.pathParameters.id == "undefined") {
    return {
      statusCode: 400,
      headers: headers,
      body: JSON.stringify({
        type: "ValidationError",
        error: "Id parameter must be specified",
      }),
    };
  }

  try {
    await db.Category.destroy({
      where: {
        id: event.pathParameters.id,
      },
    });

    return {
      statusCode: 200,
      headers: headers,
      body: JSON.stringify({}),
    };
  } catch (e) {
    console.error(e);

    if (e instanceof ValidationError) {
      return {
        statusCode: 400,
        headers: headers,
        body: JSON.stringify({
          type: "ValidationError",
          error: e.errors,
        }),
      };
    } else {
      return {
        statusCode: 500,
        headers: headers,
        body: JSON.stringify({
          error: "Error occured while deleting category.",
        }),
      };
    }
  }
};

module.exports.move = async (event) => {
  console.log(event);

  if (typeof event.body === "string") {
    var body = JSON.parse(event.body); // sync request
  } else {
    var body = event.body; // async request or local environment
  }

  var headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers":
      "Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With, Accept, Referer, Sec-Fetch-Dest, User-Agent",
  };

  if (
    !Number.isInteger(body.fromId) ||
    !Number.isInteger(body.fromIndex) ||
    !Number.isInteger(body.toId) ||
    !Number.isInteger(body.toIndex)
  ) {
    return {
      statusCode: 400,
      headers: headers,
      body: JSON.stringify({
        type: "ValidationError",
        error: "Parameters fromId, fromIndex, toId, toIndex must be specified.",
      }),
    };
  }

  try {
    await db.Category.move(
      body.fromId,
      body.fromIndex,
      body.toId,
      body.toIndex
    );

    return {
      statusCode: 200,
      headers: headers,
      body: JSON.stringify({}),
    };
  } catch (e) {
    console.error(e);

    if (e instanceof EmptyResultError) {
      return {
        statusCode: 404,
        headers: headers,
        body: JSON.stringify({
          error: e.errors,
        }),
      };
    } else if (e instanceof ValidationError) {
      return {
        statusCode: 400,
        headers: headers,
        body: JSON.stringify({
          type: "ValidationError",
          error: e.errors,
        }),
      };
    } else {
      return {
        statusCode: 500,
        headers: headers,
        body: JSON.stringify({
          error: "Error occured while moving category.",
        }),
      };
    }
  }
};
