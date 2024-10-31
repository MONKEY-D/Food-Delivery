import jwt from "jsonwebtoken";
const authMiddleware = async (req, res, next) => {
  const { token } = req.headers;
  console.log("Received Token:", token);

  if (!token) {
    console.error("No token provided");
    return res.json({ success: false, message: "Not Authorised Login Again" });
  }
  try {
    const token_decode = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Decoded Token:", token_decode);
    req.body.userId = token_decode.id;
    next();
  } catch (error) {
    console.log("Token Verification Error:", error);
    res.json({ success: false, message: "Invalid Token" });
  }
};

export default authMiddleware;
