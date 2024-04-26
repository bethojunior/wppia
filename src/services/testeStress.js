function perguntaAleatória() {
    // Mensagens de espera
    const perguntaEspera = [
        "Como posso criar uma conta no aplicativo?",
        "Perdi minha senha, como posso redefini-la?",
        "Como atualizo meus dados pessoais no aplicativo?",
        "Estou tendo problemas para fazer login, o que devo fazer?",
        "O aplicativo tem acesso à minha localização o tempo todo?",
        "Como posso exportar os dados que inseri no aplicativo?",
        "O aplicativo está consumindo muitos dados, há uma configuração para reduzir o uso?",
        "Como posso entrar em contato com o suporte técnico através do aplicativo?",
        "Há alguma seção de ajuda ou tutoriais dentro do aplicativo?",
        "tenho 10 galinhas!",
        "se vender 2 galinhas, quantas galinhas restarão?",
        "se comprar 5 galinhas, quantas galinhas terei agora?",
        "quantos ovos uma galinha põe por dia?",
        "10 galinhas todos os dias botam 10 ovo, cada uma põe 1 por dia, quantos ovos teremos em 10 dias?",
        "quantos ovos uma galinha põe em 10 dias?",
        "quanto custa um ovo das minhas galinhas?",
        "quanto custa 10 ovos das minhas galinhas??",
        "sabia que um ovo das minhas galinhas custa 1 real, uma galinha minha pesa 2,5kg e hoje o custa 11,00 o kg.",
        "Meu nome é Betho, sou dono do app Return, tenho 30 anos e sou programador,  das 8h as 18h, a 7 anos.",
        "vc sabe meu nome?",
        "proximo ano façoa sabe quantos anos ?",
        "qual a idade de Betho?",
        "sabe como me chamo?",
        "conhce meu app?",
    ];
  
    return perguntaEspera[Math.floor(Math.random() * perguntaEspera.length)];
  
}

export { perguntaAleatória };