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
        ptbr: 'jan de 2021 - mar de 2022 · 1 ano 3 meses',
        en: 'jan 2021 - mar 2022 · 1 year 3 months',
        fr: 'janvier 2021 - mars 2022 - 1 an 3 mois',
        it: 'gennaio 2021 - marzo 2022 · 1 anno 3 mesi'},
      jobTitle: {...base,
        ptbr:'Desenvolvedor de software',
        en: 'Software developer',
        fr: 'Développeur de logiciels',
        it: 'Sviluppatore di software'},
      description: {...base, 
        ptbr: '- Desenvolvimento e manutenção do principal software, um Point of Sale feito em Python e React e esporadicamente usando MySQL.',
        en: '- Development and maintenance of the main company software, a Point of Sale made in Python and React and sporadically using MySQL.',
        fr: '- Développement et maintenance du logiciel principal, un point de vente réalisé en Python et React, avec une utilisation occasionnelle de MySQL.',
        it: '- Sviluppo e manutenzione del software principale, un punto vendita realizzato in Python e React e utilizzo sporadico di MySQL'}},
    {company: {...base, ptbr: 'Itaú'}, 
      timeOnIt: {...base,
        ptbr: 'jan de 2021 - mar de 2022 · 1 year 3 months',
        en: 'september 2019 - november 2020 - 1 to 3 months',
        fr: 'septembre 2019 - novembre 2020 - 1 an 3 mois',
        it: 'settembre 2019 - novembre 2020 1 anno 3 mesi'},
      jobTitle: {...base,
        ptbr:'Desenvolvedor de software',
        en: 'Software developer',
        fr: 'Développeur de logiciels',
        it: 'Sviluppatore di software'},
      description: {...base, 
        ptbr: '- Desenvolvimento e manutenção do principal software, um Point of Sale feito em Python e React e esporadicamente usando MySQL.',
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
        ptbr: 'mai de 2018 - set de 2019 · 1 ano 5 meses',
        en: 'may 2018 - sep 2019 · 1 year 5 months',
        fr: 'mai 2018 - septembre 2019 - 1 an 5 mois',
        it: 'maggio 2018 - settembre 2019 1 anno 5 mesi'},
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
        ptbr: 'jan de 2021 - mar de 2022 · 1 year 3 months',
        en: 'jul 2014 - jun 2015 · 1 year',
        fr: 'juillet 2014 - juin 2015 - 1 an',
        it: 'lug 2014 - giu 2015 1 anno'},
      jobTitle: {...base,
        ptbr:'Desenvolvedor de software',
        en: 'Software developer',
        fr: 'Développeur de logiciels',
        it: 'Sviluppatore di software'},
      description: {...base, 
        ptbr: `- Desenvolvimento de novas funcionalidades em C#/C++ puro no software utilizado para controle da produção de lanches nos restaurantes do Mc Donald's
        - Sustentação do sistema em C++ já existente que faz o controle da cozinha e caixa do Mc Donald's.
        - Controle e planejamento do desenvolvimento utilizando sprints e daily meetings.`,
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
        ptbr: 'jul de 2012 - jul de 2014 · 2 anos 1 mês',
        en: 'jul 2012 - jul 2014 · 2 years 1 month',
        fr: 'juillet 2012 - juillet 2014 - 2 ans 1 mois',
        it: 'lug 2012 - lug 2014 · 2 anni 1 mese'},
      jobTitle: {...base,
        ptbr:'Técnico de pesquisa e desenvolvimento',
        en: 'Technician in R&D',
        fr: 'Technicien en Recherche et Développement',
        it: 'Tecnico di ricerca e sviluppo'},
      description: {...base, 
        ptbr: '- Desenvolvimento e manutenção do principal software, um Point of Sale feito em Python e React e esporadicamente usando MySQL.',
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
          return (<div className='experiencesSeparator'><Experience key={index+item.company.ptbr} experienceData={item}></Experience></div>)
        })}
      </div>
    )
  }
}

export default Experiences