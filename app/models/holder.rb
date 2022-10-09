class Holder < ApplicationRecord

  validates :wallet_address, presence: true, uniqueness: true

end
