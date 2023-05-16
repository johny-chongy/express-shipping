"use strict";

const express = require("express");
const { BadRequestError } = require("../expressError");
const jsonschema = require("jsonschema"); //import jsonschema library
const shipSchema = require("../schemas/shipSchema.json"); //import json schema
const router = new express.Router();

const { shipProduct } = require("../shipItApi");

/** POST /ship
 *
 * VShips an order coming from json body:
 *   { productId, name, addr, zip }
 *
 * Returns { shipped: shipId }
 */

router.post("/", async function (req, res, next) {
  const result = jsonschema.validate(req.body, shipSchema, {required: true});

  if (!result.valid) {
    const errs = result.errors.map(err => err.stack);
    throw new BadRequestError(errs);
  };

  const { productId, name, addr, zip } = req.body; //result too big (oogalicious)
  const shipId = await shipProduct({ productId, name, addr, zip });

  return res.json({ shipped: shipId });
});


module.exports = router;