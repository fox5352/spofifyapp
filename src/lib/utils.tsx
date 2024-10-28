import { ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

/**
 * Combines and merges Tailwind CSS classes while handling conflicts.
 * Uses clsx for conditional class joining and tailwind-merge for handling Tailwind-specific conflicts.
 *
 * @param inputs - Array of class values, which can include strings, objects, arrays, or falsy values
 * @returns A string of merged and deduplicated CSS classes
 *
 * @example
 * // Basic usage
 * cn('px-2', 'py-1') // => 'px-2 py-1'
 *
 * // With conditions
 * cn('px-2', isLarge && 'text-lg') // => 'px-2 text-lg' or 'px-2'
 *
 * // Handling conflicts
 * cn('px-2 p-3', 'px-4') // => 'p-3 px-4'
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Creates a debounced version of a function that delays its execution until after a specified time
 * has elapsed since the last time it was called.
 *
 * @template T - Array type representing the parameters of the callback function
 * @param callback - The function to debounce
 * @param time - The number of milliseconds to delay execution
 * @returns A debounced version of the callback function
 *
 * @example
 * // For event handlers
 * const handleInput = debounce<[ChangeEvent<HTMLInputElement>]>((event) => {
 * }, 300);
 *
 * // For regular functions
 * const handleSearch = debounce<[string]>((searchTerm) => {
 *   fetchSearchResults(searchTerm);
 * }, 500);
 *
 * @remarks
 * - If the debounced function is called multiple times within the delay period,
 *   only the last call will be executed.
 * - The timer is reset each time the debounced function is called.
 * - Useful for performance optimization in scenarios like search inputs, window resize events,
 *   or any situation where you want to limit the rate of function execution.
 */
export function debounce<T extends unknown[]>(
  callback: (...args: T) => void,
  time: number
) {
  let timer: ReturnType<typeof setTimeout>

  return (...args: T) => {
    if (timer) clearTimeout(timer)

    timer = setTimeout(() => {
      callback(...args)
    }, time)
  }
}
