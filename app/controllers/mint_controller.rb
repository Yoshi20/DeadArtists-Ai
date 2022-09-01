class MintController < ApplicationController
  before_action { @section = 'mint' }

  skip_before_action :authenticate_user!, only: [:index, :abi, :contract_address]

  # GET /mint
  def index

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

end
