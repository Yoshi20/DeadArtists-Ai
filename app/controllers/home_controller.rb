class HomeController < ApplicationController
  before_action { @section = 'home' }

  skip_before_action :authenticate_user!, only: [:index]

  # GET /home
  def index
    count = Rails.cache.fetch("nft_count", expires_in: 24.hours) do
      Nft.count
    end
    @demo_nft = Nft.offset(rand(count)).first
  end

end
