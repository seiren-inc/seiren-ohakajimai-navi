/**
 * IndexNow API を使用して、Bing等にURLの追加・更新・削除をリアルタイムで通知する関数
 */

const INDEXNOW_API_KEY = "2e9d1723aa044132b6a533609eaec28b"
const HOST = "www.ohakajimai-navi.jp"

export async function submitToIndexNow(urlList: string[]) {
  if (process.env.NODE_ENV !== "production") {
    // 開発環境では送信しない
    console.log("[IndexNow] Development mode - Skipped sending URLs:", urlList)
    return { success: true, message: "Skipped in development" }
  }

  if (!urlList || urlList.length === 0) {
    return { success: false, message: "No URLs provided" }
  }

  const endpoint = "https://api.indexnow.org/indexnow"
  
  const payload = {
    host: HOST,
    key: INDEXNOW_API_KEY,
    keyLocation: `https://${HOST}/${INDEXNOW_API_KEY}.txt`,
    urlList: urlList,
  }

  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json; charset=utf-8",
      },
      body: JSON.stringify(payload),
    })

    if (response.ok) {
      console.log(`[IndexNow] Successfully submitted ${urlList.length} URLs. HTTP ${response.status}`)
      return { success: true, status: response.status }
    } else {
      console.error(`[IndexNow] Failed to submit URLs. HTTP ${response.status}`)
      return { success: false, status: response.status }
    }
  } catch (error) {
    console.error(`[IndexNow] Error submitting URLs:`, error)
    return { success: false, error }
  }
}
