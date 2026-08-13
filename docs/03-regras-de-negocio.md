# Regras de negócio

Consultas exigem JWT; mutações exigem perfil `admin`. Cadastro público sempre atribui `user` e nunca retorna senha. Colaboradores têm e-mail único, data de nascimento não futura e endereço completo. Datas exigem colaborador existente e tipo `BIRTHDAY`, `MOTHERS_DAY`, `FATHERS_DAY` ou `OTHER`. Presentes têm preço maior que zero. Envios exigem todos os relacionamentos e começam em `PENDING`.

Transições: `PENDING → ORDERED/CANCELLED`, `ORDERED → SHIPPED/CANCELLED`, `SHIPPED → DELIVERED/CANCELLED`. Estados `DELIVERED` e `CANCELLED` são finais.
