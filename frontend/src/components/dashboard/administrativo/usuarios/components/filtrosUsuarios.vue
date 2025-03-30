<template>
    <div class="popup-mobile" v-if="showPopup" @click="closePopupOnOverlay">
        <div class="popup-content">
            <button class="close-button" @click="closePopup">&times;</button>
            <h2>Filtros</h2>
            <div class="form-container">
                <div class="form-group">
                    <label for="nome">Nome</label>
                    <input type="text" class="form-control" id="nome" maxlength="45" v-model="nome" required>
                </div>
                <div class="form-group">
                    <label for="email">E-mail</label>
                    <input type="email" class="form-control" id="email" maxlength="100" v-model="email" required>
                </div>
                <div class="form-group">
                    <label for="idadeInicio">Idade Mínima</label>
                    <input type="number" class="form-control" id="idadeInicio" v-model="idadeInicio" required>
                </div>

                <div class="form-group">
                    <label for="idadeFim">Idade Máxima</label>
                    <input type="number" class="form-control" id="idadeFim" required v-model="idadeFim">
                </div>
                <div class="form-group">
                    <label>Perfil</label>
                    <div>
                        <label for="Usuario" class="radio-label">
                            <input type="radio" id="Usuario" value="Usuario" v-model="perfil"> Usuário
                        </label>
                    </div>
                    <div>
                        <label for="Nutricionista" class="radio-label">
                            <input type="radio" id="Nutricionista" value="Nutricionista" v-model="perfil">Nutricionista
                        </label>
                    </div>
                    <div>
                        <label for="Admin" class="radio-label">
                            <input type="radio" id="Admin" value="Admin" v-model="perfil"> Admin
                        </label>
                    </div>
                </div>
            </div>
            <div class="buttons">
                <button @click="clearFilters">Excluir Filtros</button>
                <button @click="applyFilters">Aplicar Filtros</button>
            </div>
        </div>
    </div>
</template>

<script>
import { fieldCollector, resetFieldBorders, removeField, verificaCEP, MascaraCPF, colarCPF, MascaraCNPJ, colarCNPJ, colarCEP, MascaraCEP, MascaraCelular, colarCelular, validarCnpj, RemoveMascaraCPF, RemoveMascaraCEP, RemoveMascaraContato } from '@/utils/utils.js'
export default {
    props: {
        showPopup: Boolean,
        currentFilters: {
            type: Object,
            default: () => ({})
        }
    },
    data() {
        return {
            isMobile: window.innerWidth < 768,
            nome: this.currentFilters.nome || '',
            email: this.currentFilters.email || '',
            idadeInicio: this.currentFilters.idadeInicio || '',
            idadeFim: this.currentFilters.idadeFim || '',
            perfil: this.currentFilters.perfil || '',
        };
    },
    mounted() {
        window.addEventListener('resize', () => {
            this.isMobile = window.innerWidth < 768;
        });
        document.body.style.overflow = 'hidden';
        document.addEventListener('keydown', this.onEscKey);
    },
    beforeUnmount() {
        document.body.style.overflow = '';
        document.removeEventListener('keydown', this.onEscKey);
        window.removeEventListener('resize', () => {
            this.isMobile = window.innerWidth < 768;
        });
    },
    methods: {
        onEscKey(event) {
            if (event.key === 'Escape') {
                this.closePopup();
            }
        },

        closePopup() {
            this.$emit('close');
        },
        closePopupOnOverlay(event) {
            if (event.target === event.currentTarget) {
                this.closePopup();
            }
        },
        applyFilters() {
            this.$emit('apply-filters', {
                nome: this.nome,
                email: this.email,
                idadeInicio: this.idadeInicio,
                idadeFim: this.idadeFim,
                perfil: this.perfil,
            });
            this.closePopup();
        },
        clearFilters() {
            this.nome = '';
            this.email = '';
            this.idadeInicio = '';
            this.idadeFim = '';
            this.perfil = '';
            this.$emit('clear-filters');
            this.closePopup();
        }
    }
};
</script>

<style scoped>
.popup-mobile {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.7);
    z-index: 1000;
    display: flex;
    justify-content: center;
    align-items: center;
}

.popup-mobile .popup-content {
    z-index: 1001;
    position: relative;
    background: var(--cor-branco);
    padding: 20px;
    border-radius: 10px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    width: 95%;
    max-width: 600px;
    text-align: left;
    max-height: 90vh;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    color: var(--cor-preto);
}

h2 {
    font-size: 2rem;
    font-weight: bold
}

.popup-desktop {
    border: 1px solid rgba(82, 82, 82, 0.116);
    width: auto;
}

.popup-desktop .popup-content {
    position: relative;
    padding: 20px 0;
    border-radius: 10px;
    width: 100%;
    text-align: left;
    min-height: 90vh;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    color: var(--cor-preto);
}

.close-button {
    position: absolute;
    top: 10px;
    right: 10px;
    background: none;
    border: none;
    font-size: 1.5rem;
    cursor: pointer;
    color: var(--cor-texto);
}

.popup-desktop .form-container {
    grid-template-columns: 1fr;
    gap: 0;
    width: 100%;
}

.form-container {
    display: grid;
    grid-template-columns: 1fr;
    gap: 15px;
    margin-top: 20px;
}


.popup-desktop .form-group {
    border: 1px solid rgba(82, 82, 82, 0.116);
    width: 100%;
    padding: 5% 5%;
    min-height: 10rem;
    margin: 0;
    justify-content: center;
    gap: 10px;
}

.form-group {
    display: flex;
    flex-direction: column;
}

.input-group {
    display: flex;
    gap: 10px;
}

.form-control {
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 5px;
    width: 100%;
    transition: border-color 0.3s;
}

.form-control:focus {
    border-color: var(--cor-principal);
    outline: none;
}

.checkbox-group {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
}

.checkbox-group label {
    display: flex;
    align-items: center;
    width: 100%;
}

.checkbox-group input[type="checkbox"] {
    position: relative;
    appearance: none;
    -webkit-appearance: none;
    width: 15px;
    height: 15px;
    border: 1px solid #00000031;
    transition: border-color 0.3s ease;
    box-sizing: border-box;
    cursor: pointer;
    accent-color: var(--cor-principal) !important;
    border-radius: none !important;
    margin-right: 2%;
}

.checkbox-group input[type="checkbox"]:checked::after {
    content: "";
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 10px;
    height: 10px;
    accent-color: var(--cor-principal) !important;
    background-color: var(--cor-principal);
    transition: background-color 0.3s ease;
    box-sizing: border-box;
}

.buttons {
    display: flex;
    justify-content: space-between;
    margin-top: 20px;
}

.buttons button {
    border-radius: 5px;
    border: none;
    padding: 10px 20px;
    cursor: pointer;
    transition: background-color 0.3s;
    box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1), 0px 1px 3px rgba(0, 0, 0, 0.08);
}

.buttons button:first-of-type {
    background-color: var(--cor-preto);
    border: 1px solid var(--cor-preto);
    color: white;
}

.buttons button:first-of-type:hover {
    background-color: transparent;
    color: var(--cor-preto);
}

.buttons button:last-of-type {
    background-color: var(--cor-principal);
    border: 1px solid var(--cor-principal);
    color: white;
}

.buttons button:last-of-type:hover {
    background-color: transparent;
    color: var(--cor-principal);
}

.popup-desktop .buttons {
    justify-content: center;
    gap: 10px;
}

.popup-desktop .buttons button {
    padding: 10px 10px;
}

select {
    padding: 5px !important;
    border: 2px solid var(--cor-principal);
    border-radius: 5px;
    width: 100%;
    appearance: none;
    -webkit-appearance: none;
    background-color: var(--cor-branco);
    color: var(--cor-preto);
    cursor: pointer;
    background-image: url('data:image/svg+xml;utf8,<svg fill="none" viewBox="0 0 24 24" stroke="currentColor" xmlns="http://www.w3.org/2000/svg" width="20" height="20"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>');
    background-repeat: no-repeat;
    background-position: right 10px center;
    background-size: 12px;
}

select:hover,
select:focus {
    border-color: var(--cor-principal);
    outline: none;
}

select option {
    background-color: var(--cor-branco);
    color: var(--cor-preto);
}

select option:hover {
    background-color: var(--cor-principal) !important;
    color: white;
}

input[type="radio"] {
    position: relative;
    appearance: none;
    -webkit-appearance: none;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    border: 2px solid var(--cor-principal);
    transition: border-color 0.3s ease;
    box-sizing: border-box;
}

input[type="radio"]:checked::after {
    content: "";
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background-color: var(--cor-principal);
    transition: background-color 0.3s ease;
    box-sizing: border-box;
}

.radio-label {
    display: flex;
    align-items: center;
    gap: 10px;
}


@media (min-width: 768px) {
    .form-container {
        grid-template-columns: 1fr 1fr;
    }

    .checkbox-group label {
        width: 45%;
    }
}

@media (max-width: 767px) {
    .form-container {
        grid-template-columns: 1fr;
    }

    .checkbox-group label {
        width: 100%;
    }

    .buttons {
        flex-direction: column;
        gap: 10px;
    }

    .buttons button {
        width: 100%;
    }
}
</style>