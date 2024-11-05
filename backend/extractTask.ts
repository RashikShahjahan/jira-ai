import Instructor from "@instructor-ai/instructor";
import OpenAI from "openai";
import { z } from "zod";

// Zod schemas
const PriorityEnum = z.enum(["HIGH", "MEDIUM", "LOW"]);

const ExtractedTaskSchema = z.object({
  title: z.string().describe("Make this a zany title"),
  description: z.string().describe("Make this a really really boring description"),
  priority: PriorityEnum,
});

const InstructorResponseSchema = z.object({
  tasks: z
    .array(ExtractedTaskSchema)
    .describe(
      "An array of tasks, if there's no task specified then return FIVE absurd tasks that nobody would ever do!!!"
    ).min(1),
});

// Types
type ExtractedTask = z.infer<typeof ExtractedTaskSchema>;

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
    dangerouslyAllowBrowser: true,
  });
  
  const instructor = Instructor({
    client: openai,
    mode: "TOOLS",
  });

  export const extractTasksFromMessage = async (
    message: string
  ): Promise<ExtractedTask[]> => {
    try {
      console.log("Extracting tasks from message:", message);
      const response = await instructor.chat.completions.create({
        messages: [
          {
            role: "user",
            content: `Analyze this message: ${message}. If it requests or describes tasks that need to be created, format them as a JSON array with title, description and priority (HIGH/MEDIUM/LOW) fields. If no clear tasks are mentioned, return an empty array.`,
          },
        ],
        model: "gpt-4o-mini",
        response_model: {
          name: "ExtractedTasks",
          schema: InstructorResponseSchema,
        },
        max_retries: 3,
      });
      console.log(response);

      return response.tasks;
    } catch (error) {
      console.error("Failed to extract tasks:", error);
      return [];
    }
  };

