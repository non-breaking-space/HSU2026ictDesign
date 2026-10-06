/* =========================================================
   1. 포스터 데이터 — 여기만 고치면 내용이 바뀝니다.
   author : 왼쪽 목록에 나오는 이름
   text   : 포스터 문구 (\n 으로 줄바꿈)
   color  : orange | green | lavender | peach | blue | magenta | cream
   ========================================================= */
const POSTERS = [
  { author: "김민희", text: "작품 제목을\n여기에", color: "orange" },
  { author: "김은비", text: "작품 제목을\n여기에", color: "green" },
  { author: "박경일", text: "작품 제목을\n여기에", color: "lavender" },
  { author: "배하은", text: "작품 제목을\n여기에", color: "peach" },
  { author: "이유림", text: "작품 제목을\n여기에", color: "blue" },
  { author: "장세희", text: "작품 제목을\n여기에", color: "magenta" },
  { author: "허희원", text: "작품 제목을\n여기에", color: "cream" },
  { author: "김민경", text: "작품 제목을\n여기에", color: "orange" },
  { author: "김승환", text: "작품 제목을\n여기에", color: "green" },
  { author: "박세은", text: "작품 제목을\n여기에", color: "lavender" },
  { author: "이수인", text: "작품 제목을\n여기에", color: "peach" },
  { author: "임예지", text: "작품 제목을\n여기에", color: "blue" },
  { author: "장혜진", text: "작품 제목을\n여기에", color: "magenta" },
  { author: "천인애", text: "작품 제목을\n여기에", color: "cream" },
  { author: "탁민지", text: "작품 제목을\n여기에", color: "orange" },
  { author: "홍경원", text: "작품 제목을\n여기에", color: "green" },
  { author: "황수현", text: "작품 제목을\n여기에", color: "lavender" },
  { author: "명은서", text: "작품 제목을\n여기에", color: "peach" },
  { author: "이지선", text: "작품 제목을\n여기에", color: "blue" },
  { author: "임지예", text: "작품 제목을\n여기에", color: "magenta" },
  { author: "한진영", text: "작품 제목을\n여기에", color: "cream" },
  { author: "민채경", text: "작품 제목을\n여기에", color: "orange" },
  { author: "박선영", text: "작품 제목을\n여기에", color: "green" },
  { author: "황희망", text: "작품 제목을\n여기에", color: "lavender" },
  { author: "김세령", text: "작품 제목을\n여기에", color: "peach" },
  { author: "서동수", text: "작품 제목을\n여기에", color: "blue" },
  { author: "송정민", text: "작품 제목을\n여기에", color: "magenta" }
];

/* 열마다 시작 높이를 다르게 해서 엇갈린 배치를 만듭니다. */
const COLUMN_OFFSETS = [48, 0, 96, 24, 64, 12];

/* =========================================================
   2. 요소 가져오기
   ========================================================= */
const wall = document.getElementById("wall");
const nameList = document.getElementById("nameList");
const viewer = document.getElementById("viewer");
const viewerPoster = document.getElementById("viewerPoster");
const viewerText = document.getElementById("viewerText");
const viewerAuthor = document.getElementById("viewerAuthor");
const viewerClose = document.getElementById("viewerClose");

let currentColumnCount = 0;

/* 박스 순서를 무작위로 섞습니다. (새로고침할 때마다 달라짐)
   왼쪽 이름 목록은 원래 순서 그대로 둡니다. */
function shuffle(list) {
  const result = list.slice();
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = result[i];
    result[i] = result[j];
    result[j] = temp;
  }
  return result;
}

const ORDER = shuffle(POSTERS.map(function (item, index) { return index; }));

/* =========================================================
   3. 화면 너비에 따른 열 개수
   ========================================================= */
function getColumnCount() {
  const width = window.innerWidth;
  if (width <= 480) return 2;
  if (width <= 720) return 2;
  if (width <= 1000) return 3;
  if (width <= 1400) return 4;
  return 5;
}

/* =========================================================
   4. 이름 목록 그리기
   ========================================================= */
function renderNames() {
  nameList.innerHTML = "";

  POSTERS.forEach(function (item, index) {
    const li = document.createElement("li");
    const button = document.createElement("button");

    button.type = "button";
    button.className = "name-item";
    button.textContent = item.author;
    button.dataset.index = index;

    button.addEventListener("mouseenter", function () { highlight(index); });
    button.addEventListener("mouseleave", clearHighlight);
    button.addEventListener("focus", function () { highlight(index); });
    button.addEventListener("blur", clearHighlight);
    button.addEventListener("click", function () {
      const target = wall.querySelector('.poster[data-index="' + index + '"]');
      if (target) {
        target.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    });

    li.appendChild(button);
    nameList.appendChild(li);
  });
}

/* =========================================================
   5. 포스터 벽 그리기
   ========================================================= */
function renderWall() {
  const columnCount = getColumnCount();
  if (columnCount === currentColumnCount) return;
  currentColumnCount = columnCount;

  wall.innerHTML = "";

  const columns = [];
  for (let i = 0; i < columnCount; i++) {
    const column = document.createElement("div");
    column.className = "wall-column";
    column.style.marginTop = (columnCount > 2 ? COLUMN_OFFSETS[i] : i * 40) + "px";
    wall.appendChild(column);
    columns.push(column);
  }

  ORDER.forEach(function (index, position) {
    const item = POSTERS[index];
    const poster = document.createElement("button");
    poster.type = "button";
    poster.className = "poster color-" + item.color;
    poster.dataset.index = index;

    const text = document.createElement("p");
    text.className = "poster-text";
    text.textContent = item.text;

    const author = document.createElement("p");
    author.className = "poster-author";
    author.textContent = item.author;

    poster.appendChild(text);
    poster.appendChild(author);

    poster.addEventListener("mouseenter", function () { markName(index, true); });
    poster.addEventListener("mouseleave", function () { markName(index, false); });
    poster.addEventListener("click", function () { openViewer(index); });

    columns[position % columnCount].appendChild(poster);

    /* 순서대로 하나씩 켜지는 등장 효과 */
    setTimeout(function () {
      poster.classList.add("is-shown");
    }, 60 * position + 100);
  });
}

/* =========================================================
   6. 이름 ↔ 포스터 연결
   ========================================================= */
function highlight(index) {
  wall.classList.add("is-dimmed");
  const target = wall.querySelector('.poster[data-index="' + index + '"]');
  if (target) target.classList.add("is-active");
}

function clearHighlight() {
  wall.classList.remove("is-dimmed");
  const active = wall.querySelectorAll(".poster.is-active");
  active.forEach(function (el) { el.classList.remove("is-active"); });
}

function markName(index, isOn) {
  const button = nameList.querySelector('.name-item[data-index="' + index + '"]');
  if (!button) return;
  button.classList.toggle("is-active", isOn);
  if (isOn) {
    button.scrollIntoView({ block: "nearest", inline: "nearest" });
  }
}

/* =========================================================
   7. 확대 보기
   ========================================================= */
function openViewer(index) {
  const item = POSTERS[index];
  viewerPoster.className = "viewer-poster color-" + item.color;
  viewerText.textContent = item.text;
  viewerAuthor.textContent = item.author;
  viewer.classList.add("is-open");
  viewer.setAttribute("aria-hidden", "false");
}

function closeViewer() {
  viewer.classList.remove("is-open");
  viewer.setAttribute("aria-hidden", "true");
}

viewerClose.addEventListener("click", closeViewer);

viewer.addEventListener("click", function (event) {
  if (event.target === viewer) closeViewer();
});

document.addEventListener("keydown", function (event) {
  if (event.key === "Escape") closeViewer();
});

/* =========================================================
   8. 시작
   ========================================================= */
let resizeTimer = null;
window.addEventListener("resize", function () {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(renderWall, 150);
});

renderNames();
renderWall();
