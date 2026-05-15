"use client";

import React, { useState } from "react";
import {
  LayoutDashboard,
  Users,
  Calendar,
  Archive,
  Settings,
  Search,
  MoreHorizontal,
  Send,
  Bell,
  LogOut,
  Microscope,
  ShieldAlert,
  Image as ImageIcon,
  FileText,
  Activity,
} from "lucide-react";

// TEMA RENKLERİ
const colors = {
  sidebar: "#1a1a2e",
  mainBg: "#13131f",
  card: "#1f1f33",
  border: "#2d2d44",
  primary: "#8b5cf6",
  accent: "#22d3ee",
  critical: "#f43f5e",
  success: "#10b981",
  textHi: "#f4f4f5",
  textLo: "#a1a1aa",
};

const patientDatabase = {
  "M. Yıldız": {
    id: "PT-2041",
    age: 54,
    gender: "Kadın",
    risk: 0.82,
    status: "Bugün",
    timeline: [
      { title: "Atipik nevüs şüphesi", date: "Gözlem", subtitle: "", progress: 0 },
      { title: "Dermoskopik + Biyopsi", date: "04 Nis 2025", subtitle: "Melanositik lezyon (benign)", progress: 22 },
      { title: "Eksizyonel Çıkarım", date: "18 May 2025", subtitle: "Cerrahi sınır temiz", progress: 58 },
    ],
    messages: [
      { role: "ai", text: "NovaVision son görüntüyü işledi. ABCDE asimetri skoru 0.71 → önceki muayeneye göre %18 artış. Geçmiş biyopsi benign olsa da büyüme hızı izlem gerektiriyor.", time: "14:02" },
      { role: "user", text: "Yeni odakta kaşıntı + bant şeklinde renk değişimi var. Önceki lezyonla aynı bölge mi?", time: "14:03" },
      { role: "ai", text: "Lokalizasyon farklı (sol omuz vs sol skapula). PUQ.ai veritabanında 1.842 benzer vaka — %63'ü displastik nevüs paterninde ilerlemiş. Dermoskopik 10x görüntü öneririm.", time: "14:03" },
    ],
    images: [
      { id: "IMG-01", type: "Dermoskopik (10x)", area: "Sol Omuz", date: "Bugün", score: "0.71 (Yüksek)", alert: true },
      { id: "IMG-02", type: "Klinik Makro", area: "Sol Omuz", date: "Bugün", score: "0.45 (Orta)", alert: false },
      { id: "IMG-03", type: "Dermoskopik (10x)", area: "Sol Skapula", date: "04 Nis 2025", score: "0.22 (Düşük)", alert: false },
    ],
    labResults: [
      { test: "Biyopsi / Histopatoloji", date: "04 Nis 2025", result: "Melanositik Nevüs (Benign)", status: "Normal" },
      { test: "Breslow Kalınlığı", date: "18 May 2025", result: "0.2 mm", status: "Güvenli" },
      { test: "Mitotik İndeks", date: "18 May 2025", result: "< 1/mm²", status: "Düşük Risk" },
    ]
  },
  "A. Demir": {
    id: "PT-2039",
    age: 42,
    gender: "Erkek",
    risk: 0.35,
    status: "Dün",
    timeline: [
      { title: "Rutin Kontrol", date: "Dün", subtitle: "Genel vücut haritalama", progress: 100 },
    ],
    messages: [
      { role: "ai", text: "A. Demir için yapılan taramada stabil seyrin korunduğu gözlendi. Yeni veya şüpheli lezyon saptanmadı.", time: "09:15" }
    ],
    images: [
      { id: "IMG-04", type: "Dermoskopik (10x)", area: "Sağ Ön Kol", date: "Dün", score: "0.12 (Düşük)", alert: false }
    ],
    labResults: [
      { test: "Tam Kan Sayımı", date: "Dün", result: "Parametreler Normal", status: "Normal" }
    ]
  },
  "S. Kaya": {
    id: "PT-2033",
    age: 29,
    gender: "Kadın",
    risk: 0.91,
    status: "3 gün önce",
    timeline: [
      { title: "Hızlı Büyüyen Lezyon", date: "3 gün önce", subtitle: "Sırt bölgesinde ülsere görünüm", progress: 15 },
    ],
    messages: [
      { role: "ai", text: "KRİTİK UYARI: S. Kaya'nın sırt bölgesindeki lezyonda ABCDE kriterlerinin 4'ü de pozitif. Acil biyopsi planlanması önerilir.", time: "11:40" }
    ],
    images: [
      { id: "IMG-05", type: "Dermoskopik (10x)", area: "Sırt Üst", date: "3 gün önce", score: "0.91 (Kritik)", alert: true },
      { id: "IMG-06", type: "Klinik Makro", area: "Sırt Üst", date: "3 gün önce", score: "0.85 (Kritik)", alert: true }
    ],
    labResults: [
      { test: "Punch Biyopsi", date: "Bekleniyor", result: "Laboratuvarda İşlemde", status: "Kritik" }
    ]
  }
};

export default function DermaPanel() {
  const [selectedPatient, setSelectedPatient] = useState("M. Yıldız");
  const [activeTab, setActiveTab] = useState("Özet"); 
  const [patientData, setPatientData] = useState(patientDatabase);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false); // AI yazıyor simülasyonu

  const currentPatient = patientData[selectedPatient];

  // CHATBOT CEVAP MOTORU (Yenilendi)
  const handleSend = () => {
    if (!input.trim() || isTyping) return;

    const userText = input.trim();
    const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const userMessage = { role: "user", text: userText, time: currentTime };

    // 1. Kullanıcı Mesajını Ekle
    setPatientData((prevData) => {
      const copyData = { ...prevData };
      const copyPatient = { ...copyData[selectedPatient] };
      copyPatient.messages = [...copyPatient.messages, userMessage];
      copyData[selectedPatient] = copyPatient;
      return copyData;
    });

    setInput("");
    setIsTyping(true); // "Yapay zeka düşünüyor..." durumunu aktif et

    // 2. AI Yanıt Simülasyonu (1 saniye gecikmeli çalışır)
    setTimeout(() => {
      const aiTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      
      // Hastanın risk durumuna göre dinamik akıllı cevap seçimi
      let aiText = `Anlaşılmıştır. Girilen '${userText}' parametresi sisteme işlendi. Hastanın klinik geçmişi ve güncel laboratuvar verileriyle çapraz sorgulama yapılıyor.`;
      
      if (copyDataRef().risk > 0.75) {
        aiText = `Kritik vaka uyarısı: Sorduğunuz "${userText}" konusu, hastanın yüksek risk skoru (${copyDataRef().risk}) ile doğrudan ilişkili olabilir. NovaVision lezyon kenar düzensizliği sınırlarını yeniden analiz ediyor. Lütfen gerekirse acil eksizyonel biyopsi endikasyonunu koruyun.`;
      } else if (copyDataRef().risk < 0.40) {
        aiText = `Sistem Bildirisi: Hastanın risk skoru düşük (${copyDataRef().risk}) ve stabil durumda. İlettiğiniz "${userText}" bilgisi kayıtlara eklendi. Rutin takip protokolünün dışına çıkılmasına şu aşamada gerek görülmemektedir.`;
      }

      const aiMessage = { role: "ai", text: aiText, time: aiTime };

      setPatientData((prevData) => {
        const copyData = { ...prevData };
        const copyPatient = { ...copyData[selectedPatient] };
        copyPatient.messages = [...copyPatient.messages, aiMessage];
        copyData[selectedPatient] = copyPatient;
        return copyData;
      });

      setIsTyping(false); // Yazma simülasyonunu bitir
    }, 1100);
  };

  // State'in anlık güncel haline erişmek için helper fonksiyon
  const copyDataRef = () => patientData[selectedPatient];

  const btnStyle = {
    backgroundColor: "transparent",
    border: "none",
    color: colors.textLo,
    padding: "6px 12px",
    cursor: "pointer",
    fontSize: "0.85rem",
    transition: "all 0.2s ease",
  };

  const btnStyleActive = {
    ...btnStyle,
    backgroundColor: colors.primary,
    color: "white",
    borderRadius: "6px",
  };

  return (
    <div
      style={{
        display: "flex",
        height: "100vh",
        backgroundColor: colors.mainBg,
        color: colors.textHi,
        fontFamily: "sans-serif",
      }}
    >
      {/* SOL SIDEBAR */}
      <aside
        style={{
          width: "240px",
          backgroundColor: colors.sidebar,
          borderRight: `1px solid ${colors.border}`,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div
          style={{
            padding: "20px",
            display: "flex",
            alignItems: "center",
            gap: "10px",
            fontSize: "1.2rem",
            fontWeight: "bold",
          }}
        >
          <div
            style={{
              padding: "5px",
              background: colors.primary,
              borderRadius: "6px",
              display: "flex",
              alignItems: "center",
            }}
          >
            <LayoutDashboard size={20} />
          </div>
          DERMA<span style={{ color: colors.primary }}>PANEL</span>
        </div>

        <nav style={{ flex: 1, padding: "10px" }}>
          <NavItem icon={<Users size={18} />} label="Hastalar" active count={3} />
          <NavItem icon={<Calendar size={18} />} label="Randevular" count={7} />
          <NavItem icon={<Archive size={18} />} label="Arşiv" />
          <NavItem icon={<Settings size={18} />} label="Ayarlar" />

          <div style={{ marginTop: "20px", padding: "0 10px" }}>
            <div style={{ position: "relative" }}>
              <Search
                size={14}
                style={{
                  position: "absolute",
                  left: "10px",
                  top: "10px",
                  color: colors.textLo,
                }}
              />
              <input
                placeholder="Hasta ara..."
                style={{
                  width: "100%",
                  padding: "8px 8px 8px 30px",
                  borderRadius: "8px",
                  border: "none",
                  backgroundColor: "#0f0f1a",
                  color: "white",
                  fontSize: "0.8rem",
                }}
              />
            </div>
          </div>

          <div style={{ marginTop: "20px" }}>
            <p style={{ fontSize: "0.7rem", color: colors.textLo, padding: "0 10px 10px" }}>
              BUGÜNKÜ LİSTE
            </p>
            {Object.keys(patientData).map((name) => (
              <PatientListItem
                key={name}
                name={name}
                id={patientData[name].id}
                status={patientData[name].status}
                active={selectedPatient === name}
                onClick={() => {
                  setSelectedPatient(name);
                  setActiveTab("Özet"); 
                }}
              />
            ))}
          </div>
        </nav>
      </aside>

      {/* ANA İÇERİK */}
      <main
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
      >
        {/* ÜST BAR */}
        <header
          style={{
            padding: "15px 25px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            borderBottom: `1px solid ${colors.border}`,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
            <div
              style={{
                width: "40px",
                height: "40px",
                borderRadius: "50%",
                backgroundColor: colors.border,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: "bold"
              }}
            >
              {selectedPatient.split('.').map(p => p.trim()[0]).join('')}
            </div>
            <div>
              <div style={{ fontWeight: "bold", fontSize: "1rem" }}>
                {selectedPatient}{" "}
                <span style={{ color: colors.textLo, fontSize: "0.8rem", fontWeight: "normal" }}>
                  {currentPatient.id}
                </span>
              </div>
              <div style={{ fontSize: "0.75rem", color: colors.textLo }}>
                {currentPatient.age} yaş · {currentPatient.gender} · Son muayene: {currentPatient.status}
              </div>
            </div>
            <div
              style={{
                marginLeft: "20px",
                padding: "4px 12px",
                backgroundColor: currentPatient.risk > 0.7 ? "#3b1a2a" : "#1a2e26",
                border: `1px solid ${currentPatient.risk > 0.7 ? colors.critical : colors.success}`,
                borderRadius: "20px",
                color: currentPatient.risk > 0.7 ? colors.critical : colors.success,
                fontSize: "0.75rem",
                display: "flex",
                alignItems: "center",
                gap: "5px",
              }}
            >
              <ShieldAlert size={14} /> PUQ.ai - {currentPatient.risk > 0.7 ? "Kritik" : "Stabil"} | Risk: {currentPatient.risk}
            </div>
          </div>
          <div style={{ display: "flex", gap: "10px" }}>
            <button onClick={() => setActiveTab("Özet")} style={activeTab === "Özet" ? btnStyleActive : btnStyle}>
              Özet
            </button>
            <button onClick={() => setActiveTab("Görüntüler")} style={activeTab === "Görüntüler" ? btnStyleActive : btnStyle}>
              Görüntüler
            </button>
            <button onClick={() => setActiveTab("Lab")} style={activeTab === "Lab" ? btnStyleActive : btnStyle}>
              Lab
            </button>
            <div style={{ width: "1px", backgroundColor: colors.border, margin: "0 10px" }} />
            <Bell size={20} style={{ color: colors.textLo, cursor: "pointer" }} />
            <LogOut size={20} style={{ color: colors.critical, cursor: "pointer" }} />
          </div>
        </header>

        {/* DİNAMİK İÇERİK ALANI */}
        <section
          style={{
            flex: 1,
            padding: "20px",
            overflowY: "auto",
            display: "flex",
            flexDirection: "column",
            gap: "20px",
          }}
        >
          {activeTab === "Özet" && (
            <>
              {/* TIBBİ GEÇMİŞ KARTI */}
              <div style={{ backgroundColor: colors.card, borderRadius: "12px", padding: "20px", border: `1px solid ${colors.border}` }}>
                <h3 style={{ fontSize: "0.9rem", color: colors.textLo, marginTop: 0, marginBottom: "15px" }}>HASTA KLİNİK GEÇMİŞİ</h3>
                {currentPatient.timeline.map((item, idx) => (
                  <TimelineItem key={idx} title={item.title} date={item.date} subtitle={item.subtitle} progress={item.progress} />
                ))}
              </div>

              {/* AI KARAR DESTEK (CHATBOT ALANI) */}
              <div style={{ flex: 1, backgroundColor: colors.card, borderRadius: "12px", border: `1px solid ${colors.border}`, display: "flex", flexDirection: "column", minHeight: "350px" }}>
                <div style={{ padding: "12px 20px", borderBottom: `1px solid ${colors.border}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", color: colors.primary }}>
                    <Microscope size={18} /> <b>PUQ.ai Karar Destek</b>{" "}
                    <span style={{ color: colors.textLo, fontSize: "0.7rem" }}>1.842 vaka indexlendi</span>
                  </div>
                  <MoreHorizontal size={18} color={colors.textLo} />
                </div>

                {/* Mesaj Listesi */}
                <div style={{ flex: 1, padding: "20px", display: "flex", flexDirection: "column", gap: "15px", overflowY: "auto" }}>
                  {currentPatient.messages.map((msg, i) => (
                    <div key={i} style={{ alignSelf: msg.role === "user" ? "flex-end" : "flex-start", maxWidth: "80%" }}>
                      <div style={{ padding: "12px 16px", borderRadius: "12px", fontSize: "0.85rem", lineHeight: "1.4", backgroundColor: msg.role === "user" ? colors.primary : "#252541", color: "white" }}>
                        {msg.text}
                      </div>
                      <div style={{ fontSize: "0.65rem", color: colors.textLo, marginTop: "4px", textAlign: msg.role === "user" ? "right" : "left" }}>
                        {msg.role === "ai" ? "PUQ.ai • " : "Sen • "} {msg.time}
                      </div>
                    </div>
                  ))}
                  
                  {/* AI Yazıyor... Simülasyon Efekti */}
                  {isTyping && (
                    <div style={{ alignSelf: "flex-start", maxWidth: "80%" }}>
                      <div style={{ padding: "10px 16px", borderRadius: "12px", fontSize: "0.85rem", backgroundColor: "#252541", color: colors.textLo, fontStyle: "italic" }}>
                        PUQ.ai analiz hazırlıyor...
                      </div>
                    </div>
                  )}
                </div>

                {/* INPUT GİRİŞ ALANI */}
                <div style={{ padding: "15px", borderTop: `1px solid ${colors.border}`, display: "flex", gap: "10px" }}>
                  <input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault(); 
                        handleSend();
                      }
                    }}
                    placeholder={isTyping ? "Sistem yanıtı bekleniyor..." : "Şikayet, soru veya komut yazın..."}
                    disabled={isTyping}
                    style={{ flex: 1, backgroundColor: "transparent", border: "none", color: "white", outline: "none", opacity: isTyping ? 0.5 : 1 }}
                  />
                  <button 
                    onClick={handleSend} 
                    disabled={isTyping}
                    style={{ backgroundColor: isTyping ? colors.border : colors.primary, padding: "8px 15px", borderRadius: "8px", border: "none", color: "white", display: "flex", alignItems: "center", gap: "5px", cursor: isTyping ? "not-allowed" : "pointer" }}
                  >
                    Gönder <Send size={14} />
                  </button>
                </div>
              </div>
            </>
          )}

          {activeTab === "Görüntüler" && (
            <div style={{ backgroundColor: colors.card, borderRadius: "12px", padding: "25px", border: `1px solid ${colors.border}` }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "20px" }}>
                <ImageIcon size={20} style={{ color: colors.accent }} />
                <h2 style={{ fontSize: "1.1rem", margin: 0 }}>NovaVision Multimodal Deri Görüntüleri</h2>
              </div>
              
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "20px" }}>
                {currentPatient.images.map((img) => (
                  <div key={img.id} style={{ backgroundColor: "#151525", borderRadius: "8px", border: `1px solid ${img.alert ? colors.critical : colors.border}`, padding: "15px" }}>
                    <div style={{ height: "160px", backgroundColor: "#0b0b14", borderRadius: "6px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "10px", border: `1px dashed ${colors.border}`, marginBottom: "12px", position: "relative" }}>
                      <Activity size={32} style={{ color: img.alert ? colors.critical : colors.textLo, opacity: 0.5 }} />
                      <span style={{ fontSize: "0.75rem", color: colors.textLo }}>{img.id} - GÖRSEL ANALİZİ</span>
                      {img.alert && (
                        <span style={{ position: "absolute", top: "8px", right: "8px", backgroundColor: colors.critical, color: "white", fontSize: "0.6rem", padding: "2px 6px", borderRadius: "4px", fontWeight: "bold" }}>
                          RİSKLİ
                        </span>
                      )}
                    </div>
                    <div style={{ fontSize: "0.85rem", fontWeight: "bold", marginBottom: "5px" }}>{img.type}</div>
                    <div style={{ fontSize: "0.75rem", color: colors.textLo, display: "flex", justifyContent: "space-between" }}>
                      <span>Bölge: {img.area}</span>
                      <span>{img.date}</span>
                    </div>
                    <div style={{ marginTop: "10px", paddingTop: "10px", borderTop: `1px solid ${colors.border}`, fontSize: "0.75rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span style={{ color: colors.textLo }}>Asimetri Skoru:</span>
                      <span style={{ fontWeight: "bold", color: img.alert ? colors.critical : colors.success }}>{img.score}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "Lab" && (
            <div style={{ backgroundColor: colors.card, borderRadius: "12px", padding: "25px", border: `1px solid ${colors.border}` }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "20px" }}>
                <FileText size={20} style={{ color: colors.primary }} />
                <h2 style={{ fontSize: "1.1rem", margin: 0 }}>Laboratuvar ve Patoloji Raporları</h2>
              </div>

              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.85rem", textAlign: "left" }}>
                <thead>
                  <tr style={{ borderBottom: `2px solid ${colors.border}`, color: colors.textLo }}>
                    <th style={{ padding: "12px 8px" }}>Tetkik / Parametre</th>
                    <th style={{ padding: "12px 8px" }}>Tarih</th>
                    <th style={{ padding: "12px 8px" }}>Sonuç / Bulgular</th>
                    <th style={{ padding: "12px 8px" }}>Durum</th>
                  </tr>
                </thead>
                <tbody>
                  {currentPatient.labResults.map((lab, index) => (
                    <tr key={index} style={{ borderBottom: `1px solid ${colors.border}` }}>
                      <td style={{ padding: "14px 8px", fontWeight: "bold" }}>{lab.test}</td>
                      <td style={{ padding: "14px 8px", color: colors.textLo }}>{lab.date}</td>
                      <td style={{ padding: "14px 8px", color: colors.textHi }}>{lab.result}</td>
                      <td style={{ padding: "14px 8px" }}>
                        <span style={{
                          padding: "3px 8px",
                          borderRadius: "4px",
                          fontSize: "0.75rem",
                          fontWeight: "bold",
                          backgroundColor: lab.status === "Normal" || lab.status === "Güvenli" ? "#142e22" : "#3c1b25",
                          color: lab.status === "Normal" || lab.status === "Güvenli" ? colors.success : colors.critical
                        }}>
                          {lab.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        {/* ALT DURUM ÇUBUĞU */}
        <footer
          style={{
            padding: "8px 20px",
            borderTop: `1px solid ${colors.border}`,
            fontSize: "0.7rem",
            color: colors.textLo,
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", gap: "15px" }}>
            <span>● NovaVision v2.4 aktif</span>
            <span>● PUQ.ai onay bekliyor</span>
          </div>
          <div>Oturum: SES-8821 | HIPAA & KVKK Uyumlu</div>
        </footer>
      </main>
    </div>
  );
}

// YARDIMCI BİLEŞENLER
const NavItem = ({ icon, label, count, active = false }) => (
  <div
    style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "10px",
      borderRadius: "8px",
      cursor: "pointer",
      backgroundColor: active ? "#2d2d4d" : "transparent",
      color: active ? colors.primary : colors.textHi,
      marginBottom: "4px",
    }}
  >
    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
      {icon} {label}
    </div>
    {count && (
      <span
        style={{
          fontSize: "0.7rem",
          backgroundColor: colors.border,
          padding: "2px 6px",
          borderRadius: "4px",
          color: "white"
        }}
      >
        {count}
      </span>
    )}
  </div>
);

const PatientListItem = ({ name, id, status, active = false, onClick }) => (
  <div
    onClick={onClick}
    style={{
      padding: "10px",
      borderRadius: "8px",
      cursor: "pointer",
      backgroundColor: active ? "#252541" : "transparent",
      border: active ? `1px solid ${colors.primary}` : "1px solid transparent",
      marginBottom: "5px",
      transition: "all 0.2s ease",
    }}
  >
    <div style={{ fontSize: "0.85rem", fontWeight: "bold", color: colors.textHi }}>{name}</div>
    <div style={{ fontSize: "0.7rem", color: colors.textLo }}>
      {id} · {status}
    </div>
  </div>
);

const TimelineItem = ({ title, date, subtitle, progress }) => (
  <div style={{ marginBottom: "15px" }}>
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        fontSize: "0.8rem",
        marginBottom: "5px",
      }}
    >
      <span>
        {title} <br />{" "}
        <small style={{ color: colors.textLo }}>{subtitle}</small>
      </span>
      <span style={{ color: colors.textLo }}>{date}</span>
    </div>
    <div style={{ height: "4px", backgroundColor: "#13131f", borderRadius: "2px" }}>
      <div
        style={{
          width: `${progress}%`,
          height: "100%",
          backgroundColor: colors.primary,
          borderRadius: "2px",
        }}
      />
    </div>
  </div>
);