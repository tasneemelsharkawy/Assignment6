const { ObjectId } = require("mongodb");
const { getDB } = require("../config/database");

exports.insertLog = async (req, res) => {
  try {
    const db = getDB();
    const { book_id, action, ...rest } = req.body;

    const doc = { ...rest, action };
    if (book_id) {
      doc.book_id = ObjectId.isValid(book_id) ? new ObjectId(book_id) : book_id;
    }

    const result = await db.collection("logs").insertOne(doc);

    return res.status(201).json({
      acknowledged: result.acknowledged,
      insertedId: result.insertedId,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
