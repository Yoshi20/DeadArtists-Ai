Rails.application.routes.draw do

  get 'welcome' => 'welcome#index'

  get 'home' => 'home#index'

  get 'faq' => 'faq#index'

  resources :artists, only: [:index]#, :update, :destroy]

  devise_for :users, controllers: { registrations: 'users/registrations', sessions: 'users/sessions', passwords: 'users/passwords' }
  resources :users, only: [:index]#, :update, :destroy]

  root "welcome#index"

end
