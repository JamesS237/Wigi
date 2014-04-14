class PagesController < ApplicationController
  before_action :set_page, :only => [:index, :show, :edit, :update, :destroy]

  # GET /pages
  def index
    @pages = all_pages
  end

  # GET /pages/1
  def show
    @pages = all_pages
  end

  # GET /pages/new
  def new
    @pages = all_pages
  end

  # POST /pages
  def create
    new_page(CGI.escapeHTML(params[:title]), CGI.escapeHTML(params[:page]))
    title = params[:title].gsub(/[^0-9A-Za-z(\s)]/, '').tr(' ', '_').downcase
    redirect_to "/pages/#{title}"
  end

  # GET /pages/1/edit
  def edit
    @pages = all_pages
  end

  # PATCH/PUT /pages/1
  def update
    update_file(@url, CGI.escapeHTML(params[:page]))
    redirect_to "/pages/#{@url}"
  end

  # POST /pages/1/delete
  def destroy
    delete_page(@url)
    redirect_to "/pages"
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_page
      page = find_page(params[:id] || "main")
      @url = page[0]
      @title = page[1]
      @contents = find_file(page[2])
      @is_page = true
      @can_delete = !(page[1] == "main")
    end

    # Never trust parameters from the scary internet, only allow the white list through.
    def page_params
      params[:title, :page]
    end
end
