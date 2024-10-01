import cors from "cors";

const corsOptions = {
    origin: process.env.CLIENT_URL,
    optionsSuccessStatus: 200,
};

export default cors(corsOptions);
