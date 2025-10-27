 // ek higher order function declare k
 // utils/asyncHandler.js
const asyncHandler = (func) => async (req, res, next) => {
  try {
    await func(req, res, next); // ✅ actually call the function
  } catch (error) {
    res.status(error.code || 500).json({
      success: false,
      message: error.message || "Internal Server Error",
    });
  }
};

export { asyncHandler };
