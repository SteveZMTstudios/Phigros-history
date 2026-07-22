function _createForOfIteratorHelper(r, e) { var t = "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (!t) { if (Array.isArray(r) || (t = _unsupportedIterableToArray(r)) || e && r && "number" == typeof r.length) { t && (r = t); var _n = 0, F = function F() {}; return { s: F, n: function n() { return _n >= r.length ? { done: !0 } : { done: !1, value: r[_n++] }; }, e: function e(r) { throw r; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var o, a = !0, u = !1; return { s: function s() { t = t.call(r); }, n: function n() { var r = t.next(); return a = r.done, r; }, e: function e(r) { u = !0, o = r; }, f: function f() { try { a || null == t.return || t.return(); } finally { if (u) throw o; } } }; }
function _regenerator() { /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/babel/babel/blob/main/packages/babel-helpers/LICENSE */ var e, t, r = "function" == typeof Symbol ? Symbol : {}, n = r.iterator || "@@iterator", o = r.toStringTag || "@@toStringTag"; function i(r, n, o, i) { var c = n && n.prototype instanceof Generator ? n : Generator, u = Object.create(c.prototype); return _regeneratorDefine2(u, "_invoke", function (r, n, o) { var i, c, u, f = 0, p = o || [], y = !1, G = { p: 0, n: 0, v: e, a: d, f: d.bind(e, 4), d: function d(t, r) { return i = t, c = 0, u = e, G.n = r, a; } }; function d(r, n) { for (c = r, u = n, t = 0; !y && f && !o && t < p.length; t++) { var o, i = p[t], d = G.p, l = i[2]; r > 3 ? (o = l === n) && (u = i[(c = i[4]) ? 5 : (c = 3, 3)], i[4] = i[5] = e) : i[0] <= d && ((o = r < 2 && d < i[1]) ? (c = 0, G.v = n, G.n = i[1]) : d < l && (o = r < 3 || i[0] > n || n > l) && (i[4] = r, i[5] = n, G.n = l, c = 0)); } if (o || r > 1) return a; throw y = !0, n; } return function (o, p, l) { if (f > 1) throw TypeError("Generator is already running"); for (y && 1 === p && d(p, l), c = p, u = l; (t = c < 2 ? e : u) || !y;) { i || (c ? c < 3 ? (c > 1 && (G.n = -1), d(c, u)) : G.n = u : G.v = u); try { if (f = 2, i) { if (c || (o = "next"), t = i[o]) { if (!(t = t.call(i, u))) throw TypeError("iterator result is not an object"); if (!t.done) return t; u = t.value, c < 2 && (c = 0); } else 1 === c && (t = i.return) && t.call(i), c < 2 && (u = TypeError("The iterator does not provide a '" + o + "' method"), c = 1); i = e; } else if ((t = (y = G.n < 0) ? u : r.call(n, G)) !== a) break; } catch (t) { i = e, c = 1, u = t; } finally { f = 1; } } return { value: t, done: y }; }; }(r, o, i), !0), u; } var a = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} t = Object.getPrototypeOf; var c = [][n] ? t(t([][n]())) : (_regeneratorDefine2(t = {}, n, function () { return this; }), t), u = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(c); function f(e) { return Object.setPrototypeOf ? Object.setPrototypeOf(e, GeneratorFunctionPrototype) : (e.__proto__ = GeneratorFunctionPrototype, _regeneratorDefine2(e, o, "GeneratorFunction")), e.prototype = Object.create(u), e; } return GeneratorFunction.prototype = GeneratorFunctionPrototype, _regeneratorDefine2(u, "constructor", GeneratorFunctionPrototype), _regeneratorDefine2(GeneratorFunctionPrototype, "constructor", GeneratorFunction), GeneratorFunction.displayName = "GeneratorFunction", _regeneratorDefine2(GeneratorFunctionPrototype, o, "GeneratorFunction"), _regeneratorDefine2(u), _regeneratorDefine2(u, o, "Generator"), _regeneratorDefine2(u, n, function () { return this; }), _regeneratorDefine2(u, "toString", function () { return "[object Generator]"; }), (_regenerator = function _regenerator() { return { w: i, m: f }; })(); }
function _regeneratorDefine2(e, r, n, t) { var i = Object.defineProperty; try { i({}, "", {}); } catch (e) { i = 0; } _regeneratorDefine2 = function _regeneratorDefine(e, r, n, t) { function o(r, n) { _regeneratorDefine2(e, r, function (e) { return this._invoke(r, n, e); }); } r ? i ? i(e, r, { value: n, enumerable: !t, configurable: !t, writable: !t }) : e[r] = n : (o("next", 0), o("throw", 1), o("return", 2)); }, _regeneratorDefine2(e, r, n, t); }
function asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function _asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }
function _slicedToArray(r, e) { return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t.return && (u = t.return(), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(r) { if (Array.isArray(r)) return r; }
// 简单的版本列表编辑器（无依赖，纯前端）
(function () {
  // State
  var data = {
    version: 'v?',
    details: []
  };
  var selectedIndex = -1;
  // File handle for File System Access API (when available)
  var fileHandle = null;
  // Dirty tracking: 当用户未保存修改时为 true
  var isDirty = false;
  // 当正在执行保存到文件的原生文件对话框时，抑制 beforeunload 提示
  var suppressBeforeUnload = false;

  // Elements
  var fileInput = document.getElementById('fileInput');
  var btnLoadFile = document.getElementById('btnLoadFile');
  var btnFetchSample = document.getElementById('btnFetchSample');
  var btnPaste = document.getElementById('btnPaste');
  var btnPasteBatch = document.getElementById('btnPasteBatch');
  var btnNew = document.getElementById('btnNew');
  var btnExport = document.getElementById('btnExport');
  var btnPrettyExport = document.getElementById('btnPrettyExport');
  var search = document.getElementById('search');
  var versionList = document.getElementById('versionList');
  var btnAddVersion = document.getElementById('btnAddVersion');
  var emptyNote = document.getElementById('emptyNote');
  var editorPanel = document.getElementById('editorPanel');
  var versionName = document.getElementById('versionName');
  var versionCode = document.getElementById('versionCode');
  var releaseDate = document.getElementById('releaseDate');
  var tags = document.getElementById('tags');
  var changelog = document.getElementById('changelog');
  var channelsDiv = document.getElementById('channels');
  var newChannel = document.getElementById('newChannel');
  var btnAddChannel = document.getElementById('btnAddChannel');
  var btnImportTaptap = document.getElementById('btnImportTaptap');
  var btnImportPlaystore = document.getElementById('btnImportPlaystore');
  var btnSaveChanges = document.getElementById('btnSaveChanges');
  var btnDeleteVersion = document.getElementById('btnDeleteVersion');

  // Helpers
  function detectKeyFromUrl(url) {
    if (!url) return null;
    if (url.includes('sharepoint.com') || url.includes('1drv.ms')) return 'onedrive';
    if (/123\d{3}\.com/.test(url)) return '123';
    if (url.includes('pan.huang1111.cn')) return 'huang1111';
    if (url.includes('caiyun.139.com')) return 'caiyun';
    if (url.includes('github.com')) return 'github';
    return null;
  }
  function applyChangesToMemory() {
    if (selectedIndex < 0) return;
    var d = data.details[selectedIndex];
    d.versionName = versionName.value.trim();
    d.versionCode = Number(versionCode.value) || 0;
    d.releaseDate = releaseDate.value ? releaseDate.value.replace(/-/g, '/') : '';
    d.tag = tags.value.split(',').map(function (s) {
      return s.trim();
    }).filter(Boolean);
    d.changelog = changelog.value.split('\n').map(function (s) {
      return s.trim();
    }).filter(Boolean);
    setDirty(true);
    renderList();
  }
  function updateTitleIndicator() {
    var span = document.getElementById('statusIndicator');
    if (!span) return;
    span.textContent = isDirty ? '未保存 *' : '';
    var base = '版本编辑器 — Phigros Version Editor';
    document.title = (isDirty ? '* ' : '') + base;
  }
  function setDirty(v) {
    isDirty = !!v;
    updateTitleIndicator();
  }
  function renderList() {
    versionList.innerHTML = '';
    var q = search.value.trim().toLowerCase();

    // 排序：按 versionCode 降序，若相同则按 versionName 降序
    var items = data.details.map(function (d, i) {
      return {
        d: d,
        i: i
      };
    });
    items.sort(function (a, b) {
      var vA = Number(a.d.versionCode) || 0;
      var vB = Number(b.d.versionCode) || 0;
      if (vB !== vA) return vB - vA;
      return (b.d.versionName || '').localeCompare(a.d.versionName || '', undefined, {
        numeric: true
      });
    });
    items.forEach(function (_ref) {
      var d = _ref.d,
        i = _ref.i;
      var text = (d.versionName || '').toLowerCase() + ' ' + (d.changelog || []).join(' ').toLowerCase();
      if (q && text.indexOf(q) === -1) return;
      var li = document.createElement('li');
      li.textContent = d.versionName || "#".concat(i);

      // 计算链接相关信息
      var linkCount = 0;
      var hasPlay = false,
        hasTap = false,
        hasOther = false;
      if (d.downloads) {
        Object.entries(d.downloads).forEach(function (_ref2) {
          var _ref3 = _slicedToArray(_ref2, 2),
            chan = _ref3[0],
            obj = _ref3[1];
          var urls = Object.values(obj || {}).filter(function (u) {
            return u && u.trim();
          });
          if (urls.length === 0) return;
          linkCount += urls.length;
          var name = (chan || '').toLowerCase();
          if (name.includes('play')) hasPlay = true;else if (name.includes('taptap')) hasTap = true;else hasOther = true;
        });
      }
      li.classList.toggle('no-links', linkCount === 0);
      li.classList.toggle('one-link', linkCount === 1);

      // 权限徽章（右侧小点）
      var badges = document.createElement('span');
      badges.className = 'badges';
      if (hasPlay) {
        var b = document.createElement('span');
        b.className = 'dot play';
        b.title = 'Play 商店链接';
        badges.appendChild(b);
      }
      if (hasTap) {
        var _b = document.createElement('span');
        _b.className = 'dot tap';
        _b.title = 'TapTap 链接';
        badges.appendChild(_b);
      }
      if (hasOther) {
        var _b2 = document.createElement('span');
        _b2.className = 'dot other';
        _b2.title = '其他链接';
        badges.appendChild(_b2);
      }
      li.appendChild(badges);
      li.classList.toggle('active', i === selectedIndex);
      li.onclick = function () {
        selectIndex(i);
      };
      versionList.appendChild(li);
    });
  }
  function selectIndex(i) {
    selectedIndex = i;
    if (i < 0 || !data.details[i]) {
      editorPanel.classList.add('hidden');
      emptyNote.style.display = 'block';
      renderList();
      return;
    }
    emptyNote.style.display = 'none';
    editorPanel.classList.remove('hidden');
    var d = data.details[i];
    versionName.value = d.versionName || '';
    versionCode.value = d.versionCode || '';
    releaseDate.value = d.releaseDate ? d.releaseDate.replace(/\//g, '-') : '';
    tags.value = (d.tag || []).join(',');
    changelog.value = (d.changelog || []).join('\n');
    renderChannels(d);
    // attach listeners to auto-apply changes to memory
    versionName.oninput = applyChangesToMemory;
    versionCode.oninput = applyChangesToMemory;
    releaseDate.onchange = applyChangesToMemory;
    tags.oninput = applyChangesToMemory;
    changelog.oninput = applyChangesToMemory;
    renderList();
  }
  function renderChannels(d) {
    channelsDiv.innerHTML = '';
    d.downloads = d.downloads || {};
    Object.keys(d.downloads).forEach(function (channelName) {
      var container = createChannelBlock(channelName, d.downloads[channelName]);
      channelsDiv.appendChild(container);
    });
  }
  function createChannelBlock(name, obj) {
    var div = document.createElement('div');
    div.className = 'channel';
    var h4 = document.createElement('h4');
    var title = document.createElement('span');
    title.textContent = name;
    var actions = document.createElement('span');
    var btnAddLink = document.createElement('button');
    btnAddLink.textContent = '添加条目';
    var btnDeleteChan = document.createElement('button');
    btnDeleteChan.textContent = '删除渠道';
    actions.appendChild(btnAddLink);
    actions.appendChild(btnDeleteChan);
    h4.appendChild(title);
    h4.appendChild(actions);
    div.appendChild(h4);
    var links = document.createElement('div');
    links.className = 'links';
    Object.keys(obj || {}).forEach(function (k) {
      links.appendChild(createLinkRow(name, k, obj[k]));
    });
    div.appendChild(links);
    btnAddLink.onclick = /*#__PURE__*/_asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee() {
      var pasted, url, key;
      return _regenerator().w(function (_context) {
        while (1) switch (_context.n) {
          case 0:
            _context.n = 1;
            return navigator.clipboard.readText().catch(function () {
              return null;
            });
          case 1:
            pasted = _context.v;
            url = pasted && pasted.startsWith('http') ? pasted : prompt('链接');
            if (url) {
              _context.n = 2;
              break;
            }
            return _context.a(2);
          case 2:
            key = detectKeyFromUrl(url);
            if (!key) {
              key = prompt('无法自动识别键名，请输入（如 123, huang1111, github 等）');
            }
            if (key) {
              _context.n = 3;
              break;
            }
            return _context.a(2);
          case 3:
            obj[key] = url;
            links.appendChild(createLinkRow(name, key, url));
            commitDownloadChange(name, obj);
            setDirty(true);
            renderList();
          case 4:
            return _context.a(2);
        }
      }, _callee);
    }));
    btnDeleteChan.onclick = function () {
      if (!confirm('确认删除渠道 “' + name + '”？')) return;
      var d = data.details[selectedIndex];
      delete d.downloads[name];
      renderChannels(d);
      setDirty(true);
      renderList();
    };
    return div;
  }
  function createLinkRow(channel, key, value) {
    var row = document.createElement('div');
    row.className = 'link-row';
    var keyInput = document.createElement('input');
    keyInput.value = key;
    var urlInput = document.createElement('input');
    urlInput.value = value || '';
    var btnOpen = document.createElement('button');
    btnOpen.textContent = '打开';
    var btnCheck = document.createElement('button');
    btnCheck.textContent = '小窗检查';
    var btnDel = document.createElement('button');
    btnDel.textContent = '删除';
    btnOpen.onclick = function () {
      window.open(urlInput.value, '_blank');
    };
    btnCheck.onclick = function () {
      openSmallWindow(urlInput.value);
    };
    btnDel.onclick = function () {
      if (!confirm('删除此下载条目?')) return;
      var d = data.details[selectedIndex];
      if (d && d.downloads) {
        if (d.downloads[channel] && d.downloads[channel][key]) delete d.downloads[channel][key];
        renderChannels(d);
        renderList();
      }
    };
    keyInput.onchange = function () {
      var newKey = keyInput.value.trim();
      if (!newKey || newKey === key) return;
      var d = data.details[selectedIndex];
      if (d.downloads[channel][newKey]) {
        alert('键名已存在');
        keyInput.value = key;
        return;
      }
      d.downloads[channel][newKey] = d.downloads[channel][key];
      delete d.downloads[channel][key];
      key = newKey; // update local key
      setDirty(true);
      renderList();
    };
    urlInput.onchange = function () {
      commitUrlChange(channel, key, urlInput.value);
      setDirty(true);
      renderList();
    };
    row.appendChild(keyInput);
    row.appendChild(urlInput);
    row.appendChild(btnOpen);
    row.appendChild(btnCheck);
    row.appendChild(btnDel);
    return row;
  }
  function openSmallWindow(url) {
    if (!url) return alert('空链接');
    var w = 900,
      h = 650;
    var left = (screen.width - w) / 2;
    var top = (screen.height - h) / 2;
    // open with minimal features so user can quickly check
    window.open(url, '_phigros_link', 'toolbar=no,menubar=no,scrollbars=yes,resizable=yes,width=' + w + ',height=' + h + ',top=' + top + ',left=' + left);
  }
  function commitDownloadChange(channel, obj) {
    var d = data.details[selectedIndex];
    d.downloads[channel] = obj; // ensure saved
  }
  function commitUrlChange(channel, key, url) {
    var d = data.details[selectedIndex];
    if (!d.downloads) d.downloads = {};
    if (!d.downloads[channel]) d.downloads[channel] = {};
    d.downloads[channel][key] = url;
  }

  // Actions
  btnAddVersion.onclick = function () {
    var v = {
      versionName: 'vNew',
      versionCode: 0,
      releaseDate: '',
      changelog: [],
      downloads: {}
    };
    data.details.unshift(v);
    selectIndex(0);
    renderList();
    setDirty(true);
  };
  btnSaveChanges.onclick = function () {
    if (selectedIndex < 0) return;
    var d = data.details[selectedIndex];
    d.versionName = versionName.value.trim();
    d.versionCode = Number(versionCode.value) || 0;
    d.releaseDate = releaseDate.value ? releaseDate.value : ''; // keep as-is
    d.tag = tags.value.split(',').map(function (s) {
      return s.trim();
    }).filter(Boolean);
    d.changelog = changelog.value.split('\n').map(function (s) {
      return s.trim();
    }).filter(Boolean);
    renderList();
    setDirty(true);
    alert('保存成功（编辑器已保存到内存）。如需写入磁盘，请使用“保存到文件…”或“导出”。');
  };
  btnDeleteVersion.onclick = function () {
    if (selectedIndex < 0) return;
    if (!confirm('确认删除版本 ' + (data.details[selectedIndex].versionName || '') + ' ?')) return;
    data.details.splice(selectedIndex, 1);
    selectedIndex = -1;
    selectIndex(-1);
    renderList();
    setDirty(true);
  };
  btnAddChannel.onclick = function () {
    if (selectedIndex < 0) return alert('请选择版本');
    var name = newChannel.value.trim();
    if (!name) return alert('请输入渠道名');
    var d = data.details[selectedIndex];
    d.downloads = d.downloads || {};
    d.downloads[name] = d.downloads[name] || {};
    renderChannels(d);
    newChannel.value = '';
    setDirty(true);
  };
  function importFromClipboard(_x) {
    return _importFromClipboard.apply(this, arguments);
  }
  function _importFromClipboard() {
    _importFromClipboard = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee6(channelName) {
      var txt, url, key, d;
      return _regenerator().w(function (_context6) {
        while (1) switch (_context6.n) {
          case 0:
            if (!(selectedIndex < 0)) {
              _context6.n = 1;
              break;
            }
            return _context6.a(2, alert('请选择版本'));
          case 1:
            _context6.n = 2;
            return navigator.clipboard.readText().catch(function () {
              return null;
            });
          case 2:
            txt = _context6.v;
            if (txt) {
              _context6.n = 3;
              break;
            }
            return _context6.a(2, alert('剪贴板没有文本或读取失败'));
          case 3:
            url = txt.trim();
            if (url.startsWith('http')) {
              _context6.n = 4;
              break;
            }
            return _context6.a(2, alert('剪贴板内容不是有效的URL'));
          case 4:
            key = detectKeyFromUrl(url);
            if (!key) {
              key = prompt('无法自动识别键名，请输入（如 123, huang1111, github 等）');
            }
            if (key) {
              _context6.n = 5;
              break;
            }
            return _context6.a(2);
          case 5:
            d = data.details[selectedIndex];
            d.downloads = d.downloads || {};
            d.downloads[channelName] = d.downloads[channelName] || {};
            d.downloads[channelName][key] = url;
            renderChannels(d);
            setDirty(true);
            renderList();
            alert("已添加到 ".concat(channelName));
          case 6:
            return _context6.a(2);
        }
      }, _callee6);
    }));
    return _importFromClipboard.apply(this, arguments);
  }
  btnImportTaptap.onclick = function () {
    return importFromClipboard('taptap');
  };
  btnImportPlaystore.onclick = function () {
    return importFromClipboard('playstore');
  };

  // Import/export (支持 File System Access API 的文件流优先方案)
  btnLoadFile.onclick = /*#__PURE__*/_asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee2() {
    var _yield$window$showOpe, _yield$window$showOpe2, handle, file, txt, _t;
    return _regenerator().w(function (_context2) {
      while (1) switch (_context2.p = _context2.n) {
        case 0:
          if (!window.showOpenFilePicker) {
            _context2.n = 6;
            break;
          }
          _context2.p = 1;
          _context2.n = 2;
          return window.showOpenFilePicker({
            types: [{
              description: 'JSON',
              accept: {
                'application/json': ['.json']
              }
            }],
            multiple: false
          });
        case 2:
          _yield$window$showOpe = _context2.v;
          _yield$window$showOpe2 = _slicedToArray(_yield$window$showOpe, 1);
          handle = _yield$window$showOpe2[0];
          fileHandle = handle;
          _context2.n = 3;
          return handle.getFile();
        case 3:
          file = _context2.v;
          _context2.n = 4;
          return file.text();
        case 4:
          txt = _context2.v;
          data = JSON.parse(txt);
          setDirty(false);
          selectedIndex = -1;
          selectIndex(-1);
          renderList();
          alert('文件已载入: ' + (handle.name || '(unknown)'));
          return _context2.a(2);
        case 5:
          _context2.p = 5;
          _t = _context2.v;
        case 6:
          fileInput.click();
        case 7:
          return _context2.a(2);
      }
    }, _callee2, null, [[1, 5]]);
  }));
  fileInput.onchange = function (e) {
    var f = e.target.files[0];
    if (!f) return;
    var reader = new FileReader();
    reader.onload = function () {
      try {
        data = JSON.parse(reader.result);
        selectedIndex = -1;
        selectIndex(-1);
        renderList();
        setDirty(false);
        alert('载入成功');
      } catch (err) {
        alert('JSON解析失败: ' + err);
      }
    };
    reader.readAsText(f);
  };
  btnFetchSample.onclick = /*#__PURE__*/_asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee3() {
    var res, _t2;
    return _regenerator().w(function (_context3) {
      while (1) switch (_context3.p = _context3.n) {
        case 0:
          _context3.p = 0;
          _context3.n = 1;
          return fetch('/api/v1/versions/1.json?t=' + Date.now());
        case 1:
          res = _context3.v;
          if (res.ok) {
            _context3.n = 2;
            break;
          }
          throw new Error('网络返回 ' + res.status);
        case 2:
          _context3.n = 3;
          return res.json();
        case 3:
          data = _context3.v;
          selectedIndex = -1;
          selectIndex(-1);
          renderList();
          alert('从仓库示例载入成功');
          _context3.n = 5;
          break;
        case 4:
          _context3.p = 4;
          _t2 = _context3.v;
          alert('无法通过网络加载示例（可能被CORS阻止）。你可以手动使用“从文件载入”或“粘贴JSON”。');
        case 5:
          return _context3.a(2);
      }
    }, _callee3, null, [[0, 4]]);
  }));
  btnPaste.onclick = /*#__PURE__*/_asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee4() {
    var txt;
    return _regenerator().w(function (_context4) {
      while (1) switch (_context4.n) {
        case 0:
          _context4.n = 1;
          return navigator.clipboard.readText().catch(function () {
            return null;
          });
        case 1:
          txt = _context4.v;
          if (txt) {
            _context4.n = 2;
            break;
          }
          return _context4.a(2, alert('剪贴板没有文本或读取失败'));
        case 2:
          try {
            data = JSON.parse(txt);
            selectedIndex = -1;
            selectIndex(-1);
            renderList();
            alert('粘贴并载入JSON成功');
          } catch (e) {
            alert('JSON解析失败: ' + e);
          }
        case 3:
          return _context4.a(2);
      }
    }, _callee4);
  }));

  // 粘贴批量版本日志并解析（支持样例格式）
  btnPasteBatch.onclick = /*#__PURE__*/_asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee5() {
    var txt, parsed, existingMap, newCount, updatedCount, skippedCount, doOverwrite;
    return _regenerator().w(function (_context5) {
      while (1) switch (_context5.n) {
        case 0:
          _context5.n = 1;
          return navigator.clipboard.readText().catch(function () {
            return null;
          });
        case 1:
          txt = _context5.v;
          if (txt) {
            _context5.n = 2;
            break;
          }
          return _context5.a(2, alert('剪贴板没有文本或读取失败'));
        case 2:
          parsed = parseBatchVersions(txt);
          if (!(!parsed || !parsed.length)) {
            _context5.n = 3;
            break;
          }
          return _context5.a(2, alert('未解析到任何版本'));
        case 3:
          // 检查与现有版本是否冲突
          existingMap = {};
          data.details.forEach(function (d) {
            if (d.versionName) existingMap[d.versionName] = d;
          });
          newCount = 0, updatedCount = 0, skippedCount = 0; // ask user whether to overwrite existing entries
          doOverwrite = confirm("检测到 ".concat(parsed.length, " 条版本，若存在同名版本是否覆盖？ 按“确定”覆盖，按“取消”跳过已有版本。"));
          parsed.forEach(function (item) {
            // normalize versionName to start with 'v'
            var vname = item.versionName && item.versionName.startsWith('v') ? item.versionName : 'v' + item.versionName;
            item.versionName = vname;
            var exists = data.details.findIndex(function (d) {
              return d.versionName === vname;
            });
            if (exists >= 0) {
              if (doOverwrite) {
                // merge: replace changelog and releaseDate/versionCode, keep downloads if any
                var target = data.details[exists];
                target.versionCode = item.versionCode || target.versionCode;
                target.releaseDate = item.releaseDate || target.releaseDate;
                target.changelog = item.changelog || target.changelog;
                if (item.tag && item.tag.length) target.tag = item.tag;
                updatedCount++;
              } else {
                skippedCount++;
              }
            } else {
              // insert at front
              data.details.unshift(item);
              newCount++;
            }
          });
          setDirty(true);
          renderList();
          alert("完成：新增 ".concat(newCount, "，更新 ").concat(updatedCount, "，跳过 ").concat(skippedCount));
        case 4:
          return _context5.a(2);
      }
    }, _callee5);
  }));

  // 解析批量版本文本，返回 [{versionName, versionCode, releaseDate, changelog:[]}, ...]
  function parseBatchVersions(text) {
    var lines = text.split(/\r?\n/);
    var results = [];
    var current = null;
    var verRe = /^\s*Version\s+([^\s]+)\s*\((\d+)\)\s*(\d{4}[\-/]\d{1,2}[\-/]\d{1,2})?\s*$/i;
    var _iterator = _createForOfIteratorHelper(lines),
      _step;
    try {
      for (_iterator.s(); !(_step = _iterator.n()).done;) {
        var raw = _step.value;
        var line = raw.trim();
        if (!line) continue;
        var m = line.match(verRe);
        if (m) {
          // start new
          if (current) results.push(current);
          current = {
            versionName: m[1].trim(),
            versionCode: Number(m[2]) || 0,
            releaseDate: m[3] ? m[3].replace(/-/g, '/') : '',
            changelog: []
          };
          continue;
        }
        if (!current) continue; // ignore text before first Version
        // filter out numbering headers like "1." or bullets
        var clean = line.replace(/^\d+\.\s*/, '').replace(/^•\s*/, '').replace(/^\u2022\s*/, '');
        // remove leading special bullets like • or -
        clean = clean.replace(/^[\-\u2022\u2023\u25E6\*\s]+/, '');
        if (clean) current.changelog.push(clean);
      }
    } catch (err) {
      _iterator.e(err);
    } finally {
      _iterator.f();
    }
    if (current) results.push(current);
    return results;
  }
  btnExport.onclick = function () {
    var blob = new Blob([JSON.stringify(data)], {
      type: 'application/json'
    });
    var url = URL.createObjectURL(blob);
    var a = document.createElement('a');
    a.href = url;
    a.download = 'versions.json';
    a.click();
    URL.revokeObjectURL(url);
    // 视为 "已导出"，如果希望把导出视作保存，则可以取消下一行注释
    // setDirty(false);
  };
  btnPrettyExport.onclick = function () {
    var blob = new Blob([JSON.stringify(data, null, 2)], {
      type: 'application/json'
    });
    var url = URL.createObjectURL(blob);
    var a = document.createElement('a');
    a.href = url;
    a.download = 'versions.prettified.json';
    a.click();
    URL.revokeObjectURL(url);
    // setDirty(false);
  };

  // 保存到文件（使用 File System Access API，当不可用时回退到导出）
  var btnSaveToFile = document.getElementById('btnSaveToFile');
  function saveToFile() {
    return _saveToFile.apply(this, arguments);
  }
  function _saveToFile() {
    _saveToFile = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee7() {
      var prevSuppress, writable, _t3;
      return _regenerator().w(function (_context7) {
        while (1) switch (_context7.p = _context7.n) {
          case 0:
            prevSuppress = suppressBeforeUnload;
            _context7.p = 1;
            // 防止在文件对话框期间触发 beforeunload 提示
            suppressBeforeUnload = true;
            if (!window.showSaveFilePicker) {
              _context7.n = 7;
              break;
            }
            if (fileHandle) {
              _context7.n = 3;
              break;
            }
            _context7.n = 2;
            return window.showSaveFilePicker({
              suggestedName: 'versions.json',
              types: [{
                description: 'JSON',
                accept: {
                  'application/json': ['.json']
                }
              }]
            });
          case 2:
            fileHandle = _context7.v;
          case 3:
            _context7.n = 4;
            return fileHandle.createWritable();
          case 4:
            writable = _context7.v;
            _context7.n = 5;
            return writable.write(JSON.stringify(data, null, 2));
          case 5:
            _context7.n = 6;
            return writable.close();
          case 6:
            setDirty(false);
            alert('已保存到文件：' + (fileHandle.name || '(unknown)'));
            return _context7.a(2);
          case 7:
            // 回退：使用导出作为保存方法
            btnPrettyExport.click();
            setDirty(false);
            alert('您的浏览器不支持直接写文件，已使用导出作为回退。');
          case 8:
            _context7.n = 10;
            break;
          case 9:
            _context7.p = 9;
            _t3 = _context7.v;
            // 取消或错误不会清除未保存标记，以免丢失变更
            alert('保存失败: ' + _t3);
          case 10:
            _context7.p = 10;
            suppressBeforeUnload = prevSuppress;
            return _context7.f(10);
          case 11:
            return _context7.a(2);
        }
      }, _callee7, null, [[1, 9, 10, 11]]);
    }));
    return _saveToFile.apply(this, arguments);
  }
  btnSaveToFile.onclick = saveToFile;

  // Search
  search.oninput = function () {
    return renderList();
  };

  // beforeunload：如果有未保存修改，提示用户
  window.addEventListener('beforeunload', function (e) {
    // 在执行保存到文件时，原生文件对话框可能被视为导航，抑制该场景下的提示
    if (isDirty && !suppressBeforeUnload) {
      e.preventDefault();
      e.returnValue = '';
      return '';
    }
  });

  // Init
  function initSample() {
    // if repo has a local copy copy? leave empty by default
    data = {
      version: 'v1',
      details: []
    };
    // try to load the existing file (if served) silently
    fetch('/api/v1/versions/1.json?t=' + Date.now()).then(function (r) {
      return r.json();
    }).then(function (j) {
      if (j && j.details) {
        data = j;
        renderList();
      }
    }).catch(function () {});
    renderList();
    setDirty(false);
  }
  initSample();
})();
