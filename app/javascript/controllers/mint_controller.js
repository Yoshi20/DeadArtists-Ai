import { Controller } from "@hotwired/stimulus";
import { ethers } from "ethers";
import { get } from '@rails/request.js';
const { MerkleTree } = require('merkletreejs'); // for whitelist minting

let _numberOfNft = document.getElementById('number-of-nft') ? document.getElementById('number-of-nft').value : 1;
let _userBalance = 0;
let _pricePerNft = 0.04;
let _remainingNumberOfMints = 50;
let _contractAddress = "";

const selectedAddress = async () => {
  while(!window.ethereum.selectedAddress) {
    await new Promise(resolve => setTimeout(resolve, 100));
  }
}

const getContractAddress = async () => {
  let address = "";
  const response = await get(window.location.origin + '/contract_address')
  if (response.ok) address = await response.text;
  else console.error("Couldn't fetch address!");
  return address;
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

const getUserNfts = async (userAddress, contractAddress) => {
  let user_nfts;
  const response = await get(window.location.origin + '/get_user_nfts.json?contractAddress=' + contractAddress + '&userAddress=' + userAddress)
  if (response.ok) user_nfts = await response.json;
  else console.error("Couldn't fetch user_nfts!");
  return user_nfts;
}

const getWhitelistAddresses = async () => {
  let whitelist_addresses;
  const response = await get(window.location.origin + '/whitelist_addresses')
  if (response.ok) whitelist_addresses = await response.text;
  else console.error("Couldn't fetch whitelist_addresses!");
  return whitelist_addresses;
}

const totalPrice = (n) => {
  return (n * _pricePerNft);
}

const hexWeiToEth = (hexWei) => {
  return (parseInt(hexWei, 16) / 1000000000000000000);
}

const ethStrToWei = (ethStr) => {
  return ethers.utils.parseEther(ethStr);
}

const hexStrToBytes = (hex) => {
  if (hex.slice(0, 2).toLowerCase() == '0x') hex = hex.slice(2);
  let bytes = [];
  for (let c = 0; c < hex.length; c += 2) {
    bytes.push(parseInt(hex.substr(c, 2), 16));
  }
  return bytes;
}

const toHexString = (byteArray) => {
  return Array.from(byteArray, (byte) => {
    return ('0' + (byte & 0xFF).toString(16)).slice(-2);
  }).join('')
}

const myKeccak256 = (data) => {
  return new Uint8Array(hexStrToBytes(ethers.utils.keccak256(data)));
}

const handleNumberOfNft = (n) => {
  document.getElementById('number-of-nft').value = n;
  let tp = totalPrice(n);
  document.getElementById('total-price').innerHTML = Math.round(tp*1000)/1000;
  let mintErrorMessage = document.getElementById('mint-error-message');
  if (tp > _userBalance) {
    mintErrorMessage.style.display = '';
    document.getElementById('mint-button').disabled = true;
  } else {
    mintErrorMessage.style.display = 'none';
    document.getElementById('mint-button').disabled = false;
  }
  document.getElementById('number-of-nft').value = n;
}

let auctionNftTimeout = 0;

// Connects to -> data: { controller: 'mint' }
export default class extends Controller {

  async connect() {
    // Set _numberOfNft
    document.getElementById('number-of-nft').value = _numberOfNft;
    // Wait until window.ethereum.selectedAddress is defined
    await selectedAddress();
    console.log('userAddress: ', window.ethereum.selectedAddress);//blup
    // Get provider, signer & contract
    window.provider = new ethers.providers.Web3Provider(window.ethereum);
    window.signer = window.provider.getSigner();
    _contractAddress = await getContractAddress();
    const abi = await getAbi(_contractAddress);
    window.contract = new ethers.Contract(_contractAddress, abi, window.signer);
    // Get & set user balance
    const balance = await window.signer.getBalance();
    _userBalance = hexWeiToEth(balance._hex);
    console.log('_userBalance: ', _userBalance);//blup
    document.getElementById('user-balance').innerHTML = Math.round(_userBalance*1000)/1000;
    // Get & set userNumberOfMints
    const userTokenBalance = await window.contract.balanceOf(window.ethereum.selectedAddress);
    const userNumberOfMints = parseInt(userTokenBalance._hex, 16);
    console.log('userNumberOfMints: ', userNumberOfMints);//blup
    document.getElementById('user-number-of-mints').innerHTML = userNumberOfMints;
    // Enable members section button when minted > 0
    const membersSectionBtn = document.getElementById('members_section_button');
    if (userNumberOfMints > 0) membersSectionBtn.firstChild.removeAttribute("disabled");
    // // Get maxMintAmountPerTx & set _remainingNumberOfMints (blup: Public only)
    // const maxMintAmountPerTx = await window.contract.maxMintAmountPerTx();
    // _remainingNumberOfMints = parseInt(maxMintAmountPerTx._hex, 16);
    // Get maxMintWL & set _remainingNumberOfMints (blup: WL only)
    const maxMintWL = await window.contract.maxMintWL();
    _remainingNumberOfMints = parseInt(maxMintWL._hex, 16) - userNumberOfMints;
    if (_remainingNumberOfMints < 0) _remainingNumberOfMints = 0;
    console.log('_remainingNumberOfMints: ', _remainingNumberOfMints);//blup
    document.getElementById('max-number-of-mints').innerHTML = _remainingNumberOfMints + userNumberOfMints;
    // Get & set _pricePerNft
    const cost = await window.contract.cost();
    _pricePerNft = hexWeiToEth(cost._hex);
    console.log('_pricePerNft: ', _pricePerNft);//blup
    handleNumberOfNft(document.getElementById('number-of-nft').value);
    // Minting may be enabled from here on -------------------------------------
    // Get & set maxSupply
    // const maxSupply =  parseInt((await window.contract.maxSupply())._hex, 16);
    const maxSupply =  5000;//blup: can be static
    console.log('maxSupply: ', maxSupply);//blup
    document.getElementById('max-supply').innerHTML = maxSupply;
    // Get & set totalSupply
    const totalSupply =  parseInt((await window.contract.totalSupply())._hex, 16);
    console.log('totalSupply: ', totalSupply);//blup
    document.getElementById('total-supply').innerHTML = totalSupply;
    // Handle special case when maxSupply - totalSupply < _remainingNumberOfMints
    if (maxSupply - totalSupply < _remainingNumberOfMints) {
      _remainingNumberOfMints = maxSupply - totalSupply;
    }
  }

  add() {
    _numberOfNft++;
    if (_numberOfNft > _remainingNumberOfMints) _numberOfNft = _remainingNumberOfMints;
    handleNumberOfNft(_numberOfNft);
  }

  sub() {
    _numberOfNft--;
    if (_numberOfNft < 1) _numberOfNft = 1;
    if (_numberOfNft > _remainingNumberOfMints) _numberOfNft = _remainingNumberOfMints; // in case max is 0
    handleNumberOfNft(_numberOfNft);
  }

  set() {
    _numberOfNft = document.getElementById('number-of-nft').value;
    if (_numberOfNft < 1) _numberOfNft = 1;
    if (_numberOfNft > _remainingNumberOfMints) _numberOfNft = _remainingNumberOfMints;
    handleNumberOfNft(_numberOfNft);
  }

  async mint() {
    // Disable everything and show spinner
    document.getElementById("mint-button").disabled = true;
    document.getElementById("sub-button").disabled = true;
    document.getElementById("add-button").disabled = true;
    document.getElementById("set-field").style.pointerEvents = 'none';
    document.getElementById('mint-success-message-row').style.display = 'none';
    const mintButtonText = document.getElementById("mint-button-text");
    mintButtonText.innerHTML = '<div class="dot-windmill"></div>';
    // Mint
    try {
      // Whitelist minting: --------------------- (blup: WL only)
      let whitelistAddresses = await getWhitelistAddresses();
      whitelistAddresses = atob(whitelistAddresses.slice(2)).split(' ');
      whitelistAddresses = whitelistAddresses.map(addr => addr.toLowerCase());
      console.log('whitelistAddresses = ', whitelistAddresses);//blup
      const leafNodes = whitelistAddresses.map(addr => myKeccak256(addr));
      console.log('leafNodes = ', leafNodes);//blup
      const DeadArtistsMerkleTree = new MerkleTree(leafNodes, myKeccak256, {sortPairs: true});
      console.log('DeadArtistsMerkleTree:\n', DeadArtistsMerkleTree.toString()); //blup: shows a required info for the SmartContract
      let response;
      if (whitelistAddresses.indexOf(window.ethereum.selectedAddress.toLowerCase()) >= 0) {
        const claimingAddress = myKeccak256(window.ethereum.selectedAddress.toLowerCase());
        console.log('claimingAddress = ', claimingAddress);//blup
        const hexProof = DeadArtistsMerkleTree.getHexProof(claimingAddress);
        console.log('hexProof = ', hexProof);//blup
        response = await window.contract.mintWL(_numberOfNft, hexProof, {
          value: ethStrToWei(totalPrice(_numberOfNft).toLocaleString('fullwide', {useGrouping: false, maximumSignificantDigits:21})),
        });
      } else {
        throw new Error("😥 Sorry, you're not on the whitelist 😥");
      }
      // // Public minting: --------------------------- (blup: Public only)
      // const response = await window.contract.mint(_numberOfNft, {
      //   value: ethStrToWei(totalPrice(_numberOfNft).toLocaleString('fullwide', {useGrouping: false, maximumSignificantDigits:21})),
      // });
      // -------------------------------------------
      console.log('response = ', response);
      // Show "Minting in progress..."
      let url = 'https://goerli.etherscan.io/tx/' + response.hash; //blup: goerli for now
      let p = document.createElement("p");
      p.innerHTML = 'Please wait for your transaction on <a target=_blank class=color-default href=' + url + '>Etherscan</a> to complete';
      let parent = document.getElementById('mint-in-progress-message-text').parentElement;
      if (parent.lastChild.tagName == "P") { parent.lastChild.remove(); }
      parent.appendChild(p);
      document.getElementById('mint-success-message-row').style.display = 'none';
      document.getElementById('mint-in-progress-message-row').style.display = '';

      // Wait until minted: ------------------------
      const rc = await response.wait();
      console.log('rc = ', rc);
      console.log('rc.events = ', rc.events);//blup
      this.mintedNftIds = [];
      rc.events.forEach((event) => {
        console.log(event);//blup
        if (event.event === 'Transfer') {
          const [from, to, value] = event.args;
          console.log(from, to, value);//blup
          console.log(parseInt(value._hex, 16));//blup
          this.mintedNftIds.push(parseInt(value._hex, 16));
        }
      });
      console.log('this.mintedNftIds = ', this.mintedNftIds);//blup
      // Show "Mint succeeded!"
      p = document.createElement("p");
      p.innerHTML = 'Check out your transaction on <a target=_blank class=color-default href=' + url + '>Etherscan</a>';
      parent = document.getElementById('mint-success-message-text').parentElement;
      if (parent.lastChild.tagName == "P") { parent.lastChild.remove(); }
      parent.appendChild(p);
      document.getElementById('mint-in-progress-message-row').style.display = 'none';
      document.getElementById('mint-success-message-row').style.display = '';
      // Show "Auction video modal"
      this.auction_modal_show(this.mintedNftIds);
      // -------------------------------------------
    } catch(err) {
      console.warn(err);
      if (err.code) {
        if (err.code != 'ACTION_REJECTED' && err.code != '4001') {
          alert("😥 Something went wrong: " + err.code + " 😥");
        }
      } else {
        alert(err.message);
      }
    }
    // Reenable everything and hide spinner
    document.getElementById("mint-button").disabled = false;
    document.getElementById("sub-button").disabled = false;
    document.getElementById("add-button").disabled = false;
    document.getElementById("set-field").style.pointerEvents = '';
    mintButtonText.innerHTML = 'Whitelist Mint'; // (blup: WL only)
    // mintButtonText.innerHTML = 'Mint'; // (blup: Public only)
  }

  //blup: only for testing
  auction_modal_demo() {
    this.mintedNftIds = [1,2,3];
    this.auction_modal_show(this.mintedNftIds);
  }

  async auction_modal_show(nftIds) {
    ui('#auction-modal');
    const auctionNft = document.getElementById('auction-nft');
    auctionNft.style.display = 'none';
    auctionNft.style.transition = 'opacity 0s';
    auctionNft.style.opacity = 0;
    const nextButton = document.getElementById('next-auction-nft-button');
    nextButton.style.display = 'none';
    const finishButton = document.getElementById('finish-auction-nft-button');
    finishButton.style.display = 'none';
    const vid = document.getElementById('auction-video');
    vid.currentTime = 0;
    vid.play();
    clearTimeout(auctionNftTimeout);
    auctionNftTimeout = setTimeout(() => {
      auctionNft.style.display = '';
      auctionNft.style.transition = 'opacity 3s linear';
      setTimeout(() => {
        auctionNft.style.opacity = 1;
      }, 100);
      // show next button if there are more than 1
      setTimeout(() => {
        if (nftIds.length > 1) {
          nextButton.style.display = '';
        } else {
          finishButton.style.display = '';
        }
      }, 5100);
    }, 11900);
    // During video: Check if first minted NFT is valid and update auction-nft
    this.user_nfts_json = await getUserNfts(window.ethereum.selectedAddress, _contractAddress);
    console.log('user_nfts_json = ', this.user_nfts_json);//blup
    let nftValid = false;
    this.next_user_nft_index = 0;
    let i = 0;
    this.user_nfts_json.forEach((nft) => {
      if (nft.ipfs_token_id == nftIds[0]) {
        nftValid = true;
        this.next_user_nft_index = i;
      }
      i++;
    });
    if (nftValid) {
      auctionNft.src = this.user_nfts_json[this.next_user_nft_index].gif_link;
    }
  }

  next_user_nft() {
    const auctionNft = document.getElementById('auction-nft');
    auctionNft.style.display = 'none';
    auctionNft.style.transition = 'opacity 0s';
    auctionNft.style.opacity = 0;
    const nextButton = document.getElementById('next-auction-nft-button');
    nextButton.style.display = 'none';
    const finishButton = document.getElementById('finish-auction-nft-button');
    finishButton.style.display = 'none';
    this.mintedNftIds.shift(); // removes first item of the array
    console.log('this.mintedNftIds = ',this.mintedNftIds);//blup
    let i = 0;
    this.user_nfts_json.forEach((nft) => {
      if (nft.ipfs_token_id == this.mintedNftIds[0]) {
        this.next_user_nft_index = i;
      }
      i++;
    });
    auctionNft.src = this.user_nfts_json[this.next_user_nft_index].gif_link;
    setTimeout(() => {
      auctionNft.style.display = '';
      auctionNft.style.transition = 'opacity 3s linear';
      setTimeout(() => {
        auctionNft.style.opacity = 1;
      }, 100);
    }, 100);
    // show next button if there are still more than 1
    setTimeout(() => {
      if (this.mintedNftIds.length > 1) {
        nextButton.style.display = '';
      } else {
        finishButton.style.display = '';
      }
    }, 5100);
  }

  finish_user_nft() {
    // location.reload();
    window.location.href = window.location.origin + '/user_nfts';
  }

}
