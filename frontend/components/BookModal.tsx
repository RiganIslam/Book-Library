"use client";

import { useState } from "react";

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

type Props = {
  book: Book | null;
  onClose: () => void;
  onSaved: () => void;
};

const categories = [
  "Fiction",
  "Fantasy",
  "Romance",
  "Mystery",
  "History",
  "Science",
  "Biography",
  "Self Help",
];

export default function BookModal({
  book,
  onClose,
  onSaved,
}: Props) {
  const [title, setTitle] = useState(
    book?.title || ""
  );

  const [author, setAuthor] = useState(
    book?.author || ""
  );

  const [category, setCategory] = useState(
    book?.category || ""
  );

  const [year, setYear] = useState(
    book?.year?.toString() || ""
  );

  const [description, setDescription] =
    useState(book?.description || "");

  const [coverImage, setCoverImage] =
    useState(book?.coverImage || "");

  const [saving, setSaving] =
    useState(false);

  const [error, setError] =
    useState("");

  async function handleSubmit(
    e: React.FormEvent
  ) {
    e.preventDefault();

    setError("");

    if (!title.trim()) {
      setError("Please enter the book title.");
      return;
    }

    if (!author.trim()) {
      setError("Please enter the author name.");
      return;
    }

    if (!category) {
      setError("Please select a category.");
      return;
    }

    if (!year) {
      setError("Please enter publication year.");
      return;
    }

    try {
      setSaving(true);

      const body = {
        title,
        author,
        category,
        year: Number(year),
        description,
        coverImage,
      };

      const url = book
        ? `${API_URL}/books/${book._id}`
        : `${API_URL}/books`;

      const method = book ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Something went wrong."
        );
      }

      onSaved();
    } catch (error) {
      console.error(error);

      setError(
        error instanceof Error
          ? error.message
          : "Something went wrong."
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="modal-backdrop">

      <div className="book-modal">

        {/* HEADER */}

        <div className="modal-header">

          <div>

            <p className="section-label">
              {book
                ? "EDIT VOLUME"
                : "NEW VOLUME"}
            </p>

            <h2>
              {book
                ? "Edit Book"
                : "Add a Book"}
            </h2>

          </div>

          <button
            onClick={onClose}
            className="modal-close"
          >
            ×
          </button>

        </div>

        {/* FORM */}

        <form
          onSubmit={handleSubmit}
          className="modal-form"
        >

          <div className="form-grid">

            {/* TITLE */}

            <div className="form-field full">
              <label>
                Book Title
              </label>

              <input
                value={title}
                onChange={(e) =>
                  setTitle(
                    e.target.value
                  )
                }
                placeholder="The Great Gatsby"
              />
            </div>

            {/* AUTHOR */}

            <div className="form-field">
              <label>
                Author
              </label>

              <input
                value={author}
                onChange={(e) =>
                  setAuthor(
                    e.target.value
                  )
                }
                placeholder="F. Scott Fitzgerald"
              />
            </div>

            {/* YEAR */}

            <div className="form-field">
              <label>
                Published
              </label>

              <input
                type="number"
                value={year}
                onChange={(e) =>
                  setYear(
                    e.target.value
                  )
                }
                placeholder="1925"
              />
            </div>

            {/* CATEGORY */}

            <div className="form-field full">
              <label>
                Category
              </label>

              <select
                value={category}
                onChange={(e) =>
                  setCategory(
                    e.target.value
                  )
                }
              >
                <option value="">
                  Select a category
                </option>

                {categories.map(
                  (item) => (
                    <option
                      key={item}
                      value={item}
                    >
                      {item}
                    </option>
                  )
                )}

              </select>
            </div>

            {/* IMAGE */}

            <div className="form-field full">
              <label>
                Cover Image URL
              </label>

              <input
                value={coverImage}
                onChange={(e) =>
                  setCoverImage(
                    e.target.value
                  )
                }
                placeholder="https://..."
              />
            </div>

            {/* DESCRIPTION */}

            <div className="form-field full">
              <label>
                Description
              </label>

              <textarea
                value={description}
                onChange={(e) =>
                  setDescription(
                    e.target.value
                  )
                }
                rows={4}
                placeholder="Write a short description..."
              />
            </div>

          </div>

          {/* ERROR */}

          {error && (
            <div className="form-error">
              {error}
            </div>
          )}

          {/* BUTTONS */}

          <div className="modal-actions">

            <button
              type="button"
              onClick={onClose}
              className="cancel-button"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={saving}
              className="save-button"
            >
              {saving
                ? "Saving..."
                : book
                ? "Save Changes"
                : "Add Book"}
            </button>

          </div>

        </form>

      </div>

    </div>
  );
}