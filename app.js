const data = window.guideData;
const STORAGE_KEY = "crimson-desert-map-overrides-v1";

const state = {
  search: "",
  category: "all",
  region: "전체 지역",
  selectedSpotId: data.spots[0]?.id ?? null,
  mappingMode: false,
  draggingSpotId: null,
  overrides: loadOverrides()
};

const elements = {
  heroEyebrow: document.getElementById("heroEyebrow"),
  heroTitle: document.getElementById("heroTitle"),
  heroText: document.getElementById("heroText"),
  heroHighlights: document.getElementById("heroHighlights"),
  heroNote: document.getElementById("heroNote"),
  heroStats: document.getElementById("heroStats"),
  searchInput: document.getElementById("searchInput"),
  categoryChips: document.getElementById("categoryChips"),
  regionSelect: document.getElementById("regionSelect"),
  mappingToggle: document.getElementById("mappingToggle"),
  exportOverrides: document.getElementById("exportOverrides"),
  importOverrides: document.getElementById("importOverrides"),
  importOverridesInput: document.getElementById("importOverridesInput"),
  mapImage: document.getElementById("mapImage"),
  mapNote: document.getElementById("mapNote"),
  mapCaption: document.getElementById("mapCaption"),
  mapBoard: document.getElementById("mapBoard"),
  mapMarkers: document.getElementById("mapMarkers"),
  detailCard: document.getElementById("detailCard"),
  spotList: document.getElementById("spotList"),
  resultsCount: document.getElementById("resultsCount"),
  legend: document.getElementById("legend")
};

function normalizeOverrideRecord(id, record) {
  const rawSpot = getRawSpotById(id);
  if (!rawSpot || !record) return null;

  const coordinates = record.coordinates ?? record;
  const x = clamp(Number(coordinates.x ?? rawSpot.coordinates.x), 0, 100);
  const y = clamp(Number(coordinates.y ?? rawSpot.coordinates.y), 0, 100);

  return {
    x,
    y,
    mappingStatus: record.mappingStatus ?? record.mapping?.status ?? null,
    verifiedAt: record.verifiedAt ?? record.mapping?.verifiedAt ?? null
  };
}

function parseOverridesPayload(payload) {
  if (!payload || typeof payload !== "object") return {};

  if (Array.isArray(payload.overrides)) {
    return payload.overrides.reduce((acc, entry) => {
      if (!entry?.id) return acc;
      const normalized = normalizeOverrideRecord(entry.id, entry);
      if (normalized) {
        acc[entry.id] = normalized;
      }
      return acc;
    }, {});
  }

  return Object.entries(payload).reduce((acc, [id, value]) => {
    const normalized = normalizeOverrideRecord(id, value);
    if (normalized) {
      acc[id] = normalized;
    }
    return acc;
  }, {});
}

function loadOverrides() {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};

    return parseOverridesPayload(JSON.parse(raw));
  } catch {
    return {};
  }
}

function saveOverrides() {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state.overrides));
  } catch {
    // Ignore storage failures in file:// or privacy-restricted contexts.
  }
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function formatCoordinate(value) {
  return Number(value).toFixed(1);
}

function formatWorldCoordinate(value) {
  return Number(value).toFixed(6);
}

function getCategoryMeta(categoryId) {
  return data.categories.find((category) => category.id === categoryId) ?? data.categories[0];
}

function getRawSpotById(spotId) {
  return data.spots.find((spot) => spot.id === spotId) ?? null;
}

function getEffectiveSpot(rawSpot) {
  const override = state.overrides[rawSpot.id];
  if (!override) return rawSpot;

  return {
    ...rawSpot,
    coordinates: {
      x: override.x ?? rawSpot.coordinates.x,
      y: override.y ?? rawSpot.coordinates.y
    }
  };
}

function getAllSpots() {
  return data.spots.map(getEffectiveSpot);
}

function getAvailableRegions() {
  const regions = new Set(getAllSpots().map((spot) => spot.region));
  return ["전체 지역", ...regions];
}

function getItemNames(spot) {
  return (spot.items ?? []).map((item) => item.name);
}

function buildSearchHaystack(spot) {
  const itemTokens = (spot.items ?? []).flatMap((item) => [
    item.name,
    item.type,
    item.rarity,
    ...(item.effects ?? []),
    ...(item.stats ?? []),
    ...(item.acquisitionConditions ?? []),
    ...(item.prerequisites ?? [])
  ]);

  const sourceTokens = (spot.sources ?? []).flatMap((source) => [
    source.title,
    source.creator,
    source.cue,
    source.evidence,
    source.note
  ]);

  return [
    spot.name,
    spot.region,
    spot.summary,
    spot.locationGuide,
    spot.verification?.status,
    spot.verification?.confidence,
    spot.mapping?.status,
    spot.mapping?.basis,
    spot.mapping?.note,
    spot.worldCoordinates?.matchedLabel,
    spot.worldCoordinates?.sourceLabel,
    ...itemTokens,
    ...sourceTokens
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
}

function renderMeta() {
  const meta = data.meta ?? {};
  const map = data.map ?? {};

  document.title = meta.title ?? document.title;

  if (elements.heroEyebrow) {
    elements.heroEyebrow.textContent = meta.eyebrow ?? "Crimson Desert Field Atlas";
  }

  if (elements.heroTitle) {
    elements.heroTitle.textContent = meta.headline ?? meta.title ?? "";
  }

  if (elements.heroText) {
    elements.heroText.textContent = meta.subtitle ?? "";
  }

  if (elements.heroHighlights) {
    elements.heroHighlights.innerHTML = (meta.highlights ?? [])
      .map((highlight) => `<span class="hero-badge">${highlight}</span>`)
      .join("");
  }

  if (elements.heroNote) {
    elements.heroNote.textContent = [meta.evidenceNote, meta.desktopNote].filter(Boolean).join(" ");
  }

  if (elements.mapImage && map.image) {
    elements.mapImage.src = map.image;
    elements.mapImage.alt = map.alt ?? map.name ?? "붉은사막 월드 지도";
  }

  if (elements.mapNote) {
    elements.mapNote.textContent = map.note ?? "";
  }

  if (elements.mapCaption) {
    const sourceLink = map.sourceUrl
      ? `<a href="${map.sourceUrl}" target="_blank" rel="noreferrer">${map.sourceLabel ?? "원본 맵 보기"}</a>`
      : "";

    elements.mapCaption.innerHTML = [map.name, map.dimensions, map.updatedAt ? `업데이트 ${map.updatedAt}` : "", sourceLink]
      .filter(Boolean)
      .map((value) => `<span>${value}</span>`)
      .join("");
  }
}

function getVisibleSpots() {
  const keyword = state.search.trim().toLowerCase();

  return getAllSpots().filter((spot) => {
    const matchesCategory = state.category === "all" || spot.category === state.category;
    const matchesRegion = state.region === "전체 지역" || spot.region === state.region;
    const matchesSearch = keyword.length === 0 || buildSearchHaystack(spot).includes(keyword);

    return matchesCategory && matchesRegion && matchesSearch;
  });
}

function ensureSelectedSpot(visibleSpots) {
  const stillVisible = visibleSpots.some((spot) => spot.id === state.selectedSpotId);

  if (!stillVisible) {
    state.selectedSpotId = visibleSpots[0]?.id ?? null;
  }
}

function updateCoordinateOverride(spotId, axis, value) {
  const rawSpot = getRawSpotById(spotId);
  if (!rawSpot) return;

  const current = state.overrides[spotId] ?? {};
  const nextValue = clamp(Number(value), 0, 100);

  state.overrides[spotId] = {
    x: axis === "x" ? nextValue : current.x ?? rawSpot.coordinates.x,
    y: axis === "y" ? nextValue : current.y ?? rawSpot.coordinates.y,
    mappingStatus: current.mappingStatus === "좌표 확정" ? "좌표 보정 중" : current.mappingStatus ?? "좌표 보정 중",
    verifiedAt: current.mappingStatus === "좌표 확정" ? null : current.verifiedAt ?? null
  };

  saveOverrides();
  render();
}

function resetSpotOverride(spotId) {
  delete state.overrides[spotId];
  saveOverrides();
  render();
}

function resetAllOverrides() {
  state.overrides = {};
  saveOverrides();
  render();
}

async function copyText(text) {
  if (navigator.clipboard?.writeText) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch {
      // Fall through to legacy copy.
    }
  }

  const helper = document.createElement("textarea");
  helper.value = text;
  helper.setAttribute("readonly", "readonly");
  helper.style.position = "fixed";
  helper.style.opacity = "0";
  document.body.appendChild(helper);
  helper.select();

  try {
    document.execCommand("copy");
    document.body.removeChild(helper);
    return true;
  } catch {
    document.body.removeChild(helper);
    return false;
  }
}

function getCoordinateSnapshot(spot) {
  const override = state.overrides[spot.id];

  return JSON.stringify(
    {
      id: spot.id,
      name: spot.name,
      coordinates: {
        x: Number(formatCoordinate(spot.coordinates.x)),
        y: Number(formatCoordinate(spot.coordinates.y))
      },
      worldCoordinates: spot.worldCoordinates ?? null,
      localMappingStatus: override?.mappingStatus ?? null,
      verifiedAt: getDisplayedVerifiedAt(spot),
      mapping: {
        status: spot.mapping?.status ?? "미입력",
        basis: spot.mapping?.basis ?? "미입력",
        verifiedAt: spot.mapping?.verifiedAt ?? null
      }
    },
    null,
    2
  );
}

function getLocalMappingStatus(spotId) {
  const override = state.overrides[spotId];
  if (!override) return null;
  return override.mappingStatus ?? "좌표 보정 중";
}

function getDisplayedMappingStatus(spot) {
  return getLocalMappingStatus(spot.id) ?? spot.mapping?.status ?? "미입력";
}

function getDisplayedVerifiedAt(spot) {
  return state.overrides[spot.id]?.verifiedAt ?? spot.mapping?.verifiedAt ?? null;
}

function setSpotMappingStatus(spotId, mappingStatus) {
  const rawSpot = getRawSpotById(spotId);
  if (!rawSpot) return;

  const current = state.overrides[spotId] ?? {
    x: rawSpot.coordinates.x,
    y: rawSpot.coordinates.y
  };

  state.overrides[spotId] = {
    ...current,
    mappingStatus,
    verifiedAt: mappingStatus === "좌표 확정" ? new Date().toISOString().slice(0, 10) : null
  };

  saveOverrides();
  render();
}

async function importOverridesFromFile(file) {
  const text = await file.text();
  const parsed = JSON.parse(text);
  const imported = parseOverridesPayload(parsed);

  state.overrides = {
    ...state.overrides,
    ...imported
  };

  saveOverrides();
  render();
}

function parseTimeTokenToSeconds(token) {
  const parts = token.split(":").map(Number);
  if (parts.some(Number.isNaN)) return null;
  if (parts.length === 2) {
    return parts[0] * 60 + parts[1];
  }
  if (parts.length === 3) {
    return parts[0] * 3600 + parts[1] * 60 + parts[2];
  }
  return null;
}

function getCueStartSeconds(cue) {
  if (!cue) return null;
  const match = cue.match(/(\d{1,2}:\d{2}(?::\d{2})?)/);
  if (!match) return null;
  return parseTimeTokenToSeconds(match[1]);
}

function buildTimestampUrl(url, cue) {
  if (!url) return "";

  const seconds = getCueStartSeconds(cue);
  if (seconds === null) return url;

  try {
    const parsed = new URL(url);
    parsed.searchParams.set("t", String(seconds));
    return parsed.toString();
  } catch {
    return url;
  }
}

function getAllOverridesSnapshot() {
  const entries = Object.entries(state.overrides).map(([id, value]) => {
    const rawSpot = getRawSpotById(id);

    return {
      id,
      name: rawSpot?.name ?? id,
      coordinates: {
        x: Number(formatCoordinate(value.x)),
        y: Number(formatCoordinate(value.y))
      },
      mappingStatus: value.mappingStatus ?? "좌표 보정 중",
      verifiedAt: value.verifiedAt ?? null
    };
  });

  return JSON.stringify(
    {
      exportedAt: new Date().toISOString(),
      source: "crimson-desert-map-overrides-v1",
      overrides: entries
    },
    null,
    2
  );
}

function renderHeroStats(visibleSpots) {
  const categoriesInView = new Set(visibleSpots.map((spot) => spot.category));
  const sourceBackedCount = visibleSpots.filter((spot) => (spot.sources ?? []).length > 0).length;
  const itemCount = visibleSpots.reduce((count, spot) => count + (spot.items?.length ?? 0), 0);
  const worldAnchoredCount = visibleSpots.filter((spot) => Boolean(spot.worldCoordinates)).length;
  const provisionalCount = visibleSpots.length - worldAnchoredCount;
  const confirmedCount = Object.values(state.overrides).filter((override) => override.mappingStatus === "좌표 확정").length;

  const cards = [
    { label: "표시 중인 포인트", value: `${visibleSpots.length}개` },
    { label: "포함 카테고리", value: `${categoriesInView.size}종` },
    { label: "월드 좌표 반영", value: `${worldAnchoredCount}곳` },
    { label: "연구용 임시 포인트", value: `${provisionalCount}곳` },
    { label: "정리된 아이템", value: `${itemCount}개` },
    { label: "출처 연결 포인트", value: `${sourceBackedCount}곳` },
    { label: "좌표 확정 마커", value: `${confirmedCount}건` }
  ];

  elements.heroStats.innerHTML = cards
    .map(
      (card) => `
        <article class="stat-card">
          <span class="stat-label">${card.label}</span>
          <strong class="stat-value">${card.value}</strong>
        </article>
      `
    )
    .join("");
}

function renderCategoryChips() {
  elements.categoryChips.innerHTML = data.categories
    .map((category) => {
      const activeClass = category.id === state.category ? "active" : "";

      return `
        <button
          type="button"
          class="chip ${activeClass}"
          data-category="${category.id}"
        >
          ${category.label}
        </button>
      `;
    })
    .join("");
}

function renderRegionSelect() {
  const regions = getAvailableRegions();

  if (!regions.includes(state.region)) {
    state.region = "전체 지역";
  }

  elements.regionSelect.innerHTML = regions
    .map(
      (region) => `
        <option value="${region}" ${region === state.region ? "selected" : ""}>
          ${region}
        </option>
      `
    )
    .join("");
}

function renderMappingToggle() {
  elements.mappingToggle.textContent = state.mappingMode ? "보정 모드 켜짐" : "보정 모드 켜기";
  elements.mappingToggle.classList.toggle("active", state.mappingMode);
  elements.mappingToggle.setAttribute("aria-pressed", String(state.mappingMode));
  elements.mapBoard.classList.toggle("mapping-mode", state.mappingMode);
  elements.exportOverrides.textContent = Object.keys(state.overrides).length > 0
    ? `보정 JSON 복사 (${Object.keys(state.overrides).length})`
    : "보정 JSON 복사";
  elements.importOverrides.textContent = "보정 JSON 불러오기";
}

function renderLegend() {
  const categoryLegend = data.categories
    .filter((category) => category.id !== "all")
    .map(
      (category) => `
        <span>
          <i class="legend-dot ${category.id}"></i>
          ${category.label}
        </span>
      `
    )
    .join("");

  const statusLegend = `
    <span>
      <i class="legend-ring"></i>
      월드 좌표 반영
    </span>
    <span>
      <i class="legend-dash"></i>
      영상 기반 임시 좌표
    </span>
  `;

  elements.legend.innerHTML = categoryLegend + statusLegend;
}

function renderMapMarkers(visibleSpots) {
  if (visibleSpots.length === 0) {
    elements.mapMarkers.innerHTML = `
      <div class="detail-empty">
        현재 필터에 맞는 포인트가 없습니다.<br>
        검색어를 줄이거나 지역 필터를 바꿔보세요.
      </div>
    `;
    return;
  }

  elements.mapMarkers.innerHTML = visibleSpots
    .map((spot) => {
      const activeClass = spot.id === state.selectedSpotId ? "active" : "";
      const mappingClass = spot.worldCoordinates ? "mapped world-verified" : "provisional";
      const overrideClass = state.overrides[spot.id] ? "edited" : "";
      const localStatusClass = getLocalMappingStatus(spot.id) === "좌표 확정" ? "confirmed" : "";

      return `
        <button
          type="button"
          class="map-marker ${spot.category} ${mappingClass} ${overrideClass} ${localStatusClass} ${activeClass}"
          data-spot-id="${spot.id}"
          style="left: ${spot.coordinates.x}%; top: ${spot.coordinates.y}%"
          title="${spot.name}"
          aria-label="${spot.name}"
        >
          <span>${spot.region}</span>
          <strong>${spot.name}</strong>
        </button>
      `;
    })
    .join("");
}

function renderItemsSection(spot) {
  const items = spot.items ?? [];

  if (items.length === 0) {
    return `
      <section class="detail-section">
        <h4>대상 아이템</h4>
        <p class="empty-note">아직 아이템 데이터가 입력되지 않았습니다.</p>
      </section>
    `;
  }

  return `
    <section class="detail-section">
      <h4>대상 아이템</h4>
      <div class="item-stack">
        ${items
          .map(
            (item) => `
              <article class="item-card">
                <div class="item-head">
                  <div>
                    <h5>${item.name}</h5>
                    <p>${item.type} · ${item.rarity}</p>
                  </div>
                </div>

                <div class="detail-subsection">
                  <h6>능력 / 효과</h6>
                  <ul>
                    ${(item.effects ?? []).map((effect) => `<li>${effect}</li>`).join("")}
                  </ul>
                </div>

                <div class="detail-subsection">
                  <h6>능력치 / 활용</h6>
                  <ul>
                    ${(item.stats ?? []).map((stat) => `<li>${stat}</li>`).join("")}
                  </ul>
                </div>

                <div class="detail-subsection">
                  <h6>획득조건</h6>
                  <ul>
                    ${(item.acquisitionConditions ?? []).map((condition) => `<li>${condition}</li>`).join("")}
                  </ul>
                </div>

                <div class="detail-subsection">
                  <h6>선행조건</h6>
                  <ul>
                    ${(item.prerequisites ?? []).map((prerequisite) => `<li>${prerequisite}</li>`).join("")}
                  </ul>
                </div>
              </article>
            `
          )
          .join("")}
      </div>
    </section>
  `;
}

function renderMappingSection(spot) {
  const mapping = spot.mapping ?? {};
  const hasOverride = Boolean(state.overrides[spot.id]);
  const localMappingStatus = getLocalMappingStatus(spot.id);
  const displayedVerifiedAt = getDisplayedVerifiedAt(spot);
  const coordinateSnapshot = getCoordinateSnapshot(spot);
  const worldCoordinatesMarkup = spot.worldCoordinates
    ? `
      <div class="detail-grid">
        <span class="pill actual">월드 좌표: ${formatWorldCoordinate(spot.worldCoordinates.lat)}, ${formatWorldCoordinate(spot.worldCoordinates.lng)}</span>
        <span class="pill">매칭 항목: ${spot.worldCoordinates.matchedLabel ?? "미입력"}</span>
        <span class="pill">좌표 근거: ${spot.worldCoordinates.sourceLabel ?? "미입력"}</span>
      </div>
      <p class="mapping-callout">이 포인트는 공개 커뮤니티 맵 좌표를 현재 파이웰 전체지도에 투영한 값입니다.</p>
    `
    : `
      <p class="mapping-callout">아직 실제 월드 좌표가 확인되지 않았습니다. 현재 마커는 유튜브 챕터와 설명문을 바탕으로 둔 연구용 좌표입니다.</p>
    `;

  return `
    <section class="detail-section">
      <h4>지도화 상태</h4>
      <div class="detail-grid">
        <span class="pill">상태: ${mapping.status ?? "미입력"}</span>
        <span class="pill">근거: ${mapping.basis ?? "미입력"}</span>
        <span class="pill">보정여부: ${hasOverride ? "로컬 보정됨" : "원본 좌표"}</span>
        <span class="pill">로컬 검수: ${localMappingStatus ?? "미지정"}</span>
        <span class="pill">확인일: ${displayedVerifiedAt ?? "-"}</span>
        <span class="pill">투영 좌표: ${formatCoordinate(spot.coordinates.x)}, ${formatCoordinate(spot.coordinates.y)}</span>
      </div>
      <p>${mapping.note ?? "지도화 메모가 없습니다."}</p>
      ${worldCoordinatesMarkup}
    </section>

    <section class="detail-section">
      <h4>좌표 보정 도구</h4>
      <p>${state.mappingMode ? "보정 모드가 켜져 있습니다. 마커를 드래그하거나 슬라이더를 움직이면 로컬에 저장됩니다." : "보정 모드를 켜면 마커를 드래그하거나 슬라이더로 좌표를 미세 조정할 수 있습니다."}</p>
      <div class="range-stack">
        <label class="range-field">
          <span>X 좌표 <strong>${formatCoordinate(spot.coordinates.x)}</strong></span>
          <input type="range" min="0" max="100" step="0.1" value="${spot.coordinates.x}" data-axis="x">
        </label>
        <label class="range-field">
          <span>Y 좌표 <strong>${formatCoordinate(spot.coordinates.y)}</strong></span>
          <input type="range" min="0" max="100" step="0.1" value="${spot.coordinates.y}" data-axis="y">
        </label>
      </div>
      <div class="editor-actions">
        <button type="button" class="editor-button" data-action="copy-json">현재 좌표 JSON 복사</button>
        <button type="button" class="editor-button" data-action="confirm-spot">현재 좌표 확정 처리</button>
        <button type="button" class="editor-button ghost" data-action="mark-review">검수 중으로 되돌리기</button>
        <button type="button" class="editor-button" data-action="reset-spot">이 항목 초기화</button>
        <button type="button" class="editor-button ghost" data-action="reset-all">전체 보정 초기화</button>
      </div>
      <pre class="json-preview">${coordinateSnapshot}</pre>
    </section>
  `;
}

function renderSourcesSection(spot) {
  const sources = spot.sources ?? [];

  if (sources.length === 0) {
    return `
      <section class="detail-section">
        <h4>출처 영상</h4>
        <p class="empty-note">아직 연결된 영상 출처가 없습니다.</p>
      </section>
    `;
  }

  return `
    <section class="detail-section">
      <h4>출처 영상</h4>
      <div class="source-stack">
        ${sources
          .map((source) => {
            const timestampUrl = buildTimestampUrl(source.url, source.cue);
            const linkMarkup = source.url
              ? `
                <div class="source-actions">
                  <a class="source-link" href="${source.url}" target="_blank" rel="noreferrer">영상 열기</a>
                  <a class="source-link alt" href="${timestampUrl}" target="_blank" rel="noreferrer">구간 열기</a>
                </div>
              `
              : `<span class="source-link muted">링크 입력 예정</span>`;

            return `
              <article class="source-card">
                <div class="source-head">
                  <div>
                    <h5>${source.title}</h5>
                    <p>${source.creator}</p>
                  </div>
                  ${linkMarkup}
                </div>
                <p><strong>확인 구간:</strong> ${source.cue}</p>
                <p><strong>근거:</strong> ${source.evidence}</p>
                <p><strong>메모:</strong> ${source.note}</p>
              </article>
            `;
          })
          .join("")}
      </div>
    </section>
  `;
}

function renderDetailCard(spot) {
  if (!spot) {
    elements.detailCard.innerHTML = `
      <div class="detail-empty">
        선택된 파밍 포인트가 없습니다.
      </div>
    `;
    return;
  }

  const category = getCategoryMeta(spot.category);
  const verification = spot.verification ?? {};
  const worldCoordinatePill = spot.worldCoordinates
    ? `<span class="pill actual">월드 좌표: ${formatWorldCoordinate(spot.worldCoordinates.lat)}, ${formatWorldCoordinate(spot.worldCoordinates.lng)}</span>`
    : `<span class="pill">월드 좌표: 미검증</span>`;

  elements.detailCard.innerHTML = `
    <div class="detail-head">
      <div class="meta-row">
        <span class="pill">${category.label}</span>
        <span class="pill">${spot.region}</span>
        <span class="pill">${spot.difficulty}</span>
      </div>
      <h3>${spot.name}</h3>
      <p>${spot.summary}</p>
      <div class="detail-grid">
        <span class="pill">권장: ${spot.recommended}</span>
        <span class="pill">리젠: ${spot.respawn}</span>
        <span class="pill">검증상태: ${verification.status ?? "미입력"}</span>
        <span class="pill">지도상태: ${getDisplayedMappingStatus(spot)}</span>
        <span class="pill">신뢰도: ${verification.confidence ?? "미입력"}</span>
        <span class="pill">확인일: ${verification.lastChecked ?? "미입력"}</span>
        <span class="pill">투영 좌표: ${formatCoordinate(spot.coordinates.x)}, ${formatCoordinate(spot.coordinates.y)}</span>
        ${worldCoordinatePill}
      </div>
    </div>

    ${renderItemsSection(spot)}
    ${renderMappingSection(spot)}

    <section class="detail-section">
      <h4>위치 설명</h4>
      <p>${spot.locationGuide}</p>
    </section>

    <section class="detail-section">
      <h4>추천 동선</h4>
      <ol>
        ${spot.route.map((step) => `<li>${step}</li>`).join("")}
      </ol>
    </section>

    <section class="detail-section">
      <h4>주의할 점</h4>
      <ul>
        ${spot.cautions.map((note) => `<li>${note}</li>`).join("")}
      </ul>
    </section>

    ${renderSourcesSection(spot)}
  `;
}

function renderSpotList(visibleSpots) {
  elements.resultsCount.textContent = `${visibleSpots.length}개의 포인트가 표시되고 있습니다.`;

  if (visibleSpots.length === 0) {
    elements.spotList.innerHTML = `
      <div class="list-empty">
        검색 결과가 없습니다.
      </div>
    `;
    return;
  }

  elements.spotList.innerHTML = visibleSpots
    .map((spot) => {
      const category = getCategoryMeta(spot.category);
      const activeClass = spot.id === state.selectedSpotId ? "active" : "";
      const itemNames = getItemNames(spot);
      const verificationStatus = spot.verification?.status ?? "미입력";
      const mappingStatus = getDisplayedMappingStatus(spot);
      const coordinateStatus = spot.worldCoordinates ? "월드 좌표 반영" : "영상 임시 좌표";

      return `
        <article class="spot-card ${activeClass}" data-spot-id="${spot.id}" tabindex="0">
          <div class="spot-meta">
            <span class="category-tag">
              <i class="category-dot" style="background:${category.color}"></i>
              ${category.label}
            </span>
            <span class="pill">${spot.region}</span>
            <span class="pill">${verificationStatus}</span>
            <span class="pill">${mappingStatus}</span>
            <span class="pill">${coordinateStatus}</span>
          </div>
          <div>
            <h3>${spot.name}</h3>
            <p>${spot.summary}</p>
          </div>
          <div class="resource-row">
            ${itemNames.map((name) => `<span class="resource-chip">${name}</span>`).join("")}
          </div>
        </article>
      `;
    })
    .join("");
}

function render() {
  const visibleSpots = getVisibleSpots();
  ensureSelectedSpot(visibleSpots);

  renderMeta();
  renderHeroStats(visibleSpots);
  renderCategoryChips();
  renderRegionSelect();
  renderMappingToggle();
  renderLegend();
  renderMapMarkers(visibleSpots);
  renderSpotList(visibleSpots);

  const selectedSpot = visibleSpots.find((spot) => spot.id === state.selectedSpotId) ?? getEffectiveSpot(getRawSpotById(state.selectedSpotId) ?? data.spots[0]);
  renderDetailCard(selectedSpot ?? null);
}

function selectSpot(spotId) {
  state.selectedSpotId = spotId;
  render();
}

function updateSpotPositionFromPointer(event) {
  if (!state.mappingMode || !state.draggingSpotId) return;

  const rect = elements.mapBoard.getBoundingClientRect();
  const x = clamp(((event.clientX - rect.left) / rect.width) * 100, 0, 100);
  const y = clamp(((event.clientY - rect.top) / rect.height) * 100, 0, 100);

  state.overrides[state.draggingSpotId] = { x, y };
  render();
}

function attachEvents() {
  elements.searchInput.addEventListener("input", (event) => {
    state.search = event.target.value;
    render();
  });

  elements.categoryChips.addEventListener("click", (event) => {
    const button = event.target.closest("[data-category]");
    if (!button) return;
    state.category = button.dataset.category;
    render();
  });

  elements.regionSelect.addEventListener("change", (event) => {
    state.region = event.target.value;
    render();
  });

  elements.mappingToggle.addEventListener("click", () => {
    state.mappingMode = !state.mappingMode;
    state.draggingSpotId = null;
    render();
  });

  elements.exportOverrides.addEventListener("click", async () => {
    const text = getAllOverridesSnapshot();
    const copied = await copyText(text);
    if (!copied) {
      window.alert("보정 JSON 복사에 실패했습니다.");
    }
  });

  elements.importOverrides.addEventListener("click", () => {
    elements.importOverridesInput.click();
  });

  elements.importOverridesInput.addEventListener("change", async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      await importOverridesFromFile(file);
    } catch {
      window.alert("보정 JSON 불러오기에 실패했습니다. 파일 형식을 확인해주세요.");
    } finally {
      event.target.value = "";
    }
  });

  elements.mapMarkers.addEventListener("click", (event) => {
    const button = event.target.closest("[data-spot-id]");
    if (!button) return;
    selectSpot(button.dataset.spotId);
  });

  elements.mapMarkers.addEventListener("pointerdown", (event) => {
    if (!state.mappingMode) return;

    const button = event.target.closest("[data-spot-id]");
    if (!button) return;

    event.preventDefault();
    state.draggingSpotId = button.dataset.spotId;
    state.selectedSpotId = button.dataset.spotId;
    updateSpotPositionFromPointer(event);
  });

  window.addEventListener("pointermove", (event) => {
    if (!state.draggingSpotId) return;
    updateSpotPositionFromPointer(event);
  });

  window.addEventListener("pointerup", () => {
    if (!state.draggingSpotId) return;
    saveOverrides();
    state.draggingSpotId = null;
    render();
  });

  elements.spotList.addEventListener("click", (event) => {
    const card = event.target.closest("[data-spot-id]");
    if (!card) return;
    selectSpot(card.dataset.spotId);
  });

  elements.spotList.addEventListener("keydown", (event) => {
    if (event.key !== "Enter" && event.key !== " ") return;

    const card = event.target.closest("[data-spot-id]");
    if (!card) return;

    event.preventDefault();
    selectSpot(card.dataset.spotId);
  });

  elements.detailCard.addEventListener("input", (event) => {
    const input = event.target.closest("[data-axis]");
    if (!input || !state.selectedSpotId) return;

    updateCoordinateOverride(state.selectedSpotId, input.dataset.axis, input.value);
  });

  elements.detailCard.addEventListener("click", async (event) => {
    const button = event.target.closest("[data-action]");
    if (!button || !state.selectedSpotId) return;

    if (button.dataset.action === "reset-spot") {
      resetSpotOverride(state.selectedSpotId);
      return;
    }

    if (button.dataset.action === "reset-all") {
      resetAllOverrides();
      return;
    }

    if (button.dataset.action === "copy-json") {
      const spot = getAllSpots().find((entry) => entry.id === state.selectedSpotId);
      if (!spot) return;

      const copied = await copyText(getCoordinateSnapshot(spot));
      if (!copied) {
        window.alert("복사에 실패했습니다. 아래 JSON 미리보기에서 직접 복사해주세요.");
      }
      return;
    }

    if (button.dataset.action === "confirm-spot") {
      setSpotMappingStatus(state.selectedSpotId, "좌표 확정");
      return;
    }

    if (button.dataset.action === "mark-review") {
      setSpotMappingStatus(state.selectedSpotId, "좌표 보정 중");
    }
  });
}

attachEvents();
render();
