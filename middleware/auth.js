// ============================================
// middleware/auth.js — JWT Verification Middleware
// ============================================
// This is a "bouncer" function. It runs BEFORE protected route handlers.
//
// How it works:
//   1. Read the token from the request's Authorization header
//   2. Verify the token is real (signed by us, not expired)
//   3. If valid: decode the user ID and attach it to req.user, then continue
//   4. If invalid: immediately reject with 401 Unauthorized
//
// The frontend sends the token like this:
//   Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
//                  ^^^^^^ "Bearer" is just a convention, it means "I'm carrying this token"

import jwt from 'jsonwebtoken';

const protect = (req, res, next) => {
  // 1. Get the token from the Authorization header
  const authHeader = req.headers.authorization;

  // Check the header exists AND starts with "Bearer "
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'No token — access denied' });
  }

  // Extract just the token part (everything after "Bearer ")
  // "Bearer eyJhbGci..." → "eyJhbGci..."
  const token = authHeader.split(' ')[1];

  try {
    // 2. Verify the token using your JWT_SECRET
    // jwt.verify() will:
    //   ✅ Check the token was signed with YOUR secret (not a fake one)
    //   ✅ Check the token hasn't expired (we set 7d expiry in authController)
    //   ✅ Decode the payload ({ id: user._id } we put in generateToken)
    //   ❌ Throw an error if anything is wrong
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // decoded = { id: "6abc123...", iat: 1234567890, exp: 1235167890 }

    // 3. Attach the user ID to the request object
    // This is how the controller knows WHO is making the request
    req.user = decoded;

    // 4. Call next() to pass control to the actual route handler
    // Without next(), the request would just hang here forever
    next();

  } catch (error) {
    // Token was tampered with or expired
    res.status(401).json({ message: 'Invalid or expired token' });
  }
};

export default protect;
