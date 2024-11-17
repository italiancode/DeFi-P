export async function withRetry<T>(
  operation: () => Promise<T>,
  retries = 3,
  delay = 500
): Promise<T> {
  try {
    return await operation();
  } catch (error) {
    if (retries === 0) throw error;
    await new Promise(resolve => setTimeout(resolve, delay));
    return withRetry(operation, retries - 1, delay * 2);
  }
} 