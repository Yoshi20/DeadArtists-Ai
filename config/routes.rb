Rails.application.routes.draw do

  get 'home' => 'home#index'

  get 'mint' => 'mint#index'
  get 'contract_address' => 'mint#contract_address'
  get 'abi' => 'mint#abi'
  get 'user_nfts' => 'mint#user_nfts'

  get 'faq' => 'faq#index'

  get 'roadmap' => 'roadmap#index'

  resources :artists

  resources :paintings

  resources :nfts

  resources :settings, only: [:index]

  devise_for :users, controllers: { registrations: 'users/registrations', sessions: 'users/sessions', passwords: 'users/passwords' }
  resources :users, only: [:index]#, :update, :destroy]

  root "home#index"

end
