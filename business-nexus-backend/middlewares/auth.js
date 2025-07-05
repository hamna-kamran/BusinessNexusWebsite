const jwt = require('jsonwebtoken');

module.exports = (req,res,next) => {
  const auth = req.headers['authorization'];
  if (!auth) return res.status(401).json({ msg:'No token provided' });
  const token = auth.split(' ')[1];
  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch {
    res.status(401).json({ msg:'Invalid token' });
  }
};
