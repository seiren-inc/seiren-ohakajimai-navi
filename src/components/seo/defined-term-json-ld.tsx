/**
 * DefinedTermSet JSON-LD
 * お墓じまい・改葬に関連する専門用語をGoogleとAI検索エンジンに定義として提供する
 * https://schema.org/DefinedTerm / https://schema.org/DefinedTermSet
 */

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://www.ohakajimai-navi.jp'

const terms = [
  {
    name: '改葬（かいそう）',
    description:
      '現在のお墓から遺骨を取り出し、別の場所へ移す行為のこと。墓地埋葬法により、改葬許可証の取得が必要な法的手続きを伴う。単にお墓を撤去する「お墓じまい」とは区別される。',
    url: `${BASE_URL}/about#kaisou`,
  },
  {
    name: 'お墓じまい（おはかじまい）',
    description:
      '現在のお墓を解体・撤去し、墓地の管理者に区画を返還する作業全般のこと。「改葬」と混同されるが、お墓じまいはお墓の物理的な撤去作業を指し、改葬は遺骨の移動に関する法的手続きを指す語として使い分けられる。',
    url: `${BASE_URL}/about`,
  },
  {
    name: '改葬許可証（かいそうきょかしょう）',
    description:
      '遺骨を現在のお墓から移動させるために市区町村から発行される許可証。改葬許可申請書・埋蔵証明書・受入証明書を揃えて申請する。改葬許可証なしに遺骨を移動させることは墓地埋葬法違反となる。',
    url: `${BASE_URL}/kaisoukyoka`,
  },
  {
    name: '離檀料（りだんりょう）',
    description:
      '寺院の檀家（だんか）から離れる際に、これまでのお世話への感謝として寺院へ渡すお布施のこと。法的な支払い義務はなく、あくまで「お気持ち」の位置づけ。相場は3万〜20万円程度とされる。',
    url: `${BASE_URL}/ridanryou`,
  },
  {
    name: '閉眼法要（へいがんほうよう）',
    description:
      '墓石を撤去する前に行う宗教儀式のこと。「魂抜き」「お性根抜き」とも呼ばれ、お墓に宿るとされる故人の魂を抜いてから石材の工事を行う。僧侶に依頼するのが一般的。',
    url: `${BASE_URL}/flow`,
  },
  {
    name: '永代供養（えいたいくよう）',
    description:
      '寺院・霊園が長期間にわたって遺骨の管理・供養を行ってくれる供養形式のこと。後継者がいない場合や、子どもに管理の負担をかけたくない場合に選ばれる。合祀墓・個別型・樹木葬・納骨堂など種類がある。',
    url: `${BASE_URL}/kaisougo`,
  },
  {
    name: '海洋散骨（かいようさんこつ）',
    description:
      '粉骨した遺骨を海に散布する葬送方法のこと。日本では海洋散骨を直接禁止する法律はなく、ルールを守って行う分には合法とされる。散骨前に必ず「粉骨（2mm以下への粉砕）」が必要。',
    url: `${BASE_URL}/sankotsu`,
  },
  {
    name: '粉骨（ふんこつ）',
    description:
      '遺骨を専用の機材で2mm以下の粉末状に砕く加工のこと。海洋散骨の際や手元供養の際に必要となる。個別に処理することが重要で、証明書の発行も行う。',
    url: `${BASE_URL}/sankotsu`,
  },
]

export function DefinedTermSetJsonLd() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'DefinedTermSet',
    '@id': `${BASE_URL}/#termset-hakajimai`,
    name: 'お墓じまい・改葬に関する用語集',
    description: 'お墓じまい・改葬・供養に関する専門用語の定義です。',
    url: `${BASE_URL}/about`,
    inLanguage: 'ja-JP',
    hasDefinedTerm: terms.map((term) => ({
      '@type': 'DefinedTerm',
      name: term.name,
      description: term.description,
      url: term.url,
      inDefinedTermSet: `${BASE_URL}/#termset-hakajimai`,
    })),
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  )
}
