exports.factory_abi = [
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "tokenAddress",
        type: "address",
      },
      {
        indexed: false,
        internalType: "address",
        name: "auctionAddress",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "campaignID",
        type: "uint256",
      },
    ],
    name: "contractsCreated",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "operator_",
        type: "address",
      },
      {
        internalType: "address",
        name: "projectWallet_",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "minBidAmount_",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "totalNFTs",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "campaignID_",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "auctionStartTime_",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "auctionEndTime_",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "contributorsPercent_",
        type: "uint256",
      },
    ],
    name: "createNewCampaign",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
      {
        internalType: "address",
        name: "",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "routerContract",
    outputs: [
      {
        internalType: "contract Router",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
];
exports.factory_address = "0x951736A1da3d72190c6C731031A9be2bc447376b";
