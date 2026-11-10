# Spesifikasi Sistem & Role Template Scoring Board Taekwondo
*(Sesuai Standar Resmi World Taekwondo - WT)*

Dokumen ini memuat arsitektur peran (*roles*), aturan penilaian (*scoring logic*), serta spesifikasi data untuk pengembangan template aplikasi **Scoring Board Taekwondo** pada 3 kategori:
1. **Kyorugi (Sparring / Pertarungan)**
2. **Poomsae Recognised (Jurus Standar)**
3. **Poomsae Freestyle (Jurus Bebas / Akrobatik)**

---

## 1. Role Pengguna dalam Sistem (User Roles & Permissions)

Dalam sistem aplikasi scoring board kejuaraan, terdapat 5 role utama yang saling berinteraksi secara real-time:

| Role | Perangkat | Deskripsi & Hak Akses |
| :--- | :--- | :--- |
| **Super Admin / Competition Supervisor (CS)** | Laptop / PC Panitia | - Membuat event, kategori kelas, jadwal partai (bagan/bracket), dan alokasi ring/court.<br>- Mengatur regulasi durasi ronde, bobot poin, dan jumlah juri.<br>- Hak override hasil pertandingan jika terjadi diskualifikasi atau banding resmi. |
| **Table Operator (Operator Meja)** | Laptop Meja Pertandingan | - Mengontrol timer match (Start, Pause, Reset, Medical Time).<br>- Mengubah ronde, memanggil atlet (*Chung* / Biru & *Hong* / Merah).<br>- Menambahkan/membatalkan *Gam-jeom* (pelanggaran) sesuai instruksi Wasit Tengah.<br>- Memulai / mengakhiri sesi penilaian Poomsae dan memicu kalkulasi skor. |
| **Corner Judge (Juri Penilai)** | Tablet / Smartphone / Scoring Pad | - Input poin teknik manual secara real-time (Kyorugi: Punch & Spinning kick validation).<br>- Input nilai Akurasi (*Accuracy*) & Penyajian (*Presentation*) pada kategori Poomsae.<br>- Tidak memiliki kontrol timer atau manipulasi skor juri lain. |
| **Review Jury / IVR Operator** | Laptop + Monitor Video Replay | *(Khusus Kyorugi)*<br>- Mengelola kartu banding kuota pelatih (*Coach Video Replay Request*).<br>- Memutar ulang video dari multi-angle dan memutuskan accept/reject banding poin atau penalti. |
| **Display / Spectator View** | Big Screen / LED TV / Monitor Lapangan | - Mode *Read-only* yang menampilkan informasi publik: nama atlet, kontingen, bendera, timer, skor per ronde, indikator pelanggaran, dan pengumuman pemenang.<br>- Mendukung mode *OBS/Broadcast Overlay* untuk live streaming. |

---

## 2. Kategori 1: Kyorugi (Sparring)

Sistem Kyorugi mengadopsi aturan terbaru World Taekwondo yaitu **Sistem "Best of 3 Rounds"** (Pemenang adalah atlet yang memenangkan 2 ronde terlebih dahulu).

### A. Bobot Poin & Penalti
- **Punch ke Pelindung Badan (Trunk):** 1 Poin (Validasi tombol juri).
- **Tendangan ke Badan (Trunk Kick):** 2 Poin (Sensor PSS otomatis atau input juri).
- **Tendangan Memutar ke Badan (Turning Trunk Kick):** 4 Poin (2 PSS + 2 Juri Teknis).
- **Tendangan ke Kepala (Head Kick):** 3 Poin (Sensor PSS Headgear atau input juri).
- **Tendangan Memutar ke Kepala (Turning Head Kick):** 5 Poin (3 PSS Headgear + 2 Juri Teknis).
- **Gam-jeom (Pelanggaran/Penalti):** +1 Poin langsung untuk pihak lawan.

### B. Aturan & Logic Pertandingan
1. **Durasi Ronde:** Umumnya 3 ronde x 1.5 - 2 menit (istirahat antar ronde: 1 menit).
2. **Kemenangan Ronde:**
   - Atlet dengan akumulasi poin tertinggi di akhir ronde memenangkan ronde tersebut (skor ronde bertambah 1).
   - **Skor poin di-reset menjadi 0 - 0** pada awal setiap ronde baru.
3. **Kondisi Penghentian Ronde / Pertandingan Sebelum Waktu Habis:**
   - **Point Gap:** Selisih skor mencapai 12 poin dalam 1 ronde (opsional tergantung kategori usia).
   - **Gam-jeom Limit:** Jika salah satu atlet mengumpulkan **5 Gam-jeom dalam satu ronde**, lawannya otomatis memenangkan ronde tersebut.
   - **RSC / KO / Referee Stops Contest:** Dinyatakan langsung oleh Wasit Tengah.
   - **Win by Best of 3:** Atlet yang pertama mengantongi 2 kemenangan ronde (2-0 atau 2-1) dinyatakan sebagai pemenang pertandingan.
4. **Kriteria Tie-Break Ronde (Jika Ronde Berakhir Seri):**
   Jika skor ronde sama (misal 5 - 5), penentuan pemenang ronde dilakukan berurutan berdasarkan:
   1. Poin tertinggi yang didapat dari teknik memutar (*turning kicks*).
   2. Jika masih sama: Poin yang didapat dari teknik bernilai lebih tinggi (Kepala > Badan > Pukulan > Gam-jeom).
   3. Jika masih sama: Jumlah pukulan/tendangan sah terdaftar di sensor PSS (*hit count*).
   4. Jika masih sama: Keputusan keunggulan juri (*Superiority / Referee & Judges Decision*).

---

## 3. Kategori 2: Poomsae Recognised (Jurus Standar)

Penilaian Poomsae Standar menguji ketepatan gerakan baku Taekwondo (Taegeuk / Koryo / Keumgang, dll.) dengan skala nilai total maksimal **10.00**.

### A. Komponen Penilaian

#### 1. Accuracy (Akurasi Gerakan) — Nilai Dasar: 4.00
Menggunakan sistem pengurangan nilai (*deduction system*):
- **Pengurangan Kecil (-0.1 poin):**
  - Kuda-kuda (*seogi*) kurang tepat (sudut, jarak, atau lebar kaki).
  - Posisi tangan/tangkisan/pukulan sedikit melenceng dari garis target.
  - Keseimbangan sedikit goyah pada saat transisi atau eksekusi tendangan.
- **Pengurangan Besar (-0.3 poin):**
  - Melakukan teknik yang salah (misal: harusnya tangkisan bawah, malah tangkisan tengah).
  - Melupakan gerakan, terhenti di tengah jalan lebih dari 3 detik.
  - Kehilangan keseimbangan total (terjatuh, langkah tambahan tidak terkontrol).
  - Suara hentakan kaki (*stomp*) yang tidak sesuai ketentuan.

#### 2. Presentation (Penyajian Gerakan) — Nilai Dasar: 6.00
Menggunakan sistem evaluasi deskriptif (0.00 – 2.00 per sub-kategori):
- **Speed & Power (Kecepatan & Daya Ledak):** Rentang 0.0 – 2.0.
- **Rhythm & Tempo (Irama Gerakan):** Rentang 0.0 – 2.0 (kontras antara gerakan lambat bertekanan dan gerakan cepat eksplosif).
- **Expression of Energy (Kihap & Penguasaan Diri):** Rentang 0.0 – 2.0 (fokus pandangan, pernapasan, dan semangat bertanding).

### B. Rumus Kalkulasi Skor (Truncated Mean)
Jika menggunakan panel **5 Juri** atau **7 Juri**:
1. Untuk masing-masing nilai (Akurasi & Presentasi), buang **1 nilai tertinggi** dan **1 nilai terendah**.
2. Hitung rata-rata (*average*) dari juri yang tersisa.
3. **Total Skor Akhir = Rata-rata Akurasi + Rata-rata Presentasi - Penalti Panitia (jika ada, misal waktu lewati batas).**
4. Nilai dibulatkan hingga 2 atau 3 angka desimal (contoh: **7.633**).

---

## 4. Kategori 3: Poomsae Freestyle (Jurus Bebas)

Kategori ini memadukan teknik tendangan tinggi, putaran multi-rotasi, dan akrobatik dengan latar musik berdurasi **90 hingga 100 detik**. Nilai total maksimal adalah **10.00**.

### A. Komponen Penilaian

#### 1. Technical Skills (Keahlian Teknik) — Nilai Maksimal: 6.00
Terdiri dari **5 Elemen Wajib (Compulsory Techniques)** bernilai masing-masing 0.0 – 1.0 poin (Total 5.0) + 1.0 poin untuk Teknik Dasar:
1. **Jumping Side Kick (Tinggi Lompatan):** Menilai ketinggian lompatan dan posisi kaki saat menendang ke samping.
2. **Multiple Kicks in a Single Jump (Jumlah Sasaran):** Menilai tendangan beruntun di udara dalam 1 lompatan (minimal 3-5 tendangan sebelum mendarat).
3. **Spinning Kick (Derajat Putaran):** Tendangan memutar bergradasi tinggi (540°, 720°, atau lebih).
4. **Taekwondo Basic Stances & Movements:** Rangkaian kuda-kuda dan tangkisan dasar Taekwondo beruntun (*Yeon-mu line*).
5. **Acquiring Kicks with Acrobatic Actions:** Kombinasi tendangan akrobatik (backflip kick, webster kick, b-twist kick, dll.).

#### 2. Presentation (Penyajian Gerakan & Musik) — Nilai Maksimal: 4.00
- **Creativity (Kreativitas Penyusunan Koreografi):** 0.0 – 1.0.
- **Harmony (Keselarasan dengan Musik):** 0.0 – 1.0 (gerakan jatuh tepat pada ketukan/beat instrumen).
- **Expression of Energy (Dinamika & Kekuatan):** 0.0 – 1.0.
- **Rhythm & Synchronization (Sinkronisasi):** 0.0 – 1.0 (khusus kategori Pair atau Team).

### B. Penalti (Deduction by Referee/System)
- **Batas Waktu Pertunjukan:** 90 - 100 detik.
  - Kurang dari 90 detik atau lebih dari 100 detik: **-0.3 poin per interval 10 detik**.
- **Keluar Garis Batas Lapangan (*Boundary Line*):** -0.3 poin per pelanggaran.
- **Musik Mengandung Lirik Terlarang / Tidak Pantas:** Diskualifikasi atau penalti -0.6 poin.

---

## 5. Struktur Data State Scoring (Contoh Format JSON)

Gunakan struktur data ini sebagai acuan *state management* (Redux, Pinia, atau Zustand) pada template scoring board:

```json
{
  "courtNumber": 1,
  "category": "KYORUGI", // "KYORUGI" | "POOMSAE_RECOGNISED" | "POOMSAE_FREESTYLE"
  "matchId": "KY-M-U68-042",
  "division": "Senior Male Under 68kg",
  "status": "RUNNING", // "IDLE" | "RUNNING" | "PAUSED" | "FINISHED"
  
  // State untuk Kategori KYORUGI
  "kyorugi": {
    "currentRound": 1,
    "maxRounds": 3,
    "roundTimeRemaining": 120, // detik
    "roundWinners": ["CHUNG"], // riwayat pemenang ronde 1, 2, 3
    "blue": {
      "athleteName": "Ahmad Rizky",
      "team": "Jawa Barat",
      "roundPoints": 8,
      "gamJeom": 2,
      "roundsWon": 1,
      "hitCount": 14
    },
    "red": {
      "athleteName": "Budi Santoso",
      "team": "DKI Jakarta",
      "roundPoints": 4,
      "gamJeom": 1,
      "roundsWon": 0,
      "hitCount": 9
    }
  },

  // State untuk Kategori POOMSAE RECOGNISED
  "poomsaeRecognised": {
    "poomsaeName": "Koryo",
    "athlete": {
      "name": "Siti Rahma",
      "team": "Jawa Tengah"
    },
    "judgeCount": 5,
    "scores": [
      { "judgeId": "J1", "accuracy": 3.7, "presentation": 4.5 },
      { "judgeId": "J2", "accuracy": 3.6, "presentation": 4.6 },
      { "judgeId": "J3", "accuracy": 3.9, "presentation": 4.4 },
      { "judgeId": "J4", "accuracy": 3.4, "presentation": 4.3 },
      { "judgeId": "J5", "accuracy": 3.7, "presentation": 4.7 }
    ],
    "truncatedScores": {
      "accuracyFinal": 3.67,
      "presentationFinal": 4.50,
      "deductions": 0.0,
      "totalScore": 8.17
    }
  },

  // State untuk Kategori POOMSAE FREESTYLE
  "poomsaeFreestyle": {
    "athleteOrTeam": "Tim Freestyle Garuda",
    "performanceTime": 94, // detik
    "musicPlaying": true,
    "judgeScores": [
      {
        "judgeId": "J1",
        "technical": {
          "jumpSideKick": 0.8,
          "multipleKicks": 0.7,
          "spinningKick": 0.9,
          "basicMovement": 0.8,
          "acrobaticKick": 0.9,
          "basicStances": 0.8
        },
        "presentation": {
          "creativity": 0.8,
          "harmony": 0.7,
          "energy": 0.9,
          "rhythm": 0.8
        }
      }
    ],
    "penaltyDeductions": 0.0,
    "finalScore": 8.10
  }
}
```

---

## 6. Rekomendasi Fitur UI / Layout Wireframe

1. **Kyorugi Screen:**
   - Panel terpisah simetris: Kiri (Biru / *Chung*), Kanan (Merah / *Hong*).
   - Di tengah: Timer besar, nomor ronde (*Round 1/2/3*), dan indikator *Rounds Won* (berbentuk lampu bulat atau bintang).
   - Indikator *Gam-jeom* (badge peringatan 1 sampai 5).
   - Buzzer audio saat ronde habis atau saat wasit meminta jeda (*Kalyeo*).

2. **Poomsae Screen:**
   - Bagian atas: Info kontingen, nama atlet, dan nama Jurus/Poomsae.
   - Bagian tengah: Detail skor masing-masing juri (J1 s/d J5) dengan visual strikethrough (coret) pada nilai tertinggi dan terendah yang dibuang.
   - Bagian bawah: Angka **Total Skor Akhir** dengan tipografi besar dan kontras tinggi.
   - Tombol toggle untuk beralih antara ronde pertama dan ronde kedua (jika sistem 2 poomsae).

