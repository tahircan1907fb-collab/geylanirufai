/**
 * Safe JSON fetch wrapper.
 * - Checks HTTP status before parsing
 * - Catches JSON parse errors gracefully
 * - Returns typed result or throws descriptive error
 */

interface FetchError {
     status: number;
     message: string;
}

export async function safeFetch<T = unknown>(
     url: string,
     options?: RequestInit
): Promise<T> {
     const res = await fetch(url, options);

     const contentType = res.headers.get('content-type') || '';

     if (!contentType.includes('application/json')) {
          throw {
               status: res.status,
               message: `Sunucu geçersiz yanıt formatı döndürdü (${contentType || 'bilinmiyor'}). JSON bekleniyordu.`,
          } as FetchError;
     }

     let body: unknown;
     try {
          body = await res.json();
     } catch {
          throw {
               status: res.status,
               message: 'Sunucu yanıtı JSON olarak ayrıştırılamadı.',
          } as FetchError;
     }

     if (!res.ok) {
          const errorMsg =
               (body as Record<string, string>)?.error ||
               (body as Record<string, string>)?.message ||
               `HTTP ${res.status}`;
          throw { status: res.status, message: errorMsg } as FetchError;
     }

     return body as T;
}

/**
 * Safe JSON parse for response objects.
 * Use when you already have a Response and need safe parsing.
 */
export async function safeParseJson<T = unknown>(res: Response): Promise<T> {
     const contentType = res.headers.get('content-type') || '';

     if (!contentType.includes('application/json')) {
          throw new Error(
               `Sunucu geçersiz yanıt formatı döndürdü (${contentType || 'bilinmiyor'}).`
          );
     }

     try {
          return (await res.json()) as T;
     } catch {
          throw new Error('Sunucu yanıtı JSON olarak ayrıştırılamadı.');
     }
}
