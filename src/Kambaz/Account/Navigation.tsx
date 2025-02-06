import { Link } from "react-router-dom"
export default function AccountNavigation() {
    return(
        <div id="wd-account-navigation" className="wd list-group fs-5">
            <Link to={`/Kambaz/Account/Signin`}
                className="text-dark text-decoration-none d-block mb-2 border-start border-3 ps-2">
                Signin 
            </Link><br/>
            <Link to={`/Kambaz/Account/Signup`}
                className="text-danger text-decoration-none d-block mb-2"> 
                Signup 
            </Link><br/>
            <Link to={`/Kambaz/Account/Profile`}
                className="text-danger text-decoration-none d-block mb-2">
                Profile 
            </Link><br/>
        </div>
    );
}