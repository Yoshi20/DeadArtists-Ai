class FaqController < ApplicationController
  before_action { @section = 'faq' }

  skip_before_action :authenticate_user!, only: [:index]

  # GET /faq
  def index

  end

end
