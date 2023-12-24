import React from 'react';
import './Experiences.scss'
import { ExperienceData, Language } from '../../../Types';
import Experience from './Experience/Experience';

interface P{
  lang: Language,
}

interface S{
}

class Experiences extends React.Component<P, S>{
  constructor(props: P){
    super(props);
    this.state = {
    }
  }

  render(): React.ReactNode {
    let base = {current: this.props.lang};
    let experiences: ExperienceData[] = [
    {company: {...base, ptbr: 'Acrelec'},  
      timeOnIt: {...base,
        ptbr: 'jan de 2021 - mar de 2022',
        en: 'jan 2021 - mar 2022',
        fr: 'janvier 2021 - mars 2022',
        it: 'gennaio 2021 - marzo 2022'},
      jobTitle: {...base,
        ptbr:'Desenvolvedor de software',
        en: 'Software developer',
        fr: 'Développeur de logiciels',
        it: 'Sviluppatore di software'},
      description: {...base, 
        ptbr: `Colaborei no desenvolvimento de um sistema de Point of Sale (POS) para hamburguerias desde gerenciarem os pedidos, envio de solicitações à cozinha e processamento de pagamentos. 

        Como desenvolvedor full-stack, minhas principais responsabilidades incluíram aprimorar o sistema por meio do desenvolvimento de novas funcionalidades e redesenho da interface do usuário (UI) utilizando ReactJS, bem como a integração com um sistema de pedidos por celular. 

        Além disso, trabalhei na implementação de funcionalidades de promoções e descontos, correção de erros de manipulação de pedidos em Python, e otimização de consultas no banco de dados MySQL. 

        Diariamente, seguimos metodologias ágeis, como Sprints e Kanban, com um foco no levantamento de requisitos, atribuição de pontos para atividades e realização de testes rigorosos para garantir a qualidade do sistema.
        `,
        en: '- Development and maintenance of the main company software, a Point of Sale made in Python and React and sporadically using MySQL.',
        fr: '- Développement et maintenance du logiciel principal, un point de vente réalisé en Python et React, avec une utilisation occasionnelle de MySQL.',
        it: '- Sviluppo e manutenzione del software principale, un punto vendita realizzato in Python e React e utilizzo sporadico di MySQL'}},
    {company: {...base, ptbr: 'Itaú'}, 
      timeOnIt: {...base,
        ptbr: 'jan de 2021 - mar de 2022',
        en: 'september 2019 - november 2020',
        fr: 'septembre 2019 - novembre 2020',
        it: 'settembre 2019 - novembre 2020'},
      jobTitle: {...base,
        ptbr:'Desenvolvedor de software',
        en: 'Software developer',
        fr: 'Développeur de logiciels',
        it: 'Sviluppatore di software'},
      description: {...base, 
        ptbr: `Desempenhei o papel de desenvolvedor full-stack, trabalhando com novos requisitos, além da manutenção do sistema existente utilizado pela equipe que cuida da segurança de todas as agências do banco Itaú. Principais partes que atuei foram no back-end em C# Net com padrões como DDD e Repository, front-end em Javascript e utilizando banco de dados em SQL Server. Todo o trabalho envolveu Sprints com pontuação em fibonacci. 

        Também desenvolvi atividades de forma individual, como por exemplo: 
        
        - Uma máquina de estado para substituir trabalho de funcionários que manualmente selecionavam quais empresas poderiam marcar, quais horários podiam visitar as agências. Software deveria a partir de um flowchart complexo levantado anteriormente com a gerência da área, aceitar ou recusar o pedido de manutenção que outras empresas fariam nas agências do banco Itaú.
        - Uma máquina de estado, que ia substituir o trabalho manual que levava semanas, feito todo final de ano, que parava diversos funcionários para realizar o recadastramento de fornecedores de serviços e equipamentos para as agências. Software fez o recadastramento de milhares de fornecedores, além de revelar inconsistências nos cadastros anteriores, requerendo ajustes pois a entrega do recadastramento tinha tempo limite.
        - Software para manipular outro sistema de enviar mensagens de aviso de precaução na época de COVID para agências selecionadas.
        `,
        en: '- Development and maintenance of the main company software, a Point of Sale made in Python and React and sporadically using MySQL.',
        fr: `- Développement et maintenance du système utilisé par la
        sécurité des agences de la banque Itaú en C# Net Core,
        Javascript, HTML avec SQL Server en DDD.
        - Développement avec IE et Chrome Selenium en utilisant
        une machine à états finis pour remplacer le travail manuel.`,
        it: `- Sviluppo e supporto del sistema utilizzato dalla sicurezza
        delle filiali bancarie Itaú in C# MVC, Javascript, HTML con
        SQL Server in DDD.
        - Sviluppo con IE e Chrome Selenium utilizzando una
        macchina a stati finiti per sostituire il lavoro manuale.`}},
    {company: {...base, ptbr: 'Afresp'},
      timeOnIt: {...base,
        ptbr: 'mai de 2018 - set de 2019',
        en: 'may 2018 - sep 2019',
        fr: 'mai 2018 - septembre 2019',
        it: 'maggio 2018 - settembre 2019'},
      jobTitle: {...base,
        ptbr:'Desenvolvedor de software',
        en: 'Software developer',
        fr: 'Développeur de logiciels',
        it: 'Sviluppatore di software'},
      description: {...base, 
        ptbr: '- Desenvolvimento do sistema em C# Windows Forms e SQL server utilizado internamente para controle de informação de planos de saúdes e outros benefícios utilizados pelo Fiscais de Renda associados a associação.',
        en: `- Maintenance and development health insurance software, in C#, Windows Forms, SQL Server and Team Foundation Server.
        - Support and design new functions for the software that communicate with the Suplementary Nacional Health Agency (ANS).
        - Experience with Agile methodology (Kanban).`,
        fr: `Développement du système en C# Windows Forms et SQL
        Server sont utilisés en interne pour le suivi des
        informations sur les régimes de santé et autres avantages
        utilisés par les agents fiscaux membres de l’association.`,
        it: `Sviluppo del sistema in C# Windows Forms e SQL Server
        utilizzato internamente per controllare le informazioni sui
        piani sanitari e altri benefici utilizzati dall'imposta sul
        reddito associata all'associazione.`}},
    {company: {...base, ptbr: 'RDI Software'}, 
      timeOnIt: {...base,
        ptbr: 'jan de 2021 - mar de 2022',
        en: 'jul 2014 - jun 2015',
        fr: 'juillet 2014 - juin 2015',
        it: 'lug 2014 - giu 2015'},
      jobTitle: {...base,
        ptbr:'Desenvolvedor de software',
        en: 'Software developer',
        fr: 'Développeur de logiciels',
        it: 'Sviluppatore di software'},
      description: {...base, 
        ptbr: `Trabalhei principalmente no desenvolvimento e manutenção do software utilizado pelo McDonald 's em todo mundo para controle da cozinha e pedidos nos restaurantes. Trabalho consistia em desenvolvimento em C/C++ tanto do back-end como front-end, desde implementação de novas promoções, correções de erros e criação de novas funcionalidades. 
        Também trabalhei na equipe de desenvolvimento do novo sistema em C# .Net para eventualmente substituir o software mais antigo.`,
        en: `- Development of new functionalities in C#/C++ pure in the software that control the production of sandwiches in the McDonald's restaurants.
        - Maintenance of the software in C++ already in the restaurants controlling the kitchen and payments of McDonald's.
        - Control and planning of the development utilizing sprints and daily meetings.
        - Experience with Team City, Atlassian Jira and GIT.`,
        fr: `Développement de nouvelles fonctionnalités en C# et C++
        pur dans le logiciel utilisé pour gérer la production de repas
        dans les restaurants McDonald’s`,
        it: `Sviluppo di nuove funzionalità in puro C# e C++ nel
        software utilizzato per controllare la produzione di snack
        nei ristoranti McDonald's.`}},
    {company: {...base, ptbr: 'Totvs'}, 
      timeOnIt: {...base,
        ptbr: 'jul de 2012 - jul de 2014',
        en: 'jul 2012 - jul 2014',
        fr: 'juillet 2012 - juillet 2014',
        it: 'lug 2012 - lug 2014'},
      jobTitle: {...base,
        ptbr:'Técnico de pesquisa e desenvolvimento',
        en: 'Technician in R&D',
        fr: 'Technicien en Recherche et Développement',
        it: 'Tecnico di ricerca e sviluppo'},
      description: {...base, 
        ptbr: 'Desenvolvimento de uma máquina virtual em C/C++ e QT para linguagem própria da empresa (ADVPL). Solução de problemas de compilação e execução, criação de projeto através de CMake. Daily meeting do time para esclarecimento e planejamento de atividades.',
        en: `- Development of a virtual machine in C/C++ and QT for the own company language (ADVPL).
        - Solution of compilation and execution issues and creation of the software using CMake.
        - Daily meeting with the team for planning of the activities. `,
        fr: `- Développement d’une machine virtuelle en C/C++ et QT
        pour le langage propriétaire de l’entreprise (ADVPL).
        - Résolution de problème de compilation et d’exécution,
        création de projets avec CMake.
        - Réunions quotidiennes en équipe pour la clarification et la
        planification des activités.`,
        it: `- Sviluppo di una macchina virtuale in C/C++ e QT per il
        linguaggio proprio dell'azienda (ADVPL).
        - Risoluzione dei problemi di compilazione ed esecuzione,
        creazione di progetti tramite CMake.
        - Riunione quotidiana del team per chiarimenti e
        pianificazione delle attività.`}},]
    
    return (
      <div className='experiencesContainer'>
        {experiences.map((item, index) => {
          return (<div key={Math.random()} className='experiencesSeparator'><Experience key={index+item.company.ptbr} experienceData={item}></Experience></div>)
        })}
      </div>
    )
  }
}

export default Experiences