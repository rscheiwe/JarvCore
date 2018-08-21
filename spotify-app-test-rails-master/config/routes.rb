Rails.application.routes.draw do
  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html

  get '/tracks/:name', to: 'tracks#index'
  get '/albums/:name', to: 'albums#index'
  get '/auth/spotify/callback', to: 'sessions#create'
  post '/refresh', to: 'sessions#refresh'

  get '/login', to: 'login#create'

  get '/users/:id', to: 'users#show'

end
