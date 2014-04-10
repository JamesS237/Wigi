class BaseGitControllerController < ActionController::Base

  around_action :repo_initialize

  def repo_initialize
    @repo = Rugged::Repository.new(Rails.root.to_s + APP_CONFIG[Rails.env]["PAGES_PATH"])
    yield
  end

  def repo
    @repo
  end

  def all_pages
    head = repo.lookup(repo.head.target)
    YAML.load find_file("pages.yml")
  end

  def find_file(file, commit = repo.lookup(repo.head.target)) # I love how horrible this is
    oid = ""
    commit.tree.each do |object|
      if object[:name] == file
        oid = object[:oid]
        break
      end
    end

    repo.read(oid).data
  end

  def find_page(page)
    object = []
    pages = all_pages
    pages["pages"].each do |entry|
      if entry[0] == page
        object = [entry[0], entry[1]["file"]]
        break
      end
    end
    object
  end
end
