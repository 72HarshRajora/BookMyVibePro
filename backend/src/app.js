import express from "express";
import cookieParser from "cookie-parser"
import authRouter from "./routes/auth.routes.js";
import usersRouter from "./routes/users.routes.js";
import vendorRouter from "./routes/vendor.routes.js";
import eventRouter from "./routes/events.routes.js";
import bookingRouter from "./routes/booking.routes.js";
import adminRouter from "./routes/admin.routes.js"
import cors from "cors"

const app = express();
app.use(cookieParser())
app.use(express.json())
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}))

app.use("/api/auth", authRouter)
app.use("/api/users", usersRouter)
app.use("/api/vendor", vendorRouter)
app.use("/api/events", eventRouter)
app.use("/api/bookings", bookingRouter)
app.use("/api/admin", adminRouter)

export default app;