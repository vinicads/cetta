<template>
    <div class="popup-container" v-if="showPopup" @click="closePopupOnOverlay">
        <div class="popup-content">
            <button class="close-button" @click="closePopup">&times;</button>
            <h2>Filtrar Veículos</h2>
            <div class="form-container">
                <div class="form-group">
                    <div class="form-group" style="text-align: left;">
                    <label for="filterType">Filtrar por nome:</label>
                        <input type="text" class="form-control" :placeholder="`Digite o nome`"
                            v-model="filterValue" />
                            </div>
                            <div class="form-group" style="text-align: left;">
                    <label>Motorista possui MEI</label>
                    <div>
                        <label for="mei_sim" class="radio-label">
                            <input type="radio" id="mei_sim" value="true" v-model="mei"> Sim
                        </label>
                    </div>
                    <div>
                        <label for="mei_nao" class="radio-label">
                            <input type="radio" id="mei_nao" value="false" v-model="mei"> Não
                        </label>
                    </div>
                </div>
                <div class="form-group" style="text-align: left;">
                    <label>Motorista possui ANTT</label>
                    <div>
                        <label for="antt_sim" class="radio-label">
                            <input type="radio" id="antt_sim" value="true" v-model="antt"> Sim
                        </label>
                    </div>
                    <div>
                        <label for="antt_nao" class="radio-label">
                            <input type="radio" id="antt_nao" value="false" v-model="antt"> Não
                        </label>
                    </div>
                </div>
                </div>
           
                <div class="form-group">
                    <label>Tipos de veiculo:</label>
                    <div class="checkbox-group">
                        <label v-for="tipo in tipos" :key="tipo">
                            <input type="checkbox" :value="tipo" v-model="selectedTipos" /> {{ tipo == 'TresQuartos' ?
                            '3/4' : tipo }}
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
            antt: this.currentFilters.antt || '',
            mei: this.currentFilters.mei || '',
            filterValue: this.currentFilters.filterValue || '',
            selectedTipos: this.currentFilters.selectedTipos || [],
            tipos: ['Fiorino', 'Van', 'HR', 'Iveco', 'Vuc', 'TresQuartos', 'Toco', 'Truck', 'Carreta']
        };
    },
    mounted() {
        document.body.style.overflow = 'hidden';
        document.addEventListener('keydown', this.onEscKey);
    },
    beforeUnmount() {
        document.body.style.overflow = '';
        document.removeEventListener('keydown', this.onEscKey);
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
                mei: this.mei == 'true',
                antt: this.antt == 'true',
                filterValue: this.filterValue,
                selectedTipos: this.selectedTipos
            });
            this.closePopup();
        },
        clearFilters() {
            this.antt = '';
            this.mei = '';
            this.filterValue = '';
            this.selectedTipos = [];
            this.$emit('clear-filters');
        }
    }
};
</script>

<style scoped>
.popup-container {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    background: rgba(0, 0, 0, 0.7);
    z-index: 1000;
}

.popup-content {
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

.form-container {
    display: grid;
    grid-template-columns: 1fr;
    gap: 15px;
    margin-top: 20px;
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