import app from "./app.js"
import dotenv from "dotenv"
import connectDb  from "./src/config/db.js"
dotenv.config();
const PORT=process.env.PORT ||5000

connectDb();

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});
