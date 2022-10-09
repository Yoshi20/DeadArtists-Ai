class Holder < ApplicationRecord

  validates :wallet_address, presence: true, uniqueness: true

  def nfts(contractAddress = ENV['CONTRACT_ADDRESS'])
    nftData = Request.alchemy_get_NFTs(contractAddress, self.wallet_address, false)
    token_ids = []
    nftData.each do |nft|
      token_ids << nft['id']['tokenId'].to_i(16)
    end
    Nft.where(ipfs_token_id: token_ids)
  end

  def balance
    Request.alchemy_get_balance(self.wallet_address)
  end

  def transaction_count
    Request.alchemy_get_transaction_count(self.wallet_address)
  end

end
