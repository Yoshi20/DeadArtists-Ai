class ArtistsController < ApplicationController
  before_action :set_artist, only: [:show, :edit, :update, :destroy]
  before_action { @section = 'database' }

  before_action :authenticate_admin!, except: [:index, :show]
  skip_before_action :authenticate_user!, only: [:index, :show]

  def index
    @artists = Artist.all.limit(50)
  end

  def show

  end

  def new
    @artist = Artist.new
  end

  def edit

  end

  def create
    @artist = Artist.new(artist_params)
    respond_to do |format|
      if @artist.save
        format.html { redirect_to artist_path(@artist), notice: t('flash.notice.creating_artist') }
        format.json { render :show, status: :created, location: @artist }
      else
        format.html { render :new }
        format.json { render json: @artist.errors, status: :unprocessable_entity }
      end
    end
  end

  def update
    respond_to do |format|
      if @artist.update(artist_params)
        format.html { redirect_to artist_path(@artist), notice: t('flash.notice.updating_artist') }
        format.json { render :show, status: :ok, location: @artist }
      else
        format.html { render :edit }
        format.json { render json: @artist.errors, status: :unprocessable_entity }
      end
    end
  end

  def destroy
    respond_to do |format|
      if @artist.destroy
        format.html { redirect_to artists_path, notice: t('flash.notice.deleting_artist') }
        format.json { head :no_content }
      else
        format.html { redirect_to artists_path(artist: @artist), alert: t('flash.alert.deleting_artist') }
        format.json { render json: @artist.errors, status: :unprocessable_entity }
      end
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_artist
      @artist = Artist.find(params[:id])
    end

    # Only allow a list of trusted parameters through.
    def artist_params
      params.require(:artist).permit(:name, :description, :image_link, :wiki_link)
    end

end
