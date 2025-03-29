// This is a sample data file to demonstrate the structure
// of the campaign data that would be fetched from your API

export const sampleCampaigns = [
    {
      id: 1,
      name: "DeFi Pioneers Campaign",
      logoUrl: "", // URL to logo image
      logoBackground: "#f1c40f1a", // Light yellow background for logo
      criteria: "Complete DeFi Basics Course",
      points: 100,
      isEligible: true,
      isEnded: false,
      actionUrl: "https://partner-site.com/defi-campaign"
    },
    {
      id: 2,
      name: "NFT Creators Challenge",
      logoUrl: "",
      logoBackground: "#9b59b61a", // Light purple background for logo
      criteria: "Complete NFT Masterclass",
      points: 80,
      isEligible: true,
      isEnded: false,
      actionUrl: "https://partner-site.com/nft-challenge"
    },
    {
      id: 3,
      name: "Web3 Security Experts",
      logoUrl: "",
      logoBackground: "#2ecc711a", // Light green background for logo
      criteria: "Complete Security Module",
      points: 150,
      isEligible: true,
      isEnded: false,
      actionUrl: "https://partner-site.com/security-campaign"
    },
    {
      id: 4,
      name: "Advanced Trading Program",
      logoUrl: "",
      logoBackground: "#95a5a61a", // Light gray background for logo
      criteria: "Reach Level 5 in Trading Skills",
      points: 200,
      isEligible: false,
      isEnded: false,
      actionUrl: "https://partner-site.com/trading-program"
    },
    {
      id: 5,
      name: "Blockchain Developers Contest",
      logoUrl: "",
      logoBackground: "#e74c3c1a", // Light red background for logo
      criteria: "Complete 3 Smart Contract Modules",
      points: 120,
      isEligible: false,
      isEnded: false,
      actionUrl: "https://partner-site.com/dev-contest"
    },
    {
      id: 6,
      name: "Metaverse Architecture Challenge",
      logoUrl: "",
      logoBackground: "#3498db1a", // Light blue background for logo
      criteria: "Build a Virtual Space",
      points: 180,
      isEligible: false,
      isEnded: false,
      actionUrl: "https://partner-site.com/metaverse-challenge"
    },
    {
      id: 7,
      name: "First Quarter Crypto Quiz",
      logoUrl: "",
      logoBackground: "#9b59b61a", // Light purple background for logo
      criteria: "Score 85% on the Crypto Knowledge Quiz",
      points: 75,
      isEligible: true,
      isEnded: true,
      actionUrl: "https://partner-site.com/crypto-quiz"
    },
    {
      id: 8,
      name: "2024 DeFi Hackathon",
      logoUrl: "",
      logoBackground: "#f1c40f1a", // Light yellow background for logo
      criteria: "Submit a DeFi Project Demo",
      points: 250,
      isEligible: true,
      isEnded: true,
      actionUrl: "https://partner-site.com/defi-hackathon"
    }
  ];
  
  // Example of how to use this data in your component:
  /*
  import { sampleCampaigns } from './SampleData';
  
  // Inside your component
  useEffect(() => {
    // For development/testing
    setCampaigns(sampleCampaigns);
    setLoading(false);
    
    // For production with real API
    // const fetchCampaigns = async () => {...}
    // fetchCampaigns();
  }, []);
  */