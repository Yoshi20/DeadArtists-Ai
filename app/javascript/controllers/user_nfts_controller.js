import { Controller } from "@hotwired/stimulus";
import { ethers } from "ethers";
import { get } from '@rails/request.js';

const selectedAddress = async () => {
  while(!window.ethereum.selectedAddress) {
    await new Promise(resolve => setTimeout(resolve, 100));
  }
}

const getStakingContractAddress = async () => {
  let address = "";
  const response = await get(window.location.origin + '/staking_contract_address')
  if (response.ok) address = await response.text;
  else console.error("Couldn't fetch staking address!");
  return address;
}

const getAbi = async (contractAddress) => {
  let abi = "";
  const response = await get(window.location.origin + '/abi?contractAddress=' + contractAddress)
  if (response.ok) abi = await response.text;
  else console.error("Couldn't fetch abi!");
  return abi;
}

// Connects to -> data: { controller: 'user-nfts' }
export default class extends Controller {

  async connect() {
    // Wait until window.ethereum.selectedAddress is defined
    await selectedAddress();
    console.log('userAddress: ', window.ethereum.selectedAddress);//blup
    // Get user NFTs
    const userNftsFrame = document.getElementById('user-nfts-frame');
    if (userNftsFrame) {
      // Render NFTs
      userNftsFrame.src = '/get_user_nfts?userAddress=' + window.ethereum.selectedAddress
      console.log('userNftsFrame.src: ', userNftsFrame.src);//blup
      userNftsFrame.reload();
      // Wait until loaded
      await userNftsFrame.loaded
      // Read userNftIds
      const userNftsData = document.getElementById("user-nfts-data");
      if (userNftsData) {
        const userNftIds = userNftsData.dataset.ids.substring(1, userNftsData.dataset.ids.length-1).split(', ').map(function(item) {
          return parseInt(item, 10);
        });
        console.log("userNftIds = ", userNftIds);//blup
        // Get provider, signer & contract
        window.provider = new ethers.providers.Web3Provider(window.ethereum);
        window.signer = window.provider.getSigner();
        const stakingContractAddress = await getStakingContractAddress();
        const stakingAbi = await getAbi(stakingContractAddress);
        window.stakingContract = new ethers.Contract(stakingContractAddress, stakingAbi, window.signer);


        // Get staked tokens
        const stakedTokens = await window.stakingContract.tokensOfOwner(window.ethereum.selectedAddress);
        console.log("stakedTokens = ", stakedTokens);

        // // Get earnings
        // const earnings = await window.stakingContract.earningInfo(window.ethereum.selectedAddress, userNftIds);
        // console.log("earnings = ", earnings);

        // Write
        // Stake = Token Staken Funktion braucht verknüpfung mit Wallet + TokenIDS als uint256[]
        // Unstake = Token Unstake Funktion braucht verknüpfung mit Wallet +TokenIDS als uint256[]
        // Claim = Verdiente Tokens abholen Funktion braucht verknüpfung mit Wallet +TokenIDS als uint256[]
        //
        // Read
        // earningInfo = braucht User Wallet Adresse und TokenIDS als uint256[] Return: bisher verdiente Tokens als uint256[]
        // tokensOfOwner = braucht User Wallet Adresse Return: Gestakte NFT IDs des Users
        // totalStaked = braucht nichts, gibt anzahl alle gestakte NFTs zurück



          // let response = await window.stakingContract.stake([7]);
          // let response = await window.stakingContract.stake([1]);

      }




    }
  }

}
