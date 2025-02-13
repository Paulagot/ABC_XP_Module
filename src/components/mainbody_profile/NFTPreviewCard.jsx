import React from 'react';

const NFTPreviewCard = ({ nftPreviewTemplate, categoryName }) => {
  return (
    <div className="relative w-full h-full">
      {/* Base card content
      <div
        className={`nft-preview-card ${nftPreviewTemplate.backgroundColor} ${nftPreviewTemplate.borderStyle}`}
      >
        <div className="nft-preview-actions">
          <button type="button" className="nft-action-button">
            {categoryName === "Blockchain" ? "View on Chain" : "Add Certificate to Wallet"}
          </button>
        </div>
        <h3 className="nft-preview-title">Certificate Details Preview</h3>
        <div className="nft-preview-details">
          {nftPreviewTemplate.overlayDetails.map((detail, idx) => (
            <div key={idx} className="nft-detail-row">
              <span className="nft-detail-label">{detail.label}:</span>
              <span className="nft-detail-value">{detail.value}</span>
            </div>
          ))}
        </div>
      </div> */}

      {/* Overlay image with transparency */}
      <div className="replace-image">
        <img className='soon-image'
          src="/on-chain-certificates-soon.webp" 
          alt="On-Chain Certificates Coming Soon"
         
        />
      </div>
    </div>
  );
};

export default NFTPreviewCard;