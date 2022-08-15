class Artist < ApplicationRecord
  has_many :paintings

  validates :name, presence: true

end
