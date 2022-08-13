class WelcomeController < ApplicationController
  before_action { @section = 'welcome' }

  skip_before_action :authenticate_user!, only: [:index]

  # GET /welcome
  def index

  end

end
