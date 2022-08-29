module Request

  require 'httparty'
  require 'json'

  # def self.mintNFT(userAddress)
  #   PRIVATE_KEY = 'our-metamask-private-key'
  #   PUBLIC_KEY = 'our-contract-address'
  #   nonce = self.alchemy_get_transaction_count(PUBLIC_KEY)
  #   return false if nonce.nil?
  #   tx = {
  #     from: PUBLIC_KEY,
  #     to: userAddress,
  #     nonce: nonce,
  #     gas: 500000,
  #     data: nftContract.methods.mintNFT(PUBLIC_KEY, tokenURI).encodeABI(),
  #   }
  # end

  # def self.alchemy_get_code()
  #
  # end

  # get latest nonce:
  # Request.alchemy_get_transaction_count("0xc94770007dda54cF92009BFF0dE90c06F603a09f")
  # or in the frontend:
  # const nonce = await window.ethereum.request({ method: 'eth_getTransactionCount', params: [address, "latest"] });
  def self.alchemy_get_transaction_count(address)
    transaction_count = nil
    url = "https://eth-goerli.g.alchemy.com/v2/#{ENV['ALCHEMY_API_KEY']}" #blup: goerli for now
    puts "Requesting: POST #{url}"
    begin
      resp = HTTParty.post(url,
        body: {
          id: 1,
          jsonrpc: "2.0",
          method: "eth_getTransactionCount",
          params: [address, "latest"],
        }.to_json,
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      )
      if resp.success?
        puts resp.parsed_response #blup
        transaction_count = resp.parsed_response['result'].to_i(16)
      end
    rescue OpenURI::HTTPError => ex
      puts ex
    end
    transaction_count
  end

  # Request.alchemy_get_balance('0x07b8Eed7161Fbd77da9e0276Abea19b22fc168B6')
  def self.alchemy_get_balance(userAddress)
    balance = nil
    url = "https://eth-goerli.g.alchemy.com/v2/#{ENV['ALCHEMY_API_KEY']}" #blup: goerli for now
    puts "Requesting: POST #{url}"
    begin
      resp = HTTParty.post(url,
        body: {
          id: 1,
          jsonrpc: "2.0",
          method: "eth_getBalance",
          params: [userAddress, "latest"],
        }.to_json,
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      )
      if resp.success?
        balance = (resp.parsed_response['result'].to_i(16).to_f / 1000000000000000000).round(3)
      end
    rescue OpenURI::HTTPError => ex
      puts ex
    end
    balance
  end

  def self.pinata_pin_json_to_ipfs(json_body)
    parsed_response = nil
    url = "https://api.pinata.cloud/pinning/pinJSONToIPFS"
    puts "Requesting: POST #{url}"
    begin
      resp = HTTParty.post(url,
        body: json_body,
        headers: {
          'Authorization': "Bearer #{ENV['PINATA_BEARER_TOKEN']}"
        }
      )
      if resp.success?
        parsed_response = resp.parsed_response
        puts parsed_response #blup
      end
    rescue OpenURI::HTTPError => ex
      puts ex
    end
    parsed_response
  end

  def self.pinata_ipfs_asset(asset_cid)
    parsed_response = nil
    # url = "https://gateway.pinata.cloud/ipfs/#{asset_cid}"
    url = "https://cloudflare-ipfs.com/ipfs/#{asset_cid}"
    # url = "https://ipfs.io/ipfs/#{asset_cid}"
    puts "Requesting: GET #{url}"
    begin
      resp = HTTParty.get(url)
      if resp.success?
        parsed_response = resp.parsed_response
      end
    rescue OpenURI::HTTPError => ex
      puts ex
    end
    parsed_response
  end

  def self.pinata_pinned_files()
    url = "https://api.pinata.cloud/data/pinList?status=pinned"
    puts "Requesting: GET #{url}"
    begin
      resp = HTTParty.get(url,
        headers: {
          'Authorization': "Bearer #{ENV['PINATA_BEARER_TOKEN']}"
        }
      )
      if resp.success?
        invalid_nfts = []
        # resp.parsed_response['rows'].each do |row|
        row = resp.parsed_response['rows'].first
          # if !RawNft.exists?(pinata_row_id: row['id'])
          puts pinata_row_id = row['id']

          puts file_name = row['metadata']['name'] # e.g. "Amedeo Modigliani_Reclining Nude.gif"
          puts artist_name = file_name.split('_')[0]
          puts painting_name = file_name.split('_')[1].gsub('.gif', '')

          puts artist = Artist.find_by(name: artist_name)
          # nft = Nft.new(
          #   name: file_name.gsub('_', ' vs. ').gsub('.gif', ''),
          #   description: row['description'],
          #   image_link: row['image_url'],
          #   opensea_row_id: row['id'],
          #   opensea_permalink: row['permalink'],
          #   trait_artist: traits_hash[:artist],
          #   trait_painting: traits_hash[:painting],
          #   trait_main_style: traits_hash[:main_style],
          #   trait_year_of_death: traits_hash[:year_of_death],
          #   trait_gender: traits_hash[:gender],
          #   trait_origin: traits_hash[:origin],
          #   artist_id: artist&.id,
          #   painting_id: artist.present? ? artist.paintings.find_by(name: traits_hash[:painting])&.id : nil,
          # )

          puts ipfs_asset_cid = row['ipfs_pin_hash']
          Request.pinata_ipfs_asset(ipfs_asset_cid)
          puts date_pinned = row['date_pinned']

        # end

            # artist = Artist.find_by(name: traits_hash[:artist])

          #    {"id"=>"6341c7d3-fc11-49ff-aaba-f1a54264b4b6",
          #     "ipfs_pin_hash"=>"bafybeid6y37igao64puklvyxzqy3nke27vd3cyrjwrp2k67tkvgn2kq5ym",
          #     "size"=>22269593,
          #     "user_id"=>"bce78613-e40c-4e96-8b06-c083f9442343",
          #     "date_pinned"=>"2022-07-20T07:02:34.417Z",
          #     "date_unpinned"=>nil,
          #     "metadata"=>{"name"=>"Amedeo Modigliani_Reclining Nude.gif", "keyvalues"=>{"Project"=>"DeadArtistsAI", "VersionDrop"=>"1"}},
          #     "regions"=>[{"regionId"=>"FRA1", "currentReplicationCount"=>1, "desiredReplicationCount"=>1}, {"regionId"=>"NYC1", "currentReplicationCount"=>1, "desiredReplicationCount"=>1}]},

        #
        #   if !Nft.exists?(opensea_asset_id: row['id'])
        #     artist = Artist.find_by(name: traits_hash[:artist])
        #     nft = Nft.new(
        #       name: row['name'],
        #       description: row['description'],
        #       image_link: row['image_url'],
        #       opensea_row_id: row['id'],
        #       opensea_permalink: row['permalink'],
        #       trait_artist: traits_hash[:artist],
        #       trait_painting: traits_hash[:painting],
        #       trait_main_style: traits_hash[:main_style],
        #       trait_year_of_death: traits_hash[:year_of_death],
        #       trait_gender: traits_hash[:gender],
        #       trait_origin: traits_hash[:origin],
        #       artist_id: artist&.id,
        #       painting_id: artist.present? ? artist.paintings.find_by(name: traits_hash[:painting])&.id : nil,
        #     )
        #     if nft.save
        #       puts "-> Successfully created: " + nft.name
        #     else
        #       invalid_nfts << nft.name + " -> " + nft.errors.full_messages.to_s
        #     end
        #   else
        #     puts "-> NFT already exists: " + row['name']
        #   end
        # end
        # puts "-> Couldn't create the following NFT: " + invalid_nfts.to_s if invalid_nfts.any?





        # {"count"=>70,
        #  "rows"=>
        #   [{"id"=>"6341c7d3-fc11-49ff-aaba-f1a54264b4b6",
        #     "ipfs_pin_hash"=>"bafybeid6y37igao64puklvyxzqy3nke27vd3cyrjwrp2k67tkvgn2kq5ym",
        #     "size"=>22269593,
        #     "user_id"=>"bce78613-e40c-4e96-8b06-c083f9442343",
        #     "date_pinned"=>"2022-07-20T07:02:34.417Z",
        #     "date_unpinned"=>nil,
        #     "metadata"=>{"name"=>"Amedeo Modigliani_Reclining Nude.gif", "keyvalues"=>{"Project"=>"DeadArtistsAI", "VersionDrop"=>"1"}},
        #     "regions"=>[{"regionId"=>"FRA1", "currentReplicationCount"=>1, "desiredReplicationCount"=>1}, {"regionId"=>"NYC1", "currentReplicationCount"=>1, "desiredReplicationCount"=>1}]},
        #    {"id"=>"97b7b398-883b-49f1-9c2f-0e74775b4c0c",
        #     "ipfs_pin_hash"=>"bafybeibcogrqabsb2xq52sz63mcnweuduwuiutbzv7iofervguk3uz44wy",
        #     "size"=>22363184,
        #     "user_id"=>"bce78613-e40c-4e96-8b06-c083f9442343",
        #     "date_pinned"=>"2022-07-20T06:55:27.242Z",
        #     "date_unpinned"=>nil,
        #     "metadata"=>{"name"=>"Amedeo Modigliani_Reclining Nude.gif", "keyvalues"=>{"Project"=>"DeadArtistsAI", "VersionDrop"=>"1"}},
        #     "regions"=>[{"regionId"=>"FRA1", "currentReplicationCount"=>1, "desiredReplicationCount"=>1}, {"regionId"=>"NYC1", "currentReplicationCount"=>1, "desiredReplicationCount"=>1}]},
        #    {"id"=>"bb2c4917-a253-4a25-820a-22be5d9a2fa5",
        #     "ipfs_pin_hash"=>"bafybeifxhiacaf6kir2636u23paxpcjkczwrzfytja7mx4aa7wnk3n7g3i",
        #     "size"=>21437440,
        #     "user_id"=>"bce78613-e40c-4e96-8b06-c083f9442343",
        #     "date_pinned"=>"2022-07-10T21:58:10.527Z",
        #     "date_unpinned"=>"2022-07-10T22:06:05.245Z",
        #     "metadata"=>{"name"=>"Auguste Renoir_Blonde Bather.gif", "keyvalues"=>{"Project"=>"DeadArtistsAI", "VersionDrop"=>"1"}},
        #     "regions"=>[{"regionId"=>"FRA1", "currentReplicationCount"=>0, "desiredReplicationCount"=>0}, {"regionId"=>"NYC1", "currentReplicationCount"=>0, "desiredReplicationCount"=>0}]},
        #    {"id"=>"1d9cec6a-8747-4325-8580-07c2007fb40f",
        #     "ipfs_pin_hash"=>"bafybeie33k4rpzo3xcrbhxfm2pbnpl5zejj7oqhq7bhbqjlxjqjrabq344",
        #     "size"=>24107520,
        #     "user_id"=>"bce78613-e40c-4e96-8b06-c083f9442343",
        #     "date_pinned"=>"2022-07-10T21:52:01.214Z",
        #     "date_unpinned"=>"2022-07-10T22:06:19.839Z",
        #     "metadata"=>{"name"=>"Amedeo Modigliani_Nude Sitting on a Divan.gif", "keyvalues"=>{"Project"=>"DeadArtistsAI", "VersionDrop"=>"1"}},
        #     "regions"=>[{"regionId"=>"FRA1", "currentReplicationCount"=>0, "desiredReplicationCount"=>0}, {"regionId"=>"NYC1", "currentReplicationCount"=>0, "desiredReplicationCount"=>0}]},
        #    {"id"=>"05ed3674-bbe3-44b0-b971-c9dcdce37688",
        #     "ipfs_pin_hash"=>"bafybeibcbrj5jhqvpgbierijrom6s5ko3a2l766tahzth4vmnot3wc5pb4",
        #     "size"=>25097735,
        #     "user_id"=>"bce78613-e40c-4e96-8b06-c083f9442343",
        #     "date_pinned"=>"2022-07-10T21:45:16.698Z",
        #     "date_unpinned"=>"2022-07-10T22:06:34.773Z",
        #     "metadata"=>{"name"=>"Amedeo Modigliani_Gypsy Woman with Baby.gif", "keyvalues"=>{"Project"=>"DeadArtistsAI", "VersionDrop"=>"1"}},
        #     "regions"=>[{"regionId"=>"FRA1", "currentReplicationCount"=>0, "desiredReplicationCount"=>0}, {"regionId"=>"NYC1", "currentReplicationCount"=>0, "desiredReplicationCount"=>0}]},
        #    {"id"=>"7dd0732e-f515-4fa1-a6ee-13cdaf41310a",
        #     "ipfs_pin_hash"=>"bafybeibo37lzapymttl6jhzjqr6veq6y3c5herwdsob54yhi7yeuersbny",
        #     "size"=>21289958,
        #     "user_id"=>"bce78613-e40c-4e96-8b06-c083f9442343",
        #     "date_pinned"=>"2022-07-10T21:39:01.408Z",
        #     "date_unpinned"=>"2022-07-10T22:06:38.579Z",
        #     "metadata"=>{"name"=>"Amedeo Modigliani_Reclining Nude.gif", "keyvalues"=>{"Project"=>"DeadArtistsAI", "VersionDrop"=>"1"}},
        #     "regions"=>[{"regionId"=>"FRA1", "currentReplicationCount"=>0, "desiredReplicationCount"=>0}, {"regionId"=>"NYC1", "currentReplicationCount"=>0, "desiredReplicationCount"=>0}]},
        #    {"id"=>"4760131e-96bb-404f-86b2-7707328cb937",
        #     "ipfs_pin_hash"=>"bafybeichcuedcgurdwlorphladmzpou3npbf3wwtz2z4knawwlusnwgsn4",
        #     "size"=>21855814,
        #     "user_id"=>"bce78613-e40c-4e96-8b06-c083f9442343",
        #     "date_pinned"=>"2022-07-05T21:06:03.383Z",
        #     "date_unpinned"=>"2022-07-10T22:06:42.955Z",
        #     "metadata"=>{"name"=>"Pablo Picasso_Guitar.gif", "keyvalues"=>{"Project"=>"DeadArtistsAI", "VersionDrop"=>"1"}},
        #     "regions"=>[{"regionId"=>"FRA1", "currentReplicationCount"=>0, "desiredReplicationCount"=>0}, {"regionId"=>"NYC1", "currentReplicationCount"=>0, "desiredReplicationCount"=>0}]},
        #    {"id"=>"f1addf27-9046-44bb-a980-da8a65300fa3",
        #     "ipfs_pin_hash"=>"bafybeigyeamb7txwymw2eaoaf3elsexzlcciti6v3fqh6xba2detecwayi",
        #     "size"=>30620109,
        #     "user_id"=>"bce78613-e40c-4e96-8b06-c083f9442343",
        #     "date_pinned"=>"2022-07-05T21:00:08.434Z",
        #     "date_unpinned"=>nil,
        #     "metadata"=>{"name"=>"Pablo Picasso_The Weeping Woman.gif", "keyvalues"=>{"Project"=>"DeadArtistsAI", "VersionDrop"=>"1"}},
        #     "regions"=>[{"regionId"=>"FRA1", "currentReplicationCount"=>1, "desiredReplicationCount"=>1}, {"regionId"=>"NYC1", "currentReplicationCount"=>1, "desiredReplicationCount"=>1}]},
        #    {"id"=>"4cc464b7-ae89-4fdb-b136-0b5d3b82341a",
        #     "ipfs_pin_hash"=>"bafybeiaizqknq4da42mon6wfe42i2tezmsmir3ebje55oqjwhgcgctpxhi",
        #     "size"=>32766796,
        #     "user_id"=>"bce78613-e40c-4e96-8b06-c083f9442343",
        #     "date_pinned"=>"2022-07-05T20:53:42.440Z",
        #     "date_unpinned"=>"2022-07-10T22:06:46.864Z",
        #     "metadata"=>{"name"=>"Pablo Picasso_Mediterranean Landscape.gif", "keyvalues"=>{"Project"=>"DeadArtistsAI", "VersionDrop"=>"1"}},
        #     "regions"=>[{"regionId"=>"FRA1", "currentReplicationCount"=>0, "desiredReplicationCount"=>0}, {"regionId"=>"NYC1", "currentReplicationCount"=>0, "desiredReplicationCount"=>0}]},
        #    {"id"=>"95adef10-2f98-4910-bdee-e2556954647c",
        #     "ipfs_pin_hash"=>"bafybeig7af53xayznarpgf4g5g7qh465vf7s7egjrgjtkrz2h5v5jzqkjy",
        #     "size"=>32758526,
        #     "user_id"=>"bce78613-e40c-4e96-8b06-c083f9442343",
        #     "date_pinned"=>"2022-07-05T20:38:31.788Z",
        #     "date_unpinned"=>nil,
        #     "metadata"=>{"name"=>"Pablo Picasso_Mediterranean Landscape.gif", "keyvalues"=>{"Project"=>"DeadArtistsAI", "VersionDrop"=>"1"}},
        #     "regions"=>[{"regionId"=>"FRA1", "currentReplicationCount"=>1, "desiredReplicationCount"=>1}, {"regionId"=>"NYC1", "currentReplicationCount"=>1, "desiredReplicationCount"=>1}]}]}




      end
    rescue OpenURI::HTTPError => ex
      puts ex
    end
  end





  def self.opensea_collection(collection)
    #url = "https://testnets-api.opensea.io/api/v1/assets?collection=#{collection}" blup
    url = "https://testnets-api.opensea.io/api/v1/assets?collection=deadartistsairinkeby"
    puts "Requesting: GET #{url}"
    begin
      resp = HTTParty.get(url,
        # headers: {
        #   'X-API-KEY': ENV['OPENSEA_API_KEY']
        # }
      )
      if resp.success?
        invalid_nfts = []
        resp.parsed_response['assets'].each do |asset|
          traits_hash = {}
          asset['traits'].each do |trait|
            traits_hash[trait['trait_type'].gsub(' ', '_').downcase.to_sym] = trait['value']
          end
          if !Nft.exists?(opensea_asset_id: asset['id'])
            artist = Artist.find_by(name: traits_hash[:artist])
            nft = Nft.new(
              name: asset['name'],
              description: asset['description'],
              image_link: asset['image_url'],
              opensea_asset_id: asset['id'],
              opensea_permalink: asset['permalink'],
              trait_artist: traits_hash[:artist],
              trait_painting: traits_hash[:painting],
              trait_main_style: traits_hash[:main_style],
              trait_year_of_death: traits_hash[:year_of_death],
              trait_gender: traits_hash[:gender],
              trait_origin: traits_hash[:origin],
              artist_id: artist&.id,
              painting_id: artist.present? ? artist.paintings.find_by(name: traits_hash[:painting])&.id : nil,
            )
            if nft.save
              puts "-> Successfully created: " + nft.name
            else
              invalid_nfts << nft.name + " -> " + nft.errors.full_messages.to_s
            end
          else
            puts "-> NFT already exists: " + asset['name']
          end
        end
        puts "-> Couldn't create the following NFT: " + invalid_nfts.to_s if invalid_nfts.any?
      end
    rescue OpenURI::HTTPError => ex
      puts ex
    end
  end

end
