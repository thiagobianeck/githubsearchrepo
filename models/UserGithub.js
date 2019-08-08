class UserGitHub {

    preenche(result) {
        this._login = result.login;
        this._nome = result.name;
        this._imagemUrl= result.avatar_url;
        this._bio= result.bio;
        this._seguidores= result.followers;
        this._seguindo= result.following;
        this._numRepo =result.public_repos;
    }

    get login() {
        return this._login;
    }

    get nome() {
        return this._nome;
    }

    get imagemUrl() {
        return this._imagemUrl;
    }

    get bio() {
        return this._bio;
    }

    get seguidores() {
        return this._seguidores;
    }

    get seguindo() {
        return this._seguindo;
    }

    get numRepo() {
        return this._numRepo;
    }




}