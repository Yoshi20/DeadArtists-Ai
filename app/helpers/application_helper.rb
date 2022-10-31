module ApplicationHelper

  def call_types_raw
    ['phone', 'sms', 'email']
  end

  def call_types
    t(call_types_raw, scope: 'defines.call_types')
  end

  def call_types_for_select
    call_types.zip(call_types_raw)
  end

  def default_meta_tags
    {
      reverse: true,
      separator: '|',
      description: meta_tag_description(''),
      keywords: 'dead artists ai, dead artists, nft, blockchain, web3, ai, modern art, traditional art',
      canonical: request.original_url,
      noindex: !Rails.env.production?,
      icon: [
        { href: image_url('favicon.png') },
        { href: image_url('profile_pic.webp'), rel: 'apple-touch-icon', sizes: '180x180', type: 'image/webp' },
      ],
      og: {
        site_name: 'deadartists.ai',
        title: 'Dead Artists AI',
        description: meta_tag_description(''),
        type: 'website',
        url: request.original_url,
        image: image_url('profile_pic.webp')
      }
    }
  end

  def meta_tag_description(str)
    "Dead Artists AI is a NFT art project on the blockchain. It brings dead artists back to life and let them join Web3.#{str.present? ? " This is the \"#{str}\" page." : ""}"
  end

  def rarity_text(i)
    return "Unknown" if (i.nil? || i < 1 || i > 5)
    ["Legendary", "Epic", "Rare", "Uncommon", "Common"][i-1]
  end

  def movement_pattern_text(i)
    return "Unknown" if (i.nil? || i < 11 || i > 36)
    ["Blink slow", "Blink fast", "Nod", "Smile", "Eyes closed smile", "Sad", "Nod fast", "Nod smile", "Sad blink", "Eyes closed sad", "Open mouth", "Eyes closed open mouth", "Open mouth wink", "Kiss", "Eyes closed kiss", "Kiss wink", "Smile Sad", "Shake head", "Eyes closed Shake head", "Wink shake head", "Look left", "Look right", "Eyes closed look left", "Eyes closed look right", "Nod mouth open", "Shake head mouth open"][i-11]
  end

end
