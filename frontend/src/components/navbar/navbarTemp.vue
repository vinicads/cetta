<template>
    <planosPopup v-if="showPlanosPopup" @close="closePopupPlanos" />
    <avisoCookies />
    <header id="header">
        <nav id="navbar" :class="{ 'home': $route.path == '/' }">
            <div class="logoNavbar"><router-link to="/"><img src="../../assets/icons/logo-miniatura.png" alt=""></router-link>
            </div>
            <div class="menu" @click="openMenu" id="menu">
                <div class="line1"></div>
                <div class="line2"></div>
                <div class="line3"></div>
            </div>
            <ul class="navigation" id="navigation" v-if="!isAuthenticated">

                <router-link :class="{ 'active': $route.path === '/' }" to="/">Home</router-link>
                <a @click="openPopupPlanos">Planos</a>
                <router-link :class="{ 'active': $route.path === '/sobre' }" to="/sobre">Sobre nós</router-link>
                <router-link :class="{ 'active': $route.path === '/funciona' }" to="/funciona">Como funciona</router-link>
                <router-link :class="{ 'active': $route.path === '/grupos' }" to="/grupos">Grupos</router-link>
                <div class="dropdown">

                    <a @click="toggleDropdown" @mouseenter="toggleDropdown" @mouseleave="toggleDropdown">
                        <div class="iconDropdown">
                            <div>Acesso</div>
                            <div> <i class="fa fa-arrow-down" aria-hidden="true"></i></div>
                        </div>
                    </a>
                    <div class="dropdown-content" id="dropdown" @mouseenter="toggleDropdown"
                        @mouseleave="toggleDropdown">
                        <div><router-link to="/login">Login</router-link></div>
                        <div><router-link to="/cadastro">Cadastre-se</router-link></div>
                    </div>
                </div>
            </ul>
           
            <ul class="navigation" id="navigation" v-if="isAuthenticated && perfil == 'Usuario'">

                <router-link :class="{ 'active': $route.path === '/' }" to="/">Home</router-link>
                <a @click="openPopupPlanos">Planos</a>
                <router-link :class="{ 'active': $route.path === '/grupos' }" to="/grupos">Grupos</router-link>
                <router-link :class="{ 'active': $route.path === '/sobre' }" to="/sobre">Sobre nós</router-link>
                <router-link :class="{ 'active': $route.path === '/funciona' }" to="/funciona">Como funciona</router-link>
                <div class="dropdown">

                    <a @click="toggleDropdown" @mouseenter="toggleDropdown" @mouseleave="toggleDropdown">
                        <div class="iconDropdown">
                            <div>Acesso</div>
                            <div> <i class="fa fa-arrow-down" aria-hidden="true"></i></div>
                        </div>
                    </a>
                    <div class="dropdown-content" id="dropdown" @mouseenter="toggleDropdown"
                        @mouseleave="toggleDropdown">
                        <router-link to="/meuPerfil">
                            <div>Meu Perfil</div>
                        </router-link>
                        <a @click="abrirConfig()">
                            <div>Configurações</div>
                        </a>
                        <a @click="logout()">
                            <div>Sair</div>
                        </a>
                    </div>
                </div>
            </ul>
            <ul class="navigation" id="navigation" v-if="isAuthenticated && perfil == 'Nutricionista'">

                <router-link :class="{ 'active': $route.path === '/' }" to="/">Home</router-link>
                <router-link :class="{ 'active': $route.path === '/admin/grupos' }" to="/admin/grupos">Grupos</router-link>
                <router-link :class="{ 'active': $route.path === '/sobre' }" to="/sobre">Sobre nós</router-link>
                <router-link :class="{ 'active': $route.path === '/funciona' }" to="/funciona">Como funciona</router-link>
                <div class="dropdown">

                    <a @click="toggleDropdown" @mouseenter="toggleDropdown" @mouseleave="toggleDropdown">
                        <div class="iconDropdown">
                            <div>Acesso</div>
                            <div> <i class="fa fa-arrow-down" aria-hidden="true"></i></div>
                        </div>
                    </a>
                    <div class="dropdown-content" id="dropdown" @mouseenter="toggleDropdown"
                        @mouseleave="toggleDropdown">
                        <div><router-link to="/meuPerfil">Meu Perfil</router-link></div>
                        <div><router-link to="" @click="abrirConfig()">Configurações</router-link></div>
                        <div><router-link to="" @click="logout()">Sair</router-link></div>
                    </div>
                </div>
            </ul>
            <ul class="navigation" id="navigation" v-if="isAuthenticated && perfil == 'Admin'">

                <router-link :class="{ 'active': $route.path === '/' }" to="/">Home</router-link>
                <router-link :class="{ 'active': $route.path === '/admin/grupos' }" to="/admin/grupos">Grupos</router-link>
                <router-link :class="{ 'active': $route.path === '/sobre' }" to="/sobre">Sobre nós</router-link>
                <router-link :class="{ 'active': $route.path === '/funciona' }" to="/funciona">Como funciona</router-link>
                <router-link :class="{ 'active': $route.path === '/admin/planos' }"
                    to="/admin/planos">Planos</router-link>
                <router-link :class="{ 'active': $route.path === '/admin/usuarios' }"
                    to="/admin/usuarios">Usuários</router-link>
                <router-link :class="{ 'active': $route.path === '/admin/geral' }"
                    to="/admin/geral">Sistema</router-link>
                <div class="dropdown">

                    <a @click="toggleDropdown" @mouseenter="toggleDropdown" @mouseleave="toggleDropdown">
                        <div class="iconDropdown">
                            <div>Acesso</div>
                            <div> <i class="fa fa-arrow-down" aria-hidden="true"></i></div>
                        </div>
                    </a>
                    <div class="dropdown-content" id="dropdown" @mouseenter="toggleDropdown"
                        @mouseleave="toggleDropdown">
                        <div><router-link to="/meuPerfil">Meu Perfil</router-link></div>
                        <div><router-link to="" @click="abrirConfig()">Configurações</router-link></div>
                        <div><router-link to="" @click="logout()">Sair</router-link></div>
                    </div>
                </div>
            </ul>
        </nav>
    </header>
    <configuracoesPopup @fecharConfiguracoes="closeConfiguracoes" v-if="configuracoesPopup" />
    <popupConfirmacao @fecharPagamento="closeConfirmacao" v-if="showConfirmacaoPagamentoPopup" :data="dataPagamento" />
</template>

<script>
import { useRoute } from 'vue-router';
import configuracoesPopup from '@/components/popups/config/configuracaoTemp.vue'
import store from '@/auth/autenticacao.js';
import axios from 'axios'
import planosPopup from '../dashboard/planos/planosTemp.vue'
import popupConfirmacao from '@/components/popups/popupConfirmacao.vue'
import avisoCookies from '@/components/popups/avisoCookies.vue'
import io from 'socket.io-client';
export default {
    components: {
        configuracoesPopup,
        popupConfirmacao,
        planosPopup,
        avisoCookies
    },
    watch: {
        '$route'(to, from) {
            this.closeNav();
            window.scrollTo({
                top: 0,
                left: 0,
            });
        },
        '$store.state.isVerified'(newItem, oldItem) {
            this.isAuthenticated = store.state.isAuthenticated;
            this.perfil = store.state.perfil;
            this.isVerified = newItem;
            this.verificaPagamento()
        },
        '$store.state.pagamentoAtivo'(newItem, oldItem) {
            this.conexaoWebsocket();
        },
    },
    data() {
        return {
            apiUrl: store.state.apiUrl,
            isVerified: store.state.isVerified,
            perfil: store.state.perfil,
            isAuthenticated: store.state.isAuthenticated,
            lastScrollTop: 0,
            configuracoesPopup: false,
            showConfigPopup: false,
            dataPagamento: '',
            showPlanosPopup: false,
            showConfirmacaoPagamentoPopup: false,
            socket: '',
        };
    },
    methods: {
        conexaoWebsocket() {
            const options = {
                withCredentials: true,
                transports: ['websocket'],
                secure: true,
                path: '/socket.io',
            };

            this.socket = io(`wss://localhost.com`, options);

            this.socket.on('connect', () => {
                console.log('Aguardando pagamento');
            });

            this.socket.on('paymentStatusUpdate', ({ accountId, data }) => {
                this.openConfirmacao(data)
            });

            this.socket.on('error', (error) => {
                console.log('Erro na conexão com o servidor WebSocket:', error);
            });
        },
        openPopupPlanos() {
            var html = document.documentElement;
            html.classList.add('no-scroll');
            this.showPlanosPopup = true;
        },
        closePopupPlanos() {
            var html = document.documentElement;
            html.classList.remove('no-scroll');
            this.showPlanosPopup = false;
        },
        closeConfirmacao() {
            this.showConfirmacaoPagamentoPopup = false;
        },
        openConfirmacao(data) {
            this.dataPagamento = data;
            this.showConfirmacaoPagamentoPopup = true;
        },
        async verificaPagamento() {
            await axios.get(`${store.state.apiUrl}/pagamentos/meuPlano`, {
                withCredentials: true,
                headers: {
                    'Content-Type': 'application/json'
                }
            })
                .then(async (response) => {
                    if (response.status == 200) {
                        store.commit('setPagamentoAssinatura', response.data.assinatura);
                    }
                })
                .catch((error) => {
                    return;
                });
        },
        closeConfiguracoes() {
            this.configuracoesPopup = false;
        },
        toggleDropdown() {
            let windowWidth = window.innerWidth;

            if (windowWidth > 852) {
                let dropdown = document.getElementById('dropdown');
                if (event.type === 'mouseenter') {
                    dropdown.style.display = 'block'
                    dropdown.classList.add('show');
                    dropdown.classList.remove('leave');
                } else if (event.type === 'mouseleave') {
                    dropdown.classList.remove('show');
                    dropdown.addEventListener('animationend', () => this.handleAnimationEnd(event));
                    dropdown.classList.add('leave');
                }
            } else {
                if (event.type === 'click') {
                    if (dropdown.classList.contains('show')) {
                        dropdown.classList.remove('show');
                        dropdown.addEventListener('animationend', () => this.handleAnimationEnd(event));
                        dropdown.classList.add('leave');
                    } else {
                        dropdown.style.display = 'block'
                        dropdown.classList.add('show');
                        dropdown.classList.remove('leave');
                    }

                }
            }
        },
        closeNav() {
            var navigation = document.getElementById('navigation')
            var menu = document.getElementById('menu')
            var dropdown = document.getElementById('dropdown')
            dropdown.classList.remove('show')
            dropdown.classList.add('leave')
            menu.classList.remove('changeMenu')
            let navbar = document.getElementById('navbar');
            let windowWidth = window.screen.width;
            if (windowWidth <= 852) {
                navbar.classList.add('fixed', 'animate-in')
            }
            var html = document.documentElement;
            navigation.classList.remove('menuOpen');
            navigation.classList.add('closeMenu');
            navigation.addEventListener('animationend', () => this.handleAnimationEnd(event));
            html.classList.remove('no-scroll');
        },
        toggleNavbar() {
            let navbar = document.getElementById('navbar');
            let windowWidth = window.screen.width;
            let value = window.scrollY;
            let currentScroll = window.pageYOffset || document.documentElement.scrollTop;

            if (navbar) {

                if (windowWidth > 852) {
                    if (currentScroll < this.lastScrollTop) {

                        navbar.classList.add('animate-out');
                        navbar.addEventListener('animationend', () => this.handleAnimationEnd(event));
                        this.lastScrollTop = currentScroll <= 0 ? 0 : currentScroll;
                        return;
                    }

                    this.lastScrollTop = currentScroll <= 0 ? 0 : currentScroll;
                    if (value > 200) {
                        navbar.classList.remove('animate-out');
                        navbar.classList.add('fixed');
                        navbar.classList.add('animate-in');
                        navbar.addEventListener('animationend', () => this.handleAnimationEnd(event));
                    } else {
                        navbar.classList.remove('animate-in');
                        navbar.classList.add('animate-out');
                        navbar.addEventListener('animationend', () => this.handleAnimationEnd(event));
                    }
                }
            }
        },
        handleAnimationEnd(event) {
            let navbar = document.getElementById('navbar');
            var navigation = document.getElementById('navigation')
            let dropdown = document.getElementById('dropdown');
            if (event.animationName.startsWith('reverseFixedNavbar')) {
                navbar.classList.remove('animate-in');
                navbar.classList.remove('fixed');
                navbar.classList.remove('animate-out');
                navbar.removeEventListener('animationend', () => this.handleAnimationEnd);
            }
            if (event.animationName.startsWith('closeMenu')) {
                navigation.style.display = 'none'
                navigation.removeEventListener('animationend', () => this.handleAnimationEnd);
            }

            if (event.animationName.startsWith('closeDropdown')) {
                dropdown.style.display = 'none'
                dropdown.removeEventListener('animationend', () => this.handleAnimationEnd);
            }
        },
        openMenu() {
            var navigation = document.getElementById('navigation')
            var menu = document.getElementById('menu')
            navigation.classList.toggle('menuOpen')
            var html = document.documentElement;
            menu.classList.toggle('changeMenu')
            if (navigation.classList.contains('menuOpen')) {
                navigation.classList.remove('closeMenu');
                navigation.style.display = 'flex'
                html.classList.add('no-scroll');
            } else {
                navigation.classList.add('closeMenu');
                navigation.addEventListener('animationend', () => this.handleAnimationEnd(event));
                html.classList.remove('no-scroll');
            }
            this.showLinks()
        },
        showLinks() {
            var links = document.querySelectorAll('.navigation li')
            links.forEach((link, index) => {
                link.style.animation
                    ? link.style.animation = ''
                    : link.style.animation = `changeLinks ${index / 1 * 0.8}s forwards`
            });
        },
        handleResize() {
            const html = document.documentElement;
            const windowWidth = window.innerWidth;
            const navigation = document.getElementById('navigation');
            let dropdown = document.getElementById('dropdown');
            if (dropdown.classList.contains('show')) {
                dropdown.classList.remove('show');
                dropdown.addEventListener('animationend', () => this.handleAnimationEnd(event));
                dropdown.classList.add('leave');
            }
            if (windowWidth > 852) {
                html.classList.remove('no-scroll');
                navigation.style.display = 'flex';
            }
            this.closeNav()
        },
        abrirConfig() {
            this.configuracoesPopup = true;
        },
        async logout() {
            await axios.get(`${store.state.apiUrl}/login/logout`, {
                withCredentials: true,
                headers: {
                    'Content-Type': 'application/json'
                }
            })
                .then(async (response) => {
                    window.location.reload();
                })
                .catch((error) => {
                    console.log(error)
                    window.location.reload();
                });
        },
    },
    mounted() {
        this.closeNav();
        if (store.state.pagamentoAtivo) {
            this.conexaoWebsocket()
        }
        window.addEventListener('scroll', () => this.toggleNavbar());
        window.addEventListener('resize', this.handleResize);
    },
    beforeUnmount() {
        window.removeEventListener('scroll', () => this.toggleNavbar());
        window.removeEventListener('resize', this.handleResize);
    },

}
</script>

<style scoped>
nav {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    display: flex;
    justify-content: space-around;
    align-items: center;
    z-index: 100;
    height: 7rem;

    letter-spacing: 2px;
    color: #fff;
    background: radial-gradient(circle, #07608a 0%, var(--cor-principal) 100%);
}

nav.fixed::after {
    left: 0;
    content: '';
    position: absolute;
    bottom: 0;
    background-color: var(--cor-quaternaria);
    width: 100%;
    height: 2px;
    box-shadow: var(--cor-quaternaria) 0px 2px 8px 0px;
}


nav.home:not(.fixed) {
    background: none;
    background-color: transparent;
}


.dropdown {
    position: relative;
}

.iconDropdown {
    display: flex;
    justify-content: space-between;
}

.iconDropdown i {
    margin-left: 0.5vw;
}

.dropdown-content {
    display: none;
    position: absolute;
    text-align: left;
    min-width: 15vw;
    left: -50%;
    z-index: 1000;
    background-color: #fff;
    -webkit-box-shadow: 0px 10px 13px -7px #000000, 5px 5px 15px 5px rgba(0, 0, 0, 0);
    box-shadow: 0px 10px 13px -7px #000000, 5px 5px 15px 5px rgba(0, 0, 0, 0);
    border-radius: 10px;
    padding: 5%;
}

.dropdown-content.show {
    animation: 0.5s forwards ease-in-out openDropdown;
}

.dropdown-content.leave {
    animation: 0.5s forwards ease-in-out closeDropdown;
}

@keyframes openDropdown {
    from {
        opacity: 0;
    }

    to {
        opacity: 1;
    }
}

@keyframes closeDropdown {
    from {
        opacity: 1;
    }

    to {
        opacity: 0;
    }
}

.dropdown-content div {
    padding: 3%;
    text-align: left;
    border-bottom: 1px solid #d9d9d9;
}

.dropdown-content a {
    margin: 0 !important;
    color: #000 !important;
    text-align: left;
}

.dropdown-content a::after {
    background-color: transparent !important;
}

.active {
    border-bottom: 2px solid var(--cor-quaternaria);
}

.fixed {
    position: fixed;
    transform: translateY(-100%);
    z-index: 1000;
    background-color: var(--cor-principal) !important;
    transition: 0.5s ease-in-out;
}


.fixed.animate-in {
    animation: 0.5s forwards ease-in-out fixedNavbar;
}

.fixed.animate-out {
    animation: 0.5s forwards ease-in-out reverseFixedNavbar;
}



@keyframes fixedNavbar {
    from {
        opacity: 0;
        transform: translateY(-100%);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
}

@keyframes reverseFixedNavbar {
    from {
        opacity: 1;
        transform: translateY(0);
    }

    to {
        opacity: 0;
        transform: translateY(-100%);
    }

}

ul {
    margin: 0 !important;
}

.logoNavbar {
    padding: 1%;
    width: 12rem;
}

.logoNavbar img {
    width: 100%;
    height: auto;
}

.navigation {
    display: flex;
    align-items: center;
    justify-content: center;
}

.navigation:hover a {
    opacity: 0.8;
}

li {
    list-style: none;
}

.navigation a,
.dropdown {
    text-align: center;
    text-decoration: none;
    color: white;
    margin-inline: 1.5vw;
    font-weight: 600;
    font-size: 1em;
    list-style: none;
    opacity: 1;
    position: relative;
}

.navigation a::after {
    content: "";
    width: 0;
    height: 2px;
    background-color: var(--cor-quaternaria);
    position: absolute;
    bottom: 0;
    left: 0;
    transition: 0.3s ease-in-out;
}

.navigation a:hover {
    cursor: pointer;
    opacity: 1;
}

.navigation a:not(.active):hover::after {
    width: 100%;
}

.menu {
    display: none;
}

.menu:hover {
    cursor: pointer;
}

.menu div {
    background-color: #fff;
    height: 2px;
    width: 32px;
    margin: 8px;
    transition: 0.3s;
}


@media (max-width: 1440px) {

    .title {
        width: 40% !important;
        font-size: 2rem;
    }
}
@media (max-width: 852px) {

    .flag {
        padding-inline-start: 2%;
        font-size: 18px !important;
    }

    .title {
        width: 70% !important;
        font-size: 1.5rem;
    }


    .iconDropdown i {
        margin-left: 0 !important;
    }

    .dropdown {
        text-align: left;
        margin: 0 !important;
        margin-block: auto !important;
        display: flex;
        flex-direction: column;
        width: 100%;
    }

    .dropdown a {
        text-align: left;
    }

    .dropdown-content {
        -webkit-box-shadow: none;
        box-shadow: none;
        display: none;
        position: relative;
        background: none;
        left: 0;
        width: 100%;
        padding: 0;
        overflow-y: auto;
        height: 25vh;
    }

    .dropdown-content div {
        background-color: var(--cor-secundaria);
        margin-block: 1.5%;
        border-radius: 5px;
        text-align: left;
        padding: 2%;
    }

    body {
        overflow-x: hidden;
    }

    nav {
        top: 0;
        left: 0;
        width: 100%;
        background-color: var(--cor-principal) !important;
        z-index: 1000;
    }


    .navigation {
        position: fixed;
        top: 7rem;
        right: 0;
        background-color: var(--cor-principal);
        width: 100vw;
        height: calc(100vh - 7rem);
        overflow-y: auto;
        opacity: 0;
        flex-direction: column;
        padding-bottom: 25%;
        align-items: start;
        padding-inline: 5%;
        justify-content: start;
        transition: 0.3s ease-in;
        display: none;
    }


    .navigation a {
        color: #fff !important;
        margin-block: auto;
        text-align: left;
        width: 100%;
        margin-inline: 0 !important;
    }

    .social {
        display: none;
    }

    nav {
        justify-content: space-between;
        padding-inline: 1rem;
    }


    .navigation.menuOpen {
        animation: 0.5s forwards ease-in-out openMenu;
    }

    .navigation.closeMenu {
        animation: 0.5s forwards ease-in-out closeMenu;
    }

    @keyframes openMenu {
        from {
            opacity: 0;
        }

        to {
            opacity: 1;
        }
    }

    @keyframes closeMenu {
        from {
            opacity: 1;
        }

        to {
            opacity: 0;
        }
    }

    .menu {
        display: block;
    }

    .menu.changeMenu .line1 {
        transform: rotate(-45deg) translate(-8px, 8px);
    }

    .menu.changeMenu .line2 {
        opacity: 0;
    }

    .menu.changeMenu .line3 {
        transform: rotate(45deg) translate(-5px, -7px);
    }

    @keyframes changeLinks {
        from {
            transform: translateX(50px);
            opacity: 0;
        }

        to {
            transform: translateX(0);
            opacity: 1;
        }
    }

}

</style>