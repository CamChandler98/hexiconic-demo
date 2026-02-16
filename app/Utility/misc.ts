/**
 * Simple delay function to pause execution for a set amount of time.
 * @param ms - The number of milliseconds to wait.
 * @returns A promise that resolves after the timeout.
 */
export const wait = (ms: number): Promise<void> => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};