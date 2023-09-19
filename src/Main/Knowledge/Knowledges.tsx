import React from 'react';
import colors from '../../Colors';
import Knowledge from './Knowledge/Knowledge';
import './Knowledges.css'

interface P{
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
    
    return (
      <div style={{backgroundColor: colors.cvBlue, display: 'flex', width: '30%', flexDirection: 'column', padding: '1%'}}>
        <h1 style={{textAlign: 'center'}}>Kaique Gomes</h1>
        <div style={{margin: '2px'}}> Desenvolvedor de software com 11 anos de experiência.</div>
        <div style={{margin: '2px'}}>Português: Nativo</div>
        <div style={{margin: '2px'}}>Inglês:  Fluente</div>
        <div style={{margin: '2px'}}>Francês: Intermediário</div>
        <h3>Conhecimento</h3>
        <Knowledge text={'C#.NET | Net Core'} level={4}></Knowledge>
        <Knowledge text={'ReactJS'} level={3}></Knowledge>
        <Knowledge text={'React Native'} level={2}></Knowledge>
        <Knowledge text={'Javascript | Typescript'} level={3}></Knowledge>
        <Knowledge text={'HTML | CSS'} level={4}></Knowledge>
        <Knowledge text={'SQL Server | MySQL'} level={3}></Knowledge>
        <Knowledge text={'MongoDB'} level={3}></Knowledge>
        <Knowledge text={'Python'} level={2}></Knowledge>
        <Knowledge text={'C/C++'} level={2}></Knowledge>
        <h3>Cloud</h3>
        <Knowledge text={'Docker'} level={4}></Knowledge>
        <Knowledge text={'Kubernetes'} level={3}></Knowledge>
        <Knowledge text={'Linux/Ubuntu'} level={2}></Knowledge>
        <Knowledge text={'AWS Services'} level={1}></Knowledge>
        <Knowledge text={'Terraform'} level={2}></Knowledge>
        <Knowledge text={'Jenkins'} level={1}></Knowledge>
        <Knowledge text={'Ansible'} level={1}></Knowledge>
        <h3>Outros</h3>
        <Knowledge text={'NodeJs'} level={2}></Knowledge>
        <Knowledge text={'Angular'} level={1}></Knowledge>
        <Knowledge text={'Unity Engine (C#)'} level={2}></Knowledge>
        <h3>Experiências gerais da área de TI:</h3>
        GIT, FTS, SVN, CSV
        Visual Studio, VS Code, Microsoft SQL Server Management Studio
        Entity Framework, Linq, Windows Form
        MVC, DDD, TDD
        Ágil, Scrum, Kanban
        <h3>Conhecimento por hobby:</h3>
        Unity(Game Engine), Blender, Fireworks
      </div>
    )
  }
}

export default Knowledges