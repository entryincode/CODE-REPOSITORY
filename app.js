const DOCS_KEY = "code-repository.docs.v1";
const USER_KEY = "code-repository.user.v1";
const GOOGLE_CLIENT_KEY = "code-repository.google-client.v1";

const starterDocs = [
  {
    id: "python-hello-world",
    title: "파이썬 초보자용 코드들",
    summary: "print()부터 변수, 입력까지. 처음 배우는 파이썬 기초를 정리했어요.",
    category: "Python",
    author: "코드 노트",
    initials: "코",
    createdAt: Date.now() - 1000 * 60 * 18,
    likes: 18,
    liked: false,
    saved: false,
    comments: [{ author: "민지", initials: "민", text: "처음 시작할 때 보기 좋네요!" }],
    body: "# 파이썬 첫걸음\n\n파이썬은 문법이 간결해서 처음 코딩을 배울 때 많이 사용하는 언어예요. 아래 예제부터 차근차근 실행해 보세요.\n\n## 화면에 글자 출력하기\n\n`print()` 함수는 괄호 안의 값을 화면에 보여 줍니다.\n\n```python\nprint('안녕하세요, 파이썬!')\nprint('Hello, World!')\n```\n\n## 변수에 값 담기\n\n변수 이름을 정하고 `=` 기호 뒤에 값을 넣으면 돼요.\n\n```python\nname = '엔둥이'\nlevel = 1\nprint(f'{name}의 첫 번째 코드!')\n```\n\n## 입력받기\n\n사용자가 입력한 값은 문자열로 들어오니, 숫자로 계산할 때는 `int()`로 바꿔 주세요.\n\n```python\nuser_name = input('이름을 입력하세요: ')\nprint(f'반가워요, {user_name}!')\n```\n\n작은 코드를 직접 바꿔 실행해 보면서 익혀 보세요!",
  },
  {
    id: "javascript-fetch-basics",
    title: "fetch로 API 데이터 가져오기",
    summary: "async / await를 사용해 JSON 응답을 읽는 기본 패턴입니다.",
    category: "JavaScript",
    author: "sora.dev",
    initials: "S",
    createdAt: Date.now() - 1000 * 60 * 74,
    likes: 12,
    liked: false,
    saved: false,
    comments: [],
    body: "# fetch 기초\n\n브라우저의 `fetch()`를 사용하면 서버에 요청을 보내고 응답을 받을 수 있어요.\n\n```javascript\nasync function loadPosts() {\n  const response = await fetch('/api/posts');\n  if (!response.ok) {\n    throw new Error('요청에 실패했어요');\n  }\n\n  const posts = await response.json();\n  return posts;\n}\n```\n\n## 오류 처리하기\n\n네트워크 오류와 HTTP 오류를 나눠서 처리하면 문제를 찾기 쉬워집니다. 실제 API 주소와 응답 구조에 맞춰 URL과 필드를 바꿔 사용하세요.",
  },
  {
    id: "react-counter-hook",
    title: "useState로 카운터 만들기",
    summary: "버튼을 눌러 화면의 숫자를 바꾸며 React state를 익혀 봅니다.",
    category: "React",
    author: "haru",
    initials: "H",
    createdAt: Date.now() - 1000 * 60 * 60 * 4,
    likes: 9,
    liked: false,
    saved: false,
    comments: [],
    body: "# 첫 번째 React 카운터\n\n`useState`는 컴포넌트가 기억할 값을 만들 때 사용해요. 값을 바꾸면 React가 화면을 다시 그려 줍니다.\n\n```jsx\nimport { useState } from 'react';\n\nexport default function Counter() {\n  const [count, setCount] = useState(0);\n\n  return (\n    <button onClick={() => setCount(count + 1)}>\n      클릭한 횟수: {count}\n    </button>\n  );\n}\n```\n\n버튼을 누를 때마다 `setCount`가 새 값을 전달하고, 화면에 표시되는 숫자도 함께 바뀝니다.",
  },
  {
    id: "git-first-commit",
    title: "Git 저장소 만들고 첫 커밋하기",
    summary: "새 프로젝트를 Git으로 관리하고 변경 내용을 저장하는 흐름을 정리했습니다.",
    category: "Git · GitHub",
    author: "dev.zip",
    initials: "D",
    createdAt: Date.now() - 1000 * 60 * 60 * 10,
    likes: 15,
    liked: false,
    saved: false,
    comments: [],
    body: "# 첫 커밋까지\n\n프로젝트 폴더에서 Git 저장소를 초기화하고 첫 변경 사항을 저장해 봐요.\n\n```bash\ngit init\ngit add .\ngit commit -m \"첫 커밋\"\n```\n\n## GitHub 원격 저장소 연결\n\nGitHub에서 저장소를 만든 다음 원격 주소를 등록하고 `main` 브랜치를 올립니다.\n\n```bash\ngit remote add origin https://github.com/username/project.git\ngit branch -M main\ngit push -u origin main\n```\n\n토큰이나 비밀번호 같은 비밀 값은 저장소에 커밋하지 않도록 `.gitignore`도 확인하세요.",
  },
];

const $ = (selector, root = document) => root.querySelector(selector);
const feedView = $("#feedView");
const readerView = $("#readerView");
const grid = $("#documentGrid");
const searchInput = $("#searchInput");
const loginDialog = $("#loginDialog");
const editorDialog = $("#editorDialog");
const profileDialog = $("#profileDialog");
const toast = $("#toast");

let docs = loadDocs();
let user = readStored(USER_KEY);
let filterMode = "latest";
let activeTopic = "";
let searchTerm = "";
let toastTimer = 0;
let activeDocId = "";

function readStored(key) {
  try { return JSON.parse(localStorage.getItem(key) || "null"); } catch { return null; }
}

function loadDocs() {
  try {
    const stored = JSON.parse(localStorage.getItem(DOCS_KEY) || "null");
    return Array.isArray(stored) ? stored : starterDocs;
  } catch { return starterDocs; }
}

function persistDocs() {
  try { localStorage.setItem(DOCS_KEY, JSON.stringify(docs)); }
  catch { showToast("저장 공간이 부족해요. 브라우저 저장 공간을 확인해 주세요."); }
}

function escapeHtml(value = "") {
  return String(value).replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[char]);
}

function avatarMarkup(person, extraClass = "") {
  const initial = escapeHtml((person?.initials || person?.name || "C").slice(0, 1));
  return `<span class="author-avatar ${extraClass}">${person?.picture ? `<img src="${escapeHtml(person.picture)}" alt="" />` : initial}</span>`;
}

function timeLabel(timestamp) {
  const minutes = Math.max(0, Math.floor((Date.now() - timestamp) / 60000));
  if (minutes < 1) return "방금 전";
  if (minutes < 60) return `${minutes}분 전`;
  if (minutes < 1440) return `${Math.floor(minutes / 60)}시간 전`;
  return `${Math.floor(minutes / 1440)}일 전`;
}

function inlineMarkdown(text) {
  return escapeHtml(text)
    .replace(/`([^`]+)`/g, '<code class="inline-code">$1</code>')
    .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
    .replace(/\*([^*]+)\*/g, "<em>$1</em>");
}

function renderTextBlock(text) {
  const lines = text.split("\n");
  const output = [];
  let paragraph = [];
  let list = [];
  let quote = [];
  const flushParagraph = () => {
    if (paragraph.length) output.push(`<p>${paragraph.map(inlineMarkdown).join("<br />")}</p>`);
    paragraph = [];
  };
  const flushList = () => {
    if (list.length) output.push(`<ul>${list.map((item) => `<li>${inlineMarkdown(item)}</li>`).join("")}</ul>`);
    list = [];
  };
  const flushQuote = () => {
    if (quote.length) output.push(`<blockquote>${quote.map(inlineMarkdown).join("<br />")}</blockquote>`);
    quote = [];
  };
  for (const line of lines) {
    const heading = line.match(/^(#{1,3})\s+(.+)$/);
    const item = line.match(/^\s*[-*]\s+(.+)$/);
    const quoteLine = line.match(/^>\s?(.*)$/);
    if (heading) {
      flushParagraph(); flushList(); flushQuote();
      const level = heading[1].length;
      output.push(`<h${level}>${inlineMarkdown(heading[2])}</h${level}>`);
    } else if (item) {
      flushParagraph(); flushQuote(); list.push(item[1]);
    } else if (quoteLine) {
      flushParagraph(); flushList(); quote.push(quoteLine[1]);
    } else if (!line.trim()) {
      flushParagraph(); flushList(); flushQuote();
    } else {
      flushList(); flushQuote(); paragraph.push(line);
    }
  }
  flushParagraph(); flushList(); flushQuote();
  return output.join("");
}

function renderMarkdown(source, { copyButtons = true } = {}) {
  const chunks = String(source || "").split(/```([^\n`]*)\n([\s\S]*?)```/g);
  return chunks.map((chunk, index) => {
    if (index % 3 === 0) return renderTextBlock(chunk);
    if (index % 3 === 1) return "";
    const language = chunks[index - 1].trim() || "코드";
    const safeLanguage = escapeHtml(language);
    return `<div class="code-block"><div class="code-block-top"><span>${safeLanguage}</span>${copyButtons ? '<button class="copy-code" type="button">코드 복사</button>' : ""}</div><pre><code>${escapeHtml(chunk.replace(/\n$/, ""))}</code></pre></div>`;
  }).join("");
}

function codeExcerpt(doc) {
  const match = doc.body.match(/```([^\n`]*)\n([\s\S]*?)```/);
  if (match) {
    const language = match[1].trim() || doc.category;
    return `<div class="code-preview"><span class="code-lang">${escapeHtml(language)}</span><pre>${escapeHtml(match[2].trim().split("\n").slice(0, 4).join("\n"))}</pre></div>`;
  }
  return `<p class="doc-summary">${escapeHtml(doc.summary || doc.body.slice(0, 110))}</p>`;
}

function topicSet() {
  return [...new Set(docs.map((doc) => doc.category).filter(Boolean))];
}

function renderTopics() {
  const topics = topicSet();
  $("#topicFilters").innerHTML = topics.map((topic) => `<button class="topic-chip ${activeTopic === topic ? "is-active" : ""}" type="button" data-topic="${escapeHtml(topic)}">${escapeHtml(topic)}</button>`).join("");
  $("#readerTopics").innerHTML = topics.map((topic) => `<button type="button" data-topic="${escapeHtml(topic)}">${escapeHtml(topic)}</button>`).join("");
}

function visibleDocs() {
  let results = [...docs];
  if (filterMode === "popular") results.sort((a, b) => (b.likes || 0) - (a.likes || 0));
  else results.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
  if (filterMode === "saved") results = results.filter((doc) => doc.saved);
  if (activeTopic) results = results.filter((doc) => doc.category === activeTopic);
  if (searchTerm) {
    const query = searchTerm.toLocaleLowerCase("ko");
    results = results.filter((doc) => `${doc.title} ${doc.summary} ${doc.category} ${doc.author} ${doc.body}`.toLocaleLowerCase("ko").includes(query));
  }
  return results;
}

function renderCards() {
  const list = visibleDocs();
  $("#resultCount").textContent = `${list.length}개의 문서`;
  $("#clearSearch").hidden = !searchTerm;
  if (!list.length) {
    const savedEmpty = filterMode === "saved";
    grid.innerHTML = `<div class="empty-state"><strong>${savedEmpty ? "저장한 문서가 아직 없어요." : "검색 결과가 없어요."}</strong>${savedEmpty ? "마음에 드는 문서에서 저장 버튼을 눌러 보세요." : "다른 검색어나 주제로 다시 찾아보세요."}</div>`;
    return;
  }
  grid.innerHTML = list.map((doc, index) => `<article class="doc-card" data-open-doc="${escapeHtml(doc.id)}" style="animation-delay:${Math.min(index * 35, 175)}ms" tabindex="0" aria-label="${escapeHtml(doc.title)} 문서 읽기">
    <div class="doc-card-top"><span class="category-label"><i class="category-dot"></i>${escapeHtml(doc.category || "기타")}</span><time class="doc-date">${timeLabel(doc.createdAt || Date.now())}</time></div>
    <h2>${escapeHtml(doc.title)}</h2>${doc.summary ? `<p class="doc-summary">${escapeHtml(doc.summary)}</p>` : ""}${codeExcerpt(doc)}
    <div class="doc-card-spacer"></div>
    <div class="doc-card-footer"><span class="author-info">${avatarMarkup({ initials: doc.initials, picture: doc.picture })}<span class="author-name">${escapeHtml(doc.author || "익명")}</span></span>
      <span class="card-actions"><button class="card-action ${doc.liked ? "is-active is-liked" : ""}" type="button" data-action="like" data-id="${escapeHtml(doc.id)}" aria-label="좋아요"><svg viewBox="0 0 24 24"><path d="M20.8 4.8a5.4 5.4 0 0 0-7.6 0L12 6l-1.2-1.2a5.4 5.4 0 0 0-7.6 7.6l1.2 1.2L12 21l7.6-7.4 1.2-1.2a5.4 5.4 0 0 0 0-7.6Z"/></svg>${doc.likes || 0}</button>
      <button class="card-action" type="button" data-action="open-comments" data-id="${escapeHtml(doc.id)}" aria-label="댓글 보기"><svg viewBox="0 0 24 24"><path d="M21 11.5a8.4 8.4 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.4 8.4 0 0 1-3.8-.9L3 21l1.9-5.7a8.4 8.4 0 0 1-.9-3.8A8.5 8.5 0 0 1 8.7 3.9a8.4 8.4 0 0 1 3.8-.9h.5a8.5 8.5 0 0 1 8 8v.5Z"/></svg>${(doc.comments || []).length}</button>
      <button class="card-action ${doc.saved ? "is-active" : ""}" type="button" data-action="save" data-id="${escapeHtml(doc.id)}" aria-label="문서 저장"><svg viewBox="0 0 24 24"><path d="M6 4.8A1.8 1.8 0 0 1 7.8 3h8.4A1.8 1.8 0 0 1 18 4.8V21l-6-3.8L6 21V4.8Z"/></svg></button></span>
    </div></article>`).join("");
}

function renderFeed() {
  renderTopics();
  renderCards();
  document.querySelectorAll(".filter-tab").forEach((button) => button.classList.toggle("is-active", button.dataset.filter === filterMode));
}

function renderReader(id) {
  const doc = docs.find((entry) => entry.id === id);
  if (!doc) { showFeed(); return; }
  activeDocId = id;
  feedView.hidden = true;
  readerView.hidden = false;
  renderTopics();
  const author = { initials: doc.initials, picture: doc.picture };
  const comments = doc.comments || [];
  $("#readerContent").innerHTML = `<div class="reader-toolbar"><div class="reader-breadcrumb"><span>문서 저장소</span><span>/</span><span>${escapeHtml(doc.category || "기타")}</span></div><div class="reader-controls"><button class="reader-control ${doc.liked ? "is-active" : ""}" data-reader-action="like" type="button"><svg viewBox="0 0 24 24"><path d="M20.8 4.8a5.4 5.4 0 0 0-7.6 0L12 6l-1.2-1.2a5.4 5.4 0 0 0-7.6 7.6l1.2 1.2L12 21l7.6-7.4 1.2-1.2a5.4 5.4 0 0 0 0-7.6Z"/></svg>좋아요 ${doc.likes || 0}</button><button class="reader-control ${doc.saved ? "is-active" : ""}" data-reader-action="save" type="button"><svg viewBox="0 0 24 24"><path d="M6 4.8A1.8 1.8 0 0 1 7.8 3h8.4A1.8 1.8 0 0 1 18 4.8V21l-6-3.8L6 21V4.8Z"/></svg>${doc.saved ? "저장됨" : "저장"}</button></div></div>
    <h1 class="reader-title">${escapeHtml(doc.title)}</h1><p class="reader-description">${escapeHtml(doc.summary || "코드와 함께 남긴 개발 기록입니다.")}</p>
    <div class="reader-meta">${avatarMarkup(author)}<span class="reader-meta-text"><span class="reader-meta-name">${escapeHtml(doc.author || "익명")}</span><time class="reader-meta-time">${timeLabel(doc.createdAt || Date.now())}</time></span></div>
    <div class="reader-tags"><span class="reader-tag">${escapeHtml(doc.category || "기타")}</span><span class="reader-tag">코드 문서</span></div>
    <div class="markdown-body">${renderMarkdown(doc.body)}</div>
    <section class="reader-comments"><div class="comments-heading"><h3>댓글</h3><span>${comments.length}개</span></div><div class="comment-list">${comments.map((comment) => `<div class="comment-row">${avatarMarkup({ initials: comment.initials || comment.author })}<div class="comment-bubble"><span class="comment-author">${escapeHtml(comment.author || "익명")}</span><p class="comment-text">${escapeHtml(comment.text)}</p></div></div>`).join("") || '<p class="comment-text">첫 번째 댓글을 남겨 보세요.</p>'}</div><form class="comment-form" id="commentForm"><label class="sr-only" for="commentInput">댓글 입력</label><input id="commentInput" maxlength="240" placeholder="문서에 대한 생각을 남겨요" required /><button type="submit">댓글 쓰기</button></form></section>`;
}

function showFeed({ clearHash = true } = {}) {
  feedView.hidden = false;
  readerView.hidden = true;
  activeDocId = "";
  if (clearHash && location.hash.startsWith("#doc/")) history.replaceState(null, "", `${location.pathname}${location.search}`);
  renderFeed();
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function openDoc(id, { updateHash = true } = {}) {
  if (!docs.some((doc) => doc.id === id)) return;
  if (updateHash) history.pushState(null, "", `#doc/${encodeURIComponent(id)}`);
  renderReader(id);
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function readRoute() {
  const match = location.hash.match(/^#doc\/(.+)$/);
  if (match) renderReader(decodeURIComponent(match[1]));
  else showFeed({ clearHash: false });
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("is-visible");
  window.clearTimeout(toastTimer);
  toastTimer = window.setTimeout(() => toast.classList.remove("is-visible"), 2400);
}

function currentGoogleClientId() {
  return (window.CODE_REPOSITORY_CONFIG?.googleClientId || localStorage.getItem(GOOGLE_CLIENT_KEY) || "").trim();
}

function openLogin(message = "") {
  $("#loginMessage").textContent = message;
  $("#loginMessage").classList.remove("is-error");
  $("#clientIdInput").value = localStorage.getItem(GOOGLE_CLIENT_KEY) || window.CODE_REPOSITORY_CONFIG?.googleClientId || "";
  if (!loginDialog.open) loginDialog.showModal();
  window.setTimeout(renderGoogleButton, 80);
}

function renderGoogleButton() {
  const slot = $("#googleButton");
  slot.innerHTML = "";
  const clientId = currentGoogleClientId();
  if (!clientId) {
    $("#loginMessage").textContent = "먼저 Google OAuth Client ID를 설정해 주세요.";
    $("#clientSetup").open = true;
    return;
  }
  if (!window.google?.accounts?.id) {
    $("#loginMessage").textContent = "Google 로그인 버튼을 불러오는 중이에요. 잠시 후 다시 열어 주세요.";
    window.setTimeout(() => { if (loginDialog.open) renderGoogleButton(); }, 1000);
    return;
  }
  window.google.accounts.id.initialize({
    client_id: clientId,
    callback: handleGoogleCredential,
    ux_mode: "popup",
    auto_select: false,
    itp_support: true,
  });
  window.google.accounts.id.renderButton(slot, { type: "standard", theme: "outline", size: "large", text: "continue_with", shape: "rectangular", logo_alignment: "left", locale: "ko", width: 280 });
}

function decodeJwtPayload(token) {
  const part = token.split(".")[1];
  const base64 = part.replace(/-/g, "+").replace(/_/g, "/");
  const bytes = Uint8Array.from(atob(base64.padEnd(Math.ceil(base64.length / 4) * 4, "=")), (char) => char.charCodeAt(0));
  return JSON.parse(new TextDecoder().decode(bytes));
}

function handleGoogleCredential(response) {
  try {
    const claims = decodeJwtPayload(response.credential);
    const configuredClientId = currentGoogleClientId();
    if (claims.aud !== configuredClientId || Number(claims.exp) * 1000 <= Date.now() || !claims.sub) throw new Error("Google 계정 응답을 확인할 수 없어요. 다시 시도해 주세요.");
    user = { id: claims.sub, name: claims.name || claims.email?.split("@")[0] || "Google 사용자", email: claims.email || "", picture: claims.picture || "", initials: (claims.name || claims.email || "G").slice(0, 1) };
    localStorage.setItem(USER_KEY, JSON.stringify(user));
    updateAccount();
    loginDialog.close();
    showToast(`${user.name}님, 로그인했어요.`);
  } catch (error) {
    $("#loginMessage").textContent = error.message || "로그인 정보를 읽지 못했어요.";
    $("#loginMessage").classList.add("is-error");
  }
}

function updateAccount() {
  const avatar = $("#accountAvatar");
  if (!user) {
    avatar.textContent = "G";
    $("#accountLabel").textContent = "로그인";
    return;
  }
  avatar.innerHTML = user.picture ? `<img src="${escapeHtml(user.picture)}" alt="" />` : escapeHtml(user.initials || user.name.slice(0, 1));
  $("#accountLabel").textContent = user.name.split(" ")[0];
  $("#profileAvatar").innerHTML = user.picture ? `<img src="${escapeHtml(user.picture)}" alt="" />` : escapeHtml(user.initials || user.name.slice(0, 1));
  $("#profileName").textContent = user.email || user.name;
}

function requireUser(callback) {
  if (!user) { openLogin("문서를 작성하고 댓글을 남기려면 Google 로그인이 필요해요."); return false; }
  if (callback) callback();
  return true;
}

function openEditor() {
  if (!requireUser()) return;
  $("#editorForm").reset();
  $("#editorTitle").textContent = "새 문서 작성";
  $("#editorStatus").textContent = "문서를 작성하면 자동으로 미리보기에 반영돼요.";
  updatePreview();
  editorDialog.showModal();
  $("#docTitle").focus();
}

function updatePreview() {
  const body = $("#docBody").value;
  $("#markdownPreview").innerHTML = body.trim() ? renderMarkdown(body, { copyButtons: false }) : '<p style="color:#aaa">Markdown과 코드를 입력하면 여기에 미리보기로 표시돼요.</p>';
}

function toggleDocAction(id, action) {
  const doc = docs.find((entry) => entry.id === id);
  if (!doc) return;
  if (action === "like") {
    doc.liked = !doc.liked;
    doc.likes = Math.max(0, (doc.likes || 0) + (doc.liked ? 1 : -1));
  } else if (action === "save") {
    doc.saved = !doc.saved;
    showToast(doc.saved ? "문서를 저장했어요." : "저장을 취소했어요.");
  }
  persistDocs();
  renderFeed();
  if (activeDocId === id) renderReader(id);
}

function handleGridClick(event) {
  const actionButton = event.target.closest("[data-action]");
  if (actionButton) {
    event.stopPropagation();
    const { id, action } = actionButton.dataset;
    if (action === "like" || action === "save") toggleDocAction(id, action);
    else if (action === "open-comments") openDoc(id);
    return;
  }
  const card = event.target.closest("[data-open-doc]");
  if (card) openDoc(card.dataset.openDoc);
}

function submitComment(event) {
  if (event.target.id !== "commentForm") return;
  event.preventDefault();
  if (!requireUser()) return;
  const doc = docs.find((entry) => entry.id === activeDocId);
  const input = $("#commentInput");
  const text = input.value.trim();
  if (!doc || !text) return;
  doc.comments ||= [];
  doc.comments.push({ author: user.name, initials: user.initials, text });
  persistDocs();
  renderReader(doc.id);
  showToast("댓글을 남겼어요.");
}

function submitDocument(event) {
  event.preventDefault();
  if (!requireUser()) return;
  const title = $("#docTitle").value.trim();
  const body = $("#docBody").value.trim();
  if (!title || !body) return;
  const doc = {
    id: `doc-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`,
    title,
    summary: $("#docSummary").value.trim(),
    category: $("#docCategory").value,
    author: user.name,
    initials: user.initials,
    picture: user.picture,
    createdAt: Date.now(),
    likes: 0,
    liked: false,
    saved: false,
    comments: [],
    body,
  };
  docs.unshift(doc);
  persistDocs();
  filterMode = "latest";
  activeTopic = "";
  searchTerm = "";
  searchInput.value = "";
  editorDialog.close();
  showFeed();
  showToast("새 문서를 올렸어요.");
}

$("#homeLink").addEventListener("click", (event) => { event.preventDefault(); showFeed(); });
$("#backToFeed").addEventListener("click", () => showFeed());
$("#accountButton").addEventListener("click", () => {
  if (!user) openLogin();
  else profileDialog.showModal();
});
$("#writeButton").addEventListener("click", openEditor);
$("#saveClientId").addEventListener("click", () => {
  const value = $("#clientIdInput").value.trim();
  if (!/^[\w.-]+\.apps\.googleusercontent\.com$/.test(value)) {
    $("#loginMessage").textContent = "Google OAuth 웹 Client ID를 확인해 주세요.";
    $("#loginMessage").classList.add("is-error");
    return;
  }
  localStorage.setItem(GOOGLE_CLIENT_KEY, value);
  $("#loginMessage").textContent = "Client ID를 저장했어요. Google 로그인 버튼을 불러옵니다.";
  $("#loginMessage").classList.remove("is-error");
  renderGoogleButton();
});
$("#signOutButton").addEventListener("click", () => {
  if (window.google?.accounts?.id) window.google.accounts.id.disableAutoSelect();
  user = null;
  localStorage.removeItem(USER_KEY);
  updateAccount();
  profileDialog.close();
  showToast("로그아웃했어요.");
});
$("#editorForm").addEventListener("submit", submitDocument);
$("#docBody").addEventListener("input", updatePreview);
$("#documentGrid").addEventListener("click", handleGridClick);
$("#documentGrid").addEventListener("keydown", (event) => {
  if ((event.key === "Enter" || event.key === " ") && event.target.matches(".doc-card")) { event.preventDefault(); openDoc(event.target.dataset.openDoc); }
});
$("#readerContent").addEventListener("submit", submitComment);
$("#readerContent").addEventListener("click", async (event) => {
  const action = event.target.closest("[data-reader-action]");
  if (action) toggleDocAction(activeDocId, action.dataset.readerAction);
  const copy = event.target.closest(".copy-code");
  if (copy) {
    const code = copy.closest(".code-block").querySelector("code").textContent;
    try { await navigator.clipboard.writeText(code); copy.textContent = "복사됨"; window.setTimeout(() => { copy.textContent = "코드 복사"; }, 1300); }
    catch { showToast("클립보드에 복사하지 못했어요."); }
  }
});
document.addEventListener("click", (event) => {
  const topicButton = event.target.closest("[data-topic]");
  if (topicButton) {
    activeTopic = activeTopic === topicButton.dataset.topic ? "" : topicButton.dataset.topic;
    filterMode = "latest";
    if (feedView.hidden) showFeed();
    renderFeed();
  }
  const filterButton = event.target.closest(".filter-tab");
  if (filterButton) { filterMode = filterButton.dataset.filter; activeTopic = ""; renderFeed(); }
  if (event.target.closest("#readerSavedButton")) { showFeed(); filterMode = "saved"; renderFeed(); }
  if (event.target.closest("#readerAllButton")) showFeed();
});
searchInput.addEventListener("input", () => { searchTerm = searchInput.value.trim(); if (filterMode !== "saved") filterMode = "latest"; renderFeed(); });
$("#clearSearch").addEventListener("click", () => { searchInput.value = ""; searchTerm = ""; renderFeed(); searchInput.focus(); });
document.addEventListener("keydown", (event) => {
  if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") { event.preventDefault(); searchInput.focus(); }
  if (event.key === "Escape" && !loginDialog.open && !editorDialog.open && !profileDialog.open && !readerView.hidden) showFeed();
});
window.addEventListener("popstate", readRoute);
window.addEventListener("hashchange", readRoute);

updateAccount();
renderFeed();
readRoute();
