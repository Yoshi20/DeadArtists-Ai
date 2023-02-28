class HomeController < ApplicationController
  before_action { @section = 'home' }

  skip_before_action :authenticate_user!, only: [:index]

  # GET /home
  def index
    demo_nft_ids = [5121, 2760, 4948, 4826, 5157, 4468, 3970]
    @demo_nft = Nft.find(demo_nft_ids.sample)
    unless @demo_nft.present?
      count = Rails.cache.fetch("nft_count", expires_in: 24.hours) do
        Nft.count
      end
      @demo_nft = Nft.offset(rand(count)).first
    end
  end

end
