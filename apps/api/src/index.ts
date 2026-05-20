import { validateClaimContract } from "@avg/validation";

export interface HealthResponse {
  status: "ok";
  service: "avg-api";
}

export interface ProjectRecord {
  id: string;
  name: string;
}

export interface SessionRecord {
  id: string;
  projectId: string;
  title: string;
}

export interface MessageRecord {
  id: string;
  sessionId: string;
  role: "user" | "assistant";
  content: string;
}

export interface ProjectSessionMessageApi {
  project: ProjectRecord;
  session: SessionRecord;
  message: MessageRecord;
}

type IdPrefix = "project" | "session" | "message";

const counters: Record<IdPrefix, number> = {
  project: 0,
  session: 0,
  message: 0
};

const projects = new Map<string, ProjectRecord>();
const sessions = new Map<string, SessionRecord>();
const messages = new Map<string, MessageRecord>();

function nextId(prefix: IdPrefix): string {
  counters[prefix] += 1;
  return `${prefix}_${String(counters[prefix]).padStart(3, "0")}`;
}

export function health(): HealthResponse {
  return {
    status: "ok",
    service: "avg-api"
  };
}

export function createProject(name = "Untitled project"): ProjectRecord {
  const project: ProjectRecord = {
    id: nextId("project"),
    name
  };

  projects.set(project.id, project);
  return project;
}

export function createSession(projectId: string, title = "Conversation session"): SessionRecord {
  if (!projects.has(projectId)) {
    throw new Error(`Unknown project: ${projectId}`);
  }

  const session: SessionRecord = {
    id: nextId("session"),
    projectId,
    title
  };

  sessions.set(session.id, session);
  return session;
}

export function appendMessage(sessionId: string, content: string, role: MessageRecord["role"] = "user"): MessageRecord {
  if (!sessions.has(sessionId)) {
    throw new Error(`Unknown session: ${sessionId}`);
  }

  const message: MessageRecord = {
    id: nextId("message"),
    sessionId,
    role,
    content
  };

  messages.set(message.id, message);
  return message;
}

export function getProject(projectId: string): ProjectRecord | undefined {
  return projects.get(projectId);
}

export function getSession(sessionId: string): SessionRecord | undefined {
  return sessions.get(sessionId);
}

export function getMessage(messageId: string): MessageRecord | undefined {
  return messages.get(messageId);
}

export function createProjectSessionMessage(
  projectName: string,
  sessionTitle: string,
  content: string
): ProjectSessionMessageApi {
  const project = createProject(projectName);
  const session = createSession(project.id, sessionTitle);
  const message = appendMessage(session.id, content);

  return { project, session, message };
}

export function validateClaimRequest(body: unknown) {
  return validateClaimContract(body);
}
