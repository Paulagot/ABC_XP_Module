import React from "react"
import Leftside from '../components/Leftsidebar/Leftside'
import Navbar from '../components/Navbar/navbar'
import { Helmet } from "react-helmet-async";
import Learnfi_main_body from '../components/Lifi_widget/learnfimain'

function LearnFi() {
    return (
    <div>
       <Helmet>
            <title>LearnFi | Explore Web3 Topics</title>
            <meta name="description" content="Swap and Bridge your digital assets" />
            <meta name="keywords" content="Web3, crypto swap, web3 bridge," />
            <meta property="og:title" content="Swap | Bridge" />
            <meta property="og:description" content="Swap and Bridge your digital assets & crypto." />
            <meta property="og:image" content="https://s3.us-east-1.amazonaws.com/contents.newzenler.com/24209/library/66977603877a8_1721202179_greenlogo.png" />
            <meta property="og:url" content="https://app.ablockofcrypto.com/learnfi" />
            <meta name="twitter:card" content="https://s3.us-east-1.amazonaws.com/contents.newzenler.com/24209/library/66977603877a8_1721202179_greenlogo.png" />
        </Helmet>
      <Leftside />
      <Navbar />
         <Learnfi_main_body />
     
    </div>
  )
}
export default LearnFi