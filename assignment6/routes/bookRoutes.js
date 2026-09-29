const express = require("express");
const router = express.Router();
const bookController = require("../controllers/bookController");

router.post("/books/batch", bookController.insertBooksBatch);
router.post("/books", bookController.insertBook);

router.get("/books/title", bookController.findBookByTitle);
router.get("/books/year", bookController.findBooksByYearRange);
router.get("/books/genre", bookController.findBooksByGenre);
router.get("/books/skip-limit", bookController.skipAndLimitBooks);
router.get("/books/year-integer", bookController.findBooksWithIntegerYear);
router.get("/books/exclude-genres", bookController.findBooksExcludingGenres);

router.get("/books/aggregate1", bookController.aggregateFilterSort);
router.get("/books/aggregate2", bookController.aggregateProjectFields);
router.get("/books/aggregate3", bookController.aggregateUnwindGenres);
router.get("/books/aggregate4", bookController.aggregateJoinLogs);

router.delete("/books/before-year", bookController.deleteBooksBeforeYear);

router.patch("/books/:title", bookController.updateBookYear);

module.exports = router;
