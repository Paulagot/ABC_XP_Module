import React from "react";
import Header from "./header";
import Hero from "./hero";
import Features from "./features";
import Partners from "./partners";
import Team from "./team"
import Footer from "./footer"

function Home (){
    return(
        <div>
            <Header /> 
            <div className="main">
                <Hero />
                <Features />
                <Partners />
                <Team />  
                <Footer />
            </div>
         </div>
)}

export default Home