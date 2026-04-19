
const validateImageUrls = (req, res, next) => {
  const { images } = req.body;
  if (images && Array.isArray(images)) {
    
    for (let img of images) {
      if (!img.startsWith('http')) {
        return res.status(400).json({ message: 'Invalid image URL', success: false });
      }
    }
  }
  next();
};

module.exports = { validateImageUrls };
