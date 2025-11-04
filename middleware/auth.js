// Simple authentication middleware checking for API key header
module.exports = (req, res, next) => {
  const apiKey = req.header('x-api-key');
  const validKey = process.env.API_KEY || '12345';

  if (!apiKey || apiKey !== validKey) {
    return res.status(401).json({ message: 'Unauthorized: Invalid or missing API key.' });
  }

  next();
};
