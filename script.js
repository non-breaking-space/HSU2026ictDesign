/* =========================================================
   1. 감상평 데이터 — 여기만 고치면 내용이 바뀝니다.
   author : 하단 목록에 나오는 이름
   text   : 졸업 감상평 (\n 으로 줄바꿈)
   color  : orange | green | lavender | peach | blue | magenta | cream
   ========================================================= */
const POSTERS = [
  { author: "김민희", text: "끝이 아니라\n다음 장을\n접는 중입니다.", color: "orange" },
  { author: "김은비", text: "밤마다 켜 둔\n모니터 불빛이\n나를 키웠다.", color: "green" },
  { author: "박경일", text: "잘 모르겠다는\n말을 가장 많이\n배운 4년.", color: "lavender" },
  { author: "배하은", text: "퇴근하고 등교하던\n저녁들이\n벌써 그립다.", color: "peach" },
  { author: "이유림", text: "서툴렀기에\n더 오래\n기억될 시간.", color: "blue" },
  { author: "장세희", text: "마감은 지나가고\n사람은\n남았습니다.", color: "magenta" },
  { author: "허희원", text: "한 번 더 고치자던\n그 말이\n나를 만들었다.", color: "cream" },
  { author: "김민경", text: "처음 접은 선이\n삐뚤어도\n모양은 나온다.", color: "orange" },
  { author: "김승환", text: "함께여서\n끝까지\n올 수 있었다.", color: "green" },
  { author: "박세은", text: "수고했다,\n그리고\n고맙다.", color: "lavender" },
  { author: "이수인", text: "어디로 펼쳐질지\n몰라서\n더 설렌다.", color: "peach" },
  { author: "임예지", text: "밤공기와 커피,\n그리고\n우리.", color: "blue" },
  { author: "장혜진", text: "틀려도 괜찮다는 걸\n여기서\n배웠습니다.", color: "magenta" },
  { author: "천인애", text: "작은 화면 속에\n큰 마음을\n담았다.", color: "cream" },
  { author: "탁민지", text: "천천히 와도\n결국\n도착한다.", color: "orange" },
  { author: "홍경원", text: "네 번의 계절을\n네 번 접어\n여기까지.", color: "green" },
  { author: "황수현", text: "질문이 많아진 만큼\n나도\n자랐다.", color: "lavender" },
  { author: "명은서", text: "좋아하는 일을\n계속 좋아할\n용기.", color: "peach" },
  { author: "이지선", text: "포기하지 않은\n나에게\n박수를.", color: "blue" },
  { author: "임지예", text: "이제 문을\n열고 나갈\n차례.", color: "magenta" },
  { author: "한진영", text: "함께 밤을 샌\n이름들을\n잊지 않겠다.", color: "cream" },
  { author: "민채경", text: "완벽보다\n완성을\n배웠다.", color: "orange" },
  { author: "박선영", text: "디자인은 결국\n사람을 향한다는\n것.", color: "green" },
  { author: "황희망", text: "다음에도\n나는 나를\n믿어볼게.", color: "lavender" },
  { author: "김세령", text: "고민의 흔적이\n곧\n나의 작업.", color: "peach" },
  { author: "서동수", text: "늦은 시작은\n없다는 걸\n증명했다.", color: "blue" },
  { author: "송정민", text: "안녕,\n그리고\n또 만나요.", color: "magenta" }
];

/* 열마다 시작 높이를 다르게 해서 엇갈린 배치를 만듭니다. */
const COLUMN_OFFSETS = [48, 0, 96, 24, 64, 12];

/* =========================================================
   2. 요소 가져오기
   ========================================================= */
const wall = document.getElementById("wall");
const nameList = document.getElementById("nameList");

/* 펼쳐 둔 박스 번호 — 창 크기를 바꿔 다시 그려도 유지됩니다. */
const opened = new Set();

let currentColumnCount = 0;

/* 박스 순서를 무작위로 섞습니다. (새로고침할 때마다 달라짐)
   하단 이름 목록은 원래 순서 그대로 둡니다. */
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
        setOpen(index, true);
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

    /* 안쪽: 감상평 */
    const inner = document.createElement("div");
    inner.className = "poster-inner";

    const text = document.createElement("p");
    text.className = "poster-text";
    text.textContent = item.text;

    const author = document.createElement("p");
    author.className = "poster-author";
    author.textContent = item.author;

    inner.appendChild(text);
    inner.appendChild(author);
    poster.appendChild(inner);

    /* 덮개: 삼각형 날개 네 장 */
    ["top", "right", "bottom", "left"].forEach(function (side) {
      const flap = document.createElement("span");
      flap.className = "poster-flap flap-" + side;
      poster.appendChild(flap);
    });

    /* 접는 선 + 가운데 이름 */
    const folds = document.createElement("span");
    folds.className = "poster-folds";
    poster.appendChild(folds);

    const name = document.createElement("span");
    name.className = "poster-name";
    name.textContent = item.author;
    poster.appendChild(name);

    if (opened.has(index)) poster.classList.add("is-open");
    poster.setAttribute("aria-expanded", opened.has(index) ? "true" : "false");

    poster.addEventListener("mouseenter", function () { markName(index, true); });
    poster.addEventListener("mouseleave", function () { markName(index, false); });
    poster.addEventListener("click", function () { setOpen(index, !opened.has(index)); });

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
   7. 펼치기 / 접기
   ========================================================= */
function setOpen(index, isOpen) {
  if (isOpen) {
    opened.add(index);
  } else {
    opened.delete(index);
  }
  const poster = wall.querySelector('.poster[data-index="' + index + '"]');
  if (!poster) return;
  poster.classList.toggle("is-open", isOpen);
  poster.setAttribute("aria-expanded", isOpen ? "true" : "false");
}

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
