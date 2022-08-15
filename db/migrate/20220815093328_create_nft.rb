class CreateNft < ActiveRecord::Migration[7.0]
  def change
    create_table :nfts do |t|
      t.timestamps
    end
    add_column :nfts, :artist_id, :bigint
    add_foreign_key :nfts, :artists
    add_column :nfts, :painting_id, :bigint
    add_foreign_key :nfts, :paintings
  end
end
