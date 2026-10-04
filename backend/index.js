const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const { MongoClient, ObjectId } = require("mongodb");

dotenv.config();

const app = express();

const PORT = 5000;

const client = new MongoClient(process.env.MONGODB_URI);

let booksCollection;

// ==========================================
// MIDDLEWARE
// ==========================================

app.use(
  cors({
    origin: "http://localhost:3000",
  })
);

app.use(express.json());

// ==========================================
// HOME
// ==========================================

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Book Library API is running",
  });
});

// ==========================================
// GET ALL BOOKS
// ==========================================

app.get("/books", async (req, res) => {
  try {
    const books = await booksCollection
      .find({})
      .sort({ createdAt: -1 })
      .toArray();

    res.status(200).json({
      success: true,
      books,
    });
  } catch (error) {
    console.error("GET BOOKS ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Failed to load books",
    });
  }
});

// ==========================================
// GET SINGLE BOOK
// ==========================================

app.get("/books/:id", async (req, res) => {
  try {
    const { id } = req.params;

    if (!ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid book ID",
      });
    }

    const book = await booksCollection.findOne({
      _id: new ObjectId(id),
    });

    if (!book) {
      return res.status(404).json({
        success: false,
        message: "Book not found",
      });
    }

    res.status(200).json({
      success: true,
      book,
    });
  } catch (error) {
    console.error("GET SINGLE BOOK ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Failed to load book",
    });
  }
});

// ==========================================
// CREATE BOOK
// ==========================================

app.post("/books", async (req, res) => {
  try {
    const {
      title,
      author,
      category,
      year,
      description,
      coverImage,
    } = req.body;

    // TITLE
    if (!title || !title.trim()) {
      return res.status(400).json({
        success: false,
        message: "Book title is required",
      });
    }

    // AUTHOR
    if (!author || !author.trim()) {
      return res.status(400).json({
        success: false,
        message: "Author is required",
      });
    }

    // CATEGORY
    if (!category || !category.trim()) {
      return res.status(400).json({
        success: false,
        message: "Category is required",
      });
    }

    // YEAR
    const numericYear = Number(year);

    if (
      !Number.isInteger(numericYear) ||
      numericYear < 1000 ||
      numericYear > 2100
    ) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid publication year",
      });
    }

    const newBook = {
      title: title.trim(),
      author: author.trim(),
      category: category.trim(),
      year: numericYear,
      description:
        description?.trim() ||
        "No description available.",
      coverImage:
        coverImage?.trim() ||
        "https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=900&q=85",
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result =
      await booksCollection.insertOne(newBook);

    res.status(201).json({
      success: true,
      message: "Book created successfully",
      book: {
        _id: result.insertedId,
        ...newBook,
      },
    });
  } catch (error) {
    console.error("CREATE BOOK ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Failed to create book",
    });
  }
});

// ==========================================
// UPDATE BOOK
// ==========================================

app.put("/books/:id", async (req, res) => {
  try {
    const { id } = req.params;

    if (!ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid book ID",
      });
    }

    const {
      title,
      author,
      category,
      year,
      description,
      coverImage,
    } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({
        success: false,
        message: "Book title is required",
      });
    }

    if (!author || !author.trim()) {
      return res.status(400).json({
        success: false,
        message: "Author is required",
      });
    }

    if (!category || !category.trim()) {
      return res.status(400).json({
        success: false,
        message: "Category is required",
      });
    }

    const numericYear = Number(year);

    if (
      !Number.isInteger(numericYear) ||
      numericYear < 1000 ||
      numericYear > 2100
    ) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid publication year",
      });
    }

    const updatedData = {
      title: title.trim(),
      author: author.trim(),
      category: category.trim(),
      year: numericYear,
      description:
        description?.trim() ||
        "No description available.",
      coverImage:
        coverImage?.trim() ||
        "https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=900&q=85",
      updatedAt: new Date(),
    };

    const result =
      await booksCollection.updateOne(
        {
          _id: new ObjectId(id),
        },
        {
          $set: updatedData,
        }
      );

    if (result.matchedCount === 0) {
      return res.status(404).json({
        success: false,
        message: "Book not found",
      });
    }

    const updatedBook =
      await booksCollection.findOne({
        _id: new ObjectId(id),
      });

    res.status(200).json({
      success: true,
      message: "Book updated successfully",
      book: updatedBook,
    });
  } catch (error) {
    console.error("UPDATE BOOK ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Failed to update book",
    });
  }
});

// ==========================================
// DELETE BOOK
// ==========================================

app.delete("/books/:id", async (req, res) => {
  try {
    const { id } = req.params;

    if (!ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid book ID",
      });
    }

    const result =
      await booksCollection.deleteOne({
        _id: new ObjectId(id),
      });

    if (result.deletedCount === 0) {
      return res.status(404).json({
        success: false,
        message: "Book not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Book deleted successfully",
    });
  } catch (error) {
    console.error("DELETE BOOK ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Failed to delete book",
    });
  }
});

// ==========================================
// START SERVER
// ==========================================

async function startServer() {
  try {
    if (!process.env.MONGODB_URI) {
      throw new Error(
        "MONGODB_URI is missing from .env"
      );
    }

    await client.connect();

    console.log("✅ MongoDB connected");

    const db = client.db("bookLibraryDB");

    booksCollection = db.collection("books");

    console.log("✅ Database ready");

    app.listen(PORT, () => {
      console.log(
        `🚀 Book Library API: http://localhost:${PORT}`
      );
    });
  } catch (error) {
    console.error("❌ SERVER ERROR");
    console.error(error);
  }
}

startServer();