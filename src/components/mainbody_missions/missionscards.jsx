import React from "react";

function Mission_Cards({ item = [] }) {
    return (
        <div className="container_bites">
            {item.map((val) => (
                
                  <div key={val.course_id} className="container_content">
                      <div className="card_content">
                          <div className="front">                
                              <p className="bite-name">{val.name}</p>
                              <img src={val.image_url} alt="course-img" className="course-img"/>
                              <h1 className="points">{val.points}</h1>
                          </div>
                          <div className="back">                
                              <p className="bite-description">{val.description}</p>
                              <img src={val.sponsor_img} alt="sponsor-logo" className="sponsor-logo"/>
                              <a className="bite_link" href={val.link} target="_blank" rel="noreferrer">
                                  <button className="content_status" type="button">Complete</button>
                              </a>
                          </div>
                      </div>   
                  </div>
                
            ))}
        </div>
    );
}

export default Mission_Cards;
