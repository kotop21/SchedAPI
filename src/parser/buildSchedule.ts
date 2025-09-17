type Pair = {
  number: number;       // pair number
  subject: string;      // subject
  teacher: string;      // teacher
  classroom: string;    // classroom
};

type DaySchedule = {
  [day: string]: Pair[];
};

type GroupSchedule = {
  [group: string]: DaySchedule;
};

const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

// Mapping rows → days and pairs
const pairsPerDay: number[][] = [
  [136, 149, 161, 172],        // Monday
  [183, 194, 206],             // Tuesday
  [227, 239, 251, 261],        // Wednesday
  [270, 281, 294, 306],        // Thursday
  [317, 327, 339, 350]         // Friday
];

// Normalize one triple into subject/teacher/classroom
function normalizeTriple(raw: string[]): { subject: string; teacher: string; classroom: string } {
  let subjectTokens: string[] = [];
  let teacher = "";
  let classroom = "";

  for (const token of raw) {
    if (!token || /^\s*$/.test(token)) continue;

    if (/^\d+[а-яА-Яa-zA-Z]?$/.test(token)) {
      classroom = token;
    } else if (/^[А-ЯЇІЄҐA-Z][а-яіїєґa-z'\-]+ [А-ЯЇІЄҐA-Z]\.[А-ЯЇІЄҐA-Z]\.$/.test(token)) {
      teacher = token;
    } else {
      subjectTokens.push(token);
    }
  }

  const subject = subjectTokens.join(" ").trim();

  return { subject, teacher, classroom };
}


/**
 * Converts groups (row 124) and raw rows into structured schedule
 */
export function buildSchedule(groups: string[], rawPairs: Record<string, string[]>): GroupSchedule {
  const schedule: GroupSchedule = {};

  // Clean group names
  const cleanGroups = groups.filter(g => g.trim() !== "");

  for (const group of cleanGroups) {
    schedule[group] = {};
    for (const day of days) {
      schedule[group][day] = [];
    }
  }

  // Walk through days
  for (let d = 0; d < days.length; d++) {
    const dayName = days[d];
    const pairList = pairsPerDay[d];

    for (let p = 0; p < pairList.length; p++) {
      const pairKey = String(pairList[p]);
      const row = rawPairs[pairKey];
      if (!row) {
        cleanGroups.forEach(group => {
          schedule[group][dayName].push({
            number: p + 1,
            subject: "",
            teacher: "",
            classroom: ""
          });
        });
        continue;
      }

      const filtered = row.filter(s => s.trim() !== "");
      const reversed = [...filtered].reverse();

      let gIndex = 0;

      for (let i = 0; i < reversed.length; i += 3) {
        const triple = reversed.slice(i, i + 3);
        const { subject, teacher, classroom } = normalizeTriple(triple);

        const group = cleanGroups[cleanGroups.length - 1 - gIndex];
        if (!group) continue;

        schedule[group][dayName].push({
          number: p + 1,
          subject,
          teacher,
          classroom
        });

        gIndex++;
      }

      while (gIndex < cleanGroups.length) {
        const group = cleanGroups[cleanGroups.length - 1 - gIndex];
        schedule[group][dayName].push({
          number: p + 1,
          subject: "",
          teacher: "",
          classroom: ""
        });
        gIndex++;
      }
    }
  }

  return schedule;
}
