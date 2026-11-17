import { eventConfig } from '@/config/eventConfig'
import { publicAsset } from '@/utils/assets'
import { WaxSealArt } from './artwork/WaxSealArt'

/** The golden heart wax seal — the original artwork when configured, otherwise the vector rendition. */
export function WaxSeal({ className = '' }: { className?: string }) {
  const image = eventConfig.media.waxSealImage
  return (
    <span className={`seal-art ${className}`}>
      {image ? <img src={publicAsset(image)} alt="" className="h-full w-full object-contain" draggable={false} /> : <WaxSealArt />}
    </span>
  )
}
