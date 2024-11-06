import { z } from "zod";

export const PriorityEnum = z.enum(["LOW", "MEDIUM", "HIGH"]);
export const StatusEnum = z.enum(["Pending", "In Progress", "Completed", "Archived"]);

export const TaskSchema = z.object({
    title: z.string(),
    description: z.string(),
    priority: PriorityEnum,
    status: StatusEnum.optional().default("Pending"),
});

export const EpicSchema = z.object({
    title: z.string(),
    description: z.string(),
    tasks: z.array(TaskSchema),
    status: StatusEnum.optional().default("Pending"),
});

export const EpicResponseSchema = z.object({
    epics: z.array(EpicSchema),
}); 