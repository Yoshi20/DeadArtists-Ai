class TermsController < ApplicationController
  before_action { @section = 'terms' }

  skip_before_action :authenticate_user!, only: [:index]

  # GET /terms
  def index

  end

end
