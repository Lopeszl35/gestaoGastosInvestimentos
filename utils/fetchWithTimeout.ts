export async function fetchWithTimeout(
  url: string,
  options: RequestInit = {},
  timeoutMs = 12000
) {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const res = await fetch(url, { ...options, signal: controller.signal });
    return res;
  } finally {
    clearTimeout(id);
  }
}
