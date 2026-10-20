import app from "./app.js";
import dotenv from "dotenv";
import { dbConnect } from "./config/db.js";
dotenv.config();

const PORT = process.env.PORT;

app.listen(PORT, async () => {
  await dbConnect();
  console.log(`Server at port http://localhost:${PORT}`);
});
