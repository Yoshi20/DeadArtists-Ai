class ImprintController < ApplicationController
  before_action { @section = 'imprint' }

  skip_before_action :authenticate_user!, only: [:index]

  # GET /imprint
  def index

  end

end
