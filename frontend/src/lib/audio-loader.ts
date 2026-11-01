/**
 * audio-loader.ts
 * ---------------
 * Manages secure audio buffer loading and Blob URL creation.
 *
 * Instead of setting `audio.src = presignedR2Url` (which directly exposes the
 * R2 URL in the DOM, DevTools, and allows trivial one-click downloads),
 * this loader fetches audio chunks as ArrayBuffers and constructs a scoped
 * in-memory `blob:` URL (e.g. `blob:http://localhost:3000/38ab-4cd2...`).
 *
 * Benefits:
 * 1. Obfuscates the raw R2 origin.
 * 2. Opening the blob URL in a new tab or downloader tool fails / refuses to play.
 * 3. Inspecting the `<audio>` tag reveals no external storage or S3/R2 endpoints.
 * 4. Revokes old Object URLs automatically to prevent memory leaks.
 */

let _activeBlobUrl: string | null = null;
let _activeAbortController: AbortController | null = null;

export async function fetchAudioAsBlobUrl(
  streamUrl: string,
  signal?: AbortSignal
): Promise<string> {
  // Cancel previous fetch if still in progress
  if (_activeAbortController) {
    try {
      _activeAbortController.abort();
    } catch {}
  }

  const controller = new AbortController();
  _activeAbortController = controller;

  // Link caller signal if provided
  if (signal) {
    signal.addEventListener('abort', () => {
      try {
        controller.abort();
      } catch {}
    });
  }

  try {
    const response = await fetch(streamUrl, {
      signal: controller.signal,
      headers: {
        Accept: 'audio/*, application/octet-stream',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch audio stream: ${response.status} ${response.statusText}`);
    }

    const contentType = response.headers.get('content-type') || 'audio/mpeg';
    const blob = await response.blob();
    const typedBlob = new Blob([blob], { type: contentType });

    // Revoke previous blob URL to clean up browser memory
    if (_activeBlobUrl) {
      try {
        URL.revokeObjectURL(_activeBlobUrl);
      } catch {}
      _activeBlobUrl = null;
    }

    const newBlobUrl = URL.createObjectURL(typedBlob);
    _activeBlobUrl = newBlobUrl;
    return newBlobUrl;
  } catch (err: any) {
    if (err?.name === 'AbortError') {
      throw err;
    }
    // If CORS or client fetch failed, fall back to direct streamUrl so playback doesn't die
    console.warn('[AudioLoader] Blob fetch fallback to direct stream:', err);
    return streamUrl;
  } finally {
    if (_activeAbortController === controller) {
      _activeAbortController = null;
    }
  }
}

export function cleanupActiveBlobUrl(): void {
  if (_activeAbortController) {
    try {
      _activeAbortController.abort();
    } catch {}
    _activeAbortController = null;
  }

  if (_activeBlobUrl) {
    try {
      URL.revokeObjectURL(_activeBlobUrl);
    } catch {}
    _activeBlobUrl = null;
  }
}
