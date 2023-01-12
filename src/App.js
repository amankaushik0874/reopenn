import "./App.css";
import React, { useState, useRef, useEffect } from "react";
import {
  router_address,
  factory_address,
  auction_abi,
  factory_abi,
  router_abi,
  nft_abi,
  holderYield_abi,
  holderYield_address,
} from "./constants";
import { Contract, providers, utils, ethers, BigNumber } from "ethers";
import Web3Modal from "web3modal";

function App() {
  const [loading, setLoading] = useState(false);
  const [nftAddress, setNft_address] = useState("");
  const [auctionAddress, setAuction_address] = useState("");
  const [projectOwner, setProjectOwner_address] = useState();
  const [inputs, setInputs] = useState({});
  const [formData, setFormData] = useState({});
  const [response, setResponse] = useState(null);
  const [walletConnected, setWalletConnected] = useState(false);
  const web3ModalRef = useRef();

  useEffect(() => {
    console.log({ formData });
  }, [formData]);

  // useEffect(() => {
  //   if (nftAddress && auctionAddress && projectOwner) {
  //     handlePost({
  //       projectOwner,
  //       nftAddress,
  //       auctionAddress,
  //     });
  //   }
  // }, [nftAddress, auctionAddress, projectOwner]);

  const getProviderOrSigner = async (needSigner = false) => {
    // Connect to Metamask
    // Since we store `web3Modal` as a reference, we need to access the `current` value to get access to the underlying object
    const provider = await web3ModalRef.current.connect();
    const web3Provider = new providers.Web3Provider(provider);

    // If user is not connected to the Mumbai network, let them know and throw an error
    const { chainId } = await web3Provider.getNetwork();
    if (chainId !== 80001) {
      window.alert("Change the network to Mumbai");
      throw new Error("Change network to Mumbai");
    }

    if (needSigner) {
      const signer = web3Provider.getSigner();
      return signer;
    }
    return web3Provider;
  };
  useEffect(() => {
    // if wallet is not connected, create a new instance of Web3Modal and connect the MetaMask wallet
    if (!walletConnected) {
      // Assign the Web3Modal class to the reference object by setting it's `current` value
      // The `current` value is persisted throughout as long as this page is open
      web3ModalRef.current = new Web3Modal({
        network: "mumbai",
        providerOptions: {},
        disableInjectedProvider: false,
      });

      btnhandler();
    }
  }, [walletConnected]);

  const eventsData = async (factory, e) => {
    setProjectOwner_address(inputs.projectWallet_);
    factory.on("NFTCreated", (tokenAddress, event) => {
      console.log(`NFT contract created at address: ${tokenAddress}`);
      localStorage.setItem("nft_address", tokenAddress);
      setNft_address(tokenAddress);
    });
    factory.on("AuctionCreated", (auctionAddress, event) => {
      console.log(`Auction contract created at address: ${auctionAddress}`);
      localStorage.setItem("auction_address", auctionAddress);
      setAuction_address(auctionAddress);
      console.log(formData);
    });
  };

  const publish = async (e) => {
    e.preventDefault();
    try {
      console.log("Publish");
      const signer = await getProviderOrSigner(true);
      const factory = new Contract(factory_address, factory_abi, signer);
      handlePost(factory);
      const tx = await factory.createNewCampaign(
        inputs.operator,
        inputs.projectWallet_,
        parseInt(inputs.minBidAmount),
        parseInt(inputs.totalNFTs),
        BigNumber.from(inputs.AuctionStartTime),
        BigNumber.from(inputs.AuctionEndTime),
        parseInt(inputs.Percent)
      );

      eventsData(factory, e)
        .then(() => {
          console.log(formData);
        })
        .catch((error) => {
          console.error(error);
        });
      await tx.wait();
      console.log(
        "=>",
        localStorage.getItem("auction_address"),
        localStorage.getItem("nft_address")
      );
      console.log(formData);
      console.log("Saved formData");
      // wait for the transaction to get mined
      console.log(tx);
      setLoading(false);
      window.alert("Published");
    } catch (err) {
      console.error(err);
    }
  };

  const placeBid = async () => {
    try {
      const auction_address = JSON.parse(
        localStorage.getItem("auction_address")
      );
      console.log("Placing Bid");
      // We need a Signer here since this is a 'write' transaction.
      const signer = await getProviderOrSigner(true);
      const auction_contract = new Contract(
        auction_address,
        auction_abi,
        signer
      );
      const tx = await auction_contract.placeBid({ value: inputs.Amount });

      setLoading(true);
      // wait for the transaction to get mined
      await tx.wait();
      console.log(tx);
      setLoading(false);
      window.alert("Bid Placed");
    } catch (err) {
      console.error(err);
    }
  };
  const stakeNFT = async () => {
    try {
      const nft_address = JSON.parse(localStorage.getItem("auction_address"));
      console.log("Staking");
      // We need a Signer here since this is a 'write' transaction.
      const signer = await getProviderOrSigner(true);
      const holderYield_contract = new Contract(
        holderYield_address,
        holderYield_abi,
        signer
      );
      const tx = await holderYield_contract.stake(
        nft_address,
        inputs.tokenForStake
      );

      setLoading(true);
      // wait for the transaction to get mined
      await tx.wait();
      console.log(tx);
      setLoading(false);
      window.alert("Congratulations!, your NFT is Staked");
    } catch (err) {
      console.error(err);
    }
  };
  const unstakeNFT = async () => {
    try {
      const nft_address = JSON.parse(localStorage.getItem("auction_address"));
      console.log("Unstaking");
      // We need a Signer here since this is a 'write' transaction.
      const signer = await getProviderOrSigner(true);
      const holderYield_contract = new Contract(
        holderYield_address,
        holderYield_abi,
        signer
      );
      const tx = await holderYield_contract.unstake(
        nft_address,
        inputs.tokenForUnstake
      );

      setLoading(true);
      // wait for the transaction to get mined
      await tx.wait();
      console.log(tx);
      setLoading(false);
      window.alert("Unstaked!");
    } catch (err) {
      console.error(err);
    }
  };
  const claimRewards = async () => {
    try {
      const nft_address = JSON.parse(localStorage.getItem("auction_address"));
      console.log("Claiming");
      // We need a Signer here since this is a 'write' transaction.
      const signer = await getProviderOrSigner(true);
      const holderYield_contract = new Contract(
        holderYield_address,
        holderYield_abi,
        signer
      );
      const tx = await holderYield_contract.claim(
        nft_address,
        inputs.TokenForRewards
      );

      setLoading(true);
      // wait for the transaction to get mined
      await tx.wait();
      console.log(tx);
      setLoading(false);
      window.alert("Reward Claimed!");
    } catch (err) {
      console.error(err);
    }
  };

  const selectWinners = async () => {
    try {
      const auction_address = JSON.parse(
        localStorage.getItem("auction_address")
      );
      console.log("Selecting");
      // We need a Signer here since this is a 'write' transaction.
      const signer = await getProviderOrSigner(true);
      // Create a new instance of the Contract with a Signer, which allows
      // update methods
      const auction_contract = new Contract(
        auction_address,
        auction_abi,
        signer
      );

      const tx = await auction_contract.selectWinners();
      setLoading(true);
      // wait for the transaction to get mined
      await tx.wait();
      console.log(tx);
      setLoading(false);
      window.alert("Done");
    } catch (err) {
      console.error(err);
    }
  };

  const approve = async () => {
    try {
      console.log("Approving");
      const auction_address = JSON.parse(
        localStorage.getItem("auction_address")
      );
      console.log(auction_address);
      // We need a Signer here since this is a 'write' transaction.
      const signer = await getProviderOrSigner(true);
      // Create a new instance of the Contract with a Signer, which allows
      // update methods
      const auction_contract = new Contract(
        auction_address,
        auction_abi,
        signer
      );

      const tx = await auction_contract.approveAuction();
      setLoading(true);
      // wait for the transaction to get mined
      await tx.wait();
      console.log(tx);
      setLoading(false);
      window.alert("Approved");
    } catch (err) {
      console.error(err);
    }
  };

  const increaseBid = async () => {
    try {
      const auction_address = JSON.parse(
        localStorage.getItem("auction_address")
      );
      console.log("Increasing");
      // We need a Signer here since this is a 'write' transaction.
      const signer = await getProviderOrSigner(true);
      const auction_contract = new Contract(
        auction_address,
        auction_abi,
        signer
      );
      const tx = await auction_contract.increaseBid({ value: inputs.Amount2 });

      setLoading(true);
      // wait for the transaction to get mined
      await tx.wait();
      console.log(tx);
      setLoading(false);
      window.alert("Increased");
    } catch (err) {
      console.error(err);
    }
  };

  const claimNFT = async () => {
    try {
      const auction_address = JSON.parse(
        localStorage.getItem("auction_address")
      );
      console.log("Claiming");
      // We need a Signer here since this is a 'write' transaction.
      const signer = await getProviderOrSigner(true);
      // Create a new instance of the Contract with a Signer, which allows
      // update methods
      const auction_contract = new Contract(
        auction_address,
        auction_abi,
        signer
      );

      const tx = await auction_contract.claimNFT(inputs.TokenId);
      setLoading(true);
      // wait for the transaction to get mined
      await tx.wait();
      console.log(tx);
      setLoading(false);
      window.alert("NFT Claimed");
    } catch (err) {
      console.error(err);
    }
  };

  const claimMoney = async () => {
    try {
      const auction_address = JSON.parse(
        localStorage.getItem("auction_address")
      );
      console.log("Claiming");
      // We need a Signer here since this is a 'write' transaction.
      const signer = await getProviderOrSigner(true);
      // Create a new instance of the Contract with a Signer, which allows
      // update methods
      const auction_contract = new Contract(
        auction_address,
        auction_abi,
        signer
      );

      const tx = await auction_contract.claimMoney();
      setLoading(true);
      // wait for the transaction to get mined
      await tx.wait();
      console.log(tx);
      setLoading(false);
      window.alert("Claimed");
    } catch (err) {
      console.error(err);
    }
  };

  const createNewSeason = async () => {
    try {
      const auction_address = JSON.parse(
        localStorage.getItem("auction_address")
      );
      console.log("Creating New Season");
      // We need a Signer here since this is a 'write' transaction.
      const signer = await getProviderOrSigner(true);
      // Create a new instance of the Contract with a Signer, which allows
      // update methods
      const auction_contract = new Contract(
        auction_address,
        auction_abi,
        signer
      );

      const tx = await auction_contract.createNewSeason(
        parseInt(inputs.minBidAmount2),
        parseInt(inputs.totalNFTs2),
        BigNumber.from(inputs.AuctionStartTime2),
        BigNumber.from(inputs.AuctionEndTime2)
      );
      setLoading(true);
      // wait for the transaction to get mined
      await tx.wait();
      console.log(tx);
      setLoading(false);
      window.alert("New Season Created");
    } catch (err) {
      console.error(err);
    }
  };

  const getData = async () => {
    try {
      const response = await fetch("https://localhost:3002/");
      const data = await response.json();
      console.log(data);
    } catch (err) {
      console.error(err);
    }
  };

  const [data, setdata] = useState({
    address: "",
    Balance: null,
  });

  const getbalance = (address) => {
    // Requesting balance method
    window.ethereum
      .request({
        method: "eth_getBalance",
        params: [address, "latest"],
      })
      .then((balance) => {
        // Setting balance
        setdata({
          Balance: ethers.utils.formatEther(balance),
        });
      });
  };

  const btnhandler = async () => {
    try {
      // Get the provider from web3Modal, which in our case is MetaMask
      // When used for the first time, it prompts the user to connect their wallet
      await getProviderOrSigner();
      setWalletConnected(true);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setInputs({ ...inputs, [name]: value });
  };

  const handlePost = async (formData, factory) => {
    console.log("=>>>>", formData);
    // event.preventDefault();
    try {
      //   const response = await fetch("https://localhost:3002/addname", {
      //     method: "POST",
      //     headers: {
      //       Origin: "http://localhost:3000",
      //       "Content-Type": "application/json",
      //     },
      //     body: JSON.stringify(formData),
      //   });
      fetch("http://localhost:3002/registerfactory", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(factory),
      });
      const result = await response.json();
      return result;
    } catch (error) {
      console.error(error);
    }
  };

  const handleData = (e) => {
    e.preventDefault();
    const searchTerm = e.target.searchTerm.value;

    fetch(`https://localhost:3002/getdata?searchTerm=${searchTerm}`)
      .then((res) => res.json())
      .then((res) => {
        setResponse(res);
        localStorage.setItem("nft_address", JSON.stringify(res.nftAddress));
        localStorage.setItem(
          "auction_address",
          JSON.stringify(res.auctionAddress)
        );
      });
  };

  return (
    <div className="App">
      <p>Data {data.address}</p>
      <div className="container">
        <form onSubmit={handleData}>
          <input type="text" name="searchTerm" placeholder="WriteProjectId" />
          <button type="submit">Search</button>
        </form>
      </div>
      <div className="container">
        <button onClick={btnhandler}>Connect</button>
        <form onSubmit={publish}>
          <div className="input_container">
            <input
              type="text"
              placeholder="operator"
              onChange={handleChange}
              name="operator"
              value={inputs.operator || ""}
            ></input>
            <input
              type="text"
              placeholder="projectWallet_"
              onChange={handleChange}
              name="projectWallet_"
              value={inputs.projectWallet_ || ""}
            ></input>
            <input
              type="number"
              placeholder="minBidAmount"
              onChange={handleChange}
              name="minBidAmount"
              value={inputs.minBidAmount || ""}
            ></input>
            <input
              type="number"
              placeholder="totalNFTs"
              onChange={handleChange}
              name="totalNFTs"
              value={inputs.totalNFTs || ""}
            ></input>
            <input
              type="number"
              placeholder="AuctionStartTime"
              onChange={handleChange}
              name="AuctionStartTime"
              value={inputs.AuctionStartTime || ""}
            ></input>
            <input
              type="number"
              placeholder="AuctionEndTime"
              onChange={handleChange}
              name="AuctionEndTime"
              value={inputs.AuctionEndTime || ""}
            ></input>
            <input
              type="number"
              placeholder="Percent"
              onChange={handleChange}
              name="Percent"
              value={inputs.Percent || ""}
            ></input>
            <button type="submit">Publish</button>
          </div>
        </form>
        <button onClick={approve}>Approve</button>
        <div className="input_container">
          <input
            type="number"
            placeholder="Amount"
            onChange={handleChange}
            name="Amount"
            value={inputs.Amount || ""}
          ></input>
          <button onClick={placeBid}>Place Bid</button>
        </div>
        <div className="input_container">
          <input
            type="number"
            placeholder="Amount"
            onChange={handleChange}
            name="Amount2"
            value={inputs.Amount2 || ""}
          ></input>
          <button onClick={increaseBid}>Increase Bid</button>
        </div>
        <button onClick={selectWinners}>selectWinners</button>
        <div className="input_container">
          <input
            type="number"
            placeholder="TokenId"
            onChange={handleChange}
            name="TokenId"
            value={inputs.TokenId || ""}
          ></input>
          <button onClick={claimNFT}>ClaimNFT</button>
        </div>
        <button onClick={claimMoney}>Claim Money</button>
        <button onClick={getData}>Snapshot</button>
        <form onSubmit={handleSubmit}>
          <div className="input_container">
            <input
              type="number"
              placeholder="minBidAmount"
              onChange={handleChange}
              name="minBidAmount2"
              value={inputs.minBidAmount2 || ""}
            ></input>
            <input
              type="number"
              placeholder="totalNFTs"
              onChange={handleChange}
              name="totalNFTs2"
              value={inputs.totalNFTs2 || ""}
            ></input>
            <input
              type="number"
              placeholder="AuctionStartTime"
              onChange={handleChange}
              name="AuctionStartTime2"
              value={inputs.AuctionStartTime2 || ""}
            ></input>
            <input
              type="number"
              placeholder="AuctionEndTime"
              onChange={handleChange}
              name="AuctionEndTime2"
              value={inputs.AuctionEndTime2 || ""}
            ></input>
            <button onClick={createNewSeason}>New Season</button>
          </div>
        </form>
        <div className="input_container">
          <input
            type="number"
            placeholder="TokenId"
            onChange={handleChange}
            name="tokenForStake"
            value={inputs.tokenForStake || ""}
          ></input>
          <button onClick={stakeNFT}>Stake</button>
        </div>
        <div className="input_container">
          <input
            type="number"
            placeholder="TokenId"
            onChange={handleChange}
            name="tokenForUnstake"
            value={inputs.tokenForUnstake || ""}
          ></input>
          <button onClick={unstakeNFT}>Unstake</button>
        </div>
        <div className="input_container">
          <input
            type="number"
            placeholder="TokenId"
            onChange={handleChange}
            name="TokenForRewards"
            value={inputs.TokenForRewards || ""}
          ></input>
          <button onClick={claimRewards}>Claim Rewards</button>
        </div>
      </div>
    </div>
  );
}

export default App;
