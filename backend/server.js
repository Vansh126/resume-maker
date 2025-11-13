import express from "express";
import cors from "cors";
import "dotenv/config"; // this loads .env automatically
import connectdb from "./config/db.js"; // default export
import userRoutes from "./routes/userRouter.js";
import resumeRoutes from "./routes/resumeRoutes.js";
import path from "path";
import { fileURLToPath } from "url";

// Fix __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(cors());
app.use(express.json());

// DB connection
connectdb();

// Routes
app.use("/api/auth", userRoutes);
app.use("/api/resume", resumeRoutes);

// Static files
app.use(
    "/uploads",
    express.static(path.join(__dirname, "uploads"), {
        setHeaders: (res, _path) => {
            res.set("Access-Control-Allow-Origin", "http://localhost:5173");
        },
    })
);

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
