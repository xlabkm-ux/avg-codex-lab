import { createServer, type IncomingMessage, type Server } from "node:http";
import { URL } from "node:url";
import {
  cloneGraphSnapshot,
  createEmptyGraphSnapshot,
  diffGraphSnapshots,
  type ClaimProjection,
  type GraphDiff,
  type GraphSnapshot
} from "@avg/graph";
import {
  createDocumentRepository,
  type AvgRetrievalHit,
  type RegisterDocumentInput,
  type SearchDocumentsOptions,
  type RegisterDocumentResult
} from "@avg/retrieval";
import { type AvgStructuredResponse } from "@avg/schemas";
import { composeGroundedResponse, type GroundedResponseCompositionReport } from "@avg/validation";
import { validateClaimContract } from "@avg/validation";
import { renderDialogueFlowPageFromGroundedReport, type DialogueMessage } from "@avg/web";

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

export type MapSnapshotLike = GraphSnapshot | ClaimProjection;

export interface MapDiffArtifact {
  kind: "map_diff";
  from: GraphSnapshot;
  to: GraphSnapshot;
  diff: GraphDiff;
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
const documentRepository = createDocumentRepository();

export type RegisterProjectDocumentBody = Omit<RegisterDocumentInput, "project_id">;
export type SearchProjectDocumentsOptions = SearchDocumentsOptions;

export interface ComposeGroundedProjectResponseInput {
  response: AvgStructuredResponse;
  query: string;
  limit?: number;
}

export interface RenderGroundedProjectDialoguePageInput extends ComposeGroundedProjectResponseInput {
  sessionId: string;
  messages: DialogueMessage[];
}

export interface ApiRouteResponse {
  statusCode: number;
  headers: Record<string, string>;
  body: string;
}

export interface RenderGroundedProjectDialoguePageRequest extends RenderGroundedProjectDialoguePageInput {
  query: string;
  limit?: number;
}

export interface SearchProjectDocumentsRequest {
  query: string;
  limit?: number;
}

function isClaimProjection(value: MapSnapshotLike): value is ClaimProjection {
  return "node" in value && !("nodes" in value);
}

function snapshotFromProjection(projection: ClaimProjection): GraphSnapshot {
  return cloneGraphSnapshot({
    nodes: [projection.node],
    edges: projection.edges
  });
}

export function materializeMapSnapshot(value: MapSnapshotLike): GraphSnapshot {
  if (isClaimProjection(value)) {
    return snapshotFromProjection(value);
  }

  return cloneGraphSnapshot(value);
}

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

export function registerProjectDocument(
  projectId: string,
  body: RegisterProjectDocumentBody
): RegisterDocumentResult {
  if (!projects.has(projectId)) {
    throw new Error(`Unknown project: ${projectId}`);
  }

  return documentRepository.registerDocument({
    ...body,
    project_id: projectId
  });
}

export function getProjectDocument(documentId: string) {
  return documentRepository.getDocument(documentId);
}

export function getProjectDocumentText(documentId: string) {
  return documentRepository.getDocumentText(documentId);
}

export function listProjectDocuments(projectId: string) {
  if (!projects.has(projectId)) {
    throw new Error(`Unknown project: ${projectId}`);
  }

  return documentRepository.listDocuments(projectId);
}

export function searchProjectDocuments(projectId: string, query: string, options: SearchProjectDocumentsOptions = {}) {
  if (!projects.has(projectId)) {
    throw new Error(`Unknown project: ${projectId}`);
  }

  return documentRepository.searchDocuments(projectId, query, options);
}

export function composeGroundedProjectResponse(
  projectId: string,
  input: ComposeGroundedProjectResponseInput
): GroundedResponseCompositionReport {
  if (!projects.has(projectId)) {
    throw new Error(`Unknown project: ${projectId}`);
  }

  const retrieval = documentRepository.searchDocuments(projectId, input.query, {
    ...(input.limit !== undefined ? { limit: input.limit } : {})
  });

  return composeGroundedResponse(input.response, retrieval.hits as AvgRetrievalHit[]);
}

export function renderGroundedProjectDialoguePage(
  projectId: string,
  input: RenderGroundedProjectDialoguePageInput
): string {
  const report = composeGroundedProjectResponse(projectId, input);

  return renderDialogueFlowPageFromGroundedReport(
    projectId,
    input.sessionId,
    input.messages,
    report
  );
}

function jsonResponse(statusCode: number, body: unknown): ApiRouteResponse {
  return {
    statusCode,
    headers: {
      "content-type": "application/json; charset=utf-8"
    },
    body: JSON.stringify(body)
  };
}

function htmlResponse(body: string): ApiRouteResponse {
  return {
    statusCode: 200,
    headers: {
      "content-type": "text/html; charset=utf-8"
    },
    body
  };
}

async function readRequestBody(request: IncomingMessage): Promise<string> {
  const chunks: Buffer[] = [];

  for await (const chunk of request) {
    chunks.push(typeof chunk === "string" ? Buffer.from(chunk) : chunk);
  }

  return Buffer.concat(chunks).toString("utf8");
}

function isRenderGroundedProjectDialoguePageRequest(
  value: unknown
): value is RenderGroundedProjectDialoguePageRequest {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  const record = value as Record<string, unknown>;
  return (
    typeof record.query === "string" &&
    typeof record.sessionId === "string" &&
    Array.isArray(record.messages) &&
    "response" in record &&
    (typeof record.limit === "number" || record.limit === undefined)
  );
}

function isRegisterProjectDocumentBody(value: unknown): value is RegisterProjectDocumentBody {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  const record = value as Record<string, unknown>;
  const metadata = record.metadata;

  return (
    typeof record.title === "string" &&
    typeof record.source_kind === "string" &&
    typeof record.text === "string" &&
    (record.created_at === undefined || typeof record.created_at === "string") &&
    (
      metadata === undefined ||
      (
        typeof metadata === "object" &&
        metadata !== null &&
        Object.values(metadata).every((value) => typeof value === "string")
      )
    )
  );
}

function isSearchProjectDocumentsRequest(value: unknown): value is SearchProjectDocumentsRequest {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  const record = value as Record<string, unknown>;
  return (
    typeof record.query === "string" &&
    (record.limit === undefined || typeof record.limit === "number")
  );
}

export function handleGroundedProjectDialoguePageRoute(
  method: string,
  pathname: string,
  bodyText: string,
): ApiRouteResponse {
  if (method === "GET" && pathname === "/health") {
    return jsonResponse(200, health());
  }

  const documentRouteMatch = /^\/projects\/([^/]+)\/documents$/.exec(pathname);
  if (method === "POST" && documentRouteMatch !== null) {
    const projectId = documentRouteMatch[1]!;

    try {
      const parsedBody = JSON.parse(bodyText) as unknown;
      if (!isRegisterProjectDocumentBody(parsedBody)) {
        return jsonResponse(400, {
          code: "DOCUMENT_TEXT_REQUIRED",
          message: "Document registration requires title, source_kind and text.",
          details: {}
        });
      }

      const result = registerProjectDocument(projectId, parsedBody);
      return jsonResponse(201, result);
    } catch (error) {
      if (error instanceof SyntaxError) {
        return jsonResponse(400, {
          code: "INVALID_JSON",
          message: "The document registration request body must be valid JSON.",
          details: {}
        });
      }

      return jsonResponse(400, {
        code: "DOCUMENT_TEXT_REQUIRED",
        message: error instanceof Error ? error.message : "Document registration failed.",
        details: {}
      });
    }
  }

  const retrievalRouteMatch = /^\/projects\/([^/]+)\/retrieval\/search$/.exec(pathname);
  if (method === "POST" && retrievalRouteMatch !== null) {
    const projectId = retrievalRouteMatch[1]!;

    try {
      const parsedBody = JSON.parse(bodyText) as unknown;
      if (!isSearchProjectDocumentsRequest(parsedBody)) {
        return jsonResponse(400, {
          code: "RETRIEVAL_QUERY_REQUIRED",
          message: "Retrieval search requires a query string.",
          details: {}
        });
      }

      const result = searchProjectDocuments(projectId, parsedBody.query, {
        ...(parsedBody.limit !== undefined ? { limit: parsedBody.limit } : {})
      });

      if (result.hits.length === 0) {
        return jsonResponse(404, {
          code: "RETRIEVAL_NO_EVIDENCE",
          message: "No registered snippets matched the retrieval query.",
          details: result
        });
      }

      return jsonResponse(200, result);
    } catch (error) {
      if (error instanceof SyntaxError) {
        return jsonResponse(400, {
          code: "INVALID_JSON",
          message: "The retrieval search request body must be valid JSON.",
          details: {}
        });
      }

      return jsonResponse(400, {
        code: "RETRIEVAL_QUERY_REQUIRED",
        message: error instanceof Error ? error.message : "Retrieval search failed.",
        details: {}
      });
    }
  }

  const pageRouteMatch = /^\/projects\/([^/]+)\/dialogue\/page$/.exec(pathname);
  if (method === "POST" && pageRouteMatch !== null) {
    const projectId = pageRouteMatch[1]!;

    try {
      const parsedBody = JSON.parse(bodyText) as unknown;
      if (!isRenderGroundedProjectDialoguePageRequest(parsedBody)) {
        return jsonResponse(400, {
          code: "INVALID_REQUEST",
          message: "The grounded dialogue page request is missing required fields.",
          details: {}
        });
      }

      if (parsedBody.response.project_id !== projectId) {
        return jsonResponse(400, {
          code: "PROJECT_ID_MISMATCH",
          message: "The grounded dialogue page response must match the route project id.",
          details: {
            projectId,
            responseProjectId: parsedBody.response.project_id
          }
        });
      }

      const body = renderGroundedProjectDialoguePage(projectId, {
        sessionId: parsedBody.sessionId,
        messages: parsedBody.messages,
        response: parsedBody.response,
        query: parsedBody.query,
        ...(parsedBody.limit !== undefined ? { limit: parsedBody.limit } : {})
      });

      return htmlResponse(body);
    } catch {
      return jsonResponse(400, {
        code: "INVALID_JSON",
        message: "The grounded dialogue page request body must be valid JSON.",
        details: {}
      });
    }
  }

  return jsonResponse(404, {
    code: "NOT_FOUND",
    message: "The requested route is not available.",
    details: {
      method,
      pathname
    }
  });
}

export function createApiServer(): Server {
  return createServer(async (request, response) => {
    const requestUrl = new URL(request.url ?? "/", "http://localhost");
    const bodyText = request.method === "GET" || request.method === "HEAD" ? "" : await readRequestBody(request);
    const routeResponse = handleGroundedProjectDialoguePageRoute(
      request.method ?? "GET",
      requestUrl.pathname,
      bodyText
    );

    response.writeHead(routeResponse.statusCode, routeResponse.headers);

    if (request.method === "HEAD") {
      response.end();
      return;
    }

    response.end(routeResponse.body);
  });
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

export function createMapDiffArtifact(from: MapSnapshotLike, to: MapSnapshotLike): MapDiffArtifact {
  const fromSnapshot = materializeMapSnapshot(from);
  const toSnapshot = materializeMapSnapshot(to);

  return {
    kind: "map_diff",
    from: fromSnapshot,
    to: toSnapshot,
    diff: diffGraphSnapshots(fromSnapshot, toSnapshot)
  };
}

export function createEmptyMapDiffArtifact(): MapDiffArtifact {
  const snapshot = createEmptyGraphSnapshot();

  return createMapDiffArtifact(snapshot, snapshot);
}

export function validateClaimRequest(body: unknown) {
  return validateClaimContract(body);
}
