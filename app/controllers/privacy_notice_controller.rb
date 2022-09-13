class PrivacyNoticeController < ApplicationController
  before_action { @section = 'privacy_notice' }

  skip_before_action :authenticate_user!, only: [:index]

  # GET /privacy_notice
  def index

  end

end
