class MintController < ApplicationController
  before_action { @section = 'mint' }

  skip_before_action :authenticate_user!, only: [:index, :abi, :contract_address, :user_nfts, :whitelist_addresses]

  # GET /mint
  def index
    count = Rails.cache.fetch("nft_count", expires_in: 24.hours) do
      Nft.count
    end
    @randomNft = Nft.select(:image_link).offset(rand(count)).first
  end

  def contract_address
    render plain: ENV['CONTRACT_ADDRESS']
  end

  def abi
    contractAddress = params[:contractAddress]
    contractAddress = ENV['CONTRACT_ADDRESS'] if contractAddress.nil?
    abi = Rails.cache.fetch("abi_#{contractAddress}") do
      Request.eatherscan_get_abi(contractAddress)
    end
    render plain: abi
  end

  def user_nfts
    contractAddress = params[:contractAddress]
    contractAddress = ENV['CONTRACT_ADDRESS'] if contractAddress.nil?
    userAddress = params[:userAddress]
    nftData = Request.alchemy_get_NFTs(contractAddress, userAddress, false)
    token_ids = []
    nftData.each do |nft|
      token_ids << nft['id']['tokenId'].to_i(16)
    end
    nfts = Nft.where(ipfs_token_id: token_ids)
    render json: nfts.as_json(
      only: [
        :id,
        :image_link,
        :collectible_link,
        :ipfs_token_id,
        :ipfs_token_uri,
        :ipfs_image_uri,
        :trait_rarity,
      ]
    )
  end

  def whitelist_addresses
    render plain: 'Az' + Base64.encode64(ENV['WHITELIST_ADDRESSES'].to_s) # prefix a random string to make base64 decoding harder
  end

end
