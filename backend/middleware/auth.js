import jwt from "jsonwebtoken";

const authUser = async (req, res, next) => {
  try {
    let token = req.headers.token || req.headers.authorization;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Please Login First",
      });
    }

    // Support Authorization: Bearer <token>
    if (token.startsWith("Bearer ")) {
      token = token.split(" ")[1];
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    req.user = {
      id: decoded.id,
    };

    next();
  } catch (error) {
    console.log(error);

    return res.status(401).json({
      success: false,
      message: "Invalid or Expired Token",
    });
  }
};

export default authUser;
