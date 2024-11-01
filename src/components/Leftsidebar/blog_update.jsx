import React from "react";

/*to do, the link, blogtitle and img should update from the DB */
function Blog (){
    return(     
        
            <a className="link_admin" href="https://www.ablockofcrypto.com/blog/empowering-users-web3-education-from-within" >
                <div className = "blog_title">Empowering Users: Web3 Education From Within</div>            
                <img src="https://s3.amazonaws.com/contents.newzenler.com/24209/blog/blog-post/26612/data/thumb/l-8.jpg" alt="Blog Icon" className="admin-image"/>
            </a>
                                     
        )
}

export default Blog