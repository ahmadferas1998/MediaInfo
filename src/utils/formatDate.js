const FormatDate = (date) => {
  const NewFormat = `${date.getFullYear()}/${String(
    date.getMonth() + 1
  ).padStart(2, "0")}/${String(date.getDate()).padStart(2, "0")}`;

  return NewFormat;
};
export default FormatDate;
