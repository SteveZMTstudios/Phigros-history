// 简单的版本列表编辑器（无依赖，纯前端）
(function(){
  // State
  let data = {version:'v?',details:[]};
  let selectedIndex = -1;
  // File handle for File System Access API (when available)
  let fileHandle = null;
  // Dirty tracking: 当用户未保存修改时为 true
  let isDirty = false;

  // Elements
  const fileInput = document.getElementById('fileInput');
  const btnLoadFile = document.getElementById('btnLoadFile');
  const btnFetchSample = document.getElementById('btnFetchSample');
  const btnPaste = document.getElementById('btnPaste');
  const btnPasteBatch = document.getElementById('btnPasteBatch');
  const btnNew = document.getElementById('btnNew');
  const btnExport = document.getElementById('btnExport');
  const btnPrettyExport = document.getElementById('btnPrettyExport');
  const search = document.getElementById('search');

  const versionList = document.getElementById('versionList');
  const btnAddVersion = document.getElementById('btnAddVersion');

  const emptyNote = document.getElementById('emptyNote');
  const editorPanel = document.getElementById('editorPanel');

  const versionName = document.getElementById('versionName');
  const versionCode = document.getElementById('versionCode');
  const releaseDate = document.getElementById('releaseDate');
  const tags = document.getElementById('tags');
  const changelog = document.getElementById('changelog');
  const channelsDiv = document.getElementById('channels');
  const newChannel = document.getElementById('newChannel');
  const btnAddChannel = document.getElementById('btnAddChannel');
  const btnPasteLink = document.getElementById('btnPasteLink');

  const btnSaveChanges = document.getElementById('btnSaveChanges');
  const btnDeleteVersion = document.getElementById('btnDeleteVersion');

  // Helpers
  function updateTitleIndicator(){
    const span = document.getElementById('statusIndicator');
    if(!span) return;
    span.textContent = isDirty ? '未保存 *' : '';
    const base = '版本编辑器 — Phigros Version Editor';
    document.title = (isDirty ? '* ' : '') + base;
  }
  function setDirty(v){ isDirty = !!v; updateTitleIndicator(); }

  function renderList(){
    versionList.innerHTML = '';
    const q = search.value.trim().toLowerCase();
    data.details.forEach((d,i)=>{
      const text = (d.versionName||'').toLowerCase() + ' ' + (d.changelog||[]).join(' ').toLowerCase();
      if(q && text.indexOf(q) === -1) return;
      const li = document.createElement('li');
      li.textContent = d.versionName || `#${i}`;
      li.classList.toggle('active', i === selectedIndex);
      li.onclick = ()=>{ selectIndex(i); };
      versionList.appendChild(li);
    });
  }

  function selectIndex(i){
    selectedIndex = i;
    if(i < 0 || !data.details[i]){
      editorPanel.classList.add('hidden'); emptyNote.style.display='block';
      renderList();
      return;
    }
    emptyNote.style.display='none'; editorPanel.classList.remove('hidden');
    const d = data.details[i];
    versionName.value = d.versionName || '';
    versionCode.value = d.versionCode || '';
    releaseDate.value = d.releaseDate ? d.releaseDate.replace(/\//g,'-') : '';
    tags.value = (d.tag || []).join(',');
    changelog.value = (d.changelog || []).join('\n');
    renderChannels(d);
    // attach listeners to mark dirty when fields change
    versionName.oninput = ()=> setDirty(true);
    versionCode.oninput = ()=> setDirty(true);
    releaseDate.onchange = ()=> setDirty(true);
    tags.oninput = ()=> setDirty(true);
    changelog.oninput = ()=> setDirty(true);
    renderList();
  }

  function renderChannels(d){
    channelsDiv.innerHTML = '';
    d.downloads = d.downloads || {};
    Object.keys(d.downloads).forEach(channelName=>{
      const container = createChannelBlock(channelName, d.downloads[channelName]);
      channelsDiv.appendChild(container);
    });
  }

  function createChannelBlock(name, obj){
    const div = document.createElement('div'); div.className='channel';
    const h4 = document.createElement('h4');
    const title = document.createElement('span'); title.textContent = name;
    const actions = document.createElement('span');
    const btnAddLink = document.createElement('button'); btnAddLink.textContent='添加条目';
    const btnDeleteChan = document.createElement('button'); btnDeleteChan.textContent='删除渠道';
    actions.appendChild(btnAddLink); actions.appendChild(btnDeleteChan);
    h4.appendChild(title); h4.appendChild(actions);
    div.appendChild(h4);

    const links = document.createElement('div'); links.className='links';
    Object.keys(obj||{}).forEach(k=>{
      links.appendChild(createLinkRow(name,k,obj[k]));
    });
    div.appendChild(links);

    btnAddLink.onclick = async ()=>{
      const key = prompt('键名（如 123, huang1111, github 等）');
      if(!key) return;
      const pasted = await navigator.clipboard.readText().catch(()=>null);
      const url = pasted && pasted.startsWith('http') ? pasted : prompt('链接');
      if(!url) return;
      obj[key]=url;
      links.appendChild(createLinkRow(name,key,url));
      commitDownloadChange(name,obj);
      setDirty(true);
    };
    btnDeleteChan.onclick = ()=>{
      if(!confirm('确认删除渠道 “'+name+'”？')) return;
      const d = data.details[selectedIndex];
      delete d.downloads[name];
      renderChannels(d);
      setDirty(true);
    };

    return div;
  }

  function createLinkRow(channel,key,value){
    const row = document.createElement('div'); row.className='link-row';
    const keyInput = document.createElement('input'); keyInput.value = key; keyInput.disabled = true;
    const urlInput = document.createElement('input'); urlInput.value = value || '';
    const btnOpen = document.createElement('button'); btnOpen.textContent='打开';
    const btnCheck = document.createElement('button'); btnCheck.textContent='小窗检查';
    const btnDel = document.createElement('button'); btnDel.textContent='删除';

    btnOpen.onclick = ()=>{ window.open(urlInput.value,'_blank'); };
    btnCheck.onclick = ()=>{ openSmallWindow(urlInput.value); };
    btnDel.onclick = ()=>{
      if(!confirm('删除此下载条目?')) return;
      const d = data.details[selectedIndex];
      if(d && d.downloads){
        if(d.downloads[channel] && d.downloads[channel][key]) delete d.downloads[channel][key];
        renderChannels(d);
      }
    };

    urlInput.onchange = ()=>{ commitUrlChange(channel,key,urlInput.value); setDirty(true); };

    row.appendChild(keyInput); row.appendChild(urlInput);
    row.appendChild(btnOpen); row.appendChild(btnCheck); row.appendChild(btnDel);
    return row;
  }

  function openSmallWindow(url){
    if(!url) return alert('空链接');
    const w = 900, h = 650; const left = (screen.width-w)/2; const top = (screen.height-h)/2;
    // open with minimal features so user can quickly check
    window.open(url,'_phigros_link','toolbar=no,menubar=no,scrollbars=yes,resizable=yes,width='+w+',height='+h+',top='+top+',left='+left);
  }

  function commitDownloadChange(channel,obj){
    const d = data.details[selectedIndex]; d.downloads[channel]=obj; // ensure saved
  }

  function commitUrlChange(channel,key,url){
    const d = data.details[selectedIndex]; if(!d.downloads) d.downloads = {};
    if(!d.downloads[channel]) d.downloads[channel]={};
    d.downloads[channel][key]=url;
  }

  // Actions
  btnAddVersion.onclick = ()=>{
    const v = {versionName:'vNew',versionCode:0,releaseDate:'',changelog:[],downloads:{}}
    data.details.unshift(v); selectIndex(0); renderList();
    setDirty(true);
  };

  btnSaveChanges.onclick = ()=>{
    if(selectedIndex<0) return;
    const d = data.details[selectedIndex];
    d.versionName = versionName.value.trim();
    d.versionCode = Number(versionCode.value)||0;
    d.releaseDate = releaseDate.value ? releaseDate.value : ''; // keep as-is
    d.tag = tags.value.split(',').map(s=>s.trim()).filter(Boolean);
    d.changelog = changelog.value.split('\n').map(s=>s.trim()).filter(Boolean);
    renderList();
    setDirty(true);
    alert('保存成功（编辑器已保存到内存）。如需写入磁盘，请使用“保存到文件…”或“导出”。');
  };

  btnDeleteVersion.onclick = ()=>{
    if(selectedIndex<0) return;
    if(!confirm('确认删除版本 '+(data.details[selectedIndex].versionName||'')+' ?')) return;
    data.details.splice(selectedIndex,1);
    selectedIndex = -1; selectIndex(-1); renderList();
    setDirty(true);
  };

  btnAddChannel.onclick = ()=>{
    if(selectedIndex<0) return alert('请选择版本');
    const name = newChannel.value.trim(); if(!name) return alert('请输入渠道名');
    const d = data.details[selectedIndex]; d.downloads = d.downloads||{}; d.downloads[name] = d.downloads[name] || {};
    renderChannels(d); newChannel.value='';
    setDirty(true);
  };

  btnPasteLink.onclick = async ()=>{
    if(selectedIndex<0) return alert('请选择版本');
    const txt = await navigator.clipboard.readText().catch(()=>null);
    if(!txt) return alert('剪贴板没有文本或读取失败');
    const url = txt.trim(); if(!url.startsWith('http')) return alert('剪贴板内容不是有效的URL');
    // prompt for channel and key
    const channel = prompt('渠道名 (如 taptap)') || 'taptap';
    const key = prompt('键名 (如 huang1111)') || 'pasted';
    const d = data.details[selectedIndex]; d.downloads = d.downloads || {};
    d.downloads[channel] = d.downloads[channel]||{}; d.downloads[channel][key]=url;
    renderChannels(d);
    setDirty(true);
    alert('已添加');
  };

  // Import/export (支持 File System Access API 的文件流优先方案)
  btnLoadFile.onclick = async ()=>{
    if(window.showOpenFilePicker){
      try{
        const [handle] = await window.showOpenFilePicker({types:[{description:'JSON',accept:{'application/json':['.json']}}], multiple:false});
        fileHandle = handle;
        const file = await handle.getFile();
        const txt = await file.text();
        data = JSON.parse(txt);
        setDirty(false);
        selectedIndex=-1; selectIndex(-1); renderList();
        alert('文件已载入: ' + (handle.name||'(unknown)'));
        return;
      }catch(e){ /* 用户取消或失败，回退到 input */ }
    }
    fileInput.click();
  };
  fileInput.onchange = e=>{
    const f = e.target.files[0]; if(!f) return;
    const reader = new FileReader();
    reader.onload = ()=>{
      try{ data = JSON.parse(reader.result); selectedIndex=-1; selectIndex(-1); renderList(); setDirty(false); alert('载入成功'); }
      catch(err){ alert('JSON解析失败: '+err); }
    };
    reader.readAsText(f);
  };

  btnFetchSample.onclick = async ()=>{
    // try fetch with possible relative path
    try{
      const res = await fetch('/api/v1/versions/1.json');
      if(!res.ok) throw new Error('网络返回 '+res.status);
      data = await res.json(); selectedIndex=-1; selectIndex(-1); renderList(); alert('从仓库示例载入成功');
    }catch(e){
      alert('无法通过网络加载示例（可能被CORS阻止）。你可以手动使用“从文件载入”或“粘贴JSON”。');
    }
  };

  btnPaste.onclick = async ()=>{
    const txt = await navigator.clipboard.readText().catch(()=>null);
    if(!txt) return alert('剪贴板没有文本或读取失败');
    try{ data = JSON.parse(txt); selectedIndex=-1; selectIndex(-1); renderList(); alert('粘贴并载入JSON成功'); }
    catch(e){ alert('JSON解析失败: '+e); }
  };

  // 粘贴批量版本日志并解析（支持样例格式）
  btnPasteBatch.onclick = async ()=>{
    const txt = await navigator.clipboard.readText().catch(()=>null);
    if(!txt) return alert('剪贴板没有文本或读取失败');
    const parsed = parseBatchVersions(txt);
    if(!parsed || !parsed.length) return alert('未解析到任何版本');
    // 检查与现有版本是否冲突
    const existingMap = {};
    data.details.forEach(d=>{ if(d.versionName) existingMap[d.versionName]=d; });
    let newCount=0, updatedCount=0, skippedCount=0;
    // ask user whether to overwrite existing entries
    const doOverwrite = confirm(`检测到 ${parsed.length} 条版本，若存在同名版本是否覆盖？ 按“确定”覆盖，按“取消”跳过已有版本。`);
    parsed.forEach(item=>{
      // normalize versionName to start with 'v'
      const vname = item.versionName && item.versionName.startsWith('v') ? item.versionName : ('v'+item.versionName);
      item.versionName = vname;
      const exists = data.details.findIndex(d=>d.versionName === vname);
      if(exists >= 0){
        if(doOverwrite){
          // merge: replace changelog and releaseDate/versionCode, keep downloads if any
          const target = data.details[exists];
          target.versionCode = item.versionCode || target.versionCode;
          target.releaseDate = item.releaseDate || target.releaseDate;
          target.changelog = item.changelog || target.changelog;
          if(item.tag && item.tag.length) target.tag = item.tag;
          updatedCount++;
        }else{
          skippedCount++;
        }
      }else{
        // insert at front
        data.details.unshift(item);
        newCount++;
      }
    });
    setDirty(true);
    renderList();
    alert(`完成：新增 ${newCount}，更新 ${updatedCount}，跳过 ${skippedCount}`);
  };

  // 解析批量版本文本，返回 [{versionName, versionCode, releaseDate, changelog:[]}, ...]
  function parseBatchVersions(text){
    const lines = text.split(/\r?\n/);
    const results = [];
    let current = null;
    const verRe = /^\s*Version\s+([^\s]+)\s*\((\d+)\)\s*(\d{4}[\-/]\d{1,2}[\-/]\d{1,2})?\s*$/i;
    for(let raw of lines){
      const line = raw.trim();
      if(!line) continue;
      const m = line.match(verRe);
      if(m){
        // start new
        if(current) results.push(current);
        current = {versionName: m[1].trim(), versionCode: Number(m[2])||0, releaseDate: m[3] ? m[3].replace(/-/g,'/'): '', changelog: []};
        continue;
      }
      if(!current) continue; // ignore text before first Version
      // filter out numbering headers like "1." or bullets
      let clean = line.replace(/^\d+\.\s*/,'').replace(/^•\s*/,'').replace(/^\u2022\s*/,'');
      // remove leading special bullets like • or -
      clean = clean.replace(/^[\-\u2022\u2023\u25E6\*\s]+/,'');
      if(clean) current.changelog.push(clean);
    }
    if(current) results.push(current);
    return results;
  }

  btnExport.onclick = ()=>{
    const blob = new Blob([JSON.stringify(data)],{type:'application/json'});
    const url = URL.createObjectURL(blob); const a = document.createElement('a'); a.href=url; a.download='versions.json'; a.click(); URL.revokeObjectURL(url);
    // 视为 "已导出"，如果希望把导出视作保存，则可以取消下一行注释
    // setDirty(false);
  };

  btnPrettyExport.onclick = ()=>{
    const blob = new Blob([JSON.stringify(data,null,2)],{type:'application/json'});
    const url = URL.createObjectURL(blob); const a = document.createElement('a'); a.href=url; a.download='versions.prettified.json'; a.click(); URL.revokeObjectURL(url);
    // setDirty(false);
  };

  // 保存到文件（使用 File System Access API，当不可用时回退到导出）
  const btnSaveToFile = document.getElementById('btnSaveToFile');
  async function saveToFile(){
    try{
      if(window.showSaveFilePicker){
        if(!fileHandle){
          fileHandle = await window.showSaveFilePicker({suggestedName:'versions.json',types:[{description:'JSON',accept:{'application/json':['.json']}}]});
        }
        const writable = await fileHandle.createWritable();
        await writable.write(JSON.stringify(data,null,2));
        await writable.close();
        setDirty(false);
        alert('已保存到文件：' + (fileHandle.name || '(unknown)'));
        return;
      }else{
        // 回退：使用导出作为保存方法
        btnPrettyExport.click();
        setDirty(false);
        alert('您的浏览器不支持直接写文件，已使用导出作为回退。');
      }
    }catch(e){
      alert('保存失败: '+e);
    }
  }
  btnSaveToFile.onclick = saveToFile;

  // Search
  search.oninput = ()=> renderList();

  // beforeunload：如果有未保存修改，提示用户
  window.addEventListener('beforeunload', (e)=>{
    if(isDirty){
      e.preventDefault();
      e.returnValue = '';
      return '';
    }
  });

  // Init
  function initSample(){
    // if repo has a local copy copy? leave empty by default
    data = {version:'v1', details:[]};
    // try to load the existing file (if served) silently
    fetch('/api/v1/versions/1.json').then(r=>r.json()).then(j=>{ if(j && j.details) { data=j; renderList(); }}).catch(()=>{});
    renderList();
    setDirty(false);
  }
  initSample();

})();