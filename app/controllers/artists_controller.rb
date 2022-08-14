class ArtistsController < ApplicationController
  before_action { @section = 'artists' }

  skip_before_action :authenticate_user!, only: [:index]

  # GET /artists
  def index

  end

end
