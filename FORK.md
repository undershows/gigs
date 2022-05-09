Quando migrar para o repositório padrão, preciso
- Criar os segredos APP_ID e APP_PEM no repositório undershows/gigs
- O APP_PEM pode ser conseguid com o comando `cat undershowfreddy.private-key.pem | base64 -w 0 && echo`
- Adicionar branch protection rule para não poder commitar na branch main sem um PR https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/defining-the-mergeability-of-pull-requests/managing-a-branch-protection-rule
- Criar um PAT de ADMIN e colocar no segredo PAT_GH_TOKEN do repositório