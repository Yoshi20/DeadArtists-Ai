class NftsController < ApplicationController
  before_action :set_nft, only: [:show, :edit, :update, :destroy]
  before_action { @section = 'nfts' }

  before_action :authenticate_admin!, except: [:index, :show]
  skip_before_action :authenticate_user!, only: [:index, :show]

  def index
    @nfts = Nft.all.limit(30)
  end

  def show

  end

  def new
    @nft = Nft.new
  end

  def edit

  end

  def create
    @nft = Nft.new(nft_params)
    respond_to do |format|
      if @nft.save
        format.html { redirect_to nft_path(@nft), notice: t('flash.notice.creating_nft') }
        format.json { render :show, status: :created, location: @nft }
      else
        format.html { render :new }
        format.json { render json: @nft.errors, status: :unprocessable_entity }
      end
    end
  end

  def update
    respond_to do |format|
      if @nft.update(nft_params)
        format.html { redirect_to nft_path(@nft), notice: t('flash.notice.updating_nft') }
        format.json { render :show, status: :ok, location: @nft }
      else
        format.html { render :edit }
        format.json { render json: @nft.errors, status: :unprocessable_entity }
      end
    end
  end

  def destroy
    respond_to do |format|
      if @nft.destroy
        format.html { redirect_to nfts_path, notice: t('flash.notice.deleting_nft') }
        format.json { head :no_content }
      else
        format.html { redirect_to nfts_path(nft: @nft), alert: t('flash.alert.deleting_nft') }
        format.json { render json: @nft.errors, status: :unprocessable_entity }
      end
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_nft
      @nft = Nft.find(params[:id])
    end

    # Only allow a list of trusted parameters through.
    def nft_params
      params.require(:nft).permit(:name, :description, :image_link, :wiki_link)
    end

end
