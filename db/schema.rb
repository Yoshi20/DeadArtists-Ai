# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `bin/rails
# db:schema:load`. When creating a new database, `bin/rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema[7.0].define(version: 2022_10_09_142625) do
  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "artists", force: :cascade do |t|
    t.string "name", null: false
    t.string "description"
    t.string "image_link"
    t.string "wiki_link"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "wikiart_link"
    t.integer "year_of_death"
    t.string "gender"
    t.string "origin"
  end

  create_table "holders", force: :cascade do |t|
    t.string "wallet_address", null: false
    t.datetime "last_time_seen"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "nfts", force: :cascade do |t|
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.bigint "artist_id"
    t.bigint "painting_id"
    t.string "name"
    t.string "description"
    t.string "image_link"
    t.bigint "opensea_asset_id"
    t.string "opensea_permalink"
    t.string "trait_artist"
    t.string "trait_painting"
    t.string "trait_main_style"
    t.string "trait_year_of_death"
    t.string "trait_gender"
    t.string "trait_origin"
    t.bigint "ipfs_token_id"
    t.string "ipfs_token_uri"
    t.string "ipfs_image_uri"
    t.integer "trait_movement_pattern"
    t.integer "trait_rarity"
    t.string "collectible_link"
  end

  create_table "paintings", force: :cascade do |t|
    t.string "name", null: false
    t.string "description"
    t.string "image_link"
    t.string "wiki_link"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.bigint "artist_id"
    t.string "wikiart_link"
    t.string "style"
    t.string "content"
    t.string "medium"
    t.bigint "turnover"
    t.integer "rarity"
  end

  create_table "users", force: :cascade do |t|
    t.string "email", default: "", null: false
    t.string "encrypted_password", default: "", null: false
    t.string "reset_password_token"
    t.datetime "reset_password_sent_at"
    t.datetime "remember_created_at"
    t.integer "sign_in_count", default: 0, null: false
    t.datetime "current_sign_in_at"
    t.datetime "last_sign_in_at"
    t.string "current_sign_in_ip"
    t.string "last_sign_in_ip"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.boolean "is_admin"
    t.index ["email"], name: "index_users_on_email", unique: true
    t.index ["reset_password_token"], name: "index_users_on_reset_password_token", unique: true
  end

  add_foreign_key "nfts", "artists"
  add_foreign_key "nfts", "paintings"
  add_foreign_key "paintings", "artists"
end
