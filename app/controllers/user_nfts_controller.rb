class UserNftsController < ApplicationController
  before_action { @section = 'mint' }

  skip_before_action :authenticate_user!, only: [:index, :show, :get_user_nfts]

  # GET /user_nfts
  def index
  end

  # GET /user_nfts/1
  def show
    nft = Nft.find(params[:id])
    render partial: "show", locals: {nft: nft}
  end

  # GET /get_user_nfts
  def get_user_nfts
    contractAddress = params[:contractAddress]
    contractAddress = ENV['CONTRACT_ADDRESS'] if contractAddress.nil?
    userAddress = params[:userAddress]
    return unless userAddress.present?
    holder = Holder.find_or_create_by(wallet_address: userAddress)
    userNfts = holder.nfts(contractAddress) # this makes a alchemy_get_NFTs() request
    holder.last_time_seen = DateTime.now
    holder.save(touch: false)
    respond_to do |format|
      format.html { render partial: "user_nfts", locals: {userNfts: userNfts} }
      format.json { render json: userNfts.as_json(only: [:gif_link, :ipfs_token_id]) }
    end
  end

end
