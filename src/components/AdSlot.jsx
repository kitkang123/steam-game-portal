import React, { useEffect } from 'react';

export default function AdSlot({ 
  adSlot, 
  adFormat = 'auto', 
  fullWidthResponsive = 'true', 
  layout = 'horizontal', 
  style = {} 
}) {
  const adClient = 'ca-pub-4561141525427286';

  useEffect(() => {
    // Only try to push ads if running in production or environment where adsbygoogle is defined
    if (typeof window !== 'undefined') {
      try {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      } catch (e) {
        // Suppress errors during development/testing
        console.debug('AdSense script initialization ignored or pending script load.');
      }
    }
  }, [adSlot]);

  // Determine size/styling based on layout type
  const getLayoutStyles = () => {
    switch (layout) {
      case 'horizontal':
        return { minHeight: '90px', width: '100%', ...style };
      case 'sidebar':
        return { minHeight: '250px', width: '100%', ...style };
      case 'in-feed':
        return { minHeight: '120px', width: '100%', ...style };
      default:
        return { minHeight: '90px', width: '100%', ...style };
    }
  };

  const getLayoutLabel = () => {
    switch (layout) {
      case 'horizontal':
        return 'Leaderboard Ad Unit (Responsive)';
      case 'sidebar':
        return 'Sidebar Ad Unit (300 x 250 / 600)';
      case 'in-feed':
        return 'In-Feed Native Ad Unit';
      default:
        return 'Responsive Ad Unit';
    }
  };

  return (
    <div className="ad-container" style={{ margin: '20px 0', width: '100%' }}>
      {/* Google AdSense ins tag */}
      <ins 
        className="adsbygoogle"
        style={{ display: 'block', ...getLayoutStyles() }}
        data-ad-client={adClient}
        data-ad-slot={adSlot || '1234567890'} // Fallback placeholder slot
        data-ad-format={adFormat}
        data-full-width-responsive={fullWidthResponsive}
      />
      
      {/* Dev-only overlay / preview placeholder when the ad is not loading */}
      <div className="ad-slot-placeholder" style={getLayoutStyles()}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem' }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect width="20" height="20" x="2" y="2" rx="2" />
            <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
          </svg>
          <span>{getLayoutLabel()}</span>
        </div>
        <div style={{ fontSize: '0.65rem', marginTop: '4px', opacity: 0.6 }}>
          Google AdSense Client: {adClient} {adSlot ? `| Slot: ${adSlot}` : ''}
        </div>
      </div>
    </div>
  );
}
