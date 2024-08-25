import React from 'react';

const ChainSelection = ({ chainData, selectedChain = '', handleChainChange }) => {
  return (
    <div id="chainSelectionMissions">
      <label htmlFor="includeChain">Chain:</label>
      <select
        name="includeChain"
        id="includeChain"
        value={selectedChain}
        onChange={handleChainChange}
      >
        <option value="" disabled>Select your option</option>
        {chainData.map((chain) => (
          <option key={chain.chain_id} value={chain.chain_id}>
            {chain.name}
          </option>
        ))}
        <option value="null">None</option> {/* Add None option */}
      </select>
    </div>
  );
};

export default ChainSelection;

