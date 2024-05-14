const { ObjectId } = require("mongodb");
const express = require("express");
require("dotenv").config();

const router = express.Router();
const client = require("../config/db");



router.get("/", async (req, res) => {
  try {
    const data = await client
      .db("eventApp")
      .collection("users")
      .find()
      .toArray();
    res.send(data);
  } catch (error) {
    return res.status(500).send({ error: error.message });
  }
});


router.get("/with-owner-info", async (req, res) => {
  try {
    const data = await client
      .db("eventApp")
      .collection("users")
      .aggregate([
        {
          $lookup: {
            from: "users",
            localField: "ownerId",
            foreignField: "_id",
            as: "owner",
          },
        },
        {
          $unwind: {
            path: "$owner",
            preserveNullAndEmptyArrays: true,
          },
        },
      ])
      .toArray();
    return res.send(data);
  } catch (error) {
    return res.status(500).send({ error: error.message });
  }
});

// router.post("/", async (req, res) => {
//   try {
//     console.log("Received request to create user:", req.body);

//     const newUser = {
//       ...req.body,
//       ownerId: new ObjectId(`${req.body.ownerId}`),
//     };

//     console.log("Creating user in database with data:", newUser);

//     const dbRes = await client
//       .db("eventApp")
//       .collection("users")
//       .insertOne(newUser);

//     if (dbRes.ops && dbRes.ops.length > 0) {
//       console.log("User created successfully:", dbRes.ops[0]);
//       res.send(dbRes.ops[0]);
//     } else {
//       console.log("Failed to create user");
//       res.status(500).send({ error: "Failed to create user" });
//     }
//   } catch (error) {
//     console.error("Error creating user:", error);
//     res.status(500).send({ error: error.message });
//   }
// });




// ok
router.post("/", async (req, res) => {
  try {
    const newUser = {
      ...req.body,
      ownerId: new ObjectId(req.body.ownerId),
    };
    const dbRes = await client
      .db("eventApp")
      .collection("users")
      .insertOne(newUser);
    // res.send(dbRes.ops[0]);
    res.send(dbRes);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});


router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const updatedUser = req.body;
    const data = await client
      .db("eventApp")
      .collection("users")
      .updateOne({ _id: new ObjectId(id) }, { $set: updatedUser });
    res.send(data);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});


router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const data = await client
      .db("eventApp")
      .collection("users")
      .deleteOne({ _id: new ObjectId(id) });
    res.send(data);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

module.exports = router;
