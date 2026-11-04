# Rule file example — performance

Not installed. Copy this to `.agent-kit/rules/performance.md` when the repo has API calls, caches,
jobs or a UI with lists.

1. **Parallelize independent work.** Never `await a(); await b();` when `b` does not need `a`; use
   `Promise.all` or `Promise.allSettled`.
2. **Every outbound call has a timeout.** Use `AbortSignal.timeout(ms)` and a named limit. Retry
   only idempotent calls, with exponential backoff and a maximum attempt count.
3. **Cache aside with a TTL.** Check the cache, query on a miss, write with an explicit TTL, and
   invalidate on a write. If the cache is down, fall back to the database, not to an error page.
4. **Move work over one second off the request.** Queue emails, PDFs, media and bulk jobs to an
   idempotent worker and return `202 Accepted` with a `jobId`.
5. **Stream long responses.** Token-by-token SSE for AI output, with abort support.
6. **Debounce search.** About 300 ms, at least two characters, and cancel stale requests with
   `AbortController`.
7. **Deduplicate in-flight GETs** across components, and disable a submit button while its mutation
   is pending.
8. **Images and lists.** AVIF/WebP with explicit width and height, lazy below the fold,
   `fetchpriority="high"` on the LCP image, lazy-load heavy components, and virtualize lists over
   100 rows.
