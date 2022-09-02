module Request

  require 'httparty'
  require 'json'

  def self.eatherscan_get_abi(contractAddress)
    abi = nil
    url = "https://api-goerli.etherscan.io/api?module=contract&action=getabi&apikey=#{ENV['ETHERSCAN_API_KEY']}&address=#{contractAddress}"
    puts "Requesting: GET #{url}"
    begin
      resp = HTTParty.get(url)
      if resp.success?
        abi = resp.parsed_response['result']
      end
    rescue OpenURI::HTTPError => ex
      puts ex
    end
    abi
  end

  # get latest nonce:
  # Request.alchemy_get_transaction_count("0xc94770007dda54cF92009BFF0dE90c06F603a09f")
  # or in the frontend:
  # const nonce = await window.ethereum.request({ method: 'eth_getTransactionCount', params: [address, "latest"] })
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
        puts resp.parsed_response #blup
        invalid_nfts = []
        resp.parsed_response['rows'].each do |row|
          # if !RawNft.exists?(pinata_row_id: row['id'])
          puts pinata_row_id = row['id']
          puts file_name = row['metadata']['name']
          puts ipfs_asset_cid = row['ipfs_pin_hash']
          puts date_pinned = row['date_pinned']
          puts file_type = file_name.split('.')[1]
          if file_type.present? # <file_name>.json
            # this a file
            if file_type == 'gif'
              # nothing to do
            elsif file_type == 'json'
              sleep(0.5) # rate limit is 3 requests per second
              asset = Request.pinata_ipfs_asset(ipfs_asset_cid)
              next if asset.nil?
              asset = JSON.parse(asset) if (asset.class != Hash)
              traits_hash = {}
              asset['attributes'].each do |trait|
                traits_hash[trait['trait_type'].gsub(' ', '_').downcase.to_sym] = trait['value']
              end
              if !Nft.exists?(name: asset['name'])
                artist = Artist.find_by(name: traits_hash[:artist])
                nft = Nft.new(
                  name: asset['name'],
                  description: asset['description'],
                  image_link: asset['image'],
                  # opensea_asset_id: asset['id'],
                  # opensea_permalink: asset['permalink'],
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
          else
            # this is a directory -> ignore
          end
        end
        puts "-> Couldn't create the following NFT: " + invalid_nfts.to_s if invalid_nfts.any?
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
            nft = Nft.find_by(opensea_asset_id: asset['id'])
            if nft.update(opensea_asset_id: asset['id'], opensea_permalink: asset['permalink'])
              puts "-> Successfully updated: " + nft.name
            else
              puts "-> Couldn't update: " + asset['name']
            end
          end
        end
        puts "-> Couldn't create the following NFT: " + invalid_nfts.to_s if invalid_nfts.any?
      end
    rescue OpenURI::HTTPError => ex
      puts ex
    end
  end

end
