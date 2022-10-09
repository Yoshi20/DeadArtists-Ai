class CreateHolders < ActiveRecord::Migration[7.0]
  def change
    create_table :holders do |t|
      t.string :wallet_address, null: false, unique: true
      t.datetime :last_time_seen

      t.timestamps
    end
  end
end
