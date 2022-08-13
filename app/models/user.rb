class User < ApplicationRecord
  has_many :contacts
  has_many :devices

  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable and :omniauthable
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :trackable, :validatable

  def admin?
    self.is_admin == true
  end

end
