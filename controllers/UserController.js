class UserController {

    constructor(formSearch, inputUser) {
        this.formSearch = document.getElementById(formSearch);
        this.inputUserGithub = document.getElementById(inputUser);
        this.onSubmit();
        this.userGitHub = new UserGitHub();
    }

    onSubmit() {
        let isValid = false;
        this.formSearch.addEventListener('submit', event => {
            event.preventDefault();
            this.hideCardUser();
            this.hideDataTable();
            this.getValues(this.formSearch).then(result => {
                console.log('resultado no Onsubmit', result);
                isValid = false;
                if(result) {
                    isValid = true;
                    this.userGitHub.preenche(result);
                    this.showCardUser(this.userGitHub);
                } else {
                    Swal.fire('Ihhh.. Usuário não encontrado! Tente de novo! Vai que dá certo')
                }

            }).finally(() => {
                console.log('isvalid', isValid);
                if(isValid) this.preencheDataTable();
            }).catch(e => {
                console.log('erro', e);
            });
        });
    }

    preencheCard(dados){
        document.querySelector('#card-login').innerHTML = dados.login;
        document.querySelector('#card-nome').innerHTML = dados.nome;
        document.querySelector('#card-bio').innerHTML = dados.bio;
        document.querySelector('#card-seguidores').innerHTML = dados.seguidores;
        document.querySelector('#card-seguindo').innerHTML = dados.seguindo;
        document.querySelector('#card-img').src = dados.imagemUrl;
        document.querySelector('#card-repos').innerHTML = dados.numRepo;
    }

    retornaImgLang(language) {

        if(!language) return '';
        let lang = `${language}`.toLowerCase();
        switch (lang) {
            case 'java':
                lang = 'java';
                break;
            case 'html':
                lang = 'html5';
                break;
            case 'javascript':
                lang = 'js';
                break;
            case 'php':
                lang = 'php';
                break;
            case 'python':
                lang = 'python';
                break;
            case 'css':
                lang = 'css3';
                break;
            default:
                lang = '';
        }

        if(lang) {
            return `<span style="font-size: 30px"><i class="fab fa-${lang}"></i></span>`;
        }

        return language.toUpperCase();
    }

    preencheDataTable() {
        let dados;
        let self = this;
        this.getRepositories().then(result => {
            dados = result;
        }).finally(() => {
            let table = $('#tbl-repositorios').DataTable();
            table.destroy();
            this.showDataTable();

            table = $('#tbl-repositorios').DataTable({
                responsive: true,
                language: {
                    "url": "https://cdn.datatables.net/plug-ins/1.10.19/i18n/Portuguese.json"
                },
                data: dados,
                columns: [
                    {data: 'name',
                        render: function(data, type, full, meta) {
                            let titulo = `${data}`.toUpperCase();
                            return `<a href="${full.url}" target="_blank">${titulo}</a>`;
                        }},
                    {data: 'description'},
                    {data: 'language',
                        class: 'text-center',
                        render: function(data, type, full, meta) {
                            return self.retornaImgLang(data);
                        }},
                    {data: 'stars', class: 'text-center'},
                ]
            });
        });



    }

    async getValues(formSearch) {

        let user = {};
        let isValid = true;

        let username = this.inputUserGithub.value;

        if(!username){

            isValid = false;
        } else {
            this.inputUserGithub.parentElement.classList.remove('has-error');
            let url = `https://api.github.com/users/${username}`;
            let result = await Fetch.get(url);
            if(result.message) {
                isValid = false;
            }
            if(result.login) user = result;
        }

        if(!isValid){
            this.inputUserGithub.parentElement.classList.add('has-error');
            return false;
        }

        return user;
    }

    async getRepositories() {
        let repositories = [];
        let username = this.inputUserGithub.value;
        let url = `https://api.github.com/users/${username}/repos`;
        let result = await Fetch.get(url);
        result.forEach(repositorio => {

            let objRepo = {
                name: repositorio.name,
                description: repositorio.description,
                language: repositorio.language,
                stars: repositorio.stargazers_count,
                url: repositorio.html_url
            };
           repositories.push(objRepo);
        });

        return repositories;
    }



    showCardUser(dados){
        this.preencheCard(dados);
        document.querySelector('#card-user').style.display = 'block';
    }

    hideCardUser(dados){
        document.querySelector('#card-user').style.display = 'none';
    }

    showDataTable(){
        document.querySelector('#data-repos').style.display = 'block';
    }

    hideDataTable(){
        document.querySelector('#data-repos').style.display = 'none';
    }


}
