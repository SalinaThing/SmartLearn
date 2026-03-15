export const catchAsyncErrors = (theFunc) => (req, res, next) => {
  try {
    const result = theFunc(req, res, next);
    if (result && typeof result.catch === 'function') {
      result.catch(next);
    }
  } catch (err) {
    next(err);
  }
};