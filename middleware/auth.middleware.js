import jwt from "jsonwebtoken";
const isLoggedIn = async (req, res, next) => {
  const { token } = req.cookies;

  const user = await jwt.verify(token, process.env.JWT_SECRET);

  req.user = user;
  next();
};

export { isLoggedIn };
