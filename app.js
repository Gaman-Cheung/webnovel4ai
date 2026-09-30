const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
const state = {
  storyTitle: '雾里的倒计时',
  writingTip: '让主角在第一章失去一件他以为不会失去的东西。',
  facts: [
    { label: '核心设定', text: '寿命以“天”为单位可视化，只有沈砚能看见。', color: 'blue' },
    { label: '不可逆事件', text: '周予安已经死亡三天，订单却仍在派送。', color: 'yellow' },
    { label: '主角欲望', text: '查清能力来源，并阻止妹妹的倒计时归零。', color: 'green' }
  ],
  chapters: [
    { id: 1, title: '那单没有收件人的外卖', summary: '沈砚在雨夜接到一单奇怪的外卖，地址指向三年前关闭的旧港区医院。', primaryTag: '引子', secondaryTags: ['异常订单'], status: '已确定', tone: 'blue', lane: 'main' },
    { id: 2, title: '倒计时停在三天前', summary: '门后的周予安明明已经死去，头顶的数字却没有继续减少。沈砚决定跨过那道门。', primaryTag: '发现', secondaryTags: ['核心谜团'], status: '草稿', tone: 'yellow', lane: 'main' },
    { id: 3, title: '医院里没有影子', summary: '废弃医院的走廊比地图更深，沈砚第一次看见了不属于任何人的寿命倒计时。', primaryTag: '升级', secondaryTags: ['新线索'], status: '草稿', tone: 'green', lane: 'main' },
    { id: 4, title: '妹妹的数字', summary: '回到家后，沈砚发现妹妹的倒计时突然少了 24 小时，订单却仍然显示“配送中”。', primaryTag: '转折', secondaryTags: ['情感'], status: '草稿', tone: 'blue', lane: 'main' },
    { id: 5, title: '送达之前', summary: '他必须在天亮前回到医院，找出那个一直替别人收取寿命的人。', primaryTag: '第二幕', secondaryTags: ['倒计时'], status: '草稿', tone: 'yellow', lane: 'main' }
  ],
  characters: [
    { name: '沈砚', role: '主角，外卖员', description: '过度负责，总想替别人解决问题。想查清能力来源，并阻止妹妹的倒计时归零。', detailLabel: '秘密', detail: '他第一次看见倒计时，是在母亲去世那天。', color: 'blue' },
    { name: '周予安', role: '关键人物，已死客户', description: '订单的收件人已经死了三天，却仍然在等待一次“送达”。', detailLabel: '秘密', detail: '他知道旧港区医院里那台机器的用途。', color: 'yellow' },
    { name: '沈知遥', role: '情感支点，妹妹', description: '相信哥哥只是太累了，不知道自己的倒计时正在快速减少。', detailLabel: '关系变化', detail: '从被保护的人，变成主动追问真相的人。', color: 'green' }
  ],
  timeline: [
    { id: 't1', chapterId: 1, timeMode: 'story', timeValue: 0, time: '故事当前 · 第一天', title: '异常订单出现', description: '沈砚接到送往旧港区医院的外卖订单，收件人是三天前已经死亡的周予安。', tag: '引子', color: 'blue' },
    { id: 't2', chapterId: 2, timeMode: 'story', timeValue: 1, time: '故事当前 · 第一天 23:40', title: '倒计时停在三天前', description: '周予安的倒计时没有继续减少，沈砚决定进入废弃医院寻找答案。', tag: '核心谜团', color: 'yellow' },
    { id: 't3', chapterId: 4, timeMode: 'story', timeValue: 2, time: '故事当前 · 第二天清晨', title: '妹妹的数字少了 24 小时', description: '沈砚回到家发现妹妹的倒计时突然缩短，医院里的线索与家人产生联系。', tag: '情感转折', color: 'green' },
    { id: 't4', chapterId: 5, timeMode: 'story', timeValue: 3, time: '故事当前 · 第二天午夜', title: '送达之前', description: '沈砚必须在天亮前返回医院，找到替别人收取寿命的人。', tag: '倒计时', color: 'blue' }
  ],
  events: [
    { type: '触发事件', title: '一单没有收件人的外卖', description: '主角的日常被一个不可能存在的订单打破，故事正式启动。', status: '已确定', color: 'blue' },
    { type: '关键发现', title: '倒计时停在三天前', description: '死亡与时间的规则第一次出现矛盾，主角有了必须追查的理由。', status: '待展开', color: 'yellow' },
    { type: '中段转折', title: '医院里没有影子', description: '主角发现能力背后存在另一个观察者，目标从求证变成逃离。', status: '待展开', color: 'green' }
  ],
  mapNodes: [],
  mapEdges: [],
  mapMode: null,
  mapConnectFrom: null,
  mapEdgeType: '推进',
  mapVersion: 3,
  mapScale: 1,
  mapPanX: 0,
  mapPanY: 0,
  mapRelationQuery: '',
  expandedBranches: [],
  generated: false,
  activeTab: 'all',
  selectedChapterId: 1
};

const toast = (message) => {
  const el = $('#toast');
  el.textContent = message;
  el.classList.add('show');
  window.clearTimeout(toast.timer);
  toast.timer = window.setTimeout(() => el.classList.remove('show'), 2400);
};

function saveDraft(silent = false) {
  if (typeof syncFactsFromDom === 'function') syncFactsFromDom();
  if ($('#writingTipText')) state.writingTip = $('#writingTipText').textContent.trim() || state.writingTip;
  const draft = {
    storyTitle: $('#storyTitle').value.trim() || '未命名故事',
    writingTip: state.writingTip,
    facts: state.facts,
    idea: $('#idea').value, time: $('#time').value, place: $('#place').value,
    genres: $$('.choice-chip.selected').map((chip) => chip.textContent),
    characters: $$('.character-pill').map((pill) => pill.textContent.replace('×', '').trim()),
    chapters: state.chapters,
    selectedChapterId: state.selectedChapterId,
    outlineCharacters: state.characters,
    timeline: state.timeline,
    events: state.events,
    mapNodes: state.mapNodes,
    mapEdges: state.mapEdges,
    mapEdgeType: state.mapEdgeType,
    mapScale: state.mapScale,
    mapPanX: state.mapPanX,
    mapPanY: state.mapPanY,
    expandedBranches: state.expandedBranches,
    mapVersion: state.mapVersion
  };
  localStorage.setItem('storyloom-draft', JSON.stringify(draft));
  refreshPromptPreview();
  $('#saveStatus').innerHTML = '<span class="status-dot"></span>本地已保存';
  if (!silent) toast('草稿已保存到当前浏览器');
}

function loadDraft() {
  try {
    const raw = localStorage.getItem('storyloom-draft');
    if (!raw) return;
    const draft = JSON.parse(raw);
    if (typeof draft.storyTitle === 'string') state.storyTitle = draft.storyTitle;
    if (typeof draft.writingTip === 'string') state.writingTip = draft.writingTip;
    if (Array.isArray(draft.facts) && draft.facts.length) state.facts = draft.facts.map((fact, index) => typeof fact === 'string' ? { label: ['核心设定', '不可逆事件', '主角欲望'][index] || '故事事实', text: fact, color: ['blue', 'yellow', 'green'][index % 3] } : fact);
    if (draft.idea) $('#idea').value = draft.idea;
    if (draft.time) $('#time').value = draft.time;
    if (draft.place) $('#place').value = draft.place;
    if (Array.isArray(draft.genres)) $$('.choice-chip').forEach((chip) => chip.classList.toggle('selected', draft.genres.includes(chip.textContent)));
    if (Array.isArray(draft.chapters) && draft.chapters.length) state.chapters = draft.chapters.map(normalizeChapter);
    if (draft.selectedChapterId) state.selectedChapterId = Number(draft.selectedChapterId);
    if (Array.isArray(draft.outlineCharacters) && draft.outlineCharacters.length) state.characters = draft.outlineCharacters;
    if (Array.isArray(draft.timeline) && draft.timeline.length) state.timeline = draft.timeline.map(normalizeTimelineItem);
    if (Array.isArray(draft.events) && draft.events.length) state.events = draft.events;
    if (draft.mapVersion === 3) {
      if (Array.isArray(draft.mapNodes)) state.mapNodes = draft.mapNodes;
      if (Array.isArray(draft.mapEdges)) state.mapEdges = draft.mapEdges;
      if (Number.isFinite(Number(draft.mapScale))) state.mapScale = Number(draft.mapScale);
      if (Number.isFinite(Number(draft.mapPanX))) state.mapPanX = Number(draft.mapPanX);
      if (Number.isFinite(Number(draft.mapPanY))) state.mapPanY = Number(draft.mapPanY);
      if (Array.isArray(draft.expandedBranches)) state.expandedBranches = draft.expandedBranches.map(Number);
    } else { state.mapNodes = []; state.mapEdges = []; state.mapScale = 1; state.mapPanX = 0; state.mapPanY = 0; }
    if (typeof draft.mapEdgeType === 'string') state.mapEdgeType = draft.mapEdgeType;
    renderFacts();
    $('#storyTitle').value = state.storyTitle;
    $('#writingTipText').textContent = state.writingTip;
    if (Array.isArray(draft.outlineCharacters) && draft.outlineCharacters.length) syncTopCharacterPills();
    ensureMapData();
    renderChapters();
    refreshPromptPreview();
  } catch { /* ignore malformed local drafts */ }
}

function normalizeChapter(chapter) {
  const legacyTags = Array.isArray(chapter.tags) ? chapter.tags : [];
  return { ...chapter, primaryTag: chapter.primaryTag || legacyTags[0] || '待补充', secondaryTags: Array.isArray(chapter.secondaryTags) ? chapter.secondaryTags : legacyTags.slice(1), status: chapter.status || (chapter.id === 1 ? '已确定' : '草稿'), lane: chapter.lane === 'branch' ? 'branch' : 'main', branchParentId: chapter.lane === 'branch' && chapter.branchParentId ? Number(chapter.branchParentId) : null };
}

function normalizeTimelineItem(item, index = 0) {
  const mode = ['story', 'before', 'after', 'memory'].includes(item.timeMode) ? item.timeMode : 'story';
  const value = Number.isFinite(Number(item.timeValue)) ? Number(item.timeValue) : index;
  const modeLabel = { story: '故事当前', before: '故事当前之前', after: '故事当前之后', memory: '回忆' }[mode];
  return { ...item, id: item.id || `t${Date.now()}-${index}`, chapterId: item.chapterId ? Number(item.chapterId) : null, timeMode: mode, timeValue: value, time: item.time || `${modeLabel} · 自定义时间` };
}

function timelineSortValue(item) {
  const modeWeight = { before: -1000000, memory: -500000, story: 0, after: 500000 };
  return (modeWeight[item.timeMode] || 0) + Number(item.timeValue || 0);
}

function mapNodeId(chapterId) {
  return `chapter-${chapterId}`;
}

function defaultMapPosition(chapter, index, chapters) {
  const lane = chapter.lane === 'branch' ? 'branch' : 'main';
  const laneChapters = chapters.filter((item) => (item.lane === 'branch' ? 'branch' : 'main') === lane);
  const laneIndex = Math.max(0, laneChapters.findIndex((item) => item.id === chapter.id));
  return { x: 46 + laneIndex * 212, y: lane === 'branch' ? 286 : 86 };
}

function ensureMapData(reset = false) {
  const chapters = state.chapters.map(normalizeChapter);
  const previousByChapter = new Map((reset ? [] : state.mapNodes).map((node) => [Number(node.chapterId), node]));
  state.mapNodes = chapters.map((chapter, index) => {
    const previous = previousByChapter.get(Number(chapter.id));
    const position = previous?.manualPosition && Number.isFinite(Number(previous.x)) && Number.isFinite(Number(previous.y)) ? { x: Number(previous.x), y: Number(previous.y) } : defaultMapPosition(chapter, index, chapters);
    return { id: mapNodeId(chapter.id), chapterId: chapter.id, x: position.x, y: position.y, manualPosition: Boolean(previous?.manualPosition) };
  });
  const validIds = new Set(state.mapNodes.map((node) => node.id));
  state.mapEdges = (reset ? [] : state.mapEdges).filter((edge) => validIds.has(edge.from) && validIds.has(edge.to) && edge.from !== edge.to);
  if (!state.mapEdges.length) {
    const mainChapters = chapters.filter((chapter) => chapter.lane !== 'branch');
    state.mapEdges = mainChapters.slice(1).map((chapter, index) => ({ id: `flow-${mainChapters[index].id}-${chapter.id}`, from: mapNodeId(mainChapters[index].id), to: mapNodeId(chapter.id), type: '推进' }));
  }
  state.mapScale = Math.max(.55, Math.min(1.6, Number(state.mapScale) || 1));
  state.mapPanX = Number.isFinite(Number(state.mapPanX)) ? Number(state.mapPanX) : 0;
  state.mapPanY = Number.isFinite(Number(state.mapPanY)) ? Number(state.mapPanY) : 0;
  state.mapVersion = 3;
}

function updateProgress() {
  let score = 20;
  if ($('#idea').value.trim().length > 15) score += 22;
  if ($('#time').value.trim()) score += 12;
  if ($('#place').value.trim()) score += 12;
  if ($$('.character-pill').length >= 2) score += 14;
  if ($$('.choice-chip.selected').length >= 2) score += 8;
  if (state.generated) score += 12;
  $('#completionPercent').textContent = `${Math.min(score, 100)}%`;
  $('#progressBar').style.width = `${Math.min(score, 100)}%`;
}

function renderFacts() {
  const list = $('#factList');
  if (!list) return;
  list.innerHTML = state.facts.map((fact, index) => `<div class="fact-item" data-fact-index="${index}"><span class="fact-icon ${fact.color}-bg">${index === 0 ? '◈' : index === 1 ? '◒' : '↗'}</span><div class="fact-copy"><div class="fact-title-line"><b>${escapeHtml(fact.label)}</b><button class="fact-delete" type="button" data-delete-fact="${index}" aria-label="删除${escapeHtml(fact.label)}">×</button></div><p>${escapeHtml(fact.text)}</p></div></div>`).join('');
  $('#factsCount').textContent = `已记录 ${state.facts.length} 条事实`;
}

function refreshPromptPreview() {
  const preview = $('#promptPreview');
  if (preview) preview.textContent = buildPrompt();
  if ($('#previewTitle')) $('#previewTitle').textContent = state.storyTitle || '未命名故事';
}

function updateTabCounts() {
  const counts = { all: state.chapters.length, characters: state.characters.length, timeline: state.timeline.length, events: state.events.length, chapters: state.chapters.length };
  Object.entries(counts).forEach(([tab, count]) => { const badge = $(`.outline-tabs button[data-tab="${tab}"] span`); if (badge) badge.textContent = count; });
}

function renderPreview() {
  const target = $('#chapterPreview');
  const selectedIndex = Math.max(0, state.chapters.findIndex((chapter) => chapter.id === state.selectedChapterId));
  const previewStart = Math.min(Math.max(0, selectedIndex - 1), Math.max(0, state.chapters.length - 3));
  const previewChapters = state.chapters.slice(previewStart, previewStart + 3);
  const selected = state.chapters.find((chapter) => chapter.id === state.selectedChapterId) || state.chapters[0];
  if ($('#currentChapterLabel')) $('#currentChapterLabel').textContent = selected ? `当前编辑 · 第 ${String(selected.id).padStart(2, '0')} 章` : '当前编辑';
  target.innerHTML = previewChapters.map((chapter) => `
    <div class="preview-chapter ${chapter.id === state.selectedChapterId ? 'is-current' : ''}" data-select-chapter="${chapter.id}"><span class="number">${String(chapter.id).padStart(2, '0')}</span><div><div class="chapter-name">${escapeHtml(chapter.title)}</div><small>${escapeHtml(chapter.summary.slice(0, 23))}${chapter.summary.length > 23 ? '…' : ''}</small></div><button class="chapter-state status-${chapter.status === '已确定' ? 'confirmed' : chapter.status === '待确认' ? 'pending' : 'draft'}" type="button" data-cycle-status="${chapter.id}" title="点击切换章节状态">${escapeHtml(chapter.status)}</button></div>
  `).join('');
}

function renderChapterCards(chapters = state.chapters) {
  const card = (chapter, nested = false) => `<article class="chapter-card ${nested ? 'is-branch-card' : ''} ${chapter.id === state.selectedChapterId ? 'is-current' : ''}" data-id="${chapter.id}"><div class="chapter-index-wrap"><span class="chapter-index">${String(chapter.id).padStart(2, '0')}</span><span class="chapter-lane-badge ${chapter.lane === 'branch' ? 'branch' : 'main'}">${chapter.lane === 'branch' ? '支线' : '主线'}</span></div><div><div class="card-title-line"><h3>${escapeHtml(chapter.title)}</h3><button class="inline-edit" type="button" data-edit-chapter="${chapter.id}">编辑</button></div><p>${escapeHtml(chapter.summary)}</p><div class="chapter-tags"><span class="chapter-tag blue">${escapeHtml(chapter.primaryTag)}</span>${chapter.secondaryTags.map((tag) => `<span class="chapter-tag">${escapeHtml(tag)}</span>`).join('')}</div></div><button class="chapter-menu" type="button" aria-label="编辑第 ${chapter.id} 章">···</button></article>`;
  const mainChapters = chapters.filter((chapter) => chapter.lane !== 'branch');
  const renderedMainIds = new Set(mainChapters.map((chapter) => chapter.id));
  const markup = mainChapters.map((chapter) => {
    const branches = chapters.filter((item) => item.lane === 'branch' && Number(item.branchParentId) === Number(chapter.id));
    if (!branches.length) return card(chapter);
    const expanded = state.expandedBranches.includes(Number(chapter.id));
    return `<div class="chapter-branch-cluster">${card(chapter)}<button type="button" class="branch-toggle" data-toggle-branch="${chapter.id}" aria-expanded="${expanded}"><span>${expanded ? '⌃' : '⌄'}</span> 支线 · ${branches.length} 章${expanded ? '（收起）' : '（展开）'}</button><div class="branch-children ${expanded ? 'is-open' : ''}">${branches.map((item) => card(item, true)).join('')}</div></div>`;
  }).join('');
  const orphanBranches = chapters.filter((chapter) => chapter.lane === 'branch' && !renderedMainIds.has(Number(chapter.branchParentId)));
  return `${markup}${orphanBranches.length ? `<div class="orphan-branch-group"><div class="orphan-branch-title">未归属的支线章节</div>${orphanBranches.map((chapter) => card(chapter, true)).join('')}</div>` : ''}`;
}

function renderStoryMap() {
  ensureMapData();
  const target = $('#chapterList');
  const nodeWidth = 176;
  const nodeHeight = 126;
  const stageWidth = Math.max(900, state.mapNodes.reduce((max, node) => Math.max(max, node.x + nodeWidth + 90), 0));
  const hasBranch = state.chapters.some((chapter) => chapter.lane === 'branch');
  const stageHeight = hasBranch ? 470 : 330;
  const nodeById = new Map(state.mapNodes.map((node) => [node.id, node]));
  const edgeColor = { 推进: '#9dbbe8', 支线: '#bca9e8', 伏笔: '#d79b55', 回收: '#61a987', 合并: '#c97878' };
  const edgeMarkup = state.mapEdges.map((edge) => {
    const from = nodeById.get(edge.from);
    const to = nodeById.get(edge.to);
    if (!from || !to) return '';
    const x1 = from.x + nodeWidth;
    const y1 = from.y + nodeHeight / 2;
    const x2 = to.x;
    const y2 = to.y + nodeHeight / 2;
    const curve = Math.max(34, Math.abs(x2 - x1) * .35);
    const color = edgeColor[edge.type] || edgeColor.推进;
    return `<g class="map-edge-group" data-map-edge="${edge.id}" tabindex="0" role="button" aria-label="删除${escapeHtml(edge.type)}关系"><path class="map-relation-line" d="M ${x1} ${y1} C ${x1 + curve} ${y1}, ${x2 - curve} ${y2}, ${x2} ${y2}" stroke="${color}" marker-end="url(#map-arrow)"/><text x="${(x1 + x2) / 2}" y="${(y1 + y2) / 2 - 8}" fill="${color}">${escapeHtml(edge.type)}</text></g>`;
  }).join('');
  const edgeDeleteMarkup = state.mapEdges.map((edge) => {
    const from = nodeById.get(edge.from);
    const to = nodeById.get(edge.to);
    if (!from || !to) return '';
    const x = (from.x + nodeWidth + to.x) / 2;
    const y = (from.y + to.y + nodeHeight) / 2;
    return `<button type="button" class="map-edge-delete" data-delete-map-edge="${edge.id}" style="left:${x}px;top:${y}px" aria-label="删除${escapeHtml(edge.type)}关系">×</button>`;
  }).join('');
  const nodeMarkup = [...state.mapNodes].sort((a, b) => a.chapterId - b.chapterId).map((node) => {
    const chapter = state.chapters.find((item) => item.id === node.chapterId);
    if (!chapter) return '';
    const lane = chapter.lane === 'branch' ? 'branch' : 'main';
    return `<article class="map-node chapter-map-node map-node-lane-${lane} ${chapter.id === state.selectedChapterId ? 'is-current' : ''} ${state.mapConnectFrom === node.id ? 'is-connect-start' : ''}" data-map-node="${node.id}" style="left:${node.x}px;top:${node.y}px"><span class="map-drag-handle" title="拖动节点">⠿</span><button class="map-node-open" type="button" data-map-node-open="${node.id}"><span class="map-node-type">${escapeHtml(chapter.primaryTag)}</span><strong>第 ${String(chapter.id).padStart(2, '0')} 章</strong><span>${escapeHtml(chapter.title)}</span><small><b class="map-lane-badge ${lane}">${lane === 'branch' ? '支线' : '主线'}</b> · ${escapeHtml(chapter.status)}</small></button><div class="map-node-tags">${chapter.secondaryTags.slice(0, 3).map((tag) => `<span>${escapeHtml(tag)}</span>`).join('')}</div><button class="map-node-edit" type="button" data-edit-map-chapter="${chapter.id}">编辑章节</button></article>`;
  }).join('');
  const current = state.chapters.find((chapter) => chapter.id === state.selectedChapterId);
  const relationQuery = state.mapRelationQuery.trim().toLowerCase();
  const relationSummary = state.mapEdges.map((edge) => { const from = state.mapNodes.find((node) => node.id === edge.from); const to = state.mapNodes.find((node) => node.id === edge.to); const fromChapter = state.chapters.find((chapter) => chapter.id === from?.chapterId); const toChapter = state.chapters.find((chapter) => chapter.id === to?.chapterId); const searchText = `${fromChapter?.title || ''} ${toChapter?.title || ''} ${edge.type} 第${from?.chapterId || ''}章 第${to?.chapterId || ''}章`.toLowerCase(); const hidden = relationQuery && !searchText.includes(relationQuery) ? ' hidden' : ''; return from && to ? `<div class="map-relation-row" data-relation-text="${escapeHtml(searchText)}"${hidden}><span>第 ${from.chapterId} 章 ${escapeHtml(fromChapter?.title || '')} <b>${escapeHtml(edge.type)}</b> 第 ${to.chapterId} 章 ${escapeHtml(toChapter?.title || '')}</span><button type="button" class="map-relation-delete" data-delete-map-edge="${edge.id}" aria-label="删除这条关系">×</button></div>` : ''; }).filter(Boolean).join('') || '<span class="map-relation-empty">还没有自定义关系。点击“添加关系”开始。</span>';
  const relationControl = state.mapMode === 'connect' ? `<label class="map-relation-control">关系类型<select id="mapEdgeType" aria-label="关系类型">${['推进', '支线', '伏笔', '回收', '合并'].map((type) => `<option ${state.mapEdgeType === type ? 'selected' : ''}>${type}</option>`).join('')}</select></label>` : '';
  target.innerHTML = `<div class="story-map-toolbar"><div><b>故事地图</b><span class="map-toolbar-note"> · 章节的结构视图，节点来自章节编辑</span></div><div class="map-toolbar-actions"><button class="map-tool-button" type="button" data-map-zoom-out aria-label="缩小地图">−</button><span class="map-scale-label">${Math.round(state.mapScale * 100)}%</span><button class="map-tool-button" type="button" data-map-zoom-in aria-label="放大地图">＋</button><button class="map-tool-button" type="button" data-map-fit>适应</button><button class="map-tool-button" type="button" data-map-focus>定位当前</button>${relationControl}<button class="map-tool-button ${state.mapMode === 'connect' ? 'active' : ''}" type="button" data-map-connect>${state.mapMode === 'connect' ? '退出关系模式' : '＋ 添加关系'}</button><button class="map-tool-button" type="button" data-add-chapter>＋ 添加章节</button></div></div><div class="map-help-row"><span>${state.mapMode === 'connect' ? (state.mapConnectFrom ? `关系类型：${escapeHtml(state.mapEdgeType)} · 已选起点，请点击终点章节` : `关系类型：${escapeHtml(state.mapEdgeType)} · 请先点击起点章节`) : '点击章节进入编辑，拖动节点整理布局；主线/支线在章节编辑里设置'}</span></div><div class="story-map-canvas" id="storyMapCanvas"><div class="story-map-viewport" id="mapViewport"><div class="story-map-stage" id="storyMapStage" style="width:${stageWidth}px;height:${stageHeight}px;transform:translate(${state.mapPanX}px,${state.mapPanY}px) scale(${state.mapScale})"><svg class="map-relation-svg" width="${stageWidth}" height="${stageHeight}" viewBox="0 0 ${stageWidth} ${stageHeight}" aria-hidden="true"><defs><marker id="map-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="#9dbbe8"></path></marker></defs>${edgeMarkup}</svg>${edgeDeleteMarkup}<div class="map-nodes-layer">${nodeMarkup}</div></div></div><div class="map-footer"><span>${state.chapters.length} 个章节节点${current ? ` · 当前：第 ${String(current.id).padStart(2, '0')} 章 ${escapeHtml(current.title)}` : ''}</span><button class="add-structure-item" type="button" data-add-chapter>＋ 添加章节</button></div></div><details class="map-relations-panel"><summary><span>已建立的关系</span><b>${state.mapEdges.length} 条</b></summary><div class="map-relations-tools"><input type="search" data-map-relation-search value="${escapeHtml(state.mapRelationQuery)}" placeholder="搜索章节、关系类型或编号"><span>点击线旁 × 删除关系</span></div><div class="map-relations-list">${relationSummary}</div></details>`;
}

function escapeHtml(value = '') {
  return String(value).replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]));
}

function renderTabView(tab = state.activeTab) {
  state.activeTab = tab;
  const target = $('#chapterList');
  if (tab === 'all') { renderStoryMap(); return; }
  if (tab === 'characters') {
    target.innerHTML = `<div class="character-grid">${state.characters.map((character, index) => `
      <article class="character-card" data-character-index="${index}"><span class="large-character-avatar ${character.color}">${escapeHtml(character.name.slice(0, 1))}</span><div><div class="card-title-line"><div><h3>${escapeHtml(character.name)}</h3><span class="character-role">${escapeHtml(character.role)}</span></div><button class="inline-edit" type="button" data-edit-character="${index}">编辑</button></div><p>${escapeHtml(character.description)}</p><div class="character-detail"><b>${escapeHtml(character.detailLabel)}</b><span>${escapeHtml(character.detail)}</span></div></div></article>`).join('')}
      <button class="add-character-card" type="button" data-add-character><span>＋</span> 添加人物</button>
    </div>`;
    return;
  }
  if (tab === 'timeline') {
    const sortedTimeline = state.timeline.map((item, index) => ({ item: normalizeTimelineItem(item, index), index })).sort((a, b) => timelineSortValue(a.item) - timelineSortValue(b.item));
    target.innerHTML = `<div class="timeline-intro"><span>时间线按“事件实际发生时间”排序，章节编号仍按故事讲述顺序。回忆和闪回可以排在故事当前之前。</span><button class="small-button" type="button" data-add-timeline>＋ 添加时间节点</button></div><div class="timeline-view">${sortedTimeline.map(({ item, index }) => `
      <div class="timeline-item" data-timeline-index="${index}"><span class="timeline-marker ${item.color}-bg">${String(index + 1).padStart(2, '0')}</span><div><div class="card-title-line"><div><span class="timeline-time">${escapeHtml(item.time)}</span><h3>${escapeHtml(item.title)}</h3></div><button class="inline-edit" type="button" data-edit-timeline="${index}">编辑</button></div><p>${escapeHtml(item.description)}</p><div class="timeline-meta"><button class="chapter-tag blue timeline-chapter-link" type="button" data-open-timeline-chapter="${item.chapterId || ''}">第 ${item.chapterId ? String(item.chapterId).padStart(2, '0') : '--'} 章</button><span class="chapter-tag">${escapeHtml(item.tag)}</span></div></div></div>`).join('')}</div>`;
    return;
  }
  if (tab === 'events') {
    target.innerHTML = `<div class="event-list">${state.events.map((event, index) => `
      <article class="event-card" data-event-index="${index}"><span class="event-icon ${event.color}-bg">${index === 0 ? '✦' : index === 1 ? '!' : '↗'}</span><div><div class="card-title-line"><div><span class="event-type">${escapeHtml(event.type)}</span><h3>${escapeHtml(event.title)}</h3></div><button class="inline-edit" type="button" data-edit-event="${index}">编辑</button></div><p>${escapeHtml(event.description)}</p></div><span class="event-status ${event.status === '待展开' ? 'draft' : ''}">${escapeHtml(event.status)}</span></article>`).join('')}</div><button class="add-structure-item" type="button" data-add-event>＋ 添加一个故事事件</button>`;
    return;
  }
  target.innerHTML = renderChapterCards(state.chapters);
}

function renderChapters() {
  state.chapters = state.chapters.map(normalizeChapter);
  ensureMapData();
  if (!state.chapters.some((chapter) => chapter.id === state.selectedChapterId)) state.selectedChapterId = state.chapters[0]?.id;
  updateTabCounts();
  renderTabView(state.activeTab);
  renderPreview();
}

function generateOutline() {
  const idea = $('#idea').value.trim() || '一个陌生人收到一封不该寄出的信';
  const place = $('#place').value.trim() || '一座还没有名字的城市';
  const firstSentence = idea.length > 43 ? `${idea.slice(0, 43)}…` : idea;
  $('#logline').textContent = `${firstSentence} 故事从${place}的一次异常相遇开始，主角必须在真相浮出水面前做出选择。`;
  const lead = $('.character-pill span:nth-child(2)');
  const leadName = lead ? lead.firstChild.textContent.trim() : '主角';
  if (state.chapters[0] && !state.chapters[0].manualEdited) state.chapters[0].summary = `${leadName}在${place}遇到与日常完全不符的异常事件，原本熟悉的生活出现第一道裂缝。`;
  if (state.chapters[1] && !state.chapters[1].manualEdited) state.chapters[1].summary = `一条看似无关的线索把${leadName}带向更深处，他意识到这件事可能早就开始了。`;
  if (state.chapters[0]) state.selectedChapterId = state.chapters[0].id;
  state.generated = true;
  renderChapters();
  updateProgress();
  saveDraft(true);
  toast('大纲已生成，你可以继续编辑每一章');
  document.querySelector('#outline').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function promptChapterOrder() {
  const chapters = state.chapters.map(normalizeChapter);
  const byParent = new Map();
  chapters.filter((chapter) => chapter.lane === 'branch' && chapter.branchParentId).forEach((chapter) => {
    const parentId = Number(chapter.branchParentId);
    if (!byParent.has(parentId)) byParent.set(parentId, []);
    byParent.get(parentId).push(chapter);
  });
  byParent.forEach((items) => items.sort((a, b) => a.id - b.id));
  const ordered = [];
  const visited = new Set();
  const addWithBranches = (chapter) => {
    if (!chapter || visited.has(chapter.id)) return;
    visited.add(chapter.id);
    ordered.push(chapter);
    (byParent.get(Number(chapter.id)) || []).forEach(addWithBranches);
  };
  chapters.filter((chapter) => chapter.lane !== 'branch').sort((a, b) => a.id - b.id).forEach(addWithBranches);
  chapters.filter((chapter) => !visited.has(chapter.id)).sort((a, b) => a.id - b.id).forEach(addWithBranches);
  return ordered;
}

function promptRelationGroups(chapterOrder) {
  const nodeToChapter = new Map(state.mapNodes.map((node) => [node.id, Number(node.chapterId)]));
  const relations = state.mapEdges.map((edge) => {
    const fromId = nodeToChapter.get(edge.from);
    const toId = nodeToChapter.get(edge.to);
    return fromId && toId ? { ...edge, fromId, toId } : null;
  }).filter(Boolean);
  chapterOrder.filter((chapter) => chapter.lane === 'branch' && chapter.branchParentId).forEach((chapter) => {
    const fromId = Number(chapter.branchParentId);
    const toId = Number(chapter.id);
    if (!relations.some((relation) => relation.fromId === fromId && relation.toId === toId && relation.type === '支线')) {
      relations.push({ id: `implicit-branch-${fromId}-${toId}`, fromId, toId, type: '支线' });
    }
  });
  const orderIndex = new Map(chapterOrder.map((chapter, index) => [Number(chapter.id), index]));
  const typeOrder = { 支线: 0, 伏笔: 1, 回收: 2, 合并: 3, 推进: 4 };
  relations.sort((a, b) => (orderIndex.get(a.fromId) ?? 9999) - (orderIndex.get(b.fromId) ?? 9999) || (typeOrder[a.type] ?? 99) - (typeOrder[b.type] ?? 99) || a.toId - b.toId);
  const groups = new Map();
  relations.forEach((relation) => {
    if (!groups.has(relation.fromId)) groups.set(relation.fromId, []);
    groups.get(relation.fromId).push(relation);
  });
  return { groups, chapterById: new Map(state.chapters.map((chapter) => [Number(chapter.id), chapter])) };
}

function buildPrompt() {
  const genres = $$('.choice-chip.selected').map((chip) => chip.textContent).join('、') || '未指定';
  const chars = state.characters.map((character) => `- ${character.name}，${character.role}\n  ${character.description}\n  ${character.detailLabel}：${character.detail}`).join('\n') || '- 暂无，请协助补全';
  const chapterOrder = promptChapterOrder();
  const { groups, chapterById } = promptRelationGroups(chapterOrder);
  const chapters = chapterOrder.map((chapter) => {
    const laneLabel = chapter.lane === 'branch' ? `支线（从第 ${chapter.branchParentId || '?'} 章分出）` : '主线';
    const outgoing = groups.get(Number(chapter.id)) || [];
    const relationHint = outgoing.length ? `\n关系出口：${outgoing.map((relation) => `${relation.type} → 第 ${relation.toId} 章`).join('、')}` : '';
    return `### 第 ${chapter.id} 章 · ${chapter.title}\n故事线：${laneLabel}\n状态：${chapter.status}\n${chapter.summary}\n重要标签：${chapter.primaryTag}\n辅助标签：${chapter.secondaryTags.join('、') || '无'}${relationHint}${chapter.draft ? `\n正文片段：\n${chapter.draft}` : ''}`;
  }).join('\n\n');
  const facts = state.facts.map((fact) => `- ${fact.label}：${fact.text}`).join('\n') || '- 暂无已锁定事实';
  const timeline = state.timeline.map((item) => { const chapter = state.chapters.find((entry) => entry.id === Number(item.chapterId)); return `- ${item.time}｜${item.title}${chapter ? `（叙事第 ${chapter.id} 章）` : ''}：${item.description}`; }).join('\n') || '- 暂无时间线';
  const events = state.events.map((item) => `- ${item.type}｜${item.title}（${item.status}）：${item.description}`).join('\n') || '- 暂无故事事件';
  const mapRelations = chapterOrder.map((chapter) => {
    const outgoing = groups.get(Number(chapter.id)) || [];
    if (!outgoing.length) return '';
    return `### 从第 ${chapter.id} 章「${chapter.title}」出发\n${outgoing.map((relation) => { const target = chapterById.get(Number(relation.toId)); return `- ${relation.type} → 第 ${relation.toId} 章「${target?.title || ''}」`; }).join('\n')}`;
  }).filter(Boolean).join('\n\n') || '- 暂无地图关系';
  return `# 《${state.storyTitle || '未命名故事'}》\n\n## 给 AI 的使用说明\n请把下面内容当作一份可执行的故事大纲，而不是把所有条目平均改写。章节编号表示叙事顺序；时间线表示故事世界中事件实际发生的时间，两者可能不同。先沿主线推进，再处理标记为“支线”的章节；支线章节必须从它标注的起点章节分出，并在“回收”或“合并”关系处回到主线。保留“伏笔”直到对应的“回收”关系出现，不要擅自删除已确定事实。\n\n关系类型含义：推进=直接推动下一章；支线=从起点暂时分出的叙事线；伏笔=当前埋下、后文需要兑现的信息；回收=兑现之前的伏笔或支线；合并=两条叙事线重新汇合。\n\n## 写作任务\n请基于以下设定，先给出一份可执行的章节初稿方案，再写出第 1 章。每次扩写时优先参考当前章节的关系出口、人物动机和时间节点；保持人物动机清晰，结尾留下一个可追踪的线索。\n\n## 故事想法\n${$('#idea').value.trim()}\n\n## 基础设定\n- 时间：${$('#time').value.trim() || '未指定'}\n- 地点：${$('#place').value.trim() || '未指定'}\n- 类型：${genres}\n- 当前写作提示：${state.writingTip}\n\n## 关键人物\n${chars}\n\n## 故事事实\n${facts}\n\n## 时间线（实际发生顺序）\n${timeline}\n\n## 故事事件\n${events}\n\n## 故事关系（按起点章节分组）\n${mapRelations}\n\n## 章节结构（支线紧跟所属起点章节）\n${chapters}\n\n## 文风要求\n克制、具有画面感；对话自然；每个场景都推动信息或人物关系发生变化。`;
}

function downloadPrompt() {
  const blob = new Blob([buildPrompt()], { type: 'text/markdown;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url; link.download = 'storyloom-writing-brief.md'; link.click();
  URL.revokeObjectURL(url);
  toast('Markdown 已下载');
}

function copyPrompt() {
  const text = buildPrompt();
  if (navigator.clipboard?.writeText) navigator.clipboard.writeText(text).then(() => toast('AI 提示词已复制')).catch(() => downloadPrompt());
  else downloadPrompt();
}

function mapEditor(nodeId = '') {
  const chapter = (id) => state.chapters.find((item) => item.id === id);
  const node = state.mapNodes.find((item) => item.id === nodeId) || { id: '', chapterId: state.chapters[0]?.id || 1, type: '普通', lane: 'main', title: '', description: '', x: 8, y: 18 };
  const chapterOptions = state.chapters.map((chapter) => `<option value="${chapter.id}" ${Number(node.chapterId) === chapter.id ? 'selected' : ''}>第 ${String(chapter.id).padStart(2, '0')} 章 · ${escapeHtml(chapter.title)}</option>`).join('');
  const types = ['普通', '触发', '发现', '转折', '反转', '伏笔', '回收', '合并', '收束'];
  const relations = state.mapEdges.filter((edge) => edge.from === node.id || edge.to === node.id).map((edge) => { const otherId = edge.from === node.id ? edge.to : edge.from; const other = state.mapNodes.find((item) => item.id === otherId); const otherChapter = other ? chapter(other.chapterId) : null; return `<div class="map-relation"><span>${edge.from === node.id ? '→' : '←'} ${escapeHtml(edge.type)} · 第 ${other?.chapterId || '?'} 章${otherChapter ? ` ${escapeHtml(other.title || otherChapter.title)}` : ''}</span><button type="button" data-delete-map-edge="${edge.id}" aria-label="删除这条关系">×</button></div>`; }).join('') || '<span class="empty-relation">暂时没有关联。可返回地图后使用“连线”。</span>';
  $('#chapterList').innerHTML = `<form class="inline-editor map-editor" data-editor="map-node" data-index="${escapeHtml(node.id)}"><div class="editor-heading"><div><span class="section-kicker">${node.id ? '编辑地图节点' : '新增地图节点'}</span><h3>节点详情</h3></div><button type="button" class="text-button" data-cancel-map-editor>返回地图</button></div><div class="editor-grid"><label>节点类型<select name="type">${types.map((type) => `<option ${node.type === type ? 'selected' : ''}>${type}</option>`).join('')}</select></label><label>所属线路<select name="lane"><option value="main" ${node.lane === 'main' ? 'selected' : ''}>主线</option><option value="branch" ${node.lane === 'branch' ? 'selected' : ''}>支线</option></select></label><label class="wide">关联章节<select name="chapterId">${chapterOptions}</select></label><label>节点标题<input name="title" value="${escapeHtml(node.title || '')}" placeholder="默认使用章节标题"></label><label>节点说明<input name="description" value="${escapeHtml(node.description || '')}" placeholder="说明这次转折或伏笔"></label></div><div class="map-relations-editor"><div class="section-kicker">当前关联</div>${relations}</div><div class="editor-actions"><button type="submit" class="primary-button">保存节点</button>${node.id ? `<button type="button" class="secondary-button" data-open-map-chapter="${node.chapterId}">打开对应章节</button><button type="button" class="danger-text" data-delete-map-node>删除节点</button>` : ''}</div></form>`;
}

function connectMapNode(nodeId) {
  if (!state.mapConnectFrom) { state.mapConnectFrom = nodeId; toast('已选择起点，请再点击一个节点'); renderStoryMap(); return; }
  if (state.mapConnectFrom === nodeId) { state.mapConnectFrom = null; toast('已取消连线'); renderStoryMap(); return; }
  const edgeType = state.mapEdgeType || '推进';
  if (!state.mapEdges.some((edge) => edge.from === state.mapConnectFrom && edge.to === nodeId)) state.mapEdges.push({ id: `e${Date.now()}`, from: state.mapConnectFrom, to: nodeId, type: edgeType });
  state.mapConnectFrom = null;
  state.mapMode = null;
  saveDraft(true);
  renderStoryMap();
  toast(`已建立${edgeType}关系`);
}

function addMapNode() {
  mapEditor('');
}

function persistMapNodeForm(form) {
  const values = Object.fromEntries(new FormData(form).entries());
  const chapterId = Number(values.chapterId);
  const existingId = form.dataset.index;
  const previous = state.mapNodes.find((item) => item.id === existingId);
  const node = { id: existingId || `n${Date.now()}`, chapterId, type: values.type, lane: values.lane, title: values.title.trim(), description: values.description.trim(), x: previous?.x ?? (values.lane === 'main' ? 8 + (state.mapNodes.filter((item) => item.lane === 'main').length % 5) * 18 : 14 + (state.mapNodes.filter((item) => item.lane === 'branch').length % 4) * 20), y: previous?.y ?? (values.lane === 'main' ? 18 : 63) };
  const index = state.mapNodes.findIndex((item) => item.id === existingId);
  if (index >= 0) state.mapNodes.splice(index, 1, node); else state.mapNodes.push(node);
  state.mapMode = null;
  state.activeTab = 'all';
  state.selectedChapterId = chapterId;
  saveDraft(true);
  renderChapters();
  toast('地图节点已保存');
}

function startMapDrag(event, nodeElement) {
  if (event.target.closest('button')) return;
  const canvas = $('#storyMapCanvas');
  const node = state.mapNodes.find((item) => item.id === nodeElement.dataset.mapNode);
  if (!canvas || !node) return;
  event.preventDefault();
  const bounds = canvas.getBoundingClientRect();
  const startX = event.clientX;
  const startY = event.clientY;
  const original = { x: node.x, y: node.y };
  nodeElement.classList.add('is-dragging');
  const move = (moveEvent) => {
    node.x = Math.max(1, Math.min(86, original.x + (moveEvent.clientX - startX) / bounds.width * 100));
    node.y = Math.max(12, Math.min(72, original.y + (moveEvent.clientY - startY) / bounds.height * 100));
    nodeElement.style.left = `${node.x}%`;
    nodeElement.style.top = `${node.y}%`;
  };
  const up = () => {
    window.removeEventListener('pointermove', move);
    window.removeEventListener('pointerup', up);
    nodeElement.classList.remove('is-dragging');
    saveDraft(true);
    renderStoryMap();
  };
  window.addEventListener('pointermove', move);
  window.addEventListener('pointerup', up, { once: true });
}

function startMapNodeDrag(event, nodeElement) {
  if (event.target.closest('button')) return;
  const viewport = $('#mapViewport');
  const node = state.mapNodes.find((item) => item.id === nodeElement.dataset.mapNode);
  if (!viewport || !node) return;
  event.preventDefault();
  const startX = event.clientX;
  const startY = event.clientY;
  const original = { x: node.x, y: node.y };
  const move = (moveEvent) => {
    node.x = Math.max(12, original.x + (moveEvent.clientX - startX) / state.mapScale);
    node.y = Math.max(42, original.y + (moveEvent.clientY - startY) / state.mapScale);
    node.manualPosition = true;
    nodeElement.style.left = `${node.x}px`;
    nodeElement.style.top = `${node.y}px`;
  };
  const up = () => {
    window.removeEventListener('pointermove', move);
    window.removeEventListener('pointerup', up);
    saveDraft(true);
    renderStoryMap();
  };
  window.addEventListener('pointermove', move);
  window.addEventListener('pointerup', up, { once: true });
}

function startMapPan(event) {
  const viewport = $('#mapViewport');
  if (!viewport || event.target.closest('button, select, .map-node')) return;
  event.preventDefault();
  const startX = event.clientX;
  const startY = event.clientY;
  const original = { x: state.mapPanX, y: state.mapPanY };
  const move = (moveEvent) => {
    state.mapPanX = original.x + moveEvent.clientX - startX;
    state.mapPanY = original.y + moveEvent.clientY - startY;
    const stage = $('#storyMapStage');
    if (stage) stage.style.transform = `translate(${state.mapPanX}px,${state.mapPanY}px) scale(${state.mapScale})`;
  };
  const up = () => {
    window.removeEventListener('pointermove', move);
    window.removeEventListener('pointerup', up);
    saveDraft(true);
  };
  window.addEventListener('pointermove', move);
  window.addEventListener('pointerup', up, { once: true });
}

function setMapScale(nextScale) {
  state.mapScale = Math.max(.55, Math.min(1.6, nextScale));
  renderStoryMap();
}

function fitMapToViewport() {
  const viewport = $('#mapViewport');
  const stage = $('#storyMapStage');
  if (!viewport || !stage) return;
  const width = Number.parseFloat(stage.style.width) || 900;
  const height = Number.parseFloat(stage.style.height) || 330;
  state.mapScale = Math.max(.55, Math.min(1, Math.min((viewport.clientWidth - 24) / width, (viewport.clientHeight - 24) / height)));
  state.mapPanX = 12;
  state.mapPanY = 12;
  saveDraft(true);
  renderStoryMap();
}

function focusCurrentChapter() {
  const viewport = $('#mapViewport');
  const node = state.mapNodes.find((item) => item.chapterId === state.selectedChapterId);
  if (!viewport || !node) return;
  state.mapPanX = viewport.clientWidth / 2 - (node.x + 88) * state.mapScale;
  state.mapPanY = viewport.clientHeight / 2 - (node.y + 63) * state.mapScale;
  saveDraft(true);
  renderStoryMap();
}

function chapterEditor(id) {
  const index = state.chapters.findIndex((chapter) => chapter.id === id);
  if (index < 0) return;
  const item = state.chapters[index];
  const parentOptions = state.chapters.filter((chapter) => chapter.lane !== 'branch' && chapter.id !== item.id).map((chapter) => `<option value="${chapter.id}" ${Number(item.branchParentId) === Number(chapter.id) ? 'selected' : ''}>第 ${String(chapter.id).padStart(2, '0')} 章 · ${escapeHtml(chapter.title)}</option>`).join('');
  const chapterTimeline = state.timeline.filter((event) => Number(event.chapterId) === Number(id));
  const timelineLinks = chapterTimeline.map((event) => `<div class="chapter-timeline-row"><span>${escapeHtml(event.time)} · ${escapeHtml(event.title)}</span><button type="button" class="inline-edit" data-edit-timeline="${state.timeline.indexOf(event)}">编辑时间</button></div>`).join('') || '<div class="empty-relation">本章还没有时间节点。</div>';
  $('#chapterList').innerHTML = `<form class="inline-editor" data-editor="chapter" data-index="${index}"><div class="editor-heading"><div><span class="section-kicker">编辑第 ${item.id} 章</span><h3>章节设定</h3></div><button type="button" class="text-button" data-cancel-editor>取消</button></div><div class="editor-grid"><label class="wide">章节标题<input name="title" value="${escapeHtml(item.title)}" required></label><label>章节状态<select name="status"><option ${item.status === '草稿' ? 'selected' : ''}>草稿</option><option ${item.status === '待确认' ? 'selected' : ''}>待确认</option><option ${item.status === '已确定' ? 'selected' : ''}>已确定</option></select></label><label>所属故事线<select name="lane"><option value="main" ${item.lane !== 'branch' ? 'selected' : ''}>主线</option><option value="branch" ${item.lane === 'branch' ? 'selected' : ''}>支线</option></select></label><label>支线归属章节<select name="branchParentId"><option value="">不归属某个章节</option>${parentOptions}</select></label><label>重要标签（蓝色）<input name="primaryTag" value="${escapeHtml(item.primaryTag)}" placeholder="例如：转折" required></label><label class="wide">本章发生什么<textarea name="summary" rows="4" required>${escapeHtml(item.summary)}</textarea></label><label class="wide">正文片段（可选）<textarea name="draft" rows="5" placeholder="如果已经写了一小段正文，可以放在这里，导出给 AI 时会一起带上。">${escapeHtml(item.draft || '')}</textarea></label><label class="wide">辅助标签（白色，可用逗号分隔）<input name="secondaryTags" value="${escapeHtml(item.secondaryTags.join('，'))}" placeholder="例如：伏笔，情感，场景"></label></div><div class="editor-note">故事地图只展示这里的章节；主线/支线、标签、状态和支线归属都会同步到地图。</div><section class="chapter-timeline-panel"><div class="map-relations-head"><b>本章时间节点</b><span>${chapterTimeline.length} 个</span></div>${timelineLinks}<button type="button" class="small-button" data-add-chapter-timeline="${item.id}">＋ 添加本章时间节点</button></section><div class="editor-actions"><button type="submit" class="primary-button">保存章节</button><button type="button" class="danger-text" data-delete-chapter>删除章节</button></div></form>`;
  $('#chapterList input[name="title"]').focus();
}

function characterEditor(index = -1) {
  const item = index >= 0 ? state.characters[index] : { name: '', role: '', description: '', detailLabel: '秘密', detail: '', color: 'blue' };
  $('#chapterList').innerHTML = `<form class="inline-editor" data-editor="character" data-index="${index}"><div class="editor-heading"><div><span class="section-kicker">${index >= 0 ? '编辑人物' : '新增人物'}</span><h3>人物设定</h3></div><button type="button" class="text-button" data-cancel-editor>取消</button></div><div class="editor-grid"><label>姓名<input name="name" value="${escapeHtml(item.name)}" required></label><label>身份<input name="role" value="${escapeHtml(item.role)}" placeholder="例如：主角 · 记者" required></label><label class="wide">人物描述<textarea name="description" rows="3" required>${escapeHtml(item.description)}</textarea></label><label>信息标签<input name="detailLabel" value="${escapeHtml(item.detailLabel)}"></label><label>秘密 / 关系变化<input name="detail" value="${escapeHtml(item.detail)}"></label></div><div class="editor-actions"><button type="submit" class="primary-button">保存人物</button>${index >= 0 ? '<button type="button" class="danger-text" data-delete-character>删除人物</button>' : ''}</div></form>`;
  $('#chapterList input[name="name"]').focus();
}

function timelineEditor(index = -1, chapterId = state.selectedChapterId) {
  const item = index >= 0 ? normalizeTimelineItem(state.timeline[index], index) : { id: '', chapterId, timeMode: 'story', timeValue: 0, time: '', title: '', description: '', tag: '待展开', color: 'blue' };
  const chapterOptions = state.chapters.map((chapter) => `<option value="${chapter.id}" ${Number(item.chapterId) === Number(chapter.id) ? 'selected' : ''}>第 ${String(chapter.id).padStart(2, '0')} 章 · ${escapeHtml(chapter.title)}</option>`).join('');
  $('#chapterList').innerHTML = `<form class="inline-editor" data-editor="timeline" data-index="${index}"><div class="editor-heading"><div><span class="section-kicker">${index >= 0 ? '编辑时间节点' : '新增时间节点'}</span><h3>时间线设定</h3></div><button type="button" class="text-button" data-cancel-editor>取消</button></div><div class="editor-grid"><label class="wide">关联章节<select name="chapterId"><option value="">不关联章节</option>${chapterOptions}</select></label><label>时间位置<select name="timeMode"><option value="before" ${item.timeMode === 'before' ? 'selected' : ''}>故事当前之前</option><option value="memory" ${item.timeMode === 'memory' ? 'selected' : ''}>回忆 / 闪回</option><option value="story" ${item.timeMode === 'story' ? 'selected' : ''}>故事当前</option><option value="after" ${item.timeMode === 'after' ? 'selected' : ''}>故事当前之后</option></select></label><label>排序位置<input name="timeValue" type="number" step="1" value="${escapeHtml(item.timeValue)}" placeholder="例如：-3、0、2" required></label><label class="wide">时间说明<input name="time" value="${escapeHtml(item.time)}" placeholder="例如：三年前 · 母亲去世那天" required></label><label>节点标签<input name="tag" value="${escapeHtml(item.tag)}" placeholder="例如：转折" required></label><label class="wide">事件标题<input name="title" value="${escapeHtml(item.title)}" required></label><label class="wide">发生了什么<textarea name="description" rows="4" required>${escapeHtml(item.description)}</textarea></label></div><div class="editor-note">时间线按实际发生时间排序；章节编辑里的第几章代表叙事顺序，回忆 / 闪回可以回到更早时间。</div><div class="editor-actions"><button type="submit" class="primary-button">保存时间节点</button>${index >= 0 ? '<button type="button" class="danger-text" data-delete-timeline>删除节点</button>' : ''}</div></form>`;
  $('#chapterList select[name="chapterId"]').focus();
}

function eventEditor(index = -1) {
  const item = index >= 0 ? state.events[index] : { type: '', title: '', description: '', status: '待展开', color: 'blue' };
  $('#chapterList').innerHTML = `<form class="inline-editor" data-editor="event" data-index="${index}"><div class="editor-heading"><div><span class="section-kicker">${index >= 0 ? '编辑故事事件' : '新增故事事件'}</span><h3>事件设定</h3></div><button type="button" class="text-button" data-cancel-editor>取消</button></div><div class="editor-grid"><label>事件类型<input name="type" value="${escapeHtml(item.type)}" placeholder="例如：触发事件" required></label><label>状态<input name="status" value="${escapeHtml(item.status)}" placeholder="例如：待展开" required></label><label class="wide">事件标题<input name="title" value="${escapeHtml(item.title)}" required></label><label class="wide">事件描述<textarea name="description" rows="4" required>${escapeHtml(item.description)}</textarea></label></div><div class="editor-actions"><button type="submit" class="primary-button">保存故事事件</button>${index >= 0 ? '<button type="button" class="danger-text" data-delete-event>删除事件</button>' : ''}</div></form>`;
  $('#chapterList input[name="type"]').focus();
}

function syncTopCharacterPills() {
  $('#characterList').innerHTML = state.characters.map((character) => `<span class="character-pill"><span class="character-avatar ${character.color}">${escapeHtml(character.name.slice(0, 1))}</span><span>${escapeHtml(character.name)} <small>${escapeHtml(character.role)}</small></span><button type="button" aria-label="删除${escapeHtml(character.name)}">×</button></span>`).join('');
}

function selectChapter(id) {
  state.selectedChapterId = Number(id);
  renderTabView(state.activeTab);
  renderPreview();
  saveDraft(true);
}

function cycleChapterStatus(id) {
  const chapter = state.chapters.find((item) => item.id === Number(id));
  if (!chapter) return;
  const statuses = ['草稿', '待确认', '已确定'];
  chapter.status = statuses[(statuses.indexOf(chapter.status) + 1) % statuses.length];
  state.selectedChapterId = chapter.id;
  renderTabView(state.activeTab);
  renderPreview();
  saveDraft(true);
  toast(`第 ${chapter.id} 章：${chapter.status}`);
}

$('#chapterList').addEventListener('click', (event) => {
  const edge = event.target.closest('[data-map-edge]');
  if (edge && !event.target.closest('button')) { state.mapEdges = state.mapEdges.filter((item) => item.id !== edge.dataset.mapEdge); saveDraft(true); renderStoryMap(); toast('关系线已删除'); return; }
  const button = event.target.closest('button');
  const card = event.target.closest('.chapter-card');
  if (button?.dataset.toggleBranch !== undefined) { const id = Number(button.dataset.toggleBranch); state.expandedBranches = state.expandedBranches.includes(id) ? state.expandedBranches.filter((item) => item !== id) : [...state.expandedBranches, id]; saveDraft(true); renderTabView('chapters'); return; }
  if (button?.dataset.openTimelineChapter !== undefined) { const chapterId = Number(button.dataset.openTimelineChapter); if (chapterId) { state.selectedChapterId = chapterId; state.activeTab = 'chapters'; $$('.outline-tabs button').forEach((tab) => { const active = tab.dataset.tab === 'chapters'; tab.classList.toggle('active', active); tab.setAttribute('aria-selected', String(active)); }); chapterEditor(chapterId); } return; }
  if (card && !button) { selectChapter(card.dataset.id); return; }
  const mapNode = event.target.closest('.map-node');
  if (mapNode && !button) { const node = state.mapNodes.find((item) => item.id === mapNode.dataset.mapNode); if (node) { if (state.mapMode === 'connect') connectMapNode(node.id); else { selectChapter(node.chapterId); focusCurrentChapter(); } } return; }
  if (!button) return;
  if (button.dataset.mapNodeOpen !== undefined) { if (state.mapMode === 'connect') connectMapNode(button.dataset.mapNodeOpen); else { selectChapter(state.mapNodes.find((node) => node.id === button.dataset.mapNodeOpen)?.chapterId); focusCurrentChapter(); } return; }
  if (button.dataset.editMapChapter !== undefined) { state.activeTab = 'chapters'; $$('.outline-tabs button').forEach((tab) => { const active = tab.dataset.tab === 'chapters'; tab.classList.toggle('active', active); tab.setAttribute('aria-selected', String(active)); }); chapterEditor(Number(button.dataset.editMapChapter)); return; }
  if (button.dataset.mapZoomOut !== undefined) return setMapScale(state.mapScale - .1);
  if (button.dataset.mapZoomIn !== undefined) return setMapScale(state.mapScale + .1);
  if (button.dataset.mapFit !== undefined) return fitMapToViewport();
  if (button.dataset.mapFocus !== undefined) return focusCurrentChapter();
  if (button.dataset.openMapChapter !== undefined) {
    const chapterId = Number(button.dataset.openMapChapter);
    state.selectedChapterId = chapterId;
    state.activeTab = 'chapters';
    $$('.outline-tabs button').forEach((tab) => {
      const active = tab.dataset.tab === 'chapters';
      tab.classList.toggle('active', active);
      tab.setAttribute('aria-selected', String(active));
    });
    chapterEditor(chapterId);
    return;
  }
  if (button.dataset.mapConnect !== undefined) { state.mapMode = state.mapMode === 'connect' ? null : 'connect'; state.mapConnectFrom = null; renderStoryMap(); return; }
  if (button.dataset.mapAdd !== undefined || button.dataset.addMapNode !== undefined || button.dataset.addChapter !== undefined) return $('#addChapter').click();
  if (button.dataset.cancelMapEditor !== undefined) { state.mapMode = null; renderChapters(); return; }
  if (button.dataset.deleteMapNode !== undefined) { const nodeId = $('#chapterList form').dataset.index; state.mapNodes = state.mapNodes.filter((node) => node.id !== nodeId); state.mapEdges = state.mapEdges.filter((edge) => edge.from !== nodeId && edge.to !== nodeId); state.mapMode = null; saveDraft(true); renderChapters(); toast('地图节点已删除'); return; }
  if (button.dataset.deleteMapEdge !== undefined) { state.mapEdges = state.mapEdges.filter((edge) => edge.id !== button.dataset.deleteMapEdge); saveDraft(true); renderStoryMap(); toast('关系已删除'); return; }
  if (button.dataset.mapChapter !== undefined) { const branchNode = state.mapNodes.find((node) => node.chapterId === Number(button.dataset.mapChapter) && node.lane === 'branch'); if (state.mapMode === 'connect' && branchNode) connectMapNode(branchNode.id); else selectChapter(button.dataset.mapChapter); return; }
  if (button.dataset.addMapNode !== undefined) { $('#addChapter').click(); return; }
  if (button.dataset.editChapter !== undefined) return chapterEditor(Number(button.dataset.editChapter));
  if (button.dataset.editCharacter !== undefined) return characterEditor(Number(button.dataset.editCharacter));
  if (button.dataset.addCharacter !== undefined) return characterEditor();
  if (button.dataset.editTimeline !== undefined) return timelineEditor(Number(button.dataset.editTimeline));
  if (button.dataset.addChapterTimeline !== undefined) return timelineEditor(-1, Number(button.dataset.addChapterTimeline));
  if (button.dataset.addTimeline !== undefined) return timelineEditor();
  if (button.dataset.editEvent !== undefined) return eventEditor(Number(button.dataset.editEvent));
  if (button.dataset.addEvent !== undefined) return eventEditor();
  if (button.dataset.cancelEditor !== undefined) return renderTabView(state.activeTab);
  if (button.dataset.deleteCharacter !== undefined) { state.characters.splice(Number($('#chapterList form').dataset.index || -1), 1); syncTopCharacterPills(); renderTabView('characters'); saveDraft(true); toast('人物已删除'); }
  if (button.dataset.deleteTimeline !== undefined) { const form = $('#chapterList form'); state.timeline.splice(Number(form.dataset.index || -1), 1); renderTabView('timeline'); saveDraft(true); toast('时间节点已删除'); }
  if (button.dataset.deleteEvent !== undefined) { const form = $('#chapterList form'); state.events.splice(Number(form.dataset.index || -1), 1); renderTabView('events'); saveDraft(true); toast('故事事件已删除'); }
  if (button.dataset.deleteChapter !== undefined) { const form = $('#chapterList form'); state.chapters.splice(Number(form.dataset.index || -1), 1); ensureMapData(); renderTabView(state.activeTab); renderPreview(); saveDraft(true); toast('章节已删除'); }
});

$('#chapterList').addEventListener('change', (event) => {
  if (event.target.id === 'mapEdgeType') { state.mapEdgeType = event.target.value; saveDraft(true); }
});

$('#chapterList').addEventListener('input', (event) => {
  if (event.target.dataset.mapRelationSearch === undefined) return;
  const query = event.target.value.trim().toLowerCase();
  state.mapRelationQuery = query;
  $$('.map-relation-row').forEach((row) => row.classList.toggle('is-filtered', Boolean(query) && !row.dataset.relationText.includes(query)));
});

$('#chapterPreview').addEventListener('click', (event) => {
  const statusButton = event.target.closest('[data-cycle-status]');
  if (statusButton) { cycleChapterStatus(statusButton.dataset.cycleStatus); return; }
  const card = event.target.closest('[data-select-chapter]');
  if (card) selectChapter(card.dataset.selectChapter);
});

$('#chapterList').addEventListener('submit', (event) => {
  const form = event.target.closest('form[data-editor]');
  if (!form) return;
  event.preventDefault();
  const values = Object.fromEntries(new FormData(form).entries());
  const index = Number(form.dataset.index || -1);
  if (form.dataset.editor === 'map-node') { event.preventDefault(); persistMapNodeForm(form); return; }
  if (form.dataset.editor === 'chapter') { const previousLane = state.chapters[index].lane; const lane = values.lane === 'branch' ? 'branch' : 'main'; state.chapters[index] = { ...state.chapters[index], title: values.title, summary: values.summary, draft: values.draft, status: values.status, lane, branchParentId: lane === 'branch' && values.branchParentId ? Number(values.branchParentId) : null, primaryTag: values.primaryTag.trim() || '待补充', secondaryTags: values.secondaryTags.split(/[，,]/).map((tag) => tag.trim()).filter(Boolean), manualEdited: true }; if (previousLane !== state.chapters[index].lane) { const node = state.mapNodes.find((item) => item.chapterId === state.chapters[index].id); if (node) node.manualPosition = false; } if (lane === 'branch' && state.chapters[index].branchParentId) state.expandedBranches = [...new Set([...state.expandedBranches, state.chapters[index].branchParentId])]; state.selectedChapterId = state.chapters[index].id; ensureMapData(); renderTabView(state.activeTab); renderPreview(); toast('章节设定已保存'); }
  if (form.dataset.editor === 'character') { const item = { ...values, color: index >= 0 ? state.characters[index].color : ['blue', 'yellow', 'green'][state.characters.length % 3] }; index >= 0 ? state.characters.splice(index, 1, item) : state.characters.push(item); syncTopCharacterPills(); renderTabView('characters'); toast('人物设定已保存'); }
  if (form.dataset.editor === 'timeline') { const item = normalizeTimelineItem({ ...values, chapterId: values.chapterId ? Number(values.chapterId) : null, timeValue: Number(values.timeValue), color: index >= 0 ? state.timeline[index].color : ['blue', 'yellow', 'green'][state.timeline.length % 3] }, index); if (index >= 0) { const originalIndex = state.timeline.findIndex((entry) => entry.id === item.id); state.timeline.splice(originalIndex >= 0 ? originalIndex : index, 1, item); } else state.timeline.push(item); state.timeline.sort((a, b) => timelineSortValue(a) - timelineSortValue(b)); renderTabView('timeline'); toast('时间节点已保存'); }
  if (form.dataset.editor === 'event') { const item = { ...values, color: index >= 0 ? state.events[index].color : ['blue', 'yellow', 'green'][state.events.length % 3] }; index >= 0 ? state.events.splice(index, 1, item) : state.events.push(item); renderTabView('events'); toast('故事事件已保存'); }
  saveDraft(true);
});

$('#chapterList').addEventListener('pointerdown', (event) => {
  const node = event.target.closest('.map-node[data-map-node]');
  if (node && !state.mapMode) { startMapNodeDrag(event, node); return; }
  if (!node && event.target.closest('#storyMapCanvas')) startMapPan(event);
});

$('#storyForm').addEventListener('submit', (event) => { event.preventDefault(); generateOutline(); });
$('#writingTipText').contentEditable = 'false';
$('#writingTipText').addEventListener('input', () => { state.writingTip = $('#writingTipText').textContent.trim(); refreshPromptPreview(); });
$('#editWritingTip').addEventListener('click', () => { const text = $('#writingTipText'); const editing = $('#editWritingTip').dataset.editing === 'true'; if (editing) { state.writingTip = text.textContent.trim() || '写下一条提醒'; text.contentEditable = 'false'; $('#editWritingTip').dataset.editing = 'false'; $('#editWritingTip').textContent = '编辑'; saveDraft(true); refreshPromptPreview(); toast('写作提示已保存'); } else { text.contentEditable = 'true'; $('#editWritingTip').dataset.editing = 'true'; $('#editWritingTip').textContent = '保存'; text.focus(); } });
$('#saveButton').addEventListener('click', () => saveDraft());
$('#exportButton').addEventListener('click', copyPrompt);
$('#downloadButton').addEventListener('click', downloadPrompt);
$('#jumpFacts').addEventListener('click', () => $('#facts').scrollIntoView({ behavior: 'smooth', block: 'center' }));
$('#viewAllButton').addEventListener('click', () => $('#outline').scrollIntoView({ behavior: 'smooth', block: 'start' }));
$('#lockFacts').addEventListener('click', (event) => { event.currentTarget.textContent = '✓'; event.currentTarget.style.color = 'var(--color-success)'; toast('故事事实已锁定'); });
function syncFactsFromDom() {
  $$('.fact-item').forEach((item, index) => { if (!state.facts[index]) return; state.facts[index].label = item.querySelector('b').textContent.trim(); state.facts[index].text = item.querySelector('p').textContent.trim(); });
}
function setFactsEditing(editing) {
  const button = $('.edit-facts');
  button.dataset.editing = String(editing); button.textContent = editing ? '保存' : '编辑';
  $$('.fact-item b, .fact-item p').forEach((item) => { item.contentEditable = String(editing); item.classList.toggle('fact-editing', editing); });
  if (editing) $('.fact-item p')?.focus();
}
$('.edit-facts').addEventListener('click', () => { const editing = $('.edit-facts').dataset.editing === 'true'; if (editing) { syncFactsFromDom(); setFactsEditing(false); saveDraft(true); toast('故事事实已保存'); } else { setFactsEditing(true); toast('可以直接修改事实内容'); } });
$('#factList').addEventListener('click', (event) => { const button = event.target.closest('[data-delete-fact]'); if (!button) return; syncFactsFromDom(); state.facts.splice(Number(button.dataset.deleteFact), 1); renderFacts(); saveDraft(true); toast('事实已删除'); });
$('#factList').addEventListener('input', () => { syncFactsFromDom(); refreshPromptPreview(); });
$('#addFact').addEventListener('click', () => { syncFactsFromDom(); state.facts.push({ label: '新事实', text: '点击“编辑”后补充这条事实。', color: ['blue', 'yellow', 'green'][state.facts.length % 3] }); renderFacts(); setFactsEditing(true); saveDraft(true); toast('已添加一条事实'); });
$('#resetButton').addEventListener('click', () => { if (!confirm('确定要清空当前草稿吗？')) return; localStorage.removeItem('storyloom-draft'); window.location.reload(); });
$('#addChapter').addEventListener('click', () => { const id = state.chapters.length ? Math.max(...state.chapters.map((chapter) => chapter.id)) + 1 : 1; const previousId = state.chapters.length ? state.chapters[state.chapters.length - 1].id : null; state.chapters.push({ id, title: '新的章节节点', summary: '写下这一章发生的关键变化，以及它如何把故事推向下一步。', primaryTag: '待补充', secondaryTags: [], status: '草稿', tone: 'blue', lane: 'main' }); ensureMapData(); if (previousId !== null) { const from = mapNodeId(previousId); const to = mapNodeId(id); if (!state.mapEdges.some((edge) => edge.from === from && edge.to === to)) state.mapEdges.push({ id: `flow-${previousId}-${id}`, from, to, type: '推进' }); } state.selectedChapterId = id; state.activeTab = 'all'; $$('.outline-tabs button').forEach((button) => { const active = button.dataset.tab === 'all'; button.classList.toggle('active', active); button.setAttribute('aria-selected', active); }); renderChapters(); saveDraft(true); toast('已添加一个章节节点，工作台已切换到它'); });
$('#addCharacter').addEventListener('click', () => { const input = $('#characterInput'); const value = input.value.trim(); if (!value) { input.focus(); return; } const parts = value.split(/[，,]/).map((part) => part.trim()).filter(Boolean); const name = parts.shift() || '未命名人物'; const role = parts.join('，') || '待补充设定'; const colors = ['blue', 'yellow', 'green']; const color = colors[state.characters.length % colors.length]; state.characters.push({ name, role, description: '待补充人物描述。', detailLabel: '秘密', detail: '待补充设定。', color }); syncTopCharacterPills(); input.value = ''; updateProgress(); saveDraft(true); refreshPromptPreview(); toast('人物已添加，详细设定可在“人物”中编辑'); });
$('#characterInput').addEventListener('keydown', (event) => { if (event.key === 'Enter') { event.preventDefault(); $('#addCharacter').click(); } });
$('#characterList').addEventListener('click', (event) => { if (event.target.tagName === 'BUTTON') { const pill = event.target.closest('.character-pill'); const name = pill.querySelector('span:nth-child(2)').firstChild.textContent.trim(); const index = state.characters.findIndex((character) => character.name === name); if (index >= 0) state.characters.splice(index, 1); pill.remove(); updateProgress(); saveDraft(true); } });
$$('.choice-chip').forEach((chip) => chip.addEventListener('click', () => { chip.classList.toggle('selected'); updateProgress(); saveDraft(true); }));
$$('.outline-tabs button').forEach((tab) => tab.addEventListener('click', () => { $$('.outline-tabs button').forEach((button) => { const selected = button === tab; button.classList.toggle('active', selected); button.setAttribute('aria-selected', selected); }); renderTabView(tab.dataset.tab); }));
$$('.view-toggle button').forEach((button) => button.addEventListener('click', () => { $$('.view-toggle button').forEach((item) => item.classList.toggle('active', item === button)); const nextTab = button.dataset.view === 'timeline' ? 'timeline' : 'all'; const tab = $(`.outline-tabs button[data-tab="${nextTab}"]`); if (tab) tab.click(); }));
['idea', 'time', 'place'].forEach((id) => $( `#${id}`).addEventListener('input', () => { updateProgress(); refreshPromptPreview(); }));
$('#storyTitle').addEventListener('input', () => { state.storyTitle = $('#storyTitle').value.trim(); refreshPromptPreview(); });

renderFacts();
syncTopCharacterPills();
$('#writingTipText').textContent = state.writingTip;
refreshPromptPreview();
loadDraft();
updateProgress();
renderChapters();
ensureMapData();
refreshPromptPreview();



