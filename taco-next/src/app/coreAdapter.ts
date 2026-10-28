import type { CoreHealth } from "./types";

export function validateHealthUrl(url: string): string | null {
  const trimmed = url.trim();
  if (!trimmed) return null;
  let parsed: URL;
  try {
    parsed = new URL(trimmed);
  } catch {
    return "Enter a full http or https URL.";
  }
  if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
    return "Use an http or https URL.";
  }
  return null;
}

export function unavailableHealth(now = new Date().toISOString()): CoreHealth {
  return {
    status: "unavailable",
    endpoint: null,
    httpStatus: null,
    detail:
      "No Core health endpoint is configured. This preview did not query a service. Canonical Core was not mounted at /mnt/AI/HEX13-vNext.",
    observedAt: now,
    jobs: null,
    events: null,
    conversationId: null,
  };
}

export async function observeCore(url: string, now = new Date().toISOString()): Promise<CoreHealth> {
  const endpoint = url.trim();
  const invalid = validateHealthUrl(endpoint);
  if (!endpoint) return unavailableHealth(now);
  if (invalid) {
    return {
      status: "error",
      endpoint,
      httpStatus: null,
      detail: invalid,
      observedAt: now,
      jobs: null,
      events: null,
      conversationId: null,
    };
  }

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 4000);
  try {
    const response = await fetch(endpoint, {
      signal: controller.signal,
      headers: { accept: "application/json, text/plain" },
    });
    await response.arrayBuffer();
    return {
      status: response.ok ? "observed" : "error",
      endpoint,
      httpStatus: response.status,
      detail: `HTTP ${response.status}. The response body was not stored. This check is not a job feed and it grants no execution authority.`,
      observedAt: now,
      jobs: null,
      events: null,
      conversationId: null,
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Request failed";
    return {
      status: "error",
      endpoint,
      httpStatus: null,
      detail: `The health URL did not return a readable response (${message}). Jobs and events remain unconnected.`,
      observedAt: now,
      jobs: null,
      events: null,
      conversationId: null,
    };
  } finally {
    clearTimeout(timer);
  }
}
