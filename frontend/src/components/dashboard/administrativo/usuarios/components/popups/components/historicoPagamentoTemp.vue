<template>
    <div class="card p-3 shadow-sm">
        <div>
            <p><strong>Nome:</strong> {{ historicoPagamento.nome }}</p>
            <p><strong>Descrição:</strong> {{ historicoPagamento.descricao }}</p>
            <p><strong>Pago:</strong> <i
                    :class="historicoPagamento.pago ? 'fas fa-check-circle text-success' : 'fas fa-times-circle text-danger'"></i>
            </p>
            <p><strong>Valor Total:</strong> R$ {{ historicoPagamento.valorTotal.toFixed(2) }}</p>
            <p><strong>Data Início:</strong> {{ formatarData(historicoPagamento.data_inicio) }}</p>
        </div>

    </div>
</template>

<script>
import axios from 'axios';
import store from '@/auth/autenticacao';

export default {
    props: {
        historicoPagamento: Object,
    },
    data() {
        return {
            editMode: false,
            planos: [],
        };
    },
    methods: {
        formatarData(data) {
            return new Date(data).toLocaleDateString();
        },
    },
    mounted() {
      
    },
};
</script>

<style scoped>
.card {
    max-width: 100%;
    border-radius: 10px;
    position: relative;
}

.icon-button {
    width: 24px;
    height: 24px;
    cursor: pointer;
    margin-left: 8px;
}

.icon-button:hover {
    opacity: 0.7;
}

.checkbox-wrapper-4 * {
    box-sizing: border-box;
    display: flex;
    justify-content: center;
    align-items: center;
}

.checkbox-wrapper-4 .cbx {
    -webkit-user-select: none;
    user-select: none;
    cursor: pointer;
    border-radius: 6px;
    overflow: hidden;
    transition: all 0.2s ease;
    display: inline-block;
}

.checkbox-wrapper-4 .cbx:hover {
    background: rgba(0, 119, 255, 0.06);
}

.checkbox-wrapper-4 .cbx span {
    float: left;
    vertical-align: middle;
    transform: translate3d(0, 0, 0);
}

.checkbox-wrapper-4 .cbx span:first-child {
    position: relative;
    width: 18px;
    height: 18px;
    border-radius: 4px;
    transform: scale(1);
    border: 1px solid #cccfdb;
    transition: all 0.2s ease;
    box-shadow: 0 1px 1px rgba(0, 16, 75, 0.05);
}

.checkbox-wrapper-4 .cbx span:first-child svg {
    position: absolute;
    top: 3px;
    left: 2px;
    fill: none;
    stroke: #fff;
    stroke-width: 2;
    stroke-linecap: round;
    stroke-linejoin: round;
    stroke-dasharray: 16px;
    stroke-dashoffset: 16px;
    transition: all 0.3s ease;
    transition-delay: 0.1s;
    transform: translate3d(0, 0, 0);
}

.checkbox-wrapper-4 .cbx span:last-child {
    padding-left: 8px;
    line-height: 18px;
}

.checkbox-wrapper-4 .cbx:hover span:first-child {
    border-color: var(--cor-principal);
}

.checkbox-wrapper-4 .inp-cbx {
    position: absolute;
    visibility: hidden;
}

.checkbox-wrapper-4 .inp-cbx:checked+.cbx span:first-child {
    background: var(--cor-principal);
    border-color: var(--cor-principal);
    animation: wave-4 0.4s ease;
}

.checkbox-wrapper-4 .inp-cbx:checked+.cbx span:first-child svg {
    stroke-dashoffset: 0;
}

.checkbox-wrapper-4 .inline-svg {
    position: absolute;
    width: 0;
    height: 0;
    pointer-events: none;
    user-select: none;
}

@media screen and (max-width: 640px) {
    .checkbox-wrapper-4 .cbx {
        width: 100%;
        display: inline-block;
    }
}

@-moz-keyframes wave-4 {
    50% {
        transform: scale(0.9);
    }
}

@-webkit-keyframes wave-4 {
    50% {
        transform: scale(0.9);
    }
}

@-o-keyframes wave-4 {
    50% {
        transform: scale(0.9);
    }
}

@keyframes wave-4 {
    50% {
        transform: scale(0.9);
    }
}
</style>