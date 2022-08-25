class Artist < ApplicationRecord
  has_many :paintings
  has_many :nfts

  validates :name, presence: true

end
