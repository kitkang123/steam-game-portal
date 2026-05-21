import React, { useState, useEffect } from 'react';
import currentData from './data/current.json';
import historyData from './data/history.json';
import GameCard from './components/GameCard';
import AdSlot from './components/AdSlot';

export default function App() {
  const [selectedWeek, setSelectedWeek] = useState('');
  const [weeksList, setWeeksList] = useState([]);
  const [activeWeekData, setActiveWeekData] = useState(null);

  useEffect(() => {
    // Read list of weeks from history
    if (historyData && historyData.length > 0) {
      setWeeksList(historyData);
      setSelectedWeek(historyData[0].weekId); // Default to latest week
      setActiveWeekData(historyData[0]);
    } else if (currentData) {
      // Fallback to currentData if history is empty
      setWeeksList([currentData]);
      setSelectedWeek(currentData.weekId);
      setActiveWeekData(currentData);
    }
  }, []);

  const handleWeekChange = (weekId) => {
    setSelectedWeek(weekId);
    const found = weeksList.find(w => w.weekId === weekId);
    if (found) {
      setActiveWeekData(found);
    }
  };

  if (!activeWeekData) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <div style={{ color: 'var(--color-cyan)', fontSize: '1.2rem', fontFamily: 'var(--font-heading)' }}>
          Loading Strategy Portal...
        </div>
      </div>
    );
  }

  // Format date display
  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  return (
    <div>
      {/* Header Grid Banner Background */}
      <header style={styles.header}>
        <div style={styles.glowOverlay}></div>
        <div className="container" style={styles.headerContainer}>
          <div style={styles.badge}>
            <span style={styles.badgePulse}></span>
            AI WEEKLY WORKFLOW
          </div>
          <h1 style={styles.headerTitle}>
            STEAM <span className="text-gradient">週熱銷榜攻略</span>
          </h1>
          <p style={styles.headerSubtitle}>
            每週自动抓取 Steam 最畅销大作，使用先进的 AI 技术撰写深度亮点解析、新手避坑生存指南，并推荐超值优惠！
          </p>
        </div>
      </header>

      {/* Main Content Layout */}
      <main className="container" style={styles.mainLayout}>
        {/* Left Column: Game list & Content */}
        <section style={styles.contentCol}>
          {/* Week Selector Bar */}
          <div className="glass-panel" style={styles.selectorBar}>
            <div style={styles.selectorInfo}>
              <span style={styles.selectorLabel}>榜单排行周期:</span>
              <select 
                value={selectedWeek} 
                onChange={(e) => handleWeekChange(e.target.value)}
                style={styles.selectInput}
              >
                {weeksList.map(w => (
                  <option key={w.weekId} value={w.weekId}>
                    周榜: {w.weekId} ({formatDate(w.date)})
                  </option>
                ))}
              </select>
            </div>
            
            <div style={styles.updateBadge}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--color-cyan)" strokeWidth="2.5" style={{ marginRight: '6px' }}>
                <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67" />
              </svg>
              每週日自動更新
            </div>
          </div>

          {/* Ad Slot: Header Leaderboard */}
          <AdSlot adSlot="8845612345" layout="horizontal" />

          {/* Top 5 Games List */}
          <div style={styles.gamesList}>
            {activeWeekData.games.map((game, index) => (
              <React.Fragment key={game.appid}>
                <GameCard game={game} />
                
                {/* Insert an In-Feed Ad after Game #2 */}
                {index === 1 && (
                  <AdSlot adSlot="2234567890" layout="in-feed" />
                )}
              </React.Fragment>
            ))}
          </div>

          {/* Ad Slot: Bottom Leaderboard */}
          <AdSlot adSlot="9945612345" layout="horizontal" />
        </section>

        {/* Right Column: Sidebar */}
        <aside style={styles.sidebarCol}>
          {/* About Widget */}
          <div className="glass-panel" style={styles.sidebarWidget}>
            <h3 style={styles.widgetTitle}>🤖 关于本站</h3>
            <p style={styles.widgetText}>
              这是一个全自动部署的游戏攻略门户。我们通过脚本每周抓取 Steam 官方畅销榜，提取玩家最关心的核心信息。
            </p>
            <p style={styles.widgetText}>
              我们使用 <strong>Google Gemini API</strong> 高效提炼游戏核心亮点，并直击新手痛点，帮助您快速上手，少走弯路。
            </p>
          </div>

          {/* Ad Slot: Sidebar Banner */}
          <AdSlot adSlot="3345612345" layout="sidebar" />

          {/* Partners Widget */}
          <div className="glass-panel" style={styles.sidebarWidget}>
            <h3 style={styles.widgetTitle}>🛒 合作推广项目</h3>
            <p style={styles.widgetText}>
              点击本站的 <strong>Humble Bundle</strong> 按钮购买游戏，您不仅可以获得超值史低折扣或大礼包，还能间接支持本站的运营与维护。
            </p>
            <p style={{ ...styles.widgetText, fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              * Humble Bundle 合作伙伴计划将把部分收益分成捐给慈善机构或返给网站主。
            </p>
          </div>
        </aside>
      </main>

      {/* Footer */}
      <footer style={styles.footer}>
        <div className="container" style={styles.footerContainer}>
          <p>© 2026 Steam Game Strategy Portal. Powered by Google Gemini AI & GitHub Actions.</p>
          <p style={{ fontSize: '0.8rem', marginTop: '6px', color: 'var(--text-muted)' }}>
            本站为 Steam 游戏攻略聚合站，所有游戏版权及图片归原开发商和 Valve 所有。
          </p>
        </div>
      </footer>
    </div>
  );
}

const styles = {
  header: {
    position: 'relative',
    padding: '60px 0 50px 0',
    background: 'rgba(24, 25, 34, 0.4)',
    borderBottom: '1px solid rgba(255,255,255,0.05)',
    textAlign: 'center',
    overflow: 'hidden',
  },
  glowOverlay: {
    position: 'absolute',
    top: '-50%',
    left: '50%',
    transform: 'translateX(-50%)',
    width: '600px',
    height: '300px',
    background: 'radial-gradient(ellipse, rgba(0, 242, 254, 0.12) 0%, rgba(155, 81, 224, 0.05) 50%, transparent 100%)',
    pointerEvents: 'none',
    zIndex: 0,
  },
  headerContainer: {
    position: 'relative',
    zIndex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  badge: {
    background: 'rgba(0, 242, 254, 0.08)',
    border: '1px solid rgba(0, 242, 254, 0.2)',
    color: 'var(--color-cyan)',
    padding: '6px 14px',
    borderRadius: '20px',
    fontSize: '0.75rem',
    fontWeight: '800',
    letterSpacing: '0.1em',
    marginBottom: '16px',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
  },
  badgePulse: {
    width: '6px',
    height: '6px',
    background: 'var(--color-cyan)',
    borderRadius: '50%',
    boxShadow: '0 0 8px var(--color-cyan)',
    animation: 'pulse-glow 2s infinite',
  },
  headerTitle: {
    fontSize: '2.6rem',
    fontWeight: '800',
    marginBottom: '16px',
    letterSpacing: '-0.02em',
  },
  headerSubtitle: {
    color: 'var(--text-secondary)',
    fontSize: '1.05rem',
    maxWidth: '700px',
    lineHeight: '1.6',
  },
  mainLayout: {
    display: 'flex',
    flexDirection: 'row',
    gap: '32px',
    paddingTop: '32px',
    paddingBottom: '60px',
    flexWrap: 'wrap',
  },
  contentCol: {
    flex: '3 3 650px',
    display: 'flex',
    flexDirection: 'column',
  },
  sidebarCol: {
    flex: '1 1 280px',
    display: 'flex',
    flexDirection: 'column',
    gap: '24px',
  },
  selectorBar: {
    padding: '16px 20px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: '16px',
    marginBottom: '12px',
  },
  selectorInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  selectorLabel: {
    fontSize: '0.9rem',
    fontWeight: '600',
    color: 'var(--text-secondary)',
  },
  selectInput: {
    background: 'rgba(0,0,0,0.4)',
    border: '1px solid rgba(255,255,255,0.1)',
    color: '#fff',
    padding: '8px 16px',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '0.9rem',
    outline: 'none',
    fontFamily: 'var(--font-heading)',
    fontWeight: '500',
  },
  updateBadge: {
    display: 'flex',
    alignItems: 'center',
    fontSize: '0.85rem',
    color: 'var(--text-secondary)',
    background: 'rgba(255,255,255,0.02)',
    padding: '6px 12px',
    borderRadius: '6px',
    border: '1px solid rgba(255,255,255,0.05)',
  },
  gamesList: {
    display: 'flex',
    flexDirection: 'column',
  },
  sidebarWidget: {
    padding: '24px',
  },
  widgetTitle: {
    fontSize: '1.1rem',
    fontWeight: '700',
    marginBottom: '14px',
    color: '#fff',
    borderBottom: '2px solid rgba(255,255,255,0.04)',
    paddingBottom: '8px',
  },
  widgetText: {
    fontSize: '0.9rem',
    lineHeight: '1.6',
    color: 'var(--text-secondary)',
    marginBottom: '12px',
  },
  footer: {
    borderTop: '1px solid rgba(255,255,255,0.05)',
    padding: '40px 0',
    background: '#08080c',
    textAlign: 'center',
  },
  footerContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    color: 'var(--text-secondary)',
    fontSize: '0.9rem',
  }
};
