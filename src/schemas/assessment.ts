import { z } from "zod";

export const assessmentSchema = z.object({
  station_id: z
    .number({ error: "Please select a station" })
    .min(1, "Please select a station"),
  age_group: z.enum(["child", "teen", "adult", "elderly"], {
    error: "Please select an age group",
  }),
  conditions: z
    .array(
      z.enum(["none", "asthma", "heart_disease", "respiratory", "diabetes"]),
    )
    .min(1, "Select at least one condition"),
  activity: z.enum(
    ["indoor", "light_outdoor", "moderate_exercise", "strenuous_exercise"],
    { error: "Please select planned activity" },
  ),
  remember_profile: z.boolean().optional(),
});

export type AssessmentSchema = z.infer<typeof assessmentSchema>;
