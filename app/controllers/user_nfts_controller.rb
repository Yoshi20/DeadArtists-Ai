class UserNftsController < ApplicationController
  before_action { @section = 'mint' }

  skip_before_action :authenticate_user!, only: [:index, :show]

  # GET /user_nfts
  def index
    contractAddress = params[:contractAddress]
    contractAddress = ENV['CONTRACT_ADDRESS'] if contractAddress.nil?
    userAddress = params[:userAddress]
    return unless userAddress.present?
    nftData = Request.alchemy_get_NFTs(contractAddress, userAddress, false)
    token_ids = []
    nftData.each do |nft|
      token_ids << nft['id']['tokenId'].to_i(16)
    end
    @userNfts = Nft.where(ipfs_token_id: token_ids)
    # .select(
    #   :id,
    #   :image_link,
    #   :collectible_link,
    #   :ipfs_token_id,
    #   :ipfs_token_uri,
    #   :ipfs_image_uri,
    #   :trait_rarity,
    # )
  end

  def show
    nft = Nft.find(params[:id])
    render partial: "show", locals: {nft: nft}
  end

end
