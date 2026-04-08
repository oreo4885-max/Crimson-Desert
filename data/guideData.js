window.guideData = {
  meta: {
    title: "붉은사막 파밍 가이드",
    subtitle: "유튜브 링크를 근거로 정리한 붉은사막 아이템/스킬/탈것 연구용 프로토타입입니다.",
    evidenceNote: "현재 좌표는 실제 게임 맵 프레임 대조 전의 임시 배치이며, 아이템명/챕터/출처 링크는 실제 영상 기준으로 입력했습니다."
  },
  categories: [
    { id: "all", label: "전체", color: "#f6eadc" },
    { id: "weapon", label: "무기", color: "#c95743" },
    { id: "armor", label: "방어구", color: "#6ea7c6" },
    { id: "accessory", label: "장신구", color: "#d6aa47" },
    { id: "skill", label: "스킬", color: "#84b96f" },
    { id: "utility", label: "편의", color: "#d98c4a" },
    { id: "mount", label: "탈것", color: "#b684d6" },
    { id: "system", label: "시스템", color: "#5fb4a2" }
  ],
  regions: [
    "전체 지역",
    "지역 다수",
    "마녀 성소",
    "입문 장비 루트",
    "회색갈기",
    "어둠왕 벨로스",
    "영상 프레임 검수 필요"
  ],
  spots: [
    {
      id: "free-skill-route",
      name: "무료 스킬 해금 루트",
      category: "skill",
      region: "지역 다수",
      coordinates: { x: 18, y: 24 },
      difficulty: "쉬움",
      recommended: "초반 우선 방문",
      respawn: "상시",
      verification: {
        status: "복수 영상 교차확인",
        confidence: "중간",
        lastChecked: "2026-04-08"
      },
      mapping: {
        status: "다중 위치 묶음",
        basis: "챕터 + 영상 설명문",
        note: "스킬별 실제 좌표는 서로 다른 위치에 흩어져 있어 현재는 대표 마커로 묶었습니다. 다음 단계에서 각 스킬을 개별 마커로 분리하면 됩니다."
      },
      items: [
        {
          name: "바람 모아쏘기",
          type: "무료 스킬",
          rarity: "특수",
          effects: ["자원 소모 없이 스킬 습득 가능"],
          stats: ["원거리 견제 또는 전투 시작용 스킬로 분류 가능"],
          acquisitionConditions: ["영상의 무료 습득 지점을 찾아 상호작용"],
          prerequisites: ["기본 이동 스킬과 해당 구역 진입 필요"]
        },
        {
          name: "순간공격 / 회전베기 강화 / 전진베기 강화",
          type: "무료 스킬",
          rarity: "특수",
          effects: ["기본 전투 루프 강화", "초반 화력과 연계 보강"],
          stats: ["근접 전투 콤보 안정성 향상"],
          acquisitionConditions: ["지점별 무료 습득 포인트 방문"],
          prerequisites: ["기본 전투 조작 숙지"]
        },
        {
          name: "회오리차기 / 타격강화 숙련 / 집중지정타 / 이중도약",
          type: "무료 스킬",
          rarity: "특수",
          effects: ["이동성과 공중전, 연계 성능 보강"],
          stats: ["이중도약은 탐험 루트 효율에 직접 영향"],
          acquisitionConditions: ["영상 후반부 스킬 위치 순서대로 방문"],
          prerequisites: ["낙사 방지와 점프 구간 대응 필요"]
        }
      ],
      summary: "무료로 배울 수 있는 스킬 위치를 한 번에 모아둔 루트입니다. 초반 성능 체감이 큰 스킬들이 섞여 있어 우선순위가 높습니다.",
      locationGuide: "현재는 다중 위치 묶음 마커입니다. 각 스킬의 실제 위치는 영상 자막/챕터와 게임 내 랜드마크를 대조해 개별 마커로 분해하는 작업이 필요합니다.",
      route: [
        "가장 먼저 이중도약과 이동계 스킬을 확보해 다음 루트의 이동 효율을 올립니다.",
        "그 뒤 기본 전투 스킬 강화 계열을 챙겨 초반 딜 부족 구간을 줄입니다.",
        "각 스킬 확보 후 실제 좌표와 랜드마크를 별도 메모해 개별 분리 데이터를 만듭니다."
      ],
      cautions: [
        "현재 데이터는 스킬명과 영상 챕터는 확정됐지만 개별 위치 좌표는 아직 프레임 검수 전입니다."
      ],
      sources: [
        {
          title: "붉은사막 공짜로 스킬 익히는 곳 모음",
          creator: "진베라모드TV",
          url: "https://youtu.be/zGN4mDJ9dBo?si=zgejhFaZPwwgC8a-",
          cue: "00:24-03:17",
          evidence: "바람 모아쏘기, 순간공격, 회전베기 강화, 전진베기 강화, 회오리차기, 타격강화 숙련, 집중지정타, 이중도약이 챕터로 명시됩니다.",
          note: "개별 스킬 포인트를 분리 입력할 때 1차 기준 영상으로 쓰기 좋습니다."
        },
        {
          title: "붉은사막의 모든것을 한편에 다 담았다..후손까지 갈 공략집 종결편",
          creator: "카사노박TV [CASANOPARK]",
          url: "https://youtu.be/WqBq3lY4R3I?si=AY4uEI5IvItxV8ys",
          cue: "01:02-01:53",
          evidence: "무료 스킬 습득 팁이 별도 챕터로 반복 언급됩니다.",
          note: "교차 검증용 보조 출처입니다."
        }
      ]
    },
    {
      id: "witch-sanctuary-route",
      name: "마녀 성소 / 해적왕 모자 루트",
      category: "system",
      region: "마녀 성소",
      coordinates: { x: 35, y: 31 },
      difficulty: "중간",
      recommended: "중반 콘텐츠 준비용",
      respawn: "콘텐츠 주기 확인 필요",
      verification: {
        status: "복수 영상 교차확인",
        confidence: "중간",
        lastChecked: "2026-04-08"
      },
      mapping: {
        status: "좌표 임시 배치",
        basis: "챕터 + 콘텐츠 이름",
        note: "마녀 위치와 성소 루트는 영상상 복수 지점입니다. 실제 맵 캡처에서 마녀별 위치를 다시 분리해 넣는 것이 좋습니다."
      },
      items: [
        {
          name: "해적왕 모자",
          type: "장비 / 외형",
          rarity: "희귀",
          effects: ["특수 보상 장비 또는 수집 요소로 활용"],
          stats: ["실제 수치는 영상 프레임 확인 필요"],
          acquisitionConditions: ["마녀 성소 관련 진행 후 해당 챕터 루트 따라 획득"],
          prerequisites: ["마녀 선행 퀘스트 진행 필요"]
        },
        {
          name: "마녀 성소 보상 루프",
          type: "콘텐츠",
          rarity: "특수",
          effects: ["중반 성장 루트 핵심 콘텐츠"],
          stats: ["성소 반복과 마녀 위치 파악이 효율에 영향"],
          acquisitionConditions: ["모든 마녀 위치 파악 후 성소 콘텐츠 진행"],
          prerequisites: ["선행 퀘스트 완료", "마녀 위치 확인"]
        }
      ],
      summary: "마녀 성소, 모든 마녀 위치, 해적왕 모자, 연구소 운영까지 이어지는 중반 핵심 콘텐츠 묶음입니다.",
      locationGuide: "현재는 마녀 성소 콘텐츠군 전체를 한 점으로 묶은 상태입니다. 실제 사용 단계에서는 마녀별 위치와 성소별 위치를 따로 쪼개는 것이 좋습니다.",
      route: [
        "먼저 선행 퀘스트를 확인하고 모든 마녀 위치를 정리합니다.",
        "성소 진입과 보상 루프를 익힌 뒤 해적왕 모자 획득 구간을 분리 기록합니다.",
        "후속으로 연구소 운영과 캠프 확장까지 연결해 중반 루트를 완성합니다."
      ],
      cautions: [
        "선행 퀘스트 누락 시 성소 루프가 끊길 수 있습니다.",
        "마녀 위치가 다중 지점이라 좌표 확정 전에는 대표 마커로만 사용해야 합니다."
      ],
      sources: [
        {
          title: "붉은 사막 진짜 꼭 해야할 컨텐츠들만 뽑아서 공략 만들었습니다 !",
          creator: "꾸준이",
          url: "https://youtu.be/mMTjl_GTgQw?si=Hxi8GOWypXjyii9C",
          cue: "01:55-06:27",
          evidence: "마녀 성소 해야 하는 이유, 모든 마녀 위치(선행퀘), 성소에서 해야 할 것들, 해적왕 모자가 챕터로 명시됩니다.",
          note: "성소 콘텐츠와 장비 보상을 함께 묶는 1차 기준 영상입니다."
        },
        {
          title: "붉은사막 80-100시간쯤부터 하게되는 엔드컨텐츠 공략집",
          creator: "카사노박TV [CASANOPARK]",
          url: "https://youtu.be/Y8kgjrPBUd8?si=wlr2V2EnlTiQKuVl",
          cue: "02:20-03:07",
          evidence: "마녀 퀘스트와 모든 마녀들의 위치가 엔드게임 루프 안에서 다시 언급됩니다.",
          note: "중후반 루프에서 같은 콘텐츠를 재확인하는 교차 출처입니다."
        }
      ]
    },
    {
      id: "beginner-power-route",
      name: "입문 장비 + 금괴 스타트 루트",
      category: "weapon",
      region: "입문 장비 루트",
      coordinates: { x: 56, y: 22 },
      difficulty: "쉬움",
      recommended: "시작 직후",
      respawn: "상시 / 1회성 혼합",
      verification: {
        status: "복수 영상 교차확인",
        confidence: "중간",
        lastChecked: "2026-04-08"
      },
      mapping: {
        status: "다중 위치 묶음",
        basis: "챕터 + 설명문",
        note: "전설 양손검, 공짜 금괴, 방패 위치가 서로 다른 지점이라 현재는 초반 스타트 루트 묶음으로 관리합니다."
      },
      items: [
        {
          name: "전설 양손검",
          type: "무기",
          rarity: "전설",
          effects: ["초반 화력 급상승용 핵심 무기"],
          stats: ["입문 구간에서 체감 성능이 매우 높다는 영상 설명 존재"],
          acquisitionConditions: ["영상 챕터 기준 전설 양손검 위치 방문"],
          prerequisites: ["이동 루트 수행 가능", "낙하/지형 퍼즐 대응 필요 가능성"]
        },
        {
          name: "공짜 금괴",
          type: "재화",
          rarity: "특수",
          effects: ["초반 자금 확보"],
          stats: ["판매 루트와 연계 시 스타트 자금에 도움"],
          acquisitionConditions: ["영상의 금괴 위치에서 획득 후 상점 판매"],
          prerequisites: ["해당 위치 접근 가능"]
        },
        {
          name: "방패 / 양손무기 제작 시작점",
          type: "초반 장비",
          rarity: "일반",
          effects: ["전투 안정성 확보", "스타트 빌드 선택 폭 확대"],
          stats: ["초반 빌드 방향을 빠르게 잡는 데 유리"],
          acquisitionConditions: ["제작 또는 위치 획득"],
          prerequisites: ["기본 제작 재료 또는 접근 경로 확보"]
        }
      ],
      summary: "시작 직후 전투력을 빠르게 끌어올리는 입문용 스타트 루트입니다. 금괴, 방패, 전설 양손검이 한 묶음으로 자주 언급됩니다.",
      locationGuide: "실제 위치는 각 챕터별로 따로 존재합니다. 현재는 입문자에게 우선순위가 높은 요소를 하나의 연구 마커로 모아둔 상태입니다.",
      route: [
        "기본 준비물을 챙긴 뒤 방패나 제작용 시작점부터 확보합니다.",
        "그다음 공짜 금괴를 먼저 회수해 초반 자금을 마련합니다.",
        "전설 양손검 위치를 찾아 장비 화력을 크게 끌어올립니다."
      ],
      cautions: [
        "아이템 위치는 확인됐지만 정확 좌표는 아직 프레임 검수 전입니다.",
        "금괴 판매가와 상점 동선은 패치에 따라 달라질 수 있습니다."
      ],
      sources: [
        {
          title: "붉은사막 결국 샀다면..이건 꼭 봐야 시작부터 개쎄집니다. [입문자편]",
          creator: "카사노박TV [CASANOPARK]",
          url: "https://youtu.be/6AEUyjjIhRk?si=aRQiGlx4SRL_ialK",
          cue: "02:15-04:31",
          evidence: "양손무기 제조법+방패 위치, 공짜 금괴 위치, 전설 양손검 위치가 연속 챕터로 확인됩니다.",
          note: "초반 파워 스타트 루트의 핵심 기준 영상입니다."
        },
        {
          title: "붉은사막의 모든것을 한편에 다 담았다..후손까지 갈 공략집 종결편",
          creator: "카사노박TV [CASANOPARK]",
          url: "https://youtu.be/WqBq3lY4R3I?si=AY4uEI5IvItxV8ys",
          cue: "04:32-04:50",
          evidence: "금괴를 더 비싸게 파는 팁이 별도 챕터로 언급됩니다.",
          note: "금괴 활용법 보조 출처입니다."
        }
      ]
    },
    {
      id: "black-fate-route",
      name: "검은 운명 입수 루트",
      category: "weapon",
      region: "영상 프레임 검수 필요",
      coordinates: { x: 71, y: 24 },
      difficulty: "어려움",
      recommended: "종결 무기 노릴 때",
      respawn: "조건형 / 1회성 가능성",
      verification: {
        status: "제목 + 챕터 확인",
        confidence: "낮음",
        lastChecked: "2026-04-08"
      },
      mapping: {
        status: "좌표 임시 배치",
        basis: "제목 + 챕터",
        note: "검은 운명의 실제 획득 위치는 영상 00:26 이후 프레임을 보고 랜드마크를 따야 합니다. 현재 좌표는 임시 연구용입니다."
      },
      items: [
        {
          name: "검은 운명",
          type: "한손검",
          rarity: "전설",
          effects: ["종결급 한손검으로 소개됨"],
          stats: ["정확 공격력 수치는 현재 데이터에 미반영", "영상 내 성능 소개 구간 존재"],
          acquisitionConditions: ["입수 방법 구간의 루트를 따라 진행"],
          prerequisites: ["전투력 확보", "지역 또는 보스 선행조건 확인 필요"]
        }
      ],
      summary: "비류천무 채널에서 종결급 한손검으로 소개한 '검은 운명' 입수 루트입니다.",
      locationGuide: "현재는 무기 자체와 출처만 확정된 상태입니다. 다음 검수 단계에서 00:26 이후 프레임을 보며 실제 지형 랜드마크를 메모해 좌표를 고정해야 합니다.",
      route: [
        "영상의 입수 방법 구간을 기준으로 진입 경로를 먼저 기록합니다.",
        "검은 운명 노출 장면에서 상자, 보스, NPC, 지형지물을 분리 메모합니다.",
        "실제 게임 맵 스크린샷에 비교해 정확 마커로 교체합니다."
      ],
      cautions: [
        "지금은 제목과 챕터 수준만 확정됐기 때문에 정확 조건은 추가 검수가 필요합니다."
      ],
      sources: [
        {
          title: "[붉은 사막] 종결급 한손검 '검은 운명' 입수 방법",
          creator: "비류천무",
          url: "https://youtu.be/n0HAQ0Pd48g?si=GI7JLvNhVbR1Cqem",
          cue: "00:26-04:38",
          evidence: "입수 방법과 검은 운명 소개 구간이 챕터로 구분됩니다.",
          note: "정확 좌표와 선행조건은 프레임 검수 후 보완이 필요합니다."
        }
      ]
    },
    {
      id: "post-black-fate-weapons",
      name: "검은 운명 대체 상위 무기 후보",
      category: "weapon",
      region: "영상 프레임 검수 필요",
      coordinates: { x: 82, y: 19 },
      difficulty: "어려움",
      recommended: "엔드세팅 비교용",
      respawn: "획득처 확인 필요",
      verification: {
        status: "제목 + 설명문 확인",
        confidence: "낮음",
        lastChecked: "2026-04-08"
      },
      mapping: {
        status: "좌표 임시 배치",
        basis: "제목 + 설명문",
        note: "이 영상은 성능 비교 위주라 실제 획득 좌표는 프레임별 추가 검수가 필요합니다."
      },
      items: [
        {
          name: "장인의 손 한손 무기",
          type: "한손무기",
          rarity: "영웅 이상 추정",
          effects: ["검은 운명 비교 대상 상위권 무기"],
          stats: ["검은 운명보다 실전 공격력이 높을 수 있다는 설명이 존재"],
          acquisitionConditions: ["영상의 무기 소개 구간 확인 후 획득처 추가 조사 필요"],
          prerequisites: ["엔드게임 장비 루트 접근 필요 추정"]
        },
        {
          name: "아크리아 한손검",
          type: "한손검",
          rarity: "영웅 이상 추정",
          effects: ["검은 운명 대체 후보"],
          stats: ["티어 표기보다 실성능이 좋다고 설명됨"],
          acquisitionConditions: ["무기 비교 구간 확인 후 획득처 보완 필요"],
          prerequisites: ["세부 조건 추가 검수 필요"]
        }
      ],
      summary: "검은 운명보다 실제 공격력이 더 높을 수 있다고 소개된 한손무기 비교 항목입니다.",
      locationGuide: "이 포인트는 실제 위치 확정보다 성능 비교 연구를 위한 임시 엔드무기 마커입니다. 획득처는 후속 영상이나 프레임 검수로 보완해야 합니다.",
      route: [
        "우선 무기 이름을 확보하고 비교 후보군을 정리합니다.",
        "검은 운명 루트와 병행해 실제 획득처를 추가 조사합니다.",
        "수치가 확인되면 엔드무기 비교 테이블로 분리합니다."
      ],
      cautions: [
        "실제 공격력 비교 설명은 영상 설명문 기준이며, 숫자 수치는 아직 확정 입력하지 않았습니다."
      ],
      sources: [
        {
          title: "붉은사막 무기 검은운명보다 높은 공격력을 가진 한손무기",
          creator: "계란푸른자",
          url: "https://youtu.be/HS0ZL2xpzl8?si=-BulDoK8BhY5Qldo",
          cue: "00:35-01:02",
          evidence: "장인의 손 한손 무기와 아크리아 한손검이 챕터로 노출되고, 설명문에서 검은 운명보다 실제 공격력이 높을 수 있다고 적혀 있습니다.",
          note: "자막이 바로 잡히지 않아 설명문과 챕터 기준으로만 입력했습니다."
        }
      ]
    },
    {
      id: "velos-armor-set",
      name: "차가운 어둠의 판금 갑옷 세트",
      category: "armor",
      region: "어둠왕 벨로스",
      coordinates: { x: 70, y: 47 },
      difficulty: "어려움",
      recommended: "중후반 방어구 파밍",
      respawn: "보스/루트 확인 필요",
      verification: {
        status: "제목 + 챕터 확인",
        confidence: "중간",
        lastChecked: "2026-04-08"
      },
      mapping: {
        status: "좌표 임시 배치",
        basis: "챕터 + 보스명",
        note: "갑옷, 망토, 장갑, 신발, 투구가 따로 소개되며 후반부에 어둠왕 벨로스 공략이 연결됩니다. 부위별 분리 마커로 확장하기 좋습니다."
      },
      items: [
        {
          name: "차가운 어둠의 판금 갑옷 / 망토 / 장갑 / 신발 / 투구",
          type: "방어구 세트",
          rarity: "영웅 이상 추정",
          effects: ["세트 장비 파밍 루트", "중후반 생존 세팅 핵심 후보"],
          stats: ["10:03 이후 갑옷 성능 구간 존재", "세부 수치는 프레임 캡처 후 반영 필요"],
          acquisitionConditions: ["각 부위별 획득 루트 진행", "후반부 어둠왕 벨로스 공략 참고"],
          prerequisites: ["보스 공략 가능 전투력", "부위별 진입 조건 확인 필요"]
        }
      ],
      summary: "어둠왕 벨로스와 연결되는 차가운 어둠의 판금 갑옷 세트 파밍 루트입니다. 부위별로 챕터가 나뉘어 있어 데이터화하기 좋습니다.",
      locationGuide: "현재는 세트 전체를 대표 마커로 표시했습니다. 실제 사용 단계에서는 갑옷, 망토, 장갑, 신발, 투구를 각각 따로 분리하는 것이 가장 좋습니다.",
      route: [
        "부위별 챕터를 순서대로 따라가며 획득처를 메모합니다.",
        "08:53 이후의 어둠왕 벨로스 공략 구간에서 보스 연동 여부를 확인합니다.",
        "10:03 이후 성능 장면을 캡처해 방어 수치와 옵션을 별도 입력합니다."
      ],
      cautions: [
        "세트 성능 수치는 아직 영상 프레임 캡처 전이라 수치형 데이터는 비워둔 상태입니다."
      ],
      sources: [
        {
          title: "[붉은 사막] 어둠왕 벨로스 갑옷 '차가운 어둠의 판금 갑옷' 세트 입수 방법",
          creator: "비류천무",
          url: "https://youtu.be/kPC2Eg3xB8A?si=9R5NbtVobAnYrzD-",
          cue: "00:48-11:37",
          evidence: "갑옷, 망토, 장갑, 신발, 풀 세트, 어둠왕 벨로스 공략, 갑옷 성능이 챕터로 구분됩니다.",
          note: "세트 분해 데이터화를 하기 가장 좋은 1차 영상입니다."
        },
        {
          title: "붉은사막 결국 샀다면..이건 꼭 봐야 시작부터 개쎄집니다. [입문자편]",
          creator: "카사노박TV [CASANOPARK]",
          url: "https://youtu.be/6AEUyjjIhRk?si=aRQiGlx4SRL_ialK",
          cue: "04:54-07:38",
          evidence: "어둠의 차가운 판금 갑옷, 망토, 부츠, 장갑, 가죽 투구 위치가 별도 챕터로 다시 언급됩니다.",
          note: "입문자 영상에서도 부위별 위치가 반복 확인되어 교차 검증에 유리합니다."
        }
      ]
    },
    {
      id: "magnet-pet-route",
      name: "자석펫 영입 루트",
      category: "utility",
      region: "회색갈기",
      coordinates: { x: 24, y: 63 },
      difficulty: "중간",
      recommended: "파밍 효율 최우선",
      respawn: "상시 / 조건형",
      verification: {
        status: "챕터 확인 + 보조 출처 존재",
        confidence: "중간",
        lastChecked: "2026-04-08"
      },
      mapping: {
        status: "좌표 임시 배치",
        basis: "챕터 + 키워드",
        note: "반려동물 영입과 회색갈기의 새로운 이빨 챕터를 기준으로 대표 마커를 분리했습니다. 실제 위치는 프레임 검수 후 보정이 필요합니다."
      },
      items: [
        {
          name: "자석펫",
          type: "편의 아이템 / 반려동물",
          rarity: "특수",
          effects: ["자동 템 파밍 지원"],
          stats: ["수동 루팅 시간을 크게 줄이는 편의 장비"],
          acquisitionConditions: ["반려동물 영입 루트 진행", "자동펫 활용법 확인"],
          prerequisites: ["반려동물 시스템 접근", "회색갈기 관련 진행 가능성"]
        }
      ],
      summary: "자동 루팅 효율을 크게 올려주는 자석펫 확보용 개별 마커입니다.",
      locationGuide: "현재는 회색갈기 키워드를 중심으로 배치한 임시 마커입니다. 실제 지점은 00:32 이후 반려동물 영입 구간과 03:51 회색갈기의 새로운 이빨 구간을 프레임 대조해 조정해야 합니다.",
      route: [
        "반려동물 영입 방법 챕터에서 첫 진입 랜드마크를 확인합니다.",
        "자동펫 활용법으로 기능을 검증합니다.",
        "회색갈기의 새로운 이빨 구간과 연결되는 선행 흐름을 메모합니다."
      ],
      cautions: [
        "정확한 NPC 또는 상호작용 지점은 아직 프레임 검수 전입니다."
      ],
      sources: [
        {
          title: "[붉은 사막] 자동 템파밍 '자석펫' & 인벤 10칸 '특대형 가방' 입수 방법",
          creator: "비류천무",
          url: "https://youtu.be/nM21PheWpuQ?si=RlQJd_SB2stG1ZXu",
          cue: "00:32-04:38",
          evidence: "반려동물 영입 방법, 자동펫 활용법, 회색갈기의 새로운 이빨이 연속 챕터로 구분됩니다.",
          note: "자석펫 쪽은 이 영상이 가장 직접적인 기준입니다."
        }
      ]
    },
    {
      id: "big-bag-route",
      name: "특대형 가방 루트",
      category: "utility",
      region: "영상 프레임 검수 필요",
      coordinates: { x: 33, y: 68 },
      difficulty: "쉬움",
      recommended: "인벤 확장 우선",
      respawn: "상시 / 1회성 가능성",
      verification: {
        status: "복수 영상 교차확인",
        confidence: "중간",
        lastChecked: "2026-04-08"
      },
      mapping: {
        status: "좌표 임시 배치",
        basis: "챕터 + 보조 출처",
        note: "특대형 가방은 전용 영상과 종합 공략 영상 둘 다에서 언급됩니다. 실제 위치는 두 영상을 함께 보며 보정하는 것이 좋습니다."
      },
      items: [
        {
          name: "특대형 가방",
          type: "인벤토리 확장",
          rarity: "특수",
          effects: ["인벤토리 10칸 확장"],
          stats: ["장시간 파밍 시 귀환 빈도 감소"],
          acquisitionConditions: ["06:27 이후 입수 구간 진행"],
          prerequisites: ["관련 루트 또는 선행 상호작용 확인 필요"]
        }
      ],
      summary: "파밍 지속 시간을 크게 늘려주는 10칸 인벤 확장 루트입니다.",
      locationGuide: "현재는 대표 위치만 임시 배치했습니다. 06:27 이후 가방 구간과 종합 공략의 02:51 구간을 비교해 실제 랜드마크를 확인하면 좌표를 빠르게 확정할 수 있습니다.",
      route: [
        "가방 입수 구간에서 시작 랜드마크를 먼저 메모합니다.",
        "종합 공략 영상의 같은 주제 구간으로 위치를 교차 확인합니다.",
        "맵에서 인접 웨이포인트와 함께 기록해 재방문 동선을 만듭니다."
      ],
      cautions: [
        "정확한 위치는 아직 프레임 검수 전입니다."
      ],
      sources: [
        {
          title: "[붉은 사막] 자동 템파밍 '자석펫' & 인벤 10칸 '특대형 가방' 입수 방법",
          creator: "비류천무",
          url: "https://youtu.be/nM21PheWpuQ?si=RlQJd_SB2stG1ZXu",
          cue: "06:27-07:37",
          evidence: "인벤 10칸짜리 특대형 가방이 별도 챕터로 구분됩니다.",
          note: "가방 전용 1차 출처입니다."
        },
        {
          title: "붉은사막의 모든것을 한편에 다 담았다..후손까지 갈 공략집 종결편",
          creator: "카사노박TV [CASANOPARK]",
          url: "https://youtu.be/WqBq3lY4R3I?si=AY4uEI5IvItxV8ys",
          cue: "02:51-02:59",
          evidence: "가방 10칸 늘리는 곳이 별도 챕터로 존재합니다.",
          note: "보조 출처로 재확인할 때 유용합니다."
        }
      ]
    },
    {
      id: "best-ring-route",
      name: "공속 4 반지 세팅 루트",
      category: "accessory",
      region: "영상 프레임 검수 필요",
      coordinates: { x: 84, y: 56 },
      difficulty: "중간",
      recommended: "세팅 최적화 단계",
      respawn: "획득처 확인 필요",
      verification: {
        status: "제목 확인 / 자막 활용 예정",
        confidence: "낮음",
        lastChecked: "2026-04-08"
      },
      mapping: {
        status: "좌표 임시 배치",
        basis: "제목 + 아이템명",
        note: "영상 설명에 챕터가 없어서 현재는 제목에 등장한 반지 이름과 세팅 목적만 확정 입력했습니다. 자막 기반 후속 분해가 필요합니다."
      },
      items: [
        {
          name: "Mark of Darkness",
          type: "반지",
          rarity: "희귀 이상 추정",
          effects: ["공격 속도 세팅 핵심 후보"],
          stats: ["영상 제목 기준 공속4 세팅 루트에 포함"],
          acquisitionConditions: ["영상 루트 확인 후 세부 획득처 보완 필요"],
          prerequisites: ["반지 파밍 구역 확인 필요"]
        },
        {
          name: "Witch's Ring",
          type: "반지",
          rarity: "희귀 이상 추정",
          effects: ["공격 속도 세팅용 후보"],
          stats: ["반지 조합 세팅에 포함"],
          acquisitionConditions: ["영상 루트 확인 필요"],
          prerequisites: ["마녀 관련 루트 연계 가능성"]
        },
        {
          name: "Ring of Lighting",
          type: "반지",
          rarity: "희귀 이상 추정",
          effects: ["반지 세팅 최적화 후보"],
          stats: ["공속4 세팅 타이틀에 함께 언급"],
          acquisitionConditions: ["영상 루트 확인 필요"],
          prerequisites: ["세부 구간 자막 검수 필요"]
        }
      ],
      summary: "공속 4 세팅을 목표로 반지 후보들을 모아둔 엔드세팅용 장신구 루트입니다.",
      locationGuide: "현재는 정확 위치보다 어떤 반지를 추적해야 하는지에 초점을 맞춘 연구 마커입니다. 이후 자막과 프레임을 보며 반지별 획득처를 따로 뽑아내는 것이 핵심입니다.",
      route: [
        "우선 반지 이름 세 개를 기준으로 데이터베이스에 등록합니다.",
        "영상 자막에서 각 반지 언급 지점을 뽑아 개별 획득 루트를 만듭니다.",
        "최종적으로 반지별 성능과 실제 공속 기여값을 비교 테이블로 분리합니다."
      ],
      cautions: [
        "현재 항목은 제목 기반이라 실제 획득조건과 지역은 후속 검수가 반드시 필요합니다."
      ],
      sources: [
        {
          title: "붉은사막 세팅 종결 🏆 공속4 반지 쉽게 얻는 법",
          creator: "악령쿤AKTUBE",
          url: "https://youtu.be/Joxj5kpnt_I?si=O6w3e1il6Yxv8Msz",
          cue: "챕터 미기재",
          evidence: "제목에 Mark of Darkness, Witch's Ring, Ring of Lighting이 직접 명시되고 공속4 반지 세팅용 영상임이 확인됩니다.",
          note: "자동자막이 있으므로 다음 단계에서 아이템명 언급 시점을 추출할 수 있습니다."
        }
      ]
    },
    {
      id: "white-horse-roiler",
      name: "전설의 백마 로일러",
      category: "mount",
      region: "지역 다수",
      coordinates: { x: 49, y: 77 },
      difficulty: "중간",
      recommended: "이동 루트 확장용",
      respawn: "탈것 획득형",
      verification: {
        status: "복수 영상 교차확인",
        confidence: "중간",
        lastChecked: "2026-04-08"
      },
      mapping: {
        status: "좌표 임시 배치",
        basis: "챕터 + 보조 출처",
        note: "로일러 전용 마커입니다. 실제 위치는 00:25 이후 장면과 종합 공략의 07:08 구간을 함께 보며 보정하면 됩니다."
      },
      items: [
        {
          name: "로일러",
          type: "전설 탈것",
          rarity: "전설",
          effects: ["상위 이동 수단 확보"],
          stats: ["상세 이동 성능은 후속 프레임 검수 필요"],
          acquisitionConditions: ["00:25 이후 백마 루트 진행"],
          prerequisites: ["탈것 시스템 이해", "관련 지형 접근 가능"]
        }
      ],
      summary: "전설의 백마 로일러 획득을 위한 개별 마커입니다.",
      locationGuide: "현재는 대표 위치만 임시 배치했습니다. 두 영상의 백마 구간을 대조해 정확한 지형 랜드마크를 찾으면 빠르게 좌표를 고정할 수 있습니다.",
      route: [
        "백마 챕터 시작 지점에서 첫 랜드마크를 메모합니다.",
        "보조 출처 영상에서 같은 지형이 나오는지 확인합니다.",
        "실제 맵 스크린샷에 비교해 좌표를 고정합니다."
      ],
      cautions: [
        "정확 위치와 길들이기 조건은 프레임 검수 전입니다."
      ],
      sources: [
        {
          title: "[붉은 사막] 전설의 말 3마리 입수 방법",
          creator: "비류천무",
          url: "https://youtu.be/_9UHTDv9A3c?si=QXizc0erViydR3nL",
          cue: "00:25-02:22",
          evidence: "전설의 백마 로일러 구간이 챕터로 구분됩니다.",
          note: "1차 기준 출처입니다."
        },
        {
          title: "붉은사막의 모든것을 한편에 다 담았다..후손까지 갈 공략집 종결편",
          creator: "카사노박TV [CASANOPARK]",
          url: "https://youtu.be/WqBq3lY4R3I?si=AY4uEI5IvItxV8ys",
          cue: "07:08-07:20",
          evidence: "전설 탈것 백마 위치가 별도 챕터로 다시 언급됩니다.",
          note: "보조 출처입니다."
        }
      ]
    },
    {
      id: "black-horse-rocade",
      name: "전설의 흑마 로케이드",
      category: "mount",
      region: "지역 다수",
      coordinates: { x: 57, y: 80 },
      difficulty: "중간",
      recommended: "이동 루트 확장용",
      respawn: "탈것 획득형",
      verification: {
        status: "복수 영상 교차확인",
        confidence: "중간",
        lastChecked: "2026-04-08"
      },
      mapping: {
        status: "좌표 임시 배치",
        basis: "챕터 + 보조 출처",
        note: "로케이드 전용 마커입니다. 실제 위치는 02:22 이후 장면과 종합 공략의 07:43 구간 대조가 필요합니다."
      },
      items: [
        {
          name: "로케이드",
          type: "전설 탈것",
          rarity: "전설",
          effects: ["중장거리 이동 효율 향상"],
          stats: ["세부 스탯은 미확정"],
          acquisitionConditions: ["02:22 이후 흑마 루트 진행"],
          prerequisites: ["관련 구역 진입 필요"]
        }
      ],
      summary: "전설의 흑마 로케이드 확보용 개별 마커입니다.",
      locationGuide: "현재는 대표 위치만 배치했습니다. 흑마 챕터와 보조 출처를 함께 보며 정확한 맵 랜드마크를 잡아야 합니다.",
      route: [
        "흑마 챕터에서 시작 지형과 이동 방향을 메모합니다.",
        "보조 출처 영상에서 같은 루트를 재확인합니다.",
        "실제 맵 캡처에 비교해 좌표를 확정합니다."
      ],
      cautions: [
        "실제 획득 조건과 지형 진입 루트는 프레임 검수가 더 필요합니다."
      ],
      sources: [
        {
          title: "[붉은 사막] 전설의 말 3마리 입수 방법",
          creator: "비류천무",
          url: "https://youtu.be/_9UHTDv9A3c?si=QXizc0erViydR3nL",
          cue: "02:22-04:18",
          evidence: "전설의 흑마 로케이드 구간이 챕터로 구분됩니다.",
          note: "1차 기준 출처입니다."
        },
        {
          title: "붉은사막의 모든것을 한편에 다 담았다..후손까지 갈 공략집 종결편",
          creator: "카사노박TV [CASANOPARK]",
          url: "https://youtu.be/WqBq3lY4R3I?si=AY4uEI5IvItxV8ys",
          cue: "07:43-07:53",
          evidence: "전설 탈것 흑마 위치가 별도 챕터로 다시 언급됩니다.",
          note: "보조 출처입니다."
        }
      ]
    },
    {
      id: "red-horse-camora",
      name: "전설의 적토마 카모라",
      category: "mount",
      region: "지역 다수",
      coordinates: { x: 63, y: 75 },
      difficulty: "중간",
      recommended: "이동 루트 확장용",
      respawn: "탈것 획득형",
      verification: {
        status: "복수 영상 교차확인",
        confidence: "중간",
        lastChecked: "2026-04-08"
      },
      mapping: {
        status: "좌표 임시 배치",
        basis: "챕터 + 보조 출처",
        note: "카모라 전용 마커입니다. 실제 위치는 04:18 이후 장면과 종합 공략의 07:53 구간을 대조해 보정해야 합니다."
      },
      items: [
        {
          name: "카모라",
          type: "전설 탈것",
          rarity: "전설",
          effects: ["희귀 탈것 수집 루트"],
          stats: ["세부 성능은 후속 검수 필요"],
          acquisitionConditions: ["04:18 이후 적토마 루트 진행"],
          prerequisites: ["탈것 관련 진행도 확인 필요"]
        }
      ],
      summary: "전설의 적토마 카모라 확보용 개별 마커입니다.",
      locationGuide: "현재는 임시 위치입니다. 적토마 구간을 두 영상에서 대조하면 다른 두 말보다 빠르게 좌표를 좁힐 수 있습니다.",
      route: [
        "적토마 챕터 시작 장면의 지형을 먼저 메모합니다.",
        "보조 출처에서 동일 지형을 찾아 루트를 비교합니다.",
        "맵 스크린샷에 올려 좌표를 고정합니다."
      ],
      cautions: [
        "정확 위치와 선행 흐름은 프레임 검수 전입니다."
      ],
      sources: [
        {
          title: "[붉은 사막] 전설의 말 3마리 입수 방법",
          creator: "비류천무",
          url: "https://youtu.be/_9UHTDv9A3c?si=QXizc0erViydR3nL",
          cue: "04:18-07:19",
          evidence: "전설의 적토마 카모라 구간이 챕터로 구분됩니다.",
          note: "1차 기준 출처입니다."
        },
        {
          title: "붉은사막의 모든것을 한편에 다 담았다..후손까지 갈 공략집 종결편",
          creator: "카사노박TV [CASANOPARK]",
          url: "https://youtu.be/WqBq3lY4R3I?si=AY4uEI5IvItxV8ys",
          cue: "07:53-08:05",
          evidence: "전설 탈것 적토마 위치가 별도 챕터로 다시 언급됩니다.",
          note: "보조 출처입니다."
        }
      ]
    }
  ]
};
