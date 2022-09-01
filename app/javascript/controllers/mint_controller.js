import { Controller } from "@hotwired/stimulus"

const PRICE_PER_NFT = 0.05; // blup: hardcoded for now
const MAX_NUMBER_OF_MINTS_PER_WALLET = 10;  //blup: is not guaranteed yet!

const selectedAddress = async () => {
  while(!window.ethereum.selectedAddress) {
    await new Promise(resolve => setTimeout(resolve, 100));
  }
}
const totalPrice = (n) => {
  return Math.round(n * PRICE_PER_NFT * 1000) / 1000;
}

let numberOfNft = document.getElementById('number-of-nft').value;
let userBalance = 0;

const handleNumberOfNft = (n) => {
  document.getElementById('number-of-nft').value = n;
  let tp = totalPrice(n);
  document.getElementById('total-price').innerHTML = tp;
  let mintErrorMessage = document.getElementById('mint-error-message');
  if (tp > userBalance) {
    mintErrorMessage.style.display = '';
    document.getElementById('mint-button').disabled = true;
  } else {
    mintErrorMessage.style.display = 'none';
    document.getElementById('mint-button').disabled = false;
  }
  document.getElementById('number-of-nft').value = n;
}

// Connects to -> data: { controller: 'mint' }
export default class extends Controller {
  async connect() {
    // wait until window.ethereum.selectedAddress is defined
    await selectedAddress();
    console.log(window.ethereum.selectedAddress);//blup
    // Get user balance
    try {
      let balance = await window.ethereum.request({ method: 'eth_getBalance', params: [window.ethereum.selectedAddress, "latest"] });
      balance = Math.round(parseInt(balance, 16) / 1000000000000000000 * 1000) / 1000;
      userBalance = balance;
      console.log(userBalance);//blup
      document.getElementById('user-balance').innerHTML = userBalance;
    } catch (err) {
      console.error(err.message);
    }
    handleNumberOfNft(document.getElementById('number-of-nft').value);
  }

  add() {
    numberOfNft++;
    if (numberOfNft > MAX_NUMBER_OF_MINTS_PER_WALLET) numberOfNft = MAX_NUMBER_OF_MINTS_PER_WALLET;
    handleNumberOfNft(numberOfNft);
  }

  sub() {
    numberOfNft--;
    if (numberOfNft < 1) numberOfNft = 1;
    handleNumberOfNft(numberOfNft);
  }

  set() {
    numberOfNft = document.getElementById('number-of-nft').value;
    if (numberOfNft < 1) numberOfNft = 1;
    if (numberOfNft > MAX_NUMBER_OF_MINTS_PER_WALLET) numberOfNft = MAX_NUMBER_OF_MINTS_PER_WALLET;
    handleNumberOfNft(numberOfNft);
  }

  async mint() {
    alert('Mint test; numberOfNft = ' + numberOfNft + '; totalPrice = ' + totalPrice(numberOfNft));

    // const PUBLIC_KEY = '?'; //blup
    // const nonce = await window.ethereum.request({ method: 'eth_getTransactionCount', params: [PUBLIC_KEY, "latest"] });


    // const contract = require("../artifacts/contracts/MyNFT.sol/MyNFT.json")
    // const contractAddress = "0x07b8Eed7161Fbd77da9e0276Abea19b22fc168B6"
    // // const nftContract = new web3.eth.Contract(contract.abi, contractAddress)
    // window.contract = await new web3.eth.Contract(contractABI, contractAddress);
    //
    // async function mintNFT(tokenURI) {
    //
    //
    //     //set up your Ethereum transaction
    //     const transactionParameters = {
    //         to: contractAddress, // Required except during contract publications.
    //         from: window.ethereum.selectedAddress, // must match user's active address.
    //         'data': window.contract.methods.mintNFT(window.ethereum.selectedAddress, tokenURI).encodeABI() //make call to NFT smart contract
    //     };
    //
    //
    //     //sign transaction via Metamask
    //     try {
    //         const txHash = await window.ethereum
    //             .request({
    //                 method: 'eth_sendTransaction',
    //                 params: [transactionParameters],
    //             });
    //         return {
    //             success: true,
    //             status: "✅ Check out your transaction on Etherscan: https://ropsten.etherscan.io/tx/" + txHash
    //         }
    //     } catch (error) {
    //         return {
    //             success: false,
    //             status: "😥 Something went wrong: " + error.message
    //         }
    //     }
    //   }







    // examples:
    //-----------

    // async function mint() {
    //   const mintButton = document.getElementById("mintButton");
    //   mintButton.disabled = true;
    //   const spinner = '<div class="dot-elastic"></div><span>Waiting for transaction...</span>';
    //   mintButton.innerHTML = spinner;
    //
    //   const amount = parseInt(document.getElementById("mintInput").value);
    //   const value = BigInt(info.deploymentConfig.mintPrice) * BigInt(amount);
    //   const publicMintActive = await contract.methods.mintingActive().call();
    //   const presaleMintActive = await contract.methods.presaleActive().call();
    //
    //   if (publicMintActive) {
    //     // PUBLIC MINT
    //     try {
    //       const mintTransaction = await contract.methods
    //         .mint(amount)
    //         .send({ from: window.address, value: value.toString() });
    //       if(mintTransaction) {
    //         if(chain === 'rinkeby') {
    //           const url = `https://rinkeby.etherscan.io/tx/${mintTransaction.transactionHash}`;
    //           const mintedContainer = document.querySelector('.minted-container');
    //           const countdownContainer = document.querySelector('.countdown');
    //           const mintedTxnBtn = document.getElementById("mintedTxnBtn");
    //           mintedTxnBtn.href = url;
    //           countdownContainer.classList.add('hidden');
    //           mintedContainer.classList.remove('hidden');
    //         }
    //         console.log("Minted successfully!", `Transaction Hash: ${mintTransaction.transactionHash}`);
    //       } else {
    //         const mainText = document.getElementById("mainText");
    //         mainText.innerText = mint_failed;
    //         mintButton.innerText = button_public_mint;
    //         mintButton.disabled = false;
    //
    //         console.log("Failed to mint!");
    //       }
    //     } catch(e) {
    //       const mainText = document.getElementById("mainText");
    //       mainText.innerText = mint_failed;
    //       mintButton.innerText = button_public_mint;
    //       mintButton.disabled = false;
    //
    //       console.log(e);
    //     }
    //   } else if (presaleMintActive) {
    //     // PRE-SALE MINTING
    //     try {
    //       const merkleData = await fetch(
    //         `/.netlify/functions/merkleProof/?wallet=${window.address}&chain=${chain}&contract=${contractAddress}`
    //       );
    //       const merkleJson = await merkleData.json();
    //       const presaleMintTransaction = await contract.methods
    //         .presaleMint(amount, merkleJson)
    //         .send({ from: window.address, value: value.toString() });
    //       if(presaleMintTransaction) {
    //         if(chain === 'rinkeby') {
    //           const url = `https://rinkeby.etherscan.io/tx/${presaleMintTransaction.transactionHash}`;
    //           const mintedContainer = document.querySelector('.minted-container');
    //           const countdownContainer = document.querySelector('.countdown');
    //           const mintedTxnBtn = document.getElementById("mintedTxnBtn");
    //           mintedTxnBtn.href = url;
    //           countdownContainer.classList.add('hidden');
    //           mintedContainer.classList.remove('hidden');
    //         }
    //         console.log("Minted successfully!", `Transaction Hash: ${presaleMintTransaction.transactionHash}`);
    //       } else {
    //         const mainText = document.getElementById("mainText");
    //         mainText.innerText = mint_failed;
    //         mintButton.innerText = button_presale_mint_whitelisted;
    //         mintButton.disabled = false;
    //
    //         console.log("Failed to mint!");
    //       }
    //     } catch(e) {
    //       const mainText = document.getElementById("mainText");
    //       mainText.innerText = mint_failed;
    //       mintButton.innerText = button_presale_mint_whitelisted;
    //       mintButton.disabled = false;
    //
    //       // console.log(e);
    //     }
    //   }
    // }

    // --------------

    // const contract = require("../artifacts/contracts/MyNFT.sol/MyNFT.json")
    // const contractAddress = "0x818F6DAC9F66c2a4AC38322BB7B66609eEbe1C90"
    // // const nftContract = new web3.eth.Contract(contract.abi, contractAddress)
    // window.contract = await new web3.eth.Contract(contractABI, contractAddress);
    //
    // async function mintNFT(tokenURI) {
    //
    //
    //     //set up your Ethereum transaction
    //     const transactionParameters = {
    //         to: contractAddress, // Required except during contract publications.
    //         from: window.ethereum.selectedAddress, // must match user's active address.
    //         'data': window.contract.methods.mintNFT(window.ethereum.selectedAddress, tokenURI).encodeABI() //make call to NFT smart contract
    //     };
    //
    //
    //     //sign transaction via Metamask
    //     try {
    //         const txHash = await window.ethereum
    //             .request({
    //                 method: 'eth_sendTransaction',
    //                 params: [transactionParameters],
    //             });
    //         return {
    //             success: true,
    //             status: "✅ Check out your transaction on Etherscan: https://ropsten.etherscan.io/tx/" + txHash
    //         }
    //     } catch (error) {
    //         return {
    //             success: false,
    //             status: "😥 Something went wrong: " + error.message
    //         }
    //     }
    //   }




    //------------------

    // const contract = require("../artifacts/contracts/MyNFT.sol/MyNFT.json")
    // const contractAddress = "0x81c587EB0fE773404c42c1d2666b5f557C470eED"
    // const nftContract = new web3.eth.Contract(contract.abi, contractAddress)
    // const nonce = await web3.eth.getTransactionCount(PUBLIC_KEY, "latest") //get latest nonce
    // //the transaction
    // const tx = {
    //   from: PUBLIC_KEY,
    //   to: contractAddress,
    //   nonce: nonce,
    //   gas: 500000,
    //   data: nftContract.methods.mintNFT(PUBLIC_KEY, tokenURI).encodeABI(),
    // }
    // const signPromise = web3.eth.accounts.signTransaction(tx, PRIVATE_KEY)
    // signPromise
    //   .then((signedTx) => {
    //     web3.eth.sendSignedTransaction(
    //       signedTx.rawTransaction,
    //       function (err, hash) {
    //         if (!err) {
    //           console.log(
    //             "The hash of your transaction is: ",
    //             hash,
    //             "\nCheck Alchemy's Mempool to view the status of your transaction!"
    //           )
    //         } else {
    //           console.log(
    //             "Something went wrong when submitting your transaction:",
    //             err
    //           )
    //         }
    //       }
    //     )
    //   })
    //   .catch((err) => {
    //     console.log(" Promise failed:", err)
    //   })



  }






  // blup
  async signData(message_json) {
    const msgParams = JSON.stringify({
      domain: {
        // Defining the chain aka Rinkeby testnet or Ethereum Main Net
        chainId: 5, //blup
        // Give a user friendly name to the specific contract you are signing for.
        name: 'Dead Artist NFT',
        // // If name isn't enough add verifying contract to make sure you are establishing contracts with the proper entity
        verifyingContract: '0xCcCCccccCCCCcCCCCCCcCcCccCcCCCcCcccccccC',//blup
        // // Just let's you know the latest version. Definitely make sure the field name is correct.
        version: '4',
      },

      // Defining the message signing data content.
      message: {
        /*
         - Anything you want. Just a JSON Blob that encodes the data you want to send
         - No required fields
         - This is DApp Specific
         - Be as explicit as possible when building out the message schema.
        */
        contents: 'Hello, Bob!',
        attachedMoneyInEth: 4.2,
        from: {
          name: 'Cow',
          wallets: [
            '0xCD2a3d9F938E13CD947Ec05AbC7FE734Df8DD826',
            '0xDeaDbeefdEAdbeefdEadbEEFdeadbeEFdEaDbeeF',
          ],
        },
        to: [
          {
            name: 'Bob',
            wallets: [
              '0xbBbBBBBbbBBBbbbBbbBbbbbBBbBbbbbBbBbbBBbB',
              '0xB0BdaBea57B0BDABeA57b0bdABEA57b0BDabEa57',
              '0xB0B0b0b0b0b0B000000000000000000000000000',
            ],
          },
        ],
      },
      // Refers to the keys of the *types* object below.
      primaryType: 'Mail',
      types: {
        // TODO: Clarify if EIP712Domain refers to the domain the contract is hosted on
        EIP712Domain: [
          { name: 'name', type: 'string' },
          { name: 'version', type: 'string' },
          { name: 'chainId', type: 'uint256' },
          { name: 'verifyingContract', type: 'address' },
        ],
        // Not an EIP712Domain definition
        Group: [
          { name: 'name', type: 'string' },
          { name: 'members', type: 'Person[]' },
        ],
        // Refer to PrimaryType
        Mail: [
          { name: 'from', type: 'Person' },
          { name: 'to', type: 'Person[]' },
          { name: 'contents', type: 'string' },
        ],
        // Not an EIP712Domain definition
        Person: [
          { name: 'name', type: 'string' },
          { name: 'wallets', type: 'address[]' },
        ],
      },
    });
    var from = window.ethereum.selectedAddress
    var params = [from, msgParams];
    var method = 'eth_signTypedData_v4';
    window.ethereum.sendAsync(
      {
        method,
        params,
        from: from,
      },
      function (err, result) {
        if (err) return console.dir(err);
        if (result.error) {
          alert(result.error.message);
          return console.error('ERROR', result);
        }
        console.log('TYPED SIGNED:' + JSON.stringify(result.result));
      }
    );
  }

}
