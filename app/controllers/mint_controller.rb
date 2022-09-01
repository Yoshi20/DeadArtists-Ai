class MintController < ApplicationController
  before_action { @section = 'mint' }

  skip_before_action :authenticate_user!, only: [:index, :abi]

  # GET /mint
  def index

  end

  def abi
    #blup: chache or make static
    render plain: Request.eatherscan_get_abi(params[:contractAddress])
  end

end
