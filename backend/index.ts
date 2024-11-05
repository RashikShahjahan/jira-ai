import express, { type Request, type Response } from "express";
import { extractTasksFromMessage } from "./extractTask";
import cors from "cors";

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

app.post("/chat", async (req: Request, res: Response) => {
    const { message } = req.body;
    const tasks = await extractTasksFromMessage(message);
    res.json({ tasks });
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
