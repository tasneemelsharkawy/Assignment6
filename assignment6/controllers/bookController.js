const { Int32 } = require("mongodb");
const { getDB } = require("../config/database");

function normalizeBook(book) {
  const doc = { ...book };
  if (doc.year !== undefined && doc.year !== null) {
    doc.year = new Int32(Number(doc.year));
  }
  return doc;
}

exports.insertBook = async (req, res) => {
  try {
    const db = getDB();

    const result = await db.collection("books").insertOne(normalizeBook(req.body));

    return res.status(201).json({
      acknowledged: result.acknowledged,
      insertedId: result.insertedId,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

exports.insertBooksBatch = async (req, res) => {
  try {
    const db = getDB();
    const books = Array.isArray(req.body) ? req.body : req.body.books;

    if (!Array.isArray(books) || books.length < 3) {
      return res.status(400).json({ message: "Please send an array of at least three books." });
    }

    const result = await db.collection("books").insertMany(books.map(normalizeBook));

    return res.status(201).json({
      acknowledged: result.acknowledged,
      insertedIds: result.insertedIds,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

exports.updateBookYear = async (req, res) => {
  try {
    const db = getDB();
    const { title } = req.params;
    const newYear = req.body.year !== undefined ? Number(req.body.year) : 2022;

    const result = await db
      .collection("books")
      .updateOne({ title }, { $set: { year: new Int32(newYear) } });

    return res.status(200).json({
      acknowledged: result.acknowledged,
      matchedCount: result.matchedCount,
      modifiedCount: result.modifiedCount,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

exports.findBookByTitle = async (req, res) => {
  try {
    const db = getDB();
    const { title } = req.query;

    const book = await db.collection("books").findOne({ title });

    if (!book) {
      return res.status(404).json({ message: "no book found" });
    }

    return res.status(200).json(book);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

exports.findBooksByYearRange = async (req, res) => {
  try {
    const db = getDB();
    const { from, to } = req.query;

    const books = await db
      .collection("books")
      .find({ year: { $gte: Number(from), $lte: Number(to) } })
      .toArray();

    return res.status(200).json(books);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

exports.findBooksByGenre = async (req, res) => {
  try {
    const db = getDB();
    const { genre } = req.query;

    const books = await db.collection("books").find({ genres: genre }).toArray();

    return res.status(200).json(books);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

exports.skipAndLimitBooks = async (req, res) => {
  try {
    const db = getDB();

    const books = await db
      .collection("books")
      .find()
      .sort({ year: -1 })
      .skip(2)
      .limit(3)
      .toArray();

    return res.status(200).json(books);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

exports.findBooksWithIntegerYear = async (req, res) => {
  try {
    const db = getDB();

    const books = await db.collection("books").find({ year: { $type: "int" } }).toArray();

    return res.status(200).json(books);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

exports.findBooksExcludingGenres = async (req, res) => {
  try {
    const db = getDB();

    const books = await db
      .collection("books")
      .find({ genres: { $nin: ["Horror", "Science Fiction"] } })
      .toArray();

    return res.status(200).json(books);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

exports.deleteBooksBeforeYear = async (req, res) => {
  try {
    const db = getDB();
    const { year } = req.query;

    const result = await db.collection("books").deleteMany({ year: { $lt: Number(year) } });

    return res.status(200).json({
      acknowledged: result.acknowledged,
      deletedCount: result.deletedCount,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

exports.aggregateFilterSort = async (req, res) => {
  try {
    const db = getDB();

    const books = await db
      .collection("books")
      .aggregate([{ $match: { year: { $gt: 2000 } } }, { $sort: { year: -1 } }])
      .toArray();

    return res.status(200).json(books);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

exports.aggregateProjectFields = async (req, res) => {
  try {
    const db = getDB();

    const books = await db
      .collection("books")
      .aggregate([
        { $match: { year: { $gt: 2000 } } },
        { $project: { _id: 0, title: 1, author: 1, year: 1 } },
      ])
      .toArray();

    return res.status(200).json(books);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

exports.aggregateUnwindGenres = async (req, res) => {
  try {
    const db = getDB();

    const books = await db
      .collection("books")
      .aggregate([
        { $unwind: "$genres" },
        { $project: { _id: 0, title: 1, genres: 1 } },
      ])
      .toArray();

    return res.status(200).json(books);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

exports.aggregateJoinLogs = async (req, res) => {
  try {
    const db = getDB();

    const result = await db
      .collection("logs")
      .aggregate([
        {
          $lookup: {
            from: "books",
            localField: "book_id",
            foreignField: "_id",
            as: "book_details",
          },
        },
        {
          $project: {
            _id: 0,
            action: 1,
            "book_details.title": 1,
            "book_details.author": 1,
            "book_details.year": 1,
          },
        },
      ])
      .toArray();

    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
