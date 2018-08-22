class LoginController < ApplicationController

  def create
    query_params = {
      client_id: ENV['CLIENT_ID'],
      response_type: 'code',
      redirect_uri: 'http://localhost:3000/auth/spotify/callback',
      scope: 'streaming user-modify-playback-state user-read-playback-state user-library-modify playlist-modify-private playlist-modify-public',
      show_dialog: true
    }

    url= 'https://accounts.spotify.com/authorize'

    redirect_to "#{url}?#{query_params.to_query}"
  end
end
