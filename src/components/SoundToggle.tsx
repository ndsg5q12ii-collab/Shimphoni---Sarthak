import { Volume2, VolumeX } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { eventConfig } from '@/config/eventConfig'
import { publicAsset } from '@/utils/assets'

/** Optional ambient music. Rendered only when a track is configured; always starts muted and never autoplays. */
export function SoundToggle() {
  const track = eventConfig.media.backgroundMusic
  const audioRef = useRef<HTMLAudioElement>(null)
  const [playing, setPlaying] = useState(false)

  useEffect(() => () => audioRef.current?.pause(), [])

  if (!track) return null

  const toggle = async () => {
    const audio = audioRef.current
    if (!audio) return
    if (playing) {
      audio.pause()
      setPlaying(false)
      return
    }
    try {
      audio.volume = 0.5
      await audio.play()
      setPlaying(true)
    } catch {
      setPlaying(false)
    }
  }

  return (
    <>
      <audio ref={audioRef} src={publicAsset(track)} loop preload="none" />
      <button
        type="button"
        className="grid h-10 w-10 place-items-center rounded-full border border-gold/40 text-champagne transition-colors hover:border-champagne"
        aria-pressed={playing}
        onClick={toggle}
      >
        {playing ? <Volume2 aria-hidden="true" className="h-4 w-4" /> : <VolumeX aria-hidden="true" className="h-4 w-4" />}
        <span className="sr-only">{playing ? 'Pause music' : 'Play music'}</span>
      </button>
    </>
  )
}
