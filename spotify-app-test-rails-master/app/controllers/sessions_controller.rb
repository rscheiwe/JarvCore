class SessionsController < ApplicationController

  def create
    auth_response = request.env['omniauth.auth']
    credentials = auth_response.credentials
    @user = User.find_or_create_by(username: auth_response['uid'])
    @user.update(refresh_token: credentials['refresh_token'], access_token: credentials['token'])

    redirect_to "http://localhost:3001/success?refresh=#{credentials['refresh_token']}&expires=#{credentials['expires_at']}&token=#{credentials['token']}"
  end

  def refresh
    @user = User.find_by(refresh_token: params[:refresh_token])

    body = {
      grant_type: 'refresh_token',
      refresh_token: params[:refresh_token],
      client_id: ENV['CLIENT_ID'],
      client_secret: ENV['CLIENT_SECRET']
    }

    auth_response = RestClient.post('https://accounts.spotify.com/api/token', body)
    auth_params = JSON.parse(auth_response)

    @user.update(access_token: auth_params['access_token'])
    expires = Time.now.to_i + 3600

    render json: { access_token: auth_params['access_token'], expires: expires }
  end
end
