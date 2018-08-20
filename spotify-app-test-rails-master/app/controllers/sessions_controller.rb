class SessionsController < ApplicationController

  def create
    auth_response = request.env['omniauth.auth']
    credentials = auth_response.credentials
    @user = User.find_or_create_by(username: auth_response['uid'])
    @user.update(refresh_token: credentials['refresh_token'], access_token: credentials['token'])

    redirect_to "http://localhost:3001/success?token=#{credentials['token']}"
  end
end
