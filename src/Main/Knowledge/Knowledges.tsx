import React from 'react';
import colors from '../../Colors';
import { Language } from '../../Types';
import Knowledge from './Knowledge/Knowledge';
import './Knowledges.css'
import T from '../../Text/T';

interface P{
  lang: Language,
}

interface S{
}

class Knowledges extends React.Component<P, S>{
  constructor(props: P){
    super(props);
    this.state = {
    }
  }

  render(): React.ReactNode {
    const { lang } = this.props;

    let base = { current: lang };
    
    return (
      <div style={{backgroundColor: colors.cvBlue, display: 'flex', width: '30%', flexDirection: 'column', padding: '1%'}}>
        <h1 style={{textAlign: 'center'}}>Kaique Gomes</h1>
        <T style={{margin: '2px'}} text={{current: lang, ptbr: 'Desenvolvedor de software com 11 anos de experiência.', en: 'Software developer with 11 years of experience.', fr:'Développeur de logiciels avec 11 ans d\'expérience.', it: 'Sviluppatore software con 11 anni di esperienza.'}}></T>
        <T style={{margin: '2px'}} text={{current: lang, ptbr: 'Português: Nativo', en: 'Portuguese: Native', fr: 'Portugais: Natif', it: 'Portoghese: Madrelingua'}}></T>
        <T style={{margin: '2px'}} text={{current: lang, ptbr: 'Inglês:  Fluente', en:'English: Fluent', fr: 'Anglais: Fluent', it: 'Inglese: Fluente'}}></T>
        <T style={{margin: '2px'}} text={{current: lang, ptbr: 'Francês: Intermediário', en: 'French: Intermediate', fr: 'Français: Intermédiaire', it: 'Francese: Intermedio'}}></T>
        <T className='header3' text={{current: lang, ptbr: 'Conhecimento', en: 'Knowledge', fr: 'Connaissances', it: 'Conoscenza'}}></T>
        <Knowledge text={{...base, ptbr: 'C#.NET | Net Core'}} level={4}></Knowledge>
        <Knowledge text={{...base, ptbr: 'ReactJS'}} level={3}></Knowledge>
        <Knowledge text={{...base, ptbr: 'React Native'}} level={2}></Knowledge>
        <Knowledge text={{...base, ptbr: 'Javascript | Typescript'}} level={3}></Knowledge>
        <Knowledge text={{...base, ptbr: 'HTML | CSS'}} level={4}></Knowledge>
        <Knowledge text={{...base, ptbr: 'SQL Server | MySQL'}} level={3}></Knowledge>
        <Knowledge text={{...base, ptbr: 'MongoDB'}} level={3}></Knowledge>
        <Knowledge text={{...base, ptbr: 'Python'}} level={2}></Knowledge>
        <Knowledge text={{...base, ptbr: 'C/C++'}} level={2}></Knowledge>
        <T className='header3' text={{current: lang, ptbr: 'Cloud'}}></T>
        <Knowledge text={{...base, ptbr: 'Docker'}} level={4}></Knowledge>
        <Knowledge text={{...base, ptbr: 'Kubernetes'}} level={3}></Knowledge>
        <Knowledge text={{...base, ptbr: 'Linux/Ubuntu'}} level={2}></Knowledge>
        <Knowledge text={{...base, ptbr: 'AWS Services'}} level={1}></Knowledge>
        <Knowledge text={{...base, ptbr: 'Terraform'}} level={2}></Knowledge>
        <Knowledge text={{...base, ptbr: 'Jenkins'}} level={1}></Knowledge>
        <Knowledge text={{...base, ptbr: 'Ansible'}} level={1}></Knowledge>
        <T className='header3' text={{current: lang, ptbr: 'Outros', en: 'Others', fr: 'Autres', it: 'Altri'}}></T>
        <Knowledge text={{...base, ptbr: 'NodeJs'}} level={2}></Knowledge>
        <Knowledge text={{...base, ptbr: 'Angular'}} level={1}></Knowledge>
        <Knowledge text={{...base, ptbr: 'Unity Engine (C#)'}} level={2}></Knowledge>
        <T className='header3' text={{current: lang, ptbr: 'Experiências gerais da área de TI:', en: 'General IT Experience:', fr: 'Expérience générale en IT:', it: 'Esperienza generale in IT:'}}></T>
        <T className='basicText' text={{...base, ptbr: `GIT, FTS, SVN, CSV
        Visual Studio, VS Code, Microsoft SQL Server Management Studio
        Entity Framework, Linq, Windows Form
        MVC, DDD, TDD
        Ágil, Scrum, Kanban`}}></T>
        
        <T className='header3' text={{current: lang, ptbr: 'Conhecimento por hobby:', en: 'Hobby knowledge:', fr: 'Connaissances par passion :', it: 'Conoscenze per hobby'}}></T>
        <T className='basicText' text={{...base, ptbr: 'Unity(Game Engine), Blender, Fireworks'}}></T>
        {/* <T className='' text={{...base, ptbr: 'Jogo desenvolvido e publicado:', en: 'Game developed and published:', fr: 'Jeu développé et publié :', it: 'Gioco sviluppato e pubblicato:'}}></T>
        https://play.google.com/store/apps/details?id=com.Kaiqueqgdev.WorldDefence */}
      </div>
    )
  }
}

export default Knowledges