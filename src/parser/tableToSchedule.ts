export interface ScheduleItem {
  пара: number;
  група: string;
  аудиторія: string;
  предмет: string;
  викладач: string;
}

export interface DaySchedule {
  [day: string]: ScheduleItem[];
}

export function tableToSchedule(table: string[][]): DaySchedule {
  const schedule: DaySchedule = {};

  let currentDay = "";
  let pairCounter = 1;

  for (const row of table) {
    if (row.every(cell => cell.trim() === "")) continue;

    const dayMatch = row.find(cell =>
      ["Понеділок", "Вівторок", "Середа", "Четвер", "П’ятниця"].includes(cell)
    );
    if (dayMatch) {
      currentDay = dayMatch;
      pairCounter = 1;
      if (!schedule[currentDay]) schedule[currentDay] = [];
      continue;
    }

    if (!currentDay) continue;

    // Здесь нужно подстроить под реальный порядок колонок из твоего PDF
    let group = row[0]?.trim() ?? "";
    let aud = row[1]?.trim() ?? "";
    let teacher = row[2]?.trim() ?? "";
    let subject = row[3]?.trim() ?? "";

    if (!group || !aud || !teacher || !subject) continue;

    schedule[currentDay].push({
      пара: pairCounter,
      група: group,
      аудиторія: aud,
      предмет: subject,
      викладач: teacher
    });

    pairCounter++;
  }

  return schedule;
}
