export interface Announcement {
  id: string;
  schoolId: string;
  authorId: string;
  authorName: string;
  title: string;
  content: string;
  type: "news" | "event" | "curriculum" | "celebration";
  targetAudience: "all" | "class" | "grade";
  classIds?: string[];
  publishedAt: string;
  isRead?: boolean;
}

export interface Conversation {
  id: string;
  teacherId: string;
  teacherName: string;
  parentId: string;
  parentName: string;
  studentId: string;
  studentName: string;
  lastMessage?: string;
  lastMessageAt?: string;
  unreadCount: number;
}

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  senderName: string;
  senderRole: "teacher" | "parent";
  content: string;
  sentAt: string;
  readAt?: string;
}

export interface SubjectGuide {
  moduleId: string;
  skillId: string;
  skillName: string;
  title: string;
  whatIsIt: string;
  howToHelp: string[];
  commonMistakes: string[];
  signsOfProgress: string[];
  ifStruggling: string[];
}
