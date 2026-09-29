const { getDB } = require("../config/database");

exports.createBooksCollection = async (req, res) => {
  try {
    const db = getDB();

    await db.createCollection("books", {
      validator: {
        $jsonSchema: {
          bsonType: "object",
          required: ["title"],
          properties: {
            title: {
              bsonType: "string",
              minLength: 1,
              description: "title is required and must be a non-empty string",
            },
          },
        },
      },
      validationLevel: "strict",
      validationAction: "error",
    });

    return res.status(201).json({ ok: 1 });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

exports.createAuthorsCollection = async (req, res) => {
  try {
    const db = getDB();

    const result = await db.collection("authors").insertOne(req.body);

    return res.status(201).json({
      acknowledged: result.acknowledged,
      insertedId: result.insertedId,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

exports.createLogsCappedCollection = async (req, res) => {
  try {
    const db = getDB();

    await db.createCollection("logs", {
      capped: true,
      size: 1048576,
    });

    return res.status(201).json({ ok: 1 });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

exports.createBooksTitleIndex = async (req, res) => {
  try {
    const db = getDB();

    const indexName = await db.collection("books").createIndex({ title: 1 });

    return res.status(201).json(indexName);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
