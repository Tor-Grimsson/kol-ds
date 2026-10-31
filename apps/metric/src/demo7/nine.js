/* /demo-9's switch (plan 2026-10-30-metric-style, W11–W12): parts shared with /demo-7 and /demo-8 read it, so those two
 * pages render exactly as they did. Remove once one page is chosen. */
import { createContext, useContext } from 'react'

export const Nine = createContext(false)
export const useNine = () => useContext(Nine)

/* /demo-10 (W13): on top of /demo-9 */
export const Ten = createContext(false)
export const useTen = () => useContext(Ten)

/* /demo-11 (W14.3, W15–W17): on top of /demo-10 */
export const Eleven = createContext(false)
export const useEleven = () => useContext(Eleven)
