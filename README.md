# Dead Artists AI

Dead Artists NFT web application.

## Start rails server (puma) with esbuild and cssbundling

```
bin/dev
```

## Pull prod DB - Import NFTs - Push prod DB

```
dropdb dead_artists_ai_development
# backup db auf heroku
heroku pg:pull postgresql-curved-21331 deadartists_backup_20230106 --app deadartists-ai
heroku pg:pull postgresql-curved-21331 dead_artists_ai_development --app deadartists-ai

Nft.destroy_all
Painting.destroy_all
Artist.destroy_all
rake csv_import:artists_and_paintings\[/Users/jascha/Downloads/KuenstlerNFTData.csv\]

heroku pg:push dead_artists_ai_development postgresql-curved-21331 --app deadartists-ai
```

## (Railway commands)

```
railway login
railway link # -> to link current directory with railway
railway run <cmd>
railway run rake db:migrate
railway run bin/rails server # -> to test it on http://127.0.0.1:3000
railway up # -> to deploy
railway logs
railway variables
```
