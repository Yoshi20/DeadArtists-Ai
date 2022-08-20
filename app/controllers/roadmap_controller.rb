class RoadmapController < ApplicationController
  before_action { @section = 'roadmap' }

  skip_before_action :authenticate_user!, only: [:index]

  # GET /roadmap
  def index

  end

end
