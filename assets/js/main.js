document.addEventListener('DOMContentLoaded', () => {
    const startScreen = document.getElementById('start-screen');
    const mainScreen = document.getElementById('main-screen');
    const versionSelector = document.querySelector('.version-selector');
    const versionList = document.getElementById('version-list');
    const currentVersionDisplay = document.getElementById('current-version-display');
    const backBtn = document.getElementById('back-btn');
    const infoBtn = document.getElementById('info-btn');
    const languageBtn = document.getElementById('language-btn');
    const startLanguageBtn = document.getElementById('start-language-btn');
    const rksDisplay = document.querySelector('.rks');
    const searchInput = document.getElementById('version-search');

    // Loading Status Monitoring
    const loadingStatus = document.getElementById('loading-status');
    let isAppReady = false;
    let lastLoadedResource = '';

    // Initialize with already loaded resources
    const initialResources = performance.getEntriesByType('resource');
    if (initialResources.length > 0) {
        lastLoadedResource = initialResources[initialResources.length - 1].name;
    }

    const resourceObserver = new PerformanceObserver((list) => {
        list.getEntries().forEach(entry => {
            lastLoadedResource = entry.name;
            if (loadingStatus && loadingStatus.classList.contains('visible') && !isAppReady) {
                loadingStatus.textContent = `正在等待 ${lastLoadedResource}...`;
            }
        });
    });
    
    try {
        resourceObserver.observe({ entryTypes: ['resource'] });
    } catch (e) {
        console.warn('PerformanceObserver not supported for resource');
    }

    setTimeout(() => {
        if (!isAppReady && loadingStatus) {
            loadingStatus.classList.add('visible');
            loadingStatus.textContent = `正在等待 ${lastLoadedResource || '网站资源...'}`;
        }
    }, 1000);
    
    // Translate.js Initialization
    if (typeof translate !== 'undefined') {
        console.log('[Translate] Initializing v3...');
        translate.service.use('client.edge');
        translate.language.setLocal('chinese_simplified'); 
        translate.setAutoDiscriminateLocalLanguage(); // 自动识别用户本地语言并切换
        
        // 修复：使用官方推荐的 translate.language.getCurrent() 获取当前语言
        const getCurrentLang = () => {
            if (translate.language && typeof translate.language.getCurrent === 'function') {
                return translate.language.getCurrent();
            }
            return 'chinese_simplified';
        };

        console.log('[Translate] Current Language:', getCurrentLang());
        console.log('[Translate] Local Language:', translate.localLanguage);
        console.log('[Translate] Listener Hooks:', Object.keys(translate.listener || {}));

        translate.ignore.tag.push('i');
        translate.ignore.class.push('material-icons');
        translate.ignore.class.push('ignore-translate');
        
        const activeTaskSet = new Set();
        let stopTimer = null;

        const updateLoadingState = () => {
            const isPending = activeTaskSet.size > 0;
            // 减少日志噪音，仅在状态变化或有任务时记录
            if (isPending || (stopTimer === null)) {
                console.log(`[Translate] Loading State: ${isPending ? 'PENDING' : 'IDLE'} (Tasks: ${activeTaskSet.size})`);
            }
            
            if (isPending) {
                if (stopTimer) {
                    clearTimeout(stopTimer);
                    stopTimer = null;
                }
                if (languageBtn) languageBtn.classList.add('loading');
                if (startLanguageBtn) startLanguageBtn.classList.add('loading');
            } else {
                if (!stopTimer) {
                    stopTimer = setTimeout(() => {
                        if (activeTaskSet.size <= 0) {
                            if (languageBtn) languageBtn.classList.remove('loading');
                            if (startLanguageBtn) startLanguageBtn.classList.remove('loading');
                        }
                        stopTimer = null;
                    }, 500);
                }
            }
        };

        const startTask = (taskId) => {
            if (!taskId) taskId = `task-${Math.random().toString(36).substr(2, 9)}`;
            activeTaskSet.add(taskId);
            console.log(`[Translate] Task Started: ${taskId} (Total: ${activeTaskSet.size})`);
            updateLoadingState();
            
            setTimeout(() => {
                if (activeTaskSet.has(taskId)) {
                    console.warn(`[Translate] Task Timeout: ${taskId}`);
                    activeTaskSet.delete(taskId);
                    updateLoadingState();
                }
            }, 15000);
        };

        const finishTask = (task) => {
            const taskId = (task && task.id) ? task.id : null;
            if (taskId && activeTaskSet.has(taskId)) {
                console.log(`[Translate] Task Finished: ${taskId} (Remaining: ${activeTaskSet.size - 1})`);
                activeTaskSet.delete(taskId);
            } else {
                const firstTask = activeTaskSet.values().next().value;
                if (firstTask) {
                    console.log(`[Translate] Task Finished (Fallback): ${firstTask}`);
                    activeTaskSet.delete(firstTask);
                }
            }
            updateLoadingState();
        };

        // 解决 renderTaskStart 不触发的问题：
        // 1. 尝试使用 addListener (如果支持)
        if (typeof translate.listener.addListener === 'function') {
            translate.listener.addListener('renderTaskStart', function(task) {
                console.log('[Translate] Hook Triggered: addListener.renderTaskStart');
                startTask(task ? task.id : null);
            });
        }

        // 2. 显式定义所有可能的开始钩子
        const startHooks = ['renderTaskStart', 'onTaskStart', 'taskStart', 'beforeRenderTask'];
        startHooks.forEach(hook => {
            translate.listener[hook] = function(task) {
                console.log(`[Translate] Hook Triggered: ${hook}`);
                startTask(task ? task.id : null);
            };
        });

        // 3. 拦截 translate.execute 以确保并行开始时能立即捕获状态
        const originalExecute = translate.execute;
        translate.execute = function() {
            console.log('[Translate] Manual execute() triggered');
            // 触发一个临时任务，防止在钩子还没回来前加载动画没跳出来
            const tempId = `exec-${Date.now()}`;
            startTask(tempId);
            
            // 执行原始方法
            originalExecute.apply(this, arguments);
            
            // 稍微延迟一点结束这个临时任务，给真正的 renderTaskStart 留出时间
            setTimeout(() => finishTask({id: tempId}), 100);
        };

        const finishHooks = ['renderTaskFinish', 'onTaskFinish', 'taskFinish'];
        finishHooks.forEach(hook => {
            translate.listener[hook] = function(task) {
                console.log(`[Translate] Hook Triggered: ${hook}`);
                finishTask(task);

                if (getCurrentLang() === 'arabic') {
                    document.documentElement.setAttribute('dir', 'rtl');
                } else {
                    document.documentElement.setAttribute('dir', 'ltr');
                }
            };
        });

        // Execute translation
        console.log('[Translate] Triggering initial execute()');
        translate.execute();
        
        // Monitor dynamic content
        translate.listener.start();
    }

    // Date formatter
    const formatDate = (dateStr) => {
        if (!dateStr) return '未知日期';
        const date = new Date(dateStr);
        if (isNaN(date.getTime())) return dateStr;
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    // Announcement elements
    const notificationContainer = document.getElementById('notification-container');
    const announcementModal = document.getElementById('announcement-modal');
    const modalIcon = document.getElementById('modal-icon');
    const modalTitle = document.getElementById('modal-title');
    const modalBody = document.getElementById('modal-body');
    const closeAnnouncementBtn = document.getElementById('close-announcement');

    let currentDetails = []; // Store current major version's details for filtering
    
    // Randomize RKS
    const randomRKS = (Math.random() * (16.99 - 12.00) + 12.00).toFixed(2);
    rksDisplay.textContent = `RKS ${randomRKS}`;

    // Initial fetch for announcements
    fetchAnnouncements();

    // Check for URL params and potentially skip start screen
    const urlParams = new URLSearchParams(window.location.search);
    const targetVer = urlParams.get('ver');
    const targetVerCode = urlParams.get('vercode');

    if (targetVer || targetVerCode) {
        startScreen.classList.remove('active');
        mainScreen.classList.add('active');
        loadMajorVersions(targetVer, targetVerCode).then(() => {
            // Clean URL parameters after loading
            const newUrl = window.location.pathname;
            window.history.replaceState({}, document.title, newUrl);
        });
    }

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

    // Sound effects integration (now handled by ui-sound.js via capture listener)
    const playTapSound = () => {};

    // Start Screen Interaction
    startScreen.addEventListener('click', () => {
        if (!startScreen.classList.contains('active')) return;
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

    // Close panel when clicking on the shadow mask
    contentContainer.addEventListener('click', (e) => {
        if (e.target === contentContainer && contentContainer.classList.contains('panel-open')) {
            closePanel();
        }
    });

    // Info Button
    if (infoBtn) {
        infoBtn.addEventListener('click', () => {
            playTapSound();
            showAbout();
        });
    }

    // Language Button
    if (languageBtn) {
        languageBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            playTapSound();
            showLanguageSelector();
        });
    }

    if (startLanguageBtn) {
        startLanguageBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            playTapSound();
            startScreen.classList.remove('active');
            mainScreen.classList.add('active');
            loadMajorVersions(null, null, true).then(() => {
                showLanguageSelector();
            });
        });
    }

    // Search Logic
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            const query = e.target.value.toLowerCase().trim();
            if (!query) {
                renderVersionList(currentDetails);
                return;
            }

            const filtered = currentDetails.filter(ver => {
                const nameMatch = ver.versionName.toLowerCase().includes(query);
                const codeMatch = ver.versionCode.toString().toLowerCase().includes(query);
                const changelogMatch = ver.changelog && ver.changelog.some(line => line.toLowerCase().includes(query));
                return nameMatch || codeMatch || changelogMatch;
            });

            renderVersionList(filtered, true); // Pass true to skip animation delay for search results
        });
    }

    function showAbout() {
        closePanel();
        currentVersionDisplay.textContent = '关于项目';
        
        // Scroll to top
        if (versionList.parentElement) {
            versionList.parentElement.scrollTop = 0;
        }
        
        versionList.innerHTML = `
            <div class="about-container">
                <h2>关于 Phigros</h2>
                <div class="about-text">
                    <p><blockquote site="https://www.taptap.cn/app/165287">
                    《Phigros》是由 Pigeon Games（鸽游）开发的节奏类游戏。Pigeon Games 是由初创通过 bilibili 视频网站发起的、由众多节奏类游戏爱好者组成的完全用爱发电的项目组。我们希望 Phigros 新颖的游戏模式和精心制作的插画与关卡可以让你感受到节奏类游戏的魅力。
                    </blockquote></p>
                    <p> —— 来自 <a href="https://www.taptap.cn/app/165287" target="_blank">TapTap 上的官方介绍</a></p>
                    <div style="margin-top: 1em; display: flex; flex-wrap: wrap; gap: 10px;">
                        <a href="https://www.taptap.cn/app/165287" target="_blank" class="phigros-btn">
                        <span class="material-icons">store</span>
                        <span>访问 TapTap 商店页面</span>
                        </a>
                        <a href="https://play.google.com/store/apps/details?id=com.PigeonGames.Phigros" target="_blank" class="phigros-btn" title="您所在的地区可能无法打开此链接。">
                        <span class="material-icons">shop</span>
                        <span>访问 Google Play 页面</span>
                        </a><a href="https://apps.apple.com/cn/app/phigros/id1454809109" target="_blank" class="phigros-btn">
                        <span class="material-icons">apple</span>
                        <span>访问 App Store 页面</span>
                        </a>
                        </div>
                    <div style="margin-top: 1em; display: flex; flex-wrap: wrap; gap: 10px;">
                        <a href="https://pigeongames.net/" target="_blank" class="phigros-btn">
                        <span class="material-icons">public</span>
                        <span>访问 Pigeon Games 官网</span>
                        </a>
                        <a href="https://twitter.com/Phigros_PGS" target="_blank" class="phigros-btn">
                        <span class="icon-wrapper">
                        <svg t="1766646411854" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="5863" width="19" height="19"><path d="M1024 194.56a420.352 420.352 0 0 1-120.832 33.28 210.432 210.432 0 0 0 92.16-116.224 422.4 422.4 0 0 1-133.632 51.2A209.92 209.92 0 0 0 499.2 307.2a211.968 211.968 0 0 0 5.632 47.616 596.48 596.48 0 0 1-433.152-220.16 208.896 208.896 0 0 0-28.672 105.472A204.8 204.8 0 0 0 132.096 414.72C97.28 413.696 32.256 404.48 32.256 388.608v2.56a214.528 214.528 0 0 0 173.056 204.8 193.024 193.024 0 0 1-51.2 7.168 199.68 199.68 0 0 1-38.4-3.584 210.944 210.944 0 0 0 196.608 145.92A420.864 420.864 0 0 1 51.2 836.608a438.784 438.784 0 0 1-51.2-3.072 594.944 594.944 0 0 0 322.048 94.208A593.408 593.408 0 0 0 921.6 330.24v-27.136a427.008 427.008 0 0 0 102.4-108.544z m0 0" fill="currentColor" p-id="5864"></path></svg>
                        </span>
                        <span>访问 Phigros Twitter</span>
                        </a>
                        <a href="https://space.bilibili.com/414149787" target="_blank" class="phigros-btn">
                        <span class="icon-wrapper">
                        <svg t="1766648342791" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="11134" width="24" height="24"><path d="M777.514667 131.669333a53.333333 53.333333 0 0 1 0 75.434667L728.746667 255.829333h49.92A160 160 0 0 1 938.666667 415.872v320a160 160 0 0 1-160 160H245.333333A160 160 0 0 1 85.333333 735.872v-320a160 160 0 0 1 160-160h49.749334L246.4 207.146667a53.333333 53.333333 0 0 1 75.392-75.434667l113.152 113.152c3.370667 3.370667 6.186667 7.04 8.448 10.965333h137.088c2.261333-3.925333 5.12-7.68 8.490667-11.008l113.109333-113.152a53.333333 53.333333 0 0 1 75.434667 0z m1.152 231.253334H245.333333a53.333333 53.333333 0 0 0-53.205333 49.365333l-0.128 4.010667v320c0 28.117333 21.76 51.114667 49.365333 53.162666l3.968 0.170667h533.333334a53.333333 53.333333 0 0 0 53.205333-49.365333l0.128-3.968v-320c0-29.44-23.893333-53.333333-53.333333-53.333334z m-426.666667 106.666666c29.44 0 53.333333 23.893333 53.333333 53.333334v53.333333a53.333333 53.333333 0 1 1-106.666666 0v-53.333333c0-29.44 23.893333-53.333333 53.333333-53.333334z m320 0c29.44 0 53.333333 23.893333 53.333333 53.333334v53.333333a53.333333 53.333333 0 1 1-106.666666 0v-53.333333c0-29.44 23.893333-53.333333 53.333333-53.333334z" fill="currentColor" p-id="11135"></path></svg>
                        </span>
                        <span>访问 Phigros 哔哩哔哩账号</span>
                        </a>
                        <a href="https://pd.qq.com/s/433r43ehu" target="_blank" class="phigros-btn">
                        <span class="icon-wrapper">
                        <svg t="1766648433823" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="12255" width="20" height="20"><path d="M824.8 613.2c-16-51.4-34.4-94.6-62.7-165.3C766.5 262.2 689.3 112 511.5 112 331.7 112 256.2 265.2 261 447.9c-28.4 70.8-46.7 113.7-62.7 165.3-34 109.5-23 154.8-14.6 155.8 18 2.2 70.1-82.4 70.1-82.4 0 49 25.2 112.9 79.8 159-26.4 8.1-85.7 29.9-71.6 53.8 11.4 19.3 196.2 12.3 249.5 6.3 53.3 6 238.1 13 249.5-6.3 14.1-23.8-45.3-45.7-71.6-53.8 54.6-46.2 79.8-110.1 79.8-159 0 0 52.1 84.6 70.1 82.4 8.5-1.1 19.5-46.4-14.5-155.8z" fill="currentColor" p-id="12256"></path></svg>
                        </span>
                        <span>访问 Phigros 官方QQ频道</span>
                        </a>
                    </div>
                </div>
                <h2>关于 Phigros History</h2>
                <div class="about-text">
                    <p>Phigros History 是一个非官方的、由爱好者维护的项目，收集和整理 Phigros 的历史版本及其更新日志。</p>
                    <p>本项目仅为学习和研究网页设计研究和开发之用，所有数据均来自公开渠道，如有侵权请联系我们删除相关内容。</p>
                    <p>特别感谢 <a href="https://www.facebook.com/huyhoangcao39393939/" target="_blank">Cao Huy Hoang</a> 提供的部分历史版本数据，没有他的帮助，该项目不可能发展得如此庞大。</p>
                    <p>以及<a href="https://space.bilibili.com/3546762126035268" target="_blank">D1ct10nary</a> 和 <a href="https://github.com/RainView-ovo" target="_blank">RainView-ovo</a> 提供的剩余缺失版本。</p>
                    <p>此项目和 Pigeon Games（鸽游）、Apple Inc等公司及其关联方无任何关系，所有内容均来自公开渠道，仅供学习和研究使用，请在24小时内删除相关内容。如有侵权，请联系我们删除相关内容。</p>
                </div>

                <h2>支持我们</h2>
                <div class="about-text">
                    <p>这是一个完全由爱好者维护的非营利项目。我们希望得到您的认可。如果您想支持我们继续提供免费的服务，请考虑捐赠。感谢您的支持！</p>
                    <p><a href="doc/why-donate" target="_blank" class="phigros-btn">
                        <span class="material-icons">favorite</span>
                        <span>支持我们</span>
                    </a></p>
                    <p><a href="CONTRIBUTE" target="_blank" class="phigros-btn">
                        <span class="material-icons">volunteer_activism</span>
                        <span>贡献指南</span>
                    </a></p>
                </div>
                <h2>关于此页面</h2>
                <div class="about-text">
                    <p>此页面是最近开发的实验性框架，用于浏览 Phigros 的历史版本。尚未广泛测试，可能存在一些问题。</p>
                    <p>此页面不是 Phigros 的发布页面，设计样式和Phigros，Pigeon Games（鸽游）无任何关系。关于版权和商标信息，请参阅<a href="NOTICE" target="_blank">NOTICE.md</a>文件。</p>
                    <p>您也可以访问我们的<a href="https://stevezmt.top/Phigros-history/README_old" target="_blank">旧版网页</a>，不过它将在未来被弃用。</p>
                    <p>如果您发现任何问题或有改进建议，请随时通过 GitHub 提交 issue 或 pull request。</p>

                    <p><a href="https://github.com/stevezmtstudios/Phigros-history" target="_blank" class="phigros-btn">
                        <span class="material-icons">code</span>
                        <span>访问 GitHub 仓库</span>
                    </a></p>
                    <p><a href="https://github.com/stevezmtstudios/Phigros-history/issues" target="_blank" class="phigros-btn btn-help">
                        <span class="material-icons">bug_report</span>
                        <span>报告问题</span>
                    </a></p>
                </div>
                <div class='about-text'>
                <p>相关描述，Geopelia 头像（Phigros 应用程序徽标），界面音效和可执行文件版权归属于 <a href="https://pigeongames.net/" target="_blank">&copy; 南京鸽游网络有限公司</a></p>
                <p>Play Store 徽标和 Google Play 是 Google LLC 的商标。其余引用的徽标和标识均归其各自所有者所有。</p>
                <p>页面由 <a href="https://stevezmt.top/" target="_blank">SteveZMT</a> 用❤️制作。</p>
                </div>
                <a href="https://beian.miit.gov.cn/" target="_blank" style="display: inline-block; color: #ccc; margin-top: 1em;">浙ICP备2025213066号-1</a>
            </div>
        `;
        
        if (typeof translate !== 'undefined') translate.execute();

        // Unselect any active major version buttons
        document.querySelectorAll('.major-version-btn').forEach(b => b.classList.remove('active'));
    }

    function showLanguageSelector() {
        closePanel();
        currentVersionDisplay.textContent = '选择语言';
        
        if (versionList.parentElement) {
            versionList.parentElement.scrollTop = 0;
        }

        const languages = [
            { code: 'chinese_simplified', name: '简体中文' },
            { code: 'chinese_traditional', name: '繁體中文' },
            { code: 'english', name: 'English' },
            { code: 'japanese', name: '日本語' },
            { code: 'korean', name: '한국어' },
            { code: 'russian', name: 'Русский' },
            { code: 'french', name: 'Français' },
            { code: 'deutsch', name: 'Deutsch' },
            { code: 'spanish', name: 'Español' },
            { code: 'portuguese', name: 'Português' },
            { code: 'italian', name: 'Italiano' },
            { code: 'vietnamese', name: 'Tiếng Việt' },
            { code: 'thai', name: 'ไทย' },
            { code: 'indonesian', name: 'Bahasa Indonesia' },
            { code: 'arabic', name: 'العربية' },
            { code: 'hindi', name: 'हिन्दी' },
            { code: 'bengali', name: 'বাংলা' },
            { code: 'turkish', name: 'Türkçe' },
            { code: 'polish', name: 'Polski' },
            { code: 'ukrainian', name: 'Українська' },
            { code: 'dutch', name: 'Nederlands' },
            { code: 'malay', name: 'Bahasa Melayu' },
            { code: 'filipino', name: 'Pilipino' }
        ];

        const currentLang = (typeof translate !== 'undefined' && translate.language) ? 
            translate.language.getCurrent() : 'chinese_simplified';

        versionList.innerHTML = `
            <div class="language-container">
                <h2>选择语言<span class="ignore-translate"> / Select Language</span></h2>
                <div class="language-grid">
                    ${languages.map(lang => {
                        const isActive = lang.code === currentLang;
                        return `
                            <button class="phigros-btn lang-select-btn ignore-translate ${isActive ? 'active' : ''}" data-code="${lang.code}">
                                <span class="material-icons lang-icon">${isActive ? 'check_circle' : 'language'}</span>
                                <span>${lang.name}</span>
                            </button>
                        `;
                    }).join('')}
                </div>
            </div>
        `;

        document.querySelectorAll('.lang-select-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const code = btn.getAttribute('data-code');
                if (typeof translate !== 'undefined') {
                    
                    translate.changeLanguage(code);
                    // 立即刷新界面以显示选中状态
                    showLanguageSelector();
                }
            });
        });

        if (typeof translate !== 'undefined') translate.execute();

        document.querySelectorAll('.major-version-btn').forEach(b => b.classList.remove('active'));
    }

    function closePanel() {
        contentContainer.classList.remove('panel-open');
        // Remove active state from cards
        document.querySelectorAll('.version-card').forEach(c => c.classList.remove('active'));
    }

    async function loadMajorVersions(targetVer, targetVerCode, skipDefaultSelection = false) {
        try {
            const response = await fetch('api/v1/versions/index.json?t=' + Date.now());
            if (!response.ok) throw new Error('无法加载版本索引');
            
            const data = await response.json();
            renderMajorVersions(data.versions);
            
            if (targetVer || targetVerCode) {
                let found = false;
                // Search all major versions
                for (const v of data.versions) {
                    let jsonPath = v.url;
                    if (jsonPath.startsWith('/')) jsonPath = jsonPath.substring(1);
                    const res = await fetch(jsonPath + (jsonPath.includes('?') ? '&' : '?') + 't=' + Date.now());
                    if (!res.ok) continue;
                    const majorData = await res.json();
                    const match = majorData.details.find(d => {
                        if (targetVerCode) return d.versionCode.toString() === targetVerCode;
                        if (targetVer) {
                            const v1 = d.versionName.toLowerCase().replace(/^v/, '');
                            const v2 = targetVer.toLowerCase().replace(/^v/, '');
                            return v1 === v2;
                        }
                        return false;
                    });

                    if (match) {
                        await selectMajorVersion(v, match);
                        found = true;
                        break;
                    }
                }
                if (!found && data.versions.length > 0 && !skipDefaultSelection) {
                    const latest = data.versions[data.versions.length - 1];
                    selectMajorVersion(latest);
                }
            } else if (data.versions.length > 0 && !skipDefaultSelection) {
                const latest = data.versions[data.versions.length - 1];
                selectMajorVersion(latest);
            }
        } catch (error) {
            console.error('Error loading versions:', error);
            versionSelector.innerHTML = `
                <div class="error-container" style="font-size: 0.8rem; gap: 10px;">
                    <span class="material-icons" style="font-size: 2rem;">error</span>
                    <div class="error-text" style="font-size: 1rem;">加载失败</div>
                </div>
            `;
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
        if (typeof translate !== 'undefined') translate.execute();
    }

    async function selectMajorVersion(versionObj, autoSelectVersion = null) {
        closePanel(); // Close panel when switching major versions
        
        // Scroll to top
        if (versionList.parentElement) {
            versionList.parentElement.scrollTop = 0;
        }

        // Clear search when switching major versions
        if (searchInput) searchInput.value = '';

        document.querySelectorAll('.major-version-btn').forEach(b => b.classList.remove('active'));
        if (versionObj.element) versionObj.element.classList.add('active');
        
        currentVersionDisplay.textContent = versionObj.version;
        versionList.innerHTML = `
            <div class="loading-container">
                <div class="phigros-spinner"></div>
                <div class="loading-text">加载中...</div>
            </div>
        `;
        if (typeof translate !== 'undefined') translate.execute();

        try {
            // Use the URL directly from the version object as requested
            // If it starts with /, we make it relative to ensure it works in subpaths
            let jsonPath = versionObj.url;
            if (jsonPath.startsWith('/')) {
                jsonPath = jsonPath.substring(1);
            }
            
            const response = await fetch(jsonPath + (jsonPath.includes('?') ? '&' : '?') + 't=' + Date.now());
            if (!response.ok) throw new Error(`无法加载 ${versionObj.version} 的详情`);
            
            const data = await response.json();
            currentDetails = data.details || [];

            // Sort details: versionCode desc, versionName desc, releaseDate desc
            currentDetails.sort((a, b) => {
                // 1. Version Code
                const codeA = parseInt(a.versionCode) || 0;
                const codeB = parseInt(b.versionCode) || 0;
                if (codeB !== codeA) return codeB - codeA;

                // 2. Version Name
                const nameCompare = b.versionName.localeCompare(a.versionName, undefined, { numeric: true, sensitivity: 'base' });
                if (nameCompare !== 0) return nameCompare;

                // 3. Release Date
                return new Date(b.releaseDate) - new Date(a.releaseDate);
            });

            renderVersionList(currentDetails);

            if (autoSelectVersion) {
                showVersionDetails(autoSelectVersion);
                // Highlight the card and scroll to it
                setTimeout(() => {
                    const cards = document.querySelectorAll('.version-card');
                    for (const card of cards) {
                        if (card.querySelector('.version-number').textContent.includes(autoSelectVersion.versionName)) {
                            card.classList.add('active');
                            card.scrollIntoView({ behavior: 'smooth', block: 'center' });
                            break;
                        }
                    }
                }, 100);
            }
        } catch (error) {
            console.error(error);
            versionList.innerHTML = `
                <div class="error-container">
                    <span class="material-icons">error_outline</span>
                    <div class="error-text">加载版本详情失败</div>
                    <div class="error-subtext">${error.message}</div>
                </div>
            `;
        }
    }

    function renderVersionList(details, isSearch = false) {
        versionList.innerHTML = '';
        
        if (!details || details.length === 0) {
            versionList.innerHTML = `
                <div class="error-container" style="color: #666;">
                    <span class="material-icons">search_off</span>
                    <div class="error-text">在此版本分支中未找到匹配项</div>
                </div>
            `;
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

            if (isSearch) {
                card.style.animation = 'none';
                card.style.opacity = '1';
            } else {
                card.style.animationDelay = `${index * 0.05}s`;
            }
            
            const changelogHtml = ver.changelog ? ver.changelog.join('<br>') : '暂无更新日志。';

            // Channel Icons Support
            let channelIconsHtml = '';
            if (ver.downloads) {
                if (ver.downloads.taptap && Object.keys(ver.downloads.taptap).length > 0) {
                    channelIconsHtml += `<svg t="1769502625361" class="channel-icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="6828"><path d="M146.286 0C65.495 0 0 65.494 0 146.286v731.429c0 80.791 65.494 146.286 146.286 146.286h731.429c80.791 0 146.286-65.494 146.286-146.286V146.286C1024.001 65.495 958.507 0 877.715 0H146.286zM91.635 294.906c2.543-2.721 7.151-1.692 9.132 1.285 1.001 3.942 0.104 8.676 2.919 11.932 4.316 4.263 10.737 4.006 16.303 4.156 88.981-0.043 177.961-0.021 266.942-0.021 6.275-0.621 12.613 4.67 12.655 11.29 0.167 16.474 0.146 32.991-0.021 49.465-0.083 6.577-6.4 11.782-12.655 11.225-26.457 0.15-52.934-0.15-79.39 0.107-7.047-0.064-12.259 7.134-11.446 14.075 0 94.281 0.042 188.583-0.021 282.864 0.605 6.534-4.607 13.004-11.091 13.068-22.266 0.3-44.553 0.064-66.819 0.107-7.088 0.835-13.822-5.634-13.114-13.025-0.042-94.345 0-188.712 0-283.078 0.646-6.427-3.69-13.218-10.195-13.903-26.373-0.814-52.809 0.75-79.161-1.05-12.634-0.921-26.06-5.613-33.295-16.988-15.49-21.744-7.109-52.892 9.257-71.509z m583.941 64.247c18.117-4.713 37.923-1.371 53.726 8.89 13.927 9.062 26.853 22.108 30.022 39.396 0.334 5.141 7.276 7.455 10.237 3.106 14.093-15.896 34.045-26.435 55.165-26.735 34.546-0.621 68.237 17.01 90.482 43.766 22.954 27.442 32.815 64.011 34.358 99.615 1.543 36.933-3.315 75.6-22.141 107.798-16.679 28.963-45.47 50.129-77.535 57.006-22.412 5.163-47.326 2.549-66.631-10.904-4.482-2.828-7.985-7.091-12.717-9.426-4.295-1.05-7.735 3.342-7.047 7.541-0.063 37.125 0.021 74.251-0.021 111.397 0.667 6.662-4.858 13.218-11.467 13.046-22.308 0.193-44.636 0.086-66.944 0.064-6.901 0.643-13.218-5.827-12.613-12.918-0.063-110.776-0.021-221.574-0.021-332.35-0.271-17.866-0.25-36.29-6.088-53.364-3.023-9.233-10.382-16.988-19.952-18.681-5.108-0.107-8.339-6.598-4.607-10.583 10.028-7.734 21.599-13.496 33.795-16.667z m118.94 96.766c-10.174 2.935-20.536 7.755-26.978 16.71-4.149 5.806-4.107 13.325-4.086 20.202 0.167 34.233-0.188 68.488 0.167 102.7 0.063 15.06 14.99 23.308 27.687 25.471 29.25 7.069 58.771-13.432 71.385-39.803 12.05-26.093 11.175-57.327 1.772-84.127-9.882-28.192-40.738-49.272-69.946-41.153z m-262.939-52.528c0.584-6.748 3.69-14.953 11.383-15.339 22.349-0.343 44.72-0.086 67.069-0.129 6.838-0.686 13.197 5.656 12.676 12.725 0.063 73.651 0.063 147.302-0.021 220.953 0.584 15.788 4.065 34.105 17.846 43.424 3.794 3.021 11.571 3.321 11.154 9.79-0.271 4.863-5.567 6.213-8.923 8.355-19.514 10.283-42.051 18.359-64.129 13.111-18.201-4.135-32.565-19.13-39.278-36.59-1.689-3.192-2.189-8.291-6.463-8.869-4.462-0.857-6.38 3.835-8.631 6.748-10.382 15.36-24.955 28.985-43.198 33.119-32.878 7.369-69.884-1.585-93.817-26.585-26.081-27.035-38.173-65.467-40.571-102.764-0.625-35.84 4.42-73.03 21.891-104.585 12.363-22.515 32.44-40.446 56.082-49.422 23.058-9.126 48.201-10.197 72.636-9.083 11.55 0.536 23.1 2.078 34.295 5.141z m-42.26 44.987c-21.828 2.271-42.239 15.339-53.497 34.726-16.116 27.421-18.326 61.911-10.091 92.374 5.337 18.83 15.595 37.939 33.316 46.937 14.114 7.391 30.626 4.113 44.97-0.728 15.761-5.377 29.459-21.016 27.707-38.903-0.125-39.975 0.042-79.949-0.063-119.902 0.459-5.784-2.919-11.997-8.673-13.282-10.966-3.042-22.495-2.464-33.67-1.221z" fill="#14B9C8" p-id="6829"></path></svg>`;
                }
                if (ver.downloads.playstore && Object.keys(ver.downloads.playstore).length > 0) {
                    channelIconsHtml += `<svg t="1769502852537" class="channel-icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="10754"><path d="M138.282667 98.56c-9.813333 10.24-15.616 26.026667-15.616 46.549333v733.738667c0 20.565333 5.802667 36.394667 15.616 46.549333l2.517333 2.389334 417.792-410.922667v-9.728L140.8 96.128l-2.56 2.389333h0.042667z" fill="#00C5FF" p-id="10755"></path><path d="M697.813333 653.909333l-139.264-137.045333v-9.728l139.264-136.96 3.2 1.706667 164.992 92.202666c47.104 26.325333 47.104 69.461333 0 95.829334l-164.992 92.202666-3.2 1.792z" fill="#FFBD00" p-id="10756"></path><path d="M701.013333 652.117333L558.506667 512l-420.266667 413.44c15.530667 16.213333 41.216 18.218667 70.101333 2.090667l492.629334-275.413334" fill="#EB2C4E" p-id="10757"></path><path d="M701.013333 371.882667L208.384 96.469333c-28.885333-16.128-54.570667-14.122667-70.101333 2.048L558.549333 512l142.464-140.117333z" fill="#00F076" p-id="10758"></path></svg>`;
                }
            }

            card.innerHTML = `
                <div class="version-content">
                    <div class="version-header">
                        <span class="version-number ignore-translate">
                            ${ver.versionName}
                            ${iconsHtml}
                        </span>
                        <div class="version-meta">
                            ${channelIconsHtml}
                            <span class="version-date">${formatDate(ver.releaseDate)}</span>
                        </div>
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
        if (typeof translate !== 'undefined') translate.execute();
    }

    function showVersionDetails(ver) {
        detailTitle.textContent = ver.versionName;
        detailMeta.textContent = `发布日期: ${formatDate(ver.releaseDate)} | 版本号: ${ver.versionCode}`;
        
        // April Fools Warning
        let aprilFoolsHtml = '';
        if (ver.tag && ver.tag.includes('april-fools')) {
            aprilFoolsHtml = '<div class="april-fools-warning"><i class="material-icons">new_releases</i>此版本为<a href="doc/special">特别的</a>愚人节版本！</div>';
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
                "huang1111": "huang1111 网盘",
                "lanzou": "蓝奏云",
                "onedrive": "OneDrive",
                "google": "Google Drive",
                "repacked": "共存版",
                "mega": "MEGA"
            };

            const sourceMap = {
                "taptap": "TapTap",
                "playstore": "Play 商店"
            };

            const sourceNoteMap = {
                "taptap": "在 TapTap 中国区发布的版本",
                "playstore": "面向全球发布的版本"
            };

            // Iterate over sources (e.g., taptap, googleplay)
            for (const [source, mirrors] of Object.entries(ver.downloads)) {
                const groupDiv = document.createElement('div');
                groupDiv.className = 'download-group';
                
                const sourceTitle = document.createElement('h4');
                sourceTitle.textContent = sourceMap[source] || (source.charAt(0).toUpperCase() + source.slice(1));
                groupDiv.appendChild(sourceTitle);

                if (sourceNoteMap[source]) {
                    const note = document.createElement('div');
                    note.className = 'source-note';
                    note.textContent = sourceNoteMap[source];
                    groupDiv.appendChild(note);
                }

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

            // Add Help Section
            const helpGroup = document.createElement('div');
            helpGroup.className = 'download-group';
            helpGroup.innerHTML = `
                <h4>安装说明</h4>
                <div class="source-note">如果您不确定如何安装它们</div>
                <div class="download-grid">
                    <a href="doc/install-apk-obb" target="_blank" class="phigros-btn">
                        <span class="material-icons">help</span>
                        <span>安装奇怪的 APK</span>
                    </a>
                    <a href="doc/unzip-parsed-file" target="_blank" class="phigros-btn">
                        <span class="material-icons">unarchive</span>
                        <span>处理分卷压缩包</span>
                    </a>
                    <a href="https://github.com/stevezmtstudios/Phigros-history/issues/new/choose" target="_blank" class="phigros-btn btn-help">
                        <span class="material-icons">feedback</span>
                        <span>需要帮助？</span>
                    </a>
                </div>
            `;
            downloadGrid.appendChild(helpGroup);
        } else {
            downloadMessage.innerHTML = `
                <div class="april-fools-warning" style="text-align: center; padding: 20px; border-style: solid;">
                    <span class="material-icons" style="vertical-align: middle; margin-right: 8px;">info</span>
                    未找到该版本的应用包。如果您有可用的版本，请<a href='https://github.com/stevezmtstudios/Phigros-history/issues/new/choose' target='_blank'>与我们分享</a>。
                </div>
            `;
        }

        // Open panel
        contentContainer.classList.add('panel-open');
        if (typeof translate !== 'undefined') translate.execute();
    }

    async function fetchAnnouncements() {
        try {
            const response = await fetch('api/glados.json?t=' + Date.now());
            if (!response.ok) return;
            
            const data = await response.json();
            if (data.announce && Array.isArray(data.announce)) {
                data.announce.forEach(ann => {
                    const type = ann.type || 'info';
                    const content = ann.content || ann.message; // Support both content and message keys

                    if (type === 'error' || type === 'error_persist') {
                        showAnnouncementModal(type, content);
                    } else {
                        showNotification(type, content);
                    }
                });
            }
        } catch (error) {
            console.error('Failed to fetch announcements:', error);
        }
    }

    function showNotification(type, message) {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <span class="material-icons">${type === 'warning' ? 'warning' : 'info'}</span>
                <span>${message}</span>
            </div>
        `;
        
        notificationContainer.appendChild(notification);
        if (typeof translate !== 'undefined') translate.execute();

        // Auto remove after 5 seconds
        setTimeout(() => {
            notification.classList.add('fade-out');
            setTimeout(() => notification.remove(), 500);
        }, 5000);
    }

    function showAnnouncementModal(type, message) {
        modalBody.textContent = message;
        
        if (type === 'error_persist') {
            modalIcon.textContent = 'report';
            modalIcon.style.color = '#ff0055';
            modalTitle.textContent = '严重错误';
            closeAnnouncementBtn.style.display = 'none';
        } else {
            modalIcon.textContent = 'error';
            modalIcon.style.color = '#ffcc00';
            modalTitle.textContent = '系统提示';
            closeAnnouncementBtn.style.display = 'flex';
        }

        announcementModal.classList.add('active');
        if (typeof translate !== 'undefined') translate.execute();
    }

    if (closeAnnouncementBtn) {
        closeAnnouncementBtn.addEventListener('click', () => {
            announcementModal.classList.remove('active');
        });
    }

    // Set start screen text when ready
    const tapToStartText = document.querySelector('.tap-to-start');
    if (tapToStartText) {
        tapToStartText.textContent = '点 击 屏 幕 开 始';
        isAppReady = true;
        if (loadingStatus) loadingStatus.classList.remove('visible');
    }
});
