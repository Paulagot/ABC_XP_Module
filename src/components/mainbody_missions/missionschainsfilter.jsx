import React from "react";

function Mission_Chain_Filter({ chains = [], activeFilter, onFilterSelect }) {
    return (
        <div className="container_chain-filter">
            {chains.map((chain) => (
                <div
                    key={chain.chain_id}
                    className={`chain_filter ${activeFilter === chain.chain_id ? "active" : ""}`}
                    onClick={() => onFilterSelect(chain.chain_id)} // Filter by chain ID
                >
                    <img 
                        src={chain.chain_image} 
                        alt={chain.name} 
                        className="chain-image" 
                        style={{ width: '50px', height: '50px', borderRadius: '50%' }} 
                    />
                </div>
            ))}
        </div>
    );
}

export default Mission_Chain_Filter;





