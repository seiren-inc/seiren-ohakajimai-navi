import { ImageResponse } from 'next/og'
import { getBlogPost } from '@/lib/blog'

export const runtime = 'edge'

type Props = {
  params: Promise<{ slug: string }>
}

export const size = {
  width: 1200,
  height: 630,
}
export const contentType = 'image/png'

export default async function Image({ params }: Props) {
  const { slug } = await params
  const post = getBlogPost(slug)

  const title = post?.metadata.title ?? 'お役立ちコラム'
  const category = post?.metadata.category ?? '改葬・お墓じまい'

  return new ImageResponse(
    (
      <div
        style={{
          width: '1200px',
          height: '630px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          backgroundColor: '#fff',
          fontFamily: 'sans-serif',
          overflow: 'hidden',
        }}
      >
        {/* Top accent bar */}
        <div
          style={{
            width: '100%',
            height: '8px',
            background: 'linear-gradient(90deg, #059669, #34d399)',
          }}
        />

        {/* Main content */}
        <div
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            padding: '48px 64px',
          }}
        >
          {/* Category badge */}
          <div
            style={{
              display: 'flex',
              marginBottom: '24px',
            }}
          >
            <div
              style={{
                backgroundColor: '#ecfdf5',
                border: '1px solid #a7f3d0',
                borderRadius: '24px',
                padding: '6px 20px',
                fontSize: '18px',
                color: '#065f46',
                fontWeight: '600',
              }}
            >
              {category}
            </div>
          </div>

          {/* Title */}
          <div
            style={{
              fontSize: title.length > 30 ? '36px' : '44px',
              fontWeight: '700',
              color: '#111827',
              lineHeight: '1.4',
              maxWidth: '900px',
            }}
          >
            {title}
          </div>
        </div>

        {/* Footer */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '24px 64px',
            borderTop: '1px solid #e5e7eb',
            backgroundColor: '#f9fafb',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
            }}
          >
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                backgroundColor: '#059669',
              }}
            />
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontSize: '16px', color: '#374151', fontWeight: '600' }}>
                株式会社清蓮
              </span>
              <span style={{ fontSize: '13px', color: '#6b7280' }}>
                お墓じまいナビ お役立ちコラム
              </span>
            </div>
          </div>
          <div
            style={{
              fontSize: '15px',
              color: '#059669',
              fontWeight: '600',
            }}
          >
            ohakajimai-navi.jp
          </div>
        </div>
      </div>
    ),
    { ...size }
  )
}
