class MintController < ApplicationController
  before_action { @section = 'mint' }

  skip_before_action :authenticate_user!, only: [:index]

  # GET /mint
  def index

  end

end
