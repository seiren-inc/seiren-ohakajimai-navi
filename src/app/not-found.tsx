import SiteLayout from "./(site)/layout"
import NotFoundContent from "./(site)/not-found"

export { metadata } from "./(site)/not-found"

/**
 * ルートグループ外（未マッチURL）の404。下層ページと同じ chrome を適用して
 * 旧 ConditionalLayout 時代の見た目を維持する。
 */
export default function RootNotFound(): React.ReactElement {
  return (
    <SiteLayout>
      <NotFoundContent />
    </SiteLayout>
  )
}
