/**
 * UI Renderer for Taekwondo Scoring Board
 * Menghasilkan komponen HTML untuk Mode Layar TV dan Mode Operator Meja
 */

window.renderUI = function (appState) {
  const container = document.getElementById('app-root');
  if (!container) return;

  const { viewMode, category } = appState.data;

  // Header Bar Navigasi (Pilihan Kategori & Mode)
  let html = `
    <!-- Top Control Bar (Bisa disembunyikan saat presentasi TV penuh) -->
    <header class="bg-slate-900 border-b border-slate-800 px-4 py-2 flex flex-wrap items-center justify-between text-xs sm:text-sm text-slate-300">
      <div class="flex items-center space-x-3">
        <div class="flex items-center space-x-1.5 font-bold tracking-wider text-amber-400 font-display text-base sm:text-lg">
          <span class="inline-block w-3 h-3 bg-red-600 rounded-full animate-ping"></span>
          <span>TAEKWONDO SCOREBOARD PRO</span>
        </div>
        <span class="bg-slate-800 text-slate-400 px-2 py-0.5 rounded text-xs border border-slate-700">WT Standard</span>
      </div>

      <!-- Kategori Switcher -->
      <div class="flex items-center space-x-1 bg-slate-950 p-1 rounded-lg border border-slate-800 my-1">
        <button onclick="app.setCategory('kyorugi')" class="px-3 py-1 rounded transition-all font-semibold ${category === 'kyorugi' ? 'bg-blue-600 text-white shadow' : 'hover:text-white text-slate-400'}">
          🥋 Kyorugi (Sparring)
        </button>
        <button onclick="app.setCategory('poomsae_rec')" class="px-3 py-1 rounded transition-all font-semibold ${category === 'poomsae_rec' ? 'bg-amber-600 text-white shadow' : 'hover:text-white text-slate-400'}">
          🏅 Poomsae Recognised
        </button>
        <button onclick="app.setCategory('poomsae_free')" class="px-3 py-1 rounded transition-all font-semibold ${category === 'poomsae_free' ? 'bg-purple-600 text-white shadow' : 'hover:text-white text-slate-400'}">
          ⚡ Poomsae Freestyle
        </button>
      </div>

      <!-- View Mode Switcher & Tools -->
      <div class="flex items-center space-x-2 my-1">
        <div class="bg-slate-950 p-1 rounded-lg border border-slate-800 flex items-center space-x-0.5">
          <button onclick="app.setViewMode('tv')" class="px-2.5 py-1 rounded font-medium ${viewMode === 'tv' ? 'bg-emerald-600 text-white font-bold' : 'text-slate-400 hover:text-white'}">
            📺 Layar TV
          </button>
          <button onclick="app.setViewMode('operator')" class="px-2.5 py-1 rounded font-medium ${viewMode === 'operator' ? 'bg-indigo-600 text-white font-bold' : 'text-slate-400 hover:text-white'}">
            🎛️ Operator Meja
          </button>
          <button onclick="app.setViewMode('judge')" class="px-2.5 py-1 rounded font-medium ${viewMode === 'judge' ? 'bg-amber-600 text-white font-bold' : 'text-slate-400 hover:text-white'}">
            📱 Pad Juri
          </button>
          <button onclick="app.setViewMode('matches')" class="px-2.5 py-1 rounded font-medium ${viewMode === 'matches' ? 'bg-purple-600 text-white font-bold' : 'text-slate-400 hover:text-white'}">
            📋 Jadwal Partai
          </button>
          <button onclick="app.setViewMode('obs')" class="px-2.5 py-1 rounded font-medium ${viewMode === 'obs' ? 'bg-rose-600 text-white font-bold' : 'text-slate-400 hover:text-white'}">
            🎥 OBS Stream
          </button>
        </div>

        <a href="operator_monitoring_system.html" target="_blank" title="Buka Layar Monitoring Operator Meja Lengkap" class="px-2.5 py-1 bg-gradient-to-r from-amber-500 to-emerald-500 text-black font-extrabold rounded-lg text-xs shadow hover:opacity-90 flex items-center space-x-1">
          <span>🖥️</span><span class="hidden md:inline">CMS Monitor ↗</span>
        </a>

        <button onclick="window.soundSys.playBuzzer()" title="Uji Suara Klakson Buzzer" class="p-1.5 px-2 bg-slate-800 hover:bg-slate-700 text-amber-400 rounded border border-slate-700 flex items-center space-x-1">
          <span>🔊</span> <span class="hidden sm:inline">Buzzer</span>
        </button>

        <button onclick="app.printScoresheet()" title="Cetak Berita Acara Pertandingan" class="p-1.5 px-2 bg-slate-800 hover:bg-slate-700 text-emerald-400 rounded border border-slate-700 flex items-center space-x-1">
          <span>🖨️</span> <span class="hidden sm:inline">Cetak</span>
        </button>

        <button onclick="app.toggleSettingsModal()" title="Pengaturan Turnamen & Durasi" class="p-1.5 px-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded border border-slate-700 flex items-center space-x-1">
          <span>⚙️</span> <span class="hidden sm:inline">Setelan</span>
        </button>

        <button onclick="toggleFullscreen()" class="p-1.5 px-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded border border-slate-700">
          ⛶ Fullscreen
        </button>
      </div>
    </header>
  `;

  // Content Area Sesuai Mode
  if (viewMode === 'tv') {
    html += renderTVDisplay(appState);
  } else if (viewMode === 'operator') {
    html += renderOperatorConsole(appState);
  } else if (viewMode === 'judge') {
    html += renderJudgePad(appState);
  } else if (viewMode === 'matches') {
    html += renderMatchSchedule(appState);
  } else if (viewMode === 'obs') {
    html += renderOBSOverlay(appState);
  }

  // Render Modal Pengaturan jika aktif
  if (appState.data.settingsModalOpen) {
    html += renderSettingsModal(appState);
  }

  container.innerHTML = html;
};

// ==========================================
// 1. RENDER DISPLAY LAYAR TV (BIG SCREEN VIEW)
// ==========================================
function renderTVDisplay(appState) {
  const { category, court, division } = appState.data;

  return `
    <main class="w-full min-h-[calc(100vh-50px)] bg-black text-white flex flex-col justify-between p-3 sm:p-5 select-none overflow-hidden">
      <!-- Broadcast Info Header -->
      <div class="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 border border-slate-700 rounded-xl px-6 py-2.5 flex items-center justify-between shadow-2xl mb-3">
        <div class="flex items-center space-x-4">
          <span class="bg-amber-500 text-black font-extrabold px-3 py-0.5 rounded text-sm sm:text-base font-display tracking-wider">
            ${court}
          </span>
          <span class="text-base sm:text-xl font-bold tracking-wide text-slate-200 font-display">
            ${division}
          </span>
        </div>
        <div class="flex items-center space-x-3 text-slate-400 text-xs sm:text-sm font-semibold">
          <span class="flex items-center space-x-1.5 text-emerald-400">
            <span class="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>LIVE MATCH</span>
          </span>
        </div>
      </div>

      <!-- BANNER VIDEO REPLAY (IVR) OVERLAY JIKA AKTIF -->
      ${appState.data.ivr.active ? `
        <div class="bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 text-black px-6 py-3 rounded-xl mb-3 flex items-center justify-between font-black text-sm sm:text-lg shadow-2xl border-2 border-white animate-pulse">
          <div class="flex items-center space-x-3">
            <span class="text-2xl animate-spin">📹</span>
            <span>INSTANT VIDEO REPLAY (IVR): SUDUT ${appState.data.ivr.requestedBy.toUpperCase()} — ${appState.data.ivr.cardItem.toUpperCase()}</span>
          </div>
          ${appState.data.ivr.decision ? `
            <span class="px-4 py-1.5 bg-black text-white rounded-lg text-sm font-extrabold uppercase tracking-wider">
              KEPUTUSAN: ${appState.data.ivr.decision}
            </span>
          ` : `
            <span class="text-xs uppercase bg-black/80 text-amber-300 px-3 py-1 rounded-full">
              SEDANG DITINJAU JURI REPLAY...
            </span>
          `}
        </div>
      ` : ''}

      <!-- BANNER MEDICAL TIMEOUT JIKA AKTIF -->
      ${appState.data.medical.active ? `
        <div class="bg-red-600 text-white px-6 py-3 rounded-xl mb-3 flex items-center justify-between font-black text-sm sm:text-lg shadow-2xl border-2 border-white animate-pulse">
          <div class="flex items-center space-x-3">
            <span class="text-2xl">🚑</span>
            <span>KESIAPAN MEDIS (MEDICAL TIMEOUT): ATLET ${appState.data.medical.fighter.toUpperCase()}</span>
          </div>
          <div class="font-digital text-3xl font-black text-amber-300 dynamic-medical-text">
            ${appState.data.medical.seconds}s
          </div>
        </div>
      ` : ''}

      <!-- Category Specific TV Screen -->
      <div class="flex-1 flex flex-col justify-center">
        ${category === 'kyorugi' ? renderKyorugiTV(appState) : ''}
        ${category === 'poomsae_rec' ? renderPoomsaeRecTV(appState) : ''}
        ${category === 'poomsae_free' ? renderPoomsaeFreeTV(appState) : ''}
      </div>

      <!-- TV Footer Sponsor/Bar -->
      <div class="mt-3 pt-2 border-t border-slate-800 flex items-center justify-between text-slate-500 text-xs font-medium">
        <span>World Taekwondo Official Rules • Electronic Scoring Board</span>
        <span class="text-slate-400">Tekan <kbd class="px-1.5 py-0.5 bg-slate-800 rounded border border-slate-700 text-slate-300">F11</kbd> untuk Tampilan TV Layar Penuh</span>
      </div>
    </main>
  `;
}

// ------------------------------------------
// TV Display: Kyorugi (Sparring)
// ------------------------------------------
function renderKyorugiTV(appState) {
  const { kyorugi } = appState.data;
  const { chung, hong, round, maxRounds, timerSeconds, timerRunning, winner, pointGapAlert } = kyorugi;
  const timeFormatted = appState.formatTime(timerSeconds);

  return `
    <div class="relative w-full grid grid-cols-12 gap-3 lg:gap-5 items-stretch">
      
      <!-- SISI BIRU (CHUNG) -->
      <div class="col-span-5 bg-gradient-to-b from-[#004899] via-[#005cb8] to-[#003366] rounded-2xl border-4 border-blue-500 p-4 sm:p-6 flex flex-col justify-between shadow-2xl relative overflow-hidden">
        <div class="absolute -right-16 -top-16 w-52 h-52 bg-blue-400/10 rounded-full blur-2xl pointer-events-none"></div>

        <!-- Nama & Kontingen -->
        <div>
          <div class="flex items-center justify-between">
            <span class="bg-blue-900/80 text-blue-200 border border-blue-400/30 px-3 py-1 rounded text-xs sm:text-sm font-extrabold tracking-wider font-display">
              CHUNG (청)
            </span>
            <!-- Round Won Indicator Badges -->
            <div class="flex items-center space-x-1.5">
              ${[1, 2].map(r => `
                <div class="w-4 h-4 sm:w-5 sm:h-5 rounded-full border-2 border-amber-400 ${chung.roundsWon >= r ? 'bg-amber-400 shadow-[0_0_12px_#fbbf24]' : 'bg-transparent'}"></div>
              `).join('')}
            </div>
          </div>
          <h2 class="text-2xl sm:text-4xl lg:text-5xl font-black text-white font-display tracking-tight mt-2 truncate">
            ${chung.name}
          </h2>
          <p class="text-blue-200 text-sm sm:text-lg font-bold tracking-wider">${chung.team}</p>
        </div>

        <!-- SKOR BESAR CHUNG -->
        <div class="my-auto text-center py-4">
          <div class="font-digital text-8xl sm:text-9xl lg:text-[13rem] font-black leading-none text-white glow-blue">
            ${chung.score}
          </div>
        </div>

        <!-- GAM-JEOM (PENALTI) CHUNG -->
        <div class="bg-black/40 backdrop-blur-md rounded-xl p-2.5 sm:p-3.5 border border-blue-400/30">
          <div class="flex items-center justify-between mb-1.5">
            <span class="text-xs sm:text-sm font-bold text-amber-300 tracking-wider">GAM-JEOM (감점)</span>
            <span class="text-sm sm:text-base font-extrabold text-white">${chung.gamjeom} / 5</span>
          </div>
          <!-- 5 Kotak Indikator Gam-jeom -->
          <div class="grid grid-cols-5 gap-1.5">
            ${[1, 2, 3, 4, 5].map(idx => `
              <div class="h-3 sm:h-4 rounded ${chung.gamjeom >= idx ? 'bg-amber-400 shadow-[0_0_8px_#f59e0b]' : 'bg-slate-700/60'}"></div>
            `).join('')}
          </div>
        </div>
      </div>

      <!-- BAGIAN TENGAH (TIMER, RONDE & STATUS) -->
      <div class="col-span-2 flex flex-col justify-between items-center bg-slate-950/80 rounded-2xl border border-slate-800 p-2 sm:p-4 text-center">
        <!-- Ronde Badge -->
        <div class="w-full bg-slate-900 border border-slate-700 rounded-xl py-2 px-1">
          <div class="text-slate-400 text-[10px] sm:text-xs font-bold tracking-widest uppercase">RONDE</div>
          <div class="font-digital text-2xl sm:text-4xl lg:text-5xl font-extrabold text-amber-400">
            R${round}
          </div>
          <div class="text-[10px] text-slate-400 font-medium">BEST OF 3</div>
        </div>

        <!-- TIMER BESAR DIGITAL -->
        <div class="my-auto w-full py-4">
          <div class="font-digital text-4xl sm:text-6xl lg:text-7xl font-black ${timerRunning ? 'text-emerald-400 timer-running' : 'text-amber-500'} tracking-tighter dynamic-timer-text">
            ${timeFormatted}
          </div>
          <div class="mt-2 text-[11px] sm:text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full inline-block ${timerRunning ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' : 'bg-amber-950 text-amber-400 border border-amber-800'}">
            ${timerRunning ? 'KYE-SOK (계속)' : 'KAL-YEO (갈려)'}
          </div>
        </div>

        <!-- Point Gap / Alert Notification -->
        ${pointGapAlert ? `
          <div class="w-full bg-red-950/80 border border-red-600 text-red-300 p-1.5 rounded-lg text-[10px] sm:text-xs font-bold animate-pulse">
            ⚠️ POINT GAP (12+)
          </div>
        ` : `
          <div class="text-[10px] sm:text-xs text-slate-500">
            Hits: ${chung.hits} - ${hong.hits}
          </div>
        `}
      </div>

      <!-- SISI MERAH (HONG) -->
      <div class="col-span-5 bg-gradient-to-b from-[#b3001e] via-[#c90022] to-[#800014] rounded-2xl border-4 border-red-500 p-4 sm:p-6 flex flex-col justify-between shadow-2xl relative overflow-hidden text-right">
        <div class="absolute -left-16 -top-16 w-52 h-52 bg-red-400/10 rounded-full blur-2xl pointer-events-none"></div>

        <!-- Nama & Kontingen -->
        <div>
          <div class="flex items-center justify-between flex-row-reverse">
            <span class="bg-red-900/80 text-red-200 border border-red-400/30 px-3 py-1 rounded text-xs sm:text-sm font-extrabold tracking-wider font-display">
              HONG (홍)
            </span>
            <!-- Round Won Indicator Badges -->
            <div class="flex items-center space-x-1.5 flex-row-reverse">
              ${[1, 2].map(r => `
                <div class="w-4 h-4 sm:w-5 sm:h-5 rounded-full border-2 border-amber-400 ${hong.roundsWon >= r ? 'bg-amber-400 shadow-[0_0_12px_#fbbf24]' : 'bg-transparent'}"></div>
              `).join('')}
            </div>
          </div>
          <h2 class="text-2xl sm:text-4xl lg:text-5xl font-black text-white font-display tracking-tight mt-2 truncate">
            ${hong.name}
          </h2>
          <p class="text-red-200 text-sm sm:text-lg font-bold tracking-wider">${hong.team}</p>
        </div>

        <!-- SKOR BESAR HONG -->
        <div class="my-auto text-center py-4">
          <div class="font-digital text-8xl sm:text-9xl lg:text-[13rem] font-black leading-none text-white glow-red">
            ${hong.score}
          </div>
        </div>

        <!-- GAM-JEOM (PENALTI) HONG -->
        <div class="bg-black/40 backdrop-blur-md rounded-xl p-2.5 sm:p-3.5 border border-red-400/30 text-left">
          <div class="flex items-center justify-between mb-1.5">
            <span class="text-xs sm:text-sm font-bold text-amber-300 tracking-wider">GAM-JEOM (감점)</span>
            <span class="text-sm sm:text-base font-extrabold text-white">${hong.gamjeom} / 5</span>
          </div>
          <div class="grid grid-cols-5 gap-1.5">
            ${[1, 2, 3, 4, 5].map(idx => `
              <div class="h-3 sm:h-4 rounded ${hong.gamjeom >= idx ? 'bg-amber-400 shadow-[0_0_8px_#f59e0b]' : 'bg-slate-700/60'}"></div>
            `).join('')}
          </div>
        </div>
      </div>

      <!-- MODAL PEMENANG PARTAI JIKA ADA (WT OFFICIAL WINNER DECLARATION) -->
      ${winner ? `
        <div class="absolute inset-0 bg-black/95 backdrop-blur-xl z-50 flex flex-col items-center justify-center p-6 rounded-2xl border-4 ${winner === 'chung' ? 'border-blue-500' : 'border-red-500'} animate-fade-in">
          <div class="text-amber-400 text-sm sm:text-base font-bold tracking-widest uppercase mb-1">
            🏆 WORLD TAEKWONDO • OFFICIAL WINNER DECLARATION
          </div>
          <div class="text-2xl sm:text-4xl font-black text-amber-300 font-display mb-1">
            ${winner === 'chung' ? 'CHUNG SEUNG (청승)' : 'HONG SEUNG (홍승)'}
          </div>
          <div class="text-4xl sm:text-7xl font-black font-display tracking-wider ${winner === 'chung' ? 'text-blue-400 glow-blue' : 'text-red-400 glow-red'}">
            ${winner === 'chung' ? chung.name : hong.name}
          </div>
          <div class="text-xl sm:text-3xl font-bold text-white mt-1">
            ${winner === 'chung' ? chung.team : hong.team}
          </div>
          <div class="mt-3 px-4 py-1.5 bg-slate-900 rounded-lg text-xs sm:text-sm text-slate-300 border border-slate-700">
            ${kyorugi.winReason} • Skor Ronde: ${chung.roundsWon} - ${hong.roundsWon}
          </div>
          <div class="mt-6 flex items-center space-x-3">
            <button onclick="app.printScoresheet()" class="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-emerald-400 border border-emerald-500 font-bold rounded-xl shadow-lg flex items-center space-x-1.5 text-sm">
              <span>🖨️</span> <span>Cetak Berita Acara</span>
            </button>
            <button onclick="app.resetKyorugiMatch()" class="px-6 py-2.5 bg-amber-500 hover:bg-amber-400 text-black font-black rounded-xl shadow-lg text-sm">
              Partai Baru / Reset 🔄
            </button>
          </div>
        </div>
      ` : ''}

    </div>
  `;
}

// ------------------------------------------
// TV Display: Poomsae Recognised
// ------------------------------------------
function renderPoomsaeRecTV(appState) {
  const { poomsaeRec } = appState.data;
  const { athleteName, team, poomsaeName, roundType, judges, result } = poomsaeRec;

  return `
    <div class="w-full bg-slate-900 border-2 border-amber-500/50 rounded-2xl p-4 sm:p-8 shadow-2xl">
      <!-- Info Peserta & Jurus -->
      <div class="flex flex-wrap items-center justify-between border-b border-slate-800 pb-4 mb-6">
        <div>
          <span class="bg-amber-500/20 text-amber-400 border border-amber-500/30 px-3 py-1 rounded text-xs font-extrabold uppercase">
            ${roundType}
          </span>
          <h2 class="text-3xl sm:text-5xl font-black text-white font-display mt-2">${athleteName}</h2>
          <p class="text-slate-400 text-base sm:text-xl font-bold">${team}</p>
        </div>
        <div class="text-right mt-3 sm:mt-0">
          <div class="text-xs sm:text-sm text-slate-400 font-semibold uppercase">POOMSAE DIUJI</div>
          <div class="text-2xl sm:text-4xl font-extrabold text-amber-400 font-display">${poomsaeName}</div>
        </div>
      </div>

      <!-- Skor Utama & Sub-Skor -->
      <div class="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
        <!-- Kotak Total Nilai Akhir -->
        <div class="md:col-span-5 bg-gradient-to-br from-amber-950 via-slate-900 to-slate-950 border-2 border-amber-400 rounded-2xl p-6 text-center shadow-xl">
          <span class="text-amber-400 text-sm sm:text-base font-extrabold tracking-widest uppercase">
            TOTAL SCORE (FINAL)
          </span>
          <div class="font-digital text-7xl sm:text-9xl font-black text-amber-400 glow-gold my-2">
            ${result.totalScore}
          </div>
          <div class="text-xs text-slate-400 font-medium">Skala 10.00 • Standar WT Truncated Mean</div>
        </div>

        <!-- Breakdown Akurasi & Presentasi -->
        <div class="md:col-span-7 grid grid-cols-2 gap-4">
          <!-- Akurasi (Max 4.0) -->
          <div class="bg-slate-950/80 border border-blue-500/40 rounded-xl p-4 sm:p-6 text-center">
            <span class="text-blue-400 text-xs sm:text-sm font-bold uppercase">ACCURACY (AKURASI)</span>
            <div class="font-digital text-4xl sm:text-6xl font-bold text-white mt-1">
              ${result.accuracyFinal}
            </div>
            <span class="text-xs text-slate-500">Nilai Dasar: 4.00</span>
          </div>

          <!-- Presentasi (Max 6.0) -->
          <div class="bg-slate-950/80 border border-emerald-500/40 rounded-xl p-4 sm:p-6 text-center">
            <span class="text-emerald-400 text-xs sm:text-sm font-bold uppercase">PRESENTATION</span>
            <div class="font-digital text-4xl sm:text-6xl font-bold text-white mt-1">
              ${result.presentationFinal}
            </div>
            <span class="text-xs text-slate-500">Nilai Dasar: 6.00</span>
          </div>
        </div>
      </div>

      <!-- Panel Rincian 5 Juri (Dengan visual strikethrough nilai terbuang) -->
      <div class="mt-8">
        <h4 class="text-xs sm:text-sm font-bold text-slate-400 uppercase tracking-wider mb-3">
          Panel Penilaian Juri (5 Judges System)
        </h4>
        <div class="grid grid-cols-5 gap-2 sm:gap-4">
          ${judges.map(j => {
            const isAccDropped = j.id === result.droppedAccMin || j.id === result.droppedAccMax;
            const isPresDropped = j.id === result.droppedPresMin || j.id === result.droppedPresMax;
            return `
              <div class="bg-slate-950 border border-slate-800 rounded-xl p-2.5 sm:p-4 text-center">
                <div class="text-xs sm:text-sm font-extrabold text-amber-400 mb-2">${j.id}</div>
                <div class="border-t border-slate-800 pt-1.5">
                  <div class="text-[10px] text-slate-400">Acc</div>
                  <div class="text-sm sm:text-xl font-bold ${isAccDropped ? 'score-dropped text-red-400' : 'text-blue-400'}">
                    ${j.accuracy}
                  </div>
                </div>
                <div class="border-t border-slate-800 pt-1.5 mt-1">
                  <div class="text-[10px] text-slate-400">Pres</div>
                  <div class="text-sm sm:text-xl font-bold ${isPresDropped ? 'score-dropped text-red-400' : 'text-emerald-400'}">
                    ${j.presentation}
                  </div>
                </div>
              </div>
            `;
          }).join('')}
        </div>
        <p class="text-[11px] text-slate-500 text-center mt-2.5">
          * Angka bergaris merah merupakan skor tertinggi dan terendah yang otomatis dibuang (*dropped*) sesuai regulasi resmi.
        </p>
      </div>
    </div>
  `;
}

// ------------------------------------------
// TV Display: Poomsae Freestyle
// ------------------------------------------
function renderPoomsaeFreeTV(appState) {
  const { poomsaeFree } = appState.data;
  const { athleteName, team, musicTitle, musicDuration, statusNote, result } = poomsaeFree;

  return `
    <div class="w-full bg-slate-900 border-2 border-purple-500/50 rounded-2xl p-4 sm:p-8 shadow-2xl">
      <!-- Header -->
      <div class="flex flex-wrap items-center justify-between border-b border-slate-800 pb-4 mb-6">
        <div>
          <span class="bg-purple-500/20 text-purple-400 border border-purple-500/30 px-3 py-1 rounded text-xs font-extrabold uppercase">
            POOMSAE FREE STYLE
          </span>
          <h2 class="text-3xl sm:text-5xl font-black text-white font-display mt-2">${athleteName}</h2>
          <p class="text-slate-400 text-base sm:text-xl font-bold">${team}</p>
        </div>
        <div class="text-right mt-3 sm:mt-0">
          <div class="text-xs sm:text-sm text-slate-400 font-semibold uppercase">TRACK MUSIK & DURASI</div>
          <div class="text-lg sm:text-2xl font-bold text-purple-300 font-display">${musicTitle}</div>
          <div class="text-sm sm:text-base font-digital text-emerald-400 font-bold mt-0.5">
            ⏱️ ${musicDuration} Detik (${statusNote})
          </div>
        </div>
      </div>

      <!-- Skor Freestyle -->
      <div class="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
        <!-- Big Total Box -->
        <div class="md:col-span-5 bg-gradient-to-br from-purple-950 via-slate-900 to-slate-950 border-2 border-purple-400 rounded-2xl p-6 text-center shadow-xl">
          <span class="text-purple-400 text-sm sm:text-base font-extrabold tracking-widest uppercase">
            TOTAL SCORE (FINAL)
          </span>
          <div class="font-digital text-7xl sm:text-9xl font-black text-purple-400 glow-blue my-2">
            ${result.totalScore}
          </div>
          <div class="text-xs text-slate-400 font-medium">Skala 10.00 • 5 Elemen Wajib + Koreografi Musik</div>
        </div>

        <!-- Breakdown Technical & Presentation -->
        <div class="md:col-span-7 grid grid-cols-2 gap-4">
          <div class="bg-slate-950/80 border border-purple-500/40 rounded-xl p-4 sm:p-6 text-center">
            <span class="text-purple-400 text-xs sm:text-sm font-bold uppercase">TECHNICAL SKILLS</span>
            <div class="font-digital text-4xl sm:text-6xl font-bold text-white mt-1">
              ${result.technicalFinal}
            </div>
            <span class="text-xs text-slate-500">Maksimal: 6.00</span>
          </div>

          <div class="bg-slate-950/80 border border-pink-500/40 rounded-xl p-4 sm:p-6 text-center">
            <span class="text-pink-400 text-xs sm:text-sm font-bold uppercase">PRESENTATION & MUSIC</span>
            <div class="font-digital text-4xl sm:text-6xl font-bold text-white mt-1">
              ${result.presentationFinal}
            </div>
            <span class="text-xs text-slate-500">Maksimal: 4.00</span>
          </div>
        </div>
      </div>

      <!-- 5 Teknik Wajib Freestyle (Compulsory Kicks Breakdown) -->
      <div class="mt-8 bg-slate-950 border border-slate-800 rounded-xl p-4">
        <h4 class="text-xs sm:text-sm font-bold text-slate-300 uppercase tracking-wider mb-2">
          5 Elemen Teknik Wajib Diuji (Compulsory Requirements):
        </h4>
        <div class="grid grid-cols-2 sm:grid-cols-5 gap-2 text-xs text-center text-slate-400">
          <div class="bg-slate-900 p-2 rounded border border-slate-800">
            <div class="font-bold text-purple-400">1. Jump Side Kick</div>
            <div>Tinggi Lompatan</div>
          </div>
          <div class="bg-slate-900 p-2 rounded border border-slate-800">
            <div class="font-bold text-purple-400">2. Multiple Kicks</div>
            <div>Tendangan Beruntun</div>
          </div>
          <div class="bg-slate-900 p-2 rounded border border-slate-800">
            <div class="font-bold text-purple-400">3. Spinning Kick</div>
            <div>Putaran 540°/720°</div>
          </div>
          <div class="bg-slate-900 p-2 rounded border border-slate-800">
            <div class="font-bold text-purple-400">4. Basic Moves</div>
            <div>Kuda-kuda & Tangkisan</div>
          </div>
          <div class="bg-slate-900 p-2 rounded border border-slate-800">
            <div class="font-bold text-purple-400">5. Acrobatic Kick</div>
            <div>Tendangan Salto</div>
          </div>
        </div>
      </div>
    </div>
  `;
}

// ==========================================
// 2. RENDER PANEL OPERATOR MEJA (CONTROL DESK)
// ==========================================
function renderOperatorConsole(appState) {
  const { category } = appState.data;

  return `
    <main class="w-full min-h-[calc(100vh-50px)] bg-slate-950 text-slate-200 p-4 sm:p-6 overflow-y-auto">
      <div class="max-w-7xl mx-auto">
        <div class="bg-indigo-950/40 border border-indigo-700/50 rounded-xl p-3.5 mb-6 flex items-center justify-between">
          <div class="flex items-center space-x-3">
            <span class="text-xl">🎛️</span>
            <div>
              <h3 class="font-bold text-white text-base">Panel Kontrol Meja Pertandingan (Table Operator Console)</h3>
              <p class="text-xs text-indigo-300">Setiap perubahan skor dan timer akan langsung disinkronkan ke Layar TV secara real-time.</p>
            </div>
          </div>
          <div class="flex items-center space-x-2">
            <a href="operator_monitoring_system.html" target="_blank" class="px-3 py-1.5 bg-gradient-to-r from-amber-500 to-emerald-500 text-black font-extrabold rounded text-xs shadow hover:opacity-90 flex items-center space-x-1">
              <span>🖥️</span><span>Buka CMS Monitoring ↗</span>
            </a>
            <button onclick="openDisplayWindow()" class="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded text-xs font-semibold">
              Buka TV di Jendela Baru (Dual Screen) ↗
            </button>
          </div>
        </div>

        ${category === 'kyorugi' ? renderKyorugiOperator(appState) : ''}
        ${category === 'poomsae_rec' ? renderPoomsaeRecOperator(appState) : ''}
        ${category === 'poomsae_free' ? renderPoomsaeFreeOperator(appState) : ''}
      </div>
    </main>
  `;
}

function renderKyorugiOperator(appState) {
  const { kyorugi } = appState.data;
  const { chung, hong, round, timerSeconds, timerRunning } = kyorugi;
  const timeFormatted = appState.formatTime(timerSeconds);

  return `
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
      
      <!-- CONTROLS CHUNG (BIRU) -->
      <div class="lg:col-span-5 bg-slate-900 border-2 border-blue-600/70 rounded-xl p-5 shadow-lg">
        <div class="flex items-center justify-between border-b border-blue-800 pb-3 mb-4">
          <div>
            <span class="text-blue-400 font-bold text-xs uppercase tracking-wider">SUDUT BIRU</span>
            <input type="text" value="${chung.name}" onchange="app.data.kyorugi.chung.name = this.value; app.notifyChange()" class="bg-slate-950 border border-blue-500/50 px-2 py-1 rounded text-white font-bold w-full mt-1">
          </div>
          <div class="text-right">
            <span class="text-4xl font-digital font-black text-blue-400">${chung.score}</span>
          </div>
        </div>

        <div class="space-y-3">
          <div class="text-xs font-bold text-slate-400 uppercase">Input Poin Cepat:</div>
          <div class="grid grid-cols-3 gap-2">
            <button onclick="app.addKyorugiPoint('chung', 1)" class="bg-blue-600 hover:bg-blue-500 text-white font-bold py-2 rounded text-sm shadow">
              +1 Pukulan
            </button>
            <button onclick="app.addKyorugiPoint('chung', 2)" class="bg-blue-600 hover:bg-blue-500 text-white font-bold py-2 rounded text-sm shadow">
              +2 Badan
            </button>
            <button onclick="app.addKyorugiPoint('chung', 3)" class="bg-blue-600 hover:bg-blue-500 text-white font-bold py-2 rounded text-sm shadow">
              +3 Kepala
            </button>
            <button onclick="app.addKyorugiPoint('chung', 4)" class="bg-indigo-700 hover:bg-indigo-600 text-white font-bold py-2 rounded text-sm shadow">
              +4 Putar Badan
            </button>
            <button onclick="app.addKyorugiPoint('chung', 5)" class="bg-indigo-700 hover:bg-indigo-600 text-white font-bold py-2 rounded text-sm shadow">
              +5 Putar Kepala
            </button>
            <button onclick="app.addKyorugiPoint('chung', -1)" class="bg-slate-800 hover:bg-slate-700 text-red-400 font-bold py-2 rounded text-sm border border-slate-700">
              -1 Koreksi
            </button>
          </div>

          <div class="pt-3 border-t border-slate-800 flex items-center justify-between">
            <span class="text-xs font-bold text-amber-400">Gam-jeom (Penalti): ${chung.gamjeom}</span>
            <div class="space-x-2">
              <button onclick="app.addGamJeom('chung')" class="bg-amber-600 hover:bg-amber-500 text-white font-bold px-3 py-1 rounded text-xs">
                +1 Gam-jeom
              </button>
              <button onclick="app.subtractGamJeom('chung')" class="bg-slate-800 hover:bg-slate-700 text-slate-300 px-3 py-1 rounded text-xs border border-slate-700">
                -1
              </button>
            </div>
          </div>

          <!-- Tools Tambahan Wasit / Juri: IVR & Medis Chung -->
          <div class="pt-2 border-t border-slate-800 grid grid-cols-2 gap-2 text-xs">
            <button onclick="app.triggerIVR('chung')" class="bg-blue-950 hover:bg-blue-900 text-blue-300 border border-blue-700 p-1.5 rounded font-bold">
              📹 Banding IVR (${chung.replayCardRemaining})
            </button>
            <button onclick="app.startMedicalTimeout('chung')" class="bg-red-950/80 hover:bg-red-900 text-red-200 border border-red-700 p-1.5 rounded font-bold">
              🚑 Medis (1:00)
            </button>
          </div>
        </div>
      </div>

      <!-- TIMER & ROUND MANAGEMENT (TENGAH) -->
      <div class="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col justify-between text-center">
        <div>
          <div class="text-xs text-slate-400 font-bold uppercase mb-1">PENGATUR RONDE</div>
          <div class="text-2xl font-digital font-bold text-amber-400 mb-2">RONDE ${round}</div>
          <button onclick="app.nextRound()" class="w-full bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold py-1.5 rounded border border-slate-700 mb-4">
            Ronde Berikutnya ⏩
          </button>
        </div>

        <div class="py-4 border-y border-slate-800">
          <div class="text-3xl font-digital font-black text-amber-400 dynamic-timer-text">${timeFormatted}</div>
          <div class="mt-3 space-y-1.5">
            <button onclick="app.toggleKyorugiTimer()" class="w-full ${timerRunning ? 'bg-amber-600 hover:bg-amber-500' : 'bg-emerald-600 hover:bg-emerald-500'} text-white font-bold py-2 rounded text-sm shadow">
              ${timerRunning ? 'PAUSE (KAL-YEO)' : 'START (KYE-SOK)'}
            </button>
            <div class="grid grid-cols-3 gap-1 text-[11px]">
              <button onclick="app.resetKyorugiTimer(60)" class="bg-slate-800 hover:bg-slate-700 p-1 rounded text-slate-300">1:00</button>
              <button onclick="app.resetKyorugiTimer(90)" class="bg-slate-800 hover:bg-slate-700 p-1 rounded text-slate-300">1:30</button>
              <button onclick="app.resetKyorugiTimer(120)" class="bg-slate-800 hover:bg-slate-700 p-1 rounded text-slate-300">2:00</button>
            </div>
          </div>
        </div>

        <!-- Panel Review IVR Aktif di Meja Operator -->
        ${appState.data.ivr.active ? `
          <div class="my-2 bg-amber-950/80 border border-amber-500 p-2 rounded text-[11px] text-amber-200">
            <div class="font-bold mb-1">Putusan Juri Replay:</div>
            <div class="grid grid-cols-2 gap-1">
              <button onclick="app.resolveIVR('ACCEPTED')" class="bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-1 rounded">
                DITERIMA ✓
              </button>
              <button onclick="app.resolveIVR('REJECTED')" class="bg-red-700 hover:bg-red-600 text-white font-bold py-1 rounded">
                DITOLAK ✗
              </button>
            </div>
          </div>
        ` : ''}

        <button onclick="app.resetKyorugiMatch()" class="mt-4 w-full bg-red-950 hover:bg-red-900 text-red-300 text-xs py-1.5 rounded border border-red-800">
          Reset Partai
        </button>
      </div>

      <!-- CONTROLS HONG (MERAH) -->
      <div class="lg:col-span-5 bg-slate-900 border-2 border-red-600/70 rounded-xl p-5 shadow-lg">
        <div class="flex items-center justify-between border-b border-red-800 pb-3 mb-4">
          <div class="text-right w-full mr-3">
            <span class="text-red-400 font-bold text-xs uppercase tracking-wider">SUDUT MERAH</span>
            <input type="text" value="${hong.name}" onchange="app.data.kyorugi.hong.name = this.value; app.notifyChange()" class="bg-slate-950 border border-red-500/50 px-2 py-1 rounded text-white font-bold w-full mt-1 text-right">
          </div>
          <div>
            <span class="text-4xl font-digital font-black text-red-400">${hong.score}</span>
          </div>
        </div>

        <div class="space-y-3">
          <div class="text-xs font-bold text-slate-400 uppercase">Input Poin Cepat:</div>
          <div class="grid grid-cols-3 gap-2">
            <button onclick="app.addKyorugiPoint('hong', 1)" class="bg-red-600 hover:bg-red-500 text-white font-bold py-2 rounded text-sm shadow">
              +1 Pukulan
            </button>
            <button onclick="app.addKyorugiPoint('hong', 2)" class="bg-red-600 hover:bg-red-500 text-white font-bold py-2 rounded text-sm shadow">
              +2 Badan
            </button>
            <button onclick="app.addKyorugiPoint('hong', 3)" class="bg-red-600 hover:bg-red-500 text-white font-bold py-2 rounded text-sm shadow">
              +3 Kepala
            </button>
            <button onclick="app.addKyorugiPoint('hong', 4)" class="bg-pink-700 hover:bg-pink-600 text-white font-bold py-2 rounded text-sm shadow">
              +4 Putar Badan
            </button>
            <button onclick="app.addKyorugiPoint('hong', 5)" class="bg-pink-700 hover:bg-pink-600 text-white font-bold py-2 rounded text-sm shadow">
              +5 Putar Kepala
            </button>
            <button onclick="app.addKyorugiPoint('hong', -1)" class="bg-slate-800 hover:bg-slate-700 text-red-400 font-bold py-2 rounded text-sm border border-slate-700">
              -1 Koreksi
            </button>
          </div>

          <div class="pt-3 border-t border-slate-800 flex items-center justify-between">
            <span class="text-xs font-bold text-amber-400">Gam-jeom (Penalti): ${hong.gamjeom}</span>
            <div class="space-x-2">
              <button onclick="app.addGamJeom('hong')" class="bg-amber-600 hover:bg-amber-500 text-white font-bold px-3 py-1 rounded text-xs">
                +1 Gam-jeom
              </button>
              <button onclick="app.subtractGamJeom('hong')" class="bg-slate-800 hover:bg-slate-700 text-slate-300 px-3 py-1 rounded text-xs border border-slate-700">
                -1
              </button>
            </div>
          </div>

          <!-- Tools Tambahan Wasit / Juri: IVR & Medis Hong -->
          <div class="pt-2 border-t border-slate-800 grid grid-cols-2 gap-2 text-xs">
            <button onclick="app.triggerIVR('hong')" class="bg-red-950 hover:bg-red-900 text-red-300 border border-red-700 p-1.5 rounded font-bold">
              📹 Banding IVR (${hong.replayCardRemaining})
            </button>
            <button onclick="app.startMedicalTimeout('hong')" class="bg-red-950/80 hover:bg-red-900 text-red-200 border border-red-700 p-1.5 rounded font-bold">
              🚑 Medis (1:00)
            </button>
          </div>
        </div>
      </div>

    </div>
  `;
}

function renderPoomsaeRecOperator(appState) {
  const { poomsaeRec } = appState.data;

  return `
    <div class="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg">
      <h4 class="text-base font-bold text-white mb-4">Input Nilai Juri Poomsae Recognised</h4>
      
      <div class="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
        ${poomsaeRec.judges.map((j, i) => `
          <div class="bg-slate-950 p-3 rounded-lg border border-slate-800">
            <div class="font-bold text-amber-400 text-sm mb-2">${j.id}</div>
            <label class="block text-xs text-slate-400 mb-1">Akurasi (Max 4.0):</label>
            <input type="number" step="0.1" min="0" max="4.0" value="${j.accuracy}" onchange="app.data.poomsaeRec.judges[${i}].accuracy = parseFloat(this.value); app.notifyChange()" class="w-full bg-slate-900 border border-slate-700 px-2 py-1 rounded text-white text-sm mb-2 font-mono">
            
            <label class="block text-xs text-slate-400 mb-1">Presentasi (Max 6.0):</label>
            <input type="number" step="0.1" min="0" max="6.0" value="${j.presentation}" onchange="app.data.poomsaeRec.judges[${i}].presentation = parseFloat(this.value); app.notifyChange()" class="w-full bg-slate-900 border border-slate-700 px-2 py-1 rounded text-white text-sm font-mono">
          </div>
        `).join('')}
      </div>

      <div class="flex items-center justify-between border-t border-slate-800 pt-4">
        <div>
          <label class="text-xs text-slate-400 mr-2">Pengurangan Penalti Panitia (-0.1 / -0.3):</label>
          <input type="number" step="0.1" value="${poomsaeRec.deductions}" onchange="app.data.poomsaeRec.deductions = parseFloat(this.value); app.notifyChange()" class="bg-slate-950 border border-slate-700 px-2 py-1 rounded text-white text-sm w-24">
        </div>
        <button onclick="app.calculatePoomsaeRecognised()" class="bg-amber-600 hover:bg-amber-500 text-white font-bold px-6 py-2 rounded-lg shadow-lg">
          Kalkulasi Nilai Truncated Mean & Tampilkan ke TV 📢
        </button>
      </div>
    </div>
  `;
}

function renderPoomsaeFreeOperator(appState) {
  return `
    <div class="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg">
      <h4 class="text-base font-bold text-white mb-2">Panel Operator Poomsae Freestyle</h4>
      <p class="text-xs text-slate-400 mb-4">Pengaturan durasi musik dan kalkulasi komprehensif 5 teknik wajib.</p>
      
      <div class="flex items-center space-x-4 mb-6">
        <div>
          <label class="block text-xs text-slate-400 mb-1">Durasi Penampilan (Detik):</label>
          <input type="number" value="${appState.data.poomsaeFree.musicDuration}" onchange="app.data.poomsaeFree.musicDuration = parseInt(this.value); app.notifyChange()" class="bg-slate-950 border border-slate-700 px-3 py-1.5 rounded text-white text-sm w-32 font-mono">
        </div>
        <button onclick="app.calculatePoomsaeFreestyle()" class="mt-5 bg-purple-600 hover:bg-purple-500 text-white font-bold px-6 py-2 rounded-lg shadow-lg">
          Kalkulasi Nilai Freestyle & Tampilkan ke TV 📢
        </button>
      </div>
    </div>
  `;
}

// ==========================================
// 3. RENDER PAD JURI (KPNP & DAEDO WT STANDARD JSD & DSS)
// ==========================================
function renderJudgePad(appState) {
  const { category, selectedJudgeId, judgePadMode = 'pss', poomsaeRec, kyorugi, court, division } = appState.data;
  const currentJudge = poomsaeRec.judges.find(j => j.id === selectedJudgeId) || poomsaeRec.judges[0];

  return `
    <main class="w-full min-h-[calc(100vh-50px)] bg-neutral-950 text-white p-2 sm:p-5 flex flex-col justify-between select-none">
      <div class="max-w-4xl mx-auto w-full">
        
        <!-- HARDWARE CASING KPNP / DAEDO WIRELESS CONTROLLER -->
        <div class="border-4 sm:border-8 border-neutral-800 rounded-3xl sm:rounded-[2.5rem] bg-gradient-to-b from-neutral-900 via-neutral-950 to-neutral-900 p-3 sm:p-5 shadow-[0_20px_50px_rgba(0,0,0,0.9)] relative">
          
          <!-- TOP HARDWARE STATUS TELEMETRY BAR (KPNP / DAEDO / DSS STANDARD) -->
          <div class="bg-black border border-neutral-800 rounded-xl px-4 py-2 mb-3 flex flex-wrap items-center justify-between text-xs text-neutral-400 font-mono gap-2">
            <div class="flex items-center space-x-3">
              <span class="flex items-center space-x-1.5 text-emerald-400 font-bold">
                <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span class="tracking-wider">${judgePadMode === 'dss' ? 'WT DSS CONTROLLER' : 'DAEDO Gen2 / KPNP PSS'}</span>
              </span>
              <span class="text-neutral-600">|</span>
              <span class="text-amber-400 font-bold">${court}</span>
              <span class="text-neutral-600">|</span>
              <span class="text-slate-300 font-bold font-sans">${selectedJudgeId}</span>
            </div>

            <div class="flex items-center space-x-3 my-0.5">
              <span class="bg-neutral-900 border border-neutral-700 px-2 py-0.5 rounded text-[11px] text-amber-300 font-bold">
                ${kyorugi.round ? `R${kyorugi.round}` : 'R1'} [BEST OF 3]
              </span>
              <span class="text-emerald-400 font-bold font-digital text-sm dynamic-timer-text">
                ${appState.formatTime(kyorugi.timerSeconds)}
              </span>
              <span class="text-cyan-400 font-bold">📶 2.4GHz RF</span>
              <span class="text-emerald-400 font-bold">🔋 98%</span>
            </div>

            <!-- Selector ID Juri (J1 s/d J5) -->
            <div class="flex items-center space-x-1 bg-neutral-900 p-1 rounded-lg border border-neutral-800">
              <span class="text-[10px] text-neutral-500 px-1 font-sans">JURI:</span>
              ${['J1', 'J2', 'J3', 'J4', 'J5'].map(id => `
                <button onclick="app.setJudgeId('${id}')" class="px-2 py-0.5 rounded text-xs font-bold transition-all ${id === selectedJudgeId ? 'bg-amber-500 text-black shadow font-black' : 'text-neutral-400 hover:text-white'}">
                  ${id}
                </button>
              `).join('')}
            </div>
          </div>

          <!-- SELECTOR MODEL APPARATUS: PSS (SENSOR) vs DSS (MANUAL DIGITAL SCORING SYSTEM) -->
          ${category === 'kyorugi' ? `
            <div class="flex flex-wrap items-center justify-between bg-neutral-900/90 border border-neutral-800 rounded-xl px-3 py-1.5 mb-3 text-xs gap-2">
              <div class="flex items-center space-x-2">
                <span class="text-neutral-400 font-bold uppercase text-[10px]">MODEL PERANGKAT:</span>
                <div class="flex items-center space-x-1 bg-black p-0.5 rounded-lg border border-neutral-800">
                  <button onclick="app.setJudgePadMode('pss')" class="px-3 py-1 rounded text-xs font-bold transition-all ${judgePadMode === 'pss' ? 'bg-blue-600 text-white shadow' : 'text-neutral-400 hover:text-white'}">
                    🛡️ Model PSS (Sensor Elektronik)
                  </button>
                  <button onclick="app.setJudgePadMode('dss')" class="px-3 py-1 rounded text-xs font-bold transition-all ${judgePadMode === 'dss' ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-black shadow font-black ring-1 ring-amber-300' : 'text-neutral-400 hover:text-white'}">
                    🎛️ Model DSS (Digital Scoring System)
                  </button>
                </div>
              </div>
              <div class="flex items-center space-x-2 text-[11px] font-mono">
                <a href="judge_pad_tablet.html" target="_blank" class="px-2.5 py-1 bg-gradient-to-r from-amber-500 to-emerald-500 text-black font-extrabold rounded-lg shadow hover:opacity-90 flex items-center space-x-1">
                  <span>📱</span><span>Buka Mode Tablet Khusus ↗</span>
                </a>
                ${judgePadMode === 'dss' 
                  ? '<span class="text-amber-400 font-bold flex items-center space-x-1"><span class="w-2 h-2 rounded-full bg-amber-400 animate-ping"></span><span>MODE DSS AKTIF (6 TOMBOL)</span></span>' 
                  : '<span class="text-emerald-400 font-bold">● MODE PSS AKTIF</span>'}
              </div>
            </div>
          ` : ''}

          <!-- KONTEN PAD SESUAI KATEGORI -->
          ${category === 'kyorugi' ? (
            judgePadMode === 'dss' ? `
            <!-- ============================================== -->
            <!-- KYORUGI MODEL DSS (DIGITAL SCORING SYSTEM)     -->
            <!-- ============================================== -->
            <div class="space-y-3 my-1">
              
              <!-- DSS Status & Consensus Monitor Bar -->
              <div class="bg-gradient-to-r from-neutral-900 via-neutral-950 to-neutral-900 border border-neutral-800 rounded-2xl p-2.5 sm:p-3 flex flex-wrap items-center justify-between text-xs font-mono shadow-inner gap-2">
                <div class="flex items-center space-x-2 sm:space-x-3">
                  <span class="bg-amber-500/20 text-amber-300 font-black px-2.5 py-1 rounded-lg border border-amber-500/30 text-[11px]">
                    🎛️ WT DSS TACTILE CONTROLLER
                  </span>
                  <span class="text-neutral-400 text-[11px]">Toleransi: <b class="text-white">1.0 Detik</b></span>
                  <span class="text-neutral-400 text-[11px]">Sah: <b class="text-emerald-400">Min. 2 Juri</b></span>
                </div>

                <!-- Consensus Lights for J1, J2, J3 -->
                <div class="flex items-center space-x-2">
                  <span class="text-neutral-500 text-[10px]">LAMPU KONSENSUS:</span>
                  <span class="flex items-center space-x-1 bg-black px-2 py-0.5 rounded border border-neutral-800 text-[10px]">
                    <span class="w-2 h-2 rounded-full bg-emerald-500"></span>
                    <span class="text-neutral-300 font-bold">J1</span>
                  </span>
                  <span class="flex items-center space-x-1 bg-black px-2 py-0.5 rounded border border-neutral-800 text-[10px]">
                    <span class="w-2 h-2 rounded-full bg-emerald-500"></span>
                    <span class="text-neutral-300 font-bold">J2</span>
                  </span>
                  <span class="flex items-center space-x-1 bg-black px-2 py-0.5 rounded border border-neutral-800 text-[10px]">
                    <span class="w-2 h-2 rounded-full bg-emerald-500"></span>
                    <span class="text-neutral-300 font-bold">J3</span>
                  </span>
                  <span class="bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded text-[10px] font-bold">
                    SYNCED
                  </span>
                </div>
              </div>

              <!-- Dual Split Tactile Buttons Grid -->
              <div class="grid grid-cols-2 gap-3 sm:gap-5">
                
                <!-- SISI KIRI: CHUNG (BIRU) DSS CONTROLLER -->
                <div class="bg-gradient-to-b from-[#002b5c] via-[#003d7e] to-[#001f42] rounded-2xl sm:rounded-3xl p-3 sm:p-4 border-4 border-blue-500 shadow-2xl flex flex-col justify-between relative overflow-hidden">
                  <div class="flex items-center justify-between border-b border-blue-400/40 pb-2 mb-2">
                    <div class="flex items-center space-x-2">
                      <span class="w-3 h-3 rounded-full bg-blue-400 animate-ping"></span>
                      <span class="text-blue-100 font-black tracking-widest text-sm sm:text-base font-display">CHUNG (청) • BIRU</span>
                    </div>
                    <span class="text-xs bg-blue-950 text-blue-200 border border-blue-400/40 px-2.5 py-0.5 rounded-md font-mono font-bold">SKOR: ${kyorugi.chung.score}</span>
                  </div>

                  <!-- 6 DSS Tactile Buttons for Chung -->
                  <div class="grid grid-cols-2 gap-2 my-1">
                    <!-- 1. PUKULAN (1 PT) -->
                    <button onclick="app.addKyorugiPoint('chung', 1); triggerJudgeFeedback(this);" class="py-3 sm:py-3.5 bg-gradient-to-b from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 active:scale-95 text-white font-black rounded-xl border border-blue-300/60 shadow-lg flex flex-col items-center justify-center space-y-0.5 transition-all">
                      <span class="text-xl sm:text-2xl">🥊</span>
                      <span class="text-xs font-bold">PUKULAN</span>
                      <span class="text-[9px] bg-blue-950/80 text-blue-200 px-2 py-0.2 rounded-full font-mono">1 POIN</span>
                    </button>

                    <!-- 2. TENDANGAN BADAN (2 PTS) -->
                    <button onclick="app.addKyorugiPoint('chung', 2); triggerJudgeFeedback(this);" class="py-3 sm:py-3.5 bg-gradient-to-b from-blue-500 to-blue-600 hover:from-blue-400 hover:to-blue-500 active:scale-95 text-white font-black rounded-xl border border-blue-300/80 shadow-lg flex flex-col items-center justify-center space-y-0.5 transition-all">
                      <span class="text-xl sm:text-2xl">🥋</span>
                      <span class="text-xs font-bold">BADAN (TRUNK)</span>
                      <span class="text-[9px] bg-blue-950/80 text-blue-100 px-2 py-0.2 rounded-full font-mono font-bold">2 POIN</span>
                    </button>

                    <!-- 3. TENDANGAN KEPALA (3 PTS) -->
                    <button onclick="app.addKyorugiPoint('chung', 3); triggerJudgeFeedback(this);" class="py-3 sm:py-3.5 bg-gradient-to-b from-indigo-600 to-blue-700 hover:from-indigo-500 hover:to-blue-600 active:scale-95 text-white font-black rounded-xl border border-indigo-300 shadow-lg flex flex-col items-center justify-center space-y-0.5 transition-all">
                      <span class="text-xl sm:text-2xl">🎯</span>
                      <span class="text-xs font-bold">KEPALA (HEAD)</span>
                      <span class="text-[9px] bg-indigo-950/80 text-indigo-100 px-2 py-0.2 rounded-full font-mono font-bold">3 POIN</span>
                    </button>

                    <!-- 4. PUTAR BADAN (4 PTS) -->
                    <button onclick="app.addKyorugiPoint('chung', 4); triggerJudgeFeedback(this);" class="py-3 sm:py-3.5 bg-gradient-to-b from-cyan-600 to-blue-800 hover:from-cyan-500 hover:to-blue-700 active:scale-95 text-white font-black rounded-xl border border-cyan-300 shadow-lg flex flex-col items-center justify-center space-y-0.5 transition-all">
                      <span class="text-xl sm:text-2xl">🌪️</span>
                      <span class="text-xs font-bold">PUTAR BADAN</span>
                      <span class="text-[9px] bg-cyan-950/80 text-cyan-200 px-2 py-0.2 rounded-full font-mono font-bold">4 POIN (2+2)</span>
                    </button>

                    <!-- 5. PUTAR KEPALA (5 PTS) -->
                    <button onclick="app.addKyorugiPoint('chung', 5); triggerJudgeFeedback(this);" class="col-span-2 py-2.5 sm:py-3 bg-gradient-to-r from-amber-500 via-blue-600 to-indigo-600 hover:from-amber-400 hover:to-indigo-500 active:scale-95 text-white font-black rounded-xl border-2 border-amber-300 shadow-lg flex items-center justify-center space-x-2 transition-all">
                      <span class="text-lg">⚡</span>
                      <span class="text-xs sm:text-sm font-black">PUTAR KEPALA (SPIN HEAD)</span>
                      <span class="text-[10px] bg-black/60 text-amber-300 px-2 py-0.5 rounded-full font-mono font-bold">5 POIN (3+2)</span>
                    </button>
                  </div>

                  <!-- Tombol Batal Chung -->
                  <div class="mt-2 pt-2 border-t border-blue-400/30">
                    <button onclick="app.addKyorugiPoint('chung', -1); triggerJudgeFeedback(this);" class="w-full py-1.5 bg-neutral-900/90 hover:bg-neutral-800 active:scale-95 text-red-400 hover:text-red-300 font-bold text-xs rounded-lg border border-neutral-700 flex items-center justify-center space-x-1.5 transition">
                      <span>↩️</span> <span>BATAL / KOREKSI (-1 POIN)</span>
                    </button>
                  </div>
                </div>

                <!-- SISI KANAN: HONG (MERAH) DSS CONTROLLER -->
                <div class="bg-gradient-to-b from-[#660012] via-[#8c0018] to-[#4a000d] rounded-2xl sm:rounded-3xl p-3 sm:p-4 border-4 border-red-500 shadow-2xl flex flex-col justify-between relative overflow-hidden">
                  <div class="flex items-center justify-between border-b border-red-400/40 pb-2 mb-2">
                    <div class="flex items-center space-x-2">
                      <span class="w-3 h-3 rounded-full bg-red-400 animate-ping"></span>
                      <span class="text-red-100 font-black tracking-widest text-sm sm:text-base font-display">HONG (홍) • MERAH</span>
                    </div>
                    <span class="text-xs bg-red-950 text-red-200 border border-red-400/40 px-2.5 py-0.5 rounded-md font-mono font-bold">SKOR: ${kyorugi.hong.score}</span>
                  </div>

                  <!-- 6 DSS Tactile Buttons for Hong -->
                  <div class="grid grid-cols-2 gap-2 my-1">
                    <!-- 1. PUKULAN (1 PT) -->
                    <button onclick="app.addKyorugiPoint('hong', 1); triggerJudgeFeedback(this);" class="py-3 sm:py-3.5 bg-gradient-to-b from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 active:scale-95 text-white font-black rounded-xl border border-red-300/60 shadow-lg flex flex-col items-center justify-center space-y-0.5 transition-all">
                      <span class="text-xl sm:text-2xl">🥊</span>
                      <span class="text-xs font-bold">PUKULAN</span>
                      <span class="text-[9px] bg-red-950/80 text-red-200 px-2 py-0.2 rounded-full font-mono">1 POIN</span>
                    </button>

                    <!-- 2. TENDANGAN BADAN (2 PTS) -->
                    <button onclick="app.addKyorugiPoint('hong', 2); triggerJudgeFeedback(this);" class="py-3 sm:py-3.5 bg-gradient-to-b from-red-500 to-red-600 hover:from-red-400 hover:to-red-500 active:scale-95 text-white font-black rounded-xl border border-red-300/80 shadow-lg flex flex-col items-center justify-center space-y-0.5 transition-all">
                      <span class="text-xl sm:text-2xl">🥋</span>
                      <span class="text-xs font-bold">BADAN (TRUNK)</span>
                      <span class="text-[9px] bg-red-950/80 text-red-100 px-2 py-0.2 rounded-full font-mono font-bold">2 POIN</span>
                    </button>

                    <!-- 3. TENDANGAN KEPALA (3 PTS) -->
                    <button onclick="app.addKyorugiPoint('hong', 3); triggerJudgeFeedback(this);" class="py-3 sm:py-3.5 bg-gradient-to-b from-rose-600 to-red-700 hover:from-rose-500 hover:to-red-600 active:scale-95 text-white font-black rounded-xl border border-rose-300 shadow-lg flex flex-col items-center justify-center space-y-0.5 transition-all">
                      <span class="text-xl sm:text-2xl">🎯</span>
                      <span class="text-xs font-bold">KEPALA (HEAD)</span>
                      <span class="text-[9px] bg-rose-950/80 text-rose-100 px-2 py-0.2 rounded-full font-mono font-bold">3 POIN</span>
                    </button>

                    <!-- 4. PUTAR BADAN (4 PTS) -->
                    <button onclick="app.addKyorugiPoint('hong', 4); triggerJudgeFeedback(this);" class="py-3 sm:py-3.5 bg-gradient-to-b from-orange-600 to-red-800 hover:from-orange-500 hover:to-red-700 active:scale-95 text-white font-black rounded-xl border border-orange-300 shadow-lg flex flex-col items-center justify-center space-y-0.5 transition-all">
                      <span class="text-xl sm:text-2xl">🌪️</span>
                      <span class="text-xs font-bold">PUTAR BADAN</span>
                      <span class="text-[9px] bg-orange-950/80 text-orange-200 px-2 py-0.2 rounded-full font-mono font-bold">4 POIN (2+2)</span>
                    </button>

                    <!-- 5. PUTAR KEPALA (5 PTS) -->
                    <button onclick="app.addKyorugiPoint('hong', 5); triggerJudgeFeedback(this);" class="col-span-2 py-2.5 sm:py-3 bg-gradient-to-r from-amber-500 via-red-600 to-rose-600 hover:from-amber-400 hover:to-rose-500 active:scale-95 text-white font-black rounded-xl border-2 border-amber-300 shadow-lg flex items-center justify-center space-x-2 transition-all">
                      <span class="text-lg">⚡</span>
                      <span class="text-xs sm:text-sm font-black">PUTAR KEPALA (SPIN HEAD)</span>
                      <span class="text-[10px] bg-black/60 text-amber-300 px-2 py-0.5 rounded-full font-mono font-bold">5 POIN (3+2)</span>
                    </button>
                  </div>

                  <!-- Tombol Batal Hong -->
                  <div class="mt-2 pt-2 border-t border-red-400/30">
                    <button onclick="app.addKyorugiPoint('hong', -1); triggerJudgeFeedback(this);" class="w-full py-1.5 bg-neutral-900/90 hover:bg-neutral-800 active:scale-95 text-red-400 hover:text-red-300 font-bold text-xs rounded-lg border border-neutral-700 flex items-center justify-center space-x-1.5 transition">
                      <span>↩️</span> <span>BATAL / KOREKSI (-1 POIN)</span>
                    </button>
                  </div>
                </div>

              </div>

              <!-- Footer DSS -->
              <div class="bg-black border border-neutral-800 rounded-xl p-2.5 px-4 flex flex-wrap items-center justify-between text-xs text-neutral-400 font-mono">
                <div class="flex items-center space-x-2 text-emerald-400">
                  <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                  <span>STATUS DSS: Siap Menerima Input Tombol Juri (RF Wireless Latensi &lt; 5ms)</span>
                </div>
                <div class="text-amber-400 font-bold">
                  ATURAN WT: 2+ JURI SEPAKAT DALAM 1.0s = POIN SAH
                </div>
              </div>

            </div>
          ` : `
            <!-- ============================================== -->
            <!-- KYORUGI MODEL PSS (KPNP & DAEDO SENSOR SYSTEM) -->
            <!-- ============================================== -->
            <div class="grid grid-cols-2 gap-3 sm:gap-6 my-2">
              
              <!-- SISI KIRI: CHUNG (BIRU) -->
              <div class="bg-gradient-to-b from-[#003875] via-[#004f9e] to-[#002855] rounded-2xl sm:rounded-3xl p-3 sm:p-5 border-4 border-blue-500 shadow-2xl flex flex-col justify-between min-h-[360px] relative overflow-hidden">
                <div class="flex items-center justify-between border-b border-blue-400/40 pb-2 mb-2">
                  <div class="flex items-center space-x-2">
                    <span class="w-3 h-3 rounded-full bg-blue-400 animate-ping"></span>
                    <span class="text-blue-100 font-black tracking-widest text-base sm:text-lg font-display">CHUNG (청)</span>
                  </div>
                  <span class="text-xs bg-blue-950/80 text-blue-200 border border-blue-400/40 px-2 py-0.5 rounded font-mono">SKOR: ${kyorugi.chung.score}</span>
                </div>

                <!-- TOMBOL PUKULAN UTAMA (PUNCH 1 PT) -->
                <button onclick="app.addKyorugiPoint('chung', 1); triggerJudgeFeedback(this);" class="my-auto w-full py-8 sm:py-10 bg-gradient-to-b from-blue-500 to-blue-600 hover:from-blue-400 hover:to-blue-500 active:scale-95 text-white font-black text-2xl sm:text-4xl rounded-2xl shadow-[0_10px_25px_rgba(0,102,204,0.6)] border-2 border-blue-300 flex flex-col items-center justify-center space-y-1 transition-all">
                  <span class="text-3xl sm:text-4xl">🥊</span>
                  <span>PUKULAN (PUNCH)</span>
                  <span class="text-xs sm:text-sm font-medium text-blue-100 bg-blue-900/60 px-3 py-0.5 rounded-full border border-blue-400/40">1 POIN RESMI WT</span>
                </button>

                <!-- TOMBOL TEKNIK PUTAR & KEPALA BACKUP -->
                <div class="space-y-2 mt-2">
                  <button onclick="app.addKyorugiPoint('chung', 2); triggerJudgeFeedback(this);" class="w-full py-3 bg-gradient-to-r from-indigo-800 to-blue-900 hover:from-indigo-700 hover:to-blue-800 active:scale-95 text-blue-100 font-extrabold text-xs sm:text-sm rounded-xl border border-blue-400/50 shadow flex items-center justify-center space-x-2">
                    <span>⚡</span>
                    <span>TEKNIK PUTAR (TECH +2 PTS)</span>
                  </button>
                  <button onclick="app.addKyorugiPoint('chung', 3); triggerJudgeFeedback(this);" class="w-full py-2 bg-neutral-900/80 hover:bg-neutral-800 active:scale-95 text-blue-200 font-semibold text-xs rounded-lg border border-neutral-700 flex items-center justify-center space-x-1">
                    <span>🎯</span>
                    <span>KEPALA MANUAL (HEAD +3 PTS)</span>
                  </button>
                </div>
              </div>

              <!-- SISI KANAN: HONG (MERAH) -->
              <div class="bg-gradient-to-b from-[#8c0018] via-[#b30020] to-[#660012] rounded-2xl sm:rounded-3xl p-3 sm:p-5 border-4 border-red-500 shadow-2xl flex flex-col justify-between min-h-[360px] relative overflow-hidden">
                <div class="flex items-center justify-between border-b border-red-400/40 pb-2 mb-2">
                  <div class="flex items-center space-x-2">
                    <span class="w-3 h-3 rounded-full bg-red-400 animate-ping"></span>
                    <span class="text-red-100 font-black tracking-widest text-base sm:text-lg font-display">HONG (홍)</span>
                  </div>
                  <span class="text-xs bg-red-950/80 text-red-200 border border-red-400/40 px-2 py-0.5 rounded font-mono">SKOR: ${kyorugi.hong.score}</span>
                </div>

                <!-- TOMBOL PUKULAN UTAMA (PUNCH 1 PT) -->
                <button onclick="app.addKyorugiPoint('hong', 1); triggerJudgeFeedback(this);" class="my-auto w-full py-8 sm:py-10 bg-gradient-to-b from-red-500 to-red-600 hover:from-red-400 hover:to-red-500 active:scale-95 text-white font-black text-2xl sm:text-4xl rounded-2xl shadow-[0_10px_25px_rgba(217,4,41,0.6)] border-2 border-red-300 flex flex-col items-center justify-center space-y-1 transition-all">
                  <span class="text-3xl sm:text-4xl">🥊</span>
                  <span>PUKULAN (PUNCH)</span>
                  <span class="text-xs sm:text-sm font-medium text-red-100 bg-red-900/60 px-3 py-0.5 rounded-full border border-red-400/40">1 POIN RESMI WT</span>
                </button>

                <!-- TOMBOL TEKNIK PUTAR & KEPALA BACKUP -->
                <div class="space-y-2 mt-2">
                  <button onclick="app.addKyorugiPoint('hong', 2); triggerJudgeFeedback(this);" class="w-full py-3 bg-gradient-to-r from-rose-900 to-red-900 hover:from-rose-800 hover:to-red-800 active:scale-95 text-red-100 font-extrabold text-xs sm:text-sm rounded-xl border border-red-400/50 shadow flex items-center justify-center space-x-2">
                    <span>⚡</span>
                    <span>TEKNIK PUTAR (TECH +2 PTS)</span>
                  </button>
                  <button onclick="app.addKyorugiPoint('hong', 3); triggerJudgeFeedback(this);" class="w-full py-2 bg-neutral-900/80 hover:bg-neutral-800 active:scale-95 text-red-200 font-semibold text-xs rounded-lg border border-neutral-700 flex items-center justify-center space-x-1">
                    <span>🎯</span>
                    <span>KEPALA MANUAL (HEAD +3 PTS)</span>
                  </button>
                </div>
              </div>

            </div>

            <!-- FOOTER STATUS WINDOW TOLERANSI WT (1.0 DETIK) -->
            <div class="mt-3 bg-black/80 border border-neutral-800 rounded-xl p-2.5 px-4 flex items-center justify-between text-xs text-neutral-400">
              <span class="flex items-center space-x-2">
                <span class="w-2 h-2 rounded-full bg-emerald-400"></span>
                <span>Standar Validasi Pukulan WT: Minimal 2 dari 3 juri menekan dalam jendela waktu <b>1.0 detik</b>.</span>
              </span>
              <span class="text-amber-400 font-mono font-bold">READY 1.0s</span>
            </div>
          `) : category === 'poomsae_rec' ? `
            <!-- ============================================== -->
            <!-- POOMSAE RECOGNISED TERMINAL (KPNP & DAEDO)     -->
            <!-- ============================================== -->
            <div class="space-y-4 my-2">
              
              <!-- Info Peserta -->
              <div class="bg-black/70 border border-neutral-800 rounded-xl p-3 flex items-center justify-between">
                <div>
                  <span class="text-[10px] text-amber-400 font-bold uppercase tracking-wider">PESERTA POOMSAE STANDAR</span>
                  <div class="font-bold text-white text-base font-display">${poomsaeRec.athleteName} (${poomsaeRec.team})</div>
                </div>
                <div class="text-right">
                  <span class="text-[10px] text-neutral-400 uppercase">JURUS DIUJI</span>
                  <div class="text-amber-400 font-bold text-sm font-display">${poomsaeRec.poomsaeName}</div>
                </div>
              </div>

              <!-- 1. MATRIKS AKURASI (MAX 4.00) DENGAN COUNTER DEDUKSI RESMI WT -->
              <div class="bg-neutral-900 border border-neutral-800 rounded-2xl p-4">
                <div class="flex items-center justify-between mb-3">
                  <div>
                    <span class="text-blue-400 font-bold text-xs uppercase tracking-wider block">1. NILAI AKURASI (ACCURACY)</span>
                    <span class="text-[11px] text-neutral-400">Pengurangan bertahap dari nilai dasar 4.00</span>
                  </div>
                  <div class="text-right">
                    <span class="font-digital text-4xl font-black text-blue-400">${currentJudge.accuracy.toFixed(1)}</span>
                    <span class="text-xs text-neutral-500 block">/ 4.00 MAX</span>
                  </div>
                </div>

                <!-- Tombol Deduksi KPNP / Daedo Standard -->
                <div class="grid grid-cols-4 gap-2">
                  <button onclick="app.updateJudgeScore('${selectedJudgeId}', Math.max(0, currentJudge.accuracy - 0.1).toFixed(1), currentJudge.presentation)" class="py-4 bg-amber-500/15 hover:bg-amber-500/25 active:scale-95 text-amber-400 font-black rounded-xl border border-amber-500/40 text-center flex flex-col items-center justify-center">
                    <span class="text-xl sm:text-2xl font-digital">-0.1</span>
                    <span class="text-[10px] uppercase font-sans mt-0.5">Minor (Kecil)</span>
                  </button>
                  <button onclick="app.updateJudgeScore('${selectedJudgeId}', Math.max(0, currentJudge.accuracy - 0.3).toFixed(1), currentJudge.presentation)" class="py-4 bg-red-500/15 hover:bg-red-500/25 active:scale-95 text-red-400 font-black rounded-xl border border-red-500/40 text-center flex flex-col items-center justify-center">
                    <span class="text-xl sm:text-2xl font-digital">-0.3</span>
                    <span class="text-[10px] uppercase font-sans mt-0.5">Major (Besar)</span>
                  </button>
                  <button onclick="app.updateJudgeScore('${selectedJudgeId}', Math.min(4.0, currentJudge.accuracy + 0.1).toFixed(1), currentJudge.presentation)" class="py-4 bg-blue-500/15 hover:bg-blue-500/25 active:scale-95 text-blue-300 font-bold rounded-xl border border-blue-500/40 text-center flex flex-col items-center justify-center">
                    <span class="text-xl sm:text-2xl font-digital">+0.1</span>
                    <span class="text-[10px] uppercase font-sans mt-0.5">Batal / Undo</span>
                  </button>
                  <button onclick="app.updateJudgeScore('${selectedJudgeId}', 4.0, currentJudge.presentation)" class="py-4 bg-neutral-800 hover:bg-neutral-700 active:scale-95 text-neutral-300 font-bold rounded-xl border border-neutral-700 text-center flex flex-col items-center justify-center">
                    <span class="text-lg font-mono">4.00</span>
                    <span class="text-[10px] uppercase font-sans mt-0.5">Reset Dasar</span>
                  </button>
                </div>
              </div>

              <!-- 2. MATRIKS PRESENTASI 3 SUB-SKOR (MAX 6.00) -->
              <div class="bg-neutral-900 border border-neutral-800 rounded-2xl p-4">
                <div class="flex items-center justify-between mb-3">
                  <div>
                    <span class="text-emerald-400 font-bold text-xs uppercase tracking-wider block">2. NILAI PRESENTASI (PRESENTATION)</span>
                    <span class="text-[11px] text-neutral-400">Kecepatan & Daya, Irama, dan Penguasaan Energi</span>
                  </div>
                  <div class="text-right">
                    <span class="font-digital text-4xl font-black text-emerald-400">${currentJudge.presentation.toFixed(1)}</span>
                    <span class="text-xs text-neutral-500 block">/ 6.00 MAX</span>
                  </div>
                </div>

                <div class="space-y-3">
                  <input type="range" min="0" max="6.0" step="0.1" value="${currentJudge.presentation}" oninput="app.updateJudgeScore('${selectedJudgeId}', currentJudge.accuracy, this.value)" class="w-full accent-emerald-500 h-3 bg-neutral-800 rounded-lg cursor-pointer">
                  <div class="flex justify-between text-xs text-neutral-400 font-mono">
                    <span>0.0 (Sangat Kurang)</span>
                    <span>3.0 (Cukup)</span>
                    <span>4.5 (Baik)</span>
                    <span>6.0 (Sempurna)</span>
                  </div>
                </div>
              </div>

              <!-- TOTAL LIVE PRATINJAU & TOMBOL TRANSMIT -->
              <div class="bg-black/60 border border-neutral-800 rounded-2xl p-3 flex items-center justify-between">
                <div class="text-left">
                  <span class="text-[10px] text-neutral-400 uppercase">AKUMULASI SKOR JURI ${selectedJudgeId}:</span>
                  <div class="font-digital text-3xl font-black text-amber-400">
                    ${(currentJudge.accuracy + currentJudge.presentation).toFixed(2)}
                  </div>
                </div>

                <button onclick="app.calculatePoomsaeRecognised(); triggerTransmitFeedback(this);" class="py-3.5 px-6 sm:px-8 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 active:scale-95 text-white font-extrabold text-sm sm:text-base rounded-xl shadow-xl flex items-center space-x-2 border border-emerald-400">
                  <span>✓</span>
                  <span>KIRIM NILAI KE SERVER PSS (TRANSMIT)</span>
                </button>
              </div>

            </div>
          ` : `
            <!-- ============================================== -->
            <!-- POOMSAE FREESTYLE TERMINAL (KPNP & DAEDO)      -->
            <!-- ============================================== -->
            <div class="space-y-4 my-2">
              
              <!-- Header Freestyle -->
              <div class="bg-black/70 border border-purple-900/60 rounded-xl p-3 flex items-center justify-between">
                <div>
                  <span class="text-[10px] text-purple-400 font-bold uppercase tracking-wider">FREESTYLE JURY TERMINAL</span>
                  <div class="font-bold text-white text-base font-display">${appState.data.poomsaeFree.athleteName}</div>
                  <div class="text-xs text-purple-300">Musik: ${appState.data.poomsaeFree.musicTitle}</div>
                </div>
                <div class="text-right">
                  <span class="text-[10px] text-neutral-400 uppercase">DURASI MUSIK</span>
                  <div class="text-emerald-400 font-digital text-xl font-bold">⏱️ 95s (Optimal)</div>
                </div>
              </div>

              <!-- 5 ELEMEN WAJIB DIUJI (TECHNICAL SKILLS 6.0) -->
              <div class="bg-neutral-900 border border-neutral-800 rounded-2xl p-4">
                <span class="text-purple-400 font-bold text-xs uppercase tracking-wider block mb-2.5">
                  1. TECHNICAL SKILLS: 5 ELEMEN WAJIB RESMI WT (MAX 6.00)
                </span>
                <div class="grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-xs">
                  <div class="bg-black/60 p-2.5 rounded-xl border border-neutral-800">
                    <div class="font-bold text-neutral-200">1. Jump Side Kick</div>
                    <div class="text-[10px] text-neutral-400 mb-1">Tinggi Lompatan</div>
                    <input type="number" step="0.1" min="0" max="1.0" value="0.9" class="w-full bg-neutral-900 border border-purple-500/50 rounded px-2 py-1 text-purple-300 font-mono text-center font-bold">
                  </div>
                  <div class="bg-black/60 p-2.5 rounded-xl border border-neutral-800">
                    <div class="font-bold text-neutral-200">2. Multiple Kicks</div>
                    <div class="text-[10px] text-neutral-400 mb-1">Jumlah Target Udara</div>
                    <input type="number" step="0.1" min="0" max="1.0" value="0.8" class="w-full bg-neutral-900 border border-purple-500/50 rounded px-2 py-1 text-purple-300 font-mono text-center font-bold">
                  </div>
                  <div class="bg-black/60 p-2.5 rounded-xl border border-neutral-800">
                    <div class="font-bold text-neutral-200">3. Spinning Kick</div>
                    <div class="text-[10px] text-neutral-400 mb-1">Putaran 540°/720°</div>
                    <input type="number" step="0.1" min="0" max="1.0" value="0.9" class="w-full bg-neutral-900 border border-purple-500/50 rounded px-2 py-1 text-purple-300 font-mono text-center font-bold">
                  </div>
                  <div class="bg-black/60 p-2.5 rounded-xl border border-neutral-800">
                    <div class="font-bold text-neutral-200">4. Basic Moves</div>
                    <div class="text-[10px] text-neutral-400 mb-1">Kuda-kuda Baku</div>
                    <input type="number" step="0.1" min="0" max="1.0" value="0.8" class="w-full bg-neutral-900 border border-purple-500/50 rounded px-2 py-1 text-purple-300 font-mono text-center font-bold">
                  </div>
                  <div class="bg-black/60 p-2.5 rounded-xl border border-neutral-800">
                    <div class="font-bold text-neutral-200">5. Acrobatic Kick</div>
                    <div class="text-[10px] text-neutral-400 mb-1">Tendangan Salto</div>
                    <input type="number" step="0.1" min="0" max="1.0" value="0.9" class="w-full bg-neutral-900 border border-purple-500/50 rounded px-2 py-1 text-purple-300 font-mono text-center font-bold">
                  </div>
                  <div class="bg-black/60 p-2.5 rounded-xl border border-neutral-800">
                    <div class="font-bold text-neutral-200">6. Basic TKD Stances</div>
                    <div class="text-[10px] text-neutral-400 mb-1">Ketepatan Mendarat</div>
                    <input type="number" step="0.1" min="0" max="1.0" value="0.8" class="w-full bg-neutral-900 border border-purple-500/50 rounded px-2 py-1 text-purple-300 font-mono text-center font-bold">
                  </div>
                </div>
              </div>

              <!-- 2. PRESENTASI & KOREOGRAFI (MAX 4.00) -->
              <div class="bg-neutral-900 border border-neutral-800 rounded-2xl p-4">
                <span class="text-pink-400 font-bold text-xs uppercase tracking-wider block mb-2">
                  2. PRESENTATION & HARMONY DENGAN MUSIK (MAX 4.00)
                </span>
                <div class="grid grid-cols-2 gap-3 text-xs">
                  <div class="bg-black/60 p-2.5 rounded-xl border border-neutral-800">
                    <div class="font-bold text-neutral-300 mb-1">Kreativitas & Koreografi:</div>
                    <input type="number" step="0.1" min="0" max="1.0" value="0.9" class="w-full bg-neutral-900 border border-pink-500/50 rounded px-2 py-1 text-pink-300 font-mono text-center font-bold">
                  </div>
                  <div class="bg-black/60 p-2.5 rounded-xl border border-neutral-800">
                    <div class="font-bold text-neutral-300 mb-1">Keselarasan Musik & Beat:</div>
                    <input type="number" step="0.1" min="0" max="1.0" value="0.8" class="w-full bg-neutral-900 border border-pink-500/50 rounded px-2 py-1 text-pink-300 font-mono text-center font-bold">
                  </div>
                </div>
              </div>

              <!-- TRANSMIT FREESTYLE SCORE -->
              <button onclick="app.calculatePoomsaeFreestyle(); triggerTransmitFeedback(this);" class="w-full py-4 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 active:scale-95 text-white font-extrabold text-sm sm:text-base rounded-2xl shadow-xl flex items-center justify-center space-x-2 border border-purple-400">
                <span>⚡</span>
                <span>KIRIM NILAI FREESTYLE KE SERVER PSS (TRANSMIT)</span>
              </button>

            </div>
          `}

        </div>

      </div>
      <div class="text-center text-[11px] text-neutral-500 mt-3 font-mono">
        World Taekwondo Electronic Scoring System • Daedo & KPNP Standard Wireless JSD Protocol
      </div>
    </main>
  `;
}

// Visual Feedback Helpers for Judge Pad Buttons
function triggerJudgeFeedback(btnEl) {
  if (!btnEl) return;
  btnEl.classList.add('ring-4', 'ring-white', 'scale-95');
  setTimeout(() => {
    btnEl.classList.remove('ring-4', 'ring-white', 'scale-95');
  }, 200);
}

function triggerTransmitFeedback(btnEl) {
  if (!btnEl) return;
  const original = btnEl.innerHTML;
  btnEl.innerHTML = `<span>✓ TERKIRIM KE MEJA OPERATOR!</span>`;
  btnEl.classList.add('bg-emerald-500');
  setTimeout(() => {
    btnEl.innerHTML = original;
    btnEl.classList.remove('bg-emerald-500');
  }, 1800);
}

      </div>
      <div class="text-center text-xs text-slate-500 mt-4">
        Taekwondo Corner Judge Handheld Tablet System • Real-Time Synchronized
      </div>
    </main>
  `;
}

// ==========================================
// 4. RENDER JADWAL PARTAI (MATCH QUEUE)
// ==========================================
function renderMatchSchedule(appState) {
  const { matches, matchNumber } = appState.data;

  return `
    <main class="w-full min-h-[calc(100vh-50px)] bg-slate-950 text-slate-200 p-4 sm:p-6 overflow-y-auto">
      <div class="max-w-6xl mx-auto">
        
        <div class="flex flex-wrap items-center justify-between border-b border-slate-800 pb-4 mb-4">
          <div>
            <h2 class="text-2xl font-black text-white font-display">Bagan & Jadwal Pertandingan Ring</h2>
            <p class="text-xs text-slate-400">Pilih partai pertandingan untuk langsung dimuat ke Layar TV dan Meja Operator.</p>
          </div>
          <div class="text-right">
            <span class="text-xs text-slate-400">Partai Aktif Saat Ini:</span>
            <div class="text-lg font-bold text-amber-400 font-display">${matchNumber}</div>
          </div>
        </div>

        <!-- Tombol Aksi Jadwal: Ekspor Data & Tambah Partai -->
        <div class="flex flex-wrap items-center justify-between gap-2 mb-4">
          <div class="flex items-center space-x-2">
            <button onclick="app.exportMatchesJSON()" class="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-slate-200 rounded-lg text-xs font-semibold border border-slate-700 flex items-center space-x-1.5 shadow">
              <span>💾</span> <span>Ekspor JSON (Bagan)</span>
            </button>
            <button onclick="app.exportMatchesCSV()" class="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-slate-200 rounded-lg text-xs font-semibold border border-slate-700 flex items-center space-x-1.5 shadow">
              <span>📊</span> <span>Ekspor Excel / CSV</span>
            </button>
          </div>
          <button onclick="addNewMatchPrompt()" class="px-3.5 py-1.5 bg-amber-600 hover:bg-amber-500 text-black rounded-lg text-xs font-bold flex items-center space-x-1.5 shadow">
            <span>➕</span> <span>Tambah Partai Baru</span>
          </button>
        </div>

        <div class="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
          <table class="w-full text-left text-xs sm:text-sm">
            <thead class="bg-slate-950 text-slate-400 uppercase text-[11px] tracking-wider border-b border-slate-800">
              <tr>
                <th class="p-3 sm:p-4">No. Partai</th>
                <th class="p-3 sm:p-4">Kategori</th>
                <th class="p-3 sm:p-4">Divisi / Kelas</th>
                <th class="p-3 sm:p-4">Sudut Biru (Chung)</th>
                <th class="p-3 sm:p-4">Sudut Merah (Hong)</th>
                <th class="p-3 sm:p-4">Status</th>
                <th class="p-3 sm:p-4 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-800 text-slate-300">
              ${matches.map(m => {
                const isCurrent = m.number === matchNumber;
                return `
                  <tr class="${isCurrent ? 'bg-amber-500/10' : 'hover:bg-slate-800/40'} transition-all">
                    <td class="p-3 sm:p-4 font-bold text-white font-mono">${m.number}</td>
                    <td class="p-3 sm:p-4">
                      <span class="px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        m.category === 'kyorugi' ? 'bg-blue-900/60 text-blue-300 border border-blue-700/50' :
                        m.category === 'poomsae_rec' ? 'bg-amber-900/60 text-amber-300 border border-amber-700/50' :
                        'bg-purple-900/60 text-purple-300 border border-purple-700/50'
                      }">
                        ${m.category.replace('_', ' ')}
                      </span>
                    </td>
                    <td class="p-3 sm:p-4 font-semibold text-slate-200">${m.division}</td>
                    <td class="p-3 sm:p-4 text-blue-400 font-bold">${m.chung}</td>
                    <td class="p-3 sm:p-4 text-red-400 font-bold">${m.hong}</td>
                    <td class="p-3 sm:p-4">
                      <span class="px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        m.status === 'BERLANGSUNG' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 animate-pulse' :
                        m.status === 'SELESAI' ? 'bg-slate-800 text-slate-400' :
                        'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                      }">
                        ${m.status}
                      </span>
                    </td>
                    <td class="p-3 sm:p-4 text-center">
                      <button onclick="app.selectMatch('${m.id}')" class="px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${isCurrent ? 'bg-slate-800 text-slate-400 cursor-default' : 'bg-amber-600 hover:bg-amber-500 text-white shadow'}">
                        ${isCurrent ? 'Aktif' : 'Muat Partai ↗'}
                      </button>
                    </td>
                  </tr>
                `;
              }).join('')}
            </tbody>
          </table>
        </div>

      </div>
    </main>
  `;
}

// ==========================================
// 5. RENDER OBS / BROADCAST LIVE STREAM OVERLAY
// ==========================================
function renderOBSOverlay(appState) {
  const { category, court, division, kyorugi, poomsaeRec } = appState.data;

  return `
    <main class="w-full min-h-[calc(100vh-50px)] bg-transparent p-4 flex flex-col justify-between select-none">
      
      <!-- Top Broadcast Overlay Bar -->
      <div class="max-w-5xl mx-auto w-full drop-shadow-[0_10px_20px_rgba(0,0,0,0.8)]">
        
        <!-- Header Kecil Ring & Kelas -->
        <div class="bg-black/85 backdrop-blur-md text-slate-300 px-4 py-1 rounded-t-xl text-xs font-bold flex items-center justify-between border-t border-x border-slate-700/60">
          <div class="flex items-center space-x-2">
            <span class="w-2 h-2 rounded-full bg-red-600 animate-ping"></span>
            <span class="text-amber-400 font-display">${court}</span>
            <span>•</span>
            <span class="truncate">${division}</span>
          </div>
          <span class="text-slate-400 font-mono text-[11px]">TAEKWONDO LIVE</span>
        </div>

        ${category === 'kyorugi' ? `
          <!-- Kyorugi Broadcast Scoreboard Bar -->
          <div class="grid grid-cols-12 bg-slate-950/95 backdrop-blur-lg border-2 border-slate-700 rounded-b-xl overflow-hidden shadow-2xl">
            
            <!-- CHUNG (BIRU) -->
            <div class="col-span-5 bg-gradient-to-r from-blue-900 to-blue-700 p-2.5 px-4 flex items-center justify-between text-white border-r-2 border-slate-900">
              <div class="truncate mr-2">
                <div class="text-[10px] text-blue-200 font-bold tracking-wider">CHUNG (청)</div>
                <div class="font-bold text-base sm:text-lg font-display truncate">${kyorugi.chung.name}</div>
                <div class="text-[11px] text-blue-200">${kyorugi.chung.team} • Gamjeom: ${kyorugi.chung.gamjeom}</div>
              </div>
              <div class="flex items-center space-x-3">
                <div class="flex flex-col space-y-1">
                  ${[1, 2].map(r => `
                    <div class="w-2.5 h-2.5 rounded-full border border-amber-400 ${kyorugi.chung.roundsWon >= r ? 'bg-amber-400 shadow-[0_0_6px_#fbbf24]' : 'bg-transparent'}"></div>
                  `).join('')}
                </div>
                <div class="font-digital text-4xl sm:text-5xl font-black text-white glow-blue">
                  ${kyorugi.chung.score}
                </div>
              </div>
            </div>

            <!-- CENTER TIMER & ROUND -->
            <div class="col-span-2 bg-slate-900 p-2 flex flex-col items-center justify-center text-center">
              <div class="text-[10px] text-slate-400 font-bold uppercase">R${kyorugi.round} [BEST OF 3]</div>
              <div class="font-digital text-2xl sm:text-3xl font-black ${kyorugi.timerRunning ? 'text-emerald-400' : 'text-amber-400'} dynamic-timer-text">
                ${appState.formatTime(kyorugi.timerSeconds)}
              </div>
            </div>

            <!-- HONG (MERAH) -->
            <div class="col-span-5 bg-gradient-to-l from-red-900 to-red-700 p-2.5 px-4 flex items-center justify-between text-white border-l-2 border-slate-900 flex-row-reverse text-right">
              <div class="truncate ml-2">
                <div class="text-[10px] text-red-200 font-bold tracking-wider">HONG (홍)</div>
                <div class="font-bold text-base sm:text-lg font-display truncate">${kyorugi.hong.name}</div>
                <div class="text-[11px] text-red-200">${kyorugi.hong.team} • Gamjeom: ${kyorugi.hong.gamjeom}</div>
              </div>
              <div class="flex items-center space-x-3 flex-row-reverse">
                <div class="flex flex-col space-y-1">
                  ${[1, 2].map(r => `
                    <div class="w-2.5 h-2.5 rounded-full border border-amber-400 ${kyorugi.hong.roundsWon >= r ? 'bg-amber-400 shadow-[0_0_6px_#fbbf24]' : 'bg-transparent'}"></div>
                  `).join('')}
                </div>
                <div class="font-digital text-4xl sm:text-5xl font-black text-white glow-red">
                  ${kyorugi.hong.score}
                </div>
              </div>
            </div>

          </div>
        ` : `
          <!-- Poomsae Broadcast Scoreboard Bar -->
          <div class="bg-slate-950/95 backdrop-blur-lg border-2 border-amber-500/60 rounded-b-xl p-3 px-6 flex items-center justify-between text-white shadow-2xl">
            <div>
              <span class="text-xs text-amber-400 font-bold uppercase">${poomsaeRec.roundType} • ${poomsaeRec.poomsaeName}</span>
              <h3 class="text-xl font-black text-white font-display">${poomsaeRec.athleteName}</h3>
              <p class="text-xs text-slate-400">${poomsaeRec.team}</p>
            </div>
            <div class="flex items-center space-x-6 text-center">
              <div>
                <span class="text-[10px] text-blue-400 uppercase">Akurasi</span>
                <div class="font-digital text-xl font-bold">${poomsaeRec.result.accuracyFinal}</div>
              </div>
              <div>
                <span class="text-[10px] text-emerald-400 uppercase">Presentasi</span>
                <div class="font-digital text-xl font-bold">${poomsaeRec.result.presentationFinal}</div>
              </div>
              <div class="bg-amber-500/20 border border-amber-500 px-4 py-1 rounded-xl">
                <span class="text-[10px] text-amber-400 font-bold uppercase">TOTAL</span>
                <div class="font-digital text-3xl font-black text-amber-400 glow-gold">${poomsaeRec.result.totalScore}</div>
              </div>
            </div>
          </div>
        `}

      </div>

      <!-- Petunjuk OBS untuk Streamer -->
      <div class="max-w-md mx-auto bg-black/70 backdrop-blur-md border border-slate-700/80 p-2.5 rounded-xl text-center text-xs text-slate-400 shadow-xl">
        💡 <b>Tips OBS Studio:</b> Tambahkan <i>Browser Source</i> dengan URL: <code class="text-amber-300">index.html?mode=obs</code>, lalu centang <i>Shutdown source when not visible</i>.
      </div>

    </main>
  `;
}

// Fullscreen & Window Helpers
function toggleFullscreen() {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen().catch(err => alert(err.message));
  } else {
    document.exitFullscreen();
  }
}

function openDisplayWindow() {
  window.open(window.location.pathname + '?mode=tv', '_blank', 'width=1280,height=720');
}

// ==========================================
// 6. MODAL PENGATURAN TURNAMEN STANDAR WT
// ==========================================
function renderSettingsModal(appState) {
  const s = appState.data.settings;
  return `
    <div class="fixed inset-0 bg-black/85 backdrop-blur-md z-50 flex items-center justify-center p-4 select-none">
      <div class="bg-slate-900 border-2 border-slate-700 rounded-3xl max-w-lg w-full p-6 shadow-2xl text-slate-200">
        
        <div class="flex items-center justify-between border-b border-slate-800 pb-3 mb-5">
          <div class="flex items-center space-x-2">
            <span class="text-2xl">⚙️</span>
            <div>
              <h3 class="text-xl font-black text-white font-display">Pengaturan Turnamen Standar WT</h3>
              <p class="text-[11px] text-slate-400">World Taekwondo Official Electronic Scoring Configuration</p>
            </div>
          </div>
          <button onclick="app.toggleSettingsModal()" class="text-slate-400 hover:text-white text-xl font-bold p-1">
            ✕
          </button>
        </div>

        <div class="space-y-4 text-xs sm:text-sm">
          <!-- Nama Event / Kejuaraan -->
          <div>
            <label class="block text-xs font-bold text-slate-400 uppercase mb-1">Nama Kejuaraan / Turnamen:</label>
            <input id="set-title" type="text" value="${s.tournamentTitle}" class="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white font-semibold">
          </div>

          <!-- Nama Ring / Court -->
          <div>
            <label class="block text-xs font-bold text-slate-400 uppercase mb-1">Nama Ring / Court:</label>
            <input id="set-court" type="text" value="${s.courtName}" class="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white font-semibold">
          </div>

          <!-- Preset Durasi Ronde WT -->
          <div>
            <label class="block text-xs font-bold text-slate-400 uppercase mb-1">Durasi Ronde Kyorugi (Standar WT):</label>
            <select id="set-duration" class="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white font-semibold">
              <option value="120" ${s.roundDuration === 120 ? 'selected' : ''}>120 Detik (Senior - 2 Menit)</option>
              <option value="90" ${s.roundDuration === 90 ? 'selected' : ''}>90 Detik (Junior - 1.5 Menit)</option>
              <option value="60" ${s.roundDuration === 60 ? 'selected' : ''}>60 Detik (Cadet / Pra-Cadet - 1 Menit)</option>
            </select>
          </div>

          <!-- Aturan Point Gap & Audio -->
          <div class="grid grid-cols-2 gap-3 pt-2 border-t border-slate-800">
            <label class="flex items-center space-x-2 cursor-pointer bg-slate-950 p-2.5 rounded-lg border border-slate-800">
              <input id="set-gap" type="checkbox" ${s.pointGapEnabled ? 'checked' : ''} class="w-4 h-4 accent-amber-500 rounded">
              <span class="text-xs font-semibold">Point Gap WT (12 Poin)</span>
            </label>

            <label class="flex items-center space-x-2 cursor-pointer bg-slate-950 p-2.5 rounded-lg border border-slate-800">
              <input id="set-mute" type="checkbox" ${s.soundMuted ? 'checked' : ''} class="w-4 h-4 accent-red-500 rounded">
              <span class="text-xs font-semibold">Mode Hening (Mute Audio)</span>
            </label>
          </div>

          <!-- Generator Suara WT -->
          <div class="pt-2 border-t border-slate-800">
            <span class="text-[11px] font-bold text-slate-400 uppercase block mb-2">Uji Generator Suara Turnamen:</span>
            <div class="grid grid-cols-4 gap-1.5 text-center text-xs">
              <button onclick="window.soundSys.playBuzzer()" class="bg-amber-600/30 hover:bg-amber-600/50 text-amber-300 py-1.5 rounded border border-amber-600/50">
                🔊 Buzzer
              </button>
              <button onclick="window.soundSys.playKalyeo()" class="bg-blue-600/30 hover:bg-blue-600/50 text-blue-300 py-1.5 rounded border border-blue-600/50">
                🔔 Kal-yeo
              </button>
              <button onclick="window.soundSys.playGamJeom()" class="bg-red-600/30 hover:bg-red-600/50 text-red-300 py-1.5 rounded border border-red-600/50">
                ⚠️ Gamjeom
              </button>
              <button onclick="window.soundSys.playPoint()" class="bg-emerald-600/30 hover:bg-emerald-600/50 text-emerald-300 py-1.5 rounded border border-emerald-600/50">
                🥊 Point
              </button>
            </div>
          </div>
        </div>

        <!-- Tombol Aksi Simpan -->
        <div class="mt-6 flex items-center justify-end space-x-3 border-t border-slate-800 pt-4">
          <button onclick="app.toggleSettingsModal()" class="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl font-bold">
            Batal
          </button>
          <button onclick="saveSettingsFromModal()" class="px-6 py-2 bg-amber-500 hover:bg-amber-400 text-black rounded-xl font-black shadow-lg">
            Simpan Setelan ✓
          </button>
        </div>

      </div>
    </div>
  `;
}

function saveSettingsFromModal() {
  const title = document.getElementById('set-title').value;
  const court = document.getElementById('set-court').value;
  const duration = document.getElementById('set-duration').value;
  const pointGap = document.getElementById('set-gap').checked;
  const muted = document.getElementById('set-mute').checked;
  app.saveSettings(title, court, duration, pointGap, muted);
}

function addNewMatchPrompt() {
  const number = prompt('Masukkan Nomor Partai (contoh: PARTAI #07):', `PARTAI #0${app.data.matches.length + 1}`);
  if (!number) return;
  const division = prompt('Masukkan Divisi/Kelas (contoh: Senior Putra -63 kg):', 'Senior Putra -63 kg');
  const chung = prompt('Nama Atlet Sudut Biru (Chung):', 'Atlet Biru (Kontingen A)');
  const hong = prompt('Nama Atlet Sudut Merah (Hong):', 'Atlet Merah (Kontingen B)');
  
  app.data.matches.push({
    id: `M-0${app.data.matches.length + 1}`,
    number,
    category: 'kyorugi',
    division: division || 'Kyorugi',
    chung: chung || 'Chung',
    hong: hong || 'Hong',
    status: 'MENUNGGU'
  });
  app.notifyChange();
}

