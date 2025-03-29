import React, { useState, useEffect } from 'react';

import { sampleCampaigns } from './SampleData';
  


const Earn = () => {
  // State for wallet connection
  const [walletConnected, setWalletConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState('');
  
  // State for campaign data
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // State for active tab
  const [activeTab, setActiveTab] = useState('eligible');
  
  // State for pagination
  const [currentPage, setCurrentPage] = useState(1);
  const campaignsPerPage = 4;

  // Mock function to connect wallet - replace with your actual wallet connection logic
  const connectWallet = async () => {
    try {
      // This would be your actual wallet connection code
      // For example, with MetaMask or other Web3 provider
      setWalletConnected(true);
      setWalletAddress('0x1234...5678'); // This would be the actual wallet address
    } catch (error) {
      console.error('Error connecting wallet:', error);
    }
  };

  // Inside your component
useEffect(() => {
  // For development/testing
  setCampaigns(sampleCampaigns);
  setLoading(false);
  
  // For production with real API
  // const fetchCampaigns = async () => {...}
  // fetchCampaigns();
}, []);

  // Fetch campaigns from API
  useEffect(() => {
    const fetchCampaigns = async () => {
      setLoading(true);
      try {
        // Replace with your actual API endpoint
        const response = await fetch('api/campaigns');
        const data = await response.json();
        setCampaigns(data);
      } catch (error) {
        console.error('Error fetching campaigns:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCampaigns();
  }, []);

  // Filter campaigns based on active tab
  const filteredCampaigns = campaigns.filter(campaign => {
    if (activeTab === 'eligible') {
      return campaign.isEligible && !campaign.isEnded;
    } else if (activeTab === 'non-eligible') {
      return !campaign.isEligible && !campaign.isEnded;
    } else {
      return campaign.isEnded;
    }
  });

  // Get current campaigns for pagination
  const indexOfLastCampaign = currentPage * campaignsPerPage;
  const indexOfFirstCampaign = indexOfLastCampaign - campaignsPerPage;
  const currentCampaigns = filteredCampaigns.slice(indexOfFirstCampaign, indexOfLastCampaign);

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <main className="container__right" id="main">
    <div className="earn-page-container">
      {/* Wallet Connection Status */}
      <div className="wallet-status-container">
        <div className="wallet-status-info">
          <h3>Wallet Status:</h3>
          {walletConnected ? (
            <span className="wallet-connected">{walletAddress}</span>
          ) : (
            <span className="wallet-not-connected">Not Connected</span>
          )}
        </div>
        {!walletConnected && (
          <button className="connect-wallet-button" onClick={connectWallet}>
            Connect Wallet
          </button>
        )}
      </div>

      {/* Campaign Filter Tabs */}
      <div className="campaign-tabs">
        <button 
          className={`tab ${activeTab === 'eligible' ? 'active' : ''}`}
          onClick={() => {
            setActiveTab('eligible');
            setCurrentPage(1);
          }}
        >
          Eligible Campaigns
        </button>
        <button 
          className={`tab ${activeTab === 'non-eligible' ? 'active' : ''}`}
          onClick={() => {
            setActiveTab('non-eligible');
            setCurrentPage(1);
          }}
        >
          Non-Eligible Campaigns
        </button>
        <button 
          className={`tab ${activeTab === 'ended' ? 'active' : ''}`}
          onClick={() => {
            setActiveTab('ended');
            setCurrentPage(1);
          }}
        >
          Ended Campaigns
        </button>
      </div>

      {/* Campaign Cards */}
      {loading ? (
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading campaigns...</p>
        </div>
      ) : (
        <div className="campaigns-container">
          {currentCampaigns.length > 0 ? (
            currentCampaigns.map((campaign) => (
              <div 
                key={campaign.id} 
                className={`campaign-card ${!campaign.isEligible || campaign.isEnded ? 'disabled' : ''}`}
              >
                <div className="campaign-header">
                  <div className="campaign-logo" style={{ backgroundColor: campaign.logoBackground || '#f1c40f1a' }}>
                    {campaign.logoUrl ? (
                      <img src={campaign.logoUrl} alt={`${campaign.name} logo`} />
                    ) : (
                      <span>LOGO</span>
                    )}
                  </div>
                  <h3 className="campaign-title">{campaign.name}</h3>
                </div>
                
                <div className="campaign-details">
                  <div className="campaign-criteria">
                    <span className="label">Criteria:</span>
                    <span className="value">{campaign.criteria}</span>
                  </div>
                  
                  <div className="campaign-reward">
                    <span className="label">Reward:</span>
                    <div className="points-display">
                      <div className="points-icon"></div>
                      <span className="points-value">{campaign.points} Points</span>
                    </div>
                  </div>
                  
                  <button 
                    className={`campaign-action-button ${!campaign.isEligible ? 'not-eligible' : campaign.isEnded ? 'ended' : ''}`}
                    disabled={!campaign.isEligible || campaign.isEnded || !walletConnected}
                    onClick={() => {
                      if (campaign.isEligible && !campaign.isEnded && walletConnected) {
                        window.open(campaign.actionUrl, '_blank');
                      }
                    }}
                  >
                    {campaign.isEligible 
                      ? (campaign.isEnded ? 'Ended' : 'Participate') 
                      : 'Not Eligible'}
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="no-campaigns">
              <p>No {activeTab.replace('-', ' ')} campaigns available at this time.</p>
            </div>
          )}
        </div>
      )}

      {/* Pagination */}
      {filteredCampaigns.length > campaignsPerPage && (
        <div className="pagination">
          {Array.from({ length: Math.ceil(filteredCampaigns.length / campaignsPerPage) }, (_, i) => (
            <button
              key={i}
              className={`page-number ${currentPage === i + 1 ? 'active' : ''}`}
              onClick={() => paginate(i + 1)}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}
    </div>
    </main>
  );
};


export default Earn;