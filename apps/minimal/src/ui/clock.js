const pad = (n) => String(n).padStart(2, '0')

/* mm:ss:ff at 60 frames, from seconds */
export const clock = (t) => `${pad(Math.floor(t / 60))}:${pad(Math.floor(t) % 60)}:${pad(Math.floor((t % 1) * 60))}`
