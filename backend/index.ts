import express, { type Request, type Response } from "express";
import { extractEpicsFromMessage } from "./extractTask";
import cors from "cors";

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

app.post("/chat", async (req: Request, res: Response) => {
    const { message } = req.body;
    const epics = await extractEpicsFromMessage(message);
    res.json({ epics });
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
