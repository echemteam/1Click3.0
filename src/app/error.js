// app/blog/error.js
'use client'

export default function Error({ error, reset }) {
  return (
    <div className="text-center mt-10">
      <h2>Oops! Something went wrong.</h2>
      <p className="text-sm text-red-600">{error.message}</p>
      <button
        onClick={() => reset()}
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
      >
        Try again
      </button>
    </div>
  );
}
