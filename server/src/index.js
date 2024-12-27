import httpServer from "./app.js";
import { config } from "dotenv";

config();

const PORT = process.env.PORT || 5000;

httpServer.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
