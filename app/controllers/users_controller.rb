class UsersController < ApplicationController
  # before_action :authenticate_user!
  # before_action :authenticate_admin!, only: [:index]
  # before_action :set_user, only: [:update, :destroy]
  before_action { @section = 'users' }

  skip_before_action :authenticate_user!, only: [:index]

  def index
    if current_user.present?
      redirect_to edit_user_registration_path
    else
      redirect_to new_user_registration_path
    end
  end

  # # GET /users
  # # GET /users.json
  # def index
  #   @users = User.all.order(created_at: :desc)
  # end
  #
  # # PATCH/PUT /users/1
  # # PATCH/PUT /users/1.json
  # def update
  #   respond_to do |format|
  #     if current_user.admin? and @user.update(user_params)
  #       format.html { redirect_to users_path, notice: t('flash.notice.updating_user') }
  #       format.json { render :show, status: :ok, location: @user }
  #     else
  #       format.html { redirect_to users_path, alert: t('flash.alert.updating_user') }
  #       format.json { render json: @user.errors, status: :unprocessable_entity }
  #     end
  #   end
  # end
  #
  # # DELETE /users/1
  # # DELETE /users/1.json
  # def destroy
  #   if current_user.admin? or current_user == @user
  #     @user.destroy
  #     flash[:notice] = t('flash.notice.deleting_user')
  #   else
  #     raise 'impossibru!'
  #   end
  #   redirect_to users_path
  # end
  #
  # private
  #
  # # Use callbacks to share common setup or constraints between actions.
  # def set_user
  #   @user = User.find(params[:id])
  # end
  #
  # # Never trust parameters from the scary internet, only allow the white list through.
  # def user_params
  #   params.require(:user).permit(:is_admin, :updated_at)
  # end

end
