import React from 'react';
import colors from '../../Colors';
import { ExperienceData } from '../../Types';
import Experience from './Experience/Experience';

interface P{
}

interface S{
}

class Experiences extends React.Component<P, S>{
  experiences: ExperienceData[] = [
    {company: 'Acrelec', 
    description: 'Desenvolvimento e manutenção do principal software, um Point of Sale feito em Python e React e esporadicamente usando MySQL.', 
    timeOnIt: 'jan de 2021 - mar de 2022 · 1 ano 3 meses',
    jobTitle: 'Desenvolvedor de software'},
    {company: 'Itaú', 
    description: 'Desenvolvimento e sustentação do sistema utilizado pela segurança das agências do banco Itaú em C# MVC, Javascript, HTML com SQL Server em DDD.Desenvolvimento com IE e Chrome Selenium usando máquina finita de estado para substituir trabalho manual.', 
    timeOnIt: 'set de 2019 - nov de 2020 · 1 ano 3 meses',
    jobTitle: 'Desenvolvedor de software'},
    {company: 'Afresp', 
    description: 'Desenvolvimento do sistema em C# Windows Forms e SQL server utilizado internamente para controle de informação de planos de saúde e outros benefícios utilizados pelo Fiscais de Renda associados à associação.', 
    timeOnIt: 'mai de 2018 - set de 2019 · 1 ano 5 meses',
    jobTitle: 'Desenvolvedor de software'},
    {company: 'RDI Software', 
    description: 'Desenvolvimento de novas funcionalidades em C# e C++ puro no software utilizado para controle da produção de lanches nos restaurantes do McDonald\'s.', 
    timeOnIt: 'jul de 2014 - jun de 2015 · 1 ano',
    jobTitle: 'Desenvolvedor de software'},
    {company: 'Totvs', 
    description: 'Desenvolvimento de uma máquina virtual em C/C++ e QT para linguagem própria da empresa (ADVPL). Solução de problemas de compilação e execução, criação de projeto através de CMake.Daily meeting do time para esclarecimento e planejamento de atividades.', 
    timeOnIt: 'jul de 2012 - jul de 2014 · 2 anos 1 mês',
    jobTitle: 'Técnico de Pesquisa e Desenvolvimento'},
  ]
  
  constructor(props: P){
    super(props);
    this.state = {
    }
  }

  render(): React.ReactNode {
    
    return (
      <div style={{backgroundColor: colors.beige, display: 'flex', width: '70%', flexDirection: 'column'}}>
        {this.experiences.map((item) => {
          return <Experience experienceData={item}></Experience>
        })}
      </div>
    )
  }
}

export default Experiences