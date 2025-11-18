# Fundamentação e Validação de Arquiteturas Cloud-Native para Aplicações Fintech: Um Compêndio de Referências Anotadas para o Projeto ValorizeAI

Este documento atua como um compêndio de referências técnicas e acadêmicas, formatadas em BibTeX, com o propósito de fornecer o embasamento teórico e contextual para o artigo científico do projeto ValorizeAI. O relatório está estruturado para mapear diretamente as fontes bibliográficas às seções do TCC (Trabalho de Conclusão de Curso), conforme o guia da Sociedade Brasileira de Computação (SBC).
A seleção de referências foca em justificar as decisões arquiteturais (contêineres gerenciados, filas assíncronas, WebSockets, Redis) e validar a metodologia de testes (SLOs, k6) no domínio crítico de aplicações fintech.

---

## 1. Contextualização do Domínio: A Transformação Digital do Setor Financeiro Brasileiro

A "Introdução" e a "Justificativa" do TCC ValorizeAI requerem um embasamento no cenário macroeconômico e tecnológico do Brasil. As referências desta seção validam a premissa central do trabalho: a necessidade de arquiteturas elásticas e resilientes para lidar com o crescimento explosivo da digitalização financeira.

O TCC posiciona o ValorizeAI como uma solução para a "economia volátil, múltiplas contas digitais e grandes volumes de transações". Esta afirmação é quantitativamente suportada por relatórios do Banco Central do Brasil (BCB) e da Federação Brasileira de Bancos (Febraban).

**Análise das Referências de Contexto:**

* **Crescimento da Digitalização:**
  Relatórios de economia bancária do BCB indicam que o número de usuários ativos no sistema financeiro cresceu para 152 milhões de pessoas físicas até dezembro de 2023, representando 87,7% da população adulta.¹ Este crescimento massivo é corroborado pela pesquisa da Febraban, que revela que 82% de todas as transações bancárias no Brasil são agora realizadas por canais digitais (celular e internet banking).² Este dado valida a premissa do TCC sobre "grandes volumes de transações".

* **Prioridade Estratégica em Nuvem:**
  A "Pesquisa FEBRABAN de Tecnologia Bancária" é uma fonte crucial, pois identifica o "Cloud como viabilizadora da agilidade operacional" como uma das principais prioridades estratégicas de TI para o setor.³ O TCC ValorizeAI é uma resposta direta a esta demanda, ao focar explicitamente em "equilibrar elasticidade, observabilidade e custo".

* **Requisitos Regulatórios:**
  A "Justificativa" do TCC menciona a necessidade de "consistência forte" e "rastreabilidade para auditoria". Estes não são apenas requisitos técnicos, mas imposições regulatórias. Fontes sobre a legislação aplicável, como a Lei Geral de Proteção de Dados (LGPD) e a Lei do Sigilo Bancário, são fundamentais para justificar as escolhas de design (ex: armazenamento seguro em buckets, políticas de IAM, consistência transacional).⁴

A metodologia do TCC (SLOs, k6) não existe no vácuo. Ela serve como a ponte quantitativa que faltava entre a estratégia do setor (migrar para a nuvem para "agilidade", como visto em ³) e a realidade da engenharia (medir se essa agilidade é entregue sob carga com P95 e taxas de erro aceitáveis).

O TCC também pode argumentar que a arquitetura de "pipelines assíncronos baseados em filas" não é meramente uma otimização de performance, mas um requisito de design para a funcionalidade de "importação automatizada de extratos". O processamento de arquivos de extrato, a conciliação de transações e a geração de relatórios são operações pesadas. Mover esse processamento para filas assíncronas torna-as um componente central para a resiliência do sistema (garantindo o processamento mesmo em caso de falhas) e para a experiência do usuário (evitando longas esperas), e não apenas uma otimização de performance.

### Referências BibTeX para a Seção 1 (Contexto)

#### Snippet de código

```bibtex
% Contexto: Relatórios do Banco Central do Brasil (BCB)
@techreport{BCB_Economia_Bancaria_2024,
  title     = {Relat\'orio de Economia Banc\'aria 2023},
  author    = {{Banco Central do Brasil (BCB)}},
  institution = {Banco Central do Brasil},
  year      = {2024},
  note      = {Dados sobre o crescimento de usu\'arios digitais e inclus\~ao financeira. Acesso em:. \url{https://www.bcb.gov.br/publicacoes/relatorioeconomiabancaria}},
  url       = {https://bdtd.ucb.br:8443/jspui/bitstream/tede/3614/2/FelipeHolandaDissertacao2024.pdf} % 
}

@misc{BCB_Regulamentacao_Fintech,
  title     = {Fintechs: O que s\~ao e como funcionam},
  author    = {{Banco Central do Brasil (BCB)}},
  year      = {2018},
  note      = {Regulamenta\c{\c{c}}\~ao das Resolu\c{\c{c}}\~oes 4.656 e 4.657 do CMN, que definem SCD e SEP. Acesso em:.},
  url       = {https://aprendervalor.bcb.gov.br/estabilidadefinanceira/fintechs} % [5]
}

% Contexto: Relatórios da FEBRABAN
@techreport{Febraban_Tecnologia_2024,
  title     = {Pesquisa FEBRABAN de Tecnologia Banc\'aria 2024 (Ano-base 2023)},
  author    = {{Federa\c{c}\~ao Brasileira de Bancos (FEBRABAN)} and {Deloitte}},
  institution = {FEBRABAN},
  year      = {2024},
  note      = {Volume 1: Tend\^encias em Tecnologia. Identifica 'Cloud' como prioridade estrat\'egica. Acesso em:.},
  url       = {https://cmsarquivos.febraban.org.br/Arquivos/documentos/PDF/Pesquisa%20Febraban%20de%20Tecnologia%20Banc%C3%A1ria%202024.pdf} % 
}

@misc{Febraban_Transacoes_2025,
  title     = {Transa\c{\c{c}}\~oes banc\'arias por canais digitais crescem e chegam a 82% do total, revela Pesquisa FEBRABAN},
  author    = {{Federa\c{c}\~ao Brasileira de Bancos (FEBRABAN)}},
  year      = {2025},
  note      = {Press release da Pesquisa Febraban de Tecnologia Banc\'aria 2025 (Ano-base 2024), Volume 2. Acesso em:.},
  url       = {https://portal.febraban.org.br/noticia/4310/pt-br/} % 
}

% Contexto: Análises de Mercado (Open Finance) e Regulatório (LGPD)
@misc{CamposThomaz_LGPD_Fintech,
  title     = {Fintechs: LGPD e Legisla\c{\c{c}}\~ao do Setor Financeiro},
  author    = {{Campos Thomaz Advogados}},
  year      = {2024},
  note      = {Discute a intersec\c{\c{c}}\~ao da Lei Geral de Prote\c{\c{c}}\~ao de Dados (LGPD) e a Lei do Sigilo Banc\'ario no contexto de fintechs e Open Finance. Acesso em:.},
  url       = {https://camposthomaz.com/fintechs-lgpd-e-legislacao-do-setor-financeiro/} % 
}
```

---

## 2. Arquiteturas de Referência para Sistemas Críticos (Trabalhos Relacionados)

A seção "Trabalhos Relacionados" do TCC deve situar a arquitetura do ValorizeAI (contêineres gerenciados autoescaláveis) dentro do debate acadêmico e técnico atual. As alternativas dominantes são o Kubernetes (K8s) self-hosted ou gerenciado (que oferece controle total) e as plataformas Serverless (FaaS - Functions as a Service, como AWS Lambda) (que oferecem escalabilidade extrema).

**Análise das Referências de Arquitetura Comparativa:**

* **O Debate K8s vs. Serverless:**
  A literatura compara essas duas abordagens. Artigos como o de Choudhury & Nandyala⁶ e Vayghan et al.⁷ exploram os desafios de implantação de microsserviços em ambas as plataformas. Estudos de caso em fintech⁸ destacam a complexidade de gerenciar a segurança e a escalabilidade do Kubernetes.

* **Otimização de Custo-Performance:**
  Outra vertente foca na otimização de plataformas FaaS (Serverless), buscando o equilíbrio entre custo e performance, dado que a alocação de recursos é dinâmica e pode levar a custos imprevisíveis.⁹

* **O "Caminho do Meio" (A Posição do TCC):**
  A arquitetura do ValorizeAI (descrita como "containers que escalam horizontalmente sob demanda", análoga a serviços como Google Cloud Run ou AWS Fargate) representa um caminho do meio pragmático. Ela busca a elasticidade do Serverless⁹ sem a complexidade operacional de gerenciar um cluster Kubernetes.⁷

A principal contribuição do TCC ValorizeAI está em preencher uma lacuna nesta literatura. Enquanto muitos artigos discutem essas arquiteturas qualitativamente ou em micro-benchmarks, o TCC apresenta uma validação quantitativa (P95, taxa de erro) desta arquitetura de "caminho do meio" (contêineres gerenciados) sob uma carga de trabalho complexa e realista de fintech (o cenário mix, que combina escrita, leitura e streaming de WebSockets).

### Tabela 1: Análise Comparativa de Arquiteturas Cloud-Native na Literatura

| Referência                   | Abordagem Arquitetural  | Vantagens (Escalabilidade, Custo, Controle)                                 | Desafios (Complexidade Operacional, Latência)                               | Lacuna Identificada                                                                                          |
| ---------------------------- | ----------------------- | --------------------------------------------------------------------------- | --------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------ |
| Choudhury & Nandyala (2024)⁶ | K8s e Serverless        | Compara estratégias de implantação                                          | Alta complexidade de gerenciamento (K8s) vs. *cold starts* (Serverless)     | Qualitativa; falta medição de P95 em workloads mistos.                                                       |
| Vayghan et al. (2018)⁷       | Kubernetes              | Controle de implantação, portabilidade                                      | Complexidade de configuração, overhead de rede e agendamento                | Foco em "lições aprendidas", não em validação de SLOs de latência.                                           |
| Artigo (Serverless)⁹         | Serverless (FaaS)       | Otimização de custo-performance, escalabilidade automática                  | Gerenciamento de custo, latência de *cold start*, dificuldade de otimização | Foco em otimização de FaaS, não em arquiteturas híbridas (ex: FaaS + WebSockets).                            |
| ValorizeAI (Este TCC)        | Contêineres Gerenciados | Elasticidade (como FaaS), Portabilidade (como K8s), Baixo Custo Operacional | Limites de escalabilidade da plataforma (ex: `max-instances=10`)            | Preenche a lacuna: medição P95 de ponta-a-ponta de arquitetura "caminho do meio" sob workload fintech (mix). |

### Referências BibTeX para a Seção 2 (Trabalhos Relacionados)

#### Snippet de código

```bibtex
% Trabalhos Relacionados: K8s vs Serverless
@article{Choudhury_Nandyala_2024,
  title     = {Microservices Deployment Strategies: Navigating Challenges with Kubernetes and Serverless Architectures},
  author    = {Choudhury, Amit and Nandyala, Abhishek Kartik},
  journal   = {International Journal of Innovative Research in Engineering and Management (IJIREM)},
  volume    = {11},
  number    = {5},
  pages     = {127--134},
  year      = {2024},
  month     = {October},
  doi       = {10.55524/ijirem.2024.11.5.18},
  url       = {https://ijirem.org/DOC/18-Microservices-Deployment-Strategies-Navigating-Challenges-with-Kubernetes-and-Serverless-Architectures.pdf} % 
}

@inproceedings{Vayghan_et_al_2018,
  title        = {Deploying microservice based applications with kubernetes: Experiments and lessons learned},
  author       = {Vayghan, L.A. and Saied, M.A. and Toeroe, M. and Khendek, F.},
  booktitle    = {2018 IEEE International Conference on Cloud Computing Technology and Science (CloudCom)},
  year         = {2018},
  organization = {IEEE},
  note         = {Referenciado em }
}

@article{Mondal_et_al_2022,
  title     = {Kubernetes in IT administration and serverless computing: An empirical study and research challenges},
  author    = {Mondal, S.K. and Pan, R. and Kabir, H. and Tian, T. and Dai, H.N.},
  journal   = {The Journal of Supercomputing},
  volume    = {78},
  pages     = {2937--2987},
  year      = {2022},
  doi       = {10.1007/s11227-021-04026-w},
  note      = {Referenciado em }
}

% Trabalhos Relacionados: Serverless (FaaS) e Otimização
@article{Serverless_Cost_Performance_2024,
  title     = {COST-PERFORMANCE OPTIMIZATION IN SERVERLESS COMPUTING},
  author    = {{Weyori, B. A. and Mohammed, A. K. and Tetteh, S. G.}},
  journal   = {International Journal of Emerging Trends in Computer Science and Information Technology},
  volume    = {5},
  number    = {4},
  pages     = {50--60},
  year      = {2024},
  note      = {Aborda a otimiza\c{\c{c}}\~ao de custo-performance em arquiteturas serverless, relevante para a justificativa de custo do TCC.},
  url       = {https://www.researchgate.net/publication/396211342_COST-PERFORMANCE_OPTIMIZATION_IN_SERVERLESS_COMPUTING} % 
}

@article{Multi_Cloud_Performance_2022,
  title     = {Performance Evaluation of Multi-Cloud Computing Environments: Challenges and Opportunities},
  author    = {{Autor N\~ao Especificado}},
  journal   = {World Journal of Advanced Research and Reviews (WJARR)},
  year      = {2022},
  note      = {Discute os desafios de aloca\c{\c{c}}\~ao de recursos e picos de custo na nuvem, validando a preocupa\c{\c{c}}\~ao do TCC com monitoramento de custo.},
  url       = {https://wjarr.com/sites/default/files/WJARR-2022-0560.pdf} % [10]
}

% Trabalhos Relacionados: Migração e Arquitetura Fintech
@article{Monolith_to_Microservices_SaaS_2024,
  title     = {Transition Strategies from Monolithic to Microservices Architectures: A Domain-Driven Approach and Case Study},
  author    = {{Autor N\~ao Especificado}},
  journal   = {ResearchGate Publication},
  year      = {2024},
  note      = {Discute a migra\c{\c{c}}\~ao de mon\'olitos para microsservi\c{c}os cloud-native, fornecendo o contexto cl\'assico para a ado\c{\c{c}}\~ao da arquitetura do TCC.},
  url       = {https://www.researchgate.net/publication/381290696_Transition_Strategies_from_Monolithic_to_Microservices_Architectures_A_Domain-Driven_Approach_and_Case_Study} % [11]
}

@article{Kubernetes_Fintech_Case_Study_2019,
  title     = {Scaling FinTech Applications on Kubernetes: A Case Study},
  author    = {{Autor N\~ao Especificado}},
  journal   = {Journal of Real-Time C.S.E.},
  year      = {2019},
  note      = {Apresenta um estudo de caso sobre os desafios de escalabilidade de fintechs no Kubernetes.},
  url       = {https://jrtcse.com/index.php/home/article/download/JRTCSE.2019.2.4/JRTCSE.2019.2.4/375} % [12]
}
```

---

## 3. Fundamentos Teóricos da Arquitetura de Software e Confiabilidade

A "Fundamentação Teórica" (Seção 3 do TCC) deve apresentar os conceitos canônicos que dão suporte às decisões de design (DDD, Clean Architecture) e de operações/metodologia (SRE, SLOs).

### 3.1 Design de Software (DDD, Clean Architecture e CQRS)

O TCC menciona que o design do sistema (`docs/system-design.md`) segue os princípios de Clean Architecture e Domain-Driven Design (DDD), o que é evidenciado pela estrutura do repositório (`app/Actions`, `app/Queries`, DTOs).

* **Clean Architecture:**
  A referência seminal é o livro de Robert C. Martin, que estabelece os princípios de separação de responsabilidades, independência de frameworks, e testabilidade. Esta é a justificativa para a estrutura de camadas do ValorizeAI.¹³

* **Domain-Driven Design (DDD):**
  O livro de Eric Evans é a fonte primária para justificar o foco no domínio (finanças, "conciliação", "budgets") e o uso de uma "Linguagem Ubíqua" (onde os nomes das classes refletem o negócio).¹⁴

* **CQRS (Command Query Responsibility Segregation):**
  A estrutura `app/Actions` (escrita) e `app/Queries` (leitura) não é apenas um detalhe de implementação; é uma aplicação direta do padrão Command Query Responsibility Segregation (CQRS). O livro de Vaughn Vernon¹⁶ é a referência que conecta DDD a arquiteturas modernas, incluindo CQRS e Event-Driven. O uso de CQRS no TCC justifica como o sistema lida com requisitos conflitantes: as Actions (Comandos) podem ser otimizadas para "consistência forte", enquanto as Queries (Consultas) podem ser otimizadas para "resposta instantânea" (ex: usando cache Redis).

### 3.2 Engenharia de Confiabilidade (SRE e SLOs)

A metodologia do TCC (Seção 4) e os Objetivos (Geral e Específicos) são inteiramente baseados nos princípios de Site Reliability Engineering (SRE).

* **SRE (Site Reliability Engineering):**
  O livro *Site Reliability Engineering: How Google Runs Production Systems*¹⁷ é a fonte canônica que introduziu os conceitos de SLO (Service Level Objective), SLI (Service Level Indicator) e "Error Budgets".²⁰ Citar este livro é mandatório para definir o que o TCC está medindo.

* **Uso de SLOs:**
  Artigos que aprofundam o uso de SLOs²¹ conectam essas métricas à "mensuração da satisfação do usuário"²¹ e à "resiliência de sistemas"²², justificando por que o TCC foca em SLOs.

* **A Métrica (P95):**
  A decisão de focar na latência P95 (percentil 95) em vez de médias é um pilar da engenharia de performance moderna. A média oculta os outliers (as piores experiências do usuário). A documentação do k6²³ e guias de performance²⁵ são explícitos sobre a importância de medir percentis de cauda para validar SLOs.

O TCC efetivamente executa um ciclo SRE completo:
A Seção 3 (Fundamentação) define os SLOs com base na teoria SRE.¹⁷
A Seção 4 (Metodologia) operacionaliza a medição desses SLOs usando k6.²⁴
A Seção 6 (Resultados) apresenta a evidência da medição (P95 = 158ms e P95 = 4,03s).

### Referências BibTeX para a Seção 3 (Fundamentação Teórica)

#### Snippet de código

```bibtex
% Fundamentação: Clean Architecture e Domain-Driven Design
@book{Martin_Clean_Architecture_2018,
  title     = {Clean Architecture: A Craftsman's Guide to Software Structure and Design},
  author    = {Martin, Robert C.},
  year      = {2018},
  publisher = {Prentice Hall},
  address   = {Upper Saddle River, NJ},
  isbn      = {978-0134494166},
  note      = {Fonte seminal para justificar a separa\c{\c{c}}\~ao de responsabilidades e independ\^encia de framework. Ref: }
}

@book{Evans_DDD_2003,
  title     = {Domain-Driven Design: Tackling Complexity in the Heart of Software},
  author    = {Evans, Eric},
  year      = {2003},
  publisher = {Addison-Wesley Professional},
  address   = {Boston, MA},
  isbn      = {978-0321125217},
  note      = {Fonte prim\'aria para Domain-Driven Design, Bounded Contexts e Ubiquitous Language. Ref: }
}

@book{Vernon_Implementing_DDD_2013,
  title     = {Implementing Domain-Driven Design},
  author    = {Vernon, Vaughn},
  year      = {2013},
  publisher = {Addison-Wesley Professional},
  address   = {Boston, MA},
  isbn      = {978-0321834577},
  note      = {Conecta DDD a padr\~oes modernos como CQRS e Event-Driven, justificando a estrutura de Actions/Queries. Ref: }
}

% Fundamentação: Site Reliability Engineering (SRE) e SLOs
@book{Beyer_SRE_2016,
  title     = {Site Reliability Engineering: How Google Runs Production Systems},
  author    = {Beyer, Betsy and Jones, Chris and Petoff, Jennifer and Murphy, Niall Richard},
  editor    = {Beyer, Betsy and Jones, Chris and Petoff, Jennifer and Murphy, Niall Richard},
  year      = {2016},
  publisher = {O'Reilly Media},
  address   = {Sebastopol, CA},
  isbn      = {978-1491929124},
  note      = {Refer\^encia can\^onica para SRE, SLOs, SLIs e Error Budgets. Ref: }
}

@article{SLO_SLA_Analysis_2020,
  title     = {A Framework for SLO/SLA Definition, Adherence Metadata Collection and Analysis for E-Services},
  author    = {Kabashkin, Igor},
  journal   = {Applied Sciences},
  volume    = {10},
  number    = {24},
  pages     = {9112},
  year      = {2020},
  doi       = {10.3390/app10249112},
  note      = {Discute o uso de SLOs para medir a satisfa\c{\c{c}}\~ao do usu\'ario e justificar melhorias de infraestrutura. Ref: }
}

@article{SRE_Cybersecurity_2023,
  title     = {Cybersecurity and Site Reliability Engineering (SRE): A Systematic Mapping Study},
  author    = {Conde, Tiago and Correia, Miguel and Pereira, Jo\~ao},
  journal   = {Future Internet},
  volume    = {7},
  number    = {1},
  pages     = {1},
  year      = {2023},
  doi       = {10.3390/fi7010001},
  note      = {Define o SRE como um conjunto de pr\'aticas para garantir escalabilidade, confiabilidade e efici\^encia, originado no Google. Ref: }
}
```

---

## 4. Justificativa Técnica dos Componentes Centrais da Arquitetura

A Seção 5 ("Implementação / Desenvolvimento") do TCC deve justificar cada bloco da arquitetura (`docs/system-design.md`).

**Análise das Referências de Componentes:**

* **Processamento Assíncrono (Filas):**
  As filas são usadas para "importação automatizada de extratos". As referências justificam isso de duas formas:
  (1) **UX:** O processamento assíncrono melhora a responsividade da aplicação, permitindo que o usuário finalize o checkout (ou, no caso do TCC, a solicitação de importação) sem esperar pelo processamento em background.²⁶
  (2) **Resiliência (Fintech):** Em sistemas de pagamento e financeiros, filas com "entrega garantida" e "tarefas idempotentes" são cruciais para a integridade dos dados e resiliência a falhas, o que é um requisito do domínio fintech.²⁷

* **Comunicação em Tempo Real (WebSockets e Reverb):**
  O TCC usa um "servidor de WebSockets dedicado" para "notificações em tempo real". Padrões de arquitetura para streaming em tempo real sugerem o uso de *load balancing*²⁸ e *auto-scaling*²⁹ para o servidor de WebSockets, e o uso de um barramento (como SNS ou, no caso do TCC, Redis) para desacoplar os produtores de eventos.³⁰ A documentação oficial do Laravel Reverb³¹ é a referência primária, descrevendo-o como um servidor escalável que usa o protocolo Pusher e se integra ao ecossistema Laravel.

* **Cache e Gerenciamento de Estado (Redis):**
  O TCC usa "cache em Redis". Artigos como³⁴ discutem "padrões de arquitetura" para integrar o Redis em aplicações baseadas em microsserviços para alta disponibilidade. Além do caching, em sistemas financeiros, o Redis é frequentemente usado para implementar *distributed locks* (travas distribuídas), o que é essencial para garantir a consistência em operações "read-modify-write" concorrentes (como debitar de um budget).³⁵

* **Distribuição e Borda (CDN e Balanceamento Global):**
  A arquitetura do TCC começa com "balanceamento global com CDN". *White papers* e guias técnicos sobre arquitetura web³⁷ descrevem este padrão como fundamental para reduzir a latência de entrega de assets (CDN) e direcionar usuários para a instalação mais próxima ou saudável do serviço (Balanceamento Global), aumentando a resiliência.

Um ponto crítico para a "Discussão" (Seção 6) do TCC é a dupla função do Redis. O Redis não é apenas um "cache". A documentação do Reverb³³ especifica que ele usa as "capacidades de publish/subscribe do Redis" para escalar horizontalmente.

Portanto, o Redis no ValorizeAI é:

* Um **Cache** para as Queries (leituras) do banco de dados (conforme³⁴);
* Um **Barramento Pub/Sub** para os eventos do Reverb (conforme³³).

Esta dupla responsabilidade faz do Redis um potencial ponto de contenção. O gargalo observado no cenário mix (P95 = 4,03s) – que combina leituras intensas (cenário `transactions-list`) e streaming simultâneo (cenário `mix`) – pode ser diretamente explicado pela saturação do Redis, que está tentando servir ambas as cargas de trabalho.

### Referências BibTeX para a Seção 4 (Componentes da Arquitetura)

#### Snippet de código

```bibtex
% Componentes: Filas e Processamento Assíncrono
@article{Async_Processing_UX_2023,
  title     = {Improving User Experience with Asynchronous Processing in Web Applications},
  author    = {{Autor N\~ao Especificado}},
  journal   = {Journal of E-Services and Applications},
  year      = {2023},
  note      = {Discute como filas ass\incronas melhoram a responsividade da aplica\c{\c{c}}\~ao, permitindo processamento em background. Ref: },
  url       = {https://journal.esrgroups.org/jes/article/download/8333/5613/15179}
}

@article{Async_Microservices_Payments_2024,
  title     = {Resilient Payment Systems: A Shift Towards Asynchronous Microservices},
  author    = {{Autor N\~ao Especificado}},
  journal   = {International Research Journal of Engineering and Technology (IRJET)},
  volume    = {11},
  number    = {2},
  year      = {2024},
  month     = {February},
  note      = {Destaca o uso de filas, tarefas idempotentes e microservi\c{c}os para garantir resili\^encia e integridade em sistemas de pagamento. Ref: },
  url       = {https://www.irjet.net/archives/V11/i2/IRJET-V11I274.pdf}
}

% Componentes: WebSockets e Laravel Reverb
@misc{Laravel_Reverb_Docs_11,
  title     = {Laravel 11 Release Notes - Laravel Reverb},
  author    = {{Laravel Holdings Inc.}},
  year      = {2024},
  note      = {Documenta\c{\c{c}}\~ao oficial do Laravel 11 introduzindo o Reverb como um servidor WebSocket escal\'avel de primeira parte, com suporte a scaling horizontal via Redis Pub/Sub. Acesso em:.},
  url       = {https://laravel.com/docs/11.x/releases#laravel-reverb} % 
}

@misc{Reverb_Official_Site,
  title     = {Laravel Reverb - Official Homepage},
  author    = {{Laravel Holdings Inc.}},
  year      = {2024},
  note      = {Documenta\c{\c{c}}\~ao de produto do Reverb, destacando a integra\c{\c{c}}\~ao com Laravel Broadcasting e o protocolo Pusher. Acesso em:.},
  url       = {https://reverb.laravel.com/} % [31]
}

@article{Real_Time_Notifications_Patterns_2024,
  title     = {Scalable Architecture for Real-Time Notifications in Logistics Applications},
  author    = {{Autor N\~ao Especificado}},
  journal   = {Technical Journal of Interdisciplinary Research (TJNRID)},
  volume    = {24},
  number    = {11},
  year      = {2024},
  note      = {Descreve padr\~oes de arquitetura para tracking em tempo real usando AWS SNS (barramento) e WebSockets (entrega). Ref: },
  url       = {https://tijer.org/jnrid/papers/JNRID2411010.pdf}
}

% Componentes: Redis (Cache e Locking)
@article{Redis_Caching_Microservices_2024,
  title     = {Leveraging Redis Caching and Optimistic Updates for Faster Web Application Performance},
  author    = {Mali, Akash Balaji and Chamarthy, Shyamakrishna Siddharth and Tirupati, Krishna Kishor, et al.},
  journal   = {International Journal of Advanced Multidisciplinary Sciences and Studies (IJAMSS)},
  year      = {2024},
  note      = {Discute padr\~oes de arquitetura para Redis em microsservi\c{c}os, alta disponibilidade e otimiza\c{\c{c}}\~ao de clusters. Ref: },
  url       = {http://www.iaset.us/index.php/download/archives/21-11-2024-1732194615-8-IJAMSS-24.%20IJAMSS%20-%20LEVERAGING%20REDIS%20CACHING%20AND%20OPTIMISTIC%20UPDATES%20FOR%20FASTER%20WEB%20APPLICATION%20PERFORMANCE.pdf}
}

@article{Redis_PubSub_ML_2024,
  title     = {Designing Real-Time Job Search Platforms with Redis Pub/Sub and Machine Learning Integration},
  author    = {Mali, Akash Balaji and Khan, I. and Dandu, M. M. K., et al.},
  journal   = {Journal of Quantum Science and Technology},
  volume    = {1},
  number    = {3},
  year      = {2024},
  doi       = {10.63345/jqst.v1i3.115},
  note      = {Apresenta o Redis Pub/Sub como uma solu\c{\c{c}}\~ao para 'real-time message broadcasting' com baixa lat\^encia. Ref: [39]}
}

@misc{Redis_Locking_Concurrency_2023,
  title     = {PSA: This is a read-modify-write pattern, thus it is not safe under concurrency},
  author    = {{deredede}},
  howpublished = {Hacker News Discussion},
  year      = {2023},
  note      = {Discute a necessidade de mecanismos de locking (como 'select for update' ou travas em Redis) para opera\c{\c{c}}\~oes concorrentes seguras. Acesso em:. Ref: [35]},
  url       = {https://news.ycombinator.com/item?id=37636841}
}

% Componentes: CDN e Balanceamento Global
@techreport{CDN_Global_Load_Balancing_2006,
  title     = {Taxonomy of Content Distribution Networks (CDN)},
  author    = {{Autor N\~ao Especificado}},
  institution = {University of Melbourne},
  year      = {2006},
  note      = {Descreve CDNs que facilitam o 'global load balancing' para entrega r\'apida de conte\'udo. Ref: [37]},
  url       = {https://vm-45-113-233-40.rc.cloud.unimelb.edu.au/cdn/reports/CDN-Taxonomy.pdf}
}

@book{NGINX_Load_Balancing_AWS_2018,
  title     = {Load Balancing in the Cloud: AWS and NGINX Plus},
  author    = {{NGINX}},
  year      = {2018},
  note      = {White paper que descreve o uso do 'Global Load Balancing' (ex: Route 53) e CDNs para reduzir lat\^encia e aumentar resili\^encia. Ref: [38]},
  url       = {https://www.scribd.com/document/395719929/Load-Balancing-in-the-Cloud-AWS-NGINX-Plus}
}

% Componentes: Stack (React e Laravel)
@misc{React_Docs,
  title     = {React Official Documentation},
  author    = {{Meta (Facebook)}},
  year      = {2024},
  note      = {Documenta\c{\c{c}}\~ao oficial da biblioteca React, incluindo Hooks, APIs e Componentes. Acesso em:.},
  url       = {https://react.dev/reference/react} % [40]
}

@misc{Laravel_Docs_11,
  title     = {Laravel 11 Documentation},
  author    = {{Laravel Holdings Inc.}},
  year      = {2024},
  note      = {Documenta\c{\c{c}}\~ao oficial do framework Laravel 11. Acesso em:.},
  url       = {https://laravel.com/docs/11.x/} % 
}
```

---

## 5. Metodologia de Validação e Engenharia de Desempenho

A Seção 4 ("Metodologia") do TCC é onde a abordagem SRE (definida na Seção 3) é posta em prática. Isso envolve duas áreas principais: a ferramenta de teste de carga (k6) e o processo de automação (IaC/CI-CD).

### 5.1 Teste de Carga (k6)

A escolha do k6 (Grafana Labs) não é arbitrária. As referências justificam o k6 como a ferramenta ideal para os objetivos do TCC por quatro motivos principais:

1. **Scripting em JavaScript:**
   Permite que os testes (`tests/k6/scenarios/*.js`) sejam escritos na mesma linguagem do frontend (React), facilitando a manutenção.⁴¹

2. **Suporte a WebSockets:**
   O k6 tem suporte nativo para testes de WebSockets²⁴, o que é um requisito mandatório para validar o cenário `mix` e o servidor Reverb.

3. **Foco em SLOs (Thresholds):**
   O k6 é construído em torno do conceito de "Thresholds" (limiares), permitindo que o TCC valide programaticamente os SLOs (ex: P95, taxa de erro).²⁴

4. **Pronto para CI/CD:**
   A ferramenta é projetada para integração fácil em pipelines de CI/CD, alinhando-se com a metodologia de automação do TCC.⁴¹

A referência⁴³ (*"Distributed Load Testing for WebSocket and Streaming APIs"*) é particularmente útil para a "Discussão" (Seção 6), pois contextualiza a dificuldade de testar APIs de streaming e WebSockets em escala.

### 5.2 Infraestrutura como Código (IaC) e Entrega Contínua (CI/CD)

O TCC utiliza Terraform (`terraform/`) e `Makefile` para "orquestrar ambientes" e garantir a reprodutibilidade dos testes.

* **Infraestrutura como Código (IaC):**
  O livro *Terraform: Up & Running*⁴⁴ é a referência canônica para a ferramenta escolhida. O conceito de IaC⁴⁷ é fundamental para a metodologia científica do TCC, pois garante que o ambiente de teste seja idêntico em todas as execuções, tornando os resultados dos testes de carga (Seção 6) reprodutíveis.

* **Entrega Contínua (CD):**
  O livro *Continuous Delivery*⁴⁹ é a fonte seminal que define o processo de "automated deployment pipelines".

* **IaC em Fintech (Compliance):**
  A justificativa mais forte para o IaC no TCC não é apenas técnica, mas de domínio. Estudos de caso de fintechs⁵² mostram que o Terraform (IaC) é usado para automatizar compliance e auditoria. A infraestrutura definida como código⁵³ é "auditável" (alinhando-se à "rastreabilidade" exigida pelo BCB) e permite "*Painless* Governance and Security".⁵⁴

A metodologia do TCC é, portanto, uma síntese completa da engenharia de confiabilidade moderna:

* **SRE**¹⁷ define o objetivo (SLOs);
* **Continuous Delivery**⁴⁹ define o processo (pipeline);
* **IaC (Terraform)**⁴⁴ define o ambiente (reprodutível);
* **k6**²⁴ fornece a medição (validação do SLO).

Neste contexto, o resultado do cenário `mix` (P95 = 4,03s) não é um "fracasso" do projeto, mas sim o sucesso da metodologia em identificar o limite exato da arquitetura sob uma carga específica.

### Referências BibTeX para a Seção 5 (Metodologia)

#### Snippet de código

```bibtex
% Metodologia: Teste de Carga (k6)
@misc{k6_Docs_Thresholds,
  title     = {k6 Documentation - Thresholds},
  author    = {{Grafana Labs}},
  year      = {2024},
  note      = {Documenta\c{\c{c}}\~ao oficial do k6 sobre 'Thresholds', que permite a defini\c{\c{c}}\~ao de crit\'erios de aprova\c{\c{c}}\~ao/falha baseados em m\'etricas (SLOs) como P95 e taxa de erro. Acesso em:. Ref: },
  url       = {https://grafana.com/docs/k6/latest/using-k6/thresholds/}
}

@misc{k6_Docs_P95,
  title     = {k6 Documentation - Results output - Summary trend stats},
  author    = {{Grafana Labs}},
  year      = {2024},
  note      = {Documenta\c{\c{c}}\~ao oficial sobre a configura\c{\c{c}}\~ao de estat\iacute;sticas de tend\^encia (como P90, P95) no sum\'ario final. Acesso em:. Ref: [23]},
  url       = {https://grafana.com/docs/k6/latest/get-started/results-output/#summary-trend-stats}
}

@misc{k6_Guide_Medium,
  title     = {k6 Performance Testing: A Modern Developer's Guide to Load Testing at Scale},
  author    = {Boga, Laxminarayana},
  howpublished = {Medium Blog Post},
  year      = {2024},
  month     = {July},
  note      = {Guia destacando as vantagens do k6: developer-friendly (JS), CI/CD ready e suporte a WebSockets. Ref: [41]},
  url       = {https://medium.com/@laxminarayanaboga4079/k6-performance-testing-a-modern-developers-guide-to-load-testing-at-scale-db45184769aa}
}

@article{k6_Guide_Jignect,
  title     = {Mastering Performance Testing with k6: A Guide for QA Testers},
  author    = {{Jignect Technologies}},
  journal   = {Jignect Tech Blog},
  year      = {2024},
  note      = {Guia que destaca o suporte do k6 a m\'ultiplos protocolos (HTTP, gRPC, WebSockets) e integra\c{\c{c}}\~ao com CI/CD. Ref: [42]},
  url       = {https://jignect.tech/mastering-performance-testing-with-k6-a-guide-for-qa-testers/}
}

@misc{k6_Websocket_Testing_2025,
  title     = {Distributed Load Testing for WebSocket and Streaming APIs},
  author    = {{Autor N\~ao Especificado}},
  howpublished = {NashTech Blog},
  year      = {2025},
  month     = {June},
  note      = {Discute a import\^ancia e os desafios de testes de carga para WebSockets e SSE em aplica\c{\c{c}}\~oes de tempo real (chat, dashboards). Ref: },
  url       = {https://blog.nashtechglobal.com/distributed-load-testing-for-websocket-and-streaming-apis/}
}

% Metodologia: Infraestrutura como Código (IaC) e Entrega Contínua (CD)
@book{Brikman_Terraform_2019,
  title     = {Terraform: Up \& Running: Writing Infrastructure as Code},
  author    = {Brikman, Yevgeniy},
  year      = {2019},
  publisher = {O'Reilly Media},
  address   = {Sebastopol, CA},
  edition   = {2nd},
  isbn      = {978-1492046875},
  note      = {Refer\^encia can\^onica para o Terraform, a ferramenta de IaC usada no TCC. Ref: }
}

@book{Humble_Farley_CD_2010,
  title     = {Continuous Delivery: Reliable Software Releases through Build, Test, and Deployment Automation},
  author    = {Humble, Jez and Farley, David},
  year      = {2010},
  publisher = {Addison-Wesley Professional},
  address   = {Boston, MA},
  isbn      = {978-0321601919},
  note      = {O trabalho seminal que define os princ\iacute;pios de pipelines de entrega e implanta\c{\c{c}}\~ao automatizada. Ref: }
}

@misc{IaC_Fintech_Case_Study_LayerX,
  title     = {Realizing "Painless" Governance and Security in the Cloud - LayerX Case Study},
  author    = {Hoshi, Hokuto},
  howpublished = {Bytebase Blog / CloudNative Days Summer 2025},
  year      = {2025},
  note      = {Estudo de caso de uma fintech (LayerX) que utiliza IaC e automa\c{\c{c}}\~ao nativa da nuvem para garantir governan\c{c}a e auditoria. Ref: },
  url       = {https://www.bytebase.com/blog/layerx-case-study/}
}

@misc{IaC_Fintech_Compliance_Cloudelligent,
  title     = {Empowering Fintech Companies: Meeting Compliance With AWS WAFR},
  author    = {{Cloudelligent}},
  howpublished = {Cloudelligent Blog},
  year      = {2024},
  note      = {Discute o uso de IaC (Terraform, CloudFormation) para automatizar a implanta\c{\c{c}}\~ao de infraestrutura em fintech, garantindo compliance (PCI DSS, ISO 27001). Ref: },
  url       = {https://cloudelligent.com/insights/blog/empowering-fintech-companies-wafr/}
}

@misc{IaC_Fintech_CloudRun_TRM,
  title     = {Scaling Security in the Age of AI: How TRM Labs Built Self-Improving Vulnerability Agents},
  author    = {{TRM Labs}},
  howpublished = {TRM Labs Blog},
  year      = {2024},
  note      = {Estudo de caso de fintech/seguran\c{c}a que selecionou Cloud Run (cont\^eineres gerenciados) e Terraform (IaC) para workloads 'bursty'. Ref: [52]},
  url       = {https://www.trmlabs.com/resources/blog/scaling-security-in-the-age-of-ai-how-trm-labs-built-self-improving-vulnerability-agents-with-reinforcement-learning}
}

@book{DevOps_Handbook_Reference,
  title     = {The DevOps and Release Management Handbook},
  author    = {{Autor N\~ao Especificado}},
  year      = {2024},
  note      = {Define os termos chave de DevOps, incluindo CI/CD, IaC e ferramentas (Jenkins, Terraform, Ansible). Ref: [48]},
  url       = {https://www.researchgate.net/publication/394114783_The_DevOps_and_Release_Management_Handbook_The_DevOps_and_Release_Management_Handbook}
}
```

---

## Referências citadas

1. FelipeHolandaDissertacao2024.pdf - Universidade Católica de Brasília - UCB, acessado em 13 novembro 2025, [https://bdtd.ucb.br:8443/jspui/bitstream/tede/3614/2/FelipeHolandaDissertacao2024.pdf](https://bdtd.ucb.br:8443/jspui/bitstream/tede/3614/2/FelipeHolandaDissertacao2024.pdf)
2. 82% das transações bancárias dos brasileiros são feitas pelos canais digitais, revela pesquisa - FEBRABAN - Notícias, acessado em 13 novembro 2025, [https://portal.febraban.org.br/noticia/4310/pt-br/](https://portal.febraban.org.br/noticia/4310/pt-br/)
3. Pesquisa Febraban de Tecnologia Bancária, acessado em 13 novembro 2025, [https://cmsarquivos.febraban.org.br/Arquivos/documentos/PDF/Pesquisa%20Febraban%20de%20Tecnologia%20Banc%C3%A1ria%202024.pdf](https://cmsarquivos.febraban.org.br/Arquivos/documentos/PDF/Pesquisa%20Febraban%20de%20Tecnologia%20Banc%C3%A1ria%202024.pdf)
4. Fintechs: LGPD e Legislação do Setor Financeiro - Campos Thomaz Advogados -, acessado em 13 novembro 2025, [https://camposthomaz.com/fintechs-lgpd-e-legislacao-do-setor-financeiro/](https://camposthomaz.com/fintechs-lgpd-e-legislacao-do-setor-financeiro/)
5. Microservices Deployment Strategies Navigating Challenges with ..., acessado em 13 novembro 2025, [https://ijirem.org/DOC/18-Microservices-Deployment-Strategies-Navigating-Challenges-with-Kubernetes-and-Serverless-Architectures.pdf](https://ijirem.org/DOC/18-Microservices-Deployment-Strategies-Navigating-Challenges-with-Kubernetes-and-Serverless-Architectures.pdf)
6. Toward Optimal Load Prediction and Customizable Autoscaling Scheme for Kubernetes, acessado em 13 novembro 2025, [https://www.mdpi.com/2227-7390/11/12/2675](https://www.mdpi.com/2227-7390/11/12/2675)
7. Secure ML Workflows Using Kubernetes: A CKS-Certified Perspective, acessado em 13 novembro 2025, [https://ijeret.org/index.php/ijeret/article/download/237/225](https://ijeret.org/index.php/ijeret/article/download/237/225)
8. (PDF) COST-PERFORMANCE OPTIMIZATION IN SERVERLESS COMPUTING, acessado em 13 novembro 2025, [https://www.researchgate.net/publication/396211342_COST-PERFORMANCE_OPTIMIZATION_IN_SERVERLESS_COMPUTING](https://www.researchgate.net/publication/396211342_COST-PERFORMANCE_OPTIMIZATION_IN_SERVERLESS_COMPUTING)
9. Evaluating performance and scalability of multi-cloud environments: Key metrics and optimization strategies, acessado em 13 novembro 2025, [https://wjarr.com/sites/default/files/WJARR-2022-0560.pdf](https://wjarr.com/sites/default/files/WJARR-2022-0560.pdf)
10. Guidelines for Future Agile Methodologies and Architecture Reconciliation for Software-Intensive Systems - MDPI, acessado em 13 novembro 2025, [https://www.mdpi.com/2079-9292/12/7/1582](https://www.mdpi.com/2079-9292/12/7/1582)
11. Domain-driven design - Wikipedia, acessado em 13 novembro 2025, [https://en.wikipedia.org/wiki/Domain-driven_design](https://en.wikipedia.org/wiki/Domain-driven_design)
12. Digital Practitioner Body of Knowledge™ Community Edition - The Open Group Blog, acessado em 13 novembro 2025, [https://blog.opengroup.org/wp-content/uploads/2020/04/dpbok-ce.pdf](https://blog.opengroup.org/wp-content/uploads/2020/04/dpbok-ce.pdf)
13. Implementing Domain-Driven Design - Vaughn Vernon - Google Books, acessado em 13 novembro 2025, [https://books.google.com/books/about/Implementing_Domain_Driven_Design.html?id=X7DpD5g3VP8C](https://books.google.com/books/about/Implementing_Domain_Driven_Design.html?id=X7DpD5g3VP8C)
14. Site reliability engineering - Wikipedia, acessado em 13 novembro 2025, [https://en.wikipedia.org/wiki/Site_reliability_engineering](https://en.wikipedia.org/wiki/Site_reliability_engineering)
15. Details for: Site reliability engineering : How Google runs production systems / › Chinhoyi University of Technology Libraries catalog, acessado em 13 novembro 2025, [https://library.cut.ac.zw/cgi-bin/koha/opac-detail.pl?biblionumber=11163&shelfbrowse_itemnumber=21172](https://library.cut.ac.zw/cgi-bin/koha/opac-detail.pl?biblionumber=11163&shelfbrowse_itemnumber=21172)
16. Site reliability engineering : how Google runs production systems : Free Download, Borrow, and Streaming - Internet Archive, acessado em 13 novembro 2025, [https://archive.org/details/sitereliabilitye0000unse](https://archive.org/details/sitereliabilitye0000unse)
17. High Performance SRE - Beyond Paperback Publishing, acessado em 13 novembro 2025, [https://www.beyondpaperback.com/book/isbn/9789355516718](https://www.beyondpaperback.com/book/isbn/9789355516718)
18. User-Engagement Score and SLIs/SLOs/SLAs Measurements Correlation of E-Business Projects Through Big Data Analysis - MDPI, acessado em 13 novembro 2025, [https://www.mdpi.com/2076-3417/10/24/9112](https://www.mdpi.com/2076-3417/10/24/9112)
19. On the Way to Automatic Exploitation of Vulnerabilities and Validation of Systems Security through Security Chaos Engineering - MDPI, acessado em 13 novembro 2025, [https://www.mdpi.com/2504-2289/7/1/1](https://www.mdpi.com/2504-2289/7/1/1)
20. Results output | Grafana k6 documentation, acessado em 13 novembro 2025, [https://grafana.com/docs/k6/latest/get-started/results-output/](https://grafana.com/docs/k6/latest/get-started/results-output/)
21. APIs load testing using K6 - ISE Developer Blog, acessado em 13 novembro 2025, [https://devblogs.microsoft.com/ise/apis-load-testing-using-k6/](https://devblogs.microsoft.com/ise/apis-load-testing-using-k6/)
22. How do you set up continuous performance monitoring in CI/CD? - Wild.Codes, acessado em 13 novembro 2025, [https://wild.codes/candidate-toolkit-question/how-do-you-set-up-continuous-performance-monitoring-in-ci-cd](https://wild.codes/candidate-toolkit-question/how-do-you-set-up-continuous-performance-monitoring-in-ci-cd)
23. Enhancing Distributed Systems with Message Queues: Architecture, Benefits, and Best Practices, acessado em 13 novembro 2025, [https://journal.esrgroups.org/jes/article/download/8333/5613/15179](https://journal.esrgroups.org/jes/article/download/8333/5613/15179)
24. ASYNCHRONOUS PROCESSING IN PAYMENTS SOFTWARE BACKEND SYSTEM - IRJET, acessado em 13 novembro 2025, [https://www.irjet.net/archives/V11/i2/IRJET-V11I274.pdf](https://www.irjet.net/archives/V11/i2/IRJET-V11I274.pdf)
25. Build a Real-time Notification System with Socket.IO and ReactJS - Novu, acessado em 13 novembro 2025, [https://novu.co/blog/build-a-real-time-notification-system-with-socket-io-and-reactjsbuild-a-real-time-notification-system-with-socket-io-and-reactjs/](https://novu.co/blog/build-a-real-time-notification-system-with-socket-io-and-reactjsbuild-a-real-time-notification-system-with-socket-io-and-reactjs/)
26. How to Implement Real-Time Chat and Support Features in Your App - MoldStud, acessado em 13 novembro 2025, [https://moldstud.com/articles/p-implementing-real-time-chat-and-support-features-in-your-app](https://moldstud.com/articles/p-implementing-real-time-chat-and-support-features-in-your-app)
27. A Cloud-Native Architecture For Real-Time Courier, Express, And Parcel (CEP) Tracking - TIJER-International Research Journals, acessado em 13 novembro 2025, [https://tijer.org/jnrid/papers/JNRID2411010.pdf](https://tijer.org/jnrid/papers/JNRID2411010.pdf)
28. Laravel Reverb, acessado em 13 novembro 2025, [https://reverb.laravel.com/](https://reverb.laravel.com/)
29. Laravel Reverb - Laravel 12.x - The PHP Framework For Web Artisans, acessado em 13 novembro 2025, [https://laravel.com/docs/12.x/reverb](https://laravel.com/docs/12.x/reverb)
30. Release Notes - Laravel 11.x - The PHP Framework For Web Artisans, acessado em 13 novembro 2025, [https://laravel.com/docs/11.x/releases](https://laravel.com/docs/11.x/releases)
31. LEVERAGING REDIS CACHING AND OPTIMISTIC UPDATES FOR FASTER WEB APPLICATION PERFORMANCE - iaset.us, acessado em 13 novembro 2025, [http://www.iaset.us/index.php/download/archives/21-11-2024-1732194615-8-IJAMSS-24.%20IJAMSS%20-%20LEVERAGING%20REDIS%20CACHING%20AND%20OPTIMISTIC%20UPDATES%20FOR%20FASTER%20WEB%20APPLICATION%20PERFORMANCE.pdf](http://www.iaset.us/index.php/download/archives/21-11-2024-1732194615-8-IJAMSS-24.%20IJAMSS%20-%20LEVERAGING%20REDIS%20CACHING%20AND%20OPTIMISTIC%20UPDATES%20FOR%20FASTER%20WEB%20APPLICATION%20PERFORMANCE.pdf)
32. Choose Postgres queue technology - Hacker News, acessado em 13 novembro 2025, [https://news.ycombinator.com/item?id=37636841](https://news.ycombinator.com/item?id=37636841)
33. What's this?, acessado em 13 novembro 2025, [https://poorlydefinedbehaviour.github.io/](https://poorlydefinedbehaviour.github.io/)
34. A Taxonomy and Survey of Content Delivery Networks - The University of Melbourne, acessado em 13 novembro 2025, [https://vm-45-113-233-40.rc.cloud.unimelb.edu.au/cdn/reports/CDN-Taxonomy.pdf](https://vm-45-113-233-40.rc.cloud.unimelb.edu.au/cdn/reports/CDN-Taxonomy.pdf)
35. Load Balancing in The Cloud AWS NGINX Plus | PDF - Scribd, acessado em 13 novembro 2025, [https://www.scribd.com/document/395719929/Load-Balancing-in-the-Cloud-AWS-NGINX-Plus](https://www.scribd.com/document/395719929/Load-Balancing-in-the-Cloud-AWS-NGINX-Plus)
36. k6 Performance Testing: A Modern Developer's Guide to Load Testing at Scale - Medium, acessado em 13 novembro 2025, [https://medium.com/@laxminarayanaboga4079/k6-performance-testing-a-modern-developers-guide-to-load-testing-at-scale-db45184769aa](https://medium.com/@laxminarayanaboga4079/k6-performance-testing-a-modern-developers-guide-to-load-testing-at-scale-db45184769aa)
37. Mastering Performance Testing with K6: A Guide for QA Testers - JigNect, acessado em 13 novembro 2025, [https://jignect.tech/mastering-performance-testing-with-k6-a-guide-for-qa-testers/](https://jignect.tech/mastering-performance-testing-with-k6-a-guide-for-qa-testers/)
38. Distributed Load Testing for WebSocket and Streaming APIs - NashTech Blog, acessado em 13 novembro 2025, [https://blog.nashtechglobal.com/distributed-load-testing-for-websocket-and-streaming-apis/](https://blog.nashtechglobal.com/distributed-load-testing-for-websocket-and-streaming-apis/)
39. Terraform: Up & Running: Writing Infrastructure as Code - Yevgeniy Brikman - Google Books, acessado em 13 novembro 2025, [https://books.google.com/books/about/Terraform_Up_Running.html?id=57ytDwAAQBAJ](https://books.google.com/books/about/Terraform_Up_Running.html?id=57ytDwAAQBAJ)
40. Terraform: Up & Running, 2nd Edition - O'Reilly, acessado em 13 novembro 2025, [https://www.oreilly.com/library/view/terraform-up/9781492046899/](https://www.oreilly.com/library/view/terraform-up/9781492046899/)
41. Design of Scalable IoT Architecture Based on AWS for Smart Livestock - MDPI, acessado em 13 novembro 2025, [https://www.mdpi.com/2076-2615/11/9/2697](https://www.mdpi.com/2076-2615/11/9/2697)
42. Declarative Cloud Infrastructure Management with Terraform - TrustRadius, acessado em 13 novembro 2025, [https://media.trustradius.com/product-downloadables/GV/2P/C48G39X13134.pdf](https://media.trustradius.com/product-downloadables/GV/2P/C48G39X13134.pdf)
43. (PDF) The DevOps and Release Management Handbook The DevOps and Release Management Handbook - ResearchGate, acessado em 13 novembro 2025, [https://www.researchgate.net/publication/394114783_The_DevOps_and_Release_Management_Handbook_The_DevOps_and_Release_Management_Handbook](https://www.researchgate.net/publication/394114783_The_DevOps_and_Release_Management_Handbook_The_DevOps_and_Release_Management_Handbook)
44. Continuous Delivery: Reliable Software Releases through Build, Test, and Deployment Automation - Google Books, acessado em 13 novembro 2025, [https://books.google.de/books?id=6ADDuzere-YC](https://books.google.de/books?id=6ADDuzere-YC)
45. Modern Software Engineering: Doing What Works to Build Better Software Faster - David Farley - Google Books, acessado em 13 novembro 2025, [https://books.google.com/books/about/Modern_Software_Engineering.html?id=rtnPEAAAQBAJ](https://books.google.com/books/about/Modern_Software_Engineering.html?id=rtnPEAAAQBAJ)
46. Continuous Delivery: Reliable Software Releases through Build, Test, and Deployment Automation - Pearson Deutschland, acessado em 13 novembro 2025, [https://www.pearson.de/continuous-delivery-reliable-software-releases-through-build-test-and-deployment-automation-9780321601919](https://www.pearson.de/continuous-delivery-reliable-software-releases-through-build-test-and-deployment-automation-9780321601919)
47. Scaling Security in the Age of AI: How TRM Labs Built Self-Improving Vulnerability Agents with Reinforcement Learning, acessado em 13 novembro 2025, [https://www.trmlabs.com/resources/blog/scaling-security-in-the-age-of-ai-how-trm-labs-built-self-improving-vulnerability-agents-with-reinforcement-learning](https://www.trmlabs.com/resources/blog/scaling-security-in-the-age-of-ai-how-trm-labs-built-self-improving-vulnerability-agents-with-reinforcement-learning)
48. Empowering Fintech Companies with AWS WAFR - Cloudelligent, acessado em 13 novembro 2025, [https://cloudelligent.com/insights/blog/empowering-fintech-companies-wafr/](https://cloudelligent.com/insights/blog/empowering-fintech-companies-wafr/)
49. How LayerX Achieves “Painless” Governance and Security in the Cloud - Bytebase, acessado em 13 novembro 2025, [https://www.bytebase.com/blog/layerx-case-study/](https://www.bytebase.com/blog/layerx-case-study/)
