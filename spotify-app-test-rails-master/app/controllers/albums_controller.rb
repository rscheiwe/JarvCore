class AlbumsController < ApplicationController

  def index
    @albums = RSpotify::Album.search(params[:name])

    render json: @albums
  end

end
