import { connectDatabase, disconnectDatabase } from "../config/database.js";
import { Announcement } from "../models/Announcement.js";
import { Conversation } from "../models/Conversation.js";
import { GuardianLink } from "../models/GuardianLink.js";
import { LearningSession } from "../models/LearningSession.js";
import { Notification } from "../models/Notification.js";
import { Question } from "../models/Question.js";
import { SkillMastery } from "../models/SkillMastery.js";
import { TeacherAssignment } from "../models/TeacherAssignment.js";
import { WrongAnswer } from "../models/WrongAnswer.js";

async function main(): Promise<void> {
  await connectDatabase();
  await Promise.all([
    Question.syncIndexes(),
    LearningSession.syncIndexes(),
    SkillMastery.syncIndexes(),
    WrongAnswer.syncIndexes(),
    Notification.syncIndexes(),
    GuardianLink.syncIndexes(),
    TeacherAssignment.syncIndexes(),
    Conversation.syncIndexes(),
    Announcement.syncIndexes()
  ]);
  await disconnectDatabase();
}

main().catch((error: unknown) => {
  // eslint-disable-next-line no-console
  console.error(error);
  process.exit(1);
});
