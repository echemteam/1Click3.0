import moment from "moment";

// Utility function to format a date using moment.js
export const formatDate = (date, format) => {
  if (!date) return ""; // Handle empty dates if needed
  if (!format) format = "MM/DD/YYYY hh:mm A"; // TODO: move default format to env file
  /**
     * NOTE: This OMS project always we use the US format. So i am direct pass the dafault US formate.
 */
  return moment(date).format("MM/DD/YYYY hh:mm ");
};

export default formatDate;

export const formatDateInShort = (isDate) => {
  if (!isDate) return ""; // Return an empty string if no date is provided

  const date = new Date(isDate);

  // Check for an invalid date
  if (isNaN(date)) return "";

  return date.toLocaleDateString("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

// Function to format date similar to Gmail
export const formatDateLikeGmail = (date) => {
  if (!date) return ""; // Handle empty or undefined dates

  const momentDate = moment(date);
  const now = moment();

  if (momentDate.isSame(now, "day")) {
    // If the date is today, show only the time
    return momentDate.format("hh:mm A");
  } else if (momentDate.isSame(now, "year")) {
    // If the date is from this year, show "MMM D" (e.g., Jan 15)
    return momentDate.format("MMM D");
  } else {
    // If the date is from a previous year, show "MMM D, YYYY" (e.g., Jan 15, 2023)
    return momentDate.format("MMM D, YYYY");
  }
};