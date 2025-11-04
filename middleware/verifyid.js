export const verifyid = async (req, res, next) => {
  const { id } = req.params;
  if (!id) {
    return res.status(500).json({ success: false, message: "missing id" });
  }
  req.id = { id };
  next();
};
