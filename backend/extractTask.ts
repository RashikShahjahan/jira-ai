import Instructor from "@instructor-ai/instructor";
import OpenAI from "openai";
import { z } from "zod";

const PriorityEnum = z.enum(["HIGH", "MEDIUM", "LOW"]);
const StatusEnum = z.enum(["Pending", "In Progress", "Completed"]);

const TaskSchema = z.object({
  title: z.string().describe("A clear, concise title for the task"),
  description: z.string().describe("A detailed description of what needs to be done"),
  priority: PriorityEnum,
  status: StatusEnum.optional().default("Pending"),
});

const EpicSchema = z.object({
  title: z.string().describe("A clear, concise title for the epic"),
  description: z.string().describe("A detailed description of the epic's goal and scope"),
  tasks: z.array(TaskSchema).describe("The tasks required to complete this epic"),
  status: StatusEnum.optional().default("Pending"),
});

const InstructorResponseSchema = z.object({
  epics: z
    .array(EpicSchema)
    .describe(
      "An epic with a title, description, and tasks"
    ).min(1),
});

type Epic = z.infer<typeof EpicSchema>;

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
    dangerouslyAllowBrowser: true,
  });
  
  const instructor = Instructor({
    client: openai,
    mode: "TOOLS",
  });

  export const extractEpicsFromMessage = async (
    message: string
  ): Promise<Epic[]> => {
    try {
      console.log("Extracting epics from message:", message);
      const response = await instructor.chat.completions.create({
        messages: [
          {
            role: "user",
            content: `Analyze this message: ${message}. Extract any epics mentioned and format them as a JSON array. Each epic should include a title, description, and an array of related tasks. For each task, include title, description, priority (HIGH/MEDIUM/LOW) and status fields.`,
          },
        ],
        model: "gpt-4o-mini",
        response_model: {
          name: "ExtractedEpics",
          schema: InstructorResponseSchema,
        },
        max_retries: 3,
      });
      console.log(response);

      return response.epics;
    } catch (error) {
      console.error("Failed to extract epics:", error);
      return [];
    }
  };

