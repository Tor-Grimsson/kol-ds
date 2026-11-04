import { Timecode } from '@kolkrabbi/kol-shell'

/* 00:04:12 / 00:12:00 (the gap map's row 70) — the transport draws it in its own capsule (AppFloatNav's page) */
export default function TimecodePreview() {
  return <Timecode current="00:04:12" total="00:12:00" />
}
