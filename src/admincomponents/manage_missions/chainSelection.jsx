import React from 'react';
/**
 * ChainSelection Component
 * 
 * This component is responsible for rendering a dropdown selection for chains.
 * 
 * Props:
 * - chainData: Array of chain objects to populate the dropdown options.
 * - selectedChain: The currently selected chain ID.
 * - handleChainChange: Function to handle the selection change.
 */

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
        <option value="null">None</option> {/* None option remains */}
      </select>
    </div>
  );
};

export default ChainSelection;



