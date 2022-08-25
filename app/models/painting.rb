class Painting < ApplicationRecord
  belongs_to :artist
  has_one :nft

  validates :name, presence: true

end
