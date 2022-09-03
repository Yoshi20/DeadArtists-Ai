require 'csv'

namespace :csv_import do

  # rake csv_import:artists_and_paintings\[/Users/jascha/Downloads/Z_KuenstlerWorkWrite.csv\]
  desc "Imports artists and paintings from given csv"
  task :artists_and_paintings, [:csv_path] => :environment do |t, args|
    args.with_defaults(csv_path: nil)
    if args.csv_path.nil?
      puts "  invalid params! Call => rake csv_import:artists_and_paintings\\[<csv_path>\\]\n\n"
      return
    end
    invalid_artists = []
    invalid_paintings = []
    csv_path = args.csv_path
    csv_text = File.read(csv_path)
    csv = CSV.parse(csv_text, :headers => true)
    csv.each do |row|
      data = row.to_hash
      # Create or update artist
      artist = Artist.find_by(name: data['artist_name'])
      artist = Artist.new unless artist.present?
      is_new_record = artist.new_record?
      artist.name = data['artist_name']
      artist.description = data['artist_description']
      artist.image_link = data['artist_image_link']
      artist.wiki_link = data['artist_wiki_link']
      artist.wikiart_link = data['artist_wikiart_link'].present? ? data['artist_wikiart_link'] : data['painting_wikiart_link'].split('/')[0..-2].join('/')
      artist.year_of_death = data['artist_year_of_death']
      artist.gender = data['artist_gender']
      artist.origin = data['artist_origin']
      if artist.save
        puts "  -> Artist successfully #{is_new_record ? 'created' : 'updated'}: " + artist.name
      else
        invalid_artists << data['artist_name'] + " -> " + artist.errors.full_messages.to_s
      end
      # Create or update painting
      painting = Painting.find_by(name: data['painting_name'])
      painting = Painting.new unless painting.present?
      is_new_record = painting.new_record?
      painting.name = data['painting_name']
      painting.description = data['painting_description']
      painting.image_link = data['painting_image_link']
      painting.wiki_link = data['painting_wiki_link']
      painting.wikiart_link = data['painting_wikiart_link']
      painting.style = data['painting_style']
      painting.content = data['painting_content']
      painting.medium = data['painting_medium']
      painting.turnover = data['painting_turnover']
      painting.rarity = data['painting_rarity']
      painting.artist = artist
      if painting.save
        puts "  -> Painting successfully #{is_new_record ? 'created' : 'updated'}: " + painting.name
      else
        invalid_paintings << data['painting_name'] + " -> " + painting.errors.full_messages.to_s
      end
    end
    puts "  -> Couldn't create the following Artists: " + invalid_artists.to_s if invalid_artists.any?
    puts "  -> Couldn't create the following Paintings: " + invalid_paintings.to_s if invalid_paintings.any?
  end

end
