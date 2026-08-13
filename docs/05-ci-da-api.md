# CI da API

O workflow `.github/workflows/ci.yml` executa em push e pull request: instala dependências com `npm ci`, inicia a API, aguarda o health check e roda a suíte Cypress de API.
