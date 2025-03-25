<template>
    <div class="container">
        <div class="content">
            <h1>Termos de Uso</h1>
            <p>Bem-vindo aos Termos de Uso do nosso site. Ao acessar ou usar nosso site, você concorda com estes termos.
                Por favor, leia-os cuidadosamente antes de prosseguir.</p>

            <h2>Segurança e Privacidade</h2>
            <p>Nosso site é seguro e valorizamos a privacidade dos nossos usuários. Utilizamos criptografia para
                proteger suas informações pessoais e garantir a segurança dos seus dados.</p>

            <h2>Autenticação e Uso de Cookies</h2>
            <p>Para fornecer uma experiência personalizada, podemos usar cookies para autenticar sua sessão e armazenar
                informações sobre suas preferências. Ao utilizar nosso site, você concorda com o uso de cookies de
                acordo com nossa Política de Cookies.</p>

            <h2>Vendas e Reembolso</h2>
            <p>Vendemos itens para serem usados dentro do site, como fretes, contatos e assinaturas. Por favor, esteja
                ciente de que todas as vendas são finais e não há reembolso disponível.</p>

            <h2>Cancelamento e Alteração de Assinatura</h2>
            <p>Se você optar por excluir sua conta ou alterar sua assinatura, saiba que não haverá reembolso disponível.
                Certifique-se de revisar nossos termos e condições antes de fazer qualquer alteração na sua conta.</p>

            <h2>Uso de Dados</h2>
            <p>Os dados inseridos no nosso site são usados apenas para fins de controle interno e melhoria dos nossos
                serviços. Não compartilhamos suas informações com terceiros sem o seu consentimento, a menos que seja
                necessário para fornecer os serviços solicitados por você.</p>

            <h2>Leis Aplicáveis e Regulamentos</h2>
            <p>Informamos aos nossos usuários que nosso site opera em conformidade com todas as leis e regulamentos
                aplicáveis. Estamos comprometidos em seguir a lei e garantir uma operação legítima e transparente.</p>

            <p>Estes são os principais pontos dos nossos Termos de Uso. Se tiver alguma dúvida ou preocupação, entre em
                contato conosco.</p>
        </div>
    </div>
</template>

<script>
export default {
    name: 'TermsOfUse'
};
</script>

<style scoped>
.container {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 7rem;
    padding: 20px;
}

.content {
    max-width: 800px;
}

h1,
h2 {
    margin-top: 30px;
    margin-bottom: 10px;
}

p {
    margin-bottom: 20px;
}
</style>