import jwt from "jsonwebtoken";

const adminAuth = (req, res, next) => {
  try {
    let token = req.headers.token || req.headers.authorization;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Not Authorized. Please login again.",
      });
    }

    // Support: Authorization: Bearer <token>
    if (token.startsWith("Bearer ")) {
      token = token.split(" ")[1];
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    if (!decoded.admin) {
      return res.status(403).json({
        success: false,
        message: "Access Denied",
      });
    }

    req.admin = decoded;

    next();
  } catch (error) {
    console.log(error);

    return res.status(401).json({
      success: false,
      message: "Invalid or Expired Token",
    });
  }
};

export default adminAuth;
