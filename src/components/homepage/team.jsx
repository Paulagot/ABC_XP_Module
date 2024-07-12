import React from "react";
import Teamcard from "./teamcard";

 // Define team data as these wont change much we hope.
 const TeamData = [
    { key:"1", name: "Paula Guilfoyle", title: "CEO", team_image: "src/assets/paula.jpg", linkedin:"https://www.linkedin.com/in/paulaguilfoyle/"},
    { key:"2",name: "Simon Dyer", title: "CCO", team_image: "src/assets/simon.jpg", linkedin:""},
    { key:"3",name: "Smriti Verma", title: "CTO", team_image: "https://media.licdn.com/dms/image/D4E03AQExwIlk-g2hMg/profile-displayphoto-shrink_400_400/0/1712445308971?e=1724889600&v=beta&t=YUPrFUvHow0s5WDmCXPGy3Ck4at_2y6KoDhgHHykNp8", linkedin:"https://www.linkedin.com/in/smritinverma/"}    
];

function createTeamMember(TeamData){
    return (
      <Teamcard 
      key = {TeamData.key}
      name ={TeamData.name}
      title ={TeamData.title}
      img ={TeamData.team_image}
      linkedin={TeamData.linkedin}
      />
    );}

function Team (){
    return (
    <div className="team-container" id="team">
        <h3 className="team-text-header">Team</h3>       
        <div className="team-members-container">           
          {TeamData.map(createTeamMember)}
           
        </div>
    </div>)
}

export default Team