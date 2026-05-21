import React, { useState } from 'react';

export default function GameCard({ game }) {
  const [activeTab, setActiveTab] = useState('highlights'); // highlights | beginner | full

  // Retrieve partner token from Vite environment variables
  const partnerToken = import.meta.env.VITE_HUMBLE_PARTNER || 'gameportal';
  
  // Construct Humble Bundle Affiliate URL
  const humbleSearchUrl = `https://www.humblebundle.com/store/search?search=${encodeURIComponent(game.title)}&partner=${partnerToken}`;

  // Get color variables based on rank
  const getRankBadgeStyles = (rank) => {
    switch (rank) {
      case 1:
        return { background: 'linear-gradient(135deg, #ffd700 0%, #ff8c00 100%)', color: '#000', boxShadow: '0 0 15px rgba(255, 215, 0, 0.4)' };
      case 2:
        return { background: 'linear-gradient(135deg, #e0e0e0 0%, #a0a0a0 100%)', color: '#000', boxShadow: '0 0 15px rgba(224, 224, 224, 0.3)' };
      case 3:
        return { background: 'linear-gradient(135deg, #cd7f32 0%, #8b4513 100%)', color: '#fff', boxShadow: '0 0 15px rgba(205, 127, 50, 0.3)' };
      default:
        return { background: 'linear-gradient(135deg, var(--color-cyan) 0%, var(--color-purple) 100%)', color: '#fff', boxShadow: '0 0 10px rgba(0, 242, 254, 0.2)' };
    }
  };

  const { review } = game;

  return (
    <div className="glass-panel game-card animate-fade-in" style={styles.card}>
      {/* Rank Badge */}
      <div className="rank-badge" style={{ ...styles.rankBadge, ...getRankBadgeStyles(game.rank) }}>
        TOP {game.rank}
      </div>

      <div style={styles.layout}>
        {/* Left Column: Game Image & Prices */}
        <div style={styles.leftCol}>
          <div style={styles.imageContainer}>
            <img src={game.imageUrl} alt={game.title} style={styles.image} />
            {game.discountPercent && (
              <div style={styles.discountTag}>{game.discountPercent}</div>
            )}
          </div>
          
          <div style={styles.priceContainer}>
            {game.originalPrice && game.originalPrice !== game.currentPrice && (
              <span style={styles.originalPrice}>{game.originalPrice}</span>
            )}
            <span style={styles.currentPrice}>{game.currentPrice}</span>
          </div>

          <div style={styles.buttonGroup}>
            {/* Humble Bundle Affiliate Button */}
            <a 
              href={humbleSearchUrl} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="glow-purple"
              style={{ ...styles.btn, ...styles.btnHumble }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '6px' }}>
                <circle cx="9" cy="21" r="1" />
                <circle cx="20" cy="21" r="1" />
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
              </svg>
              Humble Bundle 优惠
            </a>
            
            {/* Steam Link */}
            <a 
              href={game.url} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="glow-cyan"
              style={{ ...styles.btn, ...styles.btnSteam }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '6px' }}>
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6M15 3h6v6M10 14 21 3" />
              </svg>
              Steam 商店页
            </a>
          </div>
        </div>

        {/* Right Column: Title & Article Content Tabs */}
        <div style={styles.rightCol}>
          <h2 style={styles.title}>{game.title}</h2>
          
          {/* Tabs Navigation */}
          <div style={styles.tabNav}>
            <button 
              onClick={() => setActiveTab('highlights')} 
              style={{ 
                ...styles.tabBtn, 
                ...(activeTab === 'highlights' ? styles.tabBtnActive : {}),
                borderColor: activeTab === 'highlights' ? 'var(--color-cyan)' : 'transparent' 
              }}
            >
              玩法亮点
            </button>
            <button 
              onClick={() => setActiveTab('beginner')} 
              style={{ 
                ...styles.tabBtn, 
                ...(activeTab === 'beginner' ? styles.tabBtnActive : {}),
                borderColor: activeTab === 'beginner' ? 'var(--color-pink)' : 'transparent' 
              }}
            >
              新手避坑
            </button>
            <button 
              onClick={() => setActiveTab('full')} 
              style={{ 
                ...styles.tabBtn, 
                ...(activeTab === 'full' ? styles.tabBtnActive : {}),
                borderColor: activeTab === 'full' ? 'var(--color-purple)' : 'transparent' 
              }}
            >
              300字精选攻略
            </button>
          </div>

          {/* Tab Content Panels */}
          <div style={styles.tabContent}>
            {activeTab === 'highlights' && (
              <div style={styles.panel}>
                <h4 style={{ ...styles.sectionTitle, color: 'var(--color-cyan)' }}>🎮 核心特色玩法</h4>
                <ul style={styles.list}>
                  {review.gameplayHighlights.map((highlight, i) => (
                    <li key={i} style={styles.listItem}>
                      <span style={{ color: 'var(--color-cyan)', marginRight: '8px', fontWeight: 'bold' }}>✓</span>
                      {highlight}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {activeTab === 'beginner' && (
              <div style={styles.panel}>
                <div style={styles.warningBox}>
                  <strong style={{ color: 'var(--color-pink)', display: 'block', marginBottom: '4px' }}>🥵 新手最痛点：</strong>
                  <p style={{ fontSize: '0.9rem', color: '#e5e7eb' }}>{review.beginnerHeadache}</p>
                </div>
                <div style={styles.successBox}>
                  <strong style={{ color: 'var(--color-green)', display: 'block', marginBottom: '4px' }}>💡 完美解决方案：</strong>
                  <p style={{ fontSize: '0.9rem', color: '#e5e7eb' }}>{review.beginnerSolution}</p>
                </div>
              </div>
            )}

            {activeTab === 'full' && (
              <div style={styles.panel}>
                <p style={styles.articleText}>{review.summaryArticle}</p>
                <div style={styles.endingBox}>
                  <span style={styles.endingBadge}>总结</span>
                  <span style={{ fontSize: '0.85rem', fontStyle: 'italic', color: '#d1d5db' }}>{review.endingCTA}</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  card: {
    padding: '24px',
    marginBottom: '32px',
    position: 'relative',
    overflow: 'hidden',
  },
  rankBadge: {
    position: 'absolute',
    top: '0',
    left: '0',
    padding: '6px 16px',
    fontSize: '0.85rem',
    fontWeight: '800',
    borderBottomRightRadius: '12px',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
  },
  layout: {
    display: 'flex',
    flexDirection: 'row',
    gap: '24px',
    marginTop: '10px',
    flexWrap: 'wrap',
  },
  leftCol: {
    flex: '1 1 300px',
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  imageContainer: {
    position: 'relative',
    borderRadius: '12px',
    overflow: 'hidden',
    border: '1px solid rgba(255,255,255,0.06)',
    aspectRatio: '460 / 215',
  },
  image: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    transition: 'transform 0.5s ease',
  },
  discountTag: {
    position: 'absolute',
    bottom: '8px',
    right: '8px',
    background: 'var(--color-pink)',
    color: '#fff',
    padding: '2px 8px',
    borderRadius: '4px',
    fontWeight: 'bold',
    fontSize: '0.85rem',
    boxShadow: '0 2px 8px rgba(255, 42, 95, 0.4)',
  },
  priceContainer: {
    display: 'flex',
    alignItems: 'baseline',
    gap: '10px',
  },
  originalPrice: {
    textDecoration: 'line-through',
    color: 'var(--text-muted)',
    fontSize: '0.95rem',
  },
  currentPrice: {
    color: 'var(--color-green)',
    fontSize: '1.4rem',
    fontWeight: '700',
  },
  buttonGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  btn: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '12px 16px',
    borderRadius: '8px',
    textDecoration: 'none',
    fontWeight: '600',
    fontSize: '0.9rem',
    transition: 'var(--transition-smooth)',
    cursor: 'pointer',
  },
  btnHumble: {
    background: 'linear-gradient(135deg, var(--color-purple) 0%, #bdc3c7 100%)',
    background: '#7c1c22', // Humble red-brown
    color: '#fff',
    border: '1px solid rgba(255,255,255,0.1)',
  },
  btnSteam: {
    background: 'rgba(255,255,255,0.04)',
    color: '#fff',
    border: '1px solid rgba(255,255,255,0.1)',
  },
  rightCol: {
    flex: '2 2 450px',
    display: 'flex',
    flexDirection: 'column',
  },
  title: {
    fontSize: '1.8rem',
    fontWeight: '700',
    marginBottom: '16px',
    color: '#fff',
  },
  tabNav: {
    display: 'flex',
    borderBottom: '1px solid rgba(255,255,255,0.08)',
    marginBottom: '16px',
    gap: '8px',
    overflowX: 'auto',
  },
  tabBtn: {
    background: 'transparent',
    border: 'none',
    borderBottom: '3px solid transparent',
    color: 'var(--text-secondary)',
    padding: '8px 16px',
    cursor: 'pointer',
    fontFamily: 'var(--font-heading)',
    fontWeight: '600',
    fontSize: '0.95rem',
    transition: 'var(--transition-smooth)',
    whiteSpace: 'nowrap',
  },
  tabBtnActive: {
    color: '#fff',
  },
  tabContent: {
    flex: '1',
    display: 'flex',
    flexDirection: 'column',
  },
  panel: {
    animation: 'fadeInUp 0.3s ease-out forwards',
  },
  sectionTitle: {
    fontSize: '1rem',
    fontWeight: '600',
    marginBottom: '12px',
  },
  list: {
    listStyle: 'none',
  },
  listItem: {
    fontSize: '0.95rem',
    lineHeight: '1.6',
    color: '#e5e7eb',
    marginBottom: '10px',
    display: 'flex',
    alignItems: 'flex-start',
  },
  warningBox: {
    background: 'rgba(255, 42, 95, 0.06)',
    borderLeft: '4px solid var(--color-pink)',
    padding: '12px 16px',
    borderRadius: '0 8px 8px 0',
    marginBottom: '12px',
  },
  successBox: {
    background: 'rgba(5, 196, 107, 0.06)',
    borderLeft: '4px solid var(--color-green)',
    padding: '12px 16px',
    borderRadius: '0 8px 8px 0',
  },
  articleText: {
    fontSize: '0.95rem',
    lineHeight: '1.7',
    color: '#e5e7eb',
    textAlign: 'justify',
    marginBottom: '16px',
  },
  endingBox: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '8px',
    background: 'rgba(255,255,255,0.02)',
    padding: '10px 14px',
    borderRadius: '8px',
    border: '1px solid rgba(255,255,255,0.04)',
  },
  endingBadge: {
    background: 'var(--grad-primary)',
    color: '#000',
    fontWeight: '700',
    fontSize: '0.7rem',
    padding: '2px 6px',
    borderRadius: '4px',
    textTransform: 'uppercase',
    alignSelf: 'center',
  }
};
