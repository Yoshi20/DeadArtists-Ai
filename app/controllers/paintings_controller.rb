class PaintingsController < ApplicationController
  before_action :set_painting, only: [:show, :edit, :update, :destroy]
  before_action { @section = 'database' }

  before_action :authenticate_admin!, except: [:index, :show]
  skip_before_action :authenticate_user!, only: [:index, :show]

  def index
    @artists = Artist.all.select(:id, :name)
    @paintings = Painting.includes(:artist).all.limit(50)
    @paintings = @paintings.where(artist_id: params[:artist_id]) if params[:artist_id].present?
  end

  def show

  end

  def new
    @painting = Painting.new
  end

  def edit

  end

  def create
    @painting = Painting.new(painting_params)
    respond_to do |format|
      if @painting.save
        format.html { redirect_to painting_path(@painting), notice: t('flash.notice.creating_painting') }
        format.json { render :show, status: :created, location: @painting }
      else
        format.html { render :new }
        format.json { render json: @painting.errors, status: :unprocessable_entity }
      end
    end
  end

  def update
    respond_to do |format|
      if @painting.update(painting_params)
        format.html { redirect_to painting_path(@painting), notice: t('flash.notice.updating_painting') }
        format.json { render :show, status: :ok, location: @painting }
      else
        format.html { render :edit }
        format.json { render json: @painting.errors, status: :unprocessable_entity }
      end
    end
  end

  def destroy
    respond_to do |format|
      if @painting.destroy
        format.html { redirect_to paintings_path, notice: t('flash.notice.deleting_painting') }
        format.json { head :no_content }
      else
        format.html { redirect_to paintings_path(painting: @painting), alert: t('flash.alert.deleting_painting') }
        format.json { render json: @painting.errors, status: :unprocessable_entity }
      end
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_painting
      @painting = Painting.find(params[:id])
    end

    # Only allow a list of trusted parameters through.
    def painting_params
      params.require(:painting).permit(:name, :description, :image_link, :wiki_link, :artist_id)
    end

end
