/**
 * Helper function to wrap Supabase queries with retry logic.
 * If the initial request fails (likely due to a paused project),
 * it calls the /api/unpause endpoint and retries the request.
 */
export async function fetchWithRetry<T>(queryFn: () => Promise<T>): Promise<T> {
  try {
    const result = await queryFn();
    // Supabase client might return an error object instead of throwing
    if (result && typeof result === 'object' && 'error' in result && result.error) {
       // Check if error is related to project being paused or unavailable
       // Note: Specific error codes vary, but we can attempt a retry for most errors
       // if we suspect a pause.
       throw result.error;
    }
    return result;
  } catch (err) {
    console.warn("Initial request failed, attempting to unpause...", err);

    try {
      // Call our Vercel API route to unpause the project
      const unpauseResponse = await fetch("/api/unpause", { method: "POST" });

      if (!unpauseResponse.ok) {
        console.error("Failed to trigger unpause:", await unpauseResponse.text());
      } else {
        console.log("Unpause request sent successfully.");
      }
    } catch (unpauseErr) {
      console.error("Error calling unpause API:", unpauseErr);
    }

    // Wait for Supabase to wake up (approx 5-10 seconds is safer, but user suggested 4)
    await new Promise((resolve) => setTimeout(resolve, 5000));

    // Retry request
    return await queryFn();
  }
}
