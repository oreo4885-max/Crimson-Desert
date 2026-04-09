const data = window.guideData;
const INITIAL_SPOT = data.spots.find((spot) => spot.worldCoordinates) ?? data.spots[0] ?? null;

const state = {
  search: "",
  category: "all",
  selectedSpotId: INITIAL_SPOT?.id ?? null
};

const elements = {
  appTitle: document.getElementById("appTitle"),
  appSubtitle: document.getElementById("appSubtitle"),
  searchInput: document.getElementById("searchInput"),
  mapSourceLink: document.getElementById("mapSourceLink"),
  worldImage: document.getElementById("worldImage"),
  worldMarkers: document.getElementById("worldMarkers"),
  resultsCount: document.getElementById("resultsCount"),
  legend: document.getElementById("legend"),
  focusPanel: document.getElementById("focusPanel")
};

function getCategoryMeta(categoryId) {
  return data.categories.find((category) => category.id === categoryId) ?? data.categories[0];
}

function getSpotById(spotId) {
  return data.spots.find((spot) => spot.id === spotId) ?? null;
}

function getPrimaryItem(spot) {
  return (spot.items ?? [])[0] ?? null;
}

function getDisplayName(spot) {
  return getPrimaryItem(spot)?.name ?? spot.name;
}

function compactText(value, limit = 44) {
  if (!value) return "-";

  const normalized = String(value).replace(/\s+/g, " ").trim();
  if (normalized.length <= limit) return normalized;
  return `${normalized.slice(0, limit - 1)}…`;
}

function formatWorldCoordinate(value) {
  return Number(value).toFixed(6);
}

function parseTimeTokenToSeconds(token) {
  const parts = token.split(":").map(Number);
  if (parts.some(Number.isNaN)) return null;
  if (parts.length === 2) return parts[0] * 60 + parts[1];
  if (parts.length === 3) return parts[0] * 3600 + parts[1] * 60 + parts[2];
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

function uniqueItems(values) {
  return [...new Set(values.filter(Boolean))];
}

function buildSearchHaystack(spot) {
  const primaryItem = getPrimaryItem(spot);

  return [
    spot.name,
    spot.region,
    spot.category,
    primaryItem?.name,
    ...(primaryItem?.effects ?? []),
    ...(primaryItem?.stats ?? []),
    ...(primaryItem?.acquisitionConditions ?? []),
    ...(primaryItem?.prerequisites ?? []),
    ...(spot.sources ?? []).flatMap((source) => [source.title, source.creator, source.evidence])
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
}

function getSearchMatchedSpots() {
  const keyword = state.search.trim().toLowerCase();

  return data.spots.filter((spot) => {
    if (!keyword) return true;
    return buildSearchHaystack(spot).includes(keyword);
  });
}

function getVisibleSpots() {
  return getSearchMatchedSpots().filter((spot) => {
    return state.category === "all" || spot.category === state.category;
  });
}

function syncSelectedSpot(visibleSpots) {
  if (visibleSpots.some((spot) => spot.id === state.selectedSpotId)) return;
  state.selectedSpotId = visibleSpots[0]?.id ?? null;
}

function getStatusLabel(spot) {
  return spot.worldCoordinates ? "월드 좌표 반영" : "영상 임시 좌표";
}

function getCoordinateLabel(spot) {
  if (spot.worldCoordinates) {
    return `${formatWorldCoordinate(spot.worldCoordinates.lat)}, ${formatWorldCoordinate(spot.worldCoordinates.lng)}`;
  }

  return `${Number(spot.coordinates.x).toFixed(1)} / ${Number(spot.coordinates.y).toFixed(1)}`;
}

function getTraitList(spot) {
  const primaryItem = getPrimaryItem(spot);
  return uniqueItems([...(primaryItem?.effects ?? []), ...(primaryItem?.stats ?? [])]).slice(0, 4);
}

function getNearbySpots(centerSpot, visibleSpots) {
  return visibleSpots
    .map((spot) => {
      const dx = spot.coordinates.x - centerSpot.coordinates.x;
      const dy = spot.coordinates.y - centerSpot.coordinates.y;

      return {
        spot,
        distance: Math.sqrt(dx * dx + dy * dy)
      };
    })
    .filter((entry) => entry.distance <= 18)
    .sort((left, right) => left.distance - right.distance)
    .map((entry) => entry.spot);
}

function renderMeta() {
  const meta = data.meta ?? {};
  const map = data.map ?? {};

  document.title = meta.title ?? "붉은사막 파밍 아틀라스";
  elements.appTitle.textContent = meta.title ?? "붉은사막 파밍 아틀라스";
  elements.appSubtitle.textContent = "점 hover로 아이템을 보고, 클릭하면 우측에서 확대 지도를 확인합니다.";

  if (map.image) {
    elements.worldImage.src = map.image;
    elements.worldImage.alt = map.alt ?? "붉은사막 파이웰 전체지도";
  }

  if (map.sourceUrl) {
    elements.mapSourceLink.href = map.sourceUrl;
    elements.mapSourceLink.textContent = map.sourceLabel ?? "원본 맵";
  }
}

function renderLegend(searchMatchedSpots) {
  const allCount = searchMatchedSpots.length;

  const buttons = data.categories.map((category) => {
    const count = category.id === "all"
      ? allCount
      : searchMatchedSpots.filter((spot) => spot.category === category.id).length;
    const activeClass = category.id === state.category ? "active" : "";
    const color = category.id === "all" ? "#f4ecdf" : category.color;

    return `
      <button
        type="button"
        class="legend-item ${activeClass}"
        data-category="${category.id}"
      >
        <i class="legend-dot" style="--marker-color:${color}"></i>
        <span>${category.label}</span>
        <strong>${count}</strong>
      </button>
    `;
  });

  elements.legend.innerHTML = buttons.join("");
}

function renderWorldMarkers(visibleSpots) {
  if (visibleSpots.length === 0) {
    elements.worldMarkers.innerHTML = `
      <div class="map-empty">
        검색 결과가 없습니다.
      </div>
    `;
    return;
  }

  elements.worldMarkers.innerHTML = visibleSpots
    .map((spot) => {
      const category = getCategoryMeta(spot.category);
      const selectedClass = spot.id === state.selectedSpotId ? "selected" : "";
      const statusClass = spot.worldCoordinates ? "verified" : "provisional";
      const tooltipTitle = compactText(getDisplayName(spot), 32);
      const tooltipSubline = spot.name === getDisplayName(spot)
        ? compactText(spot.region, 36)
        : compactText(spot.name, 36);

      return `
        <button
          type="button"
          class="world-marker ${selectedClass} ${statusClass}"
          data-spot-id="${spot.id}"
          style="left:${spot.coordinates.x}%; top:${spot.coordinates.y}%; --marker-color:${category.color}"
          title="${tooltipTitle}"
          aria-label="${tooltipTitle}"
        >
          <span class="marker-tooltip">
            <strong>${tooltipTitle}</strong>
            <em>${tooltipSubline}</em>
          </span>
        </button>
      `;
    })
    .join("");
}

function renderSourceLinks(spot) {
  const sources = (spot.sources ?? []).slice(0, 2);

  if (sources.length === 0) {
    return `<span class="mini-note">출처 없음</span>`;
  }

  return sources
    .map((source) => {
      const timestampUrl = buildTimestampUrl(source.url, source.cue);

      return `
        <div class="source-actions">
          <span class="source-creator">${compactText(source.creator, 18)}</span>
          <a class="overlay-link" href="${source.url}" target="_blank" rel="noreferrer">영상</a>
          <a class="overlay-link alt" href="${timestampUrl}" target="_blank" rel="noreferrer">구간</a>
        </div>
      `;
    })
    .join("");
}

function renderFocusPanel(selectedSpot, visibleSpots) {
  if (!selectedSpot) {
    elements.focusPanel.innerHTML = `
      <div class="focus-empty">
        표시할 포인트가 없습니다.
      </div>
    `;
    return;
  }

  const category = getCategoryMeta(selectedSpot.category);
  const primaryItem = getPrimaryItem(selectedSpot);
  const displayName = getDisplayName(selectedSpot);
  const acquisition = compactText(primaryItem?.acquisitionConditions?.[0] ?? selectedSpot.route?.[0] ?? "-", 50);
  const prerequisite = compactText(primaryItem?.prerequisites?.[0] ?? selectedSpot.cautions?.[0] ?? "-", 50);
  const traits = getTraitList(selectedSpot);
  const nearbySpots = getNearbySpots(selectedSpot, visibleSpots);
  const zoom = selectedSpot.worldCoordinates ? 3.4 : 3;
  const canvasLeft = 50 - selectedSpot.coordinates.x * zoom;
  const canvasTop = 50 - selectedSpot.coordinates.y * zoom;

  elements.focusPanel.innerHTML = `
    <div class="focus-head">
      <div>
        <p class="eyebrow">Detail Zoom</p>
        <h2>${displayName}</h2>
      </div>
      <span class="focus-status ${selectedSpot.worldCoordinates ? "verified" : "provisional"}">${getStatusLabel(selectedSpot)}</span>
    </div>

    <div class="focus-stage">
      <div
        class="focus-canvas"
        style="width:${zoom * 100}%; height:${zoom * 100}%; left:${canvasLeft}%; top:${canvasTop}%;"
      >
        <img class="focus-image" src="${data.map?.image ?? "assets/pywel-main-world-z11.jpg"}" alt="${data.map?.alt ?? "붉은사막 파이웰 전체지도"}" draggable="false">
        <div class="focus-marker-layer">
          ${nearbySpots
            .map((spot) => {
              const nearbyCategory = getCategoryMeta(spot.category);
              const selectedClass = spot.id === selectedSpot.id ? "selected" : "";

              return `
                <button
                  type="button"
                  class="focus-marker ${selectedClass}"
                  data-spot-id="${spot.id}"
                  style="left:${spot.coordinates.x}%; top:${spot.coordinates.y}%; --marker-color:${nearbyCategory.color}"
                  aria-label="${compactText(getDisplayName(spot), 30)}"
                ></button>
              `;
            })
            .join("")}
        </div>
      </div>

      <div class="focus-reticle"></div>

      <article class="focus-overlay">
        <div class="overlay-top">
          <span class="overlay-category" style="--marker-color:${category.color}">${category.label}</span>
          <span class="overlay-spot">${compactText(selectedSpot.region, 18)}</span>
        </div>

        <h3>${displayName}</h3>
        <p class="overlay-subtitle">${compactText(selectedSpot.name, 42)}</p>

        <div class="overlay-grid">
          <div class="overlay-cell">
            <span>권장</span>
            <strong>${compactText(selectedSpot.recommended, 22)}</strong>
          </div>
          <div class="overlay-cell">
            <span>좌표</span>
            <strong>${compactText(getCoordinateLabel(selectedSpot), 24)}</strong>
          </div>
          <div class="overlay-cell wide">
            <span>획득</span>
            <strong>${acquisition}</strong>
          </div>
          <div class="overlay-cell wide">
            <span>선행</span>
            <strong>${prerequisite}</strong>
          </div>
        </div>

        <div class="trait-row">
          ${traits.length > 0 ? traits.map((trait) => `<span class="trait-chip">${compactText(trait, 28)}</span>`).join("") : `<span class="mini-note">능력치 입력 대기</span>`}
        </div>

        <div class="source-row">
          ${renderSourceLinks(selectedSpot)}
        </div>
      </article>
    </div>
  `;
}

function render() {
  renderMeta();

  const searchMatchedSpots = getSearchMatchedSpots();
  const visibleSpots = getVisibleSpots();
  syncSelectedSpot(visibleSpots);

  const selectedSpot = visibleSpots.find((spot) => spot.id === state.selectedSpotId) ?? null;

  renderLegend(searchMatchedSpots);
  renderWorldMarkers(visibleSpots);
  renderFocusPanel(selectedSpot, visibleSpots);

  elements.resultsCount.textContent = `${visibleSpots.length}개 포인트`;
}

function attachEvents() {
  elements.searchInput.addEventListener("input", (event) => {
    state.search = event.target.value;
    render();
  });

  elements.legend.addEventListener("click", (event) => {
    const button = event.target.closest("[data-category]");
    if (!button) return;

    const nextCategory = button.dataset.category;
    state.category = nextCategory === state.category ? "all" : nextCategory;
    render();
  });

  elements.worldMarkers.addEventListener("click", (event) => {
    const button = event.target.closest("[data-spot-id]");
    if (!button) return;

    state.selectedSpotId = button.dataset.spotId;
    render();
  });

  elements.focusPanel.addEventListener("click", (event) => {
    const button = event.target.closest("[data-spot-id]");
    if (!button) return;

    state.selectedSpotId = button.dataset.spotId;
    render();
  });
}

attachEvents();
render();
