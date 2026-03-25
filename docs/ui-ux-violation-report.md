# UI/UX Global Rules Violation Report

- Project: seiren-ohakajimai-navi
- Generated: 2026-03-20T00:13:16.328Z
- Scope: UI files (132 files)
- Method: static analysis (regex-based heuristic)

## Critical

- なし

## High

- なし

## Medium

1. absolute指定が多い
- 判定理由: absolute系記述が 40 件。レスポンシブ再配置時に崩れやすい構造の可能性。
- 根拠:
- seiren-ohakajimai-navi/src/app/company/page.tsx:162 `<div className="absolute inset-0 bg-white/30" />`
- seiren-ohakajimai-navi/src/app/estimation/page.tsx:29 `<div className="pointer-events-none absolute inset-0 overflow-hidden flex justify-center">`
- seiren-ohakajimai-navi/src/app/estimation/page.tsx:30 `<div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] rounded-full bg-emerald-400/20 blur-[120px]"></div>`
- seiren-ohakajimai-navi/src/app/estimation/page.tsx:31 `<div className="absolute top-[20%] -right-[10%] w-[40%] h-[60%] rounded-full bg-teal-400/20 blur-[100px]"></div>`
- seiren-ohakajimai-navi/src/app/estimation/page.tsx:32 `<div className="absolute bottom-[-10%] left-[20%] w-[60%] h-[40%] rounded-full bg-emerald-500/10 blur-[100px]"></div>`
- seiren-ohakajimai-navi/src/app/flow/page.tsx:211 `className="absolute left-[19px] top-10 bottom-10 w-px bg-neutral-200 hidden sm:block"`

2. 行間不足の疑い
- 判定理由: line-height が詰まる指定を 8 件検出。可読性低下の可能性。
- 根拠:
- seiren-ohakajimai-navi/src/app/globals.css:116 `line-height: 1.85;`
- seiren-ohakajimai-navi/src/app/globals.css:124 `line-height: 1.15;`
- seiren-ohakajimai-navi/src/app/globals.css:131 `line-height: 1.7;`
- seiren-ohakajimai-navi/src/app/globals.css:195 `line-height: 1.45 !important;`
- seiren-ohakajimai-navi/src/app/globals.css:205 `line-height: 1.45 !important;`
- seiren-ohakajimai-navi/src/components/home/HomepageClient.tsx:481 `<h3 className="typography-heading mt-3 max-w-[22ch] text-xl font-semibold leading-[1.2] tracking-tight text-neutral-900 md:text-2xl lg:text-3xl">全国対応と提携ネットワーク</h3>`
- seiren-ohakajimai-navi/src/components/home/HomepageClient.tsx:502 `<h3 className="typography-heading mt-3 max-w-[22ch] text-xl font-semibold leading-[1.2] tracking-tight text-neutral-900 md:text-2xl lg:text-3xl">法令遵守の安心設計</h3>`
- seiren-ohakajimai-navi/src/components/home/HomepageClient.tsx:523 `<h3 className="typography-heading mt-3 max-w-[22ch] text-xl font-semibold leading-[1.2] tracking-tight text-neutral-900 md:text-2xl lg:text-3xl">離檀交渉サポート</h3>`

## Low

- なし

## Notes

- このレポートは静的解析ベースのため、最終判断は実機表示（1920/1440/1024/768/430/390/375）で確認すること。
- Fixed要素・重なり・改行崩れは、実際のDOM/表示幅で再検証すること。
