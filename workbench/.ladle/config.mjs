/** @type {import('@ladle/react').UserConfig} */
export default {
  stories: 'src/**/*.stories.{js,jsx,ts,tsx}',
  // KOL ships dark by default (data-theme="dark"); open the workbench in the
  // same mode the design system actually defaults to, not Ladle's light default.
  addons: {
    theme: {
      defaultState: 'dark',
    },
  },
}
