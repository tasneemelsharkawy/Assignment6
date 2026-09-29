const express = require("express");
const router = express.Router();
const collectionController = require("../controllers/collectionController");

router.post("/collection/books", collectionController.createBooksCollection);
router.post("/collection/authors", collectionController.createAuthorsCollection);
router.post("/collection/logs/capped", collectionController.createLogsCappedCollection);
router.post("/collection/books/index", collectionController.createBooksTitleIndex);

module.exports = router;
