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
    # find or create & update holder
    if @userNfts.any?
      holder = Holder.find_or_create_by(wallet_address: userAddress)
      holder.last_time_seen = DateTime.now
      holder.save(touch: false)
    end
    respond_to do |format|
      format.html { }
      format.json { render json: @userNfts.as_json(only: [:image_link, :ipfs_token_id]) }
    end

  end

  def show
    nft = Nft.find(params[:id])
    render partial: "show", locals: {nft: nft}
  end

end
