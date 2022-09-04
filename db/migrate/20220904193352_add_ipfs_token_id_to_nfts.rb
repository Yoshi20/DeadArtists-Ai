class AddIpfsTokenIdToNfts < ActiveRecord::Migration[7.0]
  def change
    add_column :nfts, :ipfs_token_id, :bigint
    add_column :nfts, :ipfs_token_uri, :string
    add_column :nfts, :ipfs_image_uri, :string
  end
end
