/**
 * Main Application Logic for Taekwondo Scoring Board
 * Mengatur state Kyorugi, Poomsae Recognised, dan Poomsae Freestyle
 * serta switching antara Mode TV Display dan Mode Operator Meja.
 */

const DEFAULT_STATE = {
  viewMode: 'tv', // 'tv' (Layar TV) | 'operator' (Panel Meja) | 'judge' (Pad Juri) | 'matches' (Jadwal Partai) | 'obs' (OBS Overlay)
  category: 'kyorugi', // 'kyorugi' | 'poomsae_rec' | 'poomsae_free'
  court: 'COURT 1',
  division: 'SENIOR PUTRA UNDER 68 KG',
  matchNumber: 'PARTAI #04',
  selectedJudgeId: 'J1', // Untuk Mode Pad Juri (J1 s/d J5)
  judgePadMode: 'pss', // 'pss' (Daedo/KPNP PSS Sensor) | 'dss' (Digital Scoring System Manual)
  settingsModalOpen: false,

  // Konfigurasi Turnamen
  settings: {
    tournamentTitle: 'KEJUARAAN NASIONAL TAEKWONDO CHAMPIONSHIP 2026',
    courtName: 'COURT 1',
    roundDuration: 120,
    restDuration: 60,
    pointGapEnabled: true,
    pointGapThreshold: 12,
    judgeCount: 5,
    soundMuted: false
  },

  // State Video Replay (IVR) Challenge
  ivr: {
    active: false,
    requestedBy: null, // 'chung' | 'hong'
    cardItem: 'Tendangan Kepala (Head Kick)',
    decision: null // 'ACCEPTED' | 'REJECTED'
  },

  // State Medical Timeout (1:00)
  medical: {
    active: false,
    fighter: null, // 'chung' | 'hong'
    seconds: 60,
    interval: null
  },

  // Daftar Jadwal Partai (Match Queue)
  matches: [
    { id: 'M-01', number: 'PARTAI #01', category: 'kyorugi', division: 'Senior Putra -58 kg', chung: 'Dimas Pratama (Jabar)', hong: 'Rian Hidayat (Jatim)', status: 'SELESAI' },
    { id: 'M-02', number: 'PARTAI #02', category: 'kyorugi', division: 'Senior Putri -49 kg', chung: 'Nabila Putri (DKI)', hong: 'Dewi Lestari (Bali)', status: 'SELESAI' },
    { id: 'M-03', number: 'PARTAI #03', category: 'poomsae_rec', division: 'Individual Putra Senior', chung: 'Farhan Maulana (DIY)', hong: '-', status: 'SELESAI' },
    { id: 'M-04', number: 'PARTAI #04', category: 'kyorugi', division: 'Senior Putra -68 kg', chung: 'Ahmad Rizky (Jabar)', hong: 'Budi Santoso (DKI)', status: 'BERLANGSUNG' },
    { id: 'M-05', number: 'PARTAI #05', category: 'poomsae_free', division: 'Team Freestyle Campuran', chung: 'Tim Garuda Nusantara (INA)', hong: '-', status: 'MENUNGGU' },
    { id: 'M-06', number: 'PARTAI #06', category: 'kyorugi', division: 'Final Putra -80 kg', chung: 'Kevin Julio (Sumut)', hong: 'Teguh Wibowo (Jateng)', status: 'MENUNGGU' }
  ],

  // State Kyorugi
  kyorugi: {
    round: 1,
    maxRounds: 3,
    timerSeconds: 120,
    timerInitial: 120,
    timerRunning: false,
    timerInterval: null,
    pointGapAlert: false,
    winner: null, // null | 'chung' | 'hong'
    winReason: '',
    roundHistory: [],
    chung: {
      name: 'AHMAD RIZKY',
      team: 'JAWA BARAT',
      score: 0,
      gamjeom: 0,
      roundsWon: 0,
      hits: 0,
      replayCardRemaining: 1 // Kuota kartu banding video replay
    },
    hong: {
      name: 'BUDI SANTOSO',
      team: 'DKI JAKARTA',
      score: 0,
      gamjeom: 0,
      roundsWon: 0,
      hits: 0,
      replayCardRemaining: 1
    }
  },

  // State Poomsae Recognised
  poomsaeRec: {
    athleteName: 'SITI RAHMAWATI',
    team: 'JAWA TENGAH',
    poomsaeName: 'KORYO (고려)',
    roundType: '1st Poomsae',
    judges: [
      { id: 'J1', accuracy: 3.7, presentation: 4.5 },
      { id: 'J2', accuracy: 3.8, presentation: 4.6 },
      { id: 'J3', accuracy: 3.6, presentation: 4.3 },
      { id: 'J4', accuracy: 3.9, presentation: 4.7 },
      { id: 'J5', accuracy: 3.5, presentation: 4.4 }
    ],
    deductions: 0.0,
    calculated: true,
    result: {
      accuracyFinal: 3.70,
      presentationFinal: 4.50,
      totalScore: 8.20,
      droppedAccMin: 'J5',
      droppedAccMax: 'J4',
      droppedPresMin: 'J3',
      droppedPresMax: 'J4'
    }
  },

  // State Poomsae Freestyle
  poomsaeFree: {
    athleteName: 'TIM GARUDA NUSANTARA',
    team: 'INDONESIA',
    musicTitle: 'Taekwondo Beats & Orchestral Epic',
    musicDuration: 95,
    timerRunning: false,
    timerInterval: null,
    statusNote: 'Optimal (90s - 100s)',
    judges: [
      {
        id: 'J1',
        tech: { jumpKick: 0.9, multipleKick: 0.8, spinKick: 0.9, basicMoves: 0.8, acrobatic: 0.9, basicStance: 0.8 },
        pres: { creativity: 0.9, harmony: 0.8, energy: 0.9, rhythm: 0.8 }
      },
      {
        id: 'J2',
        tech: { jumpKick: 0.8, multipleKick: 0.7, spinKick: 0.8, basicMoves: 0.8, acrobatic: 0.8, basicStance: 0.7 },
        pres: { creativity: 0.8, harmony: 0.8, energy: 0.8, rhythm: 0.8 }
      },
      {
        id: 'J3',
        tech: { jumpKick: 0.9, multipleKick: 0.9, spinKick: 0.9, basicMoves: 0.9, acrobatic: 0.9, basicStance: 0.8 },
        pres: { creativity: 0.9, harmony: 0.9, energy: 0.9, rhythm: 0.9 }
      },
      {
        id: 'J4',
        tech: { jumpKick: 0.7, multipleKick: 0.7, spinKick: 0.8, basicMoves: 0.7, acrobatic: 0.8, basicStance: 0.7 },
        pres: { creativity: 0.7, harmony: 0.7, energy: 0.8, rhythm: 0.7 }
      },
      {
        id: 'J5',
        tech: { jumpKick: 0.8, multipleKick: 0.8, spinKick: 0.8, basicMoves: 0.8, acrobatic: 0.8, basicStance: 0.8 },
        pres: { creativity: 0.8, harmony: 0.8, energy: 0.8, rhythm: 0.8 }
      }
    ],
    penalty: 0.0,
    result: {
      technicalFinal: 5.10,
      presentationFinal: 3.30,
      totalScore: 8.40
    }
  }
};

class AppState {
  constructor() {
    const saved = localStorage.getItem('tkd_saved_state');
    if (saved) {
      try {
        this.data = JSON.parse(saved);
        this.data.kyorugi.timerRunning = false;
        this.data.kyorugi.timerInterval = null;
        this.data.medical.active = false;
        this.data.medical.interval = null;
        if (this.data.poomsaeFree) {
          this.data.poomsaeFree.timerRunning = false;
          this.data.poomsaeFree.timerInterval = null;
        }
      } catch (e) {
        this.data = JSON.parse(JSON.stringify(DEFAULT_STATE));
      }
    } else {
      this.data = JSON.parse(JSON.stringify(DEFAULT_STATE));
    }
    this.sync = new BoardSync((incoming) => this.handleSync(incoming));
  }

  handleSync(incoming) {
    if (incoming.type === 'STATE_UPDATE') {
      // Perbarui data lokal jika dari tab lain
      this.data = { ...this.data, ...incoming.payload };
      this.render();
    } else if (incoming.type === 'PLAY_BUZZER') {
      window.soundSys.playBuzzer();
    }
  }

  notifyChange() {
    this.render();
    this.sync.broadcast('STATE_UPDATE', this.data);
    try {
      localStorage.setItem('tkd_saved_state', JSON.stringify(this.data));
    } catch (e) { }
  }

  setCategory(cat) {
    this.data.category = cat;
    this.notifyChange();
  }

  setViewMode(mode) {
    this.data.viewMode = mode;
    this.notifyChange();
  }

  // --- KYORUGI LOGIC ---
  startKyorugiTimer() {
    if (this.data.kyorugi.timerRunning) return;
    window.soundSys.playBeep(880, 0.15); // Kye-sok tone
    this.data.kyorugi.timerRunning = true;
    this.data.kyorugi.timerInterval = setInterval(() => {
      if (this.data.kyorugi.timerSeconds > 0) {
        this.data.kyorugi.timerSeconds--;
        this.renderTimerOnly();
        this.sync.broadcast('STATE_UPDATE', this.data);
      } else {
        this.pauseKyorugiTimer();
        window.soundSys.playBuzzer();
        this.sync.broadcast('PLAY_BUZZER', {});
        this.evaluateRoundWinner();
      }
    }, 1000);
    this.notifyChange();
  }

  pauseKyorugiTimer() {
    if (!this.data.kyorugi.timerRunning) return;
    clearInterval(this.data.kyorugi.timerInterval);
    this.data.kyorugi.timerRunning = false;
    window.soundSys.playKalyeo();
    this.notifyChange();
  }

  toggleKyorugiTimer() {
    if (this.data.kyorugi.timerRunning) {
      this.pauseKyorugiTimer();
    } else {
      this.startKyorugiTimer();
    }
  }

  resetKyorugiTimer(seconds = 120) {
    this.pauseKyorugiTimer();
    this.data.kyorugi.timerSeconds = seconds;
    this.data.kyorugi.timerInitial = seconds;
    this.notifyChange();
  }

  addKyorugiPoint(side, points) {
    const fighter = this.data.kyorugi[side];
    fighter.score = Math.max(0, fighter.score + points);
    fighter.hits += (points > 0 ? 1 : 0);
    window.soundSys.playPoint();
    this.checkPointGap();
    this.notifyChange();
  }

  addGamJeom(side) {
    const fighter = this.data.kyorugi[side];
    const opponentSide = side === 'chung' ? 'hong' : 'chung';
    const opponent = this.data.kyorugi[opponentSide];

    if (fighter.gamjeom < 5) {
      fighter.gamjeom++;
      opponent.score++; // Gamjeom lawan memberikan 1 poin untuk kita
      window.soundSys.playGamJeom();

      // Cek limit 5 gam-jeom dalam 1 ronde
      if (fighter.gamjeom >= 5) {
        this.pauseKyorugiTimer();
        window.soundSys.playBuzzer();
        this.declareRoundWinner(opponentSide, `Kemenangan Ronde karena 5 Gam-jeom (${side.toUpperCase()})`);
      } else {
        this.checkPointGap();
      }
    }
    this.notifyChange();
  }

  subtractGamJeom(side) {
    const fighter = this.data.kyorugi[side];
    const opponentSide = side === 'chung' ? 'hong' : 'chung';
    const opponent = this.data.kyorugi[opponentSide];

    if (fighter.gamjeom > 0) {
      fighter.gamjeom--;
      opponent.score = Math.max(0, opponent.score - 1);
    }
    this.notifyChange();
  }

  checkPointGap() {
    const diff = Math.abs(this.data.kyorugi.chung.score - this.data.kyorugi.hong.score);
    if (diff >= 12) {
      this.data.kyorugi.pointGapAlert = true;
    } else {
      this.data.kyorugi.pointGapAlert = false;
    }
  }

  evaluateRoundWinner() {
    const cScore = this.data.kyorugi.chung.score;
    const hScore = this.data.kyorugi.hong.score;

    if (cScore > hScore) {
      this.declareRoundWinner('chung', 'Pemenang Ronde berdasarkan Skor Poin');
    } else if (hScore > cScore) {
      this.declareRoundWinner('hong', 'Pemenang Ronde berdasarkan Skor Poin');
    } else {
      // Tie-break (Superiority / Hits)
      if (this.data.kyorugi.chung.hits > this.data.kyorugi.hong.hits) {
        this.declareRoundWinner('chung', 'Pemenang Ronde melalui Tie-Break (Jumlah Pukulan/Hits)');
      } else {
        this.declareRoundWinner('hong', 'Pemenang Ronde melalui Tie-Break (Jumlah Pukulan/Hits)');
      }
    }
  }

  declareRoundWinner(winnerSide, reason) {
    this.data.kyorugi[winnerSide].roundsWon++;
    this.data.kyorugi.roundHistory.push({
      round: this.data.kyorugi.round,
      winner: winnerSide,
      chungScore: this.data.kyorugi.chung.score,
      hongScore: this.data.kyorugi.hong.score,
      reason
    });

    // Cek Best of 3 (2 ronde menang = juara partai)
    if (this.data.kyorugi[winnerSide].roundsWon >= 2) {
      this.data.kyorugi.winner = winnerSide;
      this.data.kyorugi.winReason = `Menang Best of 3 Rounds (${reason})`;
    }

    this.notifyChange();
  }

  nextRound() {
    if (this.data.kyorugi.round < this.data.kyorugi.maxRounds) {
      this.pauseKyorugiTimer();
      this.data.kyorugi.round++;
      this.data.kyorugi.timerSeconds = this.data.kyorugi.timerInitial;
      // Aturan WT: Skor poin dan gam-jeom di-reset di setiap ronde baru
      this.data.kyorugi.chung.score = 0;
      this.data.kyorugi.chung.gamjeom = 0;
      this.data.kyorugi.hong.score = 0;
      this.data.kyorugi.hong.gamjeom = 0;
      this.data.kyorugi.pointGapAlert = false;
      this.notifyChange();
    }
  }

  startGoldenPointRound() {
    this.pauseKyorugiTimer();
    this.data.kyorugi.round = 4;
    this.data.kyorugi.roundName = 'GOLDEN ROUND (골든라운드)';
    this.data.kyorugi.timerSeconds = 60;
    this.data.kyorugi.timerInitial = 60;
    this.data.kyorugi.chung.score = 0;
    this.data.kyorugi.chung.gamjeom = 0;
    this.data.kyorugi.hong.score = 0;
    this.data.kyorugi.hong.gamjeom = 0;
    this.data.kyorugi.pointGapAlert = false;
    window.soundSys.playBeep(880, 0.3);
    this.notifyChange();
  }

  resetKyorugiMatch() {
    this.pauseKyorugiTimer();
    this.data.kyorugi = JSON.parse(JSON.stringify(DEFAULT_STATE.kyorugi));
    this.notifyChange();
  }

  // --- POOMSAE FREESTYLE MUSIC TIMER ---
  toggleFreestyleMusicTimer() {
    if (this.data.poomsaeFree.timerRunning) {
      clearInterval(this.data.poomsaeFree.timerInterval);
      this.data.poomsaeFree.timerRunning = false;
      window.soundSys.stopFreestyleBeat();
    } else {
      this.data.poomsaeFree.timerRunning = true;
      window.soundSys.startFreestyleBeat();
      this.data.poomsaeFree.timerInterval = setInterval(() => {
        if (this.data.poomsaeFree.musicDuration > 0) {
          this.data.poomsaeFree.musicDuration--;
          if (this.data.poomsaeFree.musicDuration >= 90 && this.data.poomsaeFree.musicDuration <= 100) {
            this.data.poomsaeFree.statusNote = 'Optimal (90s - 100s)';
          } else if (this.data.poomsaeFree.musicDuration < 90) {
            this.data.poomsaeFree.statusNote = 'Di Bawah 90s (-0.3/10s)';
          }
          this.notifyChange();
        } else {
          this.toggleFreestyleMusicTimer();
          window.soundSys.playBuzzer();
        }
      }, 1000);
    }
    this.notifyChange();
  }

  resetFreestyleMusicTimer(seconds = 95) {
    if (this.data.poomsaeFree.timerRunning) {
      this.toggleFreestyleMusicTimer();
    }
    this.data.poomsaeFree.musicDuration = seconds;
    this.data.poomsaeFree.statusNote = 'Optimal (90s - 100s)';
    this.notifyChange();
  }

  // --- POOMSAE RECOGNISED LOGIC ---
  calculatePoomsaeRecognised() {
    const judges = this.data.poomsaeRec.judges;
    // Ambil akurasi & presentasi
    const accScores = judges.map(j => ({ id: j.id, val: parseFloat(j.accuracy) }));
    const presScores = judges.map(j => ({ id: j.id, val: parseFloat(j.presentation) }));

    // Urutkan untuk mencari min & max
    const sortedAcc = [...accScores].sort((a, b) => a.val - b.val);
    const sortedPres = [...presScores].sort((a, b) => a.val - b.val);

    const minAcc = sortedAcc[0];
    const maxAcc = sortedAcc[sortedAcc.length - 1];
    const minPres = sortedPres[0];
    const maxPres = sortedPres[sortedPres.length - 1];

    // Truncated Mean: buang min dan max
    const filteredAcc = sortedAcc.slice(1, -1).map(x => x.val);
    const filteredPres = sortedPres.slice(1, -1).map(x => x.val);

    const avgAcc = filteredAcc.reduce((a, b) => a + b, 0) / filteredAcc.length;
    const avgPres = filteredPres.reduce((a, b) => a + b, 0) / filteredPres.length;
    const deductions = parseFloat(this.data.poomsaeRec.deductions) || 0.0;
    const total = avgAcc + avgPres - deductions;

    this.data.poomsaeRec.result = {
      accuracyFinal: avgAcc.toFixed(2),
      presentationFinal: avgPres.toFixed(2),
      totalScore: total.toFixed(2),
      droppedAccMin: minAcc.id,
      droppedAccMax: maxAcc.id,
      droppedPresMin: minPres.id,
      droppedPresMax: maxPres.id
    };
    this.data.poomsaeRec.calculated = true;
    window.soundSys.playBuzzer();
    this.notifyChange();
  }

  // --- POOMSAE FREESTYLE LOGIC ---
  calculatePoomsaeFreestyle() {
    const judges = this.data.poomsaeFree.judges;
    const techTotals = judges.map(j => {
      const sum = Object.values(j.tech).reduce((acc, v) => acc + parseFloat(v), 0);
      return { id: j.id, val: sum };
    });
    const presTotals = judges.map(j => {
      const sum = Object.values(j.pres).reduce((acc, v) => acc + parseFloat(v), 0);
      return { id: j.id, val: sum };
    });

    const sortedTech = [...techTotals].sort((a, b) => a.val - b.val);
    const sortedPres = [...presTotals].sort((a, b) => a.val - b.val);

    const filteredTech = sortedTech.slice(1, -1).map(x => x.val);
    const filteredPres = sortedPres.slice(1, -1).map(x => x.val);

    const avgTech = filteredTech.reduce((a, b) => a + b, 0) / filteredTech.length;
    const avgPres = filteredPres.reduce((a, b) => a + b, 0) / filteredPres.length;
    const penalty = parseFloat(this.data.poomsaeFree.penalty) || 0.0;
    const total = avgTech + avgPres - penalty;

    this.data.poomsaeFree.result = {
      technicalFinal: avgTech.toFixed(2),
      presentationFinal: avgPres.toFixed(2),
      totalScore: total.toFixed(2)
    };
    window.soundSys.playBuzzer();
    this.notifyChange();
  }

  // --- VIDEO REPLAY (IVR) LOGIC ---
  triggerIVR(side, item = 'Tendangan Kepala (Head Kick)') {
    const fighter = this.data.kyorugi[side];
    if (fighter.replayCardRemaining <= 0) {
      alert(`Kuota kartu banding Video Replay untuk ${side.toUpperCase()} sudah habis!`);
      return;
    }
    this.pauseKyorugiTimer();
    this.data.ivr.active = true;
    this.data.ivr.requestedBy = side;
    this.data.ivr.cardItem = item;
    this.data.ivr.decision = null;
    window.soundSys.playBeep(440, 0.4, 'square');
    this.notifyChange();
  }

  resolveIVR(decision) {
    // decision: 'ACCEPTED' | 'REJECTED'
    this.data.ivr.decision = decision;
    const side = this.data.ivr.requestedBy;
    if (decision === 'REJECTED') {
      // Kartu kuota hangus
      if (this.data.kyorugi[side]) {
        this.data.kyorugi[side].replayCardRemaining = Math.max(0, this.data.kyorugi[side].replayCardRemaining - 1);
      }
    }
    window.soundSys.playBeep(decision === 'ACCEPTED' ? 880 : 330, 0.3);
    setTimeout(() => {
      this.data.ivr.active = false;
      this.notifyChange();
    }, 2500);
    this.notifyChange();
  }

  // --- MEDICAL TIMEOUT (1:00) LOGIC ---
  startMedicalTimeout(fighter) {
    this.pauseKyorugiTimer();
    this.data.medical.active = true;
    this.data.medical.fighter = fighter;
    this.data.medical.seconds = 60;

    if (this.data.medical.interval) clearInterval(this.data.medical.interval);
    this.data.medical.interval = setInterval(() => {
      if (this.data.medical.seconds > 0) {
        this.data.medical.seconds--;
        this.renderTimerOnly();
        this.sync.broadcast('STATE_UPDATE', this.data);
      } else {
        this.stopMedicalTimeout();
        window.soundSys.playBuzzer();
      }
    }, 1000);
    window.soundSys.playKalyeo();
    this.notifyChange();
  }

  stopMedicalTimeout() {
    if (this.data.medical.interval) clearInterval(this.data.medical.interval);
    this.data.medical.active = false;
    this.notifyChange();
  }

  // --- JADWAL PARTAI MANAGEMENT ---
  selectMatch(matchId) {
    const match = this.data.matches.find(m => m.id === matchId);
    if (!match) return;

    this.data.matchNumber = match.number;
    this.data.division = match.division;
    this.data.category = match.category;

    if (match.category === 'kyorugi') {
      const partsChung = match.chung.split('(');
      const partsHong = match.hong.split('(');
      this.data.kyorugi.chung.name = partsChung[0].trim().toUpperCase();
      this.data.kyorugi.chung.team = (partsChung[1] || 'KONTINGEN').replace(')', '').trim().toUpperCase();
      this.data.kyorugi.hong.name = partsHong[0].trim().toUpperCase();
      this.data.kyorugi.hong.team = (partsHong[1] || 'KONTINGEN').replace(')', '').trim().toUpperCase();
      this.resetKyorugiMatch();
    } else {
      const parts = match.chung.split('(');
      if (match.category === 'poomsae_rec') {
        this.data.poomsaeRec.athleteName = parts[0].trim().toUpperCase();
        this.data.poomsaeRec.team = (parts[1] || 'KONTINGEN').replace(')', '').trim().toUpperCase();
      } else {
        this.data.poomsaeFree.athleteName = parts[0].trim().toUpperCase();
        this.data.poomsaeFree.team = (parts[1] || 'KONTINGEN').replace(')', '').trim().toUpperCase();
      }
    }

    this.data.matches.forEach(m => {
      if (m.id === matchId) m.status = 'BERLANGSUNG';
      else if (m.status === 'BERLANGSUNG') m.status = 'SELESAI';
    });

    this.notifyChange();
  }

  // --- JURUS / JUDGE PAD LOGIC ---
  setJudgeId(judgeId) {
    this.data.selectedJudgeId = judgeId;
    this.notifyChange();
  }

  setJudgePadMode(mode) {
    this.data.judgePadMode = mode;
    this.notifyChange();
  }

  updateJudgeScore(judgeId, acc, pres) {
    const j = this.data.poomsaeRec.judges.find(item => item.id === judgeId);
    if (j) {
      if (acc !== undefined) j.accuracy = parseFloat(acc);
      if (pres !== undefined) j.presentation = parseFloat(pres);
      this.notifyChange();
    }
  }

  formatTime(totalSeconds) {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }

  renderTimerOnly() {
    const timerEls = document.querySelectorAll('.dynamic-timer-text');
    const formatted = this.formatTime(this.data.kyorugi.timerSeconds);
    timerEls.forEach(el => el.textContent = formatted);

    const medEls = document.querySelectorAll('.dynamic-medical-text');
    medEls.forEach(el => el.textContent = `${this.data.medical.seconds}s`);
  }

  printScoresheet() {
    const printEl = document.getElementById('print-scoresheet');
    if (!printEl) return;

    const { category, court, division, matchNumber, settings, kyorugi, poomsaeRec, poomsaeFree } = this.data;
    const now = new Date().toLocaleString('id-ID');
    const tournament = settings.tournamentTitle || 'KEJUARAAN NASIONAL TAEKWONDO TAHUN 2026';

    let content = `
      <div style="font-family: Arial, Helvetica, sans-serif; max-width: 850px; margin: 0 auto; color: #000; padding: 10px; line-height: 1.3;">
        <!-- Kop Surat Resmi WT & PBTI -->
        <div style="border-bottom: 2px solid #000; padding-bottom: 8px; margin-bottom: 12px; display: flex; align-items: center; justify-content: space-between;">
          <div style="border: 2px solid #000; font-weight: 900; font-size: 24px; padding: 4px 10px; letter-spacing: -1px;">WT</div>
          <div style="text-align: center; flex: 1; padding: 0 10px;">
            <div style="font-size: 11px; font-weight: bold; letter-spacing: 1px; color: #444; text-transform: uppercase;">PENGURUS BESAR TAEKWONDO INDONESIA / WORLD TAEKWONDO</div>
            <div style="font-size: 17px; font-weight: 900; text-transform: uppercase; margin: 2px 0;">BERITA ACARA & LEMBAR HASIL RESMI PERTANDINGAN</div>
            <div style="font-size: 10px; font-family: monospace; color: #666; text-transform: uppercase;">OFFICIAL MATCH PROTOCOL & SCORESHEET (${category.toUpperCase()})</div>
          </div>
          <div style="text-align: right; font-size: 10px; font-family: monospace; border-left: 1px solid #000; padding-left: 8px;">
            <div>FORM: <b>${category === 'kyorugi' ? 'WT-FR-01' : (category === 'poomsae_rec' ? 'WT-FR-02' : 'WT-FR-03')}</b></div>
            <div>VERSI: <b>2024-V2</b></div>
            <div>STATUS: <b>RESMI</b></div>
          </div>
        </div>

        <!-- Info Pertandingan / Metadata -->
        <table style="width: 100%; font-size: 11px; margin-bottom: 10px; border-collapse: collapse; border: 1px solid #000; background: #fdfdfd;">
          <tr>
            <td style="width: 18%; font-weight: bold; padding: 3px 6px; border: 1px solid #ddd;">Nama Turnamen:</td>
            <td style="width: 42%; font-weight: bold; padding: 3px 6px; border: 1px solid #ddd;">${tournament}</td>
            <td style="width: 18%; font-weight: bold; padding: 3px 6px; border: 1px solid #ddd;">Gelanggang (Court):</td>
            <td style="width: 22%; font-weight: bold; padding: 3px 6px; border: 1px solid #ddd;">${court}</td>
          </tr>
          <tr>
            <td style="font-weight: bold; padding: 3px 6px; border: 1px solid #ddd;">Nomor Partai:</td>
            <td style="font-weight: bold; color: #b91c1c; padding: 3px 6px; border: 1px solid #ddd;">${matchNumber}</td>
            <td style="font-weight: bold; padding: 3px 6px; border: 1px solid #ddd;">Waktu Cetak:</td>
            <td style="padding: 3px 6px; border: 1px solid #ddd;">${now}</td>
          </tr>
          <tr>
            <td style="font-weight: bold; padding: 3px 6px; border: 1px solid #ddd;">Divisi / Kategori:</td>
            <td style="padding: 3px 6px; border: 1px solid #ddd;">${division}</td>
            <td style="font-weight: bold; padding: 3px 6px; border: 1px solid #ddd;">Babak Pertandingan:</td>
            <td style="padding: 3px 6px; border: 1px solid #ddd;">Penyisihan / Semifinal / Final</td>
          </tr>
        </table>
    `;

    if (category === 'kyorugi') {
      const isPtf = kyorugi.winReason && kyorugi.winReason.toLowerCase().includes('poin');
      const isPtg = kyorugi.winReason && kyorugi.winReason.toLowerCase().includes('gap');
      const isRsc = kyorugi.winReason && kyorugi.winReason.toLowerCase().includes('rsc');
      const isWdr = kyorugi.winReason && kyorugi.winReason.toLowerCase().includes('wdr');

      content += `
        <!-- Data Atlet Kyorugi -->
        <table style="width: 100%; font-size: 11px; margin-bottom: 10px; border-collapse: collapse; border: 2px solid #000;">
          <thead>
            <tr>
              <th style="width: 50%; background: #0056b3; color: #fff; padding: 4px; text-transform: uppercase;">CHUNG (청) - SUDUT BIRU</th>
              <th style="width: 50%; background: #c82333; color: #fff; padding: 4px; text-transform: uppercase;">HONG (홍) - SUDUT MERAH</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style="padding: 6px; border: 1px solid #ccc; background: #f0f7ff;">
                <div><b>Nama Atlet:</b> <span style="font-size: 13px; font-weight: bold; color: #004085;">${kyorugi.chung.name}</span></div>
                <div><b>Tim / Kontingen:</b> ${kyorugi.chung.team}</div>
                <div><b>No. Lisensi / GAL:</b> INA-${kyorugi.chung.team.substring(0, 3).toUpperCase()}-01</div>
                <div><b>Sisa Kuota Replay:</b> ${kyorugi.chung.videoQuota} Kartu</div>
              </td>
              <td style="padding: 6px; border: 1px solid #ccc; background: #fff5f5;">
                <div><b>Nama Atlet:</b> <span style="font-size: 13px; font-weight: bold; color: #721c24;">${kyorugi.hong.name}</span></div>
                <div><b>Tim / Kontingen:</b> ${kyorugi.hong.team}</div>
                <div><b>No. Lisensi / GAL:</b> INA-${kyorugi.hong.team.substring(0, 3).toUpperCase()}-02</div>
                <div><b>Sisa Kuota Replay:</b> ${kyorugi.hong.videoQuota} Kartu</div>
              </td>
            </tr>
          </tbody>
        </table>

        <!-- Tabel Rincian Ronde WT Best of 3 -->
        <table style="width: 100%; font-size: 11px; text-align: center; border-collapse: collapse; border: 1px solid #000; margin-bottom: 10px;">
          <thead>
            <tr style="background: #e9ecef; font-weight: bold; border-bottom: 1px solid #000;">
              <th rowspan="2" style="border: 1px solid #000; padding: 4px; width: 12%;">Ronde</th>
              <th colspan="2" style="border: 1px solid #000; padding: 4px; background: #d0e2ff; color: #003366;">CHUNG (BIRU)</th>
              <th colspan="2" style="border: 1px solid #000; padding: 4px; background: #ffd7d9; color: #660000;">HONG (MERAH)</th>
              <th rowspan="2" style="border: 1px solid #000; padding: 4px; width: 22%;">Pemenang Ronde</th>
              <th rowspan="2" style="border: 1px solid #000; padding: 4px; width: 30%;">Metode & Alasan Kemenangan</th>
            </tr>
            <tr style="background: #f8f9fa; font-size: 10px; border-bottom: 1px solid #000;">
              <th style="border: 1px solid #000; padding: 2px;">Poin</th>
              <th style="border: 1px solid #000; padding: 2px;">Gam-jeom</th>
              <th style="border: 1px solid #000; padding: 2px;">Poin</th>
              <th style="border: 1px solid #000; padding: 2px;">Gam-jeom</th>
            </tr>
          </thead>
          <tbody>
            ${[1, 2, 3].map(r => {
        const hist = kyorugi.roundHistory.find(h => h.round === r);
        const isCurrentActive = (r === kyorugi.round && !hist);
        const cPts = hist ? hist.chungScore : (isCurrentActive ? kyorugi.chung.score : '-');
        const cGj = hist ? hist.chungGamjeom : (isCurrentActive ? kyorugi.chung.gamjeom : '-');
        const hPts = hist ? hist.hongScore : (isCurrentActive ? kyorugi.hong.score : '-');
        const hGj = hist ? hist.hongGamjeom : (isCurrentActive ? kyorugi.hong.gamjeom : '-');
        const winnerText = hist ? (hist.winner === 'chung' ? 'CHUNG (BIRU)' : 'HONG (MERAH)') : (isCurrentActive ? 'Sedang Berjalan' : '-');
        const reasonText = hist ? hist.reason : (isCurrentActive ? 'Ronde Sedang Berlangsung' : '-');

        return `
                <tr style="border-bottom: 1px solid #ccc; ${hist && hist.winner === 'chung' ? 'background: #f4f8ff;' : (hist && hist.winner === 'hong' ? 'background: #fff6f6;' : '')}">
                  <td style="border: 1px solid #000; padding: 4px; font-weight: bold;">Ronde ${r}</td>
                  <td style="border: 1px solid #000; padding: 4px; font-weight: bold; color: #0056b3; font-size: 13px;">${cPts}</td>
                  <td style="border: 1px solid #000; padding: 4px;">${cGj}</td>
                  <td style="border: 1px solid #000; padding: 4px; font-weight: bold; color: #c82333; font-size: 13px;">${hPts}</td>
                  <td style="border: 1px solid #000; padding: 4px;">${hGj}</td>
                  <td style="border: 1px solid #000; padding: 4px; font-weight: bold;">${winnerText}</td>
                  <td style="border: 1px solid #000; padding: 4px; text-align: left; font-size: 10px;">${reasonText}</td>
                </tr>
              `;
      }).join('')}
          </tbody>
        </table>

        <!-- Kotak Rekapitulasi & Keputusan Akhir -->
        <div style="border: 2px solid #000; padding: 8px; background: #fff8e1; margin-bottom: 12px;">
          <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #000; padding-bottom: 4px; margin-bottom: 6px;">
            <div style="font-size: 11px; font-weight: bold; text-transform: uppercase;">KEPUTUSAN PEMENANG RESMI (OFFICIAL MATCH WINNER):</div>
            <div style="font-size: 11px; font-weight: bold;">SKOR RONDE: <span style="font-size: 14px;">${kyorugi.chung.roundsWon} - ${kyorugi.hong.roundsWon}</span></div>
          </div>
          <div style="text-align: center; font-size: 16px; font-weight: 900; margin: 4px 0; color: ${kyorugi.winner === 'chung' ? '#0056b3' : (kyorugi.winner === 'hong' ? '#c82333' : '#000')};">
            ${kyorugi.winner ? (kyorugi.winner === 'chung' ? `[PEMENANG: CHUNG / BIRU] ${kyorugi.chung.name} (${kyorugi.chung.team})` : `[PEMENANG: HONG / MERAH] ${kyorugi.hong.name} (${kyorugi.hong.team})`) : 'STATUS: BELUM SELESAI / SEDANG BERLANGSUNG'}
          </div>
          <div style="font-size: 10px; font-weight: bold; margin-top: 6px; display: grid; grid-template-columns: repeat(8, 1fr); gap: 4px; text-align: center; border-top: 1px solid #ccc; padding-top: 4px;">
            <div>[ ${isPtf ? 'X' : ' '} ] PTF</div>
            <div>[ ${isPtg ? 'X' : ' '} ] PTG</div>
            <div>[ ${isRsc ? 'X' : ' '} ] RSC</div>
            <div>[ ${isWdr ? 'X' : ' '} ] WDR</div>
            <div>[   ] DSQ</div>
            <div>[   ] PUN</div>
            <div>[   ] SUP</div>
            <div>[   ] GDP</div>
          </div>
        </div>
      `;
    } else if (category === 'poomsae_rec') {
      content += `
        <!-- Data Atlet Poomsae Recognised -->
        <table style="width: 100%; font-size: 11px; margin-bottom: 10px; border-collapse: collapse; border: 1px solid #000;">
          <tr style="background: #f8f9fa;">
            <td style="width: 20%; font-weight: bold; padding: 4px 6px; border: 1px solid #ccc;">Nama Peserta:</td>
            <td style="width: 40%; font-weight: bold; font-size: 13px; padding: 4px 6px; border: 1px solid #ccc;">${poomsaeRec.athleteName}</td>
            <td style="width: 20%; font-weight: bold; padding: 4px 6px; border: 1px solid #ccc;">Kontingen / Tim:</td>
            <td style="width: 20%; padding: 4px 6px; border: 1px solid #ccc;">${poomsaeRec.team}</td>
          </tr>
          <tr>
            <td style="font-weight: bold; padding: 4px 6px; border: 1px solid #ccc;">Jurus Wajib 1:</td>
            <td style="font-weight: bold; padding: 4px 6px; border: 1px solid #ccc;">${poomsaeRec.poomsaeName}</td>
            <td style="font-weight: bold; padding: 4px 6px; border: 1px solid #ccc;">Skala Nilai:</td>
            <td style="padding: 4px 6px; border: 1px solid #ccc;">10.00 (WT Standard)</td>
          </tr>
        </table>

        <!-- Tabel Truncated Mean Panel 5 Juri -->
        <table style="width: 100%; font-size: 11px; text-align: center; border-collapse: collapse; border: 1px solid #000; margin-bottom: 10px;">
          <thead>
            <tr style="background: #e9ecef; font-weight: bold; border-bottom: 1px solid #000;">
              <th style="border: 1px solid #000; padding: 4px; width: 14%;">Panel Juri</th>
              <th style="border: 1px solid #000; padding: 4px; width: 26%;">AKURASI (Max 4.00)<br/><span style="font-size: 9px; font-weight: normal;">Kuda-kuda, Tangkisan, Tendangan</span></th>
              <th style="border: 1px solid #000; padding: 4px; width: 26%;">PRESENTASI (Max 6.00)<br/><span style="font-size: 9px; font-weight: normal;">Tenaga, Kecepatan, Irama</span></th>
              <th style="border: 1px solid #000; padding: 4px; width: 16%;">Total Nilai</th>
              <th style="border: 1px solid #000; padding: 4px; width: 18%;">Status Truncated</th>
            </tr>
          </thead>
          <tbody>
            ${poomsaeRec.judges.map(j => {
        const isDroppedAccMin = j.id === poomsaeRec.result.droppedAccMin;
        const isDroppedAccMax = j.id === poomsaeRec.result.droppedAccMax;
        const isDroppedPresMin = j.id === poomsaeRec.result.droppedPresMin;
        const isDroppedPresMax = j.id === poomsaeRec.result.droppedPresMax;
        const isDroppedAny = isDroppedAccMin || isDroppedAccMax || isDroppedPresMin || isDroppedPresMax;

        return `
                <tr style="border-bottom: 1px solid #ddd; ${isDroppedAny ? 'background: #fff0f0; color: #888;' : ''}">
                  <td style="border: 1px solid #000; padding: 4px; font-weight: bold; color: #000;">${j.id}</td>
                  <td style="border: 1px solid #000; padding: 4px; ${isDroppedAccMin || isDroppedAccMax ? 'text-decoration: line-through; color: #d00;' : 'font-weight: bold;'}">${j.accuracy.toFixed(2)} ${(isDroppedAccMin ? '(Min)' : (isDroppedAccMax ? '(Max)' : ''))}</td>
                  <td style="border: 1px solid #000; padding: 4px; ${isDroppedPresMin || isDroppedPresMax ? 'text-decoration: line-through; color: #d00;' : 'font-weight: bold;'}">${j.presentation.toFixed(2)} ${(isDroppedPresMin ? '(Min)' : (isDroppedPresMax ? '(Max)' : ''))}</td>
                  <td style="border: 1px solid #000; padding: 4px; font-weight: bold; color: #000;">${(j.accuracy + j.presentation).toFixed(2)}</td>
                  <td style="border: 1px solid #000; padding: 4px; font-size: 10px; font-weight: bold; color: ${isDroppedAny ? '#c00' : '#080'};">${isDroppedAny ? 'DIBUANG (Drop)' : 'DIHITUNG'}</td>
                </tr>
              `;
      }).join('')}
          </tbody>
          <tfoot>
            <tr style="background: #e2f0cb; font-weight: 900; font-size: 12px; border-top: 2px solid #000;">
              <td style="border: 1px solid #000; padding: 5px;">RATA-RATA RESMI</td>
              <td style="border: 1px solid #000; padding: 5px; color: #003366;">${poomsaeRec.result.accuracyFinal}</td>
              <td style="border: 1px solid #000; padding: 5px; color: #003366;">${poomsaeRec.result.presentationFinal}</td>
              <td colspan="2" style="border: 1px solid #000; padding: 5px; font-size: 15px; color: #0b6623;">
                SKOR TOTAL: ${poomsaeRec.result.totalScore}
              </td>
            </tr>
          </tfoot>
        </table>
      `;
    } else {
      content += `
        <!-- Data Atlet Freestyle -->
        <table style="width: 100%; font-size: 11px; margin-bottom: 10px; border-collapse: collapse; border: 1px solid #000;">
          <tr style="background: #f8f9fa;">
            <td style="width: 20%; font-weight: bold; padding: 4px 6px; border: 1px solid #ccc;">Nama Peserta:</td>
            <td style="width: 40%; font-weight: bold; font-size: 13px; padding: 4px 6px; border: 1px solid #ccc;">${poomsaeFree.athleteName}</td>
            <td style="width: 20%; font-weight: bold; padding: 4px 6px; border: 1px solid #ccc;">Kontingen / Tim:</td>
            <td style="width: 20%; padding: 4px 6px; border: 1px solid #ccc;">${poomsaeFree.team}</td>
          </tr>
          <tr>
            <td style="font-weight: bold; padding: 4px 6px; border: 1px solid #ccc;">Durasi Musik:</td>
            <td style="padding: 4px 6px; border: 1px solid #ccc;">90 - 100 Detik (Standard WT)</td>
            <td style="font-weight: bold; padding: 4px 6px; border: 1px solid #ccc;">Skala Nilai:</td>
            <td style="padding: 4px 6px; border: 1px solid #ccc;">Teknik 6.00 + Presentasi 4.00</td>
          </tr>
        </table>

        <!-- Ringkasan Nilai Freestyle -->
        <table style="width: 100%; font-size: 11px; text-align: center; border-collapse: collapse; border: 1px solid #000; margin-bottom: 10px;">
          <tr style="background: #e9ecef; font-weight: bold;">
            <th style="border: 1px solid #000; padding: 5px; width: 33%;">1. TEKNIK WAJIB (Max 6.00)</th>
            <th style="border: 1px solid #000; padding: 5px; width: 33%;">2. PRESENTASI (Max 4.00)</th>
            <th style="border: 1px solid #000; padding: 5px; width: 34%;">SKOR AKHIR RESMI</th>
          </tr>
          <tr>
            <td style="border: 1px solid #000; padding: 8px; font-size: 15px; font-weight: bold; color: #4a154b;">${poomsaeFree.result.technicalScore.toFixed(2)}</td>
            <td style="border: 1px solid #000; padding: 8px; font-size: 15px; font-weight: bold; color: #4a154b;">${poomsaeFree.result.presentationScore.toFixed(2)}</td>
            <td style="border: 1px solid #000; padding: 8px; font-size: 20px; font-weight: 900; color: #0b6623; background: #e8f5e9;">${poomsaeFree.result.finalScore.toFixed(2)} / 10.00</td>
          </tr>
        </table>
      `;
    }

    // Blok 4 Tanda Tangan Resmi Pengesahan
    content += `
        <div style="margin-top: 25px; border-top: 1px solid #000; padding-top: 10px;">
          <div style="font-size: 10px; font-weight: bold; text-transform: uppercase; text-align: center; margin-bottom: 15px; letter-spacing: 0.5px; color: #555;">
            PENGESAHAN DEWAN WASIT & PANITIA PERTANDINGAN (OFFICIAL RATIFICATION)
          </div>
          <table style="width: 100%; font-size: 11px; text-align: center; border-collapse: collapse;">
            <tr>
              <td style="width: 25%; vertical-align: top;">
                <div>Wasit Tengah (Referee)</div>
                <div style="height: 45px;"></div>
                <div style="border-top: 1px solid #000; width: 80%; margin: 0 auto; padding-top: 3px; font-weight: bold;">( ................................ )</div>
                <div style="font-size: 9px; color: #555;">Lisensi Wasit PBTI / WT</div>
              </td>
              <td style="width: 25%; vertical-align: top;">
                <div>Dewan Juri (Judges)</div>
                <div style="height: 45px;"></div>
                <div style="border-top: 1px solid #000; width: 80%; margin: 0 auto; padding-top: 3px; font-weight: bold;">( ................................ )</div>
                <div style="font-size: 9px; color: #555;">Corner Judge Panel</div>
              </td>
              <td style="width: 25%; vertical-align: top;">
                <div>Juri Replay (Review Jury)</div>
                <div style="height: 45px;"></div>
                <div style="border-top: 1px solid #000; width: 80%; margin: 0 auto; padding-top: 3px; font-weight: bold;">( ................................ )</div>
                <div style="font-size: 9px; color: #555;">Video Replay Official</div>
              </td>
              <td style="width: 25%; vertical-align: top;">
                <div>Ketua Pertandingan (CS/TD)</div>
                <div style="height: 45px;"></div>
                <div style="border-top: 1px solid #000; width: 80%; margin: 0 auto; padding-top: 3px; font-weight: bold;">( ................................ )</div>
                <div style="font-size: 9px; color: #555;">Technical Delegate PBTI</div>
              </td>
            </tr>
          </table>
        </div>
      </div>
    `;

    printEl.innerHTML = content;
    window.print();
  }

  // --- PENGATURAN / SETTINGS MODAL ---
  toggleSettingsModal() {
    this.data.settingsModalOpen = !this.data.settingsModalOpen;
    this.notifyChange();
  }

  saveSettings(title, court, duration, pointGap, muted) {
    this.data.settings.tournamentTitle = title;
    this.data.settings.courtName = court;
    this.data.court = court;
    this.data.settings.roundDuration = parseInt(duration) || 120;
    this.data.kyorugi.timerInitial = this.data.settings.roundDuration;
    this.data.kyorugi.timerSeconds = this.data.settings.roundDuration;
    this.data.settings.pointGapEnabled = !!pointGap;
    this.data.settings.soundMuted = !!muted;
    window.soundSys.soundEnabled = !muted;
    this.data.settingsModalOpen = false;
    this.notifyChange();
  }

  // --- EKSPOR DATA HASIL PERTANDINGAN ---
  exportMatchesJSON() {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(this.data.matches, null, 2));
    const dlAnchorElem = document.createElement('a');
    dlAnchorElem.setAttribute("href", dataStr);
    dlAnchorElem.setAttribute("download", `Hasil_Pertandingan_Taekwondo_${this.data.court.replace(/\s+/g, '_')}.json`);
    dlAnchorElem.click();
  }

  exportMatchesCSV() {
    let csv = "Nomor Partai,Kategori,Divisi,Sudut Biru (Chung),Sudut Merah (Hong),Status\n";
    this.data.matches.forEach(m => {
      csv += `"${m.number}","${m.category}","${m.division}","${m.chung}","${m.hong}","${m.status}"\n`;
    });
    const dataStr = "data:text/csv;charset=utf-8," + encodeURIComponent(csv);
    const dlAnchorElem = document.createElement('a');
    dlAnchorElem.setAttribute("href", dataStr);
    dlAnchorElem.setAttribute("download", `Hasil_Pertandingan_Taekwondo_${this.data.court.replace(/\s+/g, '_')}.csv`);
    dlAnchorElem.click();
  }

  render() {
    if (typeof window.renderUI === 'function') {
      window.renderUI(this);
    }
  }
}

window.app = new AppState();

