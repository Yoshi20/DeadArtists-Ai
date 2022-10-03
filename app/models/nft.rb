class Nft < ApplicationRecord
  belongs_to :artist
  belongs_to :painting

  MAX_NFTS_PER_PAGE = 24

end
