import { NoticeBanner } from '@kolkrabbi/kol-component'

export const stage = 'lg'

/* something needs attention, and the one thing that fixes it */
export default function NoticeBannerPreview() {
  return (
    <div className="w-full max-w-[940px]">
      <NoticeBanner title="Calendar needs attention" body="Unexpected response from gcalcli. Authenticate on this machine to sync events." action="Reconnect" onAction={() => {}} />
    </div>
  )
}
