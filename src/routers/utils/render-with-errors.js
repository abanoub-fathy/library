const renderWithErrors = (res, pageName, errors, otherProps) => {
  res.render(pageName, {
    errors,
    ...otherProps,
  });
};

module.exports = renderWithErrors;
