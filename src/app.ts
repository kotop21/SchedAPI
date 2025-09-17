import { gemini20Flash, googleAI } from '@genkit-ai/googleai';
import { genkit, z } from 'genkit/beta';
import fs from 'fs';

// Инициализация Genkit с API ключом
const ai = genkit({
  plugins: [googleAI({ apiKey: process.env.API_KEY! })],
  model: gemini20Flash,
});

const LessonSchema = z.object({
  number: z.number(),
  subject: z.string().min(1, 'Subject is required'),
  teacher: z.string().min(1, 'Teacher is required'),
  classroom: z.string().min(1, 'Classroom is required'),
});

const DayScheduleSchema = z.object({
  day: z.string().min(1, 'Day is required'),
  lessons: z.array(LessonSchema).min(1, 'Lessons array cannot be empty'),
});

const GroupScheduleSchema = z.object({
  group: z.string().min(1, 'Group name is required'),
  schedule: z.array(DayScheduleSchema).min(1, 'Schedule array cannot be empty'),
});

const ScheduleSchema = z.array(GroupScheduleSchema).min(1, 'Schedule must contain at least one group');

async function extractSchedule(url: string) {
  const { output } = await ai.generate({
    prompt: [
      { media: { url } },
      { text: 'Extract all groups with lessons. Every lesson must have subject, teacher, and classroom, no fields can be empty.' },
    ],
    output: { schema: ScheduleSchema },
  });

  return output;
}

(async () => {
  try {
    const schedule = await extractSchedule(process.env.URL!);
    fs.writeFileSync('json-schedule.json', JSON.stringify(schedule, null, 2));
    console.log('Saved json-schedule.json with strictly validated schedule');
  } catch (err) {
    console.error('Error extracting schedule:', err);
  }
})();
