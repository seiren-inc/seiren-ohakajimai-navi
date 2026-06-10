// /gyoseishoshi/entry → /scrivener/signup にリダイレクト（フロー一本化）
import { redirect } from 'next/navigation'

export default function ScrivenerEntryRedirectPage() {
    redirect('/scrivener/signup')
}
