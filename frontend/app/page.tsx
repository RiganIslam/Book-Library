"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import BookModal from "@/components/BookModal";

const API_URL = "http://localhost:5000";

type Book = {
  _id: string;
  title: string;
  author: string;
  category: string;
  year: number;
  description: string;
  coverImage: string;
  createdAt: string;
};

const categories = [
  "All",
  "Fiction",
  "Fantasy",
  "Romance",
  "Mystery",
  "History",
  "Science",
  "Biography",
  "Self Help",
];

export default function Home() {
  const [books, setBooks] = useState<Book[]>([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  const [search, setSearch] = useState("");

  const [category, setCategory] =
    useState("All");

  const [modalOpen, setModalOpen] =
    useState(false);

  const [editingBook, setEditingBook] =
    useState<Book | null>(null);

  // =========================================
  // LOAD BOOKS
  // =========================================

  async function loadBooks() {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        `${API_URL}/books`,
        {
          cache: "no-store",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Failed to load books"
        );
      }

      setBooks(data.books || []);
    } catch (error) {
      console.error(error);

      setError(
        error instanceof Error
          ? error.message
          : "Could not connect to server."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadBooks();
  }, []);

  // =========================================
  // FILTER
  // =========================================

  const filteredBooks = useMemo(() => {
    const keyword =
      search.toLowerCase().trim();

    return books.filter((book) => {
      const matchesSearch =
        book.title
          .toLowerCase()
          .includes(keyword) ||
        book.author
          .toLowerCase()
          .includes(keyword);

      const matchesCategory =
        category === "All" ||
        book.category === category;

      return (
        matchesSearch &&
        matchesCategory
      );
    });
  }, [books, search, category]);

  // =========================================
  // DELETE
  // =========================================

  async function deleteBook(id: string) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this book?"
    );

    if (!confirmed) return;

    try {
      const response = await fetch(
        `${API_URL}/books/${id}`,
        {
          method: "DELETE",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Failed to delete book"
        );
      }

      setBooks((current) =>
        current.filter(
          (book) => book._id !== id
        )
      );
    } catch (error) {
      alert(
        error instanceof Error
          ? error.message
          : "Delete failed"
      );
    }
  }

  // =========================================
  // ADD
  // =========================================

  function openAddModal() {
    setEditingBook(null);
    setModalOpen(true);
  }

  // =========================================
  // EDIT
  // =========================================

  function openEditModal(book: Book) {
    setEditingBook(book);
    setModalOpen(true);
  }

  return (
    <main className="min-h-screen overflow-hidden">

      {/* ================================= */}
      {/* HERO */}
      {/* ================================= */}

      <section className="relative px-5 pb-20 pt-8 md:px-10">

        <div className="art-orb orb-one" />
        <div className="art-orb orb-two" />
        <div className="art-orb orb-three" />

        <div className="mx-auto max-w-7xl">

          {/* NAVBAR */}

          <nav className="relative z-10 flex items-center justify-between">

            <Link
              href="/"
              className="brand"
            >
              <span className="brand-mark">
                B
              </span>

              <span>
                Bibliothèque
              </span>
            </Link>

            <button
              onClick={openAddModal}
              className="nav-add"
            >
              <span>+</span>
              Add Book
            </button>

          </nav>

          {/* HERO CONTENT */}

          <div className="hero-grid">

            <div className="hero-content">

              <p className="eyebrow">
                THE CURATED READING ROOM
              </p>

              <h1 className="hero-title">
                Stories worth
                <br />
                <span>remembering.</span>
              </h1>

              <p className="hero-description">
                A beautifully curated digital
                library for the books that
                inspire, teach and stay with us
                long after the final page.
              </p>

              <div className="hero-actions">

                <button
                  onClick={openAddModal}
                  className="primary-button"
                >
                  Add a new book
                  <span>↗</span>
                </button>

                <a
                  href="#library"
                  className="secondary-button"
                >
                  Explore collection
                </a>

              </div>

            </div>

            {/* DECORATIVE BOOK */}

            <div className="hero-art">

              <div className="floating-card">
                <div className="floating-card-inner">

                  <div className="book-spine">
                    <span>
                      BIBLIOTHÈQUE
                    </span>
                  </div>

                  <div className="book-cover">
                    <p>
                      THE
                    </p>

                    <h2>
                      Art
                      <br />
                      of
                      <br />
                      Reading
                    </h2>

                    <span>
                      VOL. 01
                    </span>
                  </div>

                </div>
              </div>

            </div>

          </div>

          {/* STATS */}

          <div className="hero-stats">

            <div>
              <strong>
                {books.length}
              </strong>

              <span>
                Books
              </span>
            </div>

            <div>
              <strong>
                {new Set(
                  books.map(
                    (book) => book.author
                  )
                ).size}
              </strong>

              <span>
                Authors
              </span>
            </div>

            <div>
              <strong>
                {new Set(
                  books.map(
                    (book) => book.category
                  )
                ).size}
              </strong>

              <span>
                Genres
              </span>
            </div>

          </div>

        </div>
      </section>

      {/* ================================= */}
      {/* LIBRARY */}
      {/* ================================= */}

      <section
        id="library"
        className="library-section"
      >

        <div className="mx-auto max-w-7xl px-5 md:px-10">

          {/* HEADER */}

          <div className="library-header">

            <div>
              <p className="section-label">
                THE COLLECTION
              </p>

              <h2 className="section-title">
                Your Library
              </h2>
            </div>

            <p className="section-count">
              {filteredBooks.length}{" "}
              volumes
            </p>

          </div>

          {/* SEARCH */}

          <div className="filter-bar">

            <div className="search-wrapper">

              <span>
                ⌕
              </span>

              <input
                value={search}
                onChange={(e) =>
                  setSearch(
                    e.target.value
                  )
                }
                placeholder="Search by title or author..."
              />

              {search && (
                <button
                  onClick={() =>
                    setSearch("")
                  }
                  className="clear-search"
                >
                  ×
                </button>
              )}

            </div>

            <div className="category-list">

              {categories.map(
                (item) => (
                  <button
                    key={item}
                    onClick={() =>
                      setCategory(item)
                    }
                    className={
                      category === item
                        ? "category active"
                        : "category"
                    }
                  >
                    {item}
                  </button>
                )
              )}

            </div>

          </div>

          {/* ERROR */}

          {error && (
            <div className="error-box">

              <strong>
                Something went wrong
              </strong>

              <p>{error}</p>

              <button
                onClick={loadBooks}
              >
                Try Again
              </button>

            </div>
          )}

          {/* LOADING */}

          {loading ? (
            <div className="book-grid">

              {Array.from({
                length: 6,
              }).map((_, index) => (
                <div
                  key={index}
                  className="skeleton-card"
                >
                  <div className="skeleton-image" />

                  <div className="skeleton-line" />

                  <div className="skeleton-small" />
                </div>
              ))}

            </div>
          ) : filteredBooks.length === 0 ? (
            <div className="empty-state">

              <div className="empty-icon">
                ♧
              </div>

              <h3>
                No books found
              </h3>

              <p>
                Try another search or add a
                new book to your collection.
              </p>

              <button
                onClick={openAddModal}
                className="primary-button"
              >
                Add your first book
              </button>

            </div>
          ) : (
            <div className="book-grid">

              {filteredBooks.map(
                (book, index) => (
                  <article
                    key={book._id}
                    className="book-card"
                    style={{
                      animationDelay: `${
                        index * 70
                      }ms`,
                    }}
                  >

                    {/* IMAGE */}

                    <Link
                      href={`/books/${book._id}`}
                      className="book-image-wrapper"
                    >

                      <img
                        src={book.coverImage}
                        alt={book.title}
                        className="book-image"
                      />

                      <div className="image-overlay">
                        <span>
                          Read details →
                        </span>
                      </div>

                      <span className="book-year">
                        {book.year}
                      </span>

                    </Link>

                    {/* CONTENT */}

                    <div className="book-content">

                      <p className="book-category">
                        {book.category}
                      </p>

                      <Link
                        href={`/books/${book._id}`}
                      >
                        <h3 className="book-title">
                          {book.title}
                        </h3>
                      </Link>

                      <p className="book-author">
                        by {book.author}
                      </p>

                      <p className="book-description">
                        {book.description}
                      </p>

                      {/* ACTIONS */}

                      <div className="book-actions">

                        <Link
                          href={`/books/${book._id}`}
                          className="details-link"
                        >
                          View book
                          <span>↗</span>
                        </Link>

                        <div className="small-actions">

                          <button
                            onClick={() =>
                              openEditModal(
                                book
                              )
                            }
                            aria-label="Edit book"
                          >
                            Edit
                          </button>

                          <button
                            onClick={() =>
                              deleteBook(
                                book._id
                              )
                            }
                            aria-label="Delete book"
                          >
                            Delete
                          </button>

                        </div>

                      </div>

                    </div>

                  </article>
                )
              )}

            </div>
          )}

        </div>
      </section>

      {/* ================================= */}
      {/* FOOTER */}
      {/* ================================= */}

      <footer className="footer">

        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-5 py-8 md:flex-row md:items-center md:justify-between md:px-10">

          <div className="brand">
            <span className="brand-mark">
              B
            </span>

            Bibliothèque
          </div>

          <p>
            A quiet place for loud ideas.
          </p>

        </div>

      </footer>

      {/* ================================= */}
      {/* MODAL */}
      {/* ================================= */}

      {modalOpen && (
        <BookModal
          book={editingBook}
          onClose={() => {
            setModalOpen(false);
            setEditingBook(null);
          }}
          onSaved={() => {
            setModalOpen(false);
            setEditingBook(null);
            loadBooks();
          }}
        />
      )}

    </main>
  );
}