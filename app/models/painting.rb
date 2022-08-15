class Painting < ApplicationRecord
  belongs_to :artist

  validates :name, presence: true

end
