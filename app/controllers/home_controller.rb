class HomeController < ApplicationController
  before_action { @section = 'home' }

  skip_before_action :authenticate_user!, only: [:index]

  # GET /home
  def index

  end

end
