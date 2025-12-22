document.addEventListener('DOMContentLoaded', () => {
    const startScreen = document.getElementById('start-screen');
    const mainScreen = document.getElementById('main-screen');
    const versionSelector = document.querySelector('.version-selector');
    const versionList = document.getElementById('version-list');
    const currentVersionDisplay = document.getElementById('current-version-display');
    const backBtn = document.getElementById('back-btn');
    const infoBtn = document.getElementById('info-btn');
    const rksDisplay = document.querySelector('.rks');
    
    // Randomize RKS
    const randomRKS = (Math.random() * (16.99 - 12.00) + 12.00).toFixed(2);
    rksDisplay.textContent = `RKS ${randomRKS}`;

    // Panel elements
    const contentContainer = document.querySelector('.content-container');
    const detailPanel = document.getElementById('version-detail-panel');
    const detailTitle = document.getElementById('detail-title');
    const detailMeta = document.getElementById('detail-meta');
    const detailChangelog = document.getElementById('detail-changelog');
    const downloadGrid = document.getElementById('download-list');
    const downloadMessage = document.getElementById('download-message');
    const closeDetailMobile = document.getElementById('close-detail-mobile');
    const closeDetailDesktop = document.getElementById('close-detail-desktop');

    // Sound effects (optional, placeholders)
    const playTapSound = () => {
        // console.log('Tap sound');
    };

    // Start Screen Interaction
    startScreen.addEventListener('click', () => {
        playTapSound();
        startScreen.classList.remove('active');
        mainScreen.classList.add('active');
        
        // Load data when entering main screen
        loadMajorVersions();
    });

    // Back Button
    backBtn.addEventListener('click', () => {
        playTapSound();
        // If panel is open, close it first
        if (contentContainer.classList.contains('panel-open')) {
            closePanel();
        } else {
            mainScreen.classList.remove('active');
            startScreen.classList.add('active');
        }
    });

    // Mobile Close Button
    if (closeDetailMobile) {
        closeDetailMobile.addEventListener('click', () => {
            closePanel();
        });
    }

    // Desktop Close Button
    if (closeDetailDesktop) {
        closeDetailDesktop.addEventListener('click', () => {
            closePanel();
        });
    }

    // Info Button
    if (infoBtn) {
        infoBtn.addEventListener('click', () => {
            playTapSound();
            showAbout();
        });
    }

    function showAbout() {
        closePanel();
        currentVersionDisplay.textContent = '关于项目';
        
        versionList.innerHTML = `
            <div class="about-container">
                <h2>关于 Phigros History</h2>
                <div class="about-text">
                    <p>《Phigros》是由 Pigeon Games（鸽游）开发的节奏类游戏。Pigeon Games 是由初创通过 bilibili 视频网站发起的、由众多节奏类游戏爱好者组成的完全用爱发电的项目组。我们希望 Phigros 新颖的游戏模式和精心制作的插画与关卡可以让你感受到节奏类游戏的魅力。</p>
                    <p>本项目致力于收集并整理 Phigros 的历史版本及更新日志，方便玩家回顾与下载。</p>
                    <p>这是一个完全由爱好者维护的非营利项目。由于所有的上游存储开始收取更加高昂的费用，项目存储的费用和花销超出了我们所能承受的范围。如果您想支持我们继续提供免费的服务，请考虑捐赠。感谢您的支持！</p>
                    <a href="doc/why-donate" target="_blank" class="phigros-btn" style="width: 20em; margin-top: 1em;">
                        <span class="material-icons">favorite</span>
                        <span>支持我们</span>
                    </a>
                </div>
                <h2>关于此页面</h2>
                <div class="about-text">
                    <p>此页面是最近开发的实验性浏览器，用于浏览 Phigros 的历史版本。尚未广泛测试，可能存在一些问题。</p>
                    <p>您也可以访问我们的<a href="https://stevezmt.top/Phigros-history/README_old" target="_blank">旧版网页</a>，不过它将在未来被弃用。</p>
                    <p>如果您发现任何问题或有改进建议，请随时通过 GitHub 提交 issue 或 pull request。</p>

                    <a href="https://github.com/stevezmtstudios/Phigros-history" target="_blank" class="phigros-btn" style="width: 30em; margin-right: 1em;">
                        <span class="material-icons">code</span>
                        <span>访问 GitHub 仓库</span>
                    </a>
                    <a href="https://github.com/stevezmtstudios/Phigros-history/issues" target="_blank" class="phigros-btn" style="width: 30em; margin-top: 1em;">
                        <span class="material-icons">bug_report</span>
                        <span>报告问题</span>
                    </a>
                </div>
                <a href="https://beian.miit.gov.cn/" target="_blank" style="display: inline-block; color: #ccc; margin-top: 1em;">浙ICP备2025213066号-1</a>
            </div>
        `;
        
        // Unselect any active major version buttons
        document.querySelectorAll('.major-version-btn').forEach(b => b.classList.remove('active'));
    }

    function closePanel() {
        contentContainer.classList.remove('panel-open');
        // Remove active state from cards
        document.querySelectorAll('.version-card').forEach(c => c.classList.remove('active'));
    }

    async function loadMajorVersions() {
        try {
            const response = await fetch('api/v1/versions/index.json');
            if (!response.ok) throw new Error('Failed to load version index');
            
            const data = await response.json();
            renderMajorVersions(data.versions);
            
            if (data.versions.length > 0) {
                const latest = data.versions[data.versions.length - 1];
                selectMajorVersion(latest);
            }
        } catch (error) {
            console.error('Error loading versions:', error);
            versionSelector.innerHTML = '<div class="error">加载版本失败。</div>';
        }
    }

    function renderMajorVersions(versions) {
        versionSelector.innerHTML = '';
        [...versions].reverse().forEach(v => {
            const btn = document.createElement('div');
            btn.className = 'major-version-btn';
            btn.innerHTML = `<span>${v.version}</span>`;
            btn.addEventListener('click', () => {
                playTapSound();
                selectMajorVersion(v);
            });
            v.element = btn;
            versionSelector.appendChild(btn);
        });
    }

    async function selectMajorVersion(versionObj) {
        closePanel(); // Close panel when switching major versions
        
        document.querySelectorAll('.major-version-btn').forEach(b => b.classList.remove('active'));
        if (versionObj.element) versionObj.element.classList.add('active');
        
        currentVersionDisplay.textContent = versionObj.version;
        versionList.innerHTML = '<div class="loading">加载中...</div>';

        try {
            const versionId = versionObj.version.replace('.x', '');
            const jsonPath = `api/v1/versions/${versionId}.json`;
            
            const response = await fetch(jsonPath);
            if (!response.ok) throw new Error(`Failed to load details for ${versionObj.version}`);
            
            const data = await response.json();
            renderVersionList(data.details);
        } catch (error) {
            console.error(error);
            versionList.innerHTML = '<div class="error">加载版本详情失败。</div>';
        }
    }

    function renderVersionList(details) {
        versionList.innerHTML = '';
        
        if (!details || details.length === 0) {
            versionList.innerHTML = '<div class="empty">未找到版本。</div>';
            return;
        }

        const now = new Date();
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(now.getDate() - 30);

        details.forEach((ver, index) => {
            const card = document.createElement('div');
            card.className = 'version-card';
            
            // Check if downloads exist and are not empty
            const hasDownloads = ver.downloads && Object.keys(ver.downloads).length > 0;
            
            if (!hasDownloads) {
                card.classList.add('disabled');
            }

            // Check for icons
            let iconsHtml = '';
            
            // 1. Effective content tag (yellow)
            if (ver.tag && ver.tag.length > 0) {
                iconsHtml += `<span class="material-icons version-tag-icon content-tag" title="包含特别内容">new_releases</span>`;
            }

            // 2. Recent release (green) - within 30 days
            const releaseDate = new Date(ver.releaseDate);
            if (releaseDate >= thirtyDaysAgo) {
                iconsHtml += `<span class="material-icons version-tag-icon recent-tag" title="近期更新">new_releases</span>`;
            }

            card.style.animationDelay = `${index * 0.05}s`;
            
            const changelogHtml = ver.changelog ? ver.changelog.join('<br>') : '暂无更新日志。';

            card.innerHTML = `
                <div class="version-content">
                    <div class="version-header">
                        <span class="version-number">
                            ${ver.versionName}
                            ${iconsHtml}
                        </span>
                        <span class="version-date">${ver.releaseDate}</span>
                    </div>
                    <div class="changelog-preview">${changelogHtml}</div>
                </div>
            `;
            
            card.addEventListener('click', () => {
                playTapSound();
                // Highlight active card
                document.querySelectorAll('.version-card').forEach(c => c.classList.remove('active'));
                card.classList.add('active');
                
                showVersionDetails(ver);
            });

            versionList.appendChild(card);
        });
    }

    function showVersionDetails(ver) {
        detailTitle.textContent = ver.versionName;
        detailMeta.textContent = `发布日期: ${ver.releaseDate} | 版本号: ${ver.versionCode}`;
        
        // April Fools Warning
        let aprilFoolsHtml = '';
        if (ver.tag && ver.tag.includes('april-fools')) {
            aprilFoolsHtml = '<div class="april-fools-warning">此版本为特别的愚人节版本！</div>';
        }

        // Full Changelog
        if (ver.changelog && ver.changelog.length > 0) {
            detailChangelog.innerHTML = `${aprilFoolsHtml}<ul>${ver.changelog.map(line => `<li>${line}</li>`).join('')}</ul>`;
        } else {
            detailChangelog.innerHTML = `${aprilFoolsHtml}<p>暂无更新日志。</p>`;
        }

        downloadGrid.innerHTML = '';
        downloadMessage.textContent = '';

        const hasDownloads = ver.downloads && Object.keys(ver.downloads).length > 0;

        if (hasDownloads) {
            const mirrorMap = {
                "123": "123网盘",
                "caiyun": "彩云网盘",
                "huang1111": "荒野网盘",
                "lanzou": "蓝奏云",
                "onedrive": "OneDrive",
                "google": "Google Drive",
                "mega": "MEGA"
            };

            // Iterate over sources (e.g., taptap, googleplay)
            for (const [source, mirrors] of Object.entries(ver.downloads)) {
                const groupDiv = document.createElement('div');
                groupDiv.className = 'download-group';
                
                const sourceTitle = document.createElement('h4');
                // Capitalize first letter
                sourceTitle.textContent = source.charAt(0).toUpperCase() + source.slice(1);
                groupDiv.appendChild(sourceTitle);

                const gridDiv = document.createElement('div');
                gridDiv.className = 'download-grid';

                // mirrors is an object like { "123": "url", "caiyun": "url" }
                if (typeof mirrors === 'object' && mirrors !== null) {
                    for (const [mirrorKey, url] of Object.entries(mirrors)) {
                        if (url) {
                            const btn = document.createElement('a');
                            btn.className = 'phigros-btn';
                            btn.href = url;
                            btn.target = '_blank';
                            
                            const mirrorName = mirrorMap[mirrorKey] || mirrorKey;
                            
                            btn.innerHTML = `
                                <span class="material-icons">download</span>
                                <span>${mirrorName}</span>
                            `;
                            gridDiv.appendChild(btn);
                        }
                    }
                } else if (typeof mirrors === 'string') {
                    // Fallback if structure is flat
                    const btn = document.createElement('a');
                    btn.className = 'phigros-btn';
                    btn.href = mirrors;
                    btn.target = '_blank';
                    btn.innerHTML = `
                        <span class="material-icons">download</span>
                        <span>下载</span>
                    `;
                    gridDiv.appendChild(btn);
                }

                if (gridDiv.children.length > 0) {
                    groupDiv.appendChild(gridDiv);
                    downloadGrid.appendChild(groupDiv);
                }
            }
        } else {
            downloadMessage.textContent = '未找到该版本的应用包。';
        }

        // Open panel
        contentContainer.classList.add('panel-open');
    }
});
