class UserNftsController < ApplicationController
  before_action { @section = 'mint' }

  skip_before_action :authenticate_user!, only: [:index, :get_user_nfts, :show]

  # GET /user_nfts
  def index
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
      format.json { render json: @userNfts.as_json(only: [:image_link, :ipfs_token_id]) }
    end
  end

  def show
    nft = Nft.find(params[:id])
    render partial: "show", locals: {nft: nft}
  end

end
