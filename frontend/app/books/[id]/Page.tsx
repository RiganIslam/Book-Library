"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";

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

export default function BookDetails() {
  const params = useParams();

  const router = useRouter();

  const id = params.id as string;

  const [book, setBook] =
    useState<Book | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  // ======================================
  // LOAD SINGLE BOOK
  // ======================================

  async function loadBook() {
    try {
      setLoading(true);

      const response = await fetch(
        `${API_URL}/books/${id}`,
        {
          cache: "no-store",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Failed to load book"
        );
      }

      setBook(data.book);
    } catch (error) {
      console.error(error);

      setError(
        error instanceof Error
          ? error.message
          : "Book not found"
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (id) {
      loadBook();
    }
  }, [id]);

  // ======================================
  // DELETE
  // ======================================

  async function deleteBook() {
    if (!book) return;

    const confirmed = window.confirm(
      `Delete "${book.title}"?`
    );

    if (!confirmed) return;

    try {
      const response = await fetch(
        `${API_URL}/books/${book._id}`,
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

      router.push("/");
    } catch (error) {
      alert(
        error instanceof Error
          ? error.message
          : "Delete failed"
      );
    }
  }

  // ======================================
  // LOADING
  // ======================================

  if (loading) {
    return (
      <main className="details-page">

        <div className="details-loading">

          <div className="loading-circle" />

          <p>
            Opening the book...
          </p>

        </div>

      </main>
    );
  }

  // ======================================
  // ERROR
  // ======================================

  if (error || !book) {
    return (
      <main className="details-page">

        <div className="details-error">

          <span>404</span>

          <h1>
            This book could not be found.
          </h1>

          <p>
            The volume may have been
            removed or the link is invalid.
          </p>

          <Link
            href="/"
            className="primary-button"
          >
            ← Back to library
          </Link>

        </div>

      </main>
    );
  }

  return (
    <main className="details-page">

      {/* BACKGROUND */}

      <div className="details-orb" />

      <div className="mx-auto max-w-6xl px-5 py-8 md:px-10">

        {/* NAV */}

        <nav className="mb-14 flex items-center justify-between">

          <Link
            href="/"
            className="brand"
          >
            <span className="brand-mark">
              B
            </span>

            Bibliothèque
          </Link>

          <Link
            href="/"
            className="back-link"
          >
            ← Library
          </Link>

        </nav>

        {/* CONTENT */}

        <div className="details-grid">

          {/* BOOK COVER */}

          <div className="details-cover-area">

            <div className="details-cover">

              <img
                src={book.coverImage}
                alt={book.title}
              />

            </div>

            <div className="cover-shadow" />

          </div>

          {/* INFORMATION */}

          <div className="details-content">

            <p className="book-category">
              {book.category}
            </p>

            <h1>
              {book.title}
            </h1>

            <p className="details-author">
              by{" "}
              <strong>
                {book.author}
              </strong>
            </p>

            <div className="details-meta">

              <div>
                <span>
                  Published
                </span>

                <strong>
                  {book.year}
                </strong>
              </div>

              <div>
                <span>
                  Genre
                </span>

                <strong>
                  {book.category}
                </strong>
              </div>

            </div>

            <div className="details-divider" />

            <p className="details-description">
              {book.description}
            </p>

            <div className="details-actions">

              <button
                onClick={() =>
                  router.push("/")
                }
                className="secondary-button"
              >
                ← Back to collection
              </button>

              <button
                onClick={deleteBook}
                className="danger-button"
              >
                Delete Book
              </button>

            </div>

            <p className="details-quote">
              “A reader lives a thousand lives
              before he dies.”
            </p>

          </div>

        </div>

      </div>

    </main>
  );
}